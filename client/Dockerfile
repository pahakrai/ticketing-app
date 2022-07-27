FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install --production
COPY . .


CMD ["yarn", "run", "dev"]