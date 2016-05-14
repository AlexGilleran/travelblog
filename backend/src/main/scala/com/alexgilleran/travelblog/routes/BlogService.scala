package com.alexgilleran.travelblog.routes

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
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

  val blogRoutes : Route =
    pathPrefix("blogs") {
      get {
        path(LongNumber) { id: Long =>
          complete {
            val blog: Blog = dao.getBlog(id)
            val entries: Seq[Entry] = dao.getEntriesForBlog(id, 5)
            new ApiBlog(blog, entries)
          }
        } ~
        complete {
          dao.getBlogs(20)
        } 
      } ~ put {
        withSession() { session: Option[Session] =>
          session match {
            case Some(session) => {
              entity(as[Map[String, String]]) { map =>
                val blog: Blog = new Blog(
                  name = map.get("name").get,
                  description = map.get("description"),
                  userId = session.user.userId.get)

                val id: Long = dao.insertBlog(blog)

                complete((StatusCodes.Created, blog.copy(blogId = Some(id))))
              }
            }
            case None =>
              complete(StatusCodes.Forbidden)
          }
        }
      } ~ post {
        withSession() { session: Option[Session] =>
          session match {
            case Some(session) =>
              path(LongNumber) { id: Long =>
                val existing: Blog = dao.getBlog(id)

                if (existing.userId == session.user.userId.get) {
                  entity(as[Map[String, String]]) { map: Map[String, String] =>
                    dao.updateBlog(id, existing.copy(
                      name = map.get("name").get,
                      description = map.get("description")))
                    complete(StatusCodes.NoContent)
                  }
                } else {
                  complete(StatusCodes.Forbidden)
                }
              }
            case None =>
              complete(StatusCodes.Forbidden)
          }
        }
      }
    } ~ pathPrefix("entries") {
      path(LongNumber) { id: Long =>
        get {
          complete {
            val entryTuple = dao.getEntry(id)
            new ApiEntry(entryTuple._1, entryTuple._2)
          }
        } ~ post {
          withSession() { session: Option[Session] =>
            session match {
              case Some(session) => {
                if (dao.getEntry(id)._2.userId == session.user.userId.get) {
                  entity(as[Entry]) { entry: Entry =>
                    dao.updateEntry(id, entry)
                    complete(StatusCodes.NoContent)
                  }
                } else {
                  complete(StatusCodes.Forbidden)
                }
              }
              case None =>
                complete(StatusCodes.Forbidden)
            }
          }
        }
      }
    }
}
