package com.alexgilleran.travelblog.graphql

import sangria.schema._
import scala.concurrent.Future
import com.alexgilleran.travelblog.data.schema.Tables.Entry

object SchemaDefinition {
  val EntryType: ObjectType[Unit, Entry] =
    ObjectType("Entry", fields[Unit, Entry](
      Field("entryId", OptionType(LongType), resolve = _.value.entryId),
      Field("markdown", OptionType(StringType), resolve = _.value.markdown),
      Field("title", OptionType(StringType), resolve = _.value.title),
      Field("blogId", OptionType(LongType), resolve = _.value.blogId)))

  val EntryID = Argument("entryId", LongType, description = "id of the entry")

  val Query = ObjectType[GraphQLContext, Unit](
    "Query", fields[GraphQLContext, Unit](
      Field("entry", Entry,
          arguments = EntryID :: Nil,
          resolve = (ctx) => ctx.ctx.getHero(ctx.argOpt(EpisodeArg))))

  val EntrySchema = Schema(EntryType)
}