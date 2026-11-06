# AcáNomás — Épicas, historias de usuario y tareas técnicas

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 30/10/2026 | Equipo AcáNomás | Borrador inicial para revisión |
| 0.2 | 04/11/2026 | Tobias | Agrega a EP-00 la tarea del registro central de rutas (D-23) |
| 0.3 | 04/11/2026 | Tobias | Sincroniza con Trello: suma criterios de aceptación, el esqueleto de carpetas y separa `docker-compose.yml` del `Dockerfile` |
| 0.4 | 05/11/2026 | Tobias | Sincroniza con Trello la tarea de diseño de la API (D-25) y la del `Dockerfile` (D-26) |
| 0.5 | 05/11/2026 | Josi | Saca el bloqueo de `[PANEL] Inicializar el panel`: el equipo ya tuvo la primera clase de React |
| 0.6 | 05/11/2026 | Josi | Saca el bloqueo de `[WEB] Inicializar la web pública`: Next.js queda decidido en D-27 |
| 0.7 | 06/11/2026 | Tobias | Agrega a EP-00 las tareas de la base del frontend (D-28 a D-32) y las pruebas con Vitest |
| 0.8 | 06/11/2026 | Tobias | Suma la regla de ESLint de las fronteras entre módulos (D-31). La localidad del seed pasa a ser Mantilla |
| 0.9 | 06/11/2026 | Tobias | Suma Swagger con OpenAPI generado desde Zod (D-34) |

## Cómo leer este documento

- **Épica (EP):** grupo de funcionalidades. Coincide con las épicas del ERS, más dos técnicas (EP-00 y EP-06).
- **Historia de usuario (US):** algo que un usuario quiere hacer. Lleva criterios de aceptación y el requisito del ERS que cubre (RF).
- **Historia técnica (HT):** trabajo necesario que no es una acción de un usuario.
- **Tarea:** unidad de trabajo para una persona, de uno a dos días como máximo.

**Etiquetas de área:** `BE` backend · `WEB` web pública · `PANEL` panel del dueño · `DB` base de datos · `INFRA` infraestructura · `QA` pruebas · `DOC` documentación

**Tamaño:** `S` hasta medio día · `M` un día · `L` dos días. Una tarea más grande se divide.

**Prioridad:** la del ERS. Indica el orden de construcción y qué se recorta último.

## Resumen

| Épica | Nombre | Historias | Requiere |
|---|---|---|---|
| EP-00 | Cimientos | — | Nada. Se hace primero |
| EP-01 | Exploración | US-01 a US-07 | EP-00, HT-01 |
| EP-02 | Ficha de negocio | US-08 a US-11 | EP-00, HT-01 |
| EP-03 | Cuentas de dueños | US-12 a US-14 | EP-00 |
| EP-04 | Gestión de la ficha | US-15 a US-20 | EP-03 |
| EP-05 | Horarios y estado | HT-01, US-21 a US-25 | EP-03 (HT-01 solo requiere EP-00) |
| EP-06 | Calidad y entrega | — | Avanza junto con las demás |

**Orden de construcción sugerido:** EP-00 → HT-01 → EP-01 y EP-02 (lectura pública) en paralelo con EP-03 → EP-04 y EP-05 (panel) → EP-06.

---

## EP-00 Cimientos

Sin historias de usuario. Todo lo demás depende de esto.

**Repositorio y proceso**
- [INFRA][M] Crear el repositorio público `aca-nomas-app` con `backend/` y `docs/`, `.gitignore`, `.env.example`, licencia y README inicial.
- [INFRA][S] Proteger `main`, activar el análisis de secretos de GitHub y agregar la plantilla de PR.
- [DOC][S] Escribir `CONTRIBUTING.md` (ramas, commits, flujo de PR, definición de hecho).
- [DOC][S] Copiar el ERS y `decisiones.md` a `docs/`.

**Backend base**
- [BE][M] Inicializar Node, TypeScript y Express 5 con ESM: `tsconfig`, scripts, `app.ts` y `server.ts`.
- [BE][S] Crear el esqueleto de carpetas de `backend/src` y `backend/tests` según la skill `estructura-del-proyecto`.
- [BE][S] Configurar ESLint y Prettier, con reglas de importación entre capas (los servicios no importan Prisma ni Express).
- [BE][S] Configurar Vitest con una prueba de ejemplo.
- [BE][M] Validar las variables de entorno con Zod (`config/env.ts`).
- [BE][M] Middlewares base: manejo de errores (`AppError` y subclases), logger, `validate(schema)` y 404.
- [BE][S] Helpers del formato estándar de errores y de paginación.
- [BE][S] Crear `container.ts` y el cliente único de Prisma en `infrastructure/database`.
- [BE][S] Registro central de rutas en `routes.ts`, montado bajo `/api` desde `app.ts` (D-23).

**Base de datos**
- [DB][L] Diseñar el modelo de datos: localidad, dueño, negocio, rubro, horarios, canales de contacto, foto y ubicación. Decidir qué va en tablas y qué en `JSONB`. Revisión del equipo.
- [DB][S] Dibujar el diagrama entidad-relación en Mermaid y guardarlo en `docs/diagramas/`.
- [INFRA][S] `docker-compose.yml` con PostgreSQL local, en el puerto 5433 para no chocar con un PostgreSQL instalado en la máquina. Va antes del schema porque la migración necesita la base levantada.
- [DB][M] Escribir `schema.prisma` y la primera migración.
- [DB][M] Seed con datos ficticios: una localidad (Mantilla, Corrientes), rubros, dueños y entre 8 y 12 negocios con horarios variados, incluido uno con turno que cruza la medianoche y uno pausado.

**Infraestructura**
- [INFRA][S] `Dockerfile` de desarrollo de la API y perfil `api` en `docker-compose.yml`: levantar solo la base o la base y la API, sin instalar Node (D-26). La imagen de producción se define con el hosting.
- [INFRA][M] GitHub Actions: lint y pruebas en cada PR.
- [INFRA][S] Validar el formato de commits y del título del PR en CI (opcional).
- [DOC][S] README con los pasos para levantar el proyecto (`docker compose up`, migrar, seed, correr).

**API y frontends**
- [DOC][M] Diseñar la API en `docs/api.md` (D-25): reglas comunes (respuestas, paginación, errores, fechas, códigos HTTP) y lista de endpoints del MVP. El detalle de cada endpoint se escribe al implementar su historia.
- [DOC][M] Crear la colección base de Postman con ese diseño (permite que el frontend avance con datos simulados).
- [WEB][M] Inicializar la web pública con Next.js, TypeScript y Zod en `web/` (D-27).
- [PANEL][M] Inicializar el panel con Vite, React y TypeScript en `panel/` (D-20).

**Base del frontend**
- [BE][S] CORS en la API con la lista de orígenes en `CORS_ORIGINS` y `credentials: true`, para que la web y el panel puedan llamarla con la cookie (D-28).
- [INFRA][S] Sumar la web y el panel a GitHub Actions: lint, formato, tipos, pruebas y build en cada PR.
- [PANEL][S] React Router con todas las rutas en `src/app/router.tsx`, y TypeScript en modo `strict` (D-32).
- [WEB][S] [PANEL] `http-client` con `fetch`, `ApiError` y la URL de la API validada con Zod en `config/env.ts`, con su `.env.example` (D-30).
- [WEB][S] Igualar con el panel las versiones de TypeScript, ESLint y los tipos de Node. El chequeo de tipos genera antes los tipos de Next (`next typegen`).
- [DOC][S] Skill `estructura-del-frontend` (módulos y capas, D-31), URLs en español (D-29) y registro de D-28 a D-32.
- [WEB][S] [PANEL] Regla de ESLint que impide importar las carpetas internas de otro módulo: solo por su `index.ts` (D-31).
- [BE][S] Swagger en `/api/docs` y OpenAPI en `/api/openapi.json`, generados desde los esquemas Zod con `zod-openapi` (D-34). Postman queda para las pruebas en conjunto.
- [QA][S] Vitest en la web y el panel, con pruebas del `http-client`, `ApiError` y `config/env.ts`, y `npm test` en GitHub Actions.
- [INFRA][S] `Dockerfile` de desarrollo de la web y el panel, y perfiles `web`, `panel` y `full` en `docker-compose.yml`: levantar todo el proyecto sin instalar Node (D-33).

---

## EP-01 Exploración

### US-01 Ver el listado de negocios
**Como** visitante **quiero** ver los negocios de mi localidad **para** saber qué hay cerca.
- **RF-01** · Prioridad Alta
- **Criterios:** devuelve `page`, `limit` y `total`; 20 por página por defecto; funciona sin sesión.
- **Tareas:**
  - [BE][M] Módulo `businesses`: ruta, controlador, servicio y repositorio con listado paginado.
  - [BE][S] Esquema Zod de los parámetros de consulta.
  - [BE][S] Pruebas del servicio con un repositorio falso.
  - [WEB][M] Pantalla de listado con tarjetas.
  - [DOC][S] Agregar el endpoint a Postman.

### US-02 Buscar por texto
**Como** visitante **quiero** escribir lo que busco **para** encontrarlo sin recorrer toda la lista.
- **RF-02** · Prioridad Alta
- **Criterios:** busca en nombre y descripción; ignora mayúsculas y tildes.
- **Tareas:**
  - [BE][S] Decidir y aplicar la estrategia para ignorar tildes (extensión de PostgreSQL o normalización).
  - [BE][S] Filtro de texto en el repositorio y pruebas.
  - [WEB][S] Campo de búsqueda con espera breve al escribir.

### US-03 Filtrar por rubro
**Como** visitante **quiero** elegir un rubro **para** ver solo ese tipo de negocios.
- **RF-03** · Prioridad Alta
- **Criterios:** solo se listan negocios del rubro elegido; "Todo" quita el filtro; los rubros salen de una lista fija cargada con el seed.
- **Tareas:**
  - [BE][S] Endpoint `GET /api/categories`.
  - [BE][S] Filtro `category` en el listado.
  - [WEB][S] Selector desplegable de rubros.

### US-04 Filtrar por "abierto ahora"
**Como** visitante **quiero** ver solo lo que está abierto **para** no ir a un lugar cerrado.
- **RF-04** · Prioridad Alta · **Requiere HT-01**
- **Criterios:** solo aparecen negocios con estado abierto; el total y la paginación respetan el filtro; un negocio pausado o con "hoy no abro" nunca aparece como abierto.
- **Tareas:**
  - [BE][S] Decidir cómo combinar el filtro `openNow` con la paginación (calcular el estado de los negocios de la localidad y paginar el resultado).
  - [BE][M] Implementar el filtro usando `isOpenNow`.
  - [WEB][S] Interruptor "Abierto ahora".

### US-05 Ver primero lo que está abierto y cerca
**Como** visitante **quiero** que los resultados vengan ordenados **para** ver primero lo más útil.
- **RF-05** · Prioridad Alta
- **Criterios:** abiertos primero y, dentro de cada grupo, por cercanía; sin ubicación del visitante, los abiertos siguen primero y el desempate es por nombre.
- **Tareas:**
  - [BE][M] Estrategias de ordenamiento (`OpenFirstThenDistance` y `ByName`) detrás de una interfaz.
  - [BE][S] Pruebas de los dos órdenes.

### US-06 Ver la distancia a cada negocio
**Como** visitante **quiero** ver a qué distancia está cada negocio **para** elegir el más cercano.
- **RF-06** · Prioridad Media
- **Criterios:** pide permiso de ubicación; si lo niega, la lista funciona igual sin distancias; menos de 1 km en metros, si no en km con un decimal.
- **Tareas:**
  - [BE][M] Aceptar `lat` y `lng` y calcular la distancia con Haversine.
  - [BE][S] Función de formato de distancia con pruebas.
  - [WEB][M] Pedir geolocalización y manejar el caso denegado.

### US-07 Ver los negocios en un mapa
**Como** visitante **quiero** verlos en un mapa **para** ubicarlos respecto de donde estoy.
- **RF-07** · Prioridad Media
- **Criterios:** pin por negocio con estado abierto o cerrado; al tocarlo se abre la ficha; la lista y el mapa se mantienen sincronizados.
- **Tareas:**
  - [WEB][L] Mapa con Leaflet y OpenStreetMap con pines de dos estados.
  - [WEB][M] Sincronizar la lista con el mapa.
  - [BE][S] Incluir las coordenadas en la respuesta del listado.

---

## EP-02 Ficha de negocio

### US-08 Abrir la ficha de un negocio con su propio enlace
**Como** visitante **quiero** abrir la página de un negocio **para** ver todos sus datos y compartirla.
- **RF-08, RF-12** · Prioridad Alta
- **Criterios:** `/businesses/:slug` devuelve la ficha o 404; el enlace funciona sin sesión en una pestaña nueva; hay un botón para copiar el enlace.
- **Tareas:**
  - [BE][M] Endpoint `GET /api/businesses/:slug` con error 404 estándar.
  - [BE][S] Generación de slug único a partir del nombre, con pruebas.
  - [WEB][M] Página de ficha con ruta propia.
  - [WEB][S] Botón para copiar el enlace.

### US-09 Ver si está abierto y sus horarios
**Como** visitante **quiero** ver el estado actual y el horario **para** saber cuándo puedo ir.
- **RF-09** · Prioridad Alta · **Requiere HT-01**
- **Criterios:** muestra estado, horario de hoy y semana completa; indica a qué hora cierra o cuándo vuelve a abrir; coincide con RN-01.
- **Tareas:**
  - [BE][S] Incluir estado, hora de cierre o próxima apertura y horario semanal en la respuesta.
  - [WEB][M] Mostrar el estado, "Hoy" y la semana desplegable.

### US-10 Contactar al negocio
**Como** visitante **quiero** escribirle por WhatsApp o ver su Instagram **para** hacer mi consulta o pedido.
- **RF-10** · Prioridad Alta
- **Criterios:** solo aparecen los canales que el dueño activó; "Cómo llegar" abre el mapa con las coordenadas.
- **Tareas:**
  - [BE][S] Función pura que arma los enlaces (`wa.me`, Instagram, mapas) respetando la visibilidad, con pruebas.
  - [WEB][M] Botones de contacto.

### US-11 Ver la foto del negocio
**Como** visitante **quiero** ver una foto **para** reconocer el lugar.
- **RF-11** · Prioridad Media
- **Criterios:** la foto se ve en la ficha y en la tarjeta del listado; si no hay foto, se muestra un marcador por defecto.
- **Tareas:**
  - [WEB][S] Mostrar la foto o el marcador por defecto en ficha y tarjeta.

---

## EP-03 Cuentas de dueños

### US-12 Registrarme como dueño
**Como** dueño **quiero** crear mi cuenta **para** administrar mi negocio.
- **RF-13** · Prioridad Alta
- **Criterios:** email único; contraseña de al menos 8 caracteres; se guarda con hash; errores claros.
- **Tareas:**
  - [BE][M] Módulo `auth`: registro con bcrypt.
  - [BE][S] Validación Zod y manejo de email repetido (409).
  - [BE][S] Pruebas del servicio.
  - [PANEL][M] Formulario de registro.

### US-13 Iniciar y cerrar sesión
**Como** dueño **quiero** entrar y salir de mi cuenta **para** acceder a mi panel de forma segura.
- **RF-14** · Prioridad Alta
- **Criterios:** credenciales inválidas devuelven un error genérico (no revela si el email existe); hay límite de intentos; la sesión usa cookie `httpOnly`; cerrar sesión invalida la sesión en el navegador.
- **Tareas:**
  - [BE][M] Login con JWT corto en cookie `httpOnly` y `SameSite`, y logout.
  - [BE][S] Límite de intentos en el login.
  - [BE][S] Configurar `helmet` y CORS restringido.
  - [PANEL][M] Pantallas de login y cierre de sesión.

### US-14 Acceder solo a lo mío
**Como** dueño **quiero** que nadie más pueda modificar mi negocio **para** proteger mi información.
- **RF-15** · Prioridad Alta
- **Criterios:** sin sesión, 401; sobre un negocio ajeno, 403.
- **Tareas:**
  - [BE][M] Middleware `requireAuth` y verificación de propiedad.
  - [BE][S] Pruebas de los casos 401 y 403.
  - [PANEL][S] Rutas protegidas y redirección al login.

---

## EP-04 Gestión de la ficha

### US-15 Crear y editar mi ficha
**Como** dueño **quiero** cargar el nombre, rubro y descripción de mi negocio **para** que me encuentren.
- **RF-16** · Prioridad Alta
- **Criterios:** nombre obligatorio; descripción de hasta 80 caracteres; el cambio se ve en la web pública.
- **Tareas:**
  - [BE][M] Endpoints para crear y editar la ficha del dueño autenticado.
  - [BE][S] Esquemas Zod con las validaciones.
  - [BE][S] Pruebas del servicio.
  - [PANEL][L] Formulario de ficha.

### US-16 Elegir qué datos de contacto son públicos
**Como** dueño **quiero** decidir qué canales se muestran **para** controlar cómo me contactan.
- **RF-17** · Prioridad Alta
- **Criterios:** WhatsApp e Instagram son opcionales y cada uno tiene un interruptor de visibilidad; un canal oculto no aparece en la API pública.
- **Tareas:**
  - [BE][S] Aplicar la visibilidad en la respuesta pública, con pruebas.
  - [PANEL][M] Campos de contacto con interruptores.

### US-17 Indicar medios de pago y entregas
**Como** dueño **quiero** decir cómo se paga y si hago entregas **para** que el cliente lo sepa antes de ir.
- **RF-18** · Prioridad Media
- **Criterios:** el dueño elige los medios de pago y si hace entregas; se muestran como etiquetas en la ficha pública.
- **Tareas:**
  - [BE][S] Guardar y devolver medios de pago y entrega.
  - [PANEL][S] Selección de pagos y entregas.
  - [WEB][S] Mostrarlos como etiquetas en la ficha.

### US-18 Ubicar mi negocio en el mapa
**Como** dueño **quiero** marcar dónde estoy **para** que los vecinos me encuentren y puedan llegar.
- **RF-19** · Prioridad Media
- **Criterios:** guarda latitud y longitud; el pin aparece en el mapa público.
- **Tareas:**
  - [PANEL][L] Selector de ubicación con Leaflet (reutiliza el componente del mapa público).
  - [BE][S] Validar y guardar coordenadas.

### US-19 Subir una foto de mi local
**Como** dueño **quiero** subir una foto **para** que me reconozcan.
- **RF-20** · Prioridad Media
- **Criterios:** JPG, PNG o WebP de hasta 5 MB; otros formatos o tamaños se rechazan con un error claro; en desarrollo se guarda en disco local y en staging en Supabase Storage.
- **Tareas:**
  - [BE][S] Puerto `StorageService`.
  - [BE][M] Adaptador de almacenamiento local (desarrollo y pruebas).
  - [BE][M] Endpoint de subida con validación de tipo y tamaño.
  - [BE][M] Adaptador de Supabase Storage.
  - [PANEL][M] Componente de subida con vista previa.

### US-20 Ver cómo queda mi ficha
**Como** dueño **quiero** una vista previa **para** revisar antes de guardar.
- **RF-21** · Prioridad Media
- **Criterios:** la vista previa muestra la tarjeta y la ficha como las verá el visitante, y refleja los cambios aún sin guardar.
- **Tareas:**
  - [PANEL][M] Vista previa en vivo reutilizando los componentes de tarjeta y ficha.

---

## EP-05 Horarios y estado

### HT-01 Cálculo de "abierto ahora" (primera tarea de dominio)
Función pura que decide el estado de un negocio. La usan el listado, la ficha y el panel.
- **Reglas:** RN-01 a RN-04 y RN-10 · Prioridad Alta
- **Criterios:** precedencia pausa → "hoy no abro" (fecha local de hoy) → horario semanal; inicio inclusivo y fin exclusivo; un turno con fin menor o igual al inicio cruza la medianoche; un día sin turnos es cerrado; usa la zona horaria de la localidad; devuelve la hora de cierre o la próxima apertura.
- **Tareas:**
  - [BE][S] Definir los tipos de dominio: `OpeningHours`, `Shift` y `BusinessStatus`.
  - [BE][S] Instalar y configurar la librería de fechas (Luxon o date-fns-tz).
  - [BE][L] Implementar `isOpenNow(hours, now, timezone)` con precedencia pausa → hoy no abro → horario semanal.
  - [BE][L] Pruebas con Vitest: turnos partidos, cruce de medianoche, día sin turnos, inicio inclusive y fin exclusivo, hoy no abro, pausa, cambio de día.
  - [BE][S] Calcular hora de cierre y próxima apertura.

### US-21 Cargar mi horario semanal
**Como** dueño **quiero** indicar mis horarios **para** que el sistema sepa cuándo estoy abierto.
- **RF-22** · Prioridad Alta
- **Criterios:** hasta dos turnos por día; los turnos de un mismo día no se superponen; un día sin turnos es cerrado.
- **Tareas:**
  - [BE][M] Endpoint para guardar el horario semanal con validación de superposición.
  - [BE][S] Pruebas de la validación.
  - [PANEL][L] Editor de horarios con interruptor por día y dos turnos.

### US-22 Copiar un horario al resto de los días
**Como** dueño **quiero** repetir un horario **para** no cargarlo día por día.
- **RF-23** · Prioridad Media
- **Criterios:** reemplaza los demás días solo después de confirmar; no modifica el día de origen.
- **Tareas:**
  - [PANEL][S] Acción "copiar a todos" con confirmación.

### US-23 Avisar que hoy no abro
**Como** dueño **quiero** marcar que hoy no atiendo **para** que no vayan por nada.
- **RF-24** · Prioridad Alta
- **Criterios:** solo afecta a la fecha local de hoy; al día siguiente se aplica el horario normal.
- **Tareas:**
  - [BE][M] Guardar la fecha local de `closedToday` y comparar con la fecha actual de la localidad.
  - [BE][S] Pruebas del cambio de día.
  - [PANEL][S] Botón "Hoy no abro".

### US-24 Pausar mi negocio por vacaciones
**Como** dueño **quiero** pausar mi negocio **para** no figurar abierto mientras no estoy.
- **RF-25** · Prioridad Alta
- **Criterios:** un negocio pausado nunca aparece como abierto; se reactiva con un botón.
- **Tareas:**
  - [BE][S] Endpoint para pausar y reactivar.
  - [PANEL][S] Botón de pausa.

### US-25 Ver mi estado actual en el panel
**Como** dueño **quiero** ver cómo me ven ahora **para** confirmar que está todo bien.
- **RF-26** · Prioridad Media · **Requiere HT-01**
- **Criterios:** indica abierto, cerrado, no abre hoy o pausado, con el motivo.
- **Tareas:**
  - [BE][S] Endpoint de estado actual con motivo.
  - [PANEL][M] Tarjeta de estado en la pantalla de inicio.

---

## EP-06 Calidad y entrega

Se avanza junto con las demás épicas; no se deja para el final.

**Pruebas**
- [QA][M] Completar la colección de Postman con pruebas automáticas.
- [QA][M] Pruebas de integración de la API con Supertest contra una base de pruebas (listado, ficha, login, edición).
- [QA][L] Playwright: flujo del visitante (buscar → abrir ficha → botón de WhatsApp).
- [QA][L] Playwright: flujo del dueño (login → cargar horarios → ver el cambio en la ficha).

**Despliegue**
- [INFRA][M] Crear el proyecto de Supabase de staging y aplicar las migraciones (URL con pooler y URL directa).
- [INFRA][S] Activar RLS en todas las tablas antes del primer despliegue.
- [INFRA][M] Desplegar la API y los frontends (hosting a definir).
- [DOC][S] Decidir el hosting.

**Cierre**
- [DOC][M] README final con capturas y guía de uso.
- [DOC][S] Actualizar el ERS a la versión 1.0 y revisar `decisiones.md`.
- [DOC][M] Preparar la presentación y la demostración.

---

## Totales

| Épica | Historias | Tareas aprox. |
|---|---|---|
| EP-00 Cimientos | — | 36 |
| EP-01 Exploración | 7 | 19 |
| EP-02 Ficha de negocio | 4 | 10 |
| EP-03 Cuentas de dueños | 3 | 11 |
| EP-04 Gestión de la ficha | 6 | 16 |
| EP-05 Horarios y estado | 1 técnica + 5 | 18 |
| EP-06 Calidad y entrega | — | 11 |
| **Total** | **26** | **~121** |
