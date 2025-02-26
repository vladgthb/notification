FROM node:16-alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the TypeScript project (this will compile files from "src" into "dist")
RUN npm run build

# List the contents of the dist folder for debugging
RUN ls -l dist

EXPOSE 4000

CMD ["node", "dist/server.js"]