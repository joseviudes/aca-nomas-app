# Referencia del mockup

Capturas y descripción de cada pantalla del mockup, para armar una pantalla cuando el mockup no se puede abrir.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 17/11/2026 | Tobias | Versión inicial: capturas de las 19 pantallas y su descripción |
| 0.2 | 17/11/2026 | Tobias | Renombra las capturas del listado y de los filtros en celular para seguir la convención (`inicio-y-listado-movil`, `filtros-movil`) |

## Índice

1. Qué es esta carpeta
2. Cómo actualizar las capturas
3. Pantallas

---

## 1. Qué es esta carpeta

El mockup vive en Claude, como un lienzo de diseño (el enlace está en la sección 1 de [`docs/diseno.md`](../diseno.md)). **El lienzo es la fuente de verdad.** Esta carpeta es el respaldo para cuando no se puede abrir: sin cuenta, sin conexión o con el enlace caído.

- Es una **foto del 17/11/2026**. Si el lienzo cambió después, esta carpeta puede estar desactualizada: ante una diferencia, vale el lienzo.
- Las reglas (qué se respeta, qué puede cambiar y qué no entra en el MVP) siguen en `docs/diseno.md`. Acá solo está lo que muestra cada pantalla.
- Si una pantalla no está ni en el lienzo ni acá, no se adivina su distribución: se pregunta al equipo.

| Archivo | Qué tiene |
|---|---|
| [`web.md`](web.md) | Pantallas de la web pública, con el detalle del listado (US-01) |
| [`panel.md`](panel.md) | Pantallas del panel del dueño |
| [`admin.md`](admin.md) | Pantallas de administración (fuera del MVP) |
| `capturas/` | Las imágenes |

## 2. Cómo actualizar las capturas

1. Abrir el lienzo y elegir la pantalla.
2. Exportar la vista completa con **Fit** (toda la pantalla en una imagen). Esa es la captura principal.
3. Con **Fill** (100 %), exportar las partes que hagan falta para leer el texto, de arriba hacia abajo.
4. Guardarlas en `capturas/` en JPG, con estos nombres:

| Nombre | Qué es | Ejemplo |
|---|---|---|
| `<pantalla>.jpg` | Captura principal de escritorio | `ficha.jpg` |
| `<pantalla>-movil.jpg` | Captura principal de celular | `ficha-movil.jpg` |
| `<pantalla>[-movil]-N.jpg` | Parte legible número N, de arriba hacia abajo | `ficha-movil-2.jpg` |

5. Actualizar la tabla de la sección 3, el archivo de la app (`web.md`, `panel.md` o `admin.md`) y la fecha de la sección 1. Sumar una fila al historial.

En las capturas de celular, la pantalla de 390 px queda a la izquierda y el resto de la imagen en blanco: es el lienzo, no parte del diseño.

## 3. Pantallas

"MVP" indica si la pantalla se construye. Las que dicen "Sí" se construyen sin las partes que lista la sección 2 de `docs/diseno.md`.

| Pantalla (nombre en el lienzo) | App | Dispositivo | Historias | MVP | Capturas |
|---|---|---|---|---|---|
| Inicio y listado | web | Escritorio | US-01 a US-06, US-11 | Sí | [principal](capturas/inicio-y-listado.jpg), [1](capturas/inicio-y-listado-1.jpg), [2](capturas/inicio-y-listado-2.jpg), [3](capturas/inicio-y-listado-3.jpg), [4](capturas/inicio-y-listado-4.jpg) |
| Listado en celular | web | Celular | US-01 a US-06, US-11 | Sí | [principal](capturas/inicio-y-listado-movil.jpg), [1](capturas/inicio-y-listado-movil-1.jpg), [2](capturas/inicio-y-listado-movil-2.jpg), [3](capturas/inicio-y-listado-movil-3.jpg) |
| Listado sin ubicación | web | Escritorio | US-05 y US-06 | Sí | [principal](capturas/sin-ubicacion.jpg), [1](capturas/sin-ubicacion-1.jpg), [2](capturas/sin-ubicacion-2.jpg), [3](capturas/sin-ubicacion-3.jpg), [4](capturas/sin-ubicacion-4.jpg), [5](capturas/sin-ubicacion-5.jpg) |
| Nada abierto ahora | web | Escritorio | US-04 | Sí | [principal](capturas/vacio.jpg), [1](capturas/vacio-1.jpg), [2](capturas/vacio-2.jpg) |
| Panel de filtros | web | Celular | US-03 y US-04 | Sí | [principal](capturas/filtros-movil.jpg), [1](capturas/filtros-movil-1.jpg), [2](capturas/filtros-movil-2.jpg) |
| Ficha del negocio | web | Escritorio | US-08 a US-11, US-17 | Sí | [principal](capturas/ficha.jpg), [1](capturas/ficha-1.jpg), [2](capturas/ficha-2.jpg), [3](capturas/ficha-3.jpg) |
| Ficha en celular | web | Celular | US-08 a US-11, US-17 | Sí | [principal](capturas/ficha-movil.jpg), [1](capturas/ficha-movil-1.jpg), [2](capturas/ficha-movil-2.jpg), [3](capturas/ficha-movil-3.jpg), [4](capturas/ficha-movil-4.jpg) |
| Explorar — Oficios (fase 2) | web | Escritorio | — | No | [principal](capturas/oficios.jpg), [1](capturas/oficios-1.jpg), [2](capturas/oficios-2.jpg), [3](capturas/oficios-3.jpg) |
| Explorar — Eventos (fase 2) | web | Escritorio | — | No | [principal](capturas/eventos.jpg), [1](capturas/eventos-1.jpg), [2](capturas/eventos-2.jpg), [3](capturas/eventos-3.jpg) |
| Panel del dueño — Ingreso | panel | Escritorio | US-12 y US-13 | Sí | [principal](capturas/login.jpg), [1](capturas/login-1.jpg), [2](capturas/login-2.jpg) |
| Ingreso en celular | panel | Celular | US-12 y US-13 | Sí | [principal](capturas/login-movil.jpg), [1](capturas/login-movil-1.jpg), [2](capturas/login-movil-2.jpg) |
| Panel del dueño — Inicio | panel | Escritorio | US-23 a US-25 | Sí | [principal](capturas/panel.jpg), [1](capturas/panel-1.jpg), [2](capturas/panel-2.jpg), [3](capturas/panel-3.jpg) |
| Panel — Inicio en celular | panel | Celular | US-23 a US-25 | Sí | [principal](capturas/panel-movil.jpg), [1](capturas/panel-movil-1.jpg), [2](capturas/panel-movil-2.jpg), [3](capturas/panel-movil-3.jpg) |
| Panel del dueño — Mi ficha | panel | Escritorio | US-15 a US-20 | Sí | [principal](capturas/panel-ficha.jpg), [1](capturas/panel-ficha-1.jpg), [2](capturas/panel-ficha-2.jpg), [3](capturas/panel-ficha-3.jpg), [4](capturas/panel-ficha-4.jpg), [5](capturas/panel-ficha-5.jpg) |
| Panel — Mi ficha en celular | panel | Celular | US-15 a US-20 | Sí | [principal](capturas/panel-ficha-movil.jpg), [1](capturas/panel-ficha-movil-1.jpg), [2](capturas/panel-ficha-movil-2.jpg), [3](capturas/panel-ficha-movil-3.jpg), [4](capturas/panel-ficha-movil-4.jpg), [5](capturas/panel-ficha-movil-5.jpg) |
| Panel del dueño — Horarios | panel | Escritorio | US-21 a US-24 | Sí | [principal](capturas/panel-horarios.jpg), [1](capturas/panel-horarios-1.jpg), [2](capturas/panel-horarios-2.jpg), [3](capturas/panel-horarios-3.jpg) |
| Panel — Horarios en celular | panel | Celular | US-21 a US-24 | Sí | [principal](capturas/panel-horarios-movil.jpg), [1](capturas/panel-horarios-movil-1.jpg), [2](capturas/panel-horarios-movil-2.jpg), [3](capturas/panel-horarios-movil-3.jpg), [4](capturas/panel-horarios-movil-4.jpg) |
| Admin — Negocios | admin | Escritorio | — | No | [principal](capturas/admin.jpg), [1](capturas/admin-1.jpg), [2](capturas/admin-2.jpg), [3](capturas/admin-3.jpg) |
| Admin — Rubros | admin | Escritorio | — | No | [principal](capturas/admin-rubros.jpg), [1](capturas/admin-rubros-1.jpg), [2](capturas/admin-rubros-2.jpg) |

Las pantallas sin historia son de fase 2 (ERS, sección 9): changas y oficios, ferias y eventos, y el panel de administración. Están en el lienzo como referencia futura y no se construyen.
