# Base image
FROM node:18.16-alpine

# Install dependencies for building native modules
RUN apk add --no-cache --virtual .gyp python3 make g++

RUN npm install -g pnpm
# Install global npm packages
RUN npm i -g @nestjs/cli

# Create and set the working directory
RUN mkdir /app
WORKDIR /app

# Copy package.json and tsconfig.build.json to the container
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy the entire source code to the container
COPY . .

# Build the application
RUN pnpm run build

# Copy i18n directory to the appropriate build location
#COPY src/i18n /app/dist/i18n

# Expose the port that the application will run on
EXPOSE 3000

# Command to run the application
CMD ["node", "/app/dist/src/main"]