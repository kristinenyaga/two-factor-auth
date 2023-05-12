FROM node:14-alpine3.10

WORKDIR /app

ENV MONGO_DB_USERNAME = admin \ MONGO_DB_PASSWORD = admin123456

COPY package*.json ./

RUN npm install && npm cache clean --force

COPY . .

EXPOSE 3000

# our default dev command
CMD ["npm","run","dev"]