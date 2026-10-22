// Test del módulo de firdaria: estructura del ciclo, secuencias,
// subperíodos, período activo y secta.
// Uso:  node test-firdaria.mjs   (desde la carpeta carta-natal)
import { readFileSync } from 'node:fs';
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import {
  secuenciaFirdaria, calcularFirdaria, periodoActivo, jdDeFecha,
  TOTAL_FIRDARIA, determinarSecta,
} from './js/firdaria.js';

const corpus = JSON.parse(readFileSync('./datos/firdaria.json', 'utf8'));
const ANIO_DIAS = 365.2425;

let fallos = 0;
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};

// ---------- 1. Corpus ----------
console.log('== Corpus ==');
comprobar('Total del ciclo = 75 años', TOTAL_FIRDARIA === 75);
comprobar('9 períodos en el corpus', corpus.periodos.length === 9);
comprobar('El corpus suma 75', corpus.periodos.reduce((s, p) => s + p.anos, 0) === 75);
comprobar('Todos los períodos con texto', corpus.periodos.every((p) => p.texto && p.texto.length > 0));

// ---------- 2. Secuencias ----------
console.log('\n== Secuencias ==');
const d0 = secuenciaFirdaria('diurna', 0);
const n0 = secuenciaFirdaria('nocturna', 0);
comprobar('Diurna comienza en Sol', d0[0] === 'Sol');
comprobar('Diurna: 2º Venus, 3º Mercurio', d0[1] === 'Venus' && d0[2] === 'Mercurio');
comprobar('Nocturna comienza en Luna', n0[0] === 'Luna');
comprobar('Nocturna: 2º Saturno, 3º Júpiter', n0[1] === 'Saturno' && n0[2] === 'Júpiter');
comprobar('Ambas terminan en Nodo Sur', d0[8] === 'Nodo Sur' && n0[8] === 'Nodo Sur');
const d1 = secuenciaFirdaria('diurna', 1);
comprobar('Ciclo impar: nodos invertidos', d1[7] === 'Nodo Sur' && d1[8] === 'Nodo Norte');
const d2 = secuenciaFirdaria('diurna', 2);
comprobar('Ciclo par: nodos en orden', d2[7] === 'Nodo Norte' && d2[8] === 'Nodo Sur');

// ---------- 3. Cálculo ----------
console.log('\n== Cálculo ==');
const jdNatal = jdDeFecha(1957, 4, 30);
const periodos = calcularFirdaria(jdNatal, 'diurna');
comprobar('2 ciclos → 18 períodos mayores', periodos.length === 18);
comprobar('Períodos consecutivos (fin = inicio siguiente)', periodos.slice(1).every((p, i) => Math.abs(periodos[i].fin - p.inicio) < 0.01));
comprobar('Edades consecutivas', periodos.slice(1).every((p, i) => Math.abs(periodos[i].edadFin - p.edadInicio) < 1e-9));
comprobar('2 ciclos = 150 años exactos', Math.abs((periodos[17].fin - jdNatal) / ANIO_DIAS - 150) < 0.01);
comprobar('Subperíodos suman el período mayor', periodos.every((p) => {
  const suma = p.subperiodos.reduce((s, x) => s + (x.fin - x.inicio), 0);
  return Math.abs(suma - (p.fin - p.inicio)) < 0.01;
}));
comprobar('Primer subperíodo = planeta anfitrión', periodos.every((p) => p.subperiodos[0].planeta === p.planeta));
const pSol = periodos[0];
comprobar('Subperíodo Sol-en-Sol = 10×10/75 años', Math.abs(pSol.subperiodos[0].anos - (10 * 10 / 75)) < 1e-6);

// ---------- 4. Período activo ----------
console.log('\n== Período activo ==');
const p0 = calcularFirdaria(0, 'diurna');
comprobar('A los 5 años → Sol', periodoActivo(5 * ANIO_DIAS, p0).periodo.planeta === 'Sol');
comprobar('A los 10 años → Venus', periodoActivo(10 * ANIO_DIAS + 0.01, p0).periodo.planeta === 'Venus');
comprobar('A los 63 años → Marte', periodoActivo(63 * ANIO_DIAS + 0.01, p0).periodo.planeta === 'Marte');
comprobar('A los 71 años → Nodo Norte', periodoActivo(71 * ANIO_DIAS + 0.01, p0).periodo.planeta === 'Nodo Norte');
comprobar('A los 74 años → Nodo Sur', periodoActivo(74 * ANIO_DIAS + 0.01, p0).periodo.planeta === 'Nodo Sur');
comprobar('A los 76 años → segundo ciclo empieza en Sol', periodoActivo(76 * ANIO_DIAS + 0.01, p0).periodo.planeta === 'Sol');
// Dentro del período de Marte (63-70), el subperíodo de Júpiter va de ~68.41 a ~69.53 años
comprobar('Subperíodo a los 68.5 → Júpiter', periodoActivo((63 + 5.5) * ANIO_DIAS, p0).subperiodo.planeta === 'Júpiter');
comprobar('Subperíodo a los 64 → Sol (2º del orden)', periodoActivo((63 + 1) * ANIO_DIAS, p0).subperiodo.planeta === 'Sol');

// ---------- 5. Secta con carta real (Prueba 1) ----------
console.log('\n== Secta ==');
const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');
const jdN = swe.julianDay(1957, 4, 30, 19 + 23 / 60 - 2);
const casa = swe.houses(jdN, 40.4168, -3.7038, 'P');
const planetas = [['Sol', Body.Sun], ['Luna', Body.Moon]].map(([n, b]) => {
  const p = swe.calcWithSign(jdN, b, { flags: Flag.Speed });
  return { nombre: n, lon: p.longitude };
});
const secta = determinarSecta({ planetas, cusps: casa.cusps });
console.log(`  (Prueba 1 → secta ${secta})`);
comprobar('Secta determinada (diurna o nocturna)', secta === 'diurna' || secta === 'nocturna');
comprobar('Sin Sol → diurna por defecto', determinarSecta({ planetas: [], cusps: casa.cusps }) === 'diurna');
swe.dispose();

console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
process.exit(fallos === 0 ? 0 : 1);