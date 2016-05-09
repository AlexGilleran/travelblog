FROM java:8

WORKDIR /usr/src/app

RUN echo "deb http://dl.bintray.com/sbt/debian /" | tee -a /etc/apt/sources.list.d/sbt.list && \
    apt-get -y --force-yes update && \
    apt-get -y --force-yes install sbt

VOLUME /usr/src/app
VOLUME /root/.ivy2

RUN ln -s target /target && \
    ln -s codegen/target /codegen-target

CMD sbt ~re-start