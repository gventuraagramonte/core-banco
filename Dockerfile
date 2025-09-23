# Dependencias
FROM node:22-alpine AS deps
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

# Copiamos solo prisma para cachear la generación
COPY prisma ./prisma
# Genera el client ANTES de compilar (necesario para tipos/enums en build)
RUN npx prisma generate

# Builder - Construye la aplicacion
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# Trae node_modules ya con @prisma/client generado
COPY --from=deps /usr/src/app/node_modules ./node_modules

# Copia el resto del código
COPY . .

# Compila Nest
RUN npm run build

# Crear la imagen final
FROM node:22-alpine AS prod
WORKDIR /usr/src/app
ENV NODE_ENV=production

# Dependencias del sistema que Prisma puede requerir en alpine
RUN apk add --no-cache openssl libc6-compat

# Copiamos solo lo necesario
COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY prisma ./prisma

# Opcional: reducir tamaño (mantiene @prisma/client)
RUN npm prune --omit=dev

# Por si el prune reinstaló algo, re-genera (seguro y rápido)
RUN npx prisma generate

USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]