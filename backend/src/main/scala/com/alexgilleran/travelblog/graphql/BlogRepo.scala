package com.alexgilleran.travelblog.graphql

import sangria.schema.Deferred
import sangria.schema.DeferredResolver
import scala.util.Try
import scala.concurrent.Future
import com.alexgilleran.travelblog.data.schema.Tables.Entry
import com.alexgilleran.travelblog.data.GeneralDAO
import com.alexgilleran.travelblog.data.PostGresSlickDAO

case class DeferEntries(entryIds: Seq[Long]) extends Deferred[Seq[Entry]]

class BlogRepo {
  val dao: GeneralDAO = PostGresSlickDAO

  def getEntries(entryIds: Seq[Long]): Future[Seq[Entry]] = dao.getEntries(entryIds)
}

class BlogResolver extends DeferredResolver[BlogRepo] {
  override def resolve(deferred: Vector[Deferred[Any]], ctx: BlogRepo) = deferred.map {
    case DeferEntries(entryIds) =>
      ctx.getEntries(entryIds)
  }
}