# Imagen de DESARROLLO del panel (D-33). La de producción se define con el hosting.
FROM node:24-bookworm-slim

WORKDIR /app

# Primero solo las dependencias: si no cambió el package-lock.json, Docker reutiliza esta capa.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3002

# 0.0.0.0 para que responda desde fuera del contenedor, no solo dentro.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
