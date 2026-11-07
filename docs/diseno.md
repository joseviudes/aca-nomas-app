# AcáNomás — Diseño visual

La referencia visual de la web y el panel: dónde está el mockup, qué hay que respetar siempre, qué puede cambiar quien arma la pantalla y qué partes del mockup no entran en el MVP. La decisión técnica (Tailwind y los tokens) es D-38.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 06/11/2026 | Tobias | Versión inicial: mockup, tokens y reglas de uso (D-38) |
| 0.2 | 06/11/2026 | Tobias | Agrega qué hacer con una pantalla que no está en el mockup |
| 0.3 | 07/11/2026 | Tobias | Mockup nuevo: cambian los colores, las fuentes y las formas. Agrega lo que el mockup muestra pero no entra en el MVP |
| 0.4 | 07/11/2026 | Tobias | El mockup se ajusta al MVP y suma las pantallas de celular y el listado sin ubicación. Agrega "Celular primero" |

## Índice

1. El mockup
2. Qué entra del mockup y qué no
3. Qué se respeta y qué puede cambiar
4. Colores
5. Tipografía
6. Formas y medidas
7. Estados de un negocio
8. Accesibilidad
9. Celular primero

---

## 1. El mockup

Está en Claude, como un lienzo de diseño: [AcáNomás — Mockup](https://claude.ai/artifact/XbXNuhzCf3bs7SycUqCXim). Reemplaza al mockup anterior ("Emprendimientos Local").

| Pantalla | Escritorio | Celular | Historias |
|---|---|---|---|
| Inicio y listado | Inicio y listado | Listado en celular | US-01 a US-06, US-11 |
| Listado sin ubicación | Listado sin ubicación | — (lo arma quien hace US-06) | US-05 y US-06 |
| Panel de filtros | Panel de filtros (ya tiene ancho de celular) | — | US-03 y US-04 |
| Nada abierto ahora | Nada abierto ahora | — | US-04: el estado vacío del filtro |
| Ficha del negocio | Ficha del negocio | Ficha en celular | US-08 a US-11, US-17 |
| Ingreso | Panel del dueño — Ingreso | Ingreso en celular | US-12 y US-13 |
| Inicio del panel | Panel del dueño — Inicio | Panel — Inicio en celular | US-23 a US-25 |
| Mi ficha | Panel del dueño — Mi ficha | Panel — Mi ficha en celular | US-15 a US-20 |
| Horarios | Panel del dueño — Horarios | Panel — Horarios en celular | US-21 a US-24 |

El mockup ya está ajustado al MVP: la localidad es **Mantilla** (D-20), los rubros son los del seed y se sacaron las partes de la sección 2 que no entran. Los nombres de los negocios son de ejemplo; los datos reales salen de la API y del seed.

## 2. Qué entra del mockup y qué no

**Se construye todo lo que muestra el mockup, pero solo dentro del MVP.** El MVP son los requisitos del ERS (RF-01 a RF-26) y las historias de `epicas-e-historias.md`. Lo que no tiene requisito no se construye, aunque esté dibujado.

**Pantallas que no entran** (fase 2, ERS sección 9):

| Pantalla | Por qué |
|---|---|
| Explorar — Oficios | Changas y oficios están fuera del MVP |
| Explorar — Eventos | Ferias y eventos están fuera del MVP |
| Admin — Negocios y Admin — Rubros | El panel de administración y la administración de rubros están fuera del MVP. Los rubros se cargan con el seed |

Por eso el encabezado de la web **no lleva** los enlaces a Oficios ni a Eventos.

**Partes de pantallas del MVP que no entran** (ya se sacaron del mockup; quedan anotadas para no volver a sumarlas sin una historia):

| Qué | Dónde aparece | Por qué |
|---|---|---|
| "Horario confirmado hace X días" y el botón "Sí, confirmo mi horario" | Inicio y Horarios del panel, ficha | Ningún requisito lo pide; necesitaría un campo y un endpoint nuevos |
| "¿Es tu negocio? Reclamá la ficha" | Pie de la ficha | Supone fichas sin dueño, que el modelo no contempla |
| Filtros de entregas y medios de pago | Panel de filtros | RF-18 solo muestra pagos y entregas como etiquetas en la ficha |
| Elegir el orden ("Por nombre A–Z") | Panel de filtros | RF-05 fija un solo orden: abiertos primero y por cercanía; el nombre es solo el desempate |
| "Estos abren en la próxima hora" | Nada abierto ahora | Necesitaría una consulta nueva. El estado vacío sí entra, con el botón "Ver todos, aunque estén cerrados" |
| "Mi cuenta" | Menú del panel | No hay historia para editar la cuenta |
| "Compartir por WhatsApp" | Ficha | RF-12 pide un enlace compartible; alcanza con el botón de copiarlo (US-08) |
| El mapa dentro de la ficha | Ficha | El mapa está en el listado (RF-07); en la ficha está el botón "Cómo llegar" (RF-10) |

**Sí entra**, aunque no tenga una historia propia: el carrusel "Abiertos ahora cerca tuyo" del inicio. No agrega funcionalidad: muestra los primeros resultados del listado (RF-01, RF-04 y RF-05) con su foto.

**Si el visitante no comparte su ubicación** (US-06, RF-05 y RF-06), ve igual todos los negocios de Mantilla, sin distancias y con los abiertos primero y después por nombre. El carrusel dice "Abiertos ahora" (no "cerca tuyo") y un aviso ofrece "Usar mi ubicación", que vuelve a pedir el permiso. No se elige otra localidad (hay una sola en el MVP) ni se usa una ubicación inventada, porque mostraría distancias falsas. Está en la pantalla "Listado sin ubicación". El pedido de permiso no se diseña: es el cartel propio del navegador.

**Lo que el MVP pide y el mockup no muestra** lo plantea quien arma la pantalla (sección 3): el mapa del listado (US-07), el formulario de registro (US-12; el mockup solo tiene la pestaña "Crear cuenta") y la página 404 de una ficha que no existe (US-08).

Si algo de la lista de "no entra" se quiere sumar, primero se agrega como requisito al ERS y como historia, con el acuerdo del equipo. No se construye directo desde el mockup.

## 3. Qué se respeta y qué puede cambiar

El mockup es una **referencia, no un plano**.

**Se respeta siempre** (son los tokens de `src/shared/ui/theme.css`):
- los colores, las tipografías y las formas de las secciones 4 a 7;
- el tono: fondo claro, verde oscuro como color principal, verde lima para lo que está abierto y las acciones, esquinas redondeadas y sin sombras.

**Puede cambiar** quien arma la pantalla, si lo ve mejor de otra manera:
- la distribución, el orden de los bloques, los textos y los tamaños;
- un componente que en el mockup no queda claro o no funciona bien en el celular.

El cambio se explica en el PR, con una captura.

**Si la pantalla no está en el mockup**, la plantea quien la arma: con los tokens y los componentes de `shared/ui`, siguiendo el tono de las pantallas que sí están. En el PR va una captura en escritorio y otra a 390 px, para que el equipo la vea antes de aprobarla.

En los dos casos, si hace falta un color o un tamaño que no está en los tokens, **no se inventa en la pantalla**: se agrega al token en las dos apps y a este documento, en el mismo PR.

## 4. Colores

| Token | Color | Uso |
|---|---|---|
| `ink` | `#0E150E` | Texto principal |
| `paper` | `#F4F3E7` | Fondo de la página y texto sobre `brand` |
| `surface` | `#FFFFFF` | Tarjetas, tablas y campos |
| `brand` | `#00473C` | Color principal: logo, encabezado destacado, botones principales del panel, pie |
| `accent` | `#E6FF55` | Etiqueta "Abierto", botón principal de la web y resaltados sobre `brand` |
| `mint` | `#D8E5D6` | Fondos secundarios: foto que falta, encabezados de tabla, bloques de formulario |
| `sand` | `#E8DCC6` | Bandas de sección y el selector de pestañas |
| `alert` | `#F2B8A0` | "Hoy no abre", "Pausado" y mensajes de error |
| `muted` | `#555555` | Texto secundario y textos de ayuda |
| `muted-strong` | `#3D4A3D` | Texto secundario sobre fondos de color |
| `line` | `#8C8C82` | Bordes de campos y líneas separadoras |

## 5. Tipografía

| Token | Fuente | Uso |
|---|---|---|
| `font-display` | Urbanist (400 y 500) | Títulos grandes y nombres de rubros |
| `font-body` | Figtree (400 y 700) | Todo el texto, botones y etiquetas |

- Las etiquetas cortas (secciones, botones del encabezado, estados) van en mayúsculas, a 11–13 px, en negrita y con `letter-spacing: 0.05em`.
- El texto común va a 14–16 px.
- Las fuentes se sirven desde la propia app, no desde Google: `next/font` en la web y `@fontsource` en el panel (D-38).

## 6. Formas y medidas

- **Botones y etiquetas:** de forma de píldora (`rounded-full`).
- **Tarjetas y bloques:** esquinas de 20 a 28 px. **Campos e ítems del menú:** 8 a 12 px.
- **Sin sombras.** Los bloques se separan por color de fondo, no por sombra.
- **Bordes:** 1 px `line` en los campos; 2 px `brand` en los botones secundarios.
- **Ancho máximo del contenido:** 1120 px.
- **Botones y enlaces:** al menos 44 px de alto.

## 7. Estados de un negocio

El estado lo devuelve la API (`isOpenNow`); el frontend solo lo muestra.

| Estado | Etiqueta |
|---|---|
| Abierto | Fondo `accent`, texto `ink` |
| Cerrado | Fondo `paper`, borde de 1 px `ink` |
| Hoy no abre | Fondo `alert`, borde punteado de 1 px `ink` |
| Pausado | Fondo `alert`, borde punteado de 1 px `ink` |

Siempre con el texto del estado, nunca solo el color.

## 8. Accesibilidad

Todas las combinaciones del mockup cumplen el contraste mínimo (4,5 a 1 para texto):

| Combinación | Contraste |
|---|---|
| `ink` sobre `paper` | 16,6 |
| `paper` sobre `brand` | 9,6 |
| `ink` sobre `accent` | 16,6 |
| `accent` sobre `brand` | 9,6 |
| `muted` sobre `paper` | 6,7 |
| `ink` sobre `alert` | 10,7 |
| `brand` sobre `mint` | 8,2 |

- `line` sobre `paper` da 3,0: sirve para **bordes** (el mínimo para elementos que no son texto es 3 a 1), **no para texto**.
- El estado "abierto" o "cerrado" no se indica solo con color: siempre lleva el texto.
- Los campos llevan su `<label>`, aunque esté oculto a la vista.

## 9. Celular primero

La mayoría de los vecinos y los dueños van a usar AcáNomás desde el celular. Por eso cada pantalla **se arma primero para 390 px** y después se agranda para escritorio, con las clases de Tailwind por tamaño (`md:`, `lg:`).

- **Panel:** en el celular, el menú lateral del escritorio pasa a una **barra de pestañas abajo** (Inicio, Mi ficha, Horarios). "Cerrar sesión" va en la barra de arriba.
- **Botón principal a mano:** en Mi ficha y Horarios, "Guardar" queda fijo abajo, sobre la barra de pestañas. En la ficha pública, "Escribir por WhatsApp" va arriba, justo después del estado.
- **Nada de desplazarse de costado:** las tablas se convierten en tarjetas (por ejemplo, un día del horario por tarjeta) y las listas largas de botones pasan a una grilla.
- **Campos cómodos:** al menos 48 px de alto y texto de 16 px, para que el celular no haga zoom al escribir. Cada campo usa su tipo (`email`, `tel`, `time`) para que aparezca el teclado correcto.
- **Revisión:** el PR de una pantalla lleva una captura a 390 px y otra en escritorio (sección 3).
