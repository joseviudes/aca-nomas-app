# Cómo contribuir a AcáNomás

Reglas para trabajar en el repositorio: ramas, commits, pull requests y cuándo una tarea está terminada. Si esta guía y otra fuente difieren, vale esta guía.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 03/11/2026 | Tobias | Versión inicial |
| 0.2 | 06/11/2026 | Tobias | Agrega "Tu primer día". Los secretos van en el `.env` de cada app |
| 0.3 | 07/11/2026 | Tobias | Ramas `develop` y `main`, una rama y un PR por historia, y arreglos urgentes (D-39). El contrato primero y el frontend con datos de ejemplo (D-40) |

## Índice

1. [Tu primer día](#tu-primer-día)
2. [Reglas básicas](#reglas-básicas)
3. [Flujo de una tarea](#flujo-de-una-tarea)
4. [Ramas](#ramas)
5. [Commits](#commits)
6. [Pull requests](#pull-requests)
7. [Revisar el PR de un compañero](#revisar-el-pr-de-un-compañero)
8. [Definición de hecho](#definición-de-hecho)
9. [Nunca](#nunca)

## Tu primer día

El recorrido para alguien que se suma al proyecto, en orden. Cada paso remite a donde está el detalle.

1. **Accesos.** Tener acceso al repositorio en GitHub y al tablero de Trello. Si falta alguno, pedírselo a Tobias.
2. **Instalar.** Git y Docker Desktop. Node 24 solo si preferís correr las apps sin Docker.
3. **Levantar el proyecto.** Clonar el repo, copiar cada `.env.example` a `.env` (en `backend/`, `web/` y `panel/`) y seguir "Cómo levantar el proyecto" del `README.md`. Con Docker alcanza con `docker compose --profile full up --watch` y, la primera vez, `docker compose exec api npm run db:seed`. Funciona si abren la API (`http://localhost:3000/api/docs`), la web (`http://localhost:3001`) y el panel (`http://localhost:3002`). Si algo falla, mirar "Problemas comunes" en `docs/entorno-local.md`.
4. **Leer, en este orden:**
   - `CLAUDE.md`: las reglas que no se negocian y qué skill usar para cada tarea.
   - `docs/ers.md`, por arriba: qué hace el sistema y qué entra en el MVP.
   - Si vas a backend: la skill `nuevo-endpoint` y `docs/api.md`.
   - Si vas a frontend: la skill `nueva-pantalla` y `docs/diseno.md`, con el enlace al mockup.
5. **Tomar una tarjeta.** De "Sprint actual" en Trello: asignártela y pasarla a "En curso". Leer los criterios de aceptación antes de escribir código.
6. **Primer PR.** Seguir el [flujo de una tarea](#flujo-de-una-tarea): rama de la historia desde `develop` actualizada, commits chicos, PR con la plantilla, la tarjeta a "En revisión" y la revisión de un compañero.
7. **Si algo no está claro,** no lo inventes: mirá `docs/decisiones.md` o preguntale al equipo.

## Reglas básicas

- El repositorio es **público**. Todo lo que se sube lo puede leer cualquiera.
- `develop` y `main` están **protegidas**. Nadie sube directo a ninguna de las dos: todo entra por pull request (PR) con la aprobación de un compañero. `develop` tiene el trabajo del sprint; `main`, lo entregado (D-39).
- Los datos de prueba son **ficticios**. Nunca se suben datos reales de personas.
- Los secretos (claves, contraseñas, tokens) van en el `.env` de cada app (`backend/`, `web/` y `panel/`), que está ignorado por Git. Cada `.env.example` muestra qué variables hacen falta, sin valores reales.

## Flujo de una tarea

Cada historia se hace en **una rama y un PR**. Si tiene backend y pantalla, la hacen dos personas en la misma rama: el dueño del módulo del backend y el de la app (D-40).

1. Tomar una tarjeta de "Sprint actual" en Trello, asignársela (las dos personas, si son dos) y pasarla a "En curso". Máximo dos tarjetas en curso por persona.
2. Quien empieza crea la rama desde `develop` actualizada y la sube. Quien se suma después la trae con `git switch`:

   ```bash
   git switch develop
   git pull
   git switch -c feat/us-01-business-list
   git push -u origin feat/us-01-business-list
   ```

3. **El contrato primero.** El primer commit del backend es el esquema de Zod de la respuesta y su documentación en Swagger, sin la lógica. Se tilda la tarea "Contrato" y se avisa en un comentario de la tarjeta.
4. **El frontend arranca con datos de ejemplo** que respetan el contrato, sin esperar el resto del backend. Su última tarea es conectar la pantalla con la API.
5. Hacer las tareas del checklist de a una, con commits chicos. Antes de cada `push`, `git pull --rebase`.
6. Correr `lint` y `test` antes de subir. Si fallan, no se sube.
7. Con la historia completa (backend, pantalla y conexión), abrir **un solo PR** contra `develop`, pasar la tarjeta a "En revisión" y pedir revisión a un compañero que no la haya hecho.
8. Con el PR aprobado y mergeado, pasar la tarjeta a "Hecho".

Si algo te bloquea, avisalo en un comentario de la tarjeta.

## Ramas

Hay dos ramas fijas, las dos protegidas: **`develop`**, donde entra el trabajo del sprint, y **`main`**, que tiene lo entregado. `develop` es la rama por defecto: un PR nuevo apunta ahí solo.

Formato de las demás: `tipo/descripcion-corta-en-ingles`. Se crean desde `develop` actualizada, salvo `hotfix/`, que sale de `main`.

| Tipo | Para qué | Ejemplo |
|---|---|---|
| `feat/` | Funcionalidad nueva | `feat/business-search` |
| `fix/` | Corregir un error | `fix/opening-hours-midnight` |
| `docs/` | Solo documentación | `docs/api-errors` |
| `chore/` | Configuración, dependencias, CI | `chore/eslint-setup` |
| `hotfix/` | Arreglo urgente de lo que ya está en `main` | `hotfix/listing-crash` |

- **Una rama por historia**, con el código de la historia en el nombre: `feat/us-01-business-list`, `feat/ht-01-open-now`.
- **Una rama compartida** (backend y pantalla en la misma): antes de cada `push`, `git pull --rebase`. Nunca `push --force`: borra el trabajo del otro.
- **Si `develop` avanzó** y tu rama necesita esos cambios: `git merge develop` dentro de tu rama.

**Cierre del sprint.** Después de la demo, se abre un PR de `develop` a `main` (título `chore: entrega del sprint N`). Se mergea con **merge commit**, nunca con *squash*: si no, las dos ramas se separan y aparecen conflictos.

**Arreglo urgente.**
1. Rama `hotfix/` desde `main` y PR directo a `main`.
2. Después, un PR de `main` a `develop` (título `chore: lleva el arreglo de main a develop`), para que el arreglo no se pierda en el próximo sprint.

## Commits

Se usan commits convencionales: un formato fijo que permite leer el historial de un vistazo.

Formato: `tipo(módulo): descripción`

- El **tipo** va en inglés.
- El **módulo** es opcional. Indica qué parte del sistema cambia (`businesses`, `auth`, `opening-hours`).
- La **descripción** va en español, en presente y sin punto final.

| Tipo | Para qué |
|---|---|
| `feat` | Funcionalidad nueva |
| `fix` | Corrección de un error |
| `docs` | Documentación |
| `chore` | Configuración, dependencias, CI |
| `refactor` | Cambio de código que no modifica el comportamiento |
| `test` | Pruebas |

Ejemplos:

```
feat(businesses): agrega búsqueda por texto
fix(opening-hours): corrige el cierre pasada la medianoche
test(auth): cubre el login con credenciales inválidas
chore: actualiza dependencias de Prisma
```

Reglas:

- Un commit = un cambio con sentido. Commits chicos y frecuentes.
- No mezclar en un mismo commit formato, refactor y funcionalidad.
- **Sin atribución a IA.** No se agrega `Co-Authored-By` ni se menciona a Claude u otra herramienta en commits ni en PR. El autor es quien sube el cambio y responde por él.

## Pull requests

1. **Título:** mismo formato que un commit (`feat(businesses): agrega búsqueda por texto`).
2. **Descripción:** completar la plantilla que aparece al abrir el PR (`.github/pull_request_template.md`). Incluye qué cambia, la historia de Trello, cómo probarlo y una lista de verificación.
3. **Revisión:** pedirla a un compañero que no haya hecho la historia. Con su aprobación, se mergea (D-39).
4. **Cambios pedidos:** se corrigen en la misma rama. No se abre otro PR.
5. **Tamaño:** **un PR por historia**, con backend y pantalla juntos, aunque pase los 400 renglones. No se abre un PR por cada parte. En los PR que no son de una historia (configuración, documentación), conviene no pasar los 400 renglones.

## Revisar el PR de un compañero

- Probar que hace lo que dice la historia, no solo leer el código.
- Revisar que respete las capas y las convenciones del proyecto (ver `CLAUDE.md` y `docs/decisiones.md`).
- Comentar con respeto y con motivo: "esto podría ser X porque Y".
- Aprobar solo si estarías dispuesto a mantener ese código.

## Definición de hecho

Una tarea está **hecha** cuando cumple las cuatro condiciones:

1. Funciona y cumple los criterios de aceptación de la historia. Si tiene pantalla, ya está conectada a la API: ningún dato de ejemplo queda en uso (D-40).
2. Tiene prueba.
3. El PR fue revisado y aprobado.
4. Está mergeado en `develop`.

Si falta una, la tarea no está hecha.

## Nunca

- Subir `.env`, claves, contraseñas o datos reales de personas.
- Hacer `push --force` sobre `develop`, `main` o una rama que comparte otra persona.
- Mergear tu propio PR sin revisión.
- Agregar `Co-Authored-By` o cualquier atribución a una IA en commits o PR.

Si se sube un secreto por error, avisar al equipo y **cambiarlo de inmediato**. Borrarlo del repositorio no alcanza: queda en el historial de Git.
