---
name: nueva-pantalla
description: Pasos para agregar o modificar una pantalla de la web pública (web/, Next.js) o del panel del dueño (panel/, Vite y React), del esquema a la ruta y la prueba. Usar cuando una tarea [WEB] o [PANEL] cree o cambie una página, un formulario o una llamada a la API desde el frontend.
---

# Nueva pantalla

Seguir los pasos en orden. Es el equivalente de `nuevo-endpoint` para el frontend. Dónde va cada archivo está en `estructura-del-frontend`.

## Antes de escribir código

- **Leer los criterios de aceptación** de la historia en Trello.
- **Mirar la pantalla en el mockup** (enlace en `docs/diseno.md`). Se construye **solo lo que entra en el MVP**: la sección 2 de `docs/diseno.md` lista lo que el mockup muestra pero no se hace. Es una referencia: los tokens (colores, fuentes, formas) se respetan siempre; la distribución puede cambiar si queda mejor, y se explica en el PR (D-38). Si la pantalla no está en el mockup, la plantea quien la arma con los tokens y los componentes de `shared/ui`, y muestra capturas en escritorio y a 390 px en el PR.
- **Si el mockup no abre**, usar `docs/mockup/`: la descripción y las capturas de cada pantalla. Si la pantalla tampoco está ahí, no adivinar la distribución: preguntarle al equipo. El PR lista cada desvío del mockup y por qué.
- **¿Está el contrato?** La pantalla **no espera al backend**, pero sí al contrato: el primer commit del backend en la rama de la historia (D-40). Hacer `git pull` en la rama y mirarlo en Swagger (`http://localhost:3000/api/docs`) o en el esquema de `schemas/` del módulo del backend. Si la tarea "[BE] Contrato" no está tildada, no inventar la forma de los datos: preguntarle a quien hace el backend.
- **¿El módulo ya existe** en `src/modules/`? Si no, crearlo con el mismo nombre que en el backend (`businesses`, `auth`, `opening-hours`).
- **¿Es de la web o del panel?** La web pide los datos en el servidor (vista previa al compartir, D-27); el panel corre todo en el navegador.

## Pasos

1. **Esquemas Zod** en `schemas/`: el de la respuesta (lo que devuelve la API) y, si hay formulario, el del formulario. Los tipos salen de `z.infer`. Los mensajes de error van en español.
2. **Llamada a la API, primero con datos de ejemplo** (D-40). Los datos van en `api/<módulo>.fixtures.ts`, con la forma del contrato, y la función de `api/<módulo>.api.ts` los devuelve validados con el mismo esquema. La página y el hook no se enteran de que son de ejemplo.
   ```ts
   // Datos de ejemplo hasta que el backend esté listo (D-40).
   export async function getBusiness(slug: string) {
     return businessDetailSchema.parse(businessDetailFixture(slug));
   }
   ```
3. **Hook** en `hooks/use-<algo>.ts` (sobre todo en el panel): llama a la función de `api/` y maneja **cargando**, **error** y **datos**. Después de guardar, navega o refresca. En la web, si la página pide los datos en el servidor, este paso no hace falta.
4. **Celular primero** (obligatorio, `docs/diseno.md` sección 9): los componentes y la página se escriben para 390 px con clases sin prefijo, y después se agrandan con `sm:` (640), `lg:` (1024) y `xl:` (1280). `md:` (768) es opcional y solo ajusta espacios y tamaños de letra. Nunca se arma para escritorio y después se achica.
5. **Componentes** en `components/`: solo vista. Reciben datos y funciones por props (`onSubmit`, `onChange`) y no conocen la API. Un componente genérico que sirva para varios módulos va en `shared/ui/`.
6. **Página** en `pages/` del módulo: arma la pantalla con el hook y los componentes. Contempla los cuatro estados: **cargando**, **error**, **vacío** y **con datos**. En la web, es un componente de servidor asíncrono que pide los datos; la ruta de `app/<ruta>/page.tsx` lo usa dentro de un `<Suspense>` (D-45), y solo lo interactivo lleva `'use client'`, en el componente más chico posible.
7. **Ruta:** en el panel, registrarla en `src/app/router.tsx` (D-32), importando la página desde el `index.ts` del módulo. En la web, la carpeta en `src/app/`. En los dos casos, **la URL va en español** (`/negocios/[slug]`, `/mis-negocios`) (D-29).
8. **Exportar** desde `index.ts` del módulo lo que usan otros: la página para el router y lo que otro módulo necesite. Lo demás queda privado (D-31).
9. **Pruebas** en `tests/unit/`, replicando la ruta de `src/` (por ejemplo, `tests/unit/modules/<módulo>/api/...`), con Vitest: la función de `api/` (con `fetch` simulado por `vi.stubGlobal`), el hook y las funciones de `domain/`. Probar el caso feliz y cada error que la pantalla trata distinto.
10. **Conectar con la API** (la última tarea de la pantalla, cuando el backend de la historia está listo): la función de `api/` pasa a usar `http` de `shared/api/http-client.ts`, con el esquema en `schema`. Nunca `fetch` directo. El archivo de `fixtures` puede quedar para las pruebas.
   ```ts
   export function getBusiness(slug: string) {
     return http.get(`/businesses/${slug}`, { schema: businessDetailSchema });
   }
   ```
11. **Verla funcionando:** con la API levantada, abrir la pantalla en el navegador (web en `localhost:3001`, panel en `localhost:3002`) y recorrer los criterios de aceptación con los datos del seed. Revisarla a 390, 768 y 1440 px: en ningún ancho hay que desplazarse de costado. Probar también un error: la API apagada (`NETWORK_ERROR`) y un recurso que no existe.
12. **Cierre:** `lint`, `typecheck` y `test` en verde y tildar la tarea en el checklist. El PR es uno por historia (D-39): se abre con el backend y la pantalla completos, con una captura de la pantalla en la descripción (`git-y-pr`).

## Controles de calidad

- [ ] Ningún componente llama a la API: todo pasa por `api/` y el `http-client`.
- [ ] Ninguna función de `api/` devuelve datos de ejemplo: la pantalla está conectada a la API (D-40).
- [ ] Ningún import entra a las carpetas internas de otro módulo (ESLint lo marca).
- [ ] La pantalla trata los errores por `error.code` y muestra un mensaje en español, nunca el texto técnico.
- [ ] Hay estado de carga, de error y de lista vacía.
- [ ] Usa solo los tokens de `shared/ui/theme.css`: ningún color ni medida escrita a mano (D-38).
- [ ] No construye nada de la lista "no entra" de `docs/diseno.md` (sección 2).
- [ ] Está armada celular primero (paso 4) y se revisó a 390, 768 y 1440 px, sin desplazarse de costado (`docs/diseno.md`, sección 9).
- [ ] El PR lista los desvíos del mockup, con capturas a 390 px y en escritorio.
- [ ] "Abierto ahora" sale de la API (`isOpenNow`): no se calcula en el frontend.
- [ ] Un canal de contacto oculto no se muestra en la web pública.
- [ ] Los botones y campos tienen texto o `label` (se usan con teclado y lector de pantalla).

## Si algo no está definido

Si la pantalla necesita un dato que la API no devuelve, **no lo inventes ni lo calcules en el frontend**: acordalo con quien hace el endpoint y sumalo a la API (`nuevo-endpoint`). Si falta una regla de interfaz que afecta a varias pantallas (por ejemplo, cómo se muestran los errores o la carga), acordala con el equipo y registrala en `docs/decisiones.md`.
