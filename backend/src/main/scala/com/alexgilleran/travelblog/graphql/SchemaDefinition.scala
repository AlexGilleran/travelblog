package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global

import com.alexgilleran.travelblog.data.schema.Tables.Blog
import com.alexgilleran.travelblog.data.schema.Tables.Entry

import sangria.schema.Action.defaultAction
import sangria.schema.Action.deferredAction
import sangria.schema.Action.futureAction
import sangria.schema.Argument
import sangria.schema.Field
import sangria.schema.ListType
import sangria.schema.LongType
import sangria.schema.ObjectType
import sangria.schema.OptionType
import sangria.schema.Schema
import sangria.schema.StringType
import sangria.schema.fields

object SchemaDefinition {

  val EntryType: ObjectType[Unit, Entry] = ObjectType(
    "Entry",
    fields[Unit, Entry](
      Field("entryId", OptionType(LongType), resolve = _.value.entryId),
      Field("markdown", StringType, resolve = _.value.markdown),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("blogId", LongType, resolve = _.value.blogId),
      Field("blog", OptionType(BlogType), resolve = (ctx) => DeferBlog(ctx.value.blogId))))

  val BlogType: ObjectType[BlogRepo, Blog] = ObjectType(
    "Blog",
    fields[BlogRepo, Blog](
      Field("blogId", OptionType(LongType), resolve = _.value.blogId),
      Field("name", StringType, resolve = _.value.name),
      Field("description", OptionType(StringType), resolve = _.value.description),
      Field("userId", LongType, resolve = _.value.userId),
      Field("entries", ListType(EntryType), resolve = (ctx) => DeferEntriesForBlog(ctx.value.blogId.get))))

  val EntryID = Argument("entryId", LongType, description = "id of the entry")
  val BlogID = Argument("blogId", LongType, description = "id of the blog")

  val Query = ObjectType[BlogRepo, Unit](
    "Query", fields[BlogRepo, Unit](
      Field("blog", OptionType(BlogType),
        arguments = BlogID :: Nil,
        resolve = (ctx) => ctx.ctx.getBlog(ctx.arg(BlogID))),
      Field("entry", EntryType,
        arguments = EntryID :: Nil,
        resolve = (ctx) => ctx.ctx.getEntry(ctx.arg(EntryID)).map(_.head))))

  val EntrySchema = Schema(Query)
}