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

object Boot extends App with UserService with BlogService {
  val dao: GeneralDAO = PostGresSlickDAO

  // we need an ActorSystem to host our application in
  implicit val system = ActorSystem("on-spray-can", Config.conf)
  implicit val executor = system.dispatcher
  implicit val materializer = ActorMaterializer()

  val routes = RouteConcatenation.concat(userRoutes, blogRoutes)

  // start a new HTTP server on port 8080 with our service actor as the handler
  Http().bindAndHandle(routes, "0.0.0.0", Config.app.getInt("listenPort"))
}

