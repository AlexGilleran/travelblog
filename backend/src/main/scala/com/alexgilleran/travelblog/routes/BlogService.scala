package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.data.schema.Tables.{Blog, Entry}
import spray.http.HttpCookie
import spray.http.MediaTypes._
import spray.json.DefaultJsonProtocol
import spray.routing.HttpService

import scala.util.Properties


case class ApiBlog(details: Blog, entries: Seq[Entry])

object BlogJsonImplicits extends DefaultJsonProtocol {
  implicit val entry = jsonFormat4(Entry)
  implicit val blog = jsonFormat4(Blog)
  implicit val apiBlog = jsonFormat2(ApiBlog)
}

// this trait defines our service behavior independently from the service actor
trait BlogService extends HttpService {

  import spray.httpx.SprayJsonSupport.sprayJsonMarshaller
  import spray.httpx.SprayJsonSupport.sprayJsonUnmarshaller
  import BlogJsonImplicits._
  import com.alexgilleran.travelblog.data.schema.Tables.{Blog, Entry}

  private val dao: GeneralDAO = PostGresSlickDAO

  val blogRoutes =
    pathPrefix("blogs") {
      get {
        path(LongNumber) { id: Long =>
          respondWithMediaType(`application/json`) {
            complete {
              val blog: Blog = dao.getBlog(id)
              val entries: Seq[Entry] = dao.getEntriesForBlog(id, 5)
              new ApiBlog(blog, entries)
            }
          }
        } ~ respondWithMediaType(`application/json`) {
          complete {
            dao.getBlogs(20)
          }
        }
      }
    } ~ pathPrefix("entries") {
      get {
        path(LongNumber) { id: Long =>
          respondWithMediaType(`application/json`) {
            complete {
              dao.getEntry(id)
            }
          }
        }
      }
    }
}
