# AcáNomás — Diseño visual

La referencia visual de la web y el panel: dónde está el mockup, qué hay que respetar siempre y qué puede cambiar quien arma la pantalla. La decisión técnica (Tailwind y los tokens) es D-38.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 06/11/2026 | Tobias | Versión inicial: mockup, tokens y reglas de uso (D-38) |

## Índice

1. El mockup
2. Qué se respeta y qué puede cambiar
3. Colores
4. Tipografía
5. Bordes, sombras y formas
6. Accesibilidad

---

## 1. El mockup

Está en Claude, como un lienzo de diseño: [Emprendimientos Local](https://claude.ai/artifact/6gESHph9FjVXA9qPt9N5r6). Se abre con el enlace, sin cuenta especial.

| Pantalla | Para qué sirve |
|---|---|
| Barrio web — escritorio | Web pública: buscador, filtros, listado y ficha |
| Barrio web — celular | La misma página a 390 px de ancho |
| Panel del emprendedor — escritorio | Panel del dueño: mi ficha, horarios y compartir |
| Panel del emprendedor — celular | El panel a 390 px de ancho |

El mockup tiene datos de ejemplo (por ejemplo, la localidad Goya). Los datos reales salen de la API y del seed (Mantilla, D-20).

## 2. Qué se respeta y qué puede cambiar

El mockup es una **referencia, no un plano**.

**Se respeta siempre** (son los tokens de `src/shared/ui/theme.css`):
- los colores, las tipografías, los bordes y las sombras de las secciones 3 a 5;
- el tono: fondo crema, bordes oscuros gruesos y sombras duras, sin degradados.

**Puede cambiar** quien arma la pantalla, si lo ve mejor de otra manera:
- la distribución, el orden de los bloques, los textos y los tamaños;
- un componente que en el mockup no queda claro o no funciona bien en el celular.

El cambio se explica en el PR, con una captura. Si hace falta un color o un tamaño que no está en los tokens, **no se inventa en la pantalla**: se agrega al token en las dos apps y a este documento, en el mismo PR.

## 3. Colores

| Token | Color | Uso |
|---|---|---|
| `ink` | `#2B2118` | Texto principal, bordes y sombras |
| `paper` | `#FFF9EC` | Tarjetas, campos y texto sobre fondos de color |
| `cream` | `#F1E6CF` | Fondo de la página |
| `sand` | `#E8D9BA` | Fondos secundarios y separadores |
| `muted` | `#6B5B49` | Texto secundario y enlaces menores |
| `open` | `#2F7A4F` | "Abierto ahora" y la acción principal (WhatsApp, guardar) |
| `brand` | `#C8372D` | Acento de la marca y "Cerrado" |
| `highlight` | `#E9A93A` | Resaltados y botones secundarios |
| `pin` | `#2B6FB4` | La ubicación del visitante en el mapa |

## 4. Tipografía

| Token | Fuente | Uso |
|---|---|---|
| `font-display` | Alfa Slab One | Títulos y el logo |
| `font-body` | Libre Franklin (400 a 800) | Todo el texto |
| `font-hand` | Kalam | Detalles a mano, con moderación |

Las fuentes se sirven desde la propia app, no desde Google: `next/font` en la web y `@fontsource` en el panel (D-38).

## 5. Bordes, sombras y formas

- **Bordes:** `ink`, de 2 a 3 px. Las tarjetas y los botones siempre llevan borde.
- **Sombras duras**, sin desenfoque: `shadow-hard-sm` (`3px 3px 0`), `shadow-hard` (`4px 4px 0`) y `shadow-hard-lg` (`5px 5px 0`), en `ink`.
- **Esquinas:** casi rectas (4 a 6 px). Redondas solo las etiquetas de estado y los avatares.
- **Ancho máximo del contenido:** alrededor de 1000 px en la web y 1060 px en el panel.

## 6. Accesibilidad

- El texto `brand` sobre `cream` **no llega al contraste mínimo** (4,2 a 1, y hace falta 4,5). Para texto chico, usar `brand` como fondo con texto `paper`; como texto, solo en títulos de 24 px o más.
- El resto de las combinaciones del mockup pasan: `ink` sobre `cream` 12,7; `muted` sobre `cream` 5,3; `paper` sobre `open` 5,0; `paper` sobre `brand` 5,0; `ink` sobre `highlight` 7,7.
- Los botones y enlaces miden al menos 44 px de alto, como en el mockup.
- El estado "abierto" o "cerrado" no se indica solo con color: siempre lleva el texto.
