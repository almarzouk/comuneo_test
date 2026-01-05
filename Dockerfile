# Dockerfile für Todo-App mit Appwrite Backend
# Multi-Stage Build für optimale Image-Größe und Sicherheit

# Stage 1: Development Dependencies
FROM node:20-alpine AS development-dependencies-env
LABEL stage=builder
COPY . /app
WORKDIR /app
RUN npm ci

# Stage 2: Production Dependencies
FROM node:20-alpine AS production-dependencies-env
LABEL stage=builder
COPY ./package.json package-lock.json /app/
WORKDIR /app
RUN npm ci --omit=dev && npm cache clean --force

# Stage 3: Build Application
FROM node:20-alpine AS build-env
LABEL stage=builder
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN npm run build

# Stage 4: Production Runtime
FROM node:20-alpine

# Metadata
LABEL maintainer="Comuneo Take-Home Assignment"
LABEL description="React Router v7 Todo App mit Appwrite Backend"
LABEL version="1.0.0"

# Sicherheits-Best-Practices: Non-root User erstellen
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Package files und Dependencies kopieren
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules

# Build-Artefakte kopieren
COPY --from=build-env --chown=nodejs:nodejs /app/build /app/build

# Zu non-root user wechseln
USER nodejs

# Port exposieren
EXPOSE 3000

# Umgebungsvariablen
ENV NODE_ENV=production
ENV PORT=3000

# Health Check für Container Orchestration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Anwendung starten
CMD ["npm", "run", "start"]