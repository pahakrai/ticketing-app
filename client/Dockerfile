FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install --production
COPY . .


CMD ["npm", "run", "dev"]