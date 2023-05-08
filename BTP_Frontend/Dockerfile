# Get the base image
FROM node:18.3.0-alpine as build-stage

# Maintainer of the file
LABEL author="Gudihindala, Anil <anilgudihindala@gmail.com>"

# Set working directory
WORKDIR /usr/src/app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /usr/src/app/node_modules/.bin:$PATH

# Copy project files to /usr/src/app/
COPY . /usr/src/app/

# Add git and node command line tools to help the packages install and then install the packages
RUN  npm i --silent

# Get the production files ready
RUN npm run build --silent

# Get the base image
FROM node:18.3.0-alpine

# Get the production files to the location  /usr/src/app/build
COPY --from=build-stage /usr/src/app/build/ /usr/src/app/build

# Server for the application
RUN npm install -g serve

# Start app
CMD serve -s /usr/src/app/build -l 8004