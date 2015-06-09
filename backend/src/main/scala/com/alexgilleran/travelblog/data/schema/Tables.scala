package com.alexgilleran.travelblog.data.schema
// AUTO-GENERATED Slick data model
/** Stand-alone Slick data model for immediate use */
object Tables extends {
  val profile = scala.slick.driver.PostgresDriver
} with Tables

/** Slick data model trait for extension, choice of backend or usage in the cake pattern. (Make sure to initialize this late.) */
trait Tables {
  val profile: scala.slick.driver.JdbcProfile
  import profile.simple._
  import scala.slick.model.ForeignKeyAction
  // NOTE: GetResult mappers for plain SQL are only generated for tables where Slick knows how to map the types of all columns.
  import scala.slick.jdbc.{GetResult => GR}
  
  /** DDL for all tables. Call .create to execute. */
  lazy val ddl = BlogTable.ddl ++ EntryTable.ddl ++ UserTable.ddl
  
  /** Entity class storing rows of table BlogTable
   *  @param name Database column name DBType(name), Length(2147483647,true)
   *  @param description Database column description DBType(text), Length(2147483647,true), Default(None)
   *  @param userId Database column user_id DBType(int8)
   *  @param blogId Database column blog_id DBType(bigserial), AutoInc, PrimaryKey */
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
    def * = (name, description, userId, blogId.?) <> (Blog.tupled, Blog.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (name.?, description, userId.?, blogId.?).shaped.<>({r=>import r._; _1.map(_=> Blog.tupled((_1.get, _2, _3.get, _4)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))
    
    /** Database column name DBType(name), Length(2147483647,true) */
    val name: Column[String] = column[String]("name", O.Length(2147483647,varying=true))
    /** Database column description DBType(text), Length(2147483647,true), Default(None) */
    val description: Column[Option[String]] = column[Option[String]]("description", O.Length(2147483647,varying=true), O.Default(None))
    /** Database column user_id DBType(int8) */
    val userId: Column[Long] = column[Long]("user_id")
    /** Database column blog_id DBType(bigserial), AutoInc, PrimaryKey */
    val blogId: Column[Long] = column[Long]("blog_id", O.AutoInc, O.PrimaryKey)
    
    /** Foreign key referencing UserTable (database name blog_user_id_fkey) */
    lazy val userTableFk = foreignKey("blog_user_id_fkey", userId, UserTable)(r => r.userId, onUpdate=ForeignKeyAction.Cascade, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table BlogTable */
  lazy val BlogTable = new TableQuery(tag => new BlogTable(tag))
  
  /** Entity class storing rows of table EntryTable
   *  @param markdown Database column markdown DBType(text), Length(2147483647,true)
   *  @param title Database column title DBType(name), Length(2147483647,true), Default(None)
   *  @param blogId Database column blog_id DBType(int8)
   *  @param entryId Database column entry_id DBType(bigserial), AutoInc, PrimaryKey */
  case class Entry(markdown: String, title: Option[String] = None, blogId: Long, entryId: Option[Long] = None)
  /** GetResult implicit for fetching Entry objects using plain SQL queries */
  implicit def GetResultEntry(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[Long], e3: GR[Option[Long]]): GR[Entry] = GR{
    prs => import prs._
    val r = (<<[String], <<?[Long], <<?[String], <<[Long])
    import r._
    Entry.tupled((_1, _3, _4, _2)) // putting AutoInc last
  }
  /** Table description of table entry. Objects of this class serve as prototypes for rows in queries. */
  class EntryTable(_tableTag: Tag) extends Table[Entry](_tableTag, "entry") {
    def * = (markdown, title, blogId, entryId.?) <> (Entry.tupled, Entry.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (markdown.?, title, blogId.?, entryId.?).shaped.<>({r=>import r._; _1.map(_=> Entry.tupled((_1.get, _2, _3.get, _4)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))
    
    /** Database column markdown DBType(text), Length(2147483647,true) */
    val markdown: Column[String] = column[String]("markdown", O.Length(2147483647,varying=true))
    /** Database column title DBType(name), Length(2147483647,true), Default(None) */
    val title: Column[Option[String]] = column[Option[String]]("title", O.Length(2147483647,varying=true), O.Default(None))
    /** Database column blog_id DBType(int8) */
    val blogId: Column[Long] = column[Long]("blog_id")
    /** Database column entry_id DBType(bigserial), AutoInc, PrimaryKey */
    val entryId: Column[Long] = column[Long]("entry_id", O.AutoInc, O.PrimaryKey)
    
    /** Foreign key referencing BlogTable (database name entry_blog_id_fkey) */
    lazy val blogTableFk = foreignKey("entry_blog_id_fkey", blogId, BlogTable)(r => r.blogId, onUpdate=ForeignKeyAction.Cascade, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table EntryTable */
  lazy val EntryTable = new TableQuery(tag => new EntryTable(tag))
  
  /** Entity class storing rows of table UserTable
   *  @param email Database column email DBType(varchar), Length(254,true)
   *  @param userName Database column user_name DBType(varchar), Length(255,true)
   *  @param displayName Database column display_name DBType(varchar), Length(255,true), Default(None)
   *  @param bio Database column bio DBType(text), Length(2147483647,true), Default(None)
   *  @param avatarUrl Database column avatar_url DBType(varchar), Length(2048,true), Default(None)
   *  @param passwordHash Database column password_hash DBType(varchar), Length(255,true)
   *  @param userId Database column user_id DBType(bigserial), AutoInc, PrimaryKey */
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
    def * = (email, userName, displayName, bio, avatarUrl, passwordHash, userId.?) <> (User.tupled, User.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (email.?, userName.?, displayName, bio, avatarUrl, passwordHash.?, userId.?).shaped.<>({r=>import r._; _1.map(_=> User.tupled((_1.get, _2.get, _3, _4, _5, _6.get, _7)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))
    
    /** Database column email DBType(varchar), Length(254,true) */
    val email: Column[String] = column[String]("email", O.Length(254,varying=true))
    /** Database column user_name DBType(varchar), Length(255,true) */
    val userName: Column[String] = column[String]("user_name", O.Length(255,varying=true))
    /** Database column display_name DBType(varchar), Length(255,true), Default(None) */
    val displayName: Column[Option[String]] = column[Option[String]]("display_name", O.Length(255,varying=true), O.Default(None))
    /** Database column bio DBType(text), Length(2147483647,true), Default(None) */
    val bio: Column[Option[String]] = column[Option[String]]("bio", O.Length(2147483647,varying=true), O.Default(None))
    /** Database column avatar_url DBType(varchar), Length(2048,true), Default(None) */
    val avatarUrl: Column[Option[String]] = column[Option[String]]("avatar_url", O.Length(2048,varying=true), O.Default(None))
    /** Database column password_hash DBType(varchar), Length(255,true) */
    val passwordHash: Column[String] = column[String]("password_hash", O.Length(255,varying=true))
    /** Database column user_id DBType(bigserial), AutoInc, PrimaryKey */
    val userId: Column[Long] = column[Long]("user_id", O.AutoInc, O.PrimaryKey)
  }
  /** Collection-like TableQuery object for table UserTable */
  lazy val UserTable = new TableQuery(tag => new UserTable(tag))
}