---
name: estructura-del-proyecto
description: Organización de carpetas y capas de AcáNomás. Usar al crear un archivo, módulo o carpeta, o cuando haya duda sobre dónde va una pieza de código o a qué capa pertenece.
---

# Estructura del proyecto

Arquitectura: **monolito modular en capas**, con puertos y adaptadores en los bordes (decisiones D-06 y D-07).

## Carpetas

```
aca-nomas/
├── CLAUDE.md
├── .claude/skills/
├── docs/                      ers.md, decisiones.md, epicas-e-historias.md, postman/
├── prisma/                    schema.prisma, migrations/, seed.ts
└── src/
    ├── app.ts                 arma Express (middlewares y rutas)
    ├── server.ts              abre el puerto
    ├── container.ts           conecta las dependencias
    ├── modules/
    │   └── businesses/        un módulo = una carpeta
    │       ├── routes/
    │       ├── controllers/
    │       ├── services/
    │       ├── repositories/
    │       ├── schemas/       esquemas Zod (hacen de DTO)
    │       └── domain/        tipos y reglas puras
    ├── shared/
    │   ├── ports/             contratos (interfaces) de todo lo externo
    │   ├── errors/            AppError y subclases
    │   └── middlewares/       validate, auth, errores, logs
    └── infrastructure/
        ├── database/          solo el cliente de Prisma
        ├── storage/           adaptadores de fotos
        └── mailer/            adaptadores de mails
```

`shared/errors/`, `shared/middlewares/` y dónde van los archivos de prueba **todavía no están decididos**. Confirmarlo en EP-00 y registrarlo en `docs/decisiones.md`.

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
- ¿Una variable de entorno? → se valida con Zod al arrancar, y se agrega a `.env.example`.

## Nombres de carpetas y archivos

- Carpetas y archivos en `kebab-case` con sufijo de rol: `business.service.ts`, `business.controller.ts`, `business.schema.ts`.
- Repo y carpetas: `aca-nomas`. En la interfaz se escribe "AcáNomás".

Más sobre nombres en `convenciones-de-codigo`.
