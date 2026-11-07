---
name: estructura-del-frontend
description: Organización de carpetas y capas de la web pública (web/, Next.js) y del panel del dueño (panel/, Vite y React). Usar al crear una página, un componente, un hook o una llamada a la API, al agregar una ruta, o cuando haya duda sobre dónde va una pieza del frontend.
---

# Estructura del frontend

Misma idea que el backend: **carpetas por módulo, y dentro de cada módulo, capas que no se mezclan** (D-31). Lo que en el backend es `controller → service → repository`, acá es `página → hook → api`.

## Capas

| Capa | Hace | No hace | En el backend sería |
|---|---|---|---|
| `pages/` (en la web, `app/`) | Arma la pantalla: usa hooks y pasa datos a los componentes | Llamar a la API directo, reglas de negocio | `routes` + `controllers` |
| `components/` | Muestra lo que recibe por props y avisa eventos (`onSubmit`, `onChange`) | Pedir datos, conocer la API | — (la vista) |
| `hooks/` | Estado, carga, errores, qué pasa al guardar | Dibujar HTML | `services` |
| `api/` | Las llamadas HTTP del módulo, con el `http-client`. Mientras el backend no está, devuelven los datos de ejemplo de `<módulo>.fixtures.ts` (D-40) | Estado, lógica de pantalla | `repositories` |
| `schemas/` | Esquemas Zod de formularios y respuestas | — | `schemas` |
| `domain/` | Funciones puras (formatear un horario, por ejemplo) | Depender de React o de la API | `domain` |

## Panel (`panel/`, Vite + React)

```
panel/src/
├── main.tsx                 monta el RouterProvider
├── app/
│   ├── router.tsx           TODAS las rutas del panel (D-32)
│   └── pages/               páginas que no son de ningún módulo (inicio, 404)
├── config/
│   └── env.ts               VITE_API_URL validada con Zod
├── modules/
│   └── businesses/          mismo nombre que el módulo del backend
│       ├── api/             businesses.api.ts
│       ├── hooks/           use-my-businesses.ts
│       ├── components/      BusinessForm.tsx
│       ├── pages/           EditBusinessPage.tsx
│       ├── schemas/         business-form.schema.ts
│       ├── domain/
│       └── index.ts         lo único que otros módulos (y router.tsx) importan
└── shared/
    ├── api/                 http-client.ts y api-error.ts (D-30)
    ├── ui/                  Button, Input, Modal: genéricos, sin lógica de negocio,
    │                        y theme.css con los tokens de Tailwind (D-38)
    └── hooks/
```

## Web (`web/`, Next.js con App Router)

```
web/src/
├── app/                     SOLO rutas, en español (D-29). Archivos finos
│   ├── layout.tsx
│   ├── page.tsx             listado: usa modules/businesses
│   └── negocios/[slug]/
│       └── page.tsx         ficha + generateMetadata (vista previa al compartir)
├── config/
│   └── env.ts               NEXT_PUBLIC_API_URL validada con Zod
├── modules/
│   └── businesses/
│       ├── api/  components/  hooks/  schemas/  domain/
│       └── index.ts
└── shared/
    ├── api/                 http-client.ts y api-error.ts (D-30)
    └── ui/                  componentes genéricos y theme.css (D-38)
```

En la web hay una decisión más por componente: **servidor o cliente**.

- Los datos se piden en el servidor, en el `page.tsx`. Así la ficha llega armada y la vista previa en WhatsApp funciona (D-27).
- Solo lo interactivo (filtros, mapa, botones con estado) lleva `'use client'`, y en el componente más chico posible.
- Para cachear una respuesta, se pasan las opciones de Next al `http-client`: `http.get('/categories', { next: { revalidate: 3600 } })`.

## Reglas

1. **Un componente no llama a la API.** Si un componente tiene `fetch` o `http.get`, está mal ubicado: va en `api/` y se usa desde un hook o una página.
2. **Solo `shared/api/http-client.ts` usa `fetch`.** Las demás llamadas pasan por él, así todas mandan la cookie y lanzan `ApiError` igual.
3. **Un módulo usa a otro solo por su `index.ts`.** Nunca `../../businesses/components/...` ni `@/modules/businesses/components/...`: ESLint lo marca como error (`no-restricted-imports`).
4. **`shared/` solo si lo usan al menos dos módulos.** Antes, queda en el módulo.
5. **"Abierto ahora" no se calcula en el frontend.** Lo devuelve la API (`isOpenNow`). Calcularlo en dos lugares termina dando resultados distintos.
6. **Los errores se muestran según `error.code`, nunca según `error.message`.** El código es estable; el texto puede cambiar. Todo error del `http-client` es un `ApiError`: los de la API traen su `code` (`BUSINESS_NOT_FOUND`), y además están `NETWORK_ERROR` (sin conexión) e `INVALID_RESPONSE` (la respuesta no tiene la forma esperada).
7. **Las URLs van en español; el código, en inglés** (D-29): la ruta `/mis-negocios` muestra `MyBusinessesPage`.
8. **Nada secreto en `config/env.ts`.** Las variables `VITE_` y `NEXT_PUBLIC_` llegan al navegador.
9. **El `http-client` y `shared/ui/theme.css` están copiados en las dos apps.** Si se cambia uno, se cambia el otro en el mismo PR. La única diferencia es que el de la web usa `API_INTERNAL_URL` cuando corre en el servidor (D-33).

## Nombres

| Qué | Formato | Ejemplo |
|---|---|---|
| Componentes y páginas | `PascalCase.tsx` | `BusinessCard.tsx`, `LoginPage.tsx` |
| Hooks | `kebab-case`, empiezan con `use-` | `use-login.ts` (exporta `useLogin`) |
| Resto de los archivos | `kebab-case` + rol | `businesses.api.ts`, `login.schema.ts` |
| Rutas de Next | carpetas en español | `app/negocios/[slug]/page.tsx` |

## Pruebas

- Van en `tests/` de cada app, replicando la ruta de `src/`, igual que el backend: `panel/tests/unit/shared/api/http-client.test.ts` prueba `panel/src/shared/api/http-client.ts`.
- Vitest, con `npm test`. Se prueba lo que tiene lógica: `api/`, `hooks/`, `domain/`, `schemas/` y `config/env.ts`.
- Las llamadas a la API se prueban reemplazando `fetch` con `vi.stubGlobal('fetch', ...)`: no hace falta la API prendida.
- Los componentes se prueban cuando existan, con un entorno de navegador (jsdom y Testing Library). Los flujos completos, con Playwright (D-15).

## Un ejemplo: el login del panel

1. `router.tsx` registra `{ path: '/ingresar', Component: LoginPage }`, importada de `modules/auth`.
2. `LoginPage` usa `useLogin()` y le pasa `onSubmit` a `<LoginForm>`.
3. `LoginForm` solo muestra los campos y valida con `login.schema.ts`.
4. `useLogin` llama a `login()` de `auth.api.ts`, maneja "cargando" y "error" y, si sale bien, navega a `/mis-negocios`.
5. `auth.api.ts` hace `http.post('/auth/login', datos)`.

Si mañana cambia el endpoint, se toca solo `auth.api.ts`.

## Dónde va…

El orden para armar una pantalla completa (esquema, API, hook, componentes, página, ruta y prueba) está en la skill `nueva-pantalla`.


- ¿Una pantalla nueva? → `pages/` del módulo y su ruta en `router.tsx` (panel) o una carpeta en `app/` (web).
- ¿Una llamada a un endpoint? → `api/` del módulo, con `http`.
- ¿Estado de un formulario o "cargando"? → un hook en `hooks/`.
- ¿Un botón genérico? → `shared/ui/`. ¿Una tarjeta de negocio? → `components/` de `businesses`.
- ¿Un color, una fuente o una sombra? → token en `shared/ui/theme.css` de las dos apps y en `docs/diseno.md`. Nunca un valor suelto en la pantalla.
- ¿Una variable de entorno? → `config/env.ts` y el `.env.example` de la app.
