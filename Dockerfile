# Dockerfile
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install --production

# Copy the rest of the source
COPY . .

# App listens on 3000
EXPOSE 3000

# Use env vars for DB + session secret
ENV NODE_ENV=production

CMD ["npm", "start"]
