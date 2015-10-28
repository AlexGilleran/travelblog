package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.data.schema.Tables.{User, Blog, Entry}
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import spray.http.StatusCodes.{ClientError, CustomStatusCode}
import spray.http.{StatusCodes, StatusCode, HttpCookie}
import spray.http.MediaTypes._
import spray.json._
import spray.routing.HttpService

import scala.None
import scala.util.Properties


case class ApiBlog(details: Blog, entries: Seq[Entry])

case class ApiEntry(entry: Entry, blog: Blog)

object BlogJsonImplicits extends DefaultJsonProtocol {
  implicit val blogFormat = jsonFormat4(Blog)
  implicit val entry = jsonFormat4(Entry)
  implicit val apiBlog = jsonFormat2(ApiBlog)
  implicit val apiEntry = jsonFormat2(ApiEntry)
}

// this trait defines our service behavior independently from the service actor
trait BlogService extends HttpService {

  import spray.httpx.SprayJsonSupport.sprayJsonMarshaller
  import spray.httpx.SprayJsonSupport.sprayJsonUnmarshaller
  import BlogJsonImplicits._

  private val dao: GeneralDAO = PostGresSlickDAO

  val blogRoutes =
    pathPrefix("blogs") {
      get {
        path(LongNumber) { id: Long =>
          complete {
            val blog: Blog = dao.getBlog(id)
            val entries: Seq[Entry] = dao.getEntriesForBlog(id, 5)
            new ApiBlog(blog, entries)
          }
        } ~ complete {
          dao.getBlogs(20)
        }
      } ~ put {
        withSession() { session: Session =>
          entity(as[Map[String, String]]) { map: Map[String, String] =>
            val blog: Blog = new Blog(
              name = map.get("name").get,
              description = map.get("description"),
              userId = session.user.userId.get
            )

            val id: Long = dao.insertBlog(blog)

            complete(StatusCodes.Created, blog.copy(blogId = Some(id)))
          }
        }
      } ~ post {
        withSession() { session: Session =>
          path(LongNumber) { id: Long =>
            val existing: Blog = dao.getBlog(id)

            if (existing.userId == session.user.userId.get) {
              entity(as[Map[String, String]]) { map: Map[String, String] =>
                dao.updateBlog(id, existing.copy(
                  name = map.get("name").get,
                  description = map.get("description")
                ))
                complete(StatusCodes.NoContent)
              }
            } else {
              complete(StatusCodes.Forbidden)
            }
          }
        }
      }
    } ~ pathPrefix("entries") {
      path(LongNumber) { id: Long =>
        get {
          respondWithMediaType(`application/json`) {
            complete {
              val entryTuple = dao.getEntry(id)
              new ApiEntry(entryTuple._1, entryTuple._2)
            }
          }
        } ~ post {
          withSession() { session: Session =>
            if (dao.getEntry(id)._2.userId == session.user.userId.get) {
              entity(as[Entry]) { entry: Entry =>
                dao.updateEntry(id, entry)
                complete(StatusCodes.NoContent)
              }
            } else {
              complete(StatusCodes.Forbidden)
            }
          }
        }
      }
    }
}
