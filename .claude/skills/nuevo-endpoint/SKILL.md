---
name: nuevo-endpoint
description: Pasos para agregar o modificar un endpoint de la API de AcáNomás, de la ruta a la prueba y Swagger. Usar cuando una tarea toque rutas, controladores, servicios o repositorios.
---

# Nuevo endpoint

Seguir los pasos en orden. Antes de empezar, leer los criterios de aceptación de la historia en Trello.

## Antes de escribir código

- ¿El módulo ya existe? Si no, crearlo con la estructura de `estructura-del-proyecto`.
- ¿Depende de otro módulo? Se usa **su servicio**, nunca su repositorio.
- ¿Toca la base? Primero la migración de Prisma (paso 1).

## El contrato primero (si la historia tiene pantalla)

El frontend arma la pantalla con datos de ejemplo mientras se hace el backend, así que necesita saber la forma de la respuesta el primer día (D-40). Por eso, **el primer commit del backend en la rama de la historia es el contrato**:

1. El esquema de Zod de la respuesta (y del cuerpo, si recibe uno) en `schemas/`.
2. Su declaración en `routes/<módulo>.openapi.ts` y el registro en `src/openapi.ts` (paso 9), sin la lógica todavía.
3. Commit (`feat(businesses): define el contrato de GET /api/businesses`) y `push`, tildar la tarea "[BE] Contrato" y avisar en un comentario de la tarjeta: "Contrato listo".

Después del contrato, si algo de la respuesta tiene que cambiar, se acuerda con quien hace la pantalla y se cambia el esquema en la misma rama.

## Pasos

1. **Base de datos (si cambia el modelo):** editar `backend/prisma/schema.prisma`, crear la migración y actualizar el seed. Las tablas van en `snake_case` y plural. La migración se sube en el mismo PR.
2. **Esquema Zod** en `schemas/`: cuerpo, parámetros y consulta. Los tipos salen de `z.infer`.
3. **Contrato del repositorio** (interfaz) en `shared/ports/` y **repositorio** en `repositories/` (`PrismaXRepository`).
4. **Servicio** en `services/`: reglas de negocio. Lanza subclases de `AppError` con un `code` estable (`BUSINESS_NOT_FOUND`).
5. **Controlador** en `controllers/`: lee la request, llama al servicio, devuelve la response. Sin reglas de negocio.
6. **Ruta** en `routes/`: sustantivo en plural bajo `/api`, con `validate(schema)` y, si es del panel, `requireAuth`.
7. **Conexión** en `container.ts` y registro del router del módulo en `src/routes.ts`, sin el prefijo `/api` (D-23). `app.ts` no se toca.
8. **Pruebas** en `backend/tests/unit/<módulo>/` con Vitest sobre el servicio: el caso feliz, cada error y los bordes. Cuando existan los endpoints principales, también una prueba con Supertest en `backend/tests/integration/<módulo>/`. Si el endpoint es del panel, probar 401 (sin sesión) y 403 (negocio ajeno).
9. **Documentación (D-34):** declarar el endpoint en `routes/<módulo>.openapi.ts` con los **mismos esquemas Zod** del paso 2 (`summary`, `tags`, petición, respuesta y errores propios con `errorResponse`) y registrar esos paths en `src/openapi.ts`. Verlo y probarlo en `http://localhost:3000/api/docs`. Actualizar la lista de la sección 4 de `docs/api.md` si la ruta cambió. Postman no repite el endpoint (D-35): solo si el endpoint es parte de un flujo de varios pasos (por ejemplo, necesita sesión), agregarlo al escenario y exportar la colección a `docs/postman/`. Si había una request `[Pendiente]` para este endpoint, sacarla.
10. **Cierre:** `lint` y `test` en verde y tildar la tarea en el checklist de la historia. El PR es uno por historia (D-39): si la historia tiene pantalla, se abre cuando la pantalla también está conectada a la API (`git-y-pr`).

## Controles de calidad

- [ ] Nada llega al servicio sin pasar por `validate`.
- [ ] Un campo que el dueño marcó como oculto no sale en la API pública.
- [ ] Los errores usan el formato `{ error: { code, message, details } }`.
- [ ] Las listas paginan con `page` y `limit` y devuelven el total.
- [ ] No hay datos sensibles en las respuestas ni en los logs (contraseñas, hashes, tokens).
- [ ] Ninguna capa se salteó.

## Si algo no está definido

Las reglas comunes (respuestas, paginación, errores, fechas, códigos HTTP) están en `docs/api.md` (D-25). Si falta una regla que afecta a varios módulos, **no la inventes en tu rama**: acordala con el equipo, registrala en `docs/decisiones.md`, sumala a `docs/api.md` y usá la misma en todos los módulos.
