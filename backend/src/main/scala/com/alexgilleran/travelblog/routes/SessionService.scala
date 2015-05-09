package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.{BlogRow, EntryRow}
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import spray.http.HttpCookie
import spray.http.MediaTypes._
import spray.json.DefaultJsonProtocol
import spray.routing.HttpService
import scala.util.Properties


/**
 * Created by Alex on 2015-05-09.
 */
trait SessionService extends HttpService {

  val loginRoutes =
    path("login") {
      post {
        createSession() { session: Session =>
          complete {
            session.id
          }
        }
      }
    }
}
