import { createBrowserRouter } from 'react-router';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Todas las rutas del panel en un solo lugar (D-32). Cada módulo exporta sus páginas desde su
// index.ts y se registran acá. Las URLs van en español porque las ve el usuario (D-29).
export const router = createBrowserRouter([
  { path: '/', Component: HomePage },
  { path: '*', Component: NotFoundPage },
]);
