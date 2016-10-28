package com.alexgilleran.travelblog.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import scala.concurrent.ExecutionContext.Implicits.global
import akka.http.scaladsl.model.StatusCodes
import com.alexgilleran.travelblog.data.schema.Tables.{ Blog, Entry }
import com.alexgilleran.travelblog.data.{ GeneralDAO, PostGresSlickDAO }
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import spray.json.DefaultJsonProtocol._
import spray.json._
import akka.http.scaladsl.server.Route
import scala.concurrent.Future
import akka.http.scaladsl.model.HttpResponse
import akka.http.scaladsl.server.RouteResult
import akka.http.scaladsl.server.RequestContext

case class ApiBlog(details: Blog, entries: Seq[Entry])

case class ApiEntry(entry: Entry, blog: Blog)

trait BlogJsonImplicits {
  implicit val blogJson = jsonFormat4(Blog)
  implicit val entryJson = jsonFormat4(Entry)
  implicit val apiBlogJson = jsonFormat2(ApiBlog)
  implicit val apiEntryJson = jsonFormat2(ApiEntry)
}

// this trait defines our service behavior independently from the service actor
trait BlogService extends BlogJsonImplicits {

  private val dao: GeneralDAO = PostGresSlickDAO

  val blogRoutes: Route =
    pathPrefix("blogs") {
      get {
        path(LongNumber) { id: Long =>
          val agg: Future[(Option[Blog], Seq[Entry])] = for {
            blog <- dao.getBlog(id)
            entries <- dao.getEntriesForBlog(id, 5)
          } yield (blog: Option[Blog], entries: Seq[Entry])

          onSuccess(agg) { (blog: Option[Blog], entries: Seq[Entry]) =>
            blog match {
              case Some(blog: Blog) => complete(new ApiBlog(blog, entries))
              case None             => complete(StatusCodes.NotFound)
            }
          }
        } ~
          complete {
            dao.getBlogs(20)
          }
      } ~ put {
        withSession() { session: Session =>
          entity(as[Map[String, String]]) { map =>
            val blog: Blog = new Blog(
              name = map.get("name").get,
              description = map.get("description"),
              userId = session.userId.get)

            onSuccess(dao.insertBlog(blog)) { id =>
              complete(StatusCodes.Created, blog.copy(blogId = Some(id)))
            }
          }
        }
      } ~ post {
        withSession() { session =>
          path(LongNumber) { id: Long =>
            onSuccess(dao.getBlog(id)) { blogOption: Option[Blog] =>
              blogOption match {
                case Some(existing) => {
                  if (existing.userId == session.userId.get) {
                    entity(as[Map[String, String]]) { map: Map[String, String] =>
                      onSuccess(dao.updateBlog(id, existing.copy(
                        name = map.get("name").get,
                        description = map.get("description")))) { rowCount =>
                        complete(StatusCodes.NoContent)
                      }
                    }

                  } else {
                    complete(StatusCodes.Forbidden)
                  }
                }
                case None => complete(StatusCodes.NotFound)
              }
            }
          }
        }
      }
    } ~ pathPrefix("entries") {
      path(LongNumber) { id: Long =>
        get {
          onSuccess(dao.getEntryWithBlog(id)) { result: Option[(Entry, Blog)] =>
            result match {
              case Some((entry: Entry, blog: Blog)) => complete(new ApiEntry(entry, blog))
              case None                             => complete(StatusCodes.NotFound)
            }

          }
        } ~ post {
          withSession() { session =>
            entity(as[Entry]) { entry: Entry =>
              onSuccess(dao.getEntryWithBlog(id)) { result: Option[(Entry, Blog)] =>
                result match {
                  case Some((entry: Entry, blog: Blog)) => {
                    if (blog.userId == session.userId.get) {
                      onSuccess(dao.updateEntry(id, entry)) { rowCount =>
                        complete(StatusCodes.NoContent)
                      }
                    } else {
                      complete(StatusCodes.Forbidden)
                    }
                  }
                  case None => complete(StatusCodes.NotFound)
                }
              }
            }
          }
        }
      }
    }
}
