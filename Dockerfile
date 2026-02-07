# Multi-stage Dockerfile para Monitoring Dashboard

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY frontend/ .
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps
COPY backend/ .
RUN npm run build

# Stage 3: Production
FROM node:20-alpine AS production
WORKDIR /app

# Instalar dependencias de producción para backend
COPY backend/package*.json ./
RUN npm ci --legacy-peer-deps --only=production

# Copiar backend compilado
COPY --from=backend-builder /app/backend/dist ./dist

# Copiar frontend compilado (para servirlo estáticamente)
COPY --from=frontend-builder /app/frontend/dist ./public

# Instalar dockerode (necesita estar en producción)
RUN npm install dockerode

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/main.js"]
