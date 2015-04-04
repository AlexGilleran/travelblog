package com.alexgilleran.travelblog

import com.typesafe.config.Config
import scala.slick.model.Model
import scala.slick.jdbc.meta.createModel
import scala.slick.driver.H2Driver
import Config._
import scala.slick.codegen.SourceCodeGenerator
import scala.slick.driver.PostgresDriver
import scala.slick.{model => m}
/**
 * Created by Alex on 2015-04-04.
 */
object CustomSourceGenerator {
  def main(args: Array[String]) = {
    val url = args(2)

    val db = PostgresDriver.simple.Database.forURL(url)
    val model = db.withSession{ implicit session =>
      val tables = PostgresDriver.defaultTables
      PostgresDriver.createModel( Some(tables) )
    }
    val codegen = new scala.slick.codegen.SourceCodeGenerator(model) {
      override def Table = new Table(_) {
        override def autoIncLastAsOption = true
      }
    }

    codegen.writeToFile(
      args(0),
      args(3),
      args(4)
    )
  }


}