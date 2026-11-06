# Imagen de DESARROLLO de la web pública (D-33). La de producción se define con el hosting.
FROM node:24-bookworm-slim

WORKDIR /app

# Next manda estadísticas de uso anónimas: en un contenedor de desarrollo no aportan nada.
ENV NEXT_TELEMETRY_DISABLED=1

# Primero solo las dependencias: si no cambió el package-lock.json, Docker reutiliza esta capa.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3001

# 0.0.0.0 para que responda desde fuera del contenedor, no solo dentro.
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
