# Entorno local: el día a día

Qué hacer con la base de datos y el backend después de levantar el proyecto por primera vez. Los requisitos y la instalación inicial están en el [README](../README.md).

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 04/11/2026 | Josi | Versión inicial |
| 0.2 | 05/11/2026 | Tobias | Aclara que el backend en contenedor todavía no existe |
| 0.3 | 05/11/2026 | Tobias | La instalación pasa al README. Esta guía queda para el día a día: apagar, resetear, migraciones, ver los datos y problemas comunes |
| 0.4 | 05/11/2026 | Tobias | Agrega cómo levantar la API en Docker con el perfil `api` (D-26) |
| 0.5 | 06/11/2026 | Tobias | Agrega el error de CORS a los problemas comunes (D-28) |

## Índice

- [Cómo está armado el entorno](#cómo-está-armado-el-entorno)
- [Levantar la API en Docker](#levantar-la-api-en-docker)
- [Apagar y prender la base](#apagar-y-prender-la-base)
- [Cuándo correr las migraciones y el seed](#cuándo-correr-las-migraciones-y-el-seed)
- [Ver los datos](#ver-los-datos)
- [Problemas comunes](#problemas-comunes)

## Cómo está armado el entorno

- **La base de datos corre en Docker.** `docker-compose.yml` levanta PostgreSQL 17 en el puerto `5433` de tu máquina (D-24).
- **El backend se puede correr de dos formas** (D-26):

  | Forma | Comando | Conviene para |
  |---|---|---|
  | Con Node, en tu máquina | `npm run dev` (en `backend/`) | Programar el backend: se recarga al guardar y se depura más fácil |
  | En Docker | `docker compose --profile api up --watch` | Trabajar sin instalar Node: también se reinicia al guardar |

- **Los datos viven en un volumen de Docker** (`aca-nomas_db-data`). Un volumen es una carpeta que Docker guarda aparte del contenedor: los datos sobreviven aunque el contenedor se apague o se borre. Las dos formas usan la misma base y los mismos datos.

## Levantar la API en Docker

Es un entorno de **desarrollo**: alcanza con tener Docker, sin instalar Node ni dependencias. Un **perfil** de Docker Compose agrupa servicios que solo arrancan si se piden. Sin perfil se levanta solo la base; con el perfil `api`, también la API.

1. Levantar la base y la API, en la raíz del repositorio:
   ```
   docker compose --profile api up --watch
   ```
   La primera vez tarda unos minutos porque construye la imagen. Al arrancar, la API aplica las migraciones pendientes. La terminal queda mostrando los logs; `Ctrl+C` apaga la API.
2. Comprobar que anda: `http://localhost:3000/api/health` tiene que responder `{"status":"ok"}`.
3. Si la base está vacía, cargar los datos ficticios desde otra terminal:
   ```
   docker compose exec api npm run db:seed
   ```

**Al guardar un archivo** de `backend/src/` o `backend/tests/`, Docker lo copia al contenedor y el servidor se reinicia solo. Si cambian las dependencias (`package-lock.json`) o algo de `backend/prisma/`, reconstruye la imagen y vuelve a aplicar las migraciones.

**Cualquier comando del backend** se corre dentro del contenedor con `docker compose exec api`:

| Para | Comando |
|---|---|
| Correr las pruebas | `docker compose exec api npm test` |
| Revisar el código | `docker compose exec api npm run lint` |
| Cargar los datos ficticios | `docker compose exec api npm run db:seed` |

**La API en Docker y `npm run dev` usan el mismo puerto (3000)**: se usa uno o el otro. Si los dos están prendidos, el segundo falla con `port is already allocated` o `EADDRINUSE`.

**Para crear una migración nueva** después de cambiar `schema.prisma` hace falta Node en tu máquina (`npm run db:migrate`): Prisma pide un nombre de forma interactiva. Aplicar las migraciones de los demás sí es automático en Docker.

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
| `blocked by CORS policy` en la consola del navegador | El origen de la página no está en `CORS_ORIGINS` (D-28) | Usar los puertos 3001 (web) o 3002 (panel), o agregar el origen a `CORS_ORIGINS` en `backend/.env` y reiniciar la API |
| Prisma pide resetear la base al migrar | La base y el historial de migraciones no coinciden | Si los datos no importan: `npx prisma migrate reset` (borra todo, migra y corre el seed) |
