package com.alexgilleran.travelblog.graphql

import sangria.schema.Deferred
import scala.concurrent.ExecutionContext.Implicits.global
import sangria.schema.DeferredResolver
import scala.util.Try
import scala.concurrent.Future
import com.alexgilleran.travelblog.data.schema.Tables._
import com.alexgilleran.travelblog.data.GeneralDAO
import com.alexgilleran.travelblog.data.PostGresSlickDAO
import com.alexgilleran.travelblog.session.SessionManager
import com.alexgilleran.travelblog.session.SessionManagerStub
import sangria.relay.Mutation

case class BlogRepo() {
  val dao: GeneralDAO = PostGresSlickDAO
  val sessionManager: SessionManager = SessionManagerStub

  def getEntry(entryId: Long): Future[Option[Entry]] = dao.getEntry(entryId)
  def getEntriesForBlog(blogId: Long): Future[Seq[Entry]] = dao.getEntriesForBlog(blogId)
  def getBlog(blogId: Long): Future[Option[Blog]] = dao.getBlog(blogId)
  def getBlogs(first: Int): Future[Seq[Blog]] = dao.getBlogs(first)
  def getUserForSession(token: String): Future[Option[User]] = Future(sessionManager.getSession(token).map(_.user))
  def authorise(token: String): Option[List[String]] = ???

}

case class DeferBlogs(first: Int) extends Deferred[List[Blog]]
case class DeferEntriesForBlog(blogId: Long) extends Deferred[Seq[Entry]]
case class DeferBlog(blogId: Long) extends Deferred[Option[Blog]]
case class DeferEntry(entryId: Long) extends Deferred[Option[Entry]]
case object DeferCurrentUser extends Deferred[Option[User]]

case class AuthenticationException(message: String) extends Exception(message)
case class AuthorisationException(message: String) extends Exception(message)
case class Viewer()
case class SecureContext(blogRepo: BlogRepo, token: Option[String] = None) {
  def authorised[T](permissions: String*)(fn: User => T) = true

  def currentUser() = token match {
    case Some(innerToken) => blogRepo.getUserForSession(innerToken)
    case _                => Future(None)
  }
}
class BlogResolver extends DeferredResolver[SecureContext] {
  override def resolve(deferred: Vector[Deferred[Any]], ctx: SecureContext) = deferred.map {
    case DeferBlogs(first) =>
      ctx.blogRepo.getBlogs(first)
    case DeferEntriesForBlog(blogId) =>
      ctx.blogRepo.getEntriesForBlog(blogId)
    case DeferBlog(blogId) =>
      ctx.blogRepo.getBlog(blogId)
    case DeferEntry(entryId) =>
      ctx.blogRepo.getEntry(entryId)
    case DeferCurrentUser =>
      ctx.currentUser
  }
}
