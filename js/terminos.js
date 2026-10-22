// ============================================================
//  Términos egipcios (fines) — tabla de R. Gil («Los términos»,
//  Eudemon 3/2000; variante validada): egipcia estándar de
//  Ptolomeo I.21 con Acuario ajustado (Ve 6, Me 7, Ju 7, Ma 6, Sa 4).
//  Verificación: cada signo suma 30° y las sumas por planeta
//  igualan los años mayores — Júpiter 79, Venus 82, Mercurio 76,
//  Marte 66, Saturno 57 (ANIOS_MAYORES de fichas-tema.js).
//  Las tablas están en imports/astrologia/principiantes/texto/
//  170498910-Los-terminos.txt (OCR de las tablas dañado; la
//  reconstrucción se validó contra las sumas del propio artículo).
// ============================================================

export const TERMINOS_EGIPCIOS = {
  Aries: [['Júpiter', 6], ['Venus', 6], ['Mercurio', 8], ['Marte', 5], ['Saturno', 5]],
  Tauro: [['Venus', 8], ['Mercurio', 6], ['Júpiter', 8], ['Saturno', 5], ['Marte', 3]],
  Géminis: [['Mercurio', 6], ['Júpiter', 6], ['Venus', 5], ['Saturno', 7], ['Marte', 6]],
  Cáncer: [['Marte', 7], ['Venus', 6], ['Mercurio', 6], ['Júpiter', 7], ['Saturno', 4]],
  Leo: [['Júpiter', 6], ['Venus', 5], ['Saturno', 7], ['Mercurio', 6], ['Marte', 6]],
  Virgo: [['Mercurio', 7], ['Venus', 10], ['Júpiter', 4], ['Marte', 7], ['Saturno', 2]],
  Libra: [['Saturno', 6], ['Mercurio', 8], ['Júpiter', 7], ['Venus', 7], ['Marte', 2]],
  Escorpio: [['Marte', 7], ['Venus', 4], ['Mercurio', 8], ['Júpiter', 5], ['Saturno', 6]],
  Sagitario: [['Júpiter', 12], ['Venus', 5], ['Mercurio', 4], ['Saturno', 5], ['Marte', 4]],
  Capricornio: [['Mercurio', 7], ['Júpiter', 7], ['Venus', 8], ['Saturno', 4], ['Marte', 4]],
  Acuario: [['Venus', 6], ['Mercurio', 7], ['Júpiter', 7], ['Marte', 6], ['Saturno', 4]],
  Piscis: [['Venus', 12], ['Júpiter', 4], ['Mercurio', 3], ['Marte', 9], ['Saturno', 2]],
};

const SIGNOS_TABLA = Object.keys(TERMINOS_EGIPCIOS);

// Regente del término en que cae la longitud dada (grado eclíptico 0-360).
// Devuelve { signo, planeta, inicio, fin, grado } en grados dentro del signo.
export function terminoDe(lon) {
  const lonN = ((lon % 360) + 360) % 360;
  const idx = Math.floor(lonN / 30);
  const signo = SIGNOS_TABLA[idx];
  const grado = lonN - idx * 30;
  let inicio = 0;
  for (const [planeta, tam] of TERMINOS_EGIPCIOS[signo]) {
    if (grado < inicio + tam) return { signo, planeta, inicio, fin: inicio + tam, grado };
    inicio += tam;
  }
  const [planeta, tam] = TERMINOS_EGIPCIOS[signo][4];
  return { signo, planeta, inicio: 30 - tam, fin: 30, grado };
}