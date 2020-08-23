FROM node:alpine

RUN mkdir -p /app

WORKDIR /app

COPY . /app

## install and build configuration file
RUN npm install && npm run build

## how to edit this in docker compose?
CMD node rimuru start
