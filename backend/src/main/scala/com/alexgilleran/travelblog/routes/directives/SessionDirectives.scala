package com.alexgilleran.travelblog.routes.directives

import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.routes.LoginDetails
import com.alexgilleran.travelblog.session.{SessionManagerStub, Session, SessionManager}
import akka.http.scaladsl.server._
import akka.http.scaladsl.server.directives.CookieDirectives._
import akka.http.scaladsl.server.directives.BasicDirectives._
import akka.http.scaladsl.model.headers.HttpCookie
import akka.http.scaladsl.model.StatusCodes
import spray.json.DefaultJsonProtocol._


/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  private val sessionManager: SessionManager = SessionManagerStub
  private val dao: GeneralDAO = PostGresSlickDAO

  def withSession(): Directive1[Option[Session]] = {
    optionalSession() flatMap {
      case Some(session: Session) =>
        provide(Some(session))
      case None => {
        provide(None)
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

  def createSessionCookie(user : User) : Directive1[Session] = {
    val (id: String, session: Session) = sessionManager.newSession(user)
    val cookie: HttpCookie = new HttpCookie(name = "id", value = id, path = Some("/"))
    setCookie(cookie) tflatMap { a =>
      provide(session)
    }
  }

  private def optionalSession() : Directive1[Option[Session]] = {
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

  private def createSessionCookie(loginDetails: LoginDetails): Directive1[Session] = {
    val user: User = dao.getUserByEmail(loginDetails.emailAddress)
    createSessionCookie(user)
  }
}

object SessionDirectives extends SessionDirectives