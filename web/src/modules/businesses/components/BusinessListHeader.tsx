import { businessCountLabel } from '../domain/business-display';

// Cantidad de negocios arriba del listado. En el celular la línea de abajo lo separa de las
// filas; desde sm, las tarjetas no tienen borde y alcanza con el espacio.
export function BusinessListHeader({ total }: { total: number }) {
  return (
    <h2 className="border-b border-line pb-3 text-lg font-bold sm:border-b-0 sm:pb-0 sm:text-xl">
      {businessCountLabel(total)}
    </h2>
  );
}
