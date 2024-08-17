FROM node:22-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8000

CMD npm run start
