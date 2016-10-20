package com.alexgilleran.travelblog.graphql

import akka.actor.ActorSystem
import akka.http.scaladsl.Http
import akka.http.scaladsl.server.Directives._
import akka.http.scaladsl.model.StatusCodes._
import akka.http.scaladsl.server._
import akka.stream.ActorMaterializer

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._

import sangria.parser.QueryParser
import sangria.execution.{ ErrorWithResolver, QueryAnalysisError, Executor }
import sangria.marshalling.sprayJson._

import scala.concurrent.ExecutionContext.Implicits.global
import spray.json._

import scala.util.{ Success, Failure }
import scala.concurrent.Future
import akka.http.scaladsl.model.headers.HttpCookie

trait GraphQLEndpoint {
  val graphQLRoutes: Route =
    path("graphql") {
      post {
        entity(as[JsValue]) { requestJson ⇒
          val JsObject(fields) = requestJson

          val JsString(query) = fields("query")

          val operation = fields.get("operationName") collect {
            case JsString(op) ⇒ op
          }

          val vars = fields.get("variables") match {
            case Some(obj: JsObject)                  ⇒ obj
            case Some(JsString(s)) if s.trim.nonEmpty ⇒ s.parseJson
            case _                                    ⇒ JsObject.empty
          }

          val blogRepo = new BlogRepo

          QueryParser.parse(query) match {

            // query parsed successfully, time to execute it!
            case Success(queryAst) ⇒
              onComplete(
                Executor.execute(SchemaDefinition.schema, queryAst, SecureContext(blogRepo),
                  variables = vars,
                  operationName = operation,
                  deferredResolver = new BlogResolver)) {
                  case Success(value) =>
                    complete(value)
                  case Failure(ex) => ex match {
                    case error: QueryAnalysisError ⇒ complete(BadRequest → error.resolveError)
                    case error: ErrorWithResolver  ⇒ complete(InternalServerError → error.resolveError)
                  }
                }
            // can't parse GraphQL query, return error
            case Failure(error) ⇒
              complete(BadRequest, JsObject("error" -> JsString(error.getMessage)))
          }
        }
      } ~
        get {
          getFromResource("graphiql.html")
        }
    }
}