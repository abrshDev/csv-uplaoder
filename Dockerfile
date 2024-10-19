# Use Alpine as the base image for a lightweight container
FROM node:18-alpine AS base

# Set the working directory inside the container
WORKDIR /app

# Install necessary packages for Puppeteer to work on Alpine
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    bash

# Copy only the package.json, package-lock.json, and .npmrc (if any)
COPY package.json pnpm-lock.yaml ./

# Install dependencies using npm
RUN npm ci

# Install Puppeteer browser binaries
RUN npx puppeteer browsers install chrome

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use a minimal Alpine base image for production
FROM node:18-alpine AS production

# Install Chromium and its dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Set the working directory inside the container
WORKDIR /app

# Copy the built files and node_modules from the build stage
COPY --from=base /app /app

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable for Puppeteer to use Chromium in Alpine
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
ENV RESEND_API_KEY=re_eJ7UL2hq_FrfLq3Uc498J21VdyAV9bvrc

ENV SCRAPE_DOT_DO_API_TOKEN=1dfb7d786e984316befd2ca4c014e72439151076a05
ENV SCRAPE_DOT_DO_API_TOKEN_2=1dfb7d786e984316befd2ca4c014e72439151076a05

# Start the Next.js app in production mode
CMD ["npm", "start"]
