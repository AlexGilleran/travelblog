package com.alexgilleran.travelblog.data

import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables._
import com.alexgilleran.travelblog.data.schema.Tables.profile.simple._

import scala.util.Properties

/**
 * Created by Alex on 2015-05-09.
 */
trait PostGresSlickDAO extends GeneralDAO {
  val db = Database.forURL(Properties.envOrElse("DATABASE_URL", "fail"), driver = "org.postgresql.Driver")

  override def getBlog(id: Long): Blog = {
    db.withSession { implicit session =>
      BlogTable.filter(_.blogId === id).first
    }
  }

  override def getEntriesForBlog(blogId: Long, limit: Int = GENERIC_LIST_LIMIT): Seq[Entry] = {
    db.withSession { implicit session =>
      EntryTable.filter(_.blogId === blogId).list.take(limit)
    }
  }

  override def getEntry(entryId: Long): Entry = {
    db.withSession { implicit session =>
      EntryTable.filter(_.entryId === entryId).first
    }
  }

  override def getBlogs(limit: Int = GENERIC_LIST_LIMIT): List[Blog] = {
    db.withSession { implicit session =>
      BlogTable.list.take(limit)
    }
  }

  override def getUser(id: Long): Tables.User = {
    db.withSession { implicit session =>
      UserTable.filter(_.userId === id).first
    }
  }

  override def getUserByEmail(email: String): Tables.User = {
    db.withSession { implicit session =>
      UserTable.filter(_.email === email).first
    }
  }
  override def insertUser(user: Tables.User): Long = {
    db.withSession( implicit session =>
      UserTable returning (UserTable.map(_.userId)) += user
    )
  }
}

// Singleton for now, TODO think about DI later.
object PostGresSlickDAO extends PostGresSlickDAO {
}