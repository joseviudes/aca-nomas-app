import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// La misma prueba está en web/ y en panel/: solo cambia OTHER_APP.
const OTHER_APP = 'panel';

const appRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const otherRoot = fileURLToPath(new URL(`../../../../../${OTHER_APP}/`, import.meta.url));
const uiPath = (root: string, file: string) => `${root}src/shared/ui/${file}`;

const theme = readFileSync(uiPath(appRoot, 'theme.css'), 'utf8');

function token(name: string): string {
  const match = theme.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6});`, 'i'));
  if (!match) throw new Error(`Falta el token --color-${name} en theme.css`);
  return match[1];
}

// Contraste según WCAG 2.1: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

describe('tokens de theme.css (D-38)', () => {
  // Las combinaciones de texto de docs/diseno.md, sección 8: al menos 4,5 a 1.
  it.each([
    ['ink', 'paper'],
    ['paper', 'brand'],
    ['ink', 'accent'],
    ['accent', 'brand'],
    ['muted', 'paper'],
    ['ink', 'alert'],
    ['brand', 'mint'],
    ['ink', 'surface'],
    ['ink', 'sand'],
    ['muted-strong', 'sand'],
  ])('%s sobre %s cumple el contraste mínimo para texto', (foreground, background) => {
    expect(contrast(token(foreground), token(background))).toBeGreaterThanOrEqual(4.5);
  });

  it('line sobre paper alcanza para bordes (3 a 1), no para texto', () => {
    expect(contrast(token('line'), token('paper'))).toBeGreaterThanOrEqual(3);
  });
});

// Dentro de Docker cada contenedor tiene solo su app: ahí no se compara. En la CI y en tu máquina, sí.
describe.skipIf(!existsSync(otherRoot))(`shared/ui es igual en ${OTHER_APP}/`, () => {
  it.each(['theme.css', 'class-names.ts', 'Button.tsx', 'Input.tsx', 'Card.tsx'])('%s', (file) => {
    const normalize = (text: string) => text.replace(/\r\n/g, '\n');
    expect(normalize(readFileSync(uiPath(otherRoot, file), 'utf8'))).toBe(
      normalize(readFileSync(uiPath(appRoot, file), 'utf8')),
    );
  });
});
