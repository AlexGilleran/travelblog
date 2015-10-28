package com.alexgilleran.travelblog.data

import com.alexgilleran.travelblog.config.Config
import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables._
import com.alexgilleran.travelblog.data.schema.Tables.profile.simple._

import scala.util.Properties

/**
 * Created by Alex on 2015-05-09.
 */
trait PostGresSlickDAO extends GeneralDAO {
  val db = Database.forURL(Config.app.getString("databaseUrl"), driver = "org.postgresql.Driver")

  override def getBlog(id: Long): Blog = {
    db.withSession { implicit session =>
      BlogTable.filter(_.blogId === id).first
    }
  }

  override def insertBlog(blog : Blog) : Long = {
    db.withSession(implicit session =>
      BlogTable returning (BlogTable.map(_.blogId)) += blog
    )
  }

  override def updateBlog(blogId: Long, blog: Blog) = {
    db.withSession { implicit session =>
      BlogTable.filter(_.blogId === blogId).update(blog.copy(blogId = Some(blogId)))
    }
  }

  override def getEntriesForBlog(blogId: Long, limit: Int = GENERIC_LIST_LIMIT): Seq[Entry] = {
    db.withSession { implicit session =>
      EntryTable.filter(_.blogId === blogId).take(limit).list
    }
  }

  override def getEntry(entryId: Long): (Entry, Blog) = {
    db.withSession { implicit session =>
      EntryTable.filter(_.entryId === entryId) innerJoin BlogTable on (_.blogId === _.blogId) first
    }
  }

  override def updateEntry(entryId: Long, entry: Entry) = {
    db.withSession { implicit session =>
      EntryTable.filter(_.entryId === entryId).update(entry)
    }
  }

  override def getBlogs(limit: Int = GENERIC_LIST_LIMIT): List[Blog] = {
    db.withSession { implicit session =>
      BlogTable.take(limit).list
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

  override def getUserByUserName(userName: String): Tables.User = {
    db.withSession { implicit session =>
      UserTable.filter(_.userName === userName).first
    }
  }

  override def insertUser(user: Tables.User): Long = {
    db.withSession(implicit session =>
      UserTable returning (UserTable.map(_.userId)) += user
    )
  }

  override def getFullUser(userName: String, limit: Int = GENERIC_LIST_LIMIT): Option[(User, Seq[Tables.Entry], Seq[Tables.Blog])] = {
    db.withSession { implicit session =>
      val userOption: Option[User] = UserTable.filter(_.userName === userName) firstOption

      userOption match {
        case None => None
        case Some(user: User) => {
          val blogs: Seq[Blog] = BlogTable.filter(_.userId === user.userId) take (limit) list
          val blogIds: Set[Long] = blogs.map(blog => blog.blogId.get).toSet
          val entries: Seq[Entry] = EntryTable.filter(_.blogId inSet blogIds) take (limit) list

          Some(user, entries, blogs)
        }
      }

    }
  }

  //  override def getBlogsForUser(userName: String, limit: Int = GENERIC_LIST_LIMIT): Seq[Blog] = {
  //    db.withSession { implicit session =>
  //      (BlogTable.filter (_.userName === userId) list) take(limit)
  //    }
  //  }
}

// Singleton for now, TODO think about DI later.
object PostGresSlickDAO extends PostGresSlickDAO {
}