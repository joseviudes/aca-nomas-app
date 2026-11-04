---
name: estructura-del-proyecto
description: Organización de carpetas y capas de AcáNomás. Usar al crear un archivo, módulo o carpeta, o cuando haya duda sobre dónde va una pieza de código, una prueba o a qué capa pertenece.
---

# Estructura del proyecto

Arquitectura: **monolito modular en capas**, con puertos y adaptadores en los bordes (decisiones D-06 y D-07).

## Carpetas

```
aca-nomas-app/
├── CLAUDE.md
├── CONTRIBUTING.md            ramas, commits, flujo de PR, definición de hecho
├── README.md                  cómo levantar el proyecto
├── docker-compose.yml         PostgreSQL local
├── .github/                   pull_request_template.md y workflows (GitHub Actions)
├── .claude/skills/
├── docs/
│   ├── ers.md
│   ├── decisiones.md
│   ├── epicas-e-historias.md
│   ├── diagramas/             diagrama entidad-relación (Mermaid)
│   └── postman/               colección exportada
└── backend/
    ├── Dockerfile
    ├── .env.example
    ├── prisma/                schema.prisma, migrations/, seed.ts
    ├── src/
    │   ├── app.ts             arma Express (cadena de middlewares) y monta las rutas bajo /api
    │   ├── routes.ts          registro central: suma el router de cada módulo (D-23)
    │   ├── server.ts          abre el puerto
    │   ├── container.ts       conecta las dependencias
    │   ├── config/
    │   │   └── env.ts         variables de entorno validadas con Zod
    │   ├── modules/
    │   │   └── businesses/    un módulo = una carpeta (auth, businesses, categories…)
    │   │       ├── routes/
    │   │       ├── controllers/
    │   │       ├── services/
    │   │       ├── repositories/   PrismaBusinessRepository
    │   │       ├── schemas/        esquemas Zod (hacen de DTO)
    │   │       └── domain/         tipos y reglas puras (isOpenNow)
    │   ├── shared/
    │   │   ├── ports/         contratos (interfaces) de todo lo externo
    │   │   ├── errors/        AppError, subclases y formato estándar de error
    │   │   ├── middlewares/   validate, requireAuth, errores, logs, 404
    │   │   └── pagination/    esquema de page y limit, y armado de la respuesta paginada
    │   └── infrastructure/
    │       ├── database/      solo el cliente de Prisma
    │       ├── storage/       adaptador local y de Supabase Storage
    │       └── mailer/        adaptadores de mails
    └── tests/
        ├── unit/              Vitest: servicios y reglas puras
        └── integration/       Supertest: endpoints contra una base de pruebas
```

Todo el código del servidor vive en `backend/`. El frontend (web y panel) se agrega después como carpetas hermanas, sin mezclarse con `backend/`.

## Pruebas

- Van **en `backend/tests/`**, no al lado del código.
- Dentro de `unit/` e `integration/` se repite la estructura de `src/modules/`:
  `tests/unit/businesses/business.service.test.ts` prueba `src/modules/businesses/services/business.service.ts`.
- Los archivos terminan en `.test.ts`.
- Una prueba que levanta la app y le hace requests reales es de integración: va en `integration/`, aunque no use la base.
- Supertest se suma cuando existan los endpoints principales (D-15). Hasta entonces, `integration/` usa `fetch` contra la app en un puerto libre.

## Qué hace cada capa

| Capa | Hace | No hace |
|---|---|---|
| `routes` | Define la ruta y encadena middlewares | Lógica |
| `controllers` | Lee la request, llama al servicio, arma la response | Reglas de negocio, acceso a datos |
| `services` | Reglas de negocio | Importar Express o Prisma |
| `repositories` | Accede a la base (`PrismaBusinessRepository`) | Reglas de negocio |
| `domain` | Tipos y funciones puras (por ejemplo `isOpenNow`) | Depender de algo externo |

## Reglas

1. Las capas fluyen hacia abajo y no se saltean: `controller → service → repository`.
2. Un módulo usa a otro **por su servicio**, nunca por su repositorio ni por sus tablas.
3. Todo lo externo (base, fotos, mails) tiene su contrato en `shared/ports/` y su implementación en `infrastructure/`.
4. El dominio es puro: no importa Express ni Prisma.
5. Las dependencias se pasan por constructor y se conectan en `container.ts`.
6. Los servicios no importan Prisma. ESLint lo verifica.

## Dónde va…

- ¿Una regla del negocio ("abierto ahora")? → `domain/` del módulo, como función pura.
- ¿Una consulta a la base? → `repositories/` del módulo.
- ¿Subir una foto? → contrato en `shared/ports/`, adaptador en `infrastructure/storage/`.
- ¿Algo que usan varios módulos? → `shared/`, solo si lo usan al menos dos.
- ¿Una variable de entorno? → se declara y valida en `config/env.ts`, y se agrega a `.env.example`.
- ¿Una prueba? → `backend/tests/`, replicando la ruta del archivo que prueba.

## Nombres de carpetas y archivos

- Carpetas y archivos en `kebab-case` con sufijo de rol: `business.service.ts`, `business.controller.ts`, `business.schema.ts`.
- Repo y carpetas: `aca-nomas-app`. En la interfaz se escribe "AcáNomás".

Más sobre nombres en `convenciones-de-codigo`.
