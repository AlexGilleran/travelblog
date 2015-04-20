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
  lazy val ddl = Blog.ddl ++ Entry.ddl
  
  /** Entity class storing rows of table Blog
   *  @param name Database column name DBType(name), Length(2147483647,true)
   *  @param description Database column description DBType(text), Length(2147483647,true), Default(None)
   *  @param blogId Database column blog_id DBType(bigserial), AutoInc, PrimaryKey */
  case class BlogRow(name: String, description: Option[String] = None, blogId: Option[Long] = None)
  /** GetResult implicit for fetching BlogRow objects using plain SQL queries */
  implicit def GetResultBlogRow(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[Option[Long]]): GR[BlogRow] = GR{
    prs => import prs._
    val r = (<<?[Long], <<[String], <<?[String])
    import r._
    BlogRow.tupled((_2, _3, _1)) // putting AutoInc last
  }
  /** Table description of table blog. Objects of this class serve as prototypes for rows in queries. */
  class Blog(_tableTag: Tag) extends Table[BlogRow](_tableTag, "blog") {
    def * = (name, description, blogId.?) <> (BlogRow.tupled, BlogRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (name.?, description, blogId.?).shaped.<>({r=>import r._; _1.map(_=> BlogRow.tupled((_1.get, _2, _3)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))
    
    /** Database column name DBType(name), Length(2147483647,true) */
    val name: Column[String] = column[String]("name", O.Length(2147483647,varying=true))
    /** Database column description DBType(text), Length(2147483647,true), Default(None) */
    val description: Column[Option[String]] = column[Option[String]]("description", O.Length(2147483647,varying=true), O.Default(None))
    /** Database column blog_id DBType(bigserial), AutoInc, PrimaryKey */
    val blogId: Column[Long] = column[Long]("blog_id", O.AutoInc, O.PrimaryKey)
    
    /** Foreign key referencing Blog (database name blog_blog_id_fkey) */
    lazy val blogFk = foreignKey("blog_blog_id_fkey", blogId, Blog)(r => r.blogId, onUpdate=ForeignKeyAction.Cascade, onDelete=ForeignKeyAction.Cascade)
  }
  /** Collection-like TableQuery object for table Blog */
  lazy val Blog = new TableQuery(tag => new Blog(tag))
  
  /** Entity class storing rows of table Entry
   *  @param markdown Database column markdown DBType(text), Length(2147483647,true)
   *  @param title Database column title DBType(name), Length(2147483647,true), Default(None)
   *  @param blogId Database column blog_id DBType(int8), Default(None)
   *  @param entryId Database column entry_id DBType(bigserial), AutoInc, PrimaryKey */
  case class EntryRow(markdown: String, title: Option[String] = None, blogId: Option[Long] = None, entryId: Option[Long] = None)
  /** GetResult implicit for fetching EntryRow objects using plain SQL queries */
  implicit def GetResultEntryRow(implicit e0: GR[String], e1: GR[Option[String]], e2: GR[Option[Long]]): GR[EntryRow] = GR{
    prs => import prs._
    val r = (<<[String], <<?[Long], <<?[String], <<?[Long])
    import r._
    EntryRow.tupled((_1, _3, _4, _2)) // putting AutoInc last
  }
  /** Table description of table entry. Objects of this class serve as prototypes for rows in queries. */
  class Entry(_tableTag: Tag) extends Table[EntryRow](_tableTag, "entry") {
    def * = (markdown, title, blogId, entryId.?) <> (EntryRow.tupled, EntryRow.unapply)
    /** Maps whole row to an option. Useful for outer joins. */
    def ? = (markdown.?, title, blogId, entryId.?).shaped.<>({r=>import r._; _1.map(_=> EntryRow.tupled((_1.get, _2, _3, _4)))}, (_:Any) =>  throw new Exception("Inserting into ? projection not supported."))
    
    /** Database column markdown DBType(text), Length(2147483647,true) */
    val markdown: Column[String] = column[String]("markdown", O.Length(2147483647,varying=true))
    /** Database column title DBType(name), Length(2147483647,true), Default(None) */
    val title: Column[Option[String]] = column[Option[String]]("title", O.Length(2147483647,varying=true), O.Default(None))
    /** Database column blog_id DBType(int8), Default(None) */
    val blogId: Column[Option[Long]] = column[Option[Long]]("blog_id", O.Default(None))
    /** Database column entry_id DBType(bigserial), AutoInc, PrimaryKey */
    val entryId: Column[Long] = column[Long]("entry_id", O.AutoInc, O.PrimaryKey)
  }
  /** Collection-like TableQuery object for table Entry */
  lazy val Entry = new TableQuery(tag => new Entry(tag))
}