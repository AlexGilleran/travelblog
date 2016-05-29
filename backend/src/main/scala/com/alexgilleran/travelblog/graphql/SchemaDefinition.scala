package com.alexgilleran.travelblog.graphql

import scala.concurrent.ExecutionContext.Implicits.global

import com.alexgilleran.travelblog.data.schema.Tables.Entry

import sangria.schema.Action.defaultAction
import sangria.schema.Action.futureAction
import sangria.schema.Argument
import sangria.schema.Field
import sangria.schema.LongType
import sangria.schema.ObjectType
import sangria.schema.OptionType
import sangria.schema.StringType
import sangria.schema.fields
import sangria.schema.Schema

object SchemaDefinition {
  val EntryType: ObjectType[Unit, Entry] = ObjectType(
    "Entry",
    fields[Unit, Entry](
      Field("entryId", OptionType(LongType), resolve = _.value.entryId),
      Field("markdown", OptionType(StringType), resolve = _.value.markdown),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("blogId", OptionType(LongType), resolve = _.value.blogId)))

  val EntryID = Argument("entryId", LongType, description = "id of the entry")

  val Query = ObjectType[BlogRepo, Unit](
    "Query", fields[BlogRepo, Unit](
      Field("entry", EntryType,
        arguments = EntryID :: Nil,
        resolve = (ctx) => ctx.ctx.getEntries(Seq(ctx.arg(EntryID))).map(_.head))))

  val EntrySchema = Schema(Query)
}