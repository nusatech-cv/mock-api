FROM node:20-alpine

WORKDIR /app

COPY package*.json /app

RUN npm install --omit=dev

COPY mocks /app/mocks
COPY public /app/public

EXPOSE 8080

CMD [ "npm", "start" ]