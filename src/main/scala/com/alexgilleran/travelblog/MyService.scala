package com.alexgilleran.travelblog

import akka.actor.Actor
import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.EntryRow
import spray.http.MediaTypes._
import spray.http._
import spray.routing._
import Tables.profile.simple._
import spray.json._
import DefaultJsonProtocol._ // if you don't supply your own Protocol (see below)


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

object JsonImplicits extends DefaultJsonProtocol {
  implicit val impEntry = jsonFormat2(EntryRow)
}

// this trait defines our service behavior independently from the service actor
trait MyService extends HttpService {

  import spray.httpx.SprayJsonSupport.sprayJsonMarshaller
  import spray.httpx.SprayJsonSupport.sprayJsonUnmarshaller
  import JsonImplicits._

  val thing: TableQuery[Tables.Entry] = Tables.Entry
  val db = Database.forURL("jdbc:postgresql:TravelBlog?user=postgres&password=p4ssw0rd", driver = "org.postgresql.Driver")


  val myRoute =
    pathPrefix("entry" / LongNumber) { id: Long =>
      pathEnd {
        get {
          respondWithMediaType(`application/json`) {
            complete {
              db.withSession { implicit session =>
                Tables.Entry.filter(_.id === id).firstOption
              }
            }
          }
        }
      }
    }
}