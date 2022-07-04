#Specify a base image
FROM node:18-bullseye

#Setup working directory
WORKDIR /eventportal

COPY package.json .
RUN yarn install

COPY . .
EXPOSE 3000
HEALTHCHECK CMD curl --fail http://localhost:3000 || exit 1
