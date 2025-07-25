FROM node:alpine

RUN apk add --no-cache tini

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]