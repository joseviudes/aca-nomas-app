---
name: convenciones-de-codigo
description: Convenciones de código de AcáNomás. Usar al nombrar archivos, clases, variables o tablas, al validar datos con Zod, al manejar errores, al escribir pruebas o comentarios, o al elegir un patrón de diseño.
---

# Convenciones de código

## Idioma

Código, base de datos y rutas en **inglés**. Interfaz, documentación, commits y PR en **español**. Los comentarios, en español.

| Español | Inglés |
|---|---|
| negocio | `business` |
| ficha | `listing` |
| rubro | `category` |
| localidad | `locality` |
| dueño | `owner` |
| horario | `openingHours` |
| abierto ahora | `isOpenNow` |
| hoy no abro | `closedToday` |
| pausa | `paused` |

Si falta una palabra, agregarla a esta tabla en el mismo PR.

## Nombres

| Qué | Formato | Ejemplo |
|---|---|---|
| Archivos | `kebab-case` + rol | `business.service.ts` |
| Clases | `PascalCase` | `BusinessService` |
| Variables y funciones | `camelCase` | `findBySlug` |
| Constantes | `UPPER_SNAKE_CASE` | `MAX_PAGE_SIZE` |
| Tablas | `snake_case`, plural | `opening_hours` |
| Interfaces | `PascalCase`, sin prefijo `I` | `BusinessRepository` |
| Implementaciones | nombre de la tecnología + contrato | `PrismaBusinessRepository` |

## TypeScript

- `strict` activado. Sin `any`: si hace falta, usar `unknown` y acotar.
- Tipos de los datos validados con `z.infer`, no escritos a mano.
- Funciones chicas, con una sola tarea.

## Validación

- Los esquemas de Zod hacen de DTO y viven en `schemas/` del módulo.
- El middleware `validate(schema)` valida cuerpo, parámetros y consulta.
- Las variables de entorno también se validan con Zod al arrancar.
- DAO y DTO son cosas distintas: el repositorio accede a datos; el DTO describe cómo viajan.

## Errores

- Se lanzan subclases de `AppError` (`NotFoundError`, `ForbiddenError`…), nunca `throw new Error("...")` suelto.
- Un solo middleware de errores arma la respuesta. Express 5 captura los errores de funciones `async`: no hace falta `try/catch` en cada ruta.
- Formato de la respuesta de error:

```json
{ "error": { "code": "BUSINESS_NOT_FOUND", "message": "No existe el negocio", "details": [] } }
```

El `code` es `UPPER_SNAKE_CASE` y estable. El `message` va en español.

## API

- Prefijo `/api` sin número de versión: `/api/businesses`.
- Rutas con sustantivos en plural.
- Paginación con `?page=1&limit=20`; la respuesta incluye `page`, `limit` y el total.
- Fechas en ISO 8601 UTC.
- Un login inválido da un error genérico: no revela si el email existe.

## Pruebas

- Las pruebas van en `backend/tests/` (ver `estructura-del-proyecto`), en archivos `.test.ts`.
- Vitest para lógica (`isOpenNow`, servicios). Se prueba **comportamiento**, no detalles internos.
- `isOpenNow` recibe la hora como parámetro: se prueba con cualquier fecha.
- Casos obligatorios de horarios: turno partido, cierre pasada la medianoche, día sin turnos, "hoy no abro", pausa.

## Comentarios y patrones

- Comentar el **porqué**, no el qué. Si hace falta explicar qué hace, mejorar el nombre.
- Un patrón de diseño se aplica solo si resuelve un problema real.
- ESLint y Prettier se ejecutan antes de subir. Si fallan, no se sube.
