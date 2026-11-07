# AcáNomás

Directorio web de negocios locales: los vecinos encuentran negocios y ven si están abiertos ahora. Equipo de 5, Devlights Bootcamp 5.0. Entrega a mediados de diciembre de 2026.

Este archivo se lee siempre. Es corto a propósito: tiene las reglas que no se negocian y dice **qué skill usar** para cada tarea. El detalle está en las skills y en `docs/`.

## Stack

Node.js + Express 5 + TypeScript (ESM) · Prisma · PostgreSQL (Docker local; Supabase solo en staging y producción) · Zod · Vitest · ESLint + Prettier. Frontend: web pública con Next.js (`web/`) y panel con Vite, React y React Router (`panel/`), los dos con `fetch` y Zod.

El código del servidor está en `backend/` y las pruebas en `backend/tests/`. El mapa de carpetas completo está en la skill `estructura-del-proyecto`; la organización interna del frontend, en `estructura-del-frontend`.

## Reglas que no se negocian

1. **Capas:** en el backend, `controllers → services → repositories`; en la web y el panel, `pages → hooks → api` (D-31). No se saltean capas. Un módulo usa a otro solo por su servicio (backend) o su `index.ts` (frontend), nunca por dentro. ESLint lo verifica.
2. **Todo lo externo (base, fotos, mails) va detrás de un puerto** en `shared/ports/`. El dominio no importa Express ni Prisma. En el frontend, solo `shared/api/http-client.ts` llama a `fetch` (D-30).
3. **Idioma:** código, base de datos y rutas de la API en inglés. Interfaz, documentación, commits, PR y **URLs del frontend** (`/negocios/[slug]`) en español (D-29).
4. **Validación con Zod** en el borde (middleware `validate` en el backend, formularios y respuestas en el frontend). Nada llega al servicio sin validar. Cada endpoint se documenta en Swagger con esos mismos esquemas (D-34).
5. **Sin secretos en el repo.** El repositorio es público. `.env` ignorado, `.env.example` de muestra, datos ficticios.
6. **`develop` y `main` están protegidas.** Todo entra por PR con la revisión de un compañero. Las historias van a `develop`; `main` recibe `develop` al cerrar el sprint (D-39).
7. **Hecho = funciona, tiene prueba, el PR fue revisado y está mergeado.**
8. **Una decisión técnica nueva se registra** en `docs/decisiones.md`. Las decisiones viejas no se borran: se marcan como reemplazadas.

## Qué skill usar

| Si vas a… | Usá la skill |
|---|---|
| Crear una rama, hacer un commit o abrir un PR | `git-y-pr` |
| Crear un archivo o carpeta, o no sabés dónde va algo | `estructura-del-proyecto` |
| Crear una página, componente, hook o llamada a la API en `web/` o `panel/` | `estructura-del-frontend` |
| Nombrar algo, validar, manejar errores, escribir un comentario | `convenciones-de-codigo` |
| Agregar o cambiar un endpoint de la API | `nuevo-endpoint` |
| Agregar o cambiar una pantalla de la web o del panel | `nueva-pantalla` |
| Escribir una historia, tomar o mover una tarjeta en Trello, o saber de qué área es | `historias-en-trello` |
| Escribir o editar documentación (`docs/`, README, decisiones) | `estilo-de-docs` |

Para levantar el proyecto (con Node o con Docker), las variables de entorno y los comandos del día a día: `README.md` y `docs/entorno-local.md`. Los endpoints se ven y se prueban en Swagger: `http://localhost:3000/api/docs`.

Una tarea suele necesitar más de una skill. Por ejemplo, un endpoint nuevo usa `nuevo-endpoint`, y al final `git-y-pr`; una pantalla nueva usa `nueva-pantalla` y `estructura-del-frontend`. Al empezar, decí qué skills vas a usar.

## Flujo de una historia

1. Tomar la tarjeta de "Sprint actual", asignarse y pasarla a "En curso" (`historias-en-trello`). Si tiene backend y pantalla, la toman el dueño del módulo y el de la app (D-40).
2. Crear una rama para la historia desde `develop` actualizada (`git-y-pr`). Si son dos, trabajan en la misma rama.
3. El primer commit del backend es el contrato; el frontend arranca con datos de ejemplo y termina conectando con la API (D-40). Las tareas del checklist, de a una, con commits chicos.
4. Con la historia completa, abrir un solo PR contra `develop`, pasar la tarjeta a "En revisión" y pedir revisión a un compañero.
5. Con el PR aprobado y mergeado, pasar la tarjeta a "Hecho".

## Documentación del proyecto

Está en `docs/`: `ers.md` (qué hace el sistema), `decisiones.md` (por qué se hizo así), `epicas-e-historias.md` (el trabajo) y `diseno.md` (el mockup y los tokens visuales). Ante la duda técnica, leer `decisiones.md` antes de proponer otra cosa.

## Cuando haya dudas

Si algo no está definido en estos documentos, **no lo inventes**: preguntalo al equipo o registralo como decisión pendiente.
