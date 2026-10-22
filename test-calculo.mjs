// Test de validación del motor de cálculo (Node, con los .se1 del equipo).
// Uso:  node test-calculo.mjs   (desde la carpeta carta-natal)
import { createSwissEph, Body, HouseSystem, Flag } from './js/vendor/dist/index.js';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

let fallos = 0;
function comprobar(nombre, obtenido, esperado, tol) {
  const ok = Math.abs(obtenido - esperado) <= tol;
  console.log(`${ok ? '  OK  ' : 'FALLO '} ${nombre}: ${obtenido.toFixed(6)} (esperado ~${esperado})`);
  if (!ok) fallos++;
}

console.log('== Test de cálculo — Swiss Ephemeris 2.10.03 ==\n');

// 1. Fecha juliana de referencia
const jd = swe.julianDay(2000, 1, 1, 12);
comprobar('JD 2000-01-01 12:00 UT', jd, 2451545.0, 1e-9);

// 2. Sol en J2000: longitud APARENTE ≈ 280.37° = 10°22' Capricornio
//    (280.46° sería la longitud media; la aparente incluye ecuación del centro,
//    aberración y nutación. Referencia: Swiss Ephemeris swetest.)
const sol = swe.calcWithSign(jd, Body.Sun, { flags: Flag.Speed });
comprobar('Sol J2000 (aparente)', sol.longitude, 280.369, 0.01);
console.log(`      -> ${sol.sign} ${sol.degreeInSign.toFixed(4)} | efemérides: ${sol.ephemeris}`);

// 3. Equinoccio de marzo de 2024 (20 mar 03:06 UT): Sol ~0° Aries
const jd2 = swe.julianDay(2024, 3, 20, 3.1);
const sol2 = swe.calcWithSign(jd2, Body.Sun);
comprobar('Sol equinoccio 2024', sol2.longitude, 360.0, 0.02);
console.log(`      -> ${sol2.sign} ${sol2.degreeInSign.toFixed(4)} | efemérides: ${sol2.ephemeris}`);

// 4. Luna en J2000 (sanity: debe usar .se1 y no ser retrógrada respecto al Sol)
const lun = swe.calcWithSign(jd, Body.Moon, { flags: Flag.Speed });
console.log(`  INFO  Luna J2000: ${lun.sign} ${lun.degreeInSign.toFixed(4)} | efemérides: ${lun.ephemeris} | retro: ${lun.retrograde}`);

// 5. Casas Placidus, Madrid (40.4168 N, -3.7038 E)
const h = swe.houses(jd, 40.4168, -3.7038, HouseSystem.Placidus);
console.log(`  INFO  ASC: ${h.ascendant.toFixed(3)} | MC: ${h.midheaven.toFixed(3)} | sustituido: ${h.substituted}`);
console.log(`  INFO  Cúspides: ${h.cusps.map((c) => c.toFixed(1)).join(', ')}`);
if (h.cusps.length !== 12) { console.log('FALLO cusps != 12'); fallos++; }
if (!(h.ascendant >= 0 && h.ascendant < 360)) { console.log('FALLO ASC fuera de rango'); fallos++; }

// 6. Quirón (asteroide): exige archivo seas_18.se1 (1800-2399)
const qui = swe.calcWithSign(jd, Body.Chiron, { flags: Flag.Speed });
console.log(`  INFO  Quirón: ${qui.sign} ${qui.degreeInSign.toFixed(4)} | efemérides: ${qui.ephemeris}`);
if (qui.ephemeris !== 'swiss') { console.log('FALLO Quirón no usó archivo .se1'); fallos++; }

// 7. Fecha histórica BCE (astrología caldea): 1 Ene 500 a.C. (año astronómico -499)
const jd3 = swe.julianDay(-499, 1, 1, 12);
const sol3 = swe.calcWithSign(jd3, Body.Sun);
console.log(`  INFO  Sol 500 a.C.: ${sol3.sign} ${sol3.degreeInSign.toFixed(4)} | efemérides: ${sol3.ephemeris} | JD: ${jd3.toFixed(2)}`);
if (sol3.ephemeris !== 'swiss') { console.log('FALLO Sol BCE no usó archivo .se1'); fallos++; }

console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
swe.dispose();
process.exit(fallos === 0 ? 0 : 1);
