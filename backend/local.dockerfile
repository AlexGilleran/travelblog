FROM java:8

WORKDIR /usr/src/app

RUN echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list
RUN apt-get -y --force-yes update
RUN apt-get -y --force-yes install sbt

#COPY codegen /usr/src/app/codegen
#COPY src /usr/src/app/src
#COPY project /usr/src/app/project
#COPY build.sbt /usr/src/app/build.sbt

VOLUME /usr/src/app
VOLUME /root/.ivy2

CMD sbt ~re-start