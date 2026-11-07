---
name: historias-en-trello
description: Cómo se trabaja el tablero de Trello de AcáNomás (épicas, historias de usuario, tareas técnicas y sprints). Usar al escribir una historia, tomar o mover una tarjeta, armar un checklist o planificar un sprint.
---

# Trabajo en Trello

## Cómo está organizado

| Concepto | En Trello | Qué es |
|---|---|---|
| **Épica** | Color + código en el título (🟩 EP-01) | Un área de la app, como la ve el usuario. Sirve para planificar y para la demo |
| **Área del código** | Línea "Área del código" en la descripción | Las carpetas que toca la historia: `businesses`, `auth`, `opening-hours`, `web`, `panel`. Dice quién la toma |
| **Historia de usuario** | Una tarjeta | Una funcionalidad, con descripción y criterios de aceptación |
| **Tarea técnica** | Un ítem del checklist "Tareas técnicas" | Un trabajo de 1 a 2 días dentro de la historia |
| **Sprint** | Las columnas | Una semana de trabajo |

El avance de una historia se ve como `3/5` en el checklist. Los PR se revisan entre compañeros.

La épica y el área del código no coinciden: una épica puede tocar varias carpetas (EP-01, EP-02 y EP-04 usan `businesses`). Por eso el trabajo se reparte por **área**: cada persona es dueña de un área y toma las historias que la tocan. Quien termina lo suyo toma lo que haga falta de otra área, avisando al dueño.

## Columnas y sprint

`Backlog → Sprint actual → En curso → En revisión → Hecho`

- **Planning (lunes):** el equipo elige qué historias pasan de Backlog a "Sprint actual". Solo las que se pueden terminar en la semana.
- **Durante la semana:** quien toma una historia se la asigna y la pasa a "En curso". Máximo **2 historias en curso por persona**.
- **PR abierto:** la tarjeta pasa a "En revisión".
- **Hecho:** todas las tareas tildadas, criterios cumplidos, con prueba, PR revisado y mergeado.
- **Review (viernes):** se muestra lo terminado. **Retro:** qué salió bien y qué se cambia.
- Lo que no se terminó se decide en el siguiente planning. No se arrastra en silencio.

Si algo te bloquea, avisalo en un comentario de la tarjeta.

## Cómo se escribe una historia

Título: `🟩 US-02 Buscar por texto`. Código único, nunca se reutiliza.

```markdown
**Como** visitante **quiero** escribir lo que busco **para** encontrarlo sin recorrer toda la lista.

**Épica:** EP-01 Exploración · **Depende de:** US-01
**Área del código:** `businesses` (backend) · `web`

**Criterios de aceptación**
- Busca en el nombre y en la descripción.
- Ignora mayúsculas y tildes ("cafe" encuentra "Café").
- Se combina con los demás filtros.
```

Un buen criterio de aceptación:
- Se puede comprobar con sí o no.
- Habla de lo que ve o hace el usuario, no de cómo se programa.
- Incluye los casos de error y los bordes, no solo el camino feliz.

Si una historia no entra en un sprint, es demasiado grande: hay que partirla.

## Cómo se escribe una tarea técnica

Un ítem del checklist "Tareas técnicas" de la historia, con el formato `[ÁREA] Título: descripción corta.`

| Área | Es |
|---|---|
| `[BE]` | backend |
| `[DB]` | base de datos |
| `[WEB]` | web pública |
| `[PANEL]` | panel del dueño |
| `[INFRA]` | infraestructura |
| `[QA]` | pruebas |
| `[DOC]` | documentación |

Ejemplo: `[BE] Login que valida las credenciales y emite un JWT en cookie httpOnly.`

La tarea debe dejar claro **qué se entrega**. Si tarda más de 2 días, partirla en dos ítems.

## Orden de trabajo

Primero el backend y la base de datos, que se prueban con Swagger y con pruebas de integración. Las pantallas (`[WEB]` y `[PANEL]`) se suman cuando el backend de esa historia está listo.

## Reglas

- Las tareas viven **solo en el checklist**. No repetirlas en la descripción de la historia.
- El estado de las tareas se ve **solo en Trello** (D-36). `docs/epicas-e-historias.md` es el plan: cuando la tarjeta ya existe, una tarea nueva o cambiada se edita en Trello y no se copia al documento. El documento se toca solo si cambian la historia o sus criterios.
- Si cambia un criterio de aceptación, avisar al equipo y editar la tarjeta; no cambiarlo en silencio.
- Historias opcionales (US-07 y US-20): se recortan primero si el plazo se complica.
