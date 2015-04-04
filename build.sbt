organization  := "com.example"

version       := "0.1"

scalaVersion  := "2.11.6"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

libraryDependencies ++= {
  val akkaV = "2.3.9"
  val sprayV = "1.3.3"
  Seq(
    "io.spray"            %%  "spray-can"     % sprayV,
    "io.spray"            %%  "spray-routing" % sprayV,
    "io.spray"            %%  "spray-testkit" % sprayV  % "test",
    "com.typesafe.akka"   %%  "akka-actor"    % akkaV,
    "com.typesafe.akka"   %%  "akka-testkit"  % akkaV   % "test",
    "org.specs2"          %%  "specs2-core"   % "2.3.11" % "test",
    "com.typesafe.slick"  %%  "slick"         % "2.1.0",
    "com.typesafe.slick"  %%  "slick-codegen"  % "2.1.0",
    "org.slf4j"           %  "slf4j-nop"      % "1.6.4",
    "org.postgresql"      % "postgresql"     % "9.4-1201-jdbc41"
  )
}
slick <<= slickCodeGenTask // register manual sbt command
sourceGenerators in Compile <+= slickCodeGenTask // register automatic code generation on every compile, remove for only manual use

// code generation task
lazy val slick = TaskKey[Seq[File]]("gen-tables")
lazy val slickCodeGenTask = (sourceManaged, dependencyClasspath in Compile, runner in Compile, streams) map { (dir, cp, r, s) =>
  val outputDir = (dir / "main").getPath // place generated files in sbt's managed sources folder
  val url = "jdbc:postgresql:TravelBlog?user=postgres&password=p4ssw0rd" // connection info for a pre-populated throw-away, in-memory db for this demo, which is freshly initialized on every run
  val jdbcDriver = "org.postgresql.Driver"
  val slickDriver = "scala.slick.driver.PostgresDriver"
  val pkg = "com.alexgilleran.travelblog.data.schema"
  toError(r.run("scala.slick.codegen.SourceCodeGenerator", cp.files, Array(slickDriver, jdbcDriver, url, outputDir, pkg), s.log))
  val fname = outputDir + "/com/alexgilleran/travelblog/data/schema/Tables.scala"
  Seq(file(fname))
}

Revolver.settings
