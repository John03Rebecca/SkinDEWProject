# Dockerfile
FROM node:20-alpine

# app directory
WORKDIR /usr/src/app
#  caching
COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 8080

ENV NODE_ENV=production
CMD ["npm", "start"]
