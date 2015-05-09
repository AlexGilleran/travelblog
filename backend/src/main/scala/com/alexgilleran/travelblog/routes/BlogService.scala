package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.profile.simple._
import com.alexgilleran.travelblog.data.schema.Tables.{BlogRow, EntryRow}
import spray.http.HttpCookie
import spray.http.MediaTypes._
import spray.json.DefaultJsonProtocol
import spray.routing.HttpService

import scala.util.Properties

case class ApiBlog(details: BlogRow, entries: Seq[EntryRow])

object JsonImplicits extends DefaultJsonProtocol {
  implicit val entry = jsonFormat4(EntryRow)
  implicit val blog = jsonFormat3(BlogRow)
  implicit val apiBlog = jsonFormat2(ApiBlog)
}

// this trait defines our service behavior independently from the service actor
trait BlogService extends HttpService {
  import spray.httpx.SprayJsonSupport.sprayJsonMarshaller
  import spray.httpx.SprayJsonSupport.sprayJsonUnmarshaller
  import JsonImplicits._

  val db = Database.forURL(Properties.envOrElse("DATABASE_URL", "fail"), driver = "org.postgresql.Driver")

  val blogRoutes =
    pathPrefix("blogs") {
      get {
        path(LongNumber) { id: Long =>
          respondWithMediaType(`application/json`) {
            complete {
              db.withSession { implicit session =>
                val implicitInnerJoin = for {
                  b <- Tables.Blog if b.blogId === id
                  e <- Tables.Entry if e.blogId === b.blogId
                } yield (b, e)

                val blog: BlogRow = Tables.Blog.filter(_.blogId === id).first
                val entries: Seq[EntryRow] = Tables.Entry.filter(_.blogId === id).list

                new ApiBlog(blog, entries);
              }
            }
          }
        } ~ respondWithMediaType(`application/json`) {
          complete {
            db.withSession { implicit session =>
              Tables.Blog.list
            }
          }
        }
      } ~ pathPrefix("entries") {
        path(LongNumber) { id: Long =>
          respondWithMediaType(`application/json`) {
            complete {
              db.withSession { implicit session =>
                Tables.Entry.filter(_.entryId === id).first
              }
            }
          }
        }
      }
    }
}

