package com.alexgilleran.travelblog.data.schema
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = slick.driver.PostgresDriver
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: slick.driver.JdbcProfile
  import profile.api._
  import slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import slick.jdbc.{GetResult => GR}

  /** DDL for all tables. Call .create to execute. */
  lazy val schema: profile.SchemaDescription = BlogTable.schema ++ EntryTable.schema ++ UserTable.schema
  @deprecated("Use .schema instead of .ddl", "3.0")
  def ddl = schema

  /** Entity class storing rows of table BlogTable
   *  @param name Database column name SqlType(name)
   *  @param description Database column description SqlType(text), Default(None)
   *  @param userId Database column user_id SqlType(int8)
   *  @param blogId Database column blog_id SqlType(bigserial), AutoInc, PrimaryKey */
  case class Blog(name: String, description: Option[String] = None, userId: Long, blogId: Option[Long] = None)
  /** GetResult implicit for fetching Blog objects using plain SQL queries */
  implicit def GetResultBlog(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[Long], e3: GR[Option[Long]]): GR[Blog] = GR{
    prs => import prs._
    val r = (<<?[Long], <<[String], <<?[String], <<[Long])
    import r._
    Blog.tupled((_2, _3, _4, _1)) // putting AutoInc last
  }
  /** Table description of table blog. Objects of this class serve as prototypes for rows in queries. */
  class BlogTable(_tableTag: Tag) extends Table[Blog](_tableTag, "blog") {
    def * = (name, description, userId, Rep.Some(blogId)) <> (Blog.tupled, Blog.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(name), description, Rep.Some(userId), Rep.Some(blogId)).shaped.<>({r=>import r._; _1.map(_=> Blog.tupled((_1.get, _2, _3.get, _4)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column name SqlType(name) */
    val name: Rep[String] = column[String]("name")
    /** Database column description SqlType(text), Default(None) */
    val description: Rep[Option[String]] = column[Option[String]]("description", O.Default(None))
    /** Database column user_id SqlType(int8) */
    val userId: Rep[Long] = column[Long]("user_id")
    /** Database column blog_id SqlType(bigserial), AutoInc, PrimaryKey */
    val blogId: Rep[Long] = column[Long]("blog_id", O.AutoInc, O.PrimaryKey)

    /** Foreign key referencing UserTable (database name blog_user_id_fkey) */
    lazy val userTableFk = foreignKey("blog_user_id_fkey", userId, UserTable)(r => r.userId, onUpdate=ForeignKeyAction.Cascade, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table BlogTable */
  lazy val BlogTable = new TableQuery(tag => new BlogTable(tag))

  /** Entity class storing rows of table EntryTable
   *  @param markdown Database column markdown SqlType(text), Default(None)
   *  @param title Database column title SqlType(name), Default(None)
   *  @param blogId Database column blog_id SqlType(int8)
   *  @param modified Database column modified SqlType(timestamp), Default(None)
   *  @param created Database column created SqlType(timestamp), Default(None)
   *  @param entryId Database column entry_id SqlType(bigserial), AutoInc, PrimaryKey */
  case class Entry(markdown: Option[String] = None, title: Option[String] = None, blogId: Long, modified: Option[java.sql.Timestamp] = None, created: Option[java.sql.Timestamp] = None, entryId: Option[Long] = None)
  /** GetResult implicit for fetching Entry objects using plain SQL queries */
  implicit def GetResultEntry(implicit e0: GR[Option[String]], e1: GR[Long], e2: GR[Option[java.sql.Timestamp]], e3: GR[Option[Long]]): GR[Entry] = GR{
    prs => import prs._
    val r = (<<?[String], <<?[Long], <<?[String], <<[Long], <<?[java.sql.Timestamp], <<?[java.sql.Timestamp])
    import r._
    Entry.tupled((_1, _3, _4, _5, _6, _2)) // putting AutoInc last
  }
  /** Table description of table entry. Objects of this class serve as prototypes for rows in queries. */
  class EntryTable(_tableTag: Tag) extends Table[Entry](_tableTag, "entry") {
    def * = (markdown, title, blogId, modified, created, Rep.Some(entryId)) <> (Entry.tupled, Entry.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (markdown, title, Rep.Some(blogId), modified, created, Rep.Some(entryId)).shaped.<>({r=>import r._; _3.map(_=> Entry.tupled((_1, _2, _3.get, _4, _5, _6)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column markdown SqlType(text), Default(None) */
    val markdown: Rep[Option[String]] = column[Option[String]]("markdown", O.Default(None))
    /** Database column title SqlType(name), Default(None) */
    val title: Rep[Option[String]] = column[Option[String]]("title", O.Default(None))
    /** Database column blog_id SqlType(int8) */
    val blogId: Rep[Long] = column[Long]("blog_id")
    /** Database column modified SqlType(timestamp), Default(None) */
    val modified: Rep[Option[java.sql.Timestamp]] = column[Option[java.sql.Timestamp]]("modified", O.Default(None))
    /** Database column created SqlType(timestamp), Default(None) */
    val created: Rep[Option[java.sql.Timestamp]] = column[Option[java.sql.Timestamp]]("created", O.Default(None))
    /** Database column entry_id SqlType(bigserial), AutoInc, PrimaryKey */
    val entryId: Rep[Long] = column[Long]("entry_id", O.AutoInc, O.PrimaryKey)

    /** Foreign key referencing BlogTable (database name entry_blog_id_fkey) */
    lazy val blogTableFk = foreignKey("entry_blog_id_fkey", blogId, BlogTable)(r => r.blogId, onUpdate=ForeignKeyAction.Cascade, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table EntryTable */
  lazy val EntryTable = new TableQuery(tag => new EntryTable(tag))

  /** Entity class storing rows of table UserTable
   *  @param email Database column email SqlType(varchar), Length(254,true)
   *  @param userName Database column user_name SqlType(varchar), Length(255,true)
   *  @param displayName Database column display_name SqlType(varchar), Length(255,true), Default(None)
   *  @param bio Database column bio SqlType(text), Default(None)
   *  @param avatarUrl Database column avatar_url SqlType(varchar), Length(2048,true), Default(None)
   *  @param passwordHash Database column password_hash SqlType(varchar), Length(255,true)
   *  @param userId Database column user_id SqlType(bigserial), AutoInc, PrimaryKey */
  case class User(email: String, userName: String, displayName: Option[String] = None, bio: Option[String] = None, avatarUrl: Option[String] = None, passwordHash: String, userId: Option[Long] = None)
  /** GetResult implicit for fetching User objects using plain SQL queries */
  implicit def GetResultUser(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[Option[Long]]): GR[User] = GR{
    prs => import prs._
    val r = (<<?[Long], <<[String], <<[String], <<?[String], <<?[String], <<?[String], <<[String])
    import r._
    User.tupled((_2, _3, _4, _5, _6, _7, _1)) // putting AutoInc last
  }
  /** Table description of table user. Objects of this class serve as prototypes for rows in queries. */
  class UserTable(_tableTag: Tag) extends Table[User](_tableTag, "user") {
    def * = (email, userName, displayName, bio, avatarUrl, passwordHash, Rep.Some(userId)) <> (User.tupled, User.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (Rep.Some(email), Rep.Some(userName), displayName, bio, avatarUrl, Rep.Some(passwordHash), Rep.Some(userId)).shaped.<>({r=>import r._; _1.map(_=> User.tupled((_1.get, _2.get, _3, _4, _5, _6.get, _7)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))

    /** Database column email SqlType(varchar), Length(254,true) */
    val email: Rep[String] = column[String]("email", O.Length(254,varying=true))
    /** Database column user_name SqlType(varchar), Length(255,true) */
    val userName: Rep[String] = column[String]("user_name", O.Length(255,varying=true))
    /** Database column display_name SqlType(varchar), Length(255,true), Default(None) */
    val displayName: Rep[Option[String]] = column[Option[String]]("display_name", O.Length(255,varying=true), O.Default(None))
    /** Database column bio SqlType(text), Default(None) */
    val bio: Rep[Option[String]] = column[Option[String]]("bio", O.Default(None))
    /** Database column avatar_url SqlType(varchar), Length(2048,true), Default(None) */
    val avatarUrl: Rep[Option[String]] = column[Option[String]]("avatar_url", O.Length(2048,varying=true), O.Default(None))
    /** Database column password_hash SqlType(varchar), Length(255,true) */
    val passwordHash: Rep[String] = column[String]("password_hash", O.Length(255,varying=true))
    /** Database column user_id SqlType(bigserial), AutoInc, PrimaryKey */
    val userId: Rep[Long] = column[Long]("user_id", O.AutoInc, O.PrimaryKey)
  }
  /** Collection-like TableQuery object for table UserTable */
  lazy val UserTable = new TableQuery(tag => new UserTable(tag))
}
