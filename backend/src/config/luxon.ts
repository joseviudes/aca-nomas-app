import { Settings } from 'luxon';

// Una zona horaria mal escrita en `localities.timezone` tiene que fallar, no dar un estado inventado.
// Por defecto Luxon devuelve una fecha "inválida" y sigue de largo.
Settings.throwOnInvalid = true;

// Toda fecha sin zona explícita se arma en UTC, no en la zona de la máquina: así el resultado
// es el mismo en la compu de cada uno, en la CI y en el servidor (D-41).
Settings.defaultZone = 'utc';

// Con `throwOnInvalid`, los tipos de Luxon asumen que toda fecha es válida.
declare module 'luxon' {
  interface TSSettings {
    throwOnInvalid: true;
  }
}
