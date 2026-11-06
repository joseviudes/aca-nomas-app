# AcáNomás — Registro de decisiones

Cada decisión técnica o de proceso queda registrada con su motivo y las alternativas que se descartaron. Si una decisión cambia, **no se borra**: se marca como reemplazada y se agrega una nueva.

## Historial de versiones

| Versión | Fecha | Autor | Cambios |
|---|---|---|---|
| 0.1 | 30/10/2026 | Equipo AcáNomás | Registro inicial |
| 0.2 | 03/11/2026 | Tobias | Agrega D-21. Corrige el nombre del repositorio en D-16 (`aca-nomas-app`) |
| 0.3 | 03/11/2026 | José | Agrega D-22 (modelo de datos) y divide la fila del modelo y la API en D-20 |
| 0.4 | 03/11/2026 | Tobias | Agrega la rama `develop` a las decisiones diferidas (D-20) |
| 0.5 | 04/11/2026 | Tobias | Agrega la respuesta paginada y la librería de logs a las decisiones diferidas (D-20) |
| 0.6 | 04/11/2026 | Tobias | Agrega D-23: registro central de rutas en `routes.ts` |
| 0.7 | 04/11/2026 | Tobias | Actualiza D-22 con la revisión del modelo. En D-07, "pausa" pasa a `isPaused` |
| 0.8 | 05/11/2026 | Tobias | D-22 pasa a `Aceptada`. Agrega D-24: PostgreSQL local en el puerto 5433 |
| 0.9 | 05/11/2026 | Tobias | Agrega D-25: diseño de la API en dos niveles y respuesta paginada. Cierra esos dos temas en D-20 |
| 0.10 | 05/11/2026 | Tobias | Agrega D-26: API en Docker para desarrollo, con perfiles de Docker Compose |
| 0.11 | 05/11/2026 | Josi | Agrega D-27: frontend con Next.js para la web pública. Cierra ese tema en D-20 |
| 0.12 | 06/11/2026 | Tobias | Agrega D-28 a D-32: CORS, URLs en español, `fetch` con `http-client`, estructura del frontend y React Router. Suma a D-20 la cookie en producción y TanStack Query |
| 0.13 | 06/11/2026 | Tobias | Agrega D-33: la web y el panel en Docker para desarrollo, y `API_INTERNAL_URL` |
| 0.14 | 06/11/2026 | Tobias | Resuelve la localidad inicial en D-20: Mantilla, Corrientes |
| 0.15 | 06/11/2026 | Tobias | Agrega D-34: documentación de la API con OpenAPI y Swagger. Actualiza D-25: el detalle por endpoint pasa a Swagger |
| 0.16 | 06/11/2026 | Tobias | Agrega D-35 a D-37: Postman para escenarios, el estado de las tareas solo en Trello y las herramientas que no se suman por ahora. Actualiza D-15, D-30 y D-34 |

## Índice

| ID | Decisión | Estado |
|---|---|---|
| D-01 | Tipo de producto: directorio de negocios locales | Aceptada |
| D-02 | Backend con Node.js, Express 5 y TypeScript, sin NestJS | Aceptada |
| D-03 | Base de datos relacional PostgreSQL, con JSONB para datos flexibles | Aceptada |
| D-04 | Docker local en desarrollo y pruebas; Supabase solo como base en staging y producción | Aceptada |
| D-05 | Prisma como ORM | Aceptada |
| D-06 | Arquitectura en capas por módulos, con puertos y adaptadores en los bordes | Aceptada |
| D-07 | Estructura de carpetas y convenciones de nombres | Aceptada |
| D-08 | Idioma: código en inglés; interfaz y documentación en español | Aceptada |
| D-09 | Validación con Zod y middlewares | Aceptada |
| D-10 | Autenticación propia con bcrypt y JWT en cookie | Aceptada |
| D-11 | Convenciones de la API | Aceptada |
| D-12 | Zona horaria por localidad y `isOpenNow` como función pura | Aceptada |
| D-13 | Mapas con Leaflet y OpenStreetMap | Aceptada |
| D-14 | Fotos mediante un puerto de almacenamiento | Aceptada |
| D-15 | Herramientas de calidad y pruebas | Aceptada |
| D-16 | Reglas de Git y repositorio público | Aceptada |
| D-17 | Organización del trabajo | Aceptada |
| D-18 | Un único MVP | Aceptada |
| D-19 | Patrones de diseño | Aceptada |
| D-20 | Decisiones diferidas | Pendiente |
| D-21 | Sin atribución a IA en commits y PR | Aceptada |
| D-22 | Modelo de datos | Aceptada |
| D-23 | Registro central de rutas en `routes.ts` | Aceptada |
| D-24 | PostgreSQL local en el puerto 5433 | Aceptada |
| D-25 | Diseño de la API en dos niveles y respuesta paginada | Aceptada (el detalle por endpoint pasa a D-34) |
| D-26 | API en Docker para desarrollo, con perfiles de Docker Compose | Aceptada |
| D-27 | Frontend con Next.js para la web pública | Aceptada |
| D-28 | CORS con lista de orígenes permitidos | Aceptada |
| D-29 | URLs del frontend en español | Aceptada |
| D-30 | `fetch` con un `http-client` propio en los dos frontends | Aceptada |
| D-31 | Estructura del frontend por módulos y capas | Aceptada |
| D-32 | React Router en el panel | Aceptada |
| D-33 | Web y panel en Docker para desarrollo | Aceptada |
| D-34 | Documentación de la API con OpenAPI y Swagger, generada desde Zod | Aceptada |
| D-35 | Postman para escenarios, no como catálogo de endpoints | Aceptada |
| D-36 | El estado de las tareas vive solo en Trello | Aceptada |
| D-37 | Herramientas que no se suman por ahora | Aceptada |

---

## D-01 Tipo de producto: directorio de negocios locales
- **Decisión:** AcáNomás es un directorio web de negocios locales (plataforma de descubrimiento), no un CRM ni un e-commerce.
- **Motivo:** el objetivo es que los vecinos encuentren negocios y sepan si están abiertos. No hay carrito, pagos ni gestión de clientes.
- **Descartado:** CRM (gestiona clientes propios) y e-commerce (la compra ocurre dentro del sistema).

## D-02 Backend con Node.js, Express 5 y TypeScript, sin NestJS
- **Decisión:** API REST con Express 5 y TypeScript.
- **Motivo:** aplicar lo visto en el curso y entender lo que los frameworks esconden. Express 5 maneja los errores de funciones `async` sin `try/catch` en cada ruta.
- **Descartado:** NestJS (esconde conceptos que se quieren aprender).
- **Nota:** el curso usa ESM (`"type": "module"`); definir el `tsconfig` una sola vez al inicio.

## D-03 Base de datos relacional PostgreSQL, con JSONB para datos flexibles
- **Decisión:** modelo principalmente relacional. `JSONB` solo donde el dato es flexible o anidado.
- **Motivo:** las relaciones (dueño, negocio, localidad, rubro) encajan mejor en SQL. `JSONB` aporta flexibilidad de documentos donde hace falta.
- **Descartado:** MongoDB (se evaluó por el curso; se prefirió el modelo relacional).
- **Nota:** BSON es de MongoDB; el equivalente en PostgreSQL es `JSONB`.

## D-04 Docker local en desarrollo y pruebas; Supabase solo como base en staging y producción
- **Decisión:** cada integrante usa su propio PostgreSQL local con Docker. Supabase se usa únicamente como base de datos cuando exista un despliegue.
- **Motivo:** evitar que se pisen los datos y las migraciones, y no depender de internet. Se aplican los conceptos del curso (autenticación propia).
- **Descartado:** base compartida de Supabase para desarrollo; Supabase Auth.
- **Tareas asociadas:**
  - Mismo major de PostgreSQL que Supabase.
  - Dos URLs de conexión en Supabase (pooler para la app, directa para migraciones).
  - Activar RLS en todas las tablas antes del primer despliegue.
  - Seed con datos de prueba y `migrate reset` para volver al estado inicial.

## D-05 Prisma como ORM
- **Decisión:** Prisma, con migraciones versionadas en el repositorio y un script de seed.
- **Motivo:** es el más usado, tiene tipos generados y buena experiencia de desarrollo.
- **Descartado:** Drizzle (válido, más cercano a SQL) y TypeORM (menos recomendado hoy).
- **Nota:** PostGIS no tiene soporte nativo en Prisma. Para el MVP la distancia se calcula en la aplicación (Haversine).

## D-06 Arquitectura en capas por módulos, con puertos y adaptadores en los bordes
- **Decisión:** monolito modular con capas `controllers → services → repositories`. Lo externo (base, fotos, mails) se conecta por **puertos** (interfaces) con **adaptadores** (clases que las implementan).
- **Motivo:** es la arquitectura vista en clase, con la inversión de dependencias que permite probar sin infraestructura real y cambiar de tecnología sin tocar la lógica.
- **Reglas:**
  1. Las capas fluyen hacia abajo y no se saltean.
  2. Los módulos se hablan por servicios, nunca por repositorios ni tablas ajenas.
  3. Todo lo externo está detrás de un puerto.
  4. El dominio es puro: no importa Express ni Prisma.
- **Descartado:** Clean pura (más código repetido: mappers y un caso de uso por acción), hexagonal pura, MVC con servicio sin separar datos.
- **Cómo describirla:** arquitectura en capas organizada por módulos, con inversión de dependencias en la infraestructura.

## D-07 Estructura de carpetas y convenciones de nombres
- **Decisión:**
  - Módulos en `modules/`, con una subcarpeta por capa: `routes/`, `controllers/`, `services/`, `repositories/`, `schemas/`, `domain/`.
  - Contratos en `shared/ports/`; implementaciones en `infrastructure/` (una subcarpeta por capacidad: `database/`, `storage/`, `mailer/`).
  - `app.ts` arma Express, `server.ts` abre el puerto, `container.ts` conecta las dependencias.
- **Convenciones:** archivos en `kebab-case` con sufijo de rol (`business.service.ts`); clases en `PascalCase`; variables en `camelCase`; constantes en `UPPER_SNAKE_CASE`; tablas en `snake_case` y plural; interfaces sin prefijo `I`; las implementaciones se nombran por la tecnología (`PrismaBusinessRepository`).
- **Nota:** los repositorios viven dentro de cada módulo, y en `infrastructure/database/` queda solo el cliente de Prisma. Es una decisión práctica, distinta de clean pura.

## D-08 Idioma
- **Decisión:** código, base de datos y rutas de la API en inglés. Interfaz, documentación, descripciones de commits y de PR en español.
- **Motivo:** el inglés es el estándar de la industria y evita mezclar idiomas en los nombres.

| Español | Inglés |
|---|---|
| negocio | `business` |
| ficha | `listing` |
| rubro | `category` |
| localidad | `locality` |
| dueño | `owner` |
| horario | `openingHours` |
| abierto ahora | `isOpenNow` |
| hoy no abro | `closedToday` |
| pausa | `isPaused` |

## D-09 Validación con Zod y middlewares
- **Decisión:** los esquemas de Zod cumplen el rol de DTO. Un middleware `validate(schema)` valida cuerpo, parámetros y consulta. Los tipos se obtienen con `z.infer`. Las variables de entorno también se validan con Zod al arrancar.
- **Aclaración:** DAO y DTO son cosas distintas. El DAO/repositorio accede a datos; el DTO describe la forma de los datos que viajan.

## D-10 Autenticación propia con bcrypt y JWT en cookie
- **Decisión:** registro y login con email y contraseña (bcrypt). Sesión con JWT de vida corta en cookie `httpOnly` y `SameSite`. Roles `owner` y `admin`. Límite de intentos en el login.
- **Motivo:** aplicar lo visto en la clase de hashing y JWT.
- **Futuro:** enlace mágico por email y cuentas de vecinos (fuera del MVP).

## D-11 Convenciones de la API
- **Decisión:**
  - Prefijo `/api` sin número de versión (`/api/businesses`). Se agrega versión solo si aparece un cliente externo.
  - Rutas con sustantivos en plural.
  - Errores: `{ "error": { "code": "BUSINESS_NOT_FOUND", "message": "...", "details": [] } }`.
  - Paginación con `?page=1&limit=20`, y la respuesta incluye el total.
  - Fechas en ISO 8601 UTC.
- **Motivo:** el frontend y la API se despliegan juntos, por lo que el versionado no aporta valor hoy.

## D-12 Zona horaria por localidad y `isOpenNow` como función pura
- **Decisión:** cada localidad guarda su zona horaria IANA (`America/Argentina/Buenos_Aires`). `isOpenNow(hours, now, timezone)` recibe la hora actual como parámetro. Se usa una librería de fechas (Luxon o date-fns-tz).
- **Motivo:** se puede probar con cualquier fecha y evita los errores típicos de horarios.
- **Casos a probar:** turnos partidos, cierre pasada la medianoche, días sin turnos, "hoy no abro", pausa.

## D-13 Mapas con Leaflet y OpenStreetMap
- **Decisión:** el dueño marca la ubicación con un clic en el mapa (sin convertir direcciones en coordenadas). La ubicación del visitante se pide con la geolocalización del navegador.
- **Motivo:** gratis y sin clave de API.
- **Descartado:** Google Maps (requiere cuenta de facturación).
- **Nota:** revisar la política de uso de los mosaicos antes de desplegar.

## D-14 Fotos mediante un puerto de almacenamiento
- **Decisión:** puerto `StorageService`. Adaptador local en desarrollo y Supabase Storage al desplegar. Formatos JPG, PNG y WebP de hasta 5 MB.
- **Motivo:** caso real de puertos y adaptadores, y desarrollo sin depender de internet.

## D-15 Herramientas de calidad y pruebas

| Herramienta | Uso | Cuándo |
|---|---|---|
| Vitest | Pruebas unitarias (`isOpenNow`, servicios) | Desde el inicio |
| Postman | Escenarios de varios pasos con sesión; colección exportada en `docs/postman/` (D-35) | Desde el inicio |
| Supertest | Pruebas de endpoints contra una base de pruebas | Cuando existan los endpoints principales |
| Playwright | Flujos completos en el navegador | Cuando exista el frontend |
| ESLint y Prettier | Estilo de código | Desde el inicio |
| GitHub Actions | Lint y pruebas en cada PR | Desde el inicio |

- **Reglas de arquitectura:** se verifican también con reglas de importación en ESLint (por ejemplo, los servicios no importan Prisma).

## D-16 Reglas de Git y repositorio público
- **Decisión:**
  - Repositorio público con datos ficticios y sin secretos (`.env` ignorado, `.env.example` de muestra, análisis de secretos de GitHub activo).
  - `main` protegida: PR obligatorio y aprobación final del responsable del repositorio.
  - Ramas: `feat/`, `fix/`, `docs/`, `chore/` + descripción corta en inglés (`feat/business-search`).
  - Commits convencionales: tipo en inglés y descripción en español (`feat(businesses): agrega búsqueda por texto`).
  - Plantilla de PR con lista de verificación y revisión cruzada entre compañeros.
- **Nombres:** `aca-nomas-app` en carpetas y repositorio; "AcáNomás" en la interfaz.

## D-17 Organización del trabajo
- **Decisión:** tablero Kanban en Trello con tareas técnicas chicas (de uno a dos días). Cada integrante toma tareas y se las asigna. Máximo dos tarjetas en curso por persona.
- **Columnas:** Épicas · Backlog · Sprint actual · En curso · En revisión · Hecho.
- **Etiquetas:** una por épica, una por área (backend, panel, web).
- **Primera semana:** la base (esqueleto, `tsconfig`, Docker, esquema, seed, CI) la arman dos personas; el resto prepara historias y la colección de Postman.
- **Ritmo:** sprints semanales hasta la entrega de mediados de diciembre.
- **Definición de hecho:** funciona, tiene prueba, pasó revisión de PR y está mergeado.

## D-18 Un único MVP
- **Decisión:** el MVP incluye todos los requisitos del ERS, también mapa, foto y geolocalización. La prioridad indica el orden de construcción y qué se recorta último si el plazo se complica.
- **Plazo:** mediados de diciembre de 2026.

## D-19 Patrones de diseño

| Patrón | Dónde | Fase |
|---|---|---|
| Repository | `repositories/` | MVP |
| Inyección de dependencias por constructor, conectada en `container.ts` | Servicios y repositorios | MVP |
| Adapter | `infrastructure/` | MVP |
| Middleware (cadena de responsabilidad) | Autenticación, validación, errores, logs | MVP |
| DTO con Zod | `schemas/` | MVP |
| Strategy | Ordenamiento de resultados | MVP |
| Jerarquía de errores | `AppError` y subclases | MVP |
| Singleton | Cliente único de Prisma | MVP |
| Decorator | Repositorio con caché | Fase 2 |
| Observer | Registro de visitas y métricas | Fase 2 |
| Specification / Query Object | Filtros combinables | Fase 2 |

- **Criterio:** un patrón se aplica cuando resuelve un problema real.

## D-20 Decisiones diferidas

| Tema | Valor por defecto | Estado |
|---|---|---|
| Localidad inicial | Mantilla, Corrientes. El seed la usa con centro en la plaza | Resuelta |
| Aprobación de fichas nuevas | Se publican de inmediato | A confirmar |
| Un dueño con varios negocios | El modelo lo permite; la interfaz del MVP muestra uno | A confirmar |
| Rubros | Lista fija chica por seed; administración en otra fase | A definir |
| Frontend de la web pública | Next.js o renderizado en el servidor para vistas previas al compartir; panel como SPA con Vite | Resuelta en D-27 |
| Hosting del primer despliegue | Sin definir | Pendiente |
| Modelo de datos | Definido en D-22 | Resuelta |
| Diseño de la API | Definido en D-25 (`docs/api.md`) | Resuelta |
| Rama `develop` | Sin `develop`: las ramas salen de `main` y en EP-00 los PR agrupan varias tareas por bloque | Se evalúa con el primer despliegue |
| Respuesta paginada | `{ data, page, limit, total }`, con `limit` máximo de 100 | Resuelta en D-25 |
| Librería de logs | Logger propio mínimo con `console` (una línea por request) | Se evalúa antes del primer despliegue |
| Cookie de sesión en producción | Un dominio propio con subdominios (`api.`, `panel.`), para que la cookie no sea de terceros (D-28) | Se confirma con el hosting |
| Estado de servidor en el panel | Hooks propios sobre el `http-client` (D-30). Se evalúa TanStack Query | Con las primeras pantallas con datos |

## D-21 Sin atribución a IA en commits y PR
- **Decisión:** los commits y los PR no llevan `Co-Authored-By` ni mencionan a Claude u otra herramienta de IA.
- **Motivo:** el autor del commit es quien sube el cambio y responde por él. Algunas herramientas agregan la atribución por defecto, así que la regla tiene que estar escrita.
- **Descartado:** dejar que cada integrante decida, porque el historial queda inconsistente.
- **Nota:** la regla está en `CONTRIBUTING.md` y en la skill `git-y-pr`.

## D-22 Modelo de datos
- **Decisión:**
  - Seis tablas: `localities`, `categories`, `users`, `businesses`, `opening_hours` y `contact_channels`. El diagrama está en `docs/diagramas/modelo-de-datos.md`.
  - Identificadores UUID v7: empiezan con la fecha, así los registros quedan ordenados y el índice rinde mejor.
  - Una sola tabla `users` con la columna `role` (`owner` o `admin`). El visitante no tiene cuenta, por lo que no es un usuario.
  - El rubro del negocio es obligatorio.
  - Una sola foto por negocio. La imagen vive en el almacenamiento (D-14); la base guarda solo su clave en `photo_key`, y el adaptador arma la URL según el entorno.
  - Los horarios van en una tabla (`opening_hours`), con un turno por fila. Los canales de contacto van en otra (`contact_channels`), cada uno con su visibilidad.
  - Los roles y los tipos de canal son enums de PostgreSQL (`user_role` y `channel_type`).
  - `JSONB` para los medios de pago (`payment_methods`): una lista de etiquetas validada con Zod en el borde, y un `CHECK` que asegura que sea una lista. El resto del modelo es relacional.
  - Restricciones en la base: `day_of_week` entre 1 y 7, latitud y longitud juntas o ninguna, `RESTRICT` al borrar un usuario, rubro o localidad en uso, y `CASCADE` en turnos y canales.
  - Índices en las claves foráneas que usan el listado y el panel. Los rubros tienen `slug` para el filtro. Todas las tablas tienen `created_at` y `updated_at`.
  - "Hoy no abro" se guarda como la fecha local (`closed_today_date`), así vence solo al cambiar el día. La pausa se guarda en `is_paused`.
  - El estado "abierto ahora" no se guarda: se calcula con `isOpenNow`.
- **Motivo:** las relaciones entre dueño, negocio, localidad y rubro encajan en SQL (D-03). Los horarios en filas permiten leer todos los turnos juntos para `isOpenNow` y validar que no se superpongan. Guardar la fecha de "hoy no abro" evita un proceso que lo reinicie cada día. Los medios de pago son una lista de etiquetas sin relaciones que solo se muestra, el caso de dato flexible de D-03; Zod valida los valores antes de guardar. Los enums hacen que la base rechace roles y tipos de canal inválidos. Guardar la clave de la foto evita que las fotos se rompan al cambiar de entorno o de almacenamiento. Un rol en una sola tabla de cuentas coincide con D-10.
- **Descartado:** identificadores enteros autoincrementales; tabla `owners` separada de los administradores; tabla de fotos (se retoma si se quieren varias por negocio); guardar la URL completa de la foto; enum de PostgreSQL o tabla con relación muchos a muchos para los medios de pago; texto libre para roles y tipos de canal; guardar el estado "abierto ahora" en la base.
- **Nota:** el rol `admin` existe en el modelo, pero el panel de administración está fuera del MVP, por lo que no tiene interfaz. Si más adelante se agregan cuentas de vecinos, se suma un valor nuevo al rol con una migración. El equipo terminó la revisión el 05/11/2026.

## D-23 Registro central de rutas en `routes.ts`
- **Decisión:** las rutas de todos los módulos se registran en `src/routes.ts`. Ese archivo arma un único router (`createApiRouter`) y `app.ts` lo monta bajo `/api`. Cada módulo sigue definiendo sus rutas en su carpeta `routes/`.
- **Motivo:** `app.ts` arma la cadena de middlewares (logs, JSON, rutas, 404 y errores). La lista de rutas cambia cada vez que se agrega un módulo, por otra razón. Separarlas deja `app.ts` legible de un vistazo y evita que crezca con cada módulo.
- **Descartado:** registrar cada router con `app.use()` directo en `app.ts`, porque mezcla las dos responsabilidades y se llena a medida que aparecen módulos.
- **Nota:** complementa a D-07. El prefijo `/api` (D-11) se define una sola vez, en `app.ts`; en `routes.ts` las rutas van sin el prefijo (`/businesses`).

## D-24 PostgreSQL local en el puerto 5433
- **Decisión:** el `docker-compose.yml` expone PostgreSQL en el puerto `5433` de la máquina (`5433:5432`). `DATABASE_URL` en `backend/.env.example` apunta a `localhost:5433`.
- **Motivo:** quien ya tiene PostgreSQL instalado en su máquina lo tiene ocupando el `5432`. Con `5433` el contenedor y la instalación conviven sin conflicto, y todo el equipo usa la misma URL.
- **Descartado:** el `5432` por defecto, porque obliga a apagar el PostgreSQL instalado o a que cada uno cambie el puerto en su `.env`.
- **Nota:** dentro del contenedor PostgreSQL sigue en `5432`; solo cambia el puerto de la máquina. Complementa a D-04.

## D-25 Diseño de la API en dos niveles y respuesta paginada
- **Decisión:**
  - La API se diseña en dos niveles, en `docs/api.md`. Las **reglas comunes** (forma de las respuestas, paginación, errores, nombres, fechas y códigos HTTP) se definen una vez y valen para todos los módulos. El **detalle de cada endpoint** (campos, ejemplo y errores propios) lo escribe quien implementa la historia, en el mismo PR.
  - El documento tiene además una lista de los endpoints del MVP, sacada de las historias. Se actualiza en el PR que agrega o cambia un endpoint.
  - Una lista se responde siempre paginada: `{ data, page, limit, total }`. `limit` es 20 por defecto y 100 como máximo.
  - Un recurso se responde como objeto directo, sin envoltorio.
  - Un negocio se identifica por su `slug` en todas las rutas, públicas y del panel.
- **Motivo:** especificar cada campo de todos los módulos antes de programar lleva a un documento que se desactualiza al implementar. Con las reglas comunes definidas, cada integrante diseña los endpoints de su historia sin coordinar cada detalle, y la revisión del PR verifica que las respete. El slug nunca cambia (RN-05), así que sirve como único identificador del negocio.
- **Descartado:** diseñar el detalle de todos los endpoints antes de empezar; envolver también los recursos sueltos en `{ data }`; usar el `id` en las rutas del panel y el `slug` en las públicas, porque habría dos identificadores para lo mismo.
- **Nota:** complementa a D-11. La colección de Postman (`docs/postman/`) sigue a `docs/api.md`.
- **Actualización (06/11/2026):** el detalle de cada endpoint ya no se escribe en `docs/api.md`: se genera con OpenAPI desde los esquemas Zod y se ve en Swagger (D-34). Las reglas comunes y la lista de endpoints siguen en `docs/api.md`.

## D-26 API en Docker para desarrollo, con perfiles de Docker Compose
- **Decisión:**
  - `backend/Dockerfile` es una imagen de **desarrollo**: corre `npm run dev`, que reinicia el servidor al guardar. Al arrancar aplica las migraciones pendientes.
  - `docker-compose.yml` usa perfiles para elegir qué levantar. Sin perfil levanta solo la base de datos; con `--profile api` levanta también la API.
  - Los cambios llegan al contenedor con Compose Watch (`up --watch`): copia cada archivo guardado de `src/` y `tests/`, y reconstruye la imagen si cambian las dependencias o la carpeta `prisma/`.
  - El frontend se suma más adelante con su propio perfil.
  - La imagen usa Debian slim (`node:24-bookworm-slim`), no Alpine.
- **Motivo:** que un integrante pueda trabajar en el proyecto con solo Docker, sin instalar Node ni configurar dependencias. Quien prefiere Node en su máquina sigue usando `npm run dev` y levanta solo la base. Compose Watch y no una carpeta montada porque en Windows con Docker Desktop el contenedor no se entera de los archivos guardados y el reinicio automático falla. Debian slim porque `bcrypt` trae binarios compilados para glibc, la biblioteca de C que usa Debian y no Alpine.
- **Descartado:** una imagen de producción ahora, porque depende del hosting, que no está definido (D-20); montar la carpeta del backend como volumen, por el problema de Windows; un segundo archivo de compose para la API, porque obliga a pasar los dos archivos en cada comando; levantar siempre la API con la base, porque choca con `npm run dev` en el puerto 3000.
- **Nota:** complementa a D-04 y D-24. La imagen de producción se define con el hosting del primer despliegue.

## D-27 Frontend con Next.js para la web pública
- **Decisión:**
  - La web pública se construye con Next.js (TypeScript, App Router), en la carpeta `web/`, hermana de `backend/`.
  - El panel se mantiene como SPA con Vite y React, en `panel/`, tal como ya figuraba por defecto en D-20.
  - Ambos frontends validan con Zod en el borde (formularios, parámetros), igual que el backend (D-09).
- **Motivo:** las fichas de negocio se comparten por WhatsApp y redes, y necesitan vista previa (título, imagen, descripción) al pegar el enlace. Eso requiere que el HTML llegue armado desde el servidor, algo que una SPA con Vite no da sin trabajo extra. El panel es privado y no necesita SEO ni vista previa, así que una SPA alcanza y es más simple.
- **Descartado:** Vite + SPA también para la web pública, porque pierde la vista previa al compartir sin agregar una capa de renderizado aparte.
- **Nota:** el equipo tuvo la primera clase de React del bootcamp el 05/11/2026, lo que desbloquea las dos tareas de inicialización de EP-00 (`[WEB]` y `[PANEL]`).

## D-28 CORS con lista de orígenes permitidos
- **Decisión:**
  - El backend usa el paquete `cors` con una lista explícita de orígenes en la variable `CORS_ORIGINS`, separados por comas y validados con Zod. Fuera de producción, por defecto: `http://localhost:3001` (web) y `http://localhost:3002` (panel). En producción es obligatoria: si falta, la API no arranca.
  - Va con `credentials: true`, para que viaje la cookie de sesión (D-10).
  - Una request sin encabezado `Origin` (Postman, curl, otro servidor) pasa igual: CORS lo aplica el navegador.
- **Motivo:** la API, la web y el panel corren como servidores separados. Un origen es protocolo + dominio + puerto, así que el navegador trata a cada uno como otro sitio y bloquea la respuesta si la API no lo permite. Las llamadas que hace Next desde el servidor no pasan por CORS.
- **Descartado:** `origin: '*'`, porque el navegador lo rechaza cuando viaja una cookie; un proxy de Vite solo en desarrollo, porque en producción las apps también van separadas y el problema volvería; escribir los orígenes en el código, porque cambian en cada entorno.
- **Nota:** en producción, si la API y los frontends quedan en dominios distintos, la cookie pasa a ser de terceros y los navegadores la bloquean cada vez más. La idea es usar un dominio propio con subdominios; queda en D-20 hasta definir el hosting.

## D-29 URLs del frontend en español
- **Decisión:** las URLs que ve el usuario en la web y en el panel van en español: `/negocios/[slug]`, `/ingresar`, `/mis-negocios`. Las rutas de la API siguen en inglés (D-08) y el código también.
- **Motivo:** el vecino lee, comparte y escribe esas URLs. Un enlace como `/negocios/panaderia-la-espiga` se entiende al pegarlo en WhatsApp.
- **Descartado:** URLs en inglés, porque mezclan idiomas en lo que ve el usuario.
- **Nota:** el nombre del componente sigue en inglés (`BusinessPage`); solo cambia el texto de la URL.

## D-30 `fetch` con un `http-client` propio en los dos frontends
- **Decisión:**
  - Las dos apps llaman a la API con `fetch` a través de `src/shared/api/http-client.ts`, el único archivo que usa `fetch` directamente.
  - El `http-client` arma la URL desde `config/env.ts`, manda siempre `credentials: 'include'`, convierte el JSON y, si la respuesta no es `ok`, lanza un `ApiError` con el `code`, el `message` y los `details` del formato de errores de la API. Opcionalmente valida la respuesta con un esquema Zod.
  - Todo error sale como `ApiError`: sin conexión (`NETWORK_ERROR`), respuesta que no es JSON o no coincide con el esquema (`INVALID_RESPONSE`) y errores de la API con su propio `code`. Las pantallas nunca reciben un `ZodError` ni un `TypeError`.
  - La URL base va en `NEXT_PUBLIC_API_URL` (web) y `VITE_API_URL` (panel), documentada en el `.env.example` de cada app. En desarrollo vale por defecto `http://localhost:3000/api`; en producción es obligatoria.
  - Hay una copia del `http-client` en cada app (D-31). Un cambio en una se repite en la otra. La única diferencia es que la web elige la URL según corra en el servidor o en el navegador (D-33).
- **Motivo:** Next extiende `fetch` en el servidor con caché (`next: { revalidate, tags }`) y Axios no la aprovecha. Lo que suma Axios (JSON automático, error en 4xx y 5xx, configuración común) lo cubre un archivo chico. Usar lo mismo en las dos apps hace que las llamadas se escriban igual en todo el proyecto.
- **Descartado:** Axios en las dos apps, por la caché de Next; Axios en el panel y `fetch` en la web, porque son dos formas de hacer lo mismo; un valor por defecto también en producción, porque si se olvida la variable la app compila, apunta a `localhost` y ninguna llamada funciona sin que nada lo avise.
- **Nota:** la copia en dos apps se revisa si aparece otra pieza para compartir entre la web y el panel (D-37).

## D-31 Estructura del frontend por módulos y capas
- **Decisión:**
  - Las dos apps se organizan por módulo, con los mismos nombres que el backend (`auth`, `businesses`, `opening-hours`…), en `src/modules/`.
  - Dentro de cada módulo, las capas son `pages` (arma la pantalla) → `hooks` (estado y lógica) → `api` (llamadas HTTP), más `components` (solo vista, por props), `schemas` (Zod) y `domain` (funciones puras).
  - Un módulo usa a otro solo por su `index.ts`. ESLint lo verifica con `no-restricted-imports`, como las capas del backend (D-15). Lo que usan dos o más módulos va en `src/shared/`.
  - En la web, `src/app/` solo tiene rutas finas que usan los módulos. Los datos se piden en el servidor y solo lo interactivo lleva `'use client'`.
  - Los componentes de React se nombran en `PascalCase.tsx`; el resto de los archivos, en `kebab-case`.
  - "Abierto ahora" no se recalcula en el frontend: lo devuelve la API.
  - El detalle está en la skill `estructura-del-frontend`.
- **Motivo:** es la misma idea que el backend (D-06): separar vista, lógica y acceso a datos, y que cada integrante encuentre las cosas en el mismo lugar en las tres apps.
- **Descartado:** carpetas por tipo (`components/`, `hooks/` y `services/` globales), porque con varios módulos mezclan todo; un paquete compartido de tipos entre backend y frontend, porque necesita *workspaces* y es demasiado para el tamaño del proyecto.

## D-32 React Router en el panel
- **Decisión:** el panel usa React Router (paquete `react-router`, modo *data* con `createBrowserRouter`). Todas las rutas se registran en `src/app/router.tsx`.
- **Motivo:** es el router más usado y documentado para una SPA con React, y el más probable en el curso. Tener todas las rutas en un archivo sigue la idea de D-23 en el backend.
- **Descartado:** TanStack Router, que tiene mejor tipado pero menos material para aprender; ruteo propio con estado, porque no maneja el historial ni los enlaces.
- **Nota:** desde la versión 8, `RouterProvider` se importa de `react-router/dom` y todo lo demás de `react-router`. Ya no existe `react-router-dom`.

## D-33 Web y panel en Docker para desarrollo
- **Decisión:**
  - `web/Dockerfile` y `panel/Dockerfile` son imágenes de **desarrollo**, con la misma base que la API (`node:24-bookworm-slim`). Corren `npm run dev` escuchando en `0.0.0.0`.
  - `docker-compose.yml` suma los perfiles `web` y `panel`, y `full` para levantar todo. La API queda en `api` y `full`. Los perfiles se combinan.
  - Los cambios llegan con Compose Watch, igual que en la API (D-26). Si cambia la configuración (`next.config.ts`, `vite.config.ts`, `index.html`), se reinicia el contenedor; si cambia `package-lock.json`, se reconstruye la imagen.
  - La web y el panel no dependen de la API para arrancar: se pueden levantar contra una API que corra con `npm run dev`.
  - La web suma la variable `API_INTERNAL_URL`, solo del servidor: es la dirección de la API vista desde el servidor de Next. En Docker vale `http://api:3000/api`. El `http-client` la usa en el servidor y la pública en el navegador (D-30).
- **Motivo:** completar lo que D-26 dejó para más adelante: que un integrante levante el proyecto entero con solo Docker. `API_INTERNAL_URL` hace falta porque dentro de un contenedor `localhost` es el propio contenedor: el navegador llega a la API por `localhost:3000`, pero el servidor de Next no. En producción pasa lo mismo cuando la API está en una red interna.
- **Descartado:** que la web y el panel dependan de la API en el compose, porque obligaría a levantarla aunque se use `npm run dev`; red del host (`network_mode: host`), porque en Docker Desktop para Windows no es confiable; un perfil por combinación posible, porque los perfiles ya se combinan.
- **Nota:** complementa a D-26. Las imágenes de producción se definen con el hosting.

## D-34 Documentación de la API con OpenAPI y Swagger, generada desde Zod
- **Decisión:**
  - El detalle de cada endpoint se documenta con OpenAPI 3.1, generado con `zod-openapi` desde los **mismos esquemas Zod** que validan la ruta.
  - Cada módulo declara sus endpoints en `routes/<módulo>.openapi.ts` y se registran en `src/openapi.ts`, igual que las rutas en `src/routes.ts` (D-23). El formato de error común está en `shared/openapi/` (`ErrorResponse`).
  - Swagger UI se sirve en `/api/docs` y la especificación en `/api/openapi.json`. Están activos en todos los entornos menos producción.
  - Roles: **Swagger** para ver y probar un endpoint mientras se programa; **Postman** (`docs/postman/`) para correr colecciones enteras de pruebas de una vez y guardar escenarios. Postman puede importar `/api/openapi.json` para armar las requests.
  - `docs/api.md` sigue teniendo las reglas comunes y la lista de endpoints del MVP (D-25).
- **Motivo:** escribir el detalle a mano en `docs/api.md` se desactualiza apenas cambia un campo. Generado desde Zod, la documentación es el mismo código que valida: si cambia el esquema, cambia la documentación. Swagger además deja probar cada endpoint desde el navegador y, como se sirve desde la misma API, manda la cookie de sesión sin configurar nada.
- **Descartado:** escribir el YAML de OpenAPI a mano, porque es otra copia que se desactualiza; `@asteasolutions/zod-to-openapi`, que obliga a registrar cada esquema por separado, mientras que `zod-openapi` usa `.meta()` nativo de Zod 4; Swagger también en producción, porque expone la forma de toda la API sin aportar a los usuarios; reemplazar Postman, porque Swagger no corre colecciones ni guarda escenarios.
- **Nota:** actualiza a D-25, que dejaba el detalle por endpoint en `docs/api.md`. El papel de Postman lo precisa D-35.

## D-35 Postman para escenarios, no como catálogo de endpoints
- **Decisión:**
  - El catálogo de endpoints es Swagger (D-34). La colección de Postman no repite cada endpoint: guarda **escenarios**, es decir, flujos de varios pasos que usan la sesión o variables (por ejemplo: iniciar sesión → editar la ficha → ver el cambio en la ficha pública).
  - Para probar un endpoint suelto en Postman, se importa `http://localhost:3000/api/openapi.json` (Import > Link) en lugar de escribir la request a mano.
  - Las pruebas automáticas de la API son pruebas de integración con Supertest (D-15), que corren en la CI en cada PR. Postman no las reemplaza.
  - Las requests `[Pendiente]` que ya están en la colección se quedan hasta que su endpoint esté en Swagger. Ahí se sacan, salvo que formen parte de un escenario.
- **Motivo:** mantener cada endpoint a mano en Postman y también en Swagger es la misma información dos veces, y la copia de Postman se queda vieja. Los flujos con sesión son justo lo que Swagger no hace.
- **Descartado:** sacar Postman, porque es la forma más cómoda de correr un flujo con cookie y figura en D-15 y en el ERS (RNF-09); mantener la colección como catálogo completo, por la duplicación.
- **Nota:** precisa los papeles de Swagger y Postman de D-34 y la fila de Postman de D-15.

## D-36 El estado de las tareas vive solo en Trello
- **Decisión:**
  - Trello es la única fuente del **estado** de las tareas: qué está hecho, en curso o pendiente.
  - `epicas-e-historias.md` es el **plan**: épicas, historias, criterios de aceptación y una primera lista de tareas para armar las tarjetas.
  - Cuando la tarjeta de una historia ya existe, sus tareas se agregan, cambian o dividen **solo en Trello**. El documento no se vuelve a sincronizar con el checklist: se actualiza solo si cambia el alcance de la historia o sus criterios.
  - El documento no tilda tareas ni lleva un conteo de tareas.
- **Motivo:** el checklist estaba en los dos lugares y se desincronizó dos veces (el total de tareas de EP-00 y el texto de la CI).
- **Descartado:** sincronizar los dos a mano, por lo anterior; borrar las tareas del documento, porque las historias que todavía no tienen tarjeta las necesitan como plan.

## D-37 Herramientas que no se suman por ahora
- **Decisión:** por ahora no se agregan Storybook, monorepo con *workspaces* (un paquete compartido entre las apps), Dependabot ni *pre-commit hooks* (Husky y lint-staged).
- **Motivo:** somos 4 y el MVP tiene fecha. Cada herramienta suma configuración y mantenimiento sin resolver un problema concreto de hoy. Los errores de lint, formato, tipos y pruebas ya los frena la CI en cada PR, y correr `lint` antes de subir sigue siendo regla (`CONTRIBUTING.md`).
- **Descartado:** sumarlas "por las dudas", por el costo de mantenerlas.
- **Nota:** se revisa cada una si aparece su motivo: *workspaces*, si además del `http-client` hay más código para compartir entre la web y el panel (D-30); Storybook, si hay varios componentes visuales reutilizables; Dependabot, si el proyecto sigue después de la entrega.
