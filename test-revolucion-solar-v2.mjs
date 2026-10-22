// Test v2 — Revolución Solar: cálculo RS + ampliaciones (infortunio, atacires, astrodinas).
// Uso: node test-revolucion-solar-v2.mjs   (desde la carpeta carta-natal)
import { createSwissEph, HouseSystem, Flag, Body, Calendar } from './js/vendor/dist/index.js';
import { calcularRevolucionSolar, calcularAmpliaciones } from './js/revolucion-solar.js';
import { readFileSync } from 'node:fs';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

let fallos = 0;
const chk = (c, m) => { console.log(`${c ? '  OK  ' : 'FALLO '} ${m}`); if (!c) fallos++; };

// Carta de Arturo (datos mínimos compatibles con el módulo)
const jdNatal = swe.julianDay(1957, 4, 30, 19 + 23 / 60 + 23 / 3600 - 1, Calendar.Gregorian); // huso +1
const hN = swe.houses(jdNatal, 40.4167, -3.7, HouseSystem.Placidus);
const CUERPOS = [
  ['Sol', Body.Sun], ['Luna', Body.Moon], ['Mercurio', Body.Mercury], ['Venus', Body.Venus],
  ['Marte', Body.Mars], ['Júpiter', Body.Jupiter], ['Saturno', Body.Saturn], ['Urano', Body.Uranus],
  ['Neptuno', Body.Neptune], ['Plutón', Body.Pluto],
];
const datos = {
  planetas: CUERPOS.map(([nombre, body]) => ({ nombre, lon: swe.calcWithSign(jdNatal, body, { flags: Flag.Speed }).longitude })),
  cusps: hN.cusps, asc: hN.ascendant, mc: hN.midheaven, jd: jdNatal, lat: 40.4167, lon: -3.7,
};

const rs = calcularRevolucionSolar(swe, datos, 2026);
console.log('RS 2026:', rs.fechaTexto, '| ASC:', rs.asc.toFixed(2), rs.ascSigno, '| regente:', rs.regenteAsc, 'casa', rs.regenteCasa);
chk(!!rs, 'retorno calculado');

const corpus = JSON.parse(readFileSync('./datos/revolucion-solar.json', 'utf-8'));
chk(corpus.entradas.length === 128, `corpus: ${corpus.entradas.length} entradas (esperado 128)`);

const amp = calcularAmpliaciones(rs, datos, corpus);
console.log('  infortunio:', amp.infortunio.lon.toFixed(2), '· casa', amp.infortunio.casa, '· días', amp.infortunio.dias);
console.log('  atacires:', amp.atacires.length, '| primeros:', amp.atacires.slice(0, 4).map((a) => `+${Math.round(a.d)}d ${a.txt}`).join(' | '));
console.log('  astrodinas:', amp.astrodinas.suma, '+', amp.astrodinas.sumaPos, '→', amp.astrodinas.banda);
console.log('    aspectos:', amp.astrodinas.aspectos.map((a) => `${a.nombre} ${a.ang}°(${a.val})`).join(', ') || '(ninguno)');
console.log('    posición:', amp.astrodinas.pos.map((a) => `${a.t}(${a.v})`).join('; ') || '(ninguna)');

// comprobaciones
const mv = rs.planetas.find((p) => p.nombre === 'Marte').lon;
const sv = rs.planetas.find((p) => p.nombre === 'Saturno').lon;
const infCalc = ((rs.asc + mv - sv) % 360 + 360) % 360;
chk(Math.abs(infCalc - amp.infortunio.lon) < 1e-9, 'fórmula del Infortunio (Asc + Marte − Saturno)');
chk(amp.infortunio.casa >= 1 && amp.infortunio.casa <= 12, `casa del Infortunio: ${amp.infortunio.casa}`);
chk(amp.atacires.length >= 40, `atacires: ${amp.atacires.length} (≥40)`);
chk(amp.atacires.every((a) => a.d >= 0 && a.d < 360), 'días de atacires en [0, 360)');
chk(amp.atacires.every((a) => /^\d{2}\/\d{2}\/\d{4}$/.test(a.fechaTexto)), 'fechas con formato dd/mm/aaaa');
chk(amp.mAscCasa.length > 0 && amp.mMcCasa.length > 0, 'textos Maciá de superposición presentes');
chk(amp.mRegCasa.length > 0, 'texto Maciá del regente presente');
chk(amp.atacirCasas.length === 12, `textos de atacir por casas: ${amp.atacirCasas.length}`);
chk(amp.atacirGuia.length > 0 && amp.astrodinas.guias.intro.length > 0, 'guías de atacires/astrodinas presentes');
chk(amp.notasFinales.fortuna.length > 0 && amp.notasFinales.relocacion.length > 0, 'fortuna/relocación presentes');
const sumaCheck = amp.astrodinas.aspectos.reduce((s, a) => s + a.val, 0);
chk(sumaCheck === amp.astrodinas.suma, 'suma de astrodinas coherente');

// regresión: primer atacir del ASC = entrada en casa 1 a los 0 días si el ASC es cúspide 1 (RS usa Placidus: cusp1=ASC)
const c1 = amp.atacires.find((a) => a.txt.includes('entra en la casa 1'));
chk(c1 && Math.round(c1.d) === 0, `atacir en casa 1 a +${c1 ? Math.round(c1.d) : '?'} días (esperado 0)`);

console.log(fallos === 0 ? '\nTODO OK' : `\n${fallos} FALLOS`);
process.exit(fallos === 0 ? 0 : 1);
