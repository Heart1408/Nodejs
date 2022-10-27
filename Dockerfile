FROM node:16.13.2-alpine as deps

WORKDIR /app

RUN apk add build-base

COPY package.json package-lock.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "start:production"]