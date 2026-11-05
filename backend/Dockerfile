# Imagen de DESARROLLO de la API (D-26): sirve para trabajar en el proyecto sin instalar Node.
# Corre `npm run dev`, que reinicia el servidor al guardar. No es una imagen de producción:
# esa se define cuando se elija el hosting.

# Debian slim y no Alpine: bcrypt trae binarios ya compilados para glibc.
FROM node:24-bookworm-slim
WORKDIR /app

# Primero solo lo que define las dependencias: si no cambian, Docker reusa esta capa y no reinstala.
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
# El postinstall genera el cliente de Prisma en src/generated.
RUN npm ci

COPY . .

EXPOSE 3000

# Aplica las migraciones pendientes y levanta el servidor en modo desarrollo.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]
