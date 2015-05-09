package com.alexgilleran.travelblog.routes.directives

import com.alexgilleran.travelblog.session.{SessionManagerStub, Session, SessionManager}
import shapeless._
import spray.http.{HttpHeaders, HttpCookie}
import spray.routing._
import directives.CookieDirectives._
import directives.BasicDirectives._
import spray.routing.directives.BasicDirectives

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  val sessionManager: SessionManager = new SessionManagerStub

  def createSession(): Directive1[Session] =
    optionalCookie("id").hflatMap {
      case Some(cookie : HttpCookie) :: HNil =>
        provide(sessionManager.getSession(cookie.content.toLong)).hflatMap {
          case Some(session : Session) :: HNil =>
            provide(session)
          case None :: HNil =>
            createSessionCookie()
        }
      case None :: HNil => {
        createSessionCookie()
      }
    }

  private def createSessionCookie(): Directive1[Session] = {
    val session: Session = sessionManager.newSession()
    val cookie : HttpCookie = new HttpCookie(name = "id", content = session.id)
    (mapRequest(_.withHeaders(HttpHeaders.Cookie(cookie))) & setCookie(cookie)).hmap { _ =>
      session
    }
  }
}

object SessionDirectives extends SessionDirectives