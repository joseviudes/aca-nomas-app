---
name: estilo-de-docs
description: Estilo y formato de la documentación de AcáNomás. Usar al escribir o editar archivos de docs/, el README, un registro de decisiones, descripciones de PR o cualquier texto en español del proyecto.
---

# Estilo de documentación

La documentación está en **español** y la tiene que poder entender alguien que nunca trabajó con el proyecto.

## Cómo escribir

- Frases cortas. Una idea por frase.
- Primero la conclusión, después la explicación.
- Si se usa un término técnico, explicarlo la primera vez ("puerto: una interfaz que define cómo se habla con algo externo").
- Tablas para comparar o para listas con varios atributos; listas para pasos; párrafos para explicar el porqué.
- Sin relleno ni frases de marketing.
- Nombres de archivos, comandos y código en formato `código`.

## Estructura de un documento

Todo documento de `docs/` empieza así:

```markdown
# Título del documento

Una o dos frases que dicen para qué sirve.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | DD/MM/AAAA | Nombre | Versión inicial |

## Índice
```

- Fechas en formato `DD/MM/AAAA`.
- Cada cambio relevante suma una fila al historial.
- Los elementos llevan un **identificador estable** (`D-07`, `RF-03`, `US-12`). Un código nunca se reutiliza ni se renumera.

## Registro de decisiones (`docs/decisiones.md`)

Cada decisión técnica o de proceso lleva:

```markdown
## D-21 Título corto
- **Decisión:** qué se resolvió.
- **Motivo:** por qué.
- **Descartado:** qué alternativas se evaluaron y por qué no.
- **Nota:** (opcional) aclaraciones.
```

- Se agrega al índice del principio con su estado: `Aceptada`, `Pendiente` o `Reemplazada por D-xx`.
- **Una decisión no se borra.** Si cambia, se marca como reemplazada y se escribe una nueva.
- Si falta información, la decisión va como `Pendiente` en lugar de inventar el dato.

## Descripciones de PR y commits

En español, claras y concretas: qué cambia y cómo probarlo. Ver `git-y-pr`.

## README

Para alguien que acaba de clonar el repo: qué es el proyecto, requisitos, cómo levantar Docker y la base, cómo correr migraciones, seed y pruebas, y dónde está `docs/`. Nunca incluir secretos: se remite a `.env.example`.
