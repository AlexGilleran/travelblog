package com.alexgilleran.travelblog.session

import com.alexgilleran.travelblog.data.schema.Tables.User

/**
 * Created by Alex on 2015-05-06.
 */
case class Session(val token: String, userId: Option[Long] = None) {

}
