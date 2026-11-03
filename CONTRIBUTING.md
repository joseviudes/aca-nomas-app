# Cómo contribuir a AcáNomás

Reglas para trabajar en el repositorio: ramas, commits, pull requests y cuándo una tarea está terminada. Si esta guía y otra fuente difieren, vale esta guía.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 03/11/2026 | Tobias | Versión inicial |

## Índice

1. [Reglas básicas](#reglas-básicas)
2. [Flujo de una tarea](#flujo-de-una-tarea)
3. [Ramas](#ramas)
4. [Commits](#commits)
5. [Pull requests](#pull-requests)
6. [Revisar el PR de un compañero](#revisar-el-pr-de-un-compañero)
7. [Definición de hecho](#definición-de-hecho)
8. [Nunca](#nunca)

## Reglas básicas

- El repositorio es **público**. Todo lo que se sube lo puede leer cualquiera.
- `main` está **protegida**. Nadie sube directo a `main`: todo entra por pull request (PR) con la aprobación de un compañero.
- Los datos de prueba son **ficticios**. Nunca se suben datos reales de personas.
- Los secretos (claves, contraseñas, tokens) van en `backend/.env`, que está ignorado por Git. `backend/.env.example` muestra qué variables hacen falta, sin valores reales.

## Flujo de una tarea

1. Tomar una tarjeta de "Sprint actual" en Trello, asignársela y pasarla a "En curso". Máximo dos tarjetas en curso por persona.
2. Actualizar `main` y crear la rama:

   ```bash
   git switch main
   git pull
   git switch -c feat/business-search
   ```

3. Hacer las tareas del checklist de a una, con commits chicos.
4. Correr `lint` y `test` antes de subir. Si fallan, no se sube.
5. Subir la rama y abrir el PR contra `main`.
6. Pasar la tarjeta a "En revisión" y pedir revisión a un compañero.
7. Con el PR aprobado y mergeado, pasar la tarjeta a "Hecho".

Si algo te bloquea, avisalo en un comentario de la tarjeta.

## Ramas

Formato: `tipo/descripcion-corta-en-ingles`. Siempre se crea desde `main` actualizada.

| Tipo | Para qué | Ejemplo |
|---|---|---|
| `feat/` | Funcionalidad nueva | `feat/business-search` |
| `fix/` | Corregir un error | `fix/opening-hours-midnight` |
| `docs/` | Solo documentación | `docs/api-errors` |
| `chore/` | Configuración, dependencias, CI | `chore/eslint-setup` |

Una rama corresponde a una historia o a una parte clara de ella.

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
3. **Revisión:** pedirla a un compañero. La aprobación final es del responsable del repositorio.
4. **Cambios pedidos:** se corrigen en la misma rama. No se abre otro PR.
5. **Tamaño:** si el PR supera unos 400 renglones cambiados, conviene partirlo. Un PR chico se revisa mejor y más rápido.

## Revisar el PR de un compañero

- Probar que hace lo que dice la historia, no solo leer el código.
- Revisar que respete las capas y las convenciones del proyecto (ver `CLAUDE.md` y `docs/decisiones.md`).
- Comentar con respeto y con motivo: "esto podría ser X porque Y".
- Aprobar solo si estarías dispuesto a mantener ese código.

## Definición de hecho

Una tarea está **hecha** cuando cumple las cuatro condiciones:

1. Funciona y cumple los criterios de aceptación de la historia.
2. Tiene prueba.
3. El PR fue revisado y aprobado.
4. Está mergeado en `main`.

Si falta una, la tarea no está hecha.

## Nunca

- Subir `.env`, claves, contraseñas o datos reales de personas.
- Hacer `push --force` sobre `main`.
- Mergear tu propio PR sin revisión.
- Agregar `Co-Authored-By` o cualquier atribución a una IA en commits o PR.

Si se sube un secreto por error, avisar al equipo y **cambiarlo de inmediato**. Borrarlo del repositorio no alcanza: queda en el historial de Git.
