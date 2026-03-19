# Etapa 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY .env .env  

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

# Etapa 2: produção
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

ENV NODE_ENV=production

RUN npm install --omit=dev

CMD ["node", "dist/main"]
