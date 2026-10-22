// Verifica las dos cartas de prueba de Arturo (Madrid) con la nueva
// separación de regencias (casas/ángulos vs cuerpos) y la casa del regente.
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { findAspects, TRADITIONAL_MOIETIES } from './js/vendor/dist/derived/aspects.js';
import { construirLista, PARTICIPANTES_ASPECTO } from './js/interpretacion.js';
import { readFileSync } from 'fs';

const rec = JSON.parse(readFileSync('datos/recetario.json', 'utf8'));
const swe = await createSwissEph();

function casaDe(longitud, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((longitud - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
}

const cartas = [
  { nombre: 'Prueba 1 — 30/04/1957 19:23', anio: 1957, mes: 4, dia: 30, horaLocal: 19 + 23 / 60, utc: 2 },
  { nombre: 'Prueba 2 — 07/03/1958 06:58', anio: 1958, mes: 3, dia: 7, horaLocal: 6 + 58 / 60, utc: 1 },
];

for (const c of cartas) {
  const jd = swe.julianDay(c.anio, c.mes, c.dia, c.horaLocal - c.utc);
  const casa = swe.houses(jd, 40.4168, -3.7038, 'P');
  const CUERPOS = [
    [Body.Sun, 'Sol'], [Body.Moon, 'Luna'], [Body.Mercury, 'Mercurio'],
    [Body.Venus, 'Venus'], [Body.Mars, 'Marte'], [Body.Jupiter, 'Júpiter'],
    [Body.Saturn, 'Saturno'], [Body.Uranus, 'Urano'],
    [Body.Neptune, 'Neptuno'], [Body.Pluto, 'Plutón'], [Body.TrueNode, 'Nodo Norte'],
  ];
  const planetas = [];
  for (const [body, nombre] of CUERPOS) {
    const p = swe.calcWithSign(jd, body, { flags: Flag.Speed });
    planetas.push({ nombre, lon: p.longitude, speed: p.longitudeSpeed, casa: casaDe(p.longitude, casa.cusps) });
  }
  const sol = planetas.find(p => p.nombre === 'Sol').lon;
  const luna = planetas.find(p => p.nombre === 'Luna').lon;
  const desdeAsc = ((sol - casa.ascendant + 360) % 360);
  const fortuna = (desdeAsc < 180)
    ? (casa.ascendant + sol - luna + 360) % 360
    : (casa.ascendant + luna - sol + 360) % 360;
  const puntosExt = planetas
    .filter((p) => PARTICIPANTES_ASPECTO.includes(p.nombre))
    .map((p) => ({ name: p.nombre, longitude: p.lon, body: null, speed: p.speed }));
  puntosExt.push({ name: 'Ascendente', longitude: casa.ascendant, body: null, speed: 0 });
  puntosExt.push({ name: 'Medio Cielo', longitude: casa.midheaven, body: null, speed: 0 });
  puntosExt.push({ name: 'Parte Fortuna', longitude: fortuna, body: null, speed: 0 });
  const aspectosExt = findAspects(puntosExt, { orbs: TRADITIONAL_MOIETIES });
  const datos = { planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven, fortuna, aspectosExt };
  const items = construirLista(datos, rec);
  console.log('==========================================');
  console.log(c.nombre);
  console.log('Configs:', items.length, '| Por tipo:',
    JSON.stringify(items.reduce((a, i) => (a[i.tipo] = (a[i.tipo] || 0) + 1, a), {})));
  console.log('--- REGENTES DE CASAS Y ÁNGULOS ---');
  for (const it of items.filter(i => i.tipo === 'regencia_casa')) {
    console.log(`  ${it.config}${it.casaRegente ? `  [regente en casa ${it.casaRegente}]` : ''}`);
  }
  console.log('--- REGENTES DE CUERPOS ---');
  for (const it of items.filter(i => i.tipo === 'regencia_cuerpo')) {
    console.log(`  ${it.config}${it.casaRegente ? `  [regente en casa ${it.casaRegente}]` : ''}`);
  }
}
