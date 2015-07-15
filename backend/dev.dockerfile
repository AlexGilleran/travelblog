FROM java:8

WORKDIR /usr/src/app
COPY target/scala-2.11/backend-assembly-*.jar /usr/src/myapp/target/scala-2.11/backend-assembly-*.jar

CMD java -jar target/scala-2.11/backend-assembly-*.jar