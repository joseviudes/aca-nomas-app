import { NavLink, Outlet } from 'react-router';
import { cx } from '../../shared/ui/class-names';

type PanelNavItem = {
  to: string;
  label: string;
};

// Las secciones del menú. Cada historia que agrega una sección suma acá su ruta (en español, D-29):
// "Mi ficha" con US-15 y "Horarios" con US-21.
const navItems: PanelNavItem[] = [{ to: '/', label: 'Inicio' }];

function navLinkClass(isActive: boolean) {
  return cx(
    'flex min-h-11 items-center rounded-field px-3 font-bold',
    isActive ? 'bg-accent text-ink' : 'hover:underline',
  );
}

// Estructura del panel (docs/diseno.md, sección 9): en escritorio, menú lateral; en el celular,
// barra de arriba con la marca y barra de pestañas abajo.
export function PanelLayout() {
  return (
    <div className="flex min-h-dvh flex-col md:flex-row">
      <header className="flex items-center justify-between bg-ink px-5 py-3.5 text-paper md:hidden">
        <span className="text-xl font-bold">acánomás</span>
      </header>

      <aside className="hidden w-60 shrink-0 flex-col gap-7 bg-brand px-4 py-7 text-paper md:flex">
        <div className="flex flex-col gap-1 px-3">
          <span className="text-2xl font-bold">acánomás</span>
          <span className="caps-label text-accent">Panel del dueño</span>
        </div>
        <nav aria-label="Panel" className="flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) => navLinkClass(isActive)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* pb-24: deja lugar a la barra de pestañas del celular. */}
      <main className="min-w-0 flex-1 px-5 pt-5 pb-24 md:px-10 md:py-8">
        <Outlet />
      </main>

      <nav
        aria-label="Panel"
        className="fixed inset-x-0 bottom-0 flex gap-2 border-t border-mint bg-surface px-2 pt-2 pb-3.5 md:hidden"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cx(
                'flex min-h-14 flex-1 items-center justify-center rounded-field text-xs font-bold',
                isActive && 'bg-accent',
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
