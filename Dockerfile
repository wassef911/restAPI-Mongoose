# setup base image
FROM node:alpine

# setup env variables
ARG SENDGRID_API_KEY=${SENDGRID_API_KEY}
ARG JWT_KEY=${JWT_KEY}
ARG MONGODB_URL=${MONGODB_URL}
ARG EMAIL=${EMAIL}

# copy 2 files with wildcard to root folder
COPY package*.json ./

# install build dependencies for some node module to build them natively
RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    && apk del .gyp

# install depends from lock file ... make an app folder
RUN  npm ci --silent && mkdir /rest_api && mv ./node_modules ./rest_api

# set app folder as wd 
WORKDIR /rest_api

# get our code to app folder 
COPY . /rest_api

# start server
CMD npm run start


