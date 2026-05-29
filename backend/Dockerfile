# ─── Backend Dockerfile ───────────────────────────────────────────────────────
# Location: backend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (cached layer)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code
COPY . .

# Run migrations on startup via CMD
EXPOSE 5000

CMD ["node", "src/index.js"]
