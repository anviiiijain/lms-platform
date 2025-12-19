FROM node:20-slim AS builder

RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

COPY package*.json ./
COPY services/shared/package*.json ./services/shared/
COPY services/similar-courses/package*.json ./services/similar-courses/

RUN npm install

COPY services/shared ./services/shared
COPY services/similar-courses ./services/similar-courses

WORKDIR /app/services/shared
RUN npm run build
RUN npx prisma generate

WORKDIR /app/services/similar-courses
RUN npm run build

FROM node:20-slim

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/similar-courses/dist ./dist
COPY --from=builder /app/services/similar-courses/package*.json ./

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/services/shared/dist ./node_modules/@lms-monorepo/shared/dist
COPY --from=builder /app/services/shared/package.json ./node_modules/@lms-monorepo/shared/

COPY --from=builder /app/services/shared/prisma ./prisma

EXPOSE 8002

CMD ["node", "dist/main.js"]