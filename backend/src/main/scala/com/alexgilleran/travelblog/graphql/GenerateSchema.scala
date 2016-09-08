package com.alexgilleran.travelblog.graphql

import java.io.BufferedWriter
import java.io.File
import java.io.FileWriter

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.Failure
import scala.util.Success

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport._
import akka.http.scaladsl.model.StatusCodes._
import sangria.execution.Executor
import sangria.introspection._
import sangria.marshalling.sprayJson._
import spray.json._
import scala.reflect.io.Directory

object GenerateSchema {
  def main(args: Array[String]) {
    val futureOfSchemaJson = Executor.execute(SchemaDefinition.schema, introspectionQuery, new BlogRepo, deferredResolver = new BlogResolver)

    futureOfSchemaJson onComplete {
      case Success(t: JsValue) => {
        val file = new File("target/graphql/schema.json")
        file.getParentFile.mkdirs()
        val w = new BufferedWriter(new FileWriter(file))
        w.write(t.prettyPrint)
        w.close
      }
      case Failure(t) => println("Could not generate schema.json : " + t.getMessage)
    }
  }
}