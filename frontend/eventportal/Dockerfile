# Specify a base image
FROM node:16-bullseye

# Setup working directory
WORKDIR /eventportal

# setup app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000