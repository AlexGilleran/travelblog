FROM postgres:9.5

#WORKDIR /usr/src/myapp

ADD init_db.sh /docker-entrypoint-initdb.d
ADD db.sql /
#COPY init_db.sh /usr/src/myapp/init_db.sh

#RUN chmod 777 /usr/src/myapp/init_db.sh \
#    && /usr/src/myapp/init_db.sh