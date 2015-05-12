package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.data.{GeneralDAO, PostGresSlickDAO}
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import spray.httpx.SprayJsonSupport
import spray.json._
import spray.routing.HttpService

case class LoginDetails(email: String, password: String)

object LoginJsonImplicits extends DefaultJsonProtocol with SprayJsonSupport {
  implicit val LoginDetailsFormat = jsonFormat2(LoginDetails)

  implicit object UserFormat extends RootJsonFormat[User] {
    def write(user: User) = JsObject(
      "email" -> JsString(user.email),
      "userName" -> JsString(user.userName),
      "displayName" -> JsString(user.displayName.orNull),
      "bio" -> JsString(user.bio.orNull),
      "avatarUrl" -> JsString(user.bio.orNull),
      "userId" -> JsNumber(user.userId.get)
    )

    def read(value: JsValue) = jsonFormat7(User).read(value)
  }

}

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
        withSession() { session: Session =>
          complete {
            session.user.userName
          }
        }
      }
    } ~ path("register") {
      post {
        entity(as[User]) { user: User =>
          val id: Long = dao.insertUser(user)

          createSessionCookie(user) { session: Session =>
            complete {
              "Registered as " + id
            }
          }
        }
      }
    } ~ pathPrefix("users") {
      get {
        path(LongNumber) { id =>
          complete {
            dao.getUser(id)
          }
        }
      }
    }
}