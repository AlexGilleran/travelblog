package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global
import sangria.execution.Executor
import sangria.introspection._
import scala.concurrent.Await
import scala.concurrent.duration._
import scala.util.{ Failure, Success }
import java.io.PrintWriter
import spray.json._
import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import java.io.BufferedWriter
import java.io.FileWriter
import sangria.marshalling.sprayJson._
import akka.http.scaladsl.model.StatusCodes._

object GenerateSchema {
  def main(args: Array[String]) {
    val futureOfSchemaJson = Executor.execute(SchemaDefinition.schema, introspectionQuery, new BlogRepo, deferredResolver = new BlogResolver)

    futureOfSchemaJson onComplete {
      case Success(t: JsValue) => {
        implicit val w = new BufferedWriter(new FileWriter("schema.json"))
        w.write(t.prettyPrint)
        w.close
      }
      case Failure(t) => println("Could not generate schema.json : " + t.getMessage)
    }
  }
}