FROM node:18.3.0-alpine as build-stage

WORKDIR /usr/src/app

# Install app dependencies
COPY ./package*.json ./

# If you are building your code for production
RUN npm ci --only=production

COPY . .

EXPOSE 4444

CMD ["npm", "start" ]