import { createBrowserRouter } from 'react-router';
import { PanelLayout } from './layout/PanelLayout';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

// Todas las rutas del panel en un solo lugar (D-32). Cada módulo exporta sus páginas desde su
// index.ts y se registran acá. Las URLs van en español porque las ve el usuario (D-29).
// Las rutas dentro de PanelLayout llevan el menú; el ingreso (/ingresar, US-13) va afuera.
export const router = createBrowserRouter([
  {
    Component: PanelLayout,
    children: [{ index: true, Component: HomePage }],
  },
  { path: '*', Component: NotFoundPage },
]);
