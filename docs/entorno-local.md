# Entorno local: el día a día

Qué hacer con la base de datos, el backend y el frontend después de levantar el proyecto por primera vez. Los requisitos y la instalación inicial están en el [README](../README.md).

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 04/11/2026 | Josi | Versión inicial |
| 0.2 | 05/11/2026 | Tobias | Aclara que el backend en contenedor todavía no existe |
| 0.3 | 05/11/2026 | Tobias | La instalación pasa al README. Esta guía queda para el día a día: apagar, resetear, migraciones, ver los datos y problemas comunes |
| 0.4 | 05/11/2026 | Tobias | Agrega cómo levantar la API en Docker con el perfil `api` (D-26) |
| 0.5 | 06/11/2026 | Tobias | Agrega el error de CORS a los problemas comunes (D-28) |
| 0.6 | 06/11/2026 | Tobias | La sección de Docker cubre las tres apps: perfiles `web`, `panel` y `full`, qué pasa al guardar y cómo apagarlas (D-33) |
| 0.7 | 06/11/2026 | Tobias | Agrega la dirección de Swagger (D-34) |
| 0.8 | 07/11/2026 | Tobias | Una migración no se edita desde que está en `develop` (D-39) |
| 0.9 | 07/11/2026 | Tobias | Agrega cuándo instalar dependencias después de un `pull`. `postcss.config.mjs` reinicia la web en Docker (D-38) |

## Índice

- [Cómo está armado el entorno](#cómo-está-armado-el-entorno)
- [Levantar las apps en Docker](#levantar-las-apps-en-docker)
- [Apagar y prender la base](#apagar-y-prender-la-base)
- [Cuándo correr las migraciones y el seed](#cuándo-correr-las-migraciones-y-el-seed)
- [Ver los datos](#ver-los-datos)
- [Problemas comunes](#problemas-comunes)

## Cómo está armado el entorno

- **La base de datos corre en Docker.** `docker-compose.yml` levanta PostgreSQL 17 en el puerto `5433` de tu máquina (D-24).
- **Cada app (API, web y panel) se puede correr de dos formas** (D-26, D-33), y se pueden mezclar:

  | Forma | Comando | Conviene para |
  |---|---|---|
  | Con Node, en tu máquina | `npm run dev` (en `backend/`, `web/` o `panel/`) | Programar: se recarga al guardar y se depura más fácil |
  | En Docker | `docker compose --profile <perfil> up --watch` | Trabajar sin instalar Node: también se recarga al guardar |

- **Los datos viven en un volumen de Docker** (`aca-nomas_db-data`). Un volumen es una carpeta que Docker guarda aparte del contenedor: los datos sobreviven aunque el contenedor se apague o se borre. Las dos formas usan la misma base y los mismos datos.

## Levantar las apps en Docker

Es un entorno de **desarrollo**: alcanza con tener Docker, sin instalar Node ni dependencias (D-26, D-33). Un **perfil** de Docker Compose agrupa servicios que solo arrancan si se piden. Sin perfil se levanta solo la base. Los comandos se corren en la raíz del repositorio.

| Quiero levantar | Comando |
|---|---|
| Solo la base (el resto con `npm run dev`) | `docker compose up -d` |
| La base y la API | `docker compose --profile api up --watch` |
| Todo: base, API, web y panel | `docker compose --profile full up --watch` |
| La base, la API y el panel | `docker compose --profile api --profile panel up --watch` |
| La base y la web, con la API corriendo con `npm run dev` | `docker compose --profile web up --watch` (ver `API_INTERNAL_URL` más abajo) |

Los perfiles son `api`, `web`, `panel` y `full`, y se combinan repitiendo `--profile`.

| App | Dirección |
|---|---|
| API | `http://localhost:3000/api/health` responde `{"status":"ok"}` |
| Swagger (todos los endpoints) | `http://localhost:3000/api/docs` |
| Web pública | `http://localhost:3001` |
| Panel | `http://localhost:3002` |

**La primera vez tarda unos minutos** porque construye las imágenes. Al arrancar, la API aplica las migraciones pendientes. La terminal queda mostrando los logs de todos los servicios; `Ctrl+C` los apaga.

**Si la base está vacía**, cargar los datos ficticios desde otra terminal:

```
docker compose exec api npm run db:seed
```

### Qué pasa al guardar un archivo

Con `--watch`, Docker copia cada archivo guardado al contenedor y la app se recarga sola.

| App | Se copia al guardar | Reinicia el contenedor | Reconstruye la imagen |
|---|---|---|---|
| API | `backend/src/`, `backend/tests/` | — | `package-lock.json` o `backend/prisma/` (y vuelve a migrar) |
| Web | `web/src/`, `web/tests/` | `next.config.ts`, `postcss.config.mjs` | `package-lock.json` |
| Panel | `panel/src/`, `panel/tests/`, `panel/public/` | `index.html`, `vite.config.ts` | `package-lock.json` |

Si algo queda raro, `--build` fuerza a reconstruir las imágenes: `docker compose --profile full up --watch --build`.

### Correr comandos dentro de un contenedor

Cualquier comando de una app se corre con `docker compose exec <servicio>` (`api`, `web` o `panel`):

| Para | Comando |
|---|---|
| Pruebas | `docker compose exec api npm test` (o `web`, `panel`) |
| Revisar el código | `docker compose exec web npm run lint` |
| Cargar los datos ficticios | `docker compose exec api npm run db:seed` |
| Ver los logs de un solo servicio | `docker compose logs -f panel` |

### Apagar las apps

| Comando | Qué hace |
|---|---|
| `Ctrl+C` en la terminal del `up --watch` | Apaga lo que levantó ese comando |
| `docker compose --profile full stop` | Apaga todo, incluida la base, sin borrar nada |
| `docker compose --profile full down` | Apaga todo y borra los contenedores. Los datos quedan en el volumen |

Sin `--profile full`, `stop` y `down` solo tocan la base: los servicios con perfil quedan como estaban.

### Cosas a tener en cuenta

- **Docker y `npm run dev` usan los mismos puertos** (3000, 3001 y 3002): para cada app se usa uno o el otro. Si los dos están prendidos, el segundo falla con `port is already allocated` o `EADDRINUSE`.
- **`API_INTERNAL_URL` (web):** el servidor de Next corre dentro de Docker, y ahí `localhost` es su propio contenedor. Por eso llega a la API por `http://api:3000/api`, mientras que el navegador sigue usando `localhost:3000`. Si levantás la web en Docker y la API con `npm run dev`, cambiá esa variable a `http://host.docker.internal:3000/api` en tu copia de `docker-compose.yml`, sin commitearla.
- **Para crear una migración nueva** después de cambiar `schema.prisma` hace falta Node en tu máquina (`npm run db:migrate`): Prisma pide un nombre de forma interactiva. Aplicar las migraciones de los demás sí es automático en Docker.

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

## Cuándo instalar dependencias

Si hiciste `pull` y cambió el `package-lock.json` de una app (por ejemplo, alguien sumó una librería):

| Cómo levantás el proyecto | Qué hacer |
|---|---|
| Docker con `--watch` | Nada: Docker reconstruye la imagen de esa app solo |
| Docker sin `--watch` | `docker compose --profile full up --build` |
| Sin Docker | `npm install` dentro de esa app (`backend/`, `web/` o `panel/`) |

Para saber si cambió: `git diff --stat HEAD@{1} -- '*/package-lock.json'` justo después del `pull`. Si la app no arranca con un error del tipo `Cannot find module`, casi siempre es esto.

Para saber si falta aplicar alguna migración:

```
npx prisma migrate status
```

**Una migración que ya está en `develop` no se edita.** Si algo cambia, se agrega una migración nueva. Editar una ya aplicada hace que Prisma detecte diferencias y pida resetear la base.

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
