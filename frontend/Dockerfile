FROM node:12-alpine

WORKDIR /app

RUN apk add --no-cache bash

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . ./
COPY .env.example ./.env

CMD ["yarn", "start"]
