---
name: convenciones-de-codigo
description: Convenciones de código de AcáNomás. Usar al nombrar archivos, clases, variables o tablas, al validar datos con Zod, al manejar errores, al escribir pruebas o comentarios, o al elegir un patrón de diseño.
---

# Convenciones de código

## Idioma

Código, base de datos y rutas de la API en **inglés**. Interfaz, documentación, commits y PR en **español**. Los comentarios, en español.

Las **URLs que ve el usuario** en la web y el panel van en español (`/negocios/[slug]`, `/mis-negocios`), pero el código que las atiende sigue en inglés (`BusinessPage`, `MyBusinessesPage`) (D-29).

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
| pausa | `isPaused` |

Si falta una palabra, agregarla a esta tabla en el mismo PR.

## Nombres

| Qué | Formato | Ejemplo |
|---|---|---|
| Archivos | `kebab-case` + rol | `business.service.ts` |
| Componentes de React (`web/`, `panel/`) | `PascalCase.tsx` | `BusinessCard.tsx` (D-31) |
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
- Las variables de entorno también se validan con Zod al arrancar, en las tres apps (`config/env.ts`). Fuera de producción tienen un valor por defecto; en producción son obligatorias.
- Los mismos esquemas documentan el endpoint en Swagger (D-34): no se escribe la forma de los datos dos veces.
- En el frontend, los formularios se validan con un esquema Zod del módulo, y la respuesta de la API se puede validar pasando `schema` al `http-client`.
- DAO y DTO son cosas distintas: el repositorio accede a datos; el DTO describe cómo viajan.

## Errores

- Se lanzan subclases de `AppError` (`NotFoundError`, `ForbiddenError`…), nunca `throw new Error("...")` suelto.
- Un solo middleware de errores arma la respuesta. Express 5 captura los errores de funciones `async`: no hace falta `try/catch` en cada ruta.
- Formato de la respuesta de error:

```json
{ "error": { "code": "BUSINESS_NOT_FOUND", "message": "No existe el negocio", "details": [] } }
```

El `code` es `UPPER_SNAKE_CASE` y estable. El `message` va en español.

**En el frontend**, todo error del `http-client` llega como `ApiError` (D-30): con el `code` de la API, o `NETWORK_ERROR` (sin conexión) o `INVALID_RESPONSE` (respuesta inesperada). La pantalla decide qué mostrar según `error.code`, nunca comparando el texto de `error.message`.

## API

- Prefijo `/api` sin número de versión: `/api/businesses`.
- Rutas con sustantivos en plural.
- Paginación con `?page=1&limit=20`; la respuesta incluye `page`, `limit` y el total.
- Fechas en ISO 8601 UTC.
- Un login inválido da un error genérico: no revela si el email existe.

## Pruebas

- Las pruebas van en `backend/tests/`, `web/tests/` y `panel/tests/` (ver `estructura-del-proyecto` y `estructura-del-frontend`), en archivos `.test.ts`.
- En el frontend, las llamadas a la API se prueban reemplazando `fetch` con `vi.stubGlobal`: no hace falta la API prendida.
- Vitest para lógica (`isOpenNow`, servicios). Se prueba **comportamiento**, no detalles internos.
- `isOpenNow` recibe la hora como parámetro: se prueba con cualquier fecha.
- Casos obligatorios de horarios: turno partido, cierre pasada la medianoche, día sin turnos, "hoy no abro", pausa.

## Comentarios y patrones

- Comentar el **porqué**, no el qué. Si hace falta explicar qué hace, mejorar el nombre.
- Un patrón de diseño se aplica solo si resuelve un problema real.
- ESLint y Prettier se ejecutan antes de subir. Si fallan, no se sube.
