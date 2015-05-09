package com.alexgilleran.travelblog.session

import com.alexgilleran.travelblog.data.schema.Tables.User
import scala.collection.mutable

/**
 * Created by Alex on 2015-05-06.
 */
trait SessionManager {
  def getSession(id: String): Option[Session]

  def newSession(user : User): (String, Session)
}

class SessionManagerStub extends SessionManager {
  val sessionMap : mutable.Map[String, Session] = mutable.Map()

  override def getSession(id: String): Option[Session] = {
    sessionMap.get(id)
  }

  override def newSession(user : User): (String, Session) = {
    var uuid : String = null
    do {
      uuid = java.util.UUID.randomUUID().toString
    } while (sessionMap.contains(uuid))

    val session : Session = new Session(user)

    sessionMap += uuid -> session

    (uuid, session)
  }
}
