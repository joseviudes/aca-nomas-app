# AcáNomás — Diseño de la API

Las reglas comunes a todos los endpoints y la lista de endpoints del MVP. El detalle de cada endpoint (campos exactos, ejemplos y errores propios) está en Swagger, en `http://localhost:3000/api/docs`, generado desde el código (D-34).

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 05/11/2026 | Tobias | Versión inicial: convenciones, lista de endpoints y errores comunes |
| 0.2 | 06/11/2026 | Tobias | Agrega CORS (D-28) y el `http-client` del frontend (D-30) a la autenticación |
| 0.3 | 06/11/2026 | Tobias | El detalle de cada endpoint pasa a Swagger, generado desde los esquemas Zod (D-34) |

## Índice

1. Cómo se usa este documento
2. Convenciones
3. Errores
4. Lista de endpoints
5. Detalle de los endpoints

---

## 1. Cómo se usa este documento

La API se diseña en dos niveles (D-25):

| Nivel | Qué tiene | Cuándo se escribe |
|---|---|---|
| **Reglas comunes** (secciones 2 y 3) | Forma de las respuestas, paginación, errores, nombres, fechas y códigos HTTP | Ya está. Vale para todos los módulos |
| **Detalle de cada endpoint** (Swagger, ver sección 5) | Campos de la petición y la respuesta, un ejemplo y los errores propios | Lo declara quien implementa la historia, en el mismo PR, en `routes/<módulo>.openapi.ts` (D-34) |

Así, cada integrante diseña los endpoints de su historia sin coordinar cada campo con el resto: si respeta las reglas comunes, todos los módulos quedan iguales. En la revisión del PR se verifica que las respete.

La lista de la sección 4 es una guía sacada de las historias. Si al implementar hace falta otro endpoint o cambiar una ruta, se actualiza la lista en el mismo PR.

---

## 2. Convenciones

### Rutas

- Prefijo `/api`, sin número de versión (D-11).
- Sustantivos en plural y en `kebab-case`: `/api/businesses`, `/api/businesses/:slug/opening-hours`.
- Un negocio se identifica siempre por su `slug`, en la API pública y en el panel. El slug nunca cambia (RN-05), así que sirve como identificador estable.

### Métodos y códigos HTTP

| Método | Uso | Respuesta correcta |
|---|---|---|
| `GET` | Leer | `200` con el recurso o la lista |
| `POST` | Crear | `201` con el recurso creado |
| `PATCH` | Modificar algunos campos | `200` con el recurso actualizado |
| `PUT` | Reemplazar un recurso completo o activar un estado | `200` con el recurso actualizado |
| `DELETE` | Borrar o desactivar un estado | `204`, sin cuerpo |

### Forma de las respuestas

- **Un recurso:** el objeto directo, sin envoltorio.
  ```json
  { "slug": "panaderia-la-espiga", "name": "Panadería La Espiga" }
  ```
- **Una lista:** siempre paginada, con este envoltorio (D-25):
  ```json
  { "data": [ ... ], "page": 1, "limit": 20, "total": 57 }
  ```
  - `page` empieza en 1. `limit` es 20 por defecto y 100 como máximo.
  - `total` es la cantidad de elementos que cumplen los filtros, no la cantidad de la página.
  - Una página fuera de rango devuelve `data: []`, no un error.
  - Los helpers están en `backend/src/shared/pagination/`.
- **Un error:** el formato de la sección 3.

### Campos

- Nombres en inglés y en `camelCase`: `isPaused`, `paymentMethods`.
- Un campo opcional sin valor se devuelve como `null`, no se omite. Así el frontend siempre recibe la misma forma.
- Nunca salen en una respuesta: `passwordHash`, tokens ni datos internos. En la API pública tampoco salen los canales que el dueño ocultó (RN-06).

### Fechas y horas

| Dato | Formato | Ejemplo |
|---|---|---|
| Momento exacto (`createdAt`) | ISO 8601 en UTC (D-11) | `"2026-11-05T14:30:00.000Z"` |
| Fecha local (`closedTodayDate`) | `AAAA-MM-DD` | `"2026-11-05"` |
| Hora de un turno (`opensAt`, `closesAt`) | `HH:mm`, hora local de la localidad | `"19:00"` |
| Día de la semana (`dayOfWeek`) | Número de 1 (lunes) a 7 (domingo) | `1` |

### Autenticación

- Sesión con un JWT en una cookie `httpOnly` (D-10). El frontend no lee el token: el navegador lo manda solo.
- El frontend tiene que hacer las peticiones con `credentials: 'include'` para que viaje la cookie. El `http-client` de cada app ya lo hace (D-30).
- La API solo acepta llamadas del navegador desde los orígenes de `CORS_ORIGINS` (D-28). En desarrollo, la web (`localhost:3001`) y el panel (`localhost:3002`).
- Los endpoints del panel usan el middleware `requireAuth`: sin sesión responden `401`; sobre un negocio ajeno, `403` (US-14).

---

## 3. Errores

Formato único (D-11):

```json
{ "error": { "code": "BUSINESS_NOT_FOUND", "message": "No existe el negocio", "details": [] } }
```

- `code`: en inglés y `UPPER_SNAKE_CASE`. Es estable: el frontend decide qué hacer según el código, nunca según el mensaje.
- `message`: en español, para mostrar o para depurar.
- `details`: la lista de campos con error. Solo la completa `VALIDATION_ERROR`; en el resto queda vacía.

### Errores comunes

Los usa cualquier endpoint. Ya existen en `backend/src/shared/errors/`, salvo los marcados como pendientes.

| HTTP | `code` | Cuándo |
|---|---|---|
| 400 | `VALIDATION_ERROR` | El cuerpo, los parámetros o la consulta no pasan el esquema Zod. `details` dice qué campo falló |
| 400 | `INVALID_JSON` | El cuerpo no es un JSON válido |
| 401 | `UNAUTHORIZED` | Falta la sesión o venció |
| 403 | `FORBIDDEN` | Hay sesión, pero el recurso es de otro dueño |
| 404 | `NOT_FOUND` | El recurso no existe. Cada módulo usa uno más específico, por ejemplo `BUSINESS_NOT_FOUND` |
| 404 | `ROUTE_NOT_FOUND` | La ruta no existe |
| 409 | `CONFLICT` | Choca con algo existente. Cada módulo usa uno más específico, por ejemplo `EMAIL_TAKEN` |
| 429 | `TOO_MANY_REQUESTS` | Demasiados intentos de login (D-10). **Pendiente:** se agrega con US-13 |
| 500 | `INTERNAL_ERROR` | Error inesperado. El detalle va al log, nunca a la respuesta |

Ejemplo de `VALIDATION_ERROR`:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos enviados no son válidos",
    "details": [{ "path": "body.description", "message": "Debe tener como máximo 80 caracteres" }]
  }
}
```

---

## 4. Lista de endpoints

Los marcados como **propuesta** no tienen la ruta escrita en la historia. Quien implemente la historia los confirma o los cambia, y actualiza esta tabla.

### Públicos (sin sesión)

| Método y ruta | Qué hace | Historias |
|---|---|---|
| `GET /api/health` | Comprueba que la API responde. **Ya existe** | — |
| `GET /api/businesses` | Listado paginado de negocios de la localidad. Filtros: `q` (texto), `category` (slug del rubro), `openNow`, `lat` y `lng` (distancia y orden). Incluye estado y coordenadas | US-01 a US-07 |
| `GET /api/businesses/:slug` | Ficha pública: datos, estado actual, hora de cierre o próxima apertura, horario semanal, canales visibles y foto | US-08 a US-11, US-16, US-17 |
| `GET /api/categories` | Lista de rubros para el filtro | US-03 |

### Cuenta del dueño

| Método y ruta | Qué hace | Historias |
|---|---|---|
| `POST /api/auth/register` | Crea la cuenta. `409 EMAIL_TAKEN` si el email ya existe | US-12 |
| `POST /api/auth/login` | Inicia sesión y deja la cookie. Error genérico si las credenciales no son válidas | US-13 |
| `POST /api/auth/logout` | Cierra la sesión y borra la cookie | US-13 |
| `GET /api/auth/me` | Datos de la sesión actual. **Propuesta:** el panel lo necesita para saber si hay sesión y proteger sus rutas | US-14 |

### Panel del dueño (con sesión)

Todos responden `401` sin sesión y `403` si el negocio es de otro dueño.

| Método y ruta | Qué hace | Historias |
|---|---|---|
| `GET /api/me/businesses` | Los negocios del dueño con todos sus datos, incluidos los canales ocultos, y el estado actual con su motivo. **Propuesta** | US-15, US-25 |
| `POST /api/businesses` | Crea la ficha. Genera el slug a partir del nombre | US-15 |
| `PATCH /api/businesses/:slug` | Edita la ficha: nombre, rubro, descripción, canales y su visibilidad, medios de pago, entregas y ubicación | US-15 a US-18 |
| `PUT /api/businesses/:slug/photo` | Sube o reemplaza la foto (`multipart/form-data`, JPG, PNG o WebP de hasta 5 MB). **Propuesta** | US-19 |
| `PUT /api/businesses/:slug/opening-hours` | Reemplaza el horario semanal completo. Valida hasta dos turnos por día y sin superposición | US-21, US-22 |
| `PUT /api/businesses/:slug/closed-today` | Marca "hoy no abro" con la fecha local de hoy. **Propuesta** | US-23 |
| `DELETE /api/businesses/:slug/closed-today` | Quita "hoy no abro". **Propuesta** | US-23 |
| `PUT /api/businesses/:slug/pause` | Pausa el negocio. **Propuesta** | US-24 |
| `DELETE /api/businesses/:slug/pause` | Reactiva el negocio. **Propuesta** | US-24 |

**Por qué "hoy no abro" y la pausa tienen su propia ruta:** son acciones de un botón, no campos de un formulario. `PUT` los activa y `DELETE` los desactiva, y repetir la misma petición deja el mismo resultado. "Hoy no abro" además necesita que el servidor calcule la fecha local de la localidad, y eso no lo manda el frontend.

**Qué no tiene endpoint:** "Copiar un horario al resto de los días" (US-22) se resuelve en el panel y se guarda con `PUT /opening-hours`. La vista previa de la ficha (US-20) también es solo del panel.

---

## 5. Detalle de los endpoints

Está en **Swagger** (D-34), generado desde los mismos esquemas Zod que validan cada ruta. Por eso no se desactualiza: si cambia el esquema, cambia la documentación.

| Qué | Dónde |
|---|---|
| Ver y probar los endpoints | `http://localhost:3000/api/docs` (con la API levantada) |
| La especificación OpenAPI en JSON | `http://localhost:3000/api/openapi.json` |
| Dónde se declara cada endpoint | `backend/src/modules/<módulo>/routes/<módulo>.openapi.ts`, registrado en `backend/src/openapi.ts` |

Cada endpoint declara:

- **Qué hace** (`summary`) y su grupo (`tags`, uno por módulo).
- **Petición:** parámetros, consulta y cuerpo, con los esquemas Zod de `schemas/`.
- **Respuesta correcta:** código HTTP y esquema. Un ejemplo con `.meta({ example })`.
- **Errores propios:** con `errorResponse('...')` de `shared/openapi/`, que usa el formato de la sección 3.

**Swagger o Postman:** Swagger sirve para ver y probar un endpoint mientras se programa. La colección de Postman en `docs/postman/` sirve para correr muchas pruebas juntas y guardar escenarios. Postman puede importar `/api/openapi.json` para crear las requests.
