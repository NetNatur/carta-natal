// calc-misterio.mjs v5 - verificacion final cuspides + filas de referencia
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');
const norm = (d) => ((d % 360) + 360) % 360;

const jd = swe.julianDay(2025, 1, 1, 12.0); // London default 51.5, -0.1667
const h = swe.houses(jd, 51.5, -0.1667, 'P');
console.log('=== cuspides Placidus de la carta default (Londres 1-1-2025 12:00 UT) ===');
for (let i = 0; i < 12; i++) {
  console.log(`  c${i + 1} = ${norm(h.cusps[i]).toFixed(2)}  (signo ${Math.floor(norm(h.cusps[i]) / 30) + 1})`);
}
console.log('  Motor dice: c11->299? c12->328? c2->62? c3->82?');
console.log(`  c11=${norm(h.cusps[10]).toFixed(2)} c12=${norm(h.cusps[11]).toFixed(2)} c2=${norm(h.cusps[1]).toFixed(2)} c3=${norm(h.cusps[2]).toFixed(2)}`);
