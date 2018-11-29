# ===============================================================
# Build the frontend
# ===============================================================

FROM node:8-alpine as build-frontend
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN yarn
RUN ["yarn", "build", "--prod"]

