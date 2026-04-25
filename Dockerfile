# Stage 1: Build
FROM node:24-slim AS builder

WORKDIR /app

# Copy configuration files
COPY package*.json ./

# Install all dependencies (including devDeps needed for build)
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the SvelteKit app (this runs vite build)
RUN npm run build

# Stage 2: Run
FROM node:24-slim

WORKDIR /app

# Copy the build output and production dependencies from the builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables
ENV NODE_ENV=production PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the application using the Node adapter output
CMD ["node", "build/index.js"]