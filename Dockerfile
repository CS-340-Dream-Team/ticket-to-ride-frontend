# ===============================================================
# Build the frontend
# ===============================================================

FROM node:8-alpine as build-frontend
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY yarn.lock /usr/src/app
RUN yarn

COPY . /usr/src/app

RUN ["yarn", "build", "--prod"]

FROM abiosoft/caddy:0.11.1-no-stats as serve

RUN mkdir -p /usr/src/app/
WORKDIR /usr/src/app
COPY Caddyfile /usr/src/app/
COPY --from=build-frontend /usr/src/app/dist/ticket-to-ride-frontend /usr/src/app

EXPOSE 80
EXPOSE 443

ENTRYPOINT ["/bin/parent", "caddy", "--conf", "/usr/src/app/Caddyfile"]
