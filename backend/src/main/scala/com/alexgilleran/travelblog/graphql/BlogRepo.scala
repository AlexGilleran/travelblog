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
import com.alexgilleran.travelblog.session.Session
import com.alexgilleran.travelblog.graphql.SchemaDefinition._
import sangria.relay.Node
import BlogRepo._

case class BlogRepo() {
  val dao: GeneralDAO = PostGresSlickDAO
  val sessionManager: SessionManager = SessionManagerStub

  def getEntry(entryId: Long): Future[Option[EntryNode]] = dao.getEntry(entryId).map(_.map(entryToNode(_)))
  def getEntriesForBlog(blogId: Long): Future[Seq[EntryNode]] = dao.getEntriesForBlog(blogId).map(_.map(entryToNode(_)))
  def getBlog(blogId: Long): Future[Option[BlogNode]] = dao.getBlog(blogId).map(_.map(blogToNode(_)))
  def getBlogs(first: Int): Future[Seq[BlogNode]] = dao.getBlogs(first).map(_.map(blogToNode(_)))
  def getUser(userId: Long): Future[Option[UserNode]] = dao.getUser(userId).map(_.map(userToNode(_)))
  def authorise(token: String): Option[List[String]] = ???

}

object BlogRepo {
  implicit def entryToNode(entry: Entry): EntryNode = EntryNode(entry)
  implicit def blogToNode(blog: Blog): BlogNode = BlogNode(blog)
  implicit def userToNode(user: User): UserNode = UserNode(user)
}

case class EntryNode(entry: Entry) extends Node {
  def id: String = entry.entryId.get.toString
}
case class BlogNode(blog: Blog) extends Node {
  def id: String = blog.blogId.get.toString
}
case class UserNode(user: User) extends Node {
  def id: String = user.userId.get.toString
}
case class ViewerNode() extends Node {
  def id: String = "0"
}

case class DeferBlogs(first: Int) extends Deferred[List[BlogNode]]
case class DeferEntriesForBlog(blogId: Long) extends Deferred[Seq[EntryNode]]
case class DeferBlog(blogId: Long) extends Deferred[Option[BlogNode]]
case class DeferEntry(entryId: Long) extends Deferred[Option[EntryNode]]
case object DeferCurrentUser extends Deferred[Option[UserNode]]

case class AuthenticationException(message: String) extends Exception(message)
case class AuthorisationException(message: String) extends Exception(message)
case class SecureContext(blogRepo: BlogRepo, session: Option[Session] = None) {
  def authorised[T](permissions: String*)(fn: User => T) = true

  def currentUser(): Future[Option[UserNode]] = session
    .flatMap(_.userId)
    .map(blogRepo.getUser(_))
    .getOrElse(Future(None))
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
