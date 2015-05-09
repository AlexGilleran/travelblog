package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import spray.http.HttpCookie
import spray.http.MediaTypes._
import spray.httpx.SprayJsonSupport
import spray.json.DefaultJsonProtocol
import spray.routing.HttpService
import scala.util.Properties



case class LoginDetails(email: String, password: String)

object LoginJsonImplicits extends DefaultJsonProtocol with SprayJsonSupport {
  implicit val LoginDetailsFormat = jsonFormat2(LoginDetails)
}

/**
 * Created by Alex on 2015-05-09.
 */
trait UserService extends HttpService {
  import LoginJsonImplicits._

  private val dao: GeneralDAO = PostGresSlickDAO

  val userRoutes =
    path("login") {
      post {
        entity(as[LoginDetails]) { loginDetails =>
          createSession(loginDetails) { session: Session =>
            complete {
              "Logged In"
            }
          }
        }
      }
    } ~ path("whoami") {
      get {
        withSession() { session : Session  =>
          complete {
            session.user.userName
          }
        }
      }
    }

}