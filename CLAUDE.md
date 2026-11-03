# AcáNomás

Directorio web de negocios locales: los vecinos encuentran negocios y ven si están abiertos ahora. Equipo de 4, Devlights Bootcamp 5.0. Entrega a mediados de diciembre de 2026.

Este archivo se lee siempre. Es corto a propósito: tiene las reglas que no se negocian y dice **qué skill usar** para cada tarea. El detalle está en las skills y en `docs/`.

## Stack

Node.js + Express 5 + TypeScript (ESM) · Prisma · PostgreSQL (Docker local; Supabase solo en staging y producción) · Zod · Vitest · ESLint + Prettier. Frontend más adelante.

El código del servidor está en `backend/` y las pruebas en `backend/tests/`. El mapa de carpetas completo está en la skill `estructura-del-proyecto`.

## Reglas que no se negocian

1. **Capas:** `controllers → services → repositories`. No se saltean capas. Los módulos se hablan por servicios, nunca por repositorios ni tablas ajenas.
2. **Todo lo externo (base, fotos, mails) va detrás de un puerto** en `shared/ports/`. El dominio no importa Express ni Prisma.
3. **Idioma:** código, base de datos y rutas de la API en inglés. Interfaz, documentación, commits y PR en español.
4. **Validación con Zod** en el borde (middleware `validate`). Nada llega al servicio sin validar.
5. **Sin secretos en el repo.** El repositorio es público. `.env` ignorado, `.env.example` de muestra, datos ficticios.
6. **`main` está protegida.** Todo entra por PR con una revisión de un compañero.
7. **Hecho = funciona, tiene prueba, el PR fue revisado y está mergeado.**
8. **Una decisión técnica nueva se registra** en `docs/decisiones.md`. Las decisiones viejas no se borran: se marcan como reemplazadas.

## Qué skill usar

| Si vas a… | Usá la skill |
|---|---|
| Crear una rama, hacer un commit o abrir un PR | `git-y-pr` |
| Crear un archivo o carpeta, o no sabés dónde va algo | `estructura-del-proyecto` |
| Nombrar algo, validar, manejar errores, escribir un comentario | `convenciones-de-codigo` |
| Agregar o cambiar un endpoint de la API | `nuevo-endpoint` |
| Escribir una historia, tomar una tarjeta o mover una tarjeta en Trello | `historias-en-trello` |
| Escribir o editar documentación (`docs/`, README, decisiones) | `estilo-de-docs` |

Una tarea suele necesitar más de una skill. Por ejemplo, un endpoint nuevo usa `nuevo-endpoint`, y al final `git-y-pr`. Al empezar, decí qué skills vas a usar.

## Flujo de una historia

1. Tomar la tarjeta de "Sprint actual", asignarse y pasarla a "En curso" (`historias-en-trello`).
2. Crear la rama desde `main` actualizada (`git-y-pr`).
3. Hacer las tareas del checklist de a una, con commits chicos.
4. Abrir el PR, pasar la tarjeta a "En revisión" y pedir revisión a un compañero.
5. Con el PR aprobado y mergeado, pasar la tarjeta a "Hecho".

## Documentación del proyecto

Está en `docs/`: `ers.md` (qué hace el sistema), `decisiones.md` (por qué se hizo así) y `epicas-e-historias.md` (el trabajo). Ante la duda técnica, leer `decisiones.md` antes de proponer otra cosa.

## Cuando haya dudas

Si algo no está definido en estos documentos, **no lo inventes**: preguntalo al equipo o registralo como decisión pendiente.
