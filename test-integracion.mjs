// Prueba integral: calcula una carta real con Swiss Ephemeris (Node) y
// cruza las configuraciones con el recetario web.
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { findAspects, TRADITIONAL_MOIETIES } from './js/vendor/dist/derived/aspects.js';
import { NodeFsEphemeris } from './js/vendor/dist/ephemeris/sources.js';
import { construirLista, PARTICIPANTES_ASPECTO } from './js/interpretacion.js';
import { readFileSync } from 'fs';

const rec = JSON.parse(readFileSync('datos/recetario.json', 'utf8'));
const swe = await createSwissEph();
const jd = swe.julianDay(1990, 8, 12, 12 - 1); // Madrid 12/08/1990 12:00 local (UTC+1, sin DST en agosto? con DST sí: UTC+2)
// Mejor usar hora UT directa para no depender de DST:
const jd2 = swe.julianDay(1990, 8, 12, 10.0); // 10:00 UT = 12:00 CEST
const casa = swe.houses(jd2, 40.4168, -3.7038, 'P');

const CUERPOS = [
  [Body.Sun, 'Sol'], [Body.Moon, 'Luna'], [Body.Mercury, 'Mercurio'],
  [Body.Venus, 'Venus'], [Body.Mars, 'Marte'], [Body.Jupiter, 'Júpiter'],
  [Body.Saturno = Body.Saturn, 'Saturno'], [Body.Uranus, 'Urano'],
  [Body.Neptune, 'Neptuno'], [Body.Pluto, 'Plutón'], [Body.TrueNode, 'Nodo Norte'],
];
const planetas = [];
for (const [body, nombre] of CUERPOS) {
  const p = swe.calcWithSign(jd2, body, { flags: Flag.Speed });
  planetas.push({ nombre, lon: p.longitude, speed: p.longitudeSpeed });
}

// Fortuna (día): ASC + Luna - Sol
const sol = planetas.find(p => p.nombre === 'Sol').lon;
const luna = planetas.find(p => p.nombre === 'Luna').lon;
const fortuna = (casa.ascendant + luna - sol + 360) % 360;

// Aspectos extendidos
const puntosExt = planetas
  .filter((p) => PARTICIPANTES_ASPECTO.includes(p.nombre))
  .map((p) => ({ name: p.nombre, longitude: p.lon, body: null, speed: p.speed }));
puntosExt.push({ name: 'Ascendente', longitude: casa.ascendant, body: null, speed: 0 });
puntosExt.push({ name: 'Medio Cielo', longitude: casa.midheaven, body: null, speed: 0 });
puntosExt.push({ name: 'Parte Fortuna', longitude: fortuna, body: null, speed: 0 });
const aspectosExt = findAspects(puntosExt, { orbs: TRADITIONAL_MOIETIES });

const datos = { planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven, fortuna, aspectosExt };
const items = construirLista(datos, rec);
console.log('=== CARTA REAL 12/08/1990 10:00 UT Madrid ===');
console.log('ASC:', casa.ascendant.toFixed(2), 'MC:', casa.midheaven.toFixed(2), 'Fortuna:', fortuna.toFixed(2));
console.log('Configs totales:', items.length);
const porTipo = {};
for (const it of items) porTipo[it.tipo] = (porTipo[it.tipo] || 0) + 1;
console.log('Por tipo:', JSON.stringify(porTipo));
console.log();
console.log('--- ASPECTOS detectados (todos) ---');
for (const a of aspectosExt) console.log(`  ${a.from.name} ${a.aspect.name} ${a.to.name} (orb ${a.orb.toFixed(2)})`);
console.log();
console.log('--- Aspectos con receta ---');
for (const it of items.filter(i => i.tipo === 'aspecto')) console.log('  ', it.config);
console.log();
console.log('--- Muestra de recetas (personalidad) ---');
for (const it of items.filter(i => i.recetas.personalidad).slice(0, 5)) {
  console.log(`[${it.config}] ${it.recetas.personalidad}`);
}
