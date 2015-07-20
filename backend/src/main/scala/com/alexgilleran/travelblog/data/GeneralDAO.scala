package com.alexgilleran.travelblog.data

import com.alexgilleran.travelblog.data.schema.Tables.{User, Blog, Entry}

/**
 * Created by Alex on 2015-05-09.
 */
trait GeneralDAO {
  val GENERIC_LIST_LIMIT = 100

  def getBlog(id : Long) : Blog
  def getEntriesForBlog(blogId : Long, limit: Int = GENERIC_LIST_LIMIT) : Seq[Entry]
  def getEntry(id : Long) : Entry
  def getEntryOwnerId(entryId: Long) : Long
  def updateEntry(entryId: Long, entry: Entry)
  def getBlogs(limit: Int = GENERIC_LIST_LIMIT) : List[Blog]
  def getUser(id : Long) : User
  def getUserByEmail(email : String) : User
  def insertUser(user : User) : Long
}
