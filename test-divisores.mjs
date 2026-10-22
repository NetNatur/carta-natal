// Test de divisores de términos y anareta (Aben Ragel VI).
// Uso: node test-divisores.mjs
import { duracionVida, divisoresDeArco, candidatosAnareta, arcoAAspecto } from './js/divisores.js';
import { TERMINOS_EGIPCIOS, terminoDe } from './js/terminos.js';

let fallos = 0;
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};

// ---------- 1. Consistencia de la tabla local con terminos.js ----------
console.log('== Consistencia de tablas ==');
comprobar('12 signos en la tabla local', Object.keys(TERMINOS_EGIPCIOS).length === 12);
let consistentes = true;
for (const signo of Object.keys(TERMINOS_EGIPCIOS)) {
  const a = JSON.stringify(TERMINOS_EGIPCIOS[signo]);
  // terminos.js ordena igual: comparamos vía terminoDe en 5 puntos
  const tabla = TERMINOS_EGIPCIOS[signo];
  let idx = 0;
  for (const [planeta, tam] of tabla) {
    const medio = idx + tam / 2;
    if (terminoDe(Object.keys(TERMINOS_EGIPCIOS).indexOf(signo) * 30 + medio).planeta !== planeta) consistentes = false;
    idx += tam;
  }
}
comprobar('regentes de término coinciden con terminos.js', consistentes);

// ---------- 2. arcoAAspecto: geometría ----------
console.log('== arcoAAspecto ==');
// hyleg en 0° Aries, planeta en 180° (Libra 0°): cuadratura delante en 90°; oposición en 360°
comprobar('cuadratura: arco 90', arcoAAspecto(0, 180, [90]) === 90);
comprobar('oposición con el planeta en el punto de oposición exacta: arco 360 (vuelta completa)', arcoAAspecto(0, 180, [180]) === 360);
comprobar('conjunción delante: arco 100', arcoAAspecto(0, 100, [0]) === 100);
// planeta detrás (280°): cuadratura siguiente en 280+90=370 → 10°
comprobar('cuadratura al planeta detrás: arco 10', arcoAAspecto(0, 280, [90]) === 10);
// oposición delante: planeta en 170° → posDir 350
comprobar('oposición delante: arco 350', arcoAAspecto(0, 170, [180]) === 350);

// ---------- 3. divisoresDeArco: cobertura y regentes ----------
console.log('== divisoresDeArco ==');
const secciones = divisoresDeArco(99.07, 60, [
  { nombre: 'Sol', lon: 99.07 }, { nombre: 'Luna', lon: 229.7 }, { nombre: 'Marte', lon: 150 },
  { nombre: 'Saturno', lon: 290 }, { nombre: 'Júpiter', lon: 60 },
]);
const suma = secciones.reduce((s, x) => s + (x.hasta - x.desde), 0);
comprobar(`cobertura completa del arco (${suma.toFixed(2)} de 60)`, Math.abs(suma - 60) < 0.01);
let sinSolapes = true;
for (let i = 1; i < secciones.length; i++) {
  if (secciones[i].desde !== secciones[i - 1].hasta) sinSolapes = false;
}
comprobar('secciones contiguas sin solapes', sinSolapes);
let regentesOK = true;
for (const s of secciones) {
  const lonMedio = s.desde + (s.hasta - s.desde) / 2;
  // el regente debe coincidir con terminoDe aplicado al arco absoluto (hyleg 99.07)
  if (terminoDe(99.07 + lonMedio).planeta !== s.planeta) regentesOK = false;
}
comprobar('regentes de sección = terminoDe del punto medio', regentesOK);
comprobar('participantes por cuerpo/rayos presentes', secciones.some((s) => s.participantes));

// ---------- 4. candidatosAnareta: doctrina ----------
console.log('== candidatosAnareta ==');
// Hyleg Cáncer 9° (99.07), Marte en Libra 9° (189): oposición → arco 180 - 90 = 90? t = norm(189+180-99.07)=269.93; t2 = norm(189-180-99.07)=269.93 → 269.93?? no:
// 189 - 99.07 = 89.93: cuadratura ya casi exacta detrás; delante: 90+... la cuadratura delante está en 99.07+ (189+90-99.07)=179.93
const datosSint = {
  planetas: [
    { nombre: 'Sol', lon: 30 }, { nombre: 'Luna', lon: 130 }, { nombre: 'Marte', lon: 189 },
    { nombre: 'Saturno', lon: 290 }, { nombre: 'Nodo Norte', lon: 220 },
  ],
  cusps: [99.07, 120, 150, 170, 190, 210, 230, 250, 270, 290, 310, 330],
};
const cands = candidatosAnareta(datosSint, 99.07);
comprobar('hay candidatos anareta', cands.length > 0);
comprobar('ordenado por arco', cands.every((x, i) => i === 0 || cands[i - 1].arco <= x.arco));
const marteAspecto = cands.find((x) => x.planeta === 'Marte' && x.tipo === 'maléfico aspectando al hileg');
comprobar('Marte: primer aspecto destructivo = conjunción a los 89.93 años', marteAspecto && Math.abs(marteAspecto.arco - 89.93) < 0.1);

// ---------- 5. Los 7 casos reales: anareta completo vs muerte real ----------
console.log('== 7 casos reales (anareta completo) ==');
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { determinarSecta } from './js/firdaria.js';
import { hyleg } from './js/fichas-tema.js';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');
const CUERPOS = [
  ['Sol', Body.Sun], ['Luna', Body.Moon], ['Mercurio', Body.Mercury], ['Venus', Body.Venus],
  ['Marte', Body.Mars], ['Júpiter', Body.Jupiter], ['Saturno', Body.Saturn],
  ['Urano', Body.Uranus], ['Neptuno', Body.Neptune], ['Plutón', Body.Pluto],
  ['Nodo Norte', Body.MeanNode !== undefined ? Body.MeanNode : null],
].filter(([, b]) => b !== null);

const CASOS = [
  { nombre: 'Diana', natal: { y: 1961, m: 7, d: 1, h: 19.75, tz: 1, lat: 52.833, lon: 0.5 }, muerte: { y: 1997, m: 8, d: 31 }, real: 36.2 },
  { nombre: 'Eduardo VIII', natal: { y: 1894, m: 6, d: 23, h: 21.9167, tz: 0, lat: 51.445, lon: -0.2647 }, muerte: { y: 1972, m: 5, d: 28 }, real: 77.9 },
  { nombre: 'María Antonieta', natal: { y: 1755, m: 11, d: 2, h: 19.5, tz: 1.0915, lat: 48.2167, lon: 16.373 }, muerte: { y: 1793, m: 10, d: 16 }, real: 38.0 },
  { nombre: 'Jorge VI', natal: { y: 1895, m: 12, d: 14, h: 3.0833, tz: 0, lat: 52.833, lon: 0.5 }, muerte: { y: 1952, m: 2, d: 6 }, real: 56.1 },
  { nombre: 'Harald V', natal: { y: 1937, m: 2, d: 21, h: 12.75, tz: 1, lat: 59.85, lon: 10.5 }, muerte: { y: 2026, m: 8, d: 28 }, real: 89.5 },
  { nombre: 'Alfonso XIII', natal: { y: 1886, m: 5, d: 17, h: 12.5, tz: -3.7 / 15, lat: 40.4168, lon: -3.7038 }, muerte: { y: 1941, m: 2, d: 28 }, real: 54.8 },
  { nombre: 'Carlos IV', natal: { y: 1748, m: 11, d: 11, h: 3.0, tz: 14.25 / 15, lat: 40.8518, lon: 14.2486 }, muerte: { y: 1819, m: 1, d: 20 }, real: 70.2 },
];
for (const c of CASOS) {
  const jdN = swe.julianDay(c.natal.y, c.natal.m, c.natal.d, c.natal.h - c.natal.tz);
  const planetas = CUERPOS.map(([nombre, body]) => ({ nombre, lon: swe.calcWithSign(jdN, body).longitude }));
  const h = swe.houses(jdN, c.natal.lat, c.natal.lon, 'P');
  const datos = { jd: jdN, lat: c.natal.lat, lon: c.natal.lon, planetas, cusps: h.cusps, asc: h.ascendant, mc: h.midheaven };
  const diurno = determinarSecta(datos) === 'diurna';
  const hg = hyleg(datos, diurno);
  const dv = duracionVida(datos, hg.lon);
  const previsto = dv.anios !== null ? dv.anios.toFixed(1) : '—';
  const error = dv.anios !== null ? (dv.anios - c.real).toFixed(1) : '—';
  console.log(`  ${c.nombre}: hyleg ${hg.nombre} · anareta ${dv.anareta.planeta} (${dv.anareta.tipo}) → ${previsto} años · real ${c.real} · Δ ${error}`);
  // el divisor vigente en la muerte real
  const vigente = dv.divisores.find((s) => c.real >= s.desde && c.real < s.hasta);
  if (vigente) console.log(`    divisor vigente en la muerte real: ${vigente.planeta} (${vigente.desde.toFixed(0)}–${vigente.hasta.toFixed(0)} años)`);
  else console.log('    sin divisor vigente en la muerte real (fuera del arco)');
}
swe.dispose();

console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
process.exit(fallos === 0 ? 0 : 1);