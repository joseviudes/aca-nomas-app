---
name: git-y-pr
description: Reglas de Git de AcáNomás. Usar al crear una rama, escribir un commit, abrir o revisar un pull request, o cuando se pregunte qué significa "hecho".
---

# Git y pull requests

El repositorio es **público** y `main` está **protegida**: nada se sube directo a `main`.

Las reglas completas están en `CONTRIBUTING.md` (raíz del repo). Esta skill es su resumen: si difieren, vale `CONTRIBUTING.md` y hay que corregir la skill.

## Ramas

Formato: `tipo/descripcion-corta-en-ingles`, siempre desde `main` actualizada.

| Tipo | Para qué |
|---|---|
| `feat/` | funcionalidad nueva |
| `fix/` | corregir un error |
| `docs/` | solo documentación |
| `chore/` | configuración, dependencias, CI |

Ejemplos: `feat/business-search`, `fix/opening-hours-midnight`, `docs/api-errors`.

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

1. Subir la rama y abrir el PR contra `main`.
2. Título con el mismo formato que un commit.
3. Completar la plantilla (abajo).
4. Pasar la tarjeta de Trello a "En revisión".
5. Pedir revisión a **un compañero**. La aprobación final es del responsable del repositorio.
6. Si piden cambios, corregir en la misma rama. No abrir otro PR.

Un PR corresponde a una historia o a una parte clara de ella. Si supera unos 400 renglones cambiados, conviene partirlo.

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
- [ ] Actualicé la documentación (si cambia una decisión)
```

## Al revisar el PR de un compañero

- Probar que hace lo que dice la historia, no solo leer el código.
- Revisar que respete las capas y las convenciones (`estructura-del-proyecto`, `convenciones-de-codigo`).
- Comentar con respeto y con motivo: "esto podría ser X porque Y".
- Aprobar solo si estaría dispuesto a mantener ese código.

## Definición de hecho

Funciona, tiene prueba, el PR fue revisado y está mergeado.

## Nunca

- Subir `.env`, claves o datos reales de personas.
- Hacer `push --force` sobre `main`.
- Mergear tu propio PR sin revisión.
- Agregar `Co-Authored-By` o cualquier atribución a una IA en commits o PR.
