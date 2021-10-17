FROM node:alpine

COPY package.json yarn.lock ./
COPY app ./app

RUN yarn install --pure-lockfile

CMD ["npm", "start"]