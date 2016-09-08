package com.alexgilleran.travelblog.config

import net.ceedubs.ficus.Ficus._
import com.typesafe.config._

/**
 * Wraps around ficus and provides config data.
 */
object Config {
  private val env : String = if (System.getenv("SCALA_ENV") == null) "localdev" else System.getenv("SCALA_ENV")

  private val defaultConf = ConfigFactory.load()
  private val envConf = ConfigFactory.load("env-specific-config/" + env, ConfigParseOptions.defaults().setAllowMissing(false), ConfigResolveOptions.defaults())

  /** The global config, potentially including env-custom settings for libraries like akka */
  val conf = envConf.withFallback(defaultConf)

  /** The app-specific config */
  val app = conf.getConfig("app")
}
