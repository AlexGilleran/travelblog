package com.alexgilleran.travelblog

import scala.concurrent.ExecutionContext.Implicits.global

import slick.driver.PostgresDriver
import scala.concurrent.Await
import scala.concurrent.duration._

/**
 * Created by Alex on 2015-04-04.
 */
object CustomSourceGenerator {
  def main(args: Array[String]): Unit = {
    val slickDriver = args(0)
    val url = args(1)
    val outputDir = args(2)
    val packageName = args(3)

    val db = PostgresDriver.api.Database.forURL(url)

    Await.ready(
      db.run {
        PostgresDriver.defaultTables.flatMap(
          PostgresDriver.createModelBuilder(_, false).buildModel)
      }.map { model =>
        new slick.codegen.SourceCodeGenerator(model) {
          override def Table = new Table(_) {
            override def autoIncLastAsOption = true
          }

          override def entityName = dbTableName => dbTableName match {
            case _ => {
              val entityName: String = super.entityName(dbTableName)
              entityName.substring(0, entityName.length - 3)
            }
          }

          override def tableName = dbTableName => dbTableName match {
            case _ => super.tableName(dbTableName) + "Table"
          }
        }
      }.map(_.writeToFile(
        slickDriver,
        outputDir,
        packageName,
        "Tables",
        "Tables.scala")),
      20.seconds)
  }

}