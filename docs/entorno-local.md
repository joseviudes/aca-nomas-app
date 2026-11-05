# Entorno local: el día a día

Qué hacer con la base de datos y el backend después de levantar el proyecto por primera vez. Los requisitos y la instalación inicial están en el [README](../README.md).

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 04/11/2026 | Josi | Versión inicial |
| 0.2 | 05/11/2026 | Tobias | Aclara que el backend en contenedor todavía no existe |
| 0.3 | 05/11/2026 | Tobias | La instalación pasa al README. Esta guía queda para el día a día: apagar, resetear, migraciones, ver los datos y problemas comunes |

## Índice

- [Cómo está armado el entorno](#cómo-está-armado-el-entorno)
- [Apagar y prender la base](#apagar-y-prender-la-base)
- [Cuándo correr las migraciones y el seed](#cuándo-correr-las-migraciones-y-el-seed)
- [Ver los datos](#ver-los-datos)
- [Problemas comunes](#problemas-comunes)

## Cómo está armado el entorno

- **La base de datos corre en Docker.** `docker-compose.yml` levanta PostgreSQL 17 en el puerto `5433` de tu máquina (D-24).
- **El backend corre directo en tu máquina**, con Node. Así se depura más fácil.
- **Los datos viven en un volumen de Docker** (`aca-nomas_db-data`). Un volumen es una carpeta que Docker guarda aparte del contenedor: los datos sobreviven aunque el contenedor se apague o se borre.

Levantar también el backend en un contenedor todavía no es posible: depende del `Dockerfile` de la API (tarea `[INFRA] Dockerfile de la API`). Esa opción se documenta cuando exista.

## Apagar y prender la base

Los comandos se corren en la raíz del repositorio.

| Comando | Qué hace | ¿Se pierden los datos? |
|---|---|---|
| `docker compose up -d` | Prende la base | No |
| `docker compose stop` | La apaga, sin borrar el contenedor | No |
| `docker compose down` | La apaga y borra el contenedor | No: quedan en el volumen |
| `docker compose down -v` | La apaga y borra también el volumen | **Sí: se pierde todo** |

Después de `docker compose down -v` la base queda vacía: hay que volver a correr `npm run db:migrate` y `npm run db:seed`.

## Cuándo correr las migraciones y el seed

No hace falta correrlos cada vez que se prende la base: los datos quedan guardados.

| Situación | Qué correr (en `backend/`) |
|---|---|
| Hiciste `pull` y llegó una migración nueva | `npm run db:migrate` |
| Cambiaste `schema.prisma` | `npm run db:migrate` (crea la migración y pide un nombre) |
| Querés volver a los datos iniciales | `npm run db:seed` |
| Borraste el volumen o es la primera vez | `npm run db:migrate` y después `npm run db:seed` |

Para saber si falta aplicar alguna migración:

```
npx prisma migrate status
```

**Una migración que ya está en `main` no se edita.** Si algo cambia, se agrega una migración nueva. Editar una ya aplicada hace que Prisma detecte diferencias y pida resetear la base.

## Ver los datos

La forma más simple es Prisma Studio, que abre en el navegador una vista de todas las tablas. Solo necesita la base prendida, no el backend:

```
cd backend
npx prisma studio
```

También se puede usar un cliente como DBeaver o pgAdmin. Los datos de conexión están en `DATABASE_URL`, en `backend/.env.example`.

## Problemas comunes

| Síntoma | Causa probable | Solución |
|---|---|---|
| `Can't reach database server at localhost:5433` | La base está apagada o todavía arrancando | `docker compose up -d` y esperar `(healthy)` en `docker compose ps` |
| `failed to connect to the docker API` | Docker Desktop está cerrado | Abrir Docker Desktop y esperar a que diga que está corriendo |
| `Variables de entorno inválidas` al levantar el backend | Falta `backend/.env` | `cp backend/.env.example backend/.env` |
| `port is already allocated` al levantar la base | Otro programa usa el puerto `5433` | Cerrar ese programa, o cambiar el puerto en `docker-compose.yml` y en `DATABASE_URL` de tu `.env` |
| Prisma pide resetear la base al migrar | La base y el historial de migraciones no coinciden | Si los datos no importan: `npx prisma migrate reset` (borra todo, migra y corre el seed) |
