package com.alexgilleran.travelblog

import akka.actor.{ Actor, ActorSystem, Props }
import akka.http.scaladsl.Http
import akka.io.IO
import akka.pattern.ask
import akka.util.Timeout
import com.alexgilleran.travelblog.config.Config
import com.alexgilleran.travelblog.data.{ GeneralDAO, PostGresSlickDAO }
import com.alexgilleran.travelblog.routes.{ BlogService, UserService }

import scala.concurrent.duration._
import akka.http.scaladsl.server.ExceptionHandler
import akka.stream.ActorMaterializer
import akka.http.scaladsl.server.Route._
import akka.http.scaladsl.server.RouteConcatenation
import com.alexgilleran.travelblog.graphql.GraphQLEndpoint
import akka.http.scaladsl.model.StatusCodes._

import akka.event.Logging
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.server.ExceptionHandler
import akka.http.scaladsl.model.HttpResponse

object Boot extends App with UserService with BlogService with GraphQLEndpoint {

  val dao: GeneralDAO = PostGresSlickDAO

  // we need an ActorSystem to host our application in
  implicit val config = Config.conf
  implicit val system = ActorSystem("on-spray-can")
  implicit val executor = system.dispatcher
  implicit val materializer = ActorMaterializer()

  val logger = Logging(system, getClass)

  val myExceptionHandler = ExceptionHandler {
    case e: Exception => {
      logger.error(e, "Exception encountered")

      complete(HttpResponse(InternalServerError, entity = "You are probably seeing this message because Alex messed up"))

    }
  }
  val routes = handleExceptions(myExceptionHandler) {
    logRequestResult("travelblog") {
      pathPrefix("api") {
        RouteConcatenation.concat(userRoutes, blogRoutes, graphQLRoutes)
      }
    }
  }

  // start a new HTTP server on port 8080 with our service actor as the handler
  Http().bindAndHandle(routes, "0.0.0.0", Config.app.getInt("listenPort"))
}

