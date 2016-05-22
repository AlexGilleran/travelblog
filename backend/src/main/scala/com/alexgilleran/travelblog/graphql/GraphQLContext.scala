package com.alexgilleran.travelblog.graphql

import sangria.schema.Deferred
import sangria.schema.DeferredResolver
import scala.util.Try
import scala.concurrent.Future
import com.alexgilleran.travelblog.data.schema.Tables.Entry
import com.alexgilleran.travelblog.data.GeneralDAO
import com.alexgilleran.travelblog.data.PostGresSlickDAO

case class DeferEntry(entryId: Long) extends Deferred[Option[Entry]]


class GraphQLContext {
  val dao: GeneralDAO = PostGresSlickDAO
  
  def getEntry(entryId : Long) : Future[Option[Entry]] = dao.getEntry(entryId)
}

class Resolver extends DeferredResolver[Entry] {

  override def resolve(deferred: Deferred[Entry], ctx: Any) = deferred match {
    case DeferEntry(entryId) =>
      Future.fromTry(Try(
        friendIds map (id => CharacterRepo.humans.find(_.id == id) orElse CharacterRepo.droids.find(_.id == id))))
    }
  }
}