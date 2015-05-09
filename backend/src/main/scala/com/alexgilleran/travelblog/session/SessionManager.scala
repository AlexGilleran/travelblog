package com.alexgilleran.travelblog.session

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionManager {
  def getSession(id: Long): Option[Session]

  def newSession(): Session
}

class SessionManagerStub extends SessionManager {
  override def getSession(id: Long): Option[Session] = {
    return Option(new Session("123"))
  }

  override def newSession(): Session = {
    return new Session("123")
  }
}
