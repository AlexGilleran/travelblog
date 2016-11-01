package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global

import com.alexgilleran.travelblog.data.schema.Tables._

import sangria.schema.Action._
import sangria.schema._
import sangria.relay._
import scala.concurrent.Future
import com.alexgilleran.travelblog.graphql.BlogRepo._
import sangria.macros.derive

object SchemaDefinition {

  val NodeDefinition(nodeInterface, nodeField) =
    Node.definition((globalId: GlobalId, ctx: Context[SecureContext, Unit]) ⇒ {
      if (globalId.typeName == "Entry")
        ctx.ctx.blogRepo.getEntry(globalId.id.toLong)
      else if (globalId.typeName == "Blog")
        ctx.ctx.blogRepo.getBlog(globalId.id.toLong)
      else if (globalId.typeName == "User")
        ctx.ctx.blogRepo.getUser(globalId.id.toLong)
      else
        None
    }, Node.possibleNodeTypes[SecureContext, Node](EntryType))

  def idFields[T: Identifiable] = fields[Unit, T](
    Node.globalIdField,
    Field("rawId", StringType, resolve = ctx ⇒ implicitly[Identifiable[T]].id(ctx.value)))

  val EntryID = Argument("entryId", LongType, description = "id of the entry")
  val BlogID = Argument("blogId", LongType, description = "id of the blog")
  val UserID = Argument("userId", LongType, description = "id of the user")
  val First = Argument("first", IntType, description = "first n to get")

  lazy val EntryType: ObjectType[Unit, EntryNode] = ObjectType(
    "Entry",
    "An entry",
    interfaces[Unit, EntryNode](nodeInterface),
    () => idFields[EntryNode] ++ fields[Unit, EntryNode](
      Field("entryId", OptionType(LongType), resolve = _.value.entry.entryId),
      Field("markdown", StringType, resolve = _.value.entry.markdown),
      Field("title", OptionType(StringType), resolve = _.value.entry.title),
      Field("blogId", LongType, resolve = _.value.entry.blogId),
      Field("blog", OptionType(BlogType), resolve = (ctx) => DeferBlog(ctx.value.entry.blogId))))

  lazy val EntryInputType = InputObjectType[EntryNode](
    "Entry",
    "An entry",
    () => List(
      InputField("markdown", StringType),
      InputField("title", StringType),
      InputField("blogId", LongType)))

  lazy val BlogType: ObjectType[Unit, BlogNode] = ObjectType(
    "Blog",
    "aerg",
    interfaces[Unit, BlogNode](nodeInterface),
    () => idFields[BlogNode] ++ fields[Unit, BlogNode](
      Field("blogId", OptionType(LongType), resolve = _.value.blog.blogId),
      Field("name", StringType, resolve = _.value.blog.name),
      Field("description", OptionType(StringType), resolve = _.value.blog.description),
      Field("userId", LongType, resolve = _.value.blog.userId),
      Field("user", OptionType(UserType), resolve = (ctx) => DeferUser(ctx.value.blog.userId)),
      Field("entries", ListType(EntryType), resolve = (ctx) => DeferEntriesForBlog(ctx.value.blog.blogId.get))))

  val ConnectionDefinition(_, blogConnection) = Connection.definition[SecureContext, Connection, BlogNode]("Blog", BlogType)

  lazy val UserType: ObjectType[SecureContext, UserNode] = ObjectType(
    "User",
    "aregaerg",
    interfaces[SecureContext, UserNode](nodeInterface),
    () => fields[SecureContext, UserNode](
      Node.globalIdField[SecureContext, UserNode],
      Field("userId", OptionType(LongType), resolve = _.value.user.userId),
      Field("userName", StringType, resolve = _.value.user.userName),
      Field("displayName", OptionType(StringType), resolve = _.value.user.displayName),
      Field("bio", OptionType(StringType), resolve = _.value.user.bio),
      Field("avatarUrl", OptionType(StringType), resolve = _.value.user.avatarUrl),
      Field("email", StringType, resolve = _.value.user.email),
      Field("blogs", blogConnection,
        arguments = List(Connection.Args.After, Connection.Args.First),
        resolve = (ctx) => {
          val userId = ctx.value.user.userId.get
          val after = ctx.args.arg(Connection.Args.After).map(_.toLong)
          val size = ctx.args.arg(Connection.Args.First).map(_.toInt).getOrElse(5)

          Connection.connectionFromFutureSeq(ctx.ctx.blogRepo.getBlogsForUser(userId, size + 1, after), ConnectionArgs(ctx))
        })))

  val MutationType = ObjectType(
    "Mutation",
    () => fields[SecureContext, Unit](
      RefreshCurrentUserMutation,
      UpdateEntryMutation))

  val ViewerType: ObjectType[Unit, ViewerNode] = ObjectType(
    "Viewer",
    () => idFields[ViewerNode] ++ fields[Unit, ViewerNode](
      Field("blog", OptionType(BlogType),
        arguments = BlogID :: Nil,
        resolve = (ctx) => DeferBlog(ctx.arg(BlogID))),
      Field("blogs", ListType(BlogType),
        arguments = First :: Nil,
        resolve = (ctx) => DeferBlogs(ctx.arg(First))),
      Field("entry", OptionType(EntryType),
        arguments = EntryID :: Nil,
        resolve = (ctx) => DeferEntry(ctx.arg(EntryID))),
      Field("user", OptionType(UserType),
        arguments = UserID :: Nil,
        resolve = (ctx) => DeferUser(ctx.arg(UserID))),
      Field("currentUser", OptionType(UserType),
        arguments = Nil,
        resolve = (ctx) => DeferCurrentUser)))

  case class RefreshCurrentUserPayload(clientMutationId: String, currentUser: Option[UserNode]) extends Mutation
  val RefreshCurrentUserMutation = Mutation.fieldWithClientMutationId[SecureContext, Unit, RefreshCurrentUserPayload, InputObjectType.DefaultInput](
    "refreshCurrentUser",
    "RefreshCurrentUser",
    outputFields = fields(Field("viewer", ViewerType, resolve = ctx => new ViewerNode)),
    mutateAndGetPayload = (input, ctx) ⇒ {
      val mutationId = input(Mutation.ClientMutationIdFieldName).asInstanceOf[String]

      ctx.ctx.currentUser().map { user =>
        RefreshCurrentUserPayload(mutationId, user)
      }
    })

  case class UpdateEntryPayload(clientMutationId: String, entry: EntryNode) extends Mutation
  val UpdateEntryMutation = Mutation.fieldWithClientMutationId[SecureContext, Unit, UpdateEntryPayload, InputObjectType.DefaultInput](
    "updateEntry",
    "UpdateEntry",
    inputFields = List(
      InputField("entryId", LongType),
      InputField("markdown", StringType),
      InputField("title", StringType)),
    outputFields = fields(Field("entry", EntryType, resolve = ctx => ctx.value.entry)),
    mutateAndGetPayload = (input, ctx) ⇒ {
      val mutationId = input(Mutation.ClientMutationIdFieldName).asInstanceOf[String]
      val entryId = input("entryId").asInstanceOf[Long]
      val markdown = input("markdown").asInstanceOf[String]
      val title = input("title").asInstanceOf[String]

      ctx.ctx.blogRepo.getEntry(entryId).flatMap { oldEntry =>
        val newEntry = oldEntry.get.entry.copy(markdown = markdown, title = Some(title))
        ctx.ctx.blogRepo.updateEntry(entryId, newEntry)
          .map(_ => oldEntry.get.copy(entry = newEntry))
      } map { newEntryNode =>
        UpdateEntryPayload(mutationId, newEntryNode)
      }
    })

  def optionToSeq[T](option: Option[T]): Seq[T] = option match {
    case Some(inner) => Seq(inner)
    case None        => Nil
  }

  val Query = ObjectType[SecureContext, Unit](
    "Query", fields[SecureContext, Unit](
      Field("viewer", ViewerType,
        arguments = Nil,
        resolve = (ctx) => new ViewerNode())))

  val schema = Schema(Query, Some(MutationType))
}