# AcáNomás

Directorio web de negocios locales: los vecinos encuentran negocios de su localidad y saben si están abiertos ahora.

## Estado

En construcción. Etapa actual: **EP-00 Cimientos** (repositorio, backend inicial, base de datos e infraestructura).

## Stack

- **Backend:** Node.js, Express 5 y TypeScript (ESM)
- **Base de datos:** PostgreSQL con Prisma
- **Desarrollo local:** Docker
- **Validación:** Zod

## Estructura

```
backend/   API REST
docs/      ERS, registro de decisiones, épicas e historias
```

## Documentación

- [Especificación de requisitos (ERS)](docs/ers.md)
- [Registro de decisiones](docs/decisiones.md)
- [Épicas e historias](docs/epicas-e-historias.md)
- [Entorno local sin Docker para el backend](docs/entorno-local.md)

## Cómo levantar el proyecto

`docker-compose.yml` levanta PostgreSQL local en el puerto `5433`:

```
docker compose up -d
```

Para correr el backend (migraciones, seed, modo desarrollo), ver [docs/entorno-local.md](docs/entorno-local.md).

## Licencia

[MIT](LICENSE)
