# Use Node.js 21 base image
FROM node:21-alpine AS builder

# Set working directory
WORKDIR /app

# Copy all source files first
COPY . .

# Install all dependencies including dev dependencies
RUN npm ci

# Build the TypeScript files
RUN npm run build

# Use a smaller base image for the release
FROM node:21-slim AS release

# Set working directory
WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/build /app/build
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/package-lock.json /app/package-lock.json

# Install only production dependencies without running prepare script
RUN npm ci --omit=dev --ignore-scripts

# Set environment variable for Node.js
ENV NODE_ENV=production

# Set the entrypoint
ENTRYPOINT ["node", "build/index.js"]
