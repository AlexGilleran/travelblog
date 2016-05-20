package com.alexgilleran.travelblog.routes.directives

import com.alexgilleran.travelblog.data.{ PostGresSlickDAO, GeneralDAO }
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.routes.LoginDetails
import com.alexgilleran.travelblog.session.{ SessionManagerStub, Session, SessionManager }
import akka.http.scaladsl.server._
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.model.StatusCodes
import spray.json.DefaultJsonProtocol._
import akka.http.scaladsl.server.Directives._

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  private val sessionManager: SessionManager = SessionManagerStub
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
    optionalSession() flatMap {
      case Some(session: Session) =>
        provide(session)
      case None => {
        createSessionCookie(loginDetails)
      }
    }
  }

  def createSessionCookie(user: User): Directive1[Session] = {
    val (id: String, session: Session) = sessionManager.newSession(user)
    val cookie: HttpCookie = new HttpCookie(name = "id", value = id, path = Some("/"))
    setCookie(cookie) tflatMap { a =>
      provide(session)
    }
  }

  private def createSessionCookie(loginDetails: LoginDetails): Directive1[Session] = {
    onSuccess (dao.getUserByEmail(loginDetails.emailAddress)) flatMap { user =>
      user match {
        case Some(user) => createSessionCookie(user)
        case None => reject
      }
    }
  }

  private def optionalSession(): Directive1[Option[Session]] = {
    optionalCookie("id") flatMap {
      case Some(cookie) =>
        provide(sessionManager.getSession(cookie.value)) flatMap {
          case Some(session: Session) =>
            provide(Some(session))
          case None =>
            provide(None)
        }
      case None => {
        provide(None)
      }
    }
  }
}

object SessionDirectives extends SessionDirectives