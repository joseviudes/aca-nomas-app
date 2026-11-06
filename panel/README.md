# AcáNomás — Panel del dueño

Panel del dueño de AcáNomás, hecho como SPA con [Vite](https://vite.dev), React (TypeScript) y [React Router](https://reactrouter.com). Ver [D-20](../docs/decisiones.md#d-20-decisiones-diferidas) y [D-32](../docs/decisiones.md#d-32-react-router-en-el-panel). La organización de carpetas está en la skill `estructura-del-frontend`.

## Cómo levantarlo

Requiere Node 24 (ver `.nvmrc` en la raíz del repo) y la API corriendo (ver el README de la raíz).

```bash
npm install
npm run dev
```

Corre en [http://localhost:3002](http://localhost:3002). Los puertos 3000 y 3001 quedan libres para la API y la web pública.

**URL de la API:** en desarrollo llama a `http://localhost:3000/api`. Para cambiarla, copiar `.env.example` a `.env.local` y editar `VITE_API_URL`. En producción la variable es obligatoria. La API ya permite este origen en desarrollo (CORS, D-28).

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos con TypeScript |
| `npm run format` / `format:check` | Prettier |
