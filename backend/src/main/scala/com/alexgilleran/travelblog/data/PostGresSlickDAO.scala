package com.alexgilleran.travelblog.data

import com.alexgilleran.travelblog.config.Config
import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables._

import scala.util.Properties
import slick.driver.PostgresDriver
import slick.lifted.TableQuery
import slick.driver.PostgresDriver.api._
import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
 * Created by Alex on 2015-05-09.
 */
trait PostGresSlickDAO extends GeneralDAO {
  val db = PostgresDriver.api.Database.forURL(url = Config.app.getString("databaseUrl"), driver = "org.postgresql.Driver")

  val blogQuery: TableQuery[BlogTable] = TableQuery[BlogTable]

  override def getBlog(id: Long): Future[Option[Blog]] = {
    db.run(
      BlogTable.filter(_.blogId === id).result.headOption)
  }

  def getBlogsForUser(userId: Long, number: Int, startBlogId: Option[Long] = None): Future[Seq[Blog]] = {
    val baseQuery = BlogTable.filter(_.userId === userId).take(number)

    val query = startBlogId match {
      case Some(blogId) => baseQuery.filter(_.blogId > blogId)
      case _            => baseQuery
    }

    db.run(query.result)
  }

  override def insertBlog(blog: Blog): Future[Long] = {
    db.run(
      BlogTable returning (BlogTable.map(_.blogId)) += blog)
  }

  override def updateBlog(blogId: Long, blog: Blog): Future[Int] = {
    db.run(
      BlogTable.filter(_.blogId === blogId).update(blog))
  }

  override def getEntriesForBlog(blogId: Long, limit: Int = GENERIC_LIST_LIMIT, after: Option[Long]): Future[Seq[Entry]] = {
    db.run(
      EntryTable.filter(_.blogId === blogId).sortBy(_.created).take(limit).result)
  }

  override def getEntry(entryId: Long): Future[Option[Entry]] = {
    db.run(
      EntryTable.filter(_.entryId === entryId).result.headOption)
  }

  override def getEntryWithBlog(entryId: Long): Future[Option[(Entry, Blog)]] = {
    db.run(
      EntryTable.filter(_.entryId === entryId).join(BlogTable).on(_.blogId === _.blogId).result.headOption)
  }

  override def getEntries(entryIds: Seq[Long]): Future[Seq[Entry]] = {
    db.run(
      EntryTable.filter(_.entryId.inSet(entryIds)).result)
  }

  override def updateEntry(entryId: Long, entry: Entry): Future[Int] = {
    db.run(
      EntryTable.filter(_.entryId === entryId).update(entry))
  }

  def addEntry(entry: Entry): Future[Entry] = {
    db.run(
      EntryTable returning (EntryTable.map(identity)) += entry)
  }

  override def getBlogs(limit: Int = GENERIC_LIST_LIMIT): Future[Seq[Blog]] = {
    db.run(
      BlogTable.take(limit).result)
  }

  override def getUser(id: Long): Future[Option[User]] = {
    db.run(
      UserTable.filter(_.userId === id).result.headOption)
  }

  override def getUserByEmail(email: String): Future[Option[User]] = {
    db.run(
      UserTable.filter(_.email === email).result.headOption)
  }

  override def getUserByUserName(userName: String): Future[Option[User]] = {
    db.run(
      UserTable.filter(_.userName === userName).result.headOption)
  }

  val insertUserQuery = UserTable returning UserTable.map(_.userId) into ((user, userId) => user.copy(userId = Some(userId)))
  override def insertUser(user: User): Future[Long] = {
    db.run(
      UserTable returning (UserTable.map(_.userId)) += user)
  }

  override def getFullUser(userName: String, limit: Int = GENERIC_LIST_LIMIT): Future[Option[(User, Seq[Entry], Seq[Blog])]] = {
    // TODO: Megajoin?
    db.run {
      UserTable.filter(_.userName === userName).result.headOption.map {
        case None             => None
        case Some(user: User) => BlogTable.filter(_.userId === user.userId).take(limit).result.map { blogs: Seq[Blog] => (blogs, user) }
      }
    }.flatMap { tuple =>
      val (blogs: Seq[Blog], user: User) = tuple;
      val blogIds: Set[Long] = blogs.map(blog => blog.blogId.get).toSet

      db.run(EntryTable.filter(_.blogId inSet blogIds).take(limit).result)
        .map { entries: Seq[Entry] => Some(user, entries, blogs) }
    }
  }
}

// Singleton for now, TODO think about DI later.
object PostGresSlickDAO extends PostGresSlickDAO {
}