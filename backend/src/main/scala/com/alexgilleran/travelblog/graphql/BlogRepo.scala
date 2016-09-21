package com.alexgilleran.travelblog.graphql

import sangria.schema.Deferred
import sangria.schema.DeferredResolver
import scala.util.Try
import scala.concurrent.Future
import com.alexgilleran.travelblog.data.schema.Tables._
import com.alexgilleran.travelblog.data.GeneralDAO
import com.alexgilleran.travelblog.data.PostGresSlickDAO

class BlogRepo {
  val dao: GeneralDAO = PostGresSlickDAO

  def getEntry(entryId: Long): Future[Option[Entry]] = dao.getEntry(entryId)
  def getEntriesForBlog(blogId: Long): Future[Seq[Entry]] = dao.getEntriesForBlog(blogId)
  def getBlog(blogId: Long): Future[Option[Blog]] = dao.getBlog(blogId)
  def getBlogs(first: Int): Future[Seq[Blog]] = dao.getBlogs(first)
}

case class DeferBlogs(first: Int) extends Deferred[List[Blog]]
case class DeferEntriesForBlog(blogId: Long) extends Deferred[Seq[Entry]]
case class DeferBlog(blogId: Long) extends Deferred[Option[Blog]]
case class DeferEntry(entryId: Long) extends Deferred[Option[Entry]]

class BlogResolver extends DeferredResolver[BlogRepo] {
  override def resolve(deferred: Vector[Deferred[Any]], ctx: BlogRepo) = deferred.map {
    case DeferBlogs(first) => 
      ctx.getBlogs(first)
    case DeferEntriesForBlog(blogId) =>
      ctx.getEntriesForBlog(blogId)
    case DeferBlog(blogId) =>
      ctx.getBlog(blogId)
    case DeferEntry(entryId) =>
      ctx.getEntry(entryId)
  }
}
