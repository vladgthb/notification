# client/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Expose port 3000 for the React dev server
EXPOSE 3000

# Set environment variable for legacy OpenSSL if needed:
ENV NODE_OPTIONS=--openssl-legacy-provider

CMD ["npm", "start"]