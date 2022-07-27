FROM node:alpine

WORKDIR /app
COPY package.json .
RUN yarn install --production
# RUN npm install
COPY . .


CMD ["yarn", "run", "start"]