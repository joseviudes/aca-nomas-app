---
name: git-y-pr
description: Reglas de Git de AcáNomás. Usar al crear una rama, escribir un commit, abrir o revisar un pull request, o cuando se pregunte qué significa "hecho".
---

# Git y pull requests

El repositorio es **público**. `develop` (el trabajo del sprint) y `main` (lo entregado) están **protegidas**: nada se sube directo a ninguna de las dos (D-39).

Las reglas completas están en `CONTRIBUTING.md` (raíz del repo). Esta skill es su resumen: si difieren, vale `CONTRIBUTING.md` y hay que corregir la skill.

## Ramas

Formato: `tipo/descripcion-corta-en-ingles`, desde `develop` actualizada. Solo `hotfix/` sale de `main`.

| Tipo | Para qué |
|---|---|
| `feat/` | funcionalidad nueva |
| `fix/` | corregir un error |
| `docs/` | solo documentación |
| `chore/` | configuración, dependencias, CI |
| `hotfix/` | arreglo urgente de lo que ya está en `main` |

- **Una rama por historia**, con su código: `feat/us-01-business-list`, `feat/ht-01-open-now`.
- Si la historia tiene backend y pantalla, las dos personas usan **la misma rama** (D-40). Antes de cada `push`, `git pull --rebase`; nunca `push --force`.
- Si hace falta lo nuevo de `develop`: `git merge develop` dentro de la rama.

**Cierre del sprint:** después de la demo, PR de `develop` a `main` (`chore: entrega del sprint N`), mergeado con *merge commit*, nunca con *squash*.

**Arreglo urgente:** rama `hotfix/` desde `main`, PR a `main`, y después PR de `main` a `develop` para no perder el arreglo.

## Commits

Formato: `tipo(módulo): descripción en español`. El tipo va en inglés; la descripción, en español, en presente y sin punto final.

Tipos: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`.

```
feat(businesses): agrega búsqueda por texto
fix(opening-hours): corrige el cierre pasada la medianoche
test(auth): cubre el login con credenciales inválidas
chore: actualiza dependencias de Prisma
```

- Un commit = un cambio con sentido. Commits chicos y frecuentes.
- No mezclar en un mismo commit formato, refactor y funcionalidad.
- Sin atribución a IA: no agregar `Co-Authored-By` ni mencionar a Claude u otra herramienta en commits ni en PR. El autor es quien sube el cambio.

## Pull request

1. Con la historia completa (backend, pantalla y conexión con la API), abrir el PR contra `develop`.
2. Título con el mismo formato que un commit.
3. Completar la plantilla (abajo).
4. Pasar la tarjeta de Trello a "En revisión".
5. Pedir revisión a **un compañero** que no haya hecho la historia. Con su aprobación, se mergea.
6. Si piden cambios, corregir en la misma rama. No abrir otro PR.

**Un PR por historia**, con backend y pantalla juntos, aunque pase los 400 renglones. No se abre un PR por cada parte (D-39). En los PR que no son de una historia, conviene no pasar los 400 renglones.

### Plantilla de PR

Copiar a `.github/pull_request_template.md`.

```markdown
## Qué cambia
<!-- Una o dos frases. -->

## Historia
<!-- US-xx o HT-xx, con el enlace a la tarjeta de Trello. -->

## Cómo probarlo
<!-- Pasos, el endpoint en Swagger o el escenario de Postman. -->

## Lista de verificación
- [ ] Cumple los criterios de aceptación de la historia
- [ ] Tiene pruebas y pasan (`lint` y `test` en verde)
- [ ] No incluye secretos ni datos reales
- [ ] Documenté el endpoint en `routes/<módulo>.openapi.ts` y se ve bien en Swagger (`/api/docs`) (si toca la API)
- [ ] Actualicé los escenarios de Postman en `docs/postman/` (si cambia un flujo de varios pasos, D-35)
- [ ] La pantalla usa la API real, no los datos de ejemplo (si tiene pantalla, D-40)
- [ ] Actualicé la documentación (si cambia una decisión)
```

## Al revisar el PR de un compañero

- Probar que hace lo que dice la historia, no solo leer el código.
- Revisar que respete las capas y las convenciones (`estructura-del-proyecto`, `convenciones-de-codigo`).
- Comentar con respeto y con motivo: "esto podría ser X porque Y".
- Aprobar solo si estaría dispuesto a mantener ese código.

## Definición de hecho

Funciona, tiene prueba, el PR fue revisado y está mergeado en `develop`. Si tiene pantalla, ya está conectada a la API: ningún dato de ejemplo queda en uso.

## Nunca

- Subir `.env`, claves o datos reales de personas.
- Hacer `push --force` sobre `develop`, `main` o una rama que comparte otra persona.
- Mergear tu propio PR sin revisión.
- Agregar `Co-Authored-By` o cualquier atribución a una IA en commits o PR.
