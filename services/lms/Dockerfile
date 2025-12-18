FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY services/shared/package*.json ./services/shared/
COPY services/lms/package*.json ./services/lms/

RUN npm ci

COPY services/shared ./services/shared
COPY services/lms ./services/lms

WORKDIR /app/services/shared
RUN npm run build
RUN npx prisma generate

WORKDIR /app/services/lms
RUN npm run build

FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/services/lms/dist ./dist
COPY --from=builder /app/services/lms/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/services/shared/prisma ./prisma

EXPOSE 8001

CMD ["node", "dist/main.js"]