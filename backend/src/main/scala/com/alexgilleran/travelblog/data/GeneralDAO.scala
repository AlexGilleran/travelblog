package com.alexgilleran.travelblog.data

import com.alexgilleran.travelblog.data.schema.Tables
import com.alexgilleran.travelblog.data.schema.Tables.{ User, Blog, Entry }
import scala.concurrent.Future
import scala.None
import scala.None

/**
 * Created by Alex on 2015-05-09.
 */
trait GeneralDAO {
  val GENERIC_LIST_LIMIT = 100

  def getBlog(id: Long): Future[Option[Blog]]
  def getBlogsForUser(userId: Long, number: Int, startBlogId: Option[Long] = None): Future[Seq[Blog]]
  def insertBlog(blog: Blog): Future[Long]
  def updateBlog(blogId: Long, blog: Blog): Future[Int]

  def getEntriesForBlog(blogId: Long, limit: Int = GENERIC_LIST_LIMIT, after: Option[Long] = None): Future[Seq[Entry]]
  def getEntry(id: Long): Future[Option[Entry]]
  def getEntryWithBlog(id: Long): Future[Option[(Entry, Blog)]]
  def getEntries(ids: Seq[Long]): Future[Seq[Entry]]
  def addEntry(entry: Entry): Future[Entry]

  def updateEntry(entryId: Long, entry: Entry): Future[Int]
  def getBlogs(limit: Int = GENERIC_LIST_LIMIT): Future[Seq[Blog]]
  def getUser(id: Long): Future[Option[User]]
  def getUserByUserName(userName: String): Future[Option[User]]
  def getUserByEmail(email: String): Future[Option[User]]
  def getFullUser(userName: String, limit: Int = GENERIC_LIST_LIMIT): Future[Option[(User, Seq[Entry], Seq[Blog])]]
  def insertUser(user: User): Future[Long]
}
