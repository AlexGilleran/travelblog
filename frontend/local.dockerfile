FROM node:6.1

VOLUME /usr/src/app

WORKDIR /usr/src/app

CMD npm install && ./run-local.sh