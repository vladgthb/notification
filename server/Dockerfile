FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package and lock files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 4000

# Start the server
CMD ["npm", "start"]