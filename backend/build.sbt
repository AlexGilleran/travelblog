import sbt.Keys._

enablePlugins(JavaAppPackaging)

lazy val sharedSettings = Seq(
  organization := "com.alexgilleran.travelblog",
  version := "0.1",
  scalaVersion := "2.11.6",
  scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8"),
  libraryDependencies ++= {
    val akkaV = "2.4.4"

    Seq(
      "com.typesafe.akka" %% "akka-http-core" % akkaV,
      "com.typesafe.akka" %% "akka-http-experimental" % akkaV,
      "com.typesafe.akka" %% "akka-http-spray-json-experimental" % akkaV,
      "com.typesafe.akka" %% "akka-http-testkit" % akkaV % "test",
      "com.typesafe.akka" %% "akka-actor" % akkaV,
      "com.typesafe.akka" %% "akka-testkit" % akkaV % "test",

      "org.postgresql" % "postgresql" % "9.4-1201-jdbc41",
      "com.typesafe.slick" %% "slick" % "3.1.1",
      "com.typesafe.slick" %% "slick-codegen" % "3.1.1",

      "ch.qos.logback" % "logback-classic" % "1.0.9",

      "org.sangria-graphql" %% "sangria" % "0.6.3",
      "org.sangria-graphql" %% "sangria-relay" % "0.6.3",
      "org.sangria-graphql" %% "sangria-spray-json" % "0.3.1",
      
      "ch.qos.logback" % "logback-classic" % "1.0.9",
      "net.ceedubs" %% "ficus" % "1.1.2",
      "com.softwaremill.akka-http-session" %% "core" % "0.2.7",
      
      "org.specs2" %% "specs2-core" % "2.3.11" % "test"
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
lazy val slickCodeGenTask = Def.task {
  val dir = sourceDirectory.value
  val cp = (dependencyClasspath in Compile).value
  val r = (runner in Compile).value
  val s = streams.value

  val outputDir = (dir / "main" / "scala").getPath // place generated files in sbt's managed sources folder
  val url = "jdbc:postgresql://localhost/TravelBlog?user=postgres&password=p4ssw0rd"
  val jdbcDriver = "org.postgresql.Driver"
  val slickDriver = "slick.driver.PostgresDriver"
  val pkg = "com.alexgilleran.travelblog.data.schema"
  toError(r.run("com.alexgilleran.travelblog.CustomSourceGenerator", cp.files, Array(slickDriver, url, outputDir, pkg), s.log))
  val fname = outputDir + "/com/alexgilleran/travelblog/data/schema/Tables.scala"
  Seq(file(fname))
}

//test in assembly := {}
lazy val generateSchema = taskKey[Unit]("Generate schema.json file")
fullRunTask(generateSchema, Compile, "com.alexgilleran.travelblog.graphql.GenerateSchema")
compile in Runtime <<= compile in Runtime dependsOn generateSchema


EclipseKeys.executionEnvironment := Some(EclipseExecutionEnvironment.JavaSE18)
EclipseKeys.withSource := true
EclipseKeys.withJavadoc := true

mainClass in (Compile, run) := Some("com.alexgilleran.travelblog.Boot")

Revolver.settings