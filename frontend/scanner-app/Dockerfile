#Specify a base image
FROM node:18-bullseye

#Setup working directory
WORKDIR /scanner

COPY package.json .
RUN yarn install

COPY . .
EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3001 || exit 1
