// Verificacion v2: alcocoden + terminos + divisores para cartas concretas.
// Uso: node verif-v2-arturo.mjs
import { createSwissEph, Body } from './js/vendor/dist/index.js';
import { determinarSecta } from './js/firdaria.js';
import { hyleg, alcocoden, ANIOS_MAYORES } from './js/fichas-tema.js';
import { terminoDe } from './js/terminos.js';
import { duracionVida } from './js/divisores.js';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

const CASOS = [
  { nombre: 'Arturo', y: 1957, m: 4, d: 30, h: 19 + 23 / 60, tz: 1, lat: 40.4, lon: -3.7 },
  { nombre: 'Miguel', y: 1952, m: 11, d: 27, h: 17 + 10 / 60, tz: 1, lat: 38.1, lon: -0.95 },
  { nombre: 'Diana(control)', y: 1961, m: 7, d: 1, h: 19.75, tz: 1, lat: 52.833, lon: 0.5 },
];

for (const c of CASOS) {
  for (const [tipo, nodeBody] of [['verdadero', Body.TrueNode], ['medio', Body.MeanNode]]) {
    const jd = swe.julianDay(c.y, c.m, c.d, c.h - c.tz);
    const cuerpos = [['Sol', Body.Sun], ['Luna', Body.Moon], ['Mercurio', Body.Mercury], ['Venus', Body.Venus],
                     ['Marte', Body.Mars], ['J\u00fapiter', Body.Jupiter], ['Saturno', Body.Saturn], ['Nodo Norte', nodeBody]];
    const planetas = cuerpos.map(([nombre, body]) => ({ nombre, lon: swe.calcWithSign(jd, body).longitude }));
    const hs = swe.houses(jd, c.lat, c.lon, 'P');
    const datos = { jd, lat: c.lat, lon: c.lon, planetas, cusps: hs.cusps, asc: hs.ascendant, mc: hs.midheaven };
    const diurno = determinarSecta(datos) === 'diurna';
    const hg = hyleg(datos, diurno);
    console.log(`\n### ${c.nombre} | nodo ${tipo} | ${diurno ? 'diurna' : 'nocturna'} | hileg: ${hg.nombre} ${hg.lon.toFixed(4)}`);
    const al = alcocoden(hg.lon, planetas, diurno);
    if (al) {
      const t = al.termino;
      console.log(`  ALCOCODEN: ${al.nombre} (${al.pts} pts) | anios mayores: ${ANIOS_MAYORES[al.nombre]}`);
      console.log(`  Termino del hileg: ${t.planeta} ${t.inicio}-${t.fin} de ${t.signo}`);
    }
    const dv = duracionVida(datos, hg.lon);
    console.log('  Candidatos:');
    for (const x of dv.candidatos) console.log(`    ${x.planeta} (${x.tipo}): ${x.arco.toFixed(2)}`);
    console.log(`  ANARETA: ${dv.anareta.planeta} a ${dv.anios.toFixed(2)} | divisores (${dv.divisores.length}):`);
    for (const s of dv.divisores) console.log(`    ${s.planeta} ${s.desde.toFixed(1)}-${s.hasta.toFixed(1)} ${s.signo}${s.participantes ? ' -- participa: ' + s.participantes.join(', ') : ''}`);
  }
}
swe.dispose();
