'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/shared/ui/Button';

type CopyState = 'idle' | 'copied' | 'error';

const NOTICE_MS = 3000;

const notices: Record<CopyState, string> = {
  idle: '',
  copied: 'Enlace copiado',
  error: 'No se pudo copiar. Copiá la dirección desde la barra del navegador.',
};

// Copia el enlace de la ficha (US-08). Es lo único de cliente de la ficha: el resto se arma en el
// servidor. Se arma con el origen y la ruta, sin la query ni el #, para compartir siempre lo mismo.
export function CopyLinkButton({ path }: { path: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  async function copy() {
    clearTimeout(timeout.current);
    // Se vacía antes de copiar: si se toca dos veces seguidas, el lector de pantalla lo anuncia de nuevo.
    setState('idle');
    try {
      // navigator.clipboard solo existe en https o en localhost.
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(`${window.location.origin}${path}`);
      setState('copied');
      timeout.current = setTimeout(() => setState('idle'), NOTICE_MS);
    } catch {
      setState('error');
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant="secondary" onClick={copy}>
        Copiar el enlace
      </Button>
      {/* Siempre montado: el lector de pantalla anuncia el cambio de texto. */}
      <p role="status" className="text-sm font-bold text-brand">
        {notices[state]}
      </p>
    </div>
  );
}
