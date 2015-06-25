package com.alexgilleran.travelblog.routes.directives

import com.alexgilleran.travelblog.data.{PostGresSlickDAO, GeneralDAO}
import com.alexgilleran.travelblog.data.schema.Tables.User
import com.alexgilleran.travelblog.routes.LoginDetails
import com.alexgilleran.travelblog.session.{SessionManagerStub, Session, SessionManager}
import shapeless._
import spray.http.{HttpHeaders, HttpCookie}
import spray.routing._
import directives.CookieDirectives._
import directives.BasicDirectives._
import directives.RouteDirectives._
import spray.routing.directives.BasicDirectives

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  private val sessionManager: SessionManager = SessionManagerStub
  private val dao: GeneralDAO = PostGresSlickDAO

  def withSession(): Directive1[Session] = {
    optionalSession().hflatMap {
      case Some(session: Session) :: HNil =>
        provide(session)
      case None :: HNil => {
        reject
      }
    }
  }

  def createSession(loginDetails: LoginDetails): Directive1[Session] = {
    optionalSession().hflatMap {
      case Some(session: Session) :: HNil =>
        provide(session)
      case None :: HNil => {
        createSessionCookie(loginDetails)
      }
    }
  }

  def createSessionCookie(user : User) : Directive1[Session] = {
    val (id: String, session: Session) = sessionManager.newSession(user)
    val cookie: HttpCookie = new HttpCookie(name = "id", content = id, path = Some("/"))
    setCookie(cookie).hmap { _ =>
      session
    }
  }

  private def optionalSession() : Directive1[Option[Session]] = {
    optionalCookie("id").hflatMap {
      case Some(cookie: HttpCookie) :: HNil =>
        provide(sessionManager.getSession(cookie.content)).hflatMap {
          case Some(session: Session) :: HNil =>
            provide(Some(session))
          case None :: HNil =>
            provide(None)
        }
      case None :: HNil => {
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