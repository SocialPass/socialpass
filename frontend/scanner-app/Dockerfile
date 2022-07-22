#Specify a base image
FROM node:18-bullseye

#Setup working directory
WORKDIR /scanner

COPY package.json .
RUN yarn install

COPY . .
EXPOSE 3001