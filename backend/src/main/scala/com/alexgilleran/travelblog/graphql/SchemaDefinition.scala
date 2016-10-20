package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global

import com.alexgilleran.travelblog.data.schema.Tables._

import sangria.schema.Action._
import sangria.schema._
import scala.concurrent.Future

object SchemaDefinition {

  val EntryID = Argument("entryId", LongType, description = "id of the entry")
  val BlogID = Argument("blogId", LongType, description = "id of the blog")
  val First = Argument("first", IntType, description = "first n to get")
  val UserNameArg = Argument("input", StringType)

  lazy val EntryType: ObjectType[Unit, Entry] = ObjectType(
    "Entry",
    () => fields[Unit, Entry](
      Field("entryId", OptionType(LongType), resolve = _.value.entryId),
      Field("markdown", StringType, resolve = _.value.markdown),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("blogId", LongType, resolve = _.value.blogId),
      Field("blog", OptionType(BlogType), resolve = (ctx) => DeferBlog(ctx.value.blogId))))

  lazy val BlogType: ObjectType[SecureContext, Blog] = ObjectType(
    "Blog",
    () => fields[SecureContext, Blog](
      Field("blogId", OptionType(LongType), resolve = _.value.blogId),
      Field("name", StringType, resolve = _.value.name),
      Field("description", OptionType(StringType), resolve = _.value.description),
      Field("userId", LongType, resolve = _.value.userId),
      Field("entries", ListType(EntryType), resolve = (ctx) => DeferEntriesForBlog(ctx.value.blogId.get))))

  lazy val UserType: ObjectType[SecureContext, User] = ObjectType(
    "User",
    () => fields[SecureContext, User](
      Field("userId", OptionType(LongType), resolve = _.value.userId),
      Field("userName", StringType, resolve = _.value.userName)))

  lazy val LoginPayloadType: ObjectType[SecureContext, LoginPayload] = ObjectType(
    "LoginPayload",
    () => fields[SecureContext, LoginPayload](
      Field("viewer", ViewerType, resolve = ctx => new Viewer())))

  lazy val MutationType = ObjectType(
    "Mutation",
    () => fields[SecureContext, Unit](
      Field("login", LoginPayloadType,
        arguments = List(UserNameArg),
        resolve = ctx ⇒ new LoginPayload(Viewer()))))

  val ViewerType: ObjectType[Unit, Viewer] = ObjectType(
    "Viewer",
    () => fields[Unit, Viewer](
      Field("blog", OptionType(BlogType),
        arguments = BlogID :: Nil,
        resolve = (ctx) => DeferBlog(ctx.arg(BlogID))),
      Field("blogs", ListType(BlogType),
        arguments = First :: Nil,
        resolve = (ctx) => DeferBlogs(ctx.arg(First))),
      Field("entry", OptionType(EntryType),
        arguments = EntryID :: Nil,
        resolve = (ctx) => DeferEntry(ctx.arg(EntryID))),
      Field("currentUser", OptionType(UserType),
        arguments = List(),
        resolve = (ctx) => DeferCurrentUser)))

  val Query = ObjectType[SecureContext, Unit](
    "Query", fields[SecureContext, Unit](
      Field("viewer", ViewerType,
        arguments = Nil,
        resolve = (ctx) => new Viewer())))

  val schema = Schema(Query, Some(MutationType))
}