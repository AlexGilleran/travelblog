import sbt._

lazy val backend: Project = Project(
  id = "backend",
  base = file("backend")
)