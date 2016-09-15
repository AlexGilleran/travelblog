package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global

import com.alexgilleran.travelblog.data.schema.Tables.Blog
import com.alexgilleran.travelblog.data.schema.Tables.Entry

import sangria.schema.Action._
import sangria.schema._

object SchemaDefinition {
  case class App()
  val ViewerType: ObjectType[Unit, App] = ObjectType(
    "Viewer",
    () => fields[Unit, App](
      Field("blogs", ListType(BlogType),
        arguments = First :: Nil,
        resolve = (ctx) => DeferBlogs(ctx.arg(First))),
      Field("blog", OptionType(BlogType),
        arguments = BlogID :: Nil,
        resolve = (ctx) => DeferBlog(ctx.arg(BlogID)))))

  lazy val EntryType: ObjectType[Unit, Entry] = ObjectType(
    "Entry",
    () => fields[Unit, Entry](
      Field("entryId", OptionType(LongType), resolve = _.value.entryId),
      Field("markdown", StringType, resolve = _.value.markdown),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("blogId", LongType, resolve = _.value.blogId),
      Field("blog", OptionType(BlogType), resolve = (ctx) => DeferBlog(ctx.value.blogId))))

  lazy val BlogType: ObjectType[BlogRepo, Blog] = ObjectType(
    "Blog",
    () => fields[BlogRepo, Blog](
      Field("blogId", OptionType(LongType), resolve = _.value.blogId),
      Field("name", StringType, resolve = _.value.name),
      Field("description", OptionType(StringType), resolve = _.value.description),
      Field("userId", LongType, resolve = _.value.userId),
      Field("entries", ListType(EntryType), resolve = (ctx) => DeferEntriesForBlog(ctx.value.blogId.get))))

  val EntryID = Argument("entryId", LongType, description = "id of the entry")
  val BlogID = Argument("blogId", LongType, description = "id of the blog")
  val First = Argument("first", IntType, description = "first n to get")

  val Query = ObjectType[BlogRepo, Unit](
    "Query", fields[BlogRepo, Unit](
      Field("viewer", ViewerType,
        arguments = Nil,
        resolve = (ctx) => new App()),
      Field("blogs", ListType(BlogType),
        arguments = First :: Nil,
        resolve = (ctx) => ctx.ctx.getBlogs(ctx.arg(First))),
      Field("blog", OptionType(BlogType),
        arguments = BlogID :: Nil,
        resolve = (ctx) => ctx.ctx.getBlog(ctx.arg(BlogID))),
      Field("entry", EntryType,
        arguments = EntryID :: Nil,
        resolve = (ctx) => ctx.ctx.getEntry(ctx.arg(EntryID)).map(_.head))))

  val schema = Schema(Query)
}