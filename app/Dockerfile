FROM node:alpine

RUN apk add --no-cache tini

WORKDIR /usr/src/app

# Copy package.json from root
COPY ../package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "index.js"]
