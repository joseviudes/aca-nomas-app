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
| D-22 | Modelo de datos | Pendiente de revisión del equipo |

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
| pausa | `paused` |

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
| Postman | Probar la API; colección exportada en `docs/postman/` | Desde el inicio |
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
| Localidad inicial | Corrientes Capital | A confirmar (Capital o Mantilla) |
| Aprobación de fichas nuevas | Se publican de inmediato | A confirmar |
| Un dueño con varios negocios | El modelo lo permite; la interfaz del MVP muestra uno | A confirmar |
| Rubros | Lista fija chica por seed; administración en otra fase | A definir |
| Frontend de la web pública | Next.js o renderizado en el servidor para vistas previas al compartir; panel como SPA con Vite | Cuando llegue el curso de React |
| Hosting del primer despliegue | Sin definir | Pendiente |
| Modelo de datos | Propuesto en D-22 | En revisión del equipo |
| Diseño de la API | Se define en el plan de implementación | Pendiente |
| Rama `develop` | Sin `develop`: las ramas salen de `main` y en EP-00 los PR agrupan varias tareas por bloque | Se evalúa con el primer despliegue |
| Respuesta paginada | `{ data, page, limit, total }`, con `limit` máximo de 100 | A confirmar en el diseño de la API |
| Librería de logs | Logger propio mínimo con `console` (una línea por request) | Se evalúa antes del primer despliegue |

## D-21 Sin atribución a IA en commits y PR
- **Decisión:** los commits y los PR no llevan `Co-Authored-By` ni mencionan a Claude u otra herramienta de IA.
- **Motivo:** el autor del commit es quien sube el cambio y responde por él. Algunas herramientas agregan la atribución por defecto, así que la regla tiene que estar escrita.
- **Descartado:** dejar que cada integrante decida, porque el historial queda inconsistente.
- **Nota:** la regla está en `CONTRIBUTING.md` y en la skill `git-y-pr`.

## D-22 Modelo de datos
- **Decisión:**
  - Seis tablas: `localities`, `categories`, `users`, `businesses`, `opening_hours` y `contact_channels`. El diagrama está en `docs/diagramas/modelo-de-datos.md`.
  - Identificadores de tipo `uuid`.
  - Una sola tabla `users` con la columna `role` (`owner` o `admin`). El visitante no tiene cuenta, por lo que no es un usuario.
  - El rubro del negocio es obligatorio.
  - Una sola foto por negocio, en la columna `photo_url`.
  - Los horarios van en una tabla (`opening_hours`), con un turno por fila. Los canales de contacto van en otra (`contact_channels`), cada uno con su visibilidad.
  - `JSONB` solo para los medios de pago (`payment_methods`). El resto del modelo es relacional.
  - "Hoy no abro" se guarda como la fecha local (`closed_today_date`), así vence solo al cambiar el día. La pausa se guarda en `paused`.
  - El estado "abierto ahora" no se guarda: se calcula con `isOpenNow`.
- **Motivo:** las relaciones entre dueño, negocio, localidad y rubro encajan en SQL (D-03). Los horarios en filas permiten leer todos los turnos juntos para `isOpenNow` y validar que no se superpongan. Guardar la fecha de "hoy no abro" evita un proceso que lo reinicie cada día. Los medios de pago son una lista de etiquetas sin relaciones, el caso típico de dato flexible. Un rol en una sola tabla de cuentas coincide con D-10.
- **Descartado:** identificadores enteros autoincrementales; tabla `owners` separada de los administradores; tabla de fotos (se retoma si se quieren varias por negocio); tabla de medios de pago con relación muchos a muchos; guardar el estado "abierto ahora" en la base.
- **Nota:** el rol `admin` existe en el modelo, pero el panel de administración está fuera del MVP, por lo que no tiene interfaz. Si más adelante se agregan cuentas de vecinos, se suma un valor nuevo al rol con una migración. El estado pasa a `Aceptada` cuando el equipo termine la revisión.