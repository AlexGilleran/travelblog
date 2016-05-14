import sbt.Keys._

enablePlugins(JavaAppPackaging)

lazy val sharedSettings = Seq(
  organization := "com.alexgilleran.travelblog",
  version := "0.1",
  scalaVersion := "2.11.6",
  scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8"),
  libraryDependencies ++= {
    val akkaV = "2.4.4"
    val sprayV = "1.3.3"
    Seq(
      "com.typesafe.akka" %% "akka-http-core" % akkaV,
      "com.typesafe.akka" %% "akka-http-experimental" % akkaV,
      "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaV,
      "com.typesafe.akka" %% "akka-http-testkit" % akkaV % "test",
      "com.typesafe.akka" %% "akka-actor" % akkaV,
      "com.typesafe.akka" %% "akka-testkit" % akkaV % "test",
      "org.specs2" %% "specs2-core" % "2.3.11" % "test",
      "com.typesafe.slick" %% "slick" % "2.1.0",
      "com.typesafe.slick" %% "slick-codegen" % "2.1.0",
      "ch.qos.logback" % "logback-classic" % "1.0.9",
      "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
      "net.ceedubs" %% "ficus" % "1.1.2"
    )
  }
)

lazy val root : Project = Project(
  id = "backend",
  base = file("."),
  settings = sharedSettings
).dependsOn(codegenProject)

/** codegen project containing the customized code generator */
lazy val codegenProject: Project = Project(
  id = "codegen",
  base = file("codegen"),
  settings = sharedSettings
)

slick <<= slickCodeGenTask // register manual sbt command
//sourceGenerators in Compile <+= slickCodeGenTask // register automatic code generation on every compile, remove for only manual use

// code generation task
lazy val slick = TaskKey[Seq[File]]("gen-tables")
lazy val slickCodeGenTask = (sourceDirectory, dependencyClasspath in Compile, runner in Compile, streams) map { (dir, cp, r, s) =>
  val outputDir = (dir / "main" / "scala").getPath // place generated files in sbt's managed sources folder
  val url = "jdbc:postgresql:TravelBlog?user=postgres&password=p4ssw0rd" // connection info for a pre-populated throw-away, in-memory db for this demo, which is freshly initialized on every run
  val jdbcDriver = "org.postgresql.Driver"
  val slickDriver = "scala.slick.driver.PostgresDriver"
  val pkg = "com.alexgilleran.travelblog.data.schema"
  toError(r.run("com.alexgilleran.travelblog.CustomSourceGenerator", cp.files, Array(slickDriver, jdbcDriver, url, outputDir, pkg), s.log))
  val fname = outputDir + "/com/alexgilleran/travelblog/data/schema/Tables.scala"
  Seq(file(fname))
}

//test in assembly := {}

EclipseKeys.executionEnvironment := Some(EclipseExecutionEnvironment.JavaSE18)
EclipseKeys.withSource := true
EclipseKeys.withJavadoc := true


Revolver.settings