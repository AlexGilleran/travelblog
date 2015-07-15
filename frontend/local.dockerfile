FROM node:0.12.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon
RUN npm install -g webpack

CMD npm run hot-dev-server & npm run dev