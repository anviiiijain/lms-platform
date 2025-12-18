FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/shared/package*.json ./services/shared/
COPY services/api-gateway/package*.json ./services/api-gateway/

RUN npm ci

COPY services/shared ./services/shared
COPY services/api-gateway ./services/api-gateway

WORKDIR /app/services/shared
RUN npm run build

WORKDIR /app/services/api-gateway
RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/api-gateway/dist ./dist
COPY --from=builder /app/services/api-gateway/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 8000

CMD ["node", "dist/main.js"]