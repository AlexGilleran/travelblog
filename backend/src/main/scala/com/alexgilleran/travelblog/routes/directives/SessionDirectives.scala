package com.alexgilleran.travelblog.routes.directives

import com.alexgilleran.travelblog.data.{ PostGresSlickDAO, GeneralDAO }
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.routes.LoginDetails
import com.alexgilleran.travelblog.session
import com.alexgilleran.travelblog.session.{ SessionManagerStub, Session }
import akka.http.scaladsl.server._
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.model.StatusCodes
import spray.json.DefaultJsonProtocol._
import akka.http.scaladsl.server.Directives._
import com.softwaremill.session.{ SessionConfig, SessionManager }
import com.softwaremill.session.SessionDirectives.{ optionalSession => akkaOptionalSession }
import com.softwaremill.session.SessionDirectives._
import com.softwaremill.session.SessionOptions._

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  private val sessionManager: session.SessionManager = SessionManagerStub
  val sessionConfig = SessionConfig.default("some_very_long_secret_and_random_string_some_very_long_secret_and_random_string")
  implicit val akkaSessionManager = new SessionManager[String](sessionConfig)
  private val dao: GeneralDAO = PostGresSlickDAO

  def withSession(): Directive1[Session] = {
    optionalSession() flatMap {
      case Some(session: Session) =>
        provide(session)
      case None => {
        complete(StatusCodes.Unauthorized)
      }
    }
  }

  def createSession(loginDetails: LoginDetails): Directive1[Session] = {
    onSuccess(dao.getUserByEmail(loginDetails.emailAddress)) flatMap { user =>
      user match {
        case Some(user) => createSession(user)
        case None       => reject
      }
    }
  }

  def createSession(user: User): Directive1[Session] = {
    val (id: String, session: Session) = sessionManager.newSession(user)

    setSession(oneOff, usingCookies, id) tflatMap { ctx =>
      provide(session)
    }
  }

  private def optionalSession(): Directive1[Option[Session]] = {
    akkaOptionalSession(oneOff, usingCookies).flatMap { id => provide(id.flatMap(sessionManager.getSession(_))) }
  }
}

object SessionDirectives extends SessionDirectives