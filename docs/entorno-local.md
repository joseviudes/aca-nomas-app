# Entorno local sin Docker para el backend

Qué instalar para correr el backend directo en tu máquina (sin contenedor), usando Docker solo para la base de datos.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 04/11/2026 | Josi | Versión inicial |
| 0.2 | 05/11/2026 | Tobias | Aclara que el backend en contenedor todavía no existe |

## Índice

- [Cuándo usar esta guía](#cuándo-usar-esta-guía)
- [Requisitos](#requisitos)
- [Pasos](#pasos)

## Cuándo usar esta guía

El `docker-compose.yml` del repositorio levanta solo PostgreSQL, en el puerto `5433`. Esta guía es para quien prefiere correr el backend (Node) instalado directo en su máquina en vez de en un contenedor, por ejemplo para depurar más fácil o porque ya tiene el entorno de Node configurado.

Levantar también el backend en un contenedor todavía no es posible: depende del `Dockerfile` de la API (tarea `[INFRA] Dockerfile de la API`). Esa opción se documenta cuando exista.

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | `>= 24` | Correr y compilar el backend (ver `backend/package.json`, campo `engines`) |
| [Docker](https://www.docker.com) | cualquier versión reciente | Levantar PostgreSQL con `docker-compose.yml` |
| npm | la que viene con Node 24 | Instalar las dependencias del backend |

No hace falta instalar PostgreSQL aparte: corre en el contenedor de Docker.

## Pasos

1. Levantar la base de datos:
   ```
   docker compose up -d
   ```
2. Instalar las dependencias del backend:
   ```
   cd backend
   npm install
   ```
3. Copiar `backend/.env.example` a `backend/.env`. Los valores por defecto ya apuntan al Postgres del paso 1 (`localhost:5433`); no hace falta cambiarlos para desarrollo local.
4. Aplicar las migraciones (crea las tablas en la base del paso 1):
   ```
   npm run db:migrate
   ```
   El seed con datos ficticios se suma cuando exista.
5. Levantar el backend en modo desarrollo:
   ```
   npm run dev
   ```
6. Correr las pruebas:
   ```
   npm test
   ```
