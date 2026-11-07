# AcáNomás

Directorio web de negocios locales: los vecinos encuentran negocios de su localidad y saben si están abiertos ahora.

## Estado

En construcción. Etapa actual: **EP-00 Cimientos** (repositorio, backend inicial, web pública y panel iniciales, base de datos e infraestructura).

## Stack

- **Backend:** Node.js, Express 5 y TypeScript (ESM)
- **Web pública:** Next.js y TypeScript (D-27)
- **Panel del dueño:** Vite, React y TypeScript (SPA)
- **Base de datos:** PostgreSQL 17 con Prisma
- **Desarrollo local:** Docker para la base de datos y, si se quiere, también para la API, la web y el panel (D-26, D-33)
- **Validación:** Zod
- **Pruebas:** Vitest

## Estructura

```
backend/   API REST (código en src/, pruebas en tests/, base de datos en prisma/)
web/       Web pública con Next.js (D-27)
panel/     Panel del dueño, SPA con Vite y React
docs/      ERS, decisiones, épicas e historias, modelo de datos, diseño de la API y escenarios de Postman (D-35)
```

## Requisitos

| Herramienta | Versión | Para qué |
|---|---|---|
| [Node.js](https://nodejs.org) | 24 (está en `.nvmrc`) | Correr el backend, la web y el panel. Con `nvm` o `fnm`, `nvm use` elige la versión correcta. Cada app instala sus propias dependencias con `npm install`: no hace falta nada global |
| [Docker](https://www.docker.com) | Docker Desktop, o Docker Engine con Compose v2 o superior | Levantar PostgreSQL (y las apps, si no se instala Node). El comando es `docker compose` (con espacio); el viejo `docker-compose` (con guion) no está soportado |
| [Git](https://git-scm.com) | cualquier versión reciente | Clonar el repositorio |

No hace falta instalar PostgreSQL: corre en un contenedor de Docker. Si ya tenés uno instalado, no hay conflicto: el contenedor usa el puerto `5433` (D-24).

## Cómo levantar el proyecto

Los comandos funcionan en PowerShell, en Git Bash y en Linux o macOS.

1. Clonar el repositorio y entrar en la carpeta:
   ```
   git clone https://github.com/joseviudes/aca-nomas-app.git
   cd aca-nomas-app
   ```
2. Levantar la base de datos:
   ```
   docker compose up -d
   ```
3. Esperar a que la base esté lista. Este comando tiene que mostrar `(healthy)` en la columna `STATUS`; si muestra `(health: starting)`, esperar unos segundos y repetir:
   ```
   docker compose ps
   ```
4. Crear el archivo de variables de entorno. Los valores de ejemplo ya apuntan a la base del paso 2, así que no hace falta cambiarlos:
   ```
   cp backend/.env.example backend/.env
   ```
5. Instalar las dependencias. También genera el cliente de Prisma:
   ```
   cd backend
   npm install
   ```
6. Crear las tablas (aplica las migraciones):
   ```
   npm run db:migrate
   ```
7. Cargar los datos ficticios:
   ```
   npm run db:seed
   ```
8. Levantar el backend:
   ```
   npm run dev
   ```
   Para comprobar que anda, abrir `http://localhost:3000/api/health`. Tiene que responder `{"status":"ok"}`. Todos los endpoints, para verlos y probarlos, están en **Swagger**: `http://localhost:3000/api/docs` (D-34).
9. Levantar la web y el panel, cada uno en otra terminal y desde la raíz del repositorio. No necesitan configuración: ya apuntan a la API del paso 8.
   ```
   cd web
   npm install
   npm run dev
   ```
   ```
   cd panel
   npm install
   npm run dev
   ```
   La web queda en `http://localhost:3001` y el panel en `http://localhost:3002`. Si solo vas a trabajar en el backend, este paso no hace falta.

| App | Carpeta | Puerto | Comando |
|---|---|---|---|
| Base de datos | — | 5433 | `docker compose up -d` |
| API | `backend/` | 3000 | `npm run dev` |
| Web pública | `web/` | 3001 | `npm run dev` |
| Panel del dueño | `panel/` | 3002 | `npm run dev` |

### Solo con Docker, sin instalar Node

Después de clonar, un solo comando levanta lo que elijas en modo desarrollo. Se recarga al guardar y la API aplica las migraciones al arrancar (D-26, D-33):

| Quiero levantar | Comando |
|---|---|
| Todo: base, API, web y panel | `docker compose --profile full up --watch` |
| La base y la API | `docker compose --profile api up --watch` |
| Solo la base | `docker compose up -d` |

Los perfiles (`api`, `web`, `panel`, `full`) se combinan, y se puede mezclar Docker con `npm run dev`. La primera vez, cargar los datos con `docker compose exec api npm run db:seed`. Todos los comandos, cómo apagar y qué tener en cuenta están en [docs/entorno-local.md](docs/entorno-local.md#levantar-las-apps-en-docker).

Los pasos 1 a 7, y el `npm install` del paso 9, se hacen una sola vez (o cuando cambian las dependencias). Los datos quedan guardados aunque se apague el contenedor o la computadora. El día a día (apagar, resetear la base, traer migraciones nuevas) está en [docs/entorno-local.md](docs/entorno-local.md).

### Cuentas del seed

Todas usan la contraseña `acanomas123`. Son datos ficticios que solo existen en la base local.

| Email | Rol |
|---|---|
| `admin@example.com` | Administrador |
| `owner1@example.com` a `owner10@example.com` | Dueño de un negocio cada uno |

## Comandos del backend

Se corren dentro de `backend/`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Levanta el backend y lo reinicia al guardar un cambio |
| `npm test` | Corre las pruebas |
| `npm run lint` | Revisa el código con ESLint |
| `npm run format` | Formatea el código con Prettier |
| `npm run typecheck` | Revisa los tipos de TypeScript |
| `npm run build` | Compila a `dist/` |
| `npm run db:migrate` | Aplica las migraciones pendientes. Si cambió `schema.prisma`, crea una migración nueva |
| `npm run db:seed` | Borra los datos y vuelve a cargar los ficticios |
| `npm run db:generate` | Regenera el cliente de Prisma |

Cada PR corre en GitHub Actions `lint`, `format:check`, `typecheck`, `test` y `build` del backend, y los mismos pasos para la web y el panel.

## Web pública

Corre en `web/` y es independiente del backend (dependencias y scripts propios). Pasos para levantarla en [web/README.md](web/README.md).

## Panel del dueño

Corre en `panel/` y es independiente del backend (dependencias y scripts propios). Pasos para levantarlo en [panel/README.md](panel/README.md).

Las dos apps llaman a la API en `http://localhost:3000/api` sin configurar nada. La API solo acepta esos orígenes (`localhost:3001` y `localhost:3002`) por CORS (D-28).

## Documentación

- [Especificación de requisitos (ERS)](docs/ers.md)
- [Registro de decisiones](docs/decisiones.md)
- [Épicas e historias](docs/epicas-e-historias.md)
- [Modelo de datos](docs/diagramas/modelo-de-datos.md)
- [Diseño de la API](docs/api.md)
- [Entorno local: el día a día](docs/entorno-local.md)
- [Cómo contribuir](CONTRIBUTING.md)

## Licencia

[MIT](LICENSE)
