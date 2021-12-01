# setup base image
FROM node:14.5-alpine

# setup env variables
ARG SENDGRID_API_KEY=${SENDGRID_API_KEY}
ARG JWT_KEY=${JWT_KEY}
ARG MONGODB_URL=${MONGODB_URL}
ARG EMAIL=${EMAIL}

# When using alpine, you need to install build dependencies for some node module to be able to be built natively.
RUN apk add --no-cache --virtual .gyp \
    python \
    make \
    g++

# copy 2 files with wildcard to root folder
COPY package*.json ./

# install depends from lock file ... make an app folder
RUN npm ci --silent && mkdir /rest_api && mv ./node_modules ./rest_api

# set app folder as wd 
WORKDIR /rest_api

# get our code to app folder 
COPY . /rest_api

# start server
CMD npm run start


