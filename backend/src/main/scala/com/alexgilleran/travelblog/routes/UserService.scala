package com.alexgilleran.travelblog.routes

import com.alexgilleran.travelblog.data.GeneralDAO
import com.alexgilleran.travelblog.data.PostGresSlickDAO
import com.alexgilleran.travelblog.data.schema.Tables.Blog
import com.alexgilleran.travelblog.data.schema.Tables.Entry
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.routes.directives.SessionDirectives._
import com.alexgilleran.travelblog.session.Session
import com.alexgilleran.travelblog.session.SessionManager
import com.alexgilleran.travelblog.session.SessionManagerStub

import akka.http.scaladsl.marshallers.sprayjson.SprayJsonSupport
import akka.http.scaladsl.marshalling.ToResponseMarshallable.apply
import akka.http.scaladsl.server.Directive.addByNameNullaryApply
import akka.http.scaladsl.server.Directive.addDirectiveApply
import akka.http.scaladsl.server.Directives.Segment
import akka.http.scaladsl.server.Directives.as
import akka.http.scaladsl.server.Directives.complete
import akka.http.scaladsl.server.Directives.enhanceRouteWithConcatenation
import akka.http.scaladsl.server.Directives.entity
import akka.http.scaladsl.server.Directives.get
import akka.http.scaladsl.server.Directives.path
import akka.http.scaladsl.server.Directives.pathEnd
import akka.http.scaladsl.server.Directives.pathPrefix
import akka.http.scaladsl.server.Directives.post
import akka.http.scaladsl.server.Directives.reject
import akka.http.scaladsl.server.Directives.segmentStringToPathMatcher
import spray.json.DefaultJsonProtocol
import spray.json.JsNumber
import spray.json.JsObject
import spray.json.JsString
import spray.json.JsValue
import spray.json.RootJsonFormat
import akka.http.scaladsl.model.StatusCodes
import akka.http.scaladsl.server.Route

case class LoginDetails(emailAddress: String, password: String)

case class ApiUser(details: User, activity: Seq[Entry], blogs: Seq[Blog])

trait LoginJsonImplicits extends DefaultJsonProtocol with SprayJsonSupport with BlogJsonImplicits {
  
  class PublicUserFormat extends RootJsonFormat[User] {
    def write(user: User) = JsObject(
      "userName" -> JsString(user.userName),
      "displayName" -> JsString(user.displayName.orNull),
      "bio" -> JsString(user.bio.orNull),
      "avatarUrl" -> JsString(user.bio.orNull),
      "userId" -> JsNumber(user.userId.get))

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

trait UserService extends LoginJsonImplicits {
  private val dao: GeneralDAO = PostGresSlickDAO
  private val sessionManager: SessionManager = SessionManagerStub

  val userRoutes : Route =
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
              case None                   => reject
            }
          } ~ pathEnd {
            withSession() { session: Option[Session] =>
              session match {
                case Some(session) =>
                  complete(PrivateUserFormat.write(session.user))
                case None => 
                  complete(StatusCodes.Forbidden)
              }
            }
          }
        } ~ path(Segment) { userName: String =>
          dao.getFullUser(userName) match {
            case Some(userData) => complete(new ApiUser(userData._1, userData._2, userData._3))
            case None           => reject
          }
        }
      }
    }
}