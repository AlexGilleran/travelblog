FROM java:8

WORKDIR /usr/src/app

RUN echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list
RUN apt-get -y --force-yes update
RUN apt-get -y --force-yes install sbt

COPY codegen /usr/src/app/codegen
COPY src /usr/src/app/src
COPY project /usr/src/app/project
COPY build.sbt /usr/src/app/build.sbt


RUN sbt
RUN sbt re-start

CMD sbt ~re-start