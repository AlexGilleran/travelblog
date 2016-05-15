FROM node:6.1

VOLUME /usr/src/app

WORKDIR /usr/src/app

CMD npm install && npm install && npm run hot-dev-server & npm run dev