// Formato estándar de error de la API (RNF-11, D-11). Es el único lugar que lo define.
export interface ErrorBody {
  error: {
    code: string;
    message: string;
    details: unknown[];
  };
}

export function toErrorBody(code: string, message: string, details: unknown[] = []): ErrorBody {
  return { error: { code, message, details } };
}
