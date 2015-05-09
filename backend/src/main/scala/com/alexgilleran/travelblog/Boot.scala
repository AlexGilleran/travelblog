package com.alexgilleran.travelblog

import akka.actor.{Actor, ActorSystem, Props}
import akka.io.IO
import akka.pattern.ask
import akka.util.Timeout
import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.routes.{UserService, BlogService}
import spray.can.Http
import spray.routing.ExceptionHandler
import spray.util.LoggingContext
import spray.http.StatusCodes._
import spray.routing._

import scala.concurrent.duration._
import scala.util.Properties

object Boot extends App {

  // we need an ActorSystem to host our application in
  implicit val system = ActorSystem("on-spray-can")

  // create and start our service actor
  val service = system.actorOf(Props[ServiceActor], "demo-service")

  implicit val timeout = Timeout(5.seconds)

  // start a new HTTP server on port 8080 with our service actor as the handler
  IO(Http) ? Http.Bind(service, interface = "0.0.0.0", port = Properties.envOrElse("PORT", "8080").toInt)
}

// we don't implement our route structure directly in the service actor because
// we want to be able to test it independently, without having to spin up an actor
class ServiceActor extends Actor with BlogService with UserService {
  val dao: GeneralDAO = PostGresSlickDAO

  // the HttpService trait defines only one abstract member, which
  // connects the services environment to the enclosing actor or test
  def actorRefFactory = context

  // this actor only runs our route, but you could add
  // other things here, like request stream processing
  // or timeout handling
  def receive = runRoute(blogRoutes ~ userRoutes)

  implicit def myExceptionHandler(implicit log: LoggingContext) =
    ExceptionHandler {
      case e: Exception =>
        requestUri { uri =>
          log.error(e, "Request for {} failed", uri)
          complete(InternalServerError, "Guru Meditation Error")
        }
    }
}

