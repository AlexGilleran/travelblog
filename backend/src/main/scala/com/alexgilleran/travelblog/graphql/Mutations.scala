package com.alexgilleran.travelblog.graphql

import com.alexgilleran.travelblog.graphql.SchemaDefinition._
import com.alexgilleran.travelblog.data.schema.Tables._
import sangria.schema.Action._
import sangria.schema._
import sangria.relay._
import scala.concurrent.Future
import com.alexgilleran.travelblog.graphql.BlogRepo._
import scala.concurrent.ExecutionContext.Implicits.global

object Mutations {

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

      ctx.ctx.updateEntry(entryId, title, markdown).map { newEntryNode =>
        UpdateEntryPayload(mutationId, newEntryNode)
      }
    })

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

  case class AddEntryPayload(clientMutationId: String, blogId: Long, entry: EntryNode) extends Mutation
  val AddEntryMutation = Mutation.fieldWithClientMutationId[SecureContext, Unit, AddEntryPayload, InputObjectType.DefaultInput](
    "addEntryToBlog",
    "AddEntryToBlog",
    inputFields = List(
      InputField("blogId", LongType),
      InputField("markdown", OptionInputType(StringType)),
      InputField("title", OptionInputType(StringType))),
    outputFields = fields(
      Field("blog", BlogType, resolve = ctx => BlogNode(Blog(blogId = Some(ctx.value.blogId), userId = 0, name = ""))),
      Field("entryEdge", SchemaDefinition.blogEntryEdge, resolve = ctx => Edge(ctx.value.entry, ctx.value.entry.id))),
    mutateAndGetPayload = (input, ctx) ⇒ {
      val mutationId = input(Mutation.ClientMutationIdFieldName).asInstanceOf[String]
      val blogId = input("blogId").asInstanceOf[Long]
      val title = input("title").asInstanceOf[Option[String]]
      val markdown = input("markdown").asInstanceOf[Option[String]]

      val newEntry = Entry(
        blogId = blogId,
        title = title,
        markdown = markdown)
      val entryFuture = ctx.ctx.addEntry(newEntry)

      entryFuture.map { entry =>
        new AddEntryPayload(mutationId, blogId, entry)
      }
    })

  val MutationType = ObjectType(
    "Mutation",
    () => fields[SecureContext, Unit](
      RefreshCurrentUserMutation,
      UpdateEntryMutation,
      AddEntryMutation))
}