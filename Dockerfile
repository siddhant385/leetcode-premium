# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# pnpm install karo
RUN npm install -g pnpm

# package.json aur pnpm-lock.yaml copy karo
COPY package.json pnpm-lock.yaml ./

# Dependencies install karo (--frozen-lockfile exact versions install karta hai)
RUN pnpm install --frozen-lockfile

# Baaki saara code copy karo
COPY . .

# Next.js app ko production ke liye build karo
RUN pnpm run build

# Port 3000 expose karo
EXPOSE 3000

# App start karne ka command
CMD ["pnpm", "start"]
