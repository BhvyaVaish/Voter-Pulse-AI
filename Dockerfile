FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the Cloud Run port
ENV PORT 8080
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
