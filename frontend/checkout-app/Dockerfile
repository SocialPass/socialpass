# Specify a base image
FROM node:16-bullseye

# Setup working directory
WORKDIR /checkout-app

# setup app
COPY package.json .
RUN yarn install
COPY . .
EXPOSE 3000