# AcáNomás — Web pública

Web pública de AcáNomás, hecha con [Next.js](https://nextjs.org) (App Router, TypeScript). Ver [D-27](../docs/decisiones.md#d-27-frontend-con-nextjs-para-la-web-pública). La organización de carpetas está en la skill `estructura-del-frontend`.

## Cómo levantarla

Requiere Node 24 (ver `.nvmrc` en la raíz del repo) y la API corriendo (ver el README de la raíz).

```bash
npm install
npm run dev
```

Corre en [http://localhost:3001](http://localhost:3001). El puerto 3000 queda libre para la API.

**URL de la API:** en desarrollo llama a `http://localhost:3000/api`. Para cambiarla, crear `.env.local` con `NEXT_PUBLIC_API_URL=<url>` (ver `.env.example`). En producción la variable es obligatoria: sin ella, el build falla. La API ya permite este origen en desarrollo (CORS, D-28).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run start` | Corre el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos con TypeScript |
| `npm test` / `test:watch` | Pruebas con Vitest (en `tests/`) |
| `npm run format` / `format:check` | Prettier |
