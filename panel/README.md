# AcáNomás — Panel del dueño

Panel del dueño de AcáNomás, hecho como SPA con [Vite](https://vite.dev) y React (TypeScript). Ver [D-20](../docs/decisiones.md#d-20-decisiones-diferidas).

## Cómo levantarlo

Requiere Node 24 (ver `.nvmrc` en la raíz del repo) y la API corriendo (ver el README de la raíz).

```bash
npm install
npm run dev
```

Corre en [http://localhost:3002](http://localhost:3002). Los puertos 3000 y 3001 quedan libres para la API y la web pública.

## Scripts

| Script | Qué hace |
|---|---|
| `npm run dev` | Levanta el servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Sirve el build de producción |
| `npm run lint` | ESLint |
| `npm run typecheck` | Chequeo de tipos con TypeScript |
| `npm run format` / `format:check` | Prettier |
