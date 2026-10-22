// Test del módulo de tránsitos: integridad del corpus + mapeo + cálculo real.
// Uso:  node test-transitos.mjs   (desde la carpeta carta-natal)
import { readFileSync } from 'node:fs';
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { calcularTransitos, detectarCruces, agruparPasos, buscarFechasExactas } from './js/transitos.js';

const corpus = JSON.parse(readFileSync('./datos/transitos.json', 'utf8'));

let fallos = 0;
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};

// ---------- 1. Integridad del corpus ----------
console.log('== Integridad del corpus ==');
comprobar('Total de entradas ≥ 270', corpus.entradas.length >= 270);
comprobar('meta.total coincide', corpus.meta.total === corpus.entradas.length);

const tipos = {};
for (const e of corpus.entradas) tipos[e.tipo] = (tipos[e.tipo] || 0) + 1;
comprobar('Tiene puntos', tipos.punto > 140);
comprobar('Tiene signos (60)', tipos.signo === 60);
comprobar('Tiene casas (57)', tipos.casa === 57);

const sinTexto = corpus.entradas.filter((e) => !e.texto || !e.texto.length || e.texto.some((p) => !p.trim()));
comprobar('Todas las entradas tienen texto', sinTexto.length === 0);

const clavesInvalidas = corpus.entradas.filter((e) => e.tipo === 'punto' && (!e.planeta || !e.punto || !e.aspecto));
comprobar('Puntos con planeta/punto/aspecto completos', clavesInvalidas.length === 0);

// Corpus de redacción propia (saneamiento legal, 2026-08-25)
comprobar('meta declara textos de redacción propia', /redacción propia/i.test(corpus.meta.fuentes || corpus.meta.titulo));
comprobar('meta no cita transcripción de Obelisco como texto', !/reproduce la edición/.test(corpus.meta.fuentes || ''));
const clavesUnicas = new Set(corpus.entradas.map((e) => JSON.stringify(e.tipo === 'punto' ? [e.tipo, e.planeta, e.punto, e.aspecto] : e.tipo === 'signo' ? [e.tipo, e.planeta, e.signo] : [e.tipo, e.planeta, e.casa])));
comprobar('Claves únicas (sin duplicados)', clavesUnicas.size === corpus.entradas.length);
const vaciasTitulo = corpus.entradas.filter((e) => !e.titulo || !e.titulo.trim());
comprobar('Todas las entradas tienen título', vaciasTitulo.length === 0);

// ---------- 2. Mapeo puro (sintético) ----------
console.log('\n== Mapeo puro ==');
const natales = [{ nombre: 'Sol', lon: 100 }, { nombre: 'Ascendente', lon: 10 }, { nombre: 'Saturno', lon: 280 }];

function casos() {
  // Júpiter exactamente conjunto a Sol natal (100°): conjunción se pliega a 'bueno'
  const r1 = calcularTransitos(natales, [{ nombre: 'Júpiter', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
  // Saturno conjunto a Sol natal: conjunción se pliega a 'malo'
  const r2 = calcularTransitos(natales, [{ nombre: 'Saturno', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
  // Neptuno conjunto a Sol natal: conjunción separada
  const r3 = calcularTransitos(natales, [{ nombre: 'Neptuno', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
  // Marte cuadrado a Sol natal (100+90=190): malo directo
  const r4 = calcularTransitos(natales, [{ nombre: 'Marte', lon: 190, retro: false, signo: 'Libra', casa: 1 }], corpus);
  // Venus conjunto a Sol natal (menor): conjunción
  const r5 = calcularTransitos(natales, [{ nombre: 'Venus', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
  // Plutón conjunto a Sol: sin texto en la fuente → no debe aparecer
  const r6 = calcularTransitos(natales, [{ nombre: 'Plutón', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
  return { r1, r2, r3, r4, r5, r6 };
}
const c = casos();

const contacto = (r, nombre, punto) => r.contactos.find((x) => x.transitante.nombre === nombre && x.punto === punto);

comprobar('Júpiter conj. Sol → entrada encontrada (plegada a bueno)', !!contacto(c.r1, 'Júpiter', 'Sol'));
comprobar('Júpiter conj. Sol → texto no vacío', contacto(c.r1, 'Júpiter', 'Sol')?.entrada.texto.length > 0);
comprobar('Saturno conj. Sol → entrada (plegada a malo)', !!contacto(c.r2, 'Saturno', 'Sol'));
comprobar('Neptuno conj. Sol → entrada (conjunción separada)', !!contacto(c.r3, 'Neptuno', 'Sol'));
comprobar('Neptuno conj. Sol → aspecto conjuncion', contacto(c.r3, 'Neptuno', 'Sol')?.entrada.aspecto === 'conjuncion');
comprobar('Marte cuad. Sol → entrada malo', contacto(c.r4, 'Marte', 'Sol')?.entrada.aspecto === 'malo');
comprobar('Venus conj. Sol → entrada menor', !!contacto(c.r5, 'Venus', 'Sol'));
comprobar('Plutón conj. Sol → sin entrada (no se muestra)', !contacto(c.r6, 'Plutón', 'Sol'));

// Un planeta no transita sobre sí mismo
const rAuto = calcularTransitos(natales, [{ nombre: 'Sol', lon: 100, retro: false, signo: 'Cáncer', casa: 1 }], corpus);
comprobar('Un planeta no transita sobre sí mismo', !rAuto.contactos.some((x) => x.punto === 'Sol' && x.transitante.nombre === 'Sol'));

// Signo y casa de los mayores
const rSignoCasa = calcularTransitos(natales, [{ nombre: 'Marte', lon: 100, retro: false, signo: 'Aries', casa: 7 }], corpus);
comprobar('Mayor por signo mapeado', rSignoCasa.porSignoList.some((x) => x.entrada));
comprobar('Mayor por casa mapeado', rSignoCasa.porCasaList.some((x) => x.entrada));

// Aspecto natal de fondo (regla §3.2 de Antarès)
const aspectosNatal = [
  { de: 'Júpiter', a: 'Sol', tipo: 'Trine' },
  { de: 'Saturno', a: 'Sol', tipo: 'Square' },
];
const rFondo = calcularTransitos(natales, [
  { nombre: 'Júpiter', lon: 100, retro: false, signo: 'Cáncer', casa: 1 },
  { nombre: 'Saturno', lon: 100, retro: false, signo: 'Cáncer', casa: 1 },
], corpus, aspectosNatal);
comprobar('Júpiter→Sol con trígono natal: fondo bueno', contacto(rFondo, 'Júpiter', 'Sol')?.fondoNatal === 'bueno');
comprobar('Saturno→Sol con cuadratura natal: fondo malo', contacto(rFondo, 'Saturno', 'Sol')?.fondoNatal === 'malo');
const rAsc = calcularTransitos([{ nombre: 'Ascendente', lon: 10 }], [{ nombre: 'Marte', lon: 10, retro: false, signo: 'Aries', casa: 1 }], corpus, [{ de: 'Marte', a: 'Ascendente', tipo: 'Square' }]);
comprobar('Ángulo (Asc) sin fondo natal (null)', contacto(rAsc, 'Marte', 'Ascendente')?.fondoNatal === null);

// ---------- 3. Cálculo real con Swiss Ephemeris ----------
console.log('\n== Cálculo real (SWE) ==');
const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

const MAPA = { Sol: Body.Sun, Luna: Body.Moon, Mercurio: Body.Mercury, Venus: Body.Venus,
  Marte: Body.Mars, Júpiter: Body.Jupiter, Saturno: Body.Saturn,
  Urano: Body.Uranus, Neptuno: Body.Neptune, Plutón: Body.Pluto };
const NOMBRES = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];

function casaDe(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((lon - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
}

// Carta natal de prueba
const jdNatal = swe.julianDay(1957, 4, 30, 19 + 23 / 60 - 2);
const casaNatal = swe.houses(jdNatal, 40.4168, -3.7038, 'P');
const natalesReales = [
  { nombre: 'Ascendente', lon: casaNatal.ascendant },
  { nombre: 'Medio Cielo', lon: casaNatal.midheaven },
];
for (const n of NOMBRES) {
  const p = swe.calcWithSign(jdNatal, MAPA[n], { flags: Flag.Speed });
  natalesReales.push({ nombre: n, lon: p.longitude });
}

// Tránsitos a dos fechas: 1960 (ejemplo del libro Saturno-Mercurio) y 2026-08-22
const fechas = [
  ['1960-02-25', 1960, 2, 25],
  ['2026-08-22', 2026, 8, 22],
];
for (const [etiqueta, y, m, d] of fechas) {
  const jd = swe.julianDay(y, m, d, 12);
  const transitos = NOMBRES.map((n) => {
    const p = swe.calcWithSign(jd, MAPA[n], { flags: Flag.Speed });
    const lon = p.longitude;
    return { nombre: n, lon, retro: p.retrograde, signo: '', casa: casaDe(lon, casaNatal.cusps) };
  });
  const res = calcularTransitos(natalesReales, transitos, corpus);
  console.log(`  ${etiqueta}: ${res.contactos.length} contactos activos`);
  comprobar(`${etiqueta}: hay contactos`, res.contactos.length > 0);
  comprobar(`${etiqueta}: contactos con texto`, res.contactos.every((x) => x.entrada && x.entrada.texto.length > 0));
  comprobar(`${etiqueta}: mayores por casa mapeados`, res.porCasaList.length > 0);
}

// ---------- 4. Fechas exactas / doble y triple paso ----------
console.log('\n== Fechas exactas y triple paso ==');

// Serie sintética con triple paso: directo (cruza en jd=5), retrógrado
// (cruza en jd≈13.33) y directo de nuevo (cruza en jd≈26.67).
const serieTriple = [];
for (let jd = 0; jd <= 30; jd++) {
  let lon;
  if (jd <= 10) lon = 95 + jd;                    // directo
  else if (jd <= 20) lon = 105 - 1.5 * (jd - 10); // retrógrado
  else lon = 90 + 1.5 * (jd - 20);                // directo
  serieTriple.push({ jd, lon });
}
const crucesT = detectarCruces(serieTriple, 100, 0);
comprobar('Triple paso sintético: 3 cruces', crucesT.length === 3);
comprobar('Cruce 1 en jd≈5', Math.abs(crucesT[0]?.jd - 5) < 0.05);
comprobar('Cruce 2 (retrógrado) en jd≈13.33', Math.abs(crucesT[1]?.jd - 13.333) < 0.05);
comprobar('Cruce 3 en jd≈26.67', Math.abs(crucesT[2]?.jd - 26.667) < 0.05);

const eventosTriple = crucesT.map((c, i) => ({
  planeta: 'Marte', glifo: '♂', punto: 'Sol', aspecto: 'Conjunción', ang: 0,
  jd: c.jd, retro: i === 1,
}));
const agrupados1 = agruparPasos(eventosTriple);
comprobar('Agrupa los 3 pasos en un ciclo', new Set(agrupados1.map((e) => e.grupo)).size === 1);
comprobar('El ciclo se etiqueta triple', agrupados1[0].tipo === 'triple');
comprobar('El paso central es retrógrado', agrupados1[1].retro === true);

const eventosDoble = [
  { planeta: 'Saturno', glifo: '♄', punto: 'Luna', aspecto: 'Oposición', ang: 180, jd: 100, retro: false },
  { planeta: 'Saturno', glifo: '♄', punto: 'Luna', aspecto: 'Oposición', ang: 180, jd: 140, retro: true },
  { planeta: 'Saturno', glifo: '♄', punto: 'Luna', aspecto: 'Oposición', ang: 180, jd: 600, retro: false },
];
const agrupados2 = agruparPasos(eventosDoble);
const tipos2 = [...new Set(agrupados2.map((e) => e.tipo))].sort().join(',');
comprobar('Doble paso + ciclo aparte', tipos2 === 'doble,simple');
comprobar('Ventana separa ciclos lejanos', new Set(agrupados2.map((e) => e.grupo)).size === 2);

// Integración astronómica real: barrido de 50 días en 1960.
const jdIni = swe.julianDay(1960, 3, 1, 12);
const jdFin = swe.julianDay(1960, 4, 20, 12);
const eventosReales = await buscarFechasExactas(swe, natalesReales, jdIni, jdFin);
comprobar('Barrido real 1960: hay cruces', eventosReales.length > 0);
comprobar('Barrido real: fechas dentro de la ventana', eventosReales.every((e) => e.jd >= jdIni - 0.01 && e.jd <= jdFin + 0.01));
comprobar('Barrido real: aspectos válidos', eventosReales.every((e) => ['Conjunción', 'Sextil', 'Cuadratura', 'Trígono', 'Oposición'].includes(e.aspecto)));
comprobar('Barrido real: tipo de paso asignado', eventosReales.every((e) => ['simple', 'doble', 'triple'].includes(e.tipo)));
console.log(`  (barrido 1960-03-01 → 04-20: ${eventosReales.length} cruces, ${eventosReales.filter((e) => e.tipo === 'triple').length} triples, ${eventosReales.filter((e) => e.tipo === 'doble').length} dobles)`);

swe.dispose();
console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
process.exit(fallos === 0 ? 0 : 1);
