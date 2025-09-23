# Dependencias
FROM node:22-alpine AS deps

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Builder - Construye la aplicacion
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copiar de deps los modulos de node
COPY --from=deps /usr/src/app/node_modules ./node_modules

COPY . .

RUN npm run build

RUN npm ci -f --only=production && npm cache clean --force

RUN npx prisma generate

# Crear la imagen final
FROM node:22-alpine AS prod

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copiar la carpeta de DIST
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD [ "node","dist/main.js" ]
