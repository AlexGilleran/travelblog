package com.alexgilleran.travelblog.session

import com.alexgilleran.travelblog.session.Session
/**
 * Created by Alex on 2015-05-06.
 */
trait SessionManager {
  def getSession(id : Long) : Option[Session]
  def newSession() : Session
}
