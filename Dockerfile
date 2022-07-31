FROM node:12.12.0-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json /usr/src/app/

RUN npm install

COPY . /usr/src/app

EXPOSE 8080
CMD [ "node", "app.js" ]
