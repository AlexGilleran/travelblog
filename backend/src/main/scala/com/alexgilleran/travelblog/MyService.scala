package com.alexgilleran.travelblog

import akka.actor.Actor
import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.{BlogRow, EntryRow}
import spray.http.MediaTypes._
import spray.http._
import spray.routing._
import Tables.profile.simple._
import spray.json._
import DefaultJsonProtocol._
import scala.util.Properties

import scala.slick.lifted.TableQuery

// if you don't supply your own Protocol (see below)


// we don't implement our route structure directly in the service actor because
// we want to be able to test it independently, without having to spin up an actor
class MyServiceActor extends Actor with MyService {

  // the HttpService trait defines only one abstract member, which
  // connects the services environment to the enclosing actor or test
  def actorRefFactory = context

  // this actor only runs our route, but you could add
  // other things here, like request stream processing
  // or timeout handling
  def receive = runRoute(myRoute)
}

case class ApiBlog(details: BlogRow, entries: Seq[EntryRow])

object JsonImplicits extends DefaultJsonProtocol {
  implicit val entry = jsonFormat4(EntryRow)
  implicit val blog = jsonFormat3(BlogRow)
  implicit val apiBlog = jsonFormat2(ApiBlog)
}

// this trait defines our service behavior independently from the service actor
trait MyService extends HttpService {

  import spray.httpx.SprayJsonSupport.sprayJsonMarshaller
  import spray.httpx.SprayJsonSupport.sprayJsonUnmarshaller
  import JsonImplicits._

  val db = Database.forURL(Properties.envOrElse("DATABASE_URL", "fail"), driver = "org.postgresql.Driver")

  val myRoute =
    get {
      pathPrefix("blogs") {
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
      }
    }
}