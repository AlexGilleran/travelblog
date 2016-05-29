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

  def getEntries(entryIds: Seq[Long]): Future[Seq[Entry]] = dao.getEntries(entryIds)
  def getEntriesForBlog(blogId: Long): Future[Seq[Entry]] = dao.getEntriesForBlog(blogId)
  def getBlog(blogId: Long) : Future[Option[Blog]] = dao.getBlog(blogId)
}

case class DeferEntriesForBlog(blogId: Long) extends Deferred[Seq[Entry]]

class BlogResolver extends DeferredResolver[BlogRepo] {
  override def resolve(deferred: Vector[Deferred[Any]], ctx: BlogRepo) = deferred.map {
    case DeferEntriesForBlog(blogId) =>
      ctx.getEntriesForBlog(blogId)
  }
}