package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.schema.Tables.{User, Entry, Blog}
import com.alexgilleran.travelblog.data.{GeneralDAO, PostGresSlickDAO}
import com.alexgilleran.travelblog.routes.BlogJsonImplicits._
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.{SessionManagerStub, SessionManager, Session}
import spray.httpx.SprayJsonSupport
import spray.json._
import spray.routing.HttpService

case class LoginDetails(emailAddress: String, password: String)
case class ApiUser(details: User, activity: Seq[Entry], blogs: Seq[Blog])

object LoginJsonImplicits extends DefaultJsonProtocol with SprayJsonSupport {
  import BlogJsonImplicits.{entry, blog}

  class PublicUserFormat extends RootJsonFormat[User] {
    def write(user: User) = JsObject(
      "userName" -> JsString(user.userName),
      "displayName" -> JsString(user.displayName.orNull),
      "bio" -> JsString(user.bio.orNull),
      "avatarUrl" -> JsString(user.bio.orNull),
      "userId" -> JsNumber(user.userId.get)
    )

    def read(value: JsValue) = jsonFormat7(User).read(value)
  }

  implicit object PublicUserFormat extends PublicUserFormat

  object PrivateUserFormat extends PublicUserFormat {
    override def write(user: User): JsObject = {
      val obj: JsObject = super.write(user)

      new JsObject(obj.fields.updated("email", JsString(user.email)))
    }
  }

  implicit val LoginDetailsFormat = jsonFormat2(LoginDetails)
  implicit val BigUserFormat = jsonFormat3(ApiUser)
}

trait UserService extends HttpService {

  import LoginJsonImplicits._

  private val dao: GeneralDAO = PostGresSlickDAO
  private val sessionManager: SessionManager = SessionManagerStub

  val userRoutes =
    path("login") {
      post {
        entity(as[LoginDetails]) { loginDetails =>
          createSession(loginDetails) { session: Session =>
            complete {
              PrivateUserFormat.write(session.user)
            }
          }
        }
      }
    } ~ path("register") {
      post {
        entity(as[User]) { user: User =>
          val id: Long = dao.insertUser(user)
          val newUser = user.copy(userId = Option(id))

          createSessionCookie(newUser) { session: Session =>
            complete {
              PrivateUserFormat.write(session.user)
            }
          }
        }
      }
    } ~ pathPrefix("users") {
      get {
        pathPrefix("withSession") {
          path(Segment) { sessionId: String =>
            sessionManager.getSession(sessionId) match {
              case Some(session: Session) => complete(Some(PrivateUserFormat.write(session.user)))
              case None => reject
            }
          } ~ pathEnd {
            withSession() { session: Session =>
              complete {
                PrivateUserFormat.write(session.user)
              }
            }
          }
        } ~ path(LongNumber) { id =>
          complete {
            new ApiUser(dao.getUser(id), dao.getEntriesForUser(id), dao.getBlogsForUser(id))
          }
        }
      }
    }
}