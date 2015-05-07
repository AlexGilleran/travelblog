package com.alexgilleran.travelblog

import com.alexgilleran.travelblog.session.{Session, SessionManager}
import shapeless.HNil
import spray.http.HttpCookie
import spray.http.HttpHeaders.`Set-Cookie`
import spray.routing._
import spray.routing.directives.FutureDirectives
import spray.routing.directives.RespondWithDirectives._

import scala.concurrent.{Future, ExecutionContext}

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionDirectives {

  import directives.CookieDirectives._
  import directives.RouteDirectives._
  import directives.BasicDirectives._

  val sessionManager: SessionManager

  def createSession(magnet: WithStatefulManagerMagnet): Directive1[Session] =
    optionalCookie("id").hflatMap {
      case Some(cookie : HttpCookie) =>
        magnet.directive(_.getSession(cookie.content.toLong)).hflatMap {
          case Some(session : Session) =>
            provide(session)
          case None =>
            createSessionCookie()
        }
      case None => {
        createSessionCookie()
      }
    }

//      val session: Session = if (idCookie.isDefined) {
//        val sessionOption: Option[Session] = sessionManager.getSession(idCookie.get.value.toLong)
//        if (sessionOption.isDefined) {
//          sessionOption.get
//        } else {
//          sessionManager.newSession()
//        }
//      } else {
//        sessionManager.newSession()
//      }
//
//      createSessionCookie(session)
//
//      provide(session)
//    }

  def createSessionCookie(): Directive1[Session] = {
    val session: Session = sessionManager.newSession()
    setCookie(new HttpCookie(name = "id", content = session.id))
    provide(sessionManager.newSession())
  }
}

trait WithStatefulManagerMagnet[In] {

//  import FutureDirectives._
  import directives.BasicDirectives._

  implicit val executor: ExecutionContext

  implicit val manager: SessionManager

  val in: In

  def directive[Session](action: SessionManager => Session): Directive1[Session] =
    provide(action(manager))

}

object WithStatefulManagerMagnet {
  implicit def apply[In](i: In)(implicit ec: ExecutionContext, m: SessionManager): WithStatefulManagerMagnet[In] =
    new WithStatefulManagerMagnet[In] {
      implicit val executor = ec
      val manager = m
      val in = i
    }
}