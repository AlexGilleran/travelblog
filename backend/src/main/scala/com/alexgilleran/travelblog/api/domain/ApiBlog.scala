package com.alexgilleran.travelblog.api.domain

import com.alexgilleran.travelblog.data.schema.Tables.{BlogRow, EntryRow}

/**
 * Created by Alex on 2015-04-12.
 */
case class ApiBlog(blog: BlogRow, entries: Seq[EntryRow])

