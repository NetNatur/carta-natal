// Test del módulo de revolución solar: retorno del Sol + carta de la RS.
// Uso:  node test-revolucion-solar.mjs   (desde la carpeta carta-natal)
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { readFileSync } from 'node:fs';
import { encontrarRetornoSolar, calcularRevolucionSolar, zonaTransicion } from './js/revolucion-solar.js';

let fallos = 0;
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};
const norm = (x) => (((x % 360) + 360) % 360);
const dist = (a, b) => Math.abs(norm(a - b) > 180 ? norm(a - b) - 360 : norm(a - b));

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

// Carta natal de prueba: 30/04/1957 19:23 Madrid (UTC+2)
const jdNatal = swe.julianDay(1957, 4, 30, 19 + 23 / 60 - 2);
const MAPA = { Sol: Body.Sun, Luna: Body.Moon, Mercurio: Body.Mercury, Venus: Body.Venus, Marte: Body.Mars, Júpiter: Body.Jupiter, Saturno: Body.Saturn, Urano: Body.Uranus, Neptuno: Body.Neptune, Plutón: Body.Pluto };
const planetas = Object.entries(MAPA).map(([nombre, body]) => {
  const p = swe.calcWithSign(jdNatal, body, { flags: Flag.Speed });
  return { nombre, lon: p.longitude };
});
const solNatal = planetas.find((p) => p.nombre === 'Sol').lon;
const casa = swe.houses(jdNatal, 40.4168, -3.7038, 'P');
const datos = { jd: jdNatal, lat: 40.4168, lon: -3.7038, planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven };

console.log(`== Retorno solar (Sol natal = ${solNatal.toFixed(4)}° ≈ ${(solNatal / 30).toFixed(1)} de signo) ==`);

// 1. El retorno coincide con la longitud natal del Sol
for (const anio of [1960, 2000, 2026]) {
  const jdRet = encontrarRetornoSolar(swe, solNatal, anio, jdNatal);
  const sunRet = swe.calcWithSign(jdRet, Body.Sun, { flags: Flag.Speed }).longitude;
  const d = dist(sunRet, solNatal);
  comprobar(`Año ${anio}: Sol del retorno ≈ natal (Δ=${d.toFixed(4)}°)`, d < 0.001);

  // El retorno cae dentro del año pedido
  const jdInicio = swe.julianDay(anio, 1, 1, 0);
  const jdFin = swe.julianDay(anio + 1, 1, 1, 0);
  comprobar(`Año ${anio}: retorno dentro del año`, jdRet >= jdInicio && jdRet < jdFin);
}

// 2. Carta de la RS completa
const rs = calcularRevolucionSolar(swe, datos, 2026);
comprobar('RS 2026: 10 planetas', rs.planetas.length === 10);
comprobar('RS 2026: ASC y MC finitos', Number.isFinite(rs.asc) && Number.isFinite(rs.mc));
comprobar('RS 2026: regente del Ascendente', !!rs.regenteAsc);
comprobar('RS 2026: casa del regente válida (1-12)', rs.regenteCasa >= 1 && rs.regenteCasa <= 12);
comprobar('RS 2026: signo del regente definido', !!rs.regenteSigno);
comprobar('RS 2026: casa natal del MC válida (1-12)', rs.mcCasaNatal >= 1 && rs.mcCasaNatal <= 12);
comprobar('RS 2026: 12 superposiciones', rs.superposiciones.length === 12);
comprobar('RS 2026: superposiciones válidas', rs.superposiciones.every((s) => s.anual >= 1 && s.anual <= 12 && s.natal >= 1 && s.natal <= 12));
comprobar('RS 2026: Sol en casa válida (1-12)', rs.solCasa >= 1 && rs.solCasa <= 12);
comprobar('RS 2026: ASC superpuesto a casa natal (1-12)', rs.ascCasaNatal >= 1 && rs.ascCasaNatal <= 12);
comprobar('RS 2026: fecha en formato dd/mm/aaaa', /^\d{2}\/\d{2}\/\d{4}/.test(rs.fechaTexto));

// El Sol de la RS debe estar en la misma casa que... (solo comprobamos coherencia)
const solRs = rs.planetas.find((p) => p.nombre === 'Sol');
comprobar('RS 2026: Sol en la misma posición que natal', dist(solRs.lon, solNatal) < 0.001);
comprobar('RS 2026: solCasa coincide con casa del Sol', rs.solCasa === solRs.casa);

// 3. Lugar de cálculo: por defecto natal, y reubicable
comprobar('RS 2026: usa lugar natal por defecto', Math.abs(rs.lat - 40.4168) < 1e-6 && Math.abs(rs.lon - (-3.7038)) < 1e-6);
const rsNY = calcularRevolucionSolar(swe, datos, 2026, 40.7128, -74.0060);
comprobar('RS 2026: reubicada a Nueva York', Math.abs(rsNY.lat - 40.7128) < 1e-6 && Math.abs(rsNY.lon - (-74.0060)) < 1e-6);
comprobar('RS 2026: la reubicación cambia el Ascendente', Math.abs(rsNY.asc - rs.asc) > 0.01);

// 4. Zonas de transición (detalle fino; aplicable a sinastría)
console.log('\n== Zonas de transición ==');
// Cúspides sintéticas cada 30° (casa 1 desde Aries 10°): 10, 40, 70, ...
const cuspsSin = [10, 40, 70, 100, 130, 160, 190, 220, 250, 280, 310, 340];
const zMedio = zonaTransicion(25, cuspsSin); // Aries 25°: centrado en casa 1
comprobar('Punto centrado: casa correcta', zMedio.casa === 1);
comprobar('Punto centrado: sin transición', zMedio.enTransicion === false);
const zEntrada = zonaTransicion(11, cuspsSin); // Aries 11°: a 1° del inicio de la casa 1
comprobar('Punto a 1° de la entrada: transición', zEntrada.enTransicion === true);
comprobar('Punto a 1° de la entrada: complementaria casa 12', zEntrada.casaComplementaria === 12);
const zSalida = zonaTransicion(9.5, cuspsSin); // Aries 9°30': en casa 12, a 0.5° de la cúspide 1
comprobar('Punto a 0.5° de la salida: transición', zSalida.enTransicion === true);
comprobar('Punto a 0.5° de la salida: complementaria casa 1', zSalida.casaComplementaria === 1);
const zSaliendo = zonaTransicion(39.5, cuspsSin); // Tauro 9°30': en casa 1, a 0.5° de la cúspide 2
comprobar('Saliendo hacia casa 2: complementaria casa 2', zSaliendo.casaComplementaria === 2);
// Bordes de signo
const zBordeSalida = zonaTransicion(29.9, cuspsSin); // Aries 29°54' → saliendo hacia Tauro
comprobar('29°54′: borde de signo', zBordeSalida.enBordeSigno === true);
comprobar('29°54′: complementario Tauro', zBordeSalida.signoComplementario === 'Tauro');
const zBordeEntrada = zonaTransicion(0.2, cuspsSin); // Aries 0°12' → entrando desde Piscis
comprobar('0°12′: borde de signo', zBordeEntrada.enBordeSigno === true);
comprobar('0°12′: complementario Piscis', zBordeEntrada.signoComplementario === 'Piscis');

// Caso real (espejo del caso de Arturo): en la Prueba 1, el ASC de la RS 2026
// cae a 1.75° de la cúspide 10 natal (MC Cáncer 23°34′) pero en casa 10.
comprobar('RS 2026 (Prueba 1): ASC en zona de transición', rs.ascZona?.enTransicion === true);
comprobar('RS 2026 (Prueba 1): complementaria casa 9', rs.ascZona?.casaComplementaria === 9);
comprobar('RS 2026 (Prueba 1): orbe a cúspide ≤ 2°', Math.min(rs.ascZona.distEntrada, rs.ascZona.distSalida) <= 2);
comprobar('RS 2026 (Prueba 1): MC con zona calculada', !!rs.mcZona && typeof rs.mcZona.casa === 'number');
comprobar('RS 2026 (Prueba 1): planetas con zona natal', rs.planetas.every((p) => p.zonaNatal && typeof p.zonaNatal.casa === 'number'));

// 5. Corpus Volguine (redacción propia, mismas claves que el original)
console.log('\n== Corpus Volguine ==');
const corpusV = JSON.parse(readFileSync('./datos/volguine.json', 'utf8'));
const tiposV = {};
for (const e of corpusV.entradas) tiposV[e.tipo] = (tiposV[e.tipo] || 0) + 1;
const esperadoV = { 'asc-casa-natal': 12, 'mc-casa-natal': 12, 'asc-signo': 12, superposicion: 114, 'planeta-casa': 120 };
comprobar('Volguine: 270 entradas', corpusV.entradas.length === 270);
comprobar('Volguine: tipos exactos', JSON.stringify(tiposV) === JSON.stringify(esperadoV));
comprobar('Volguine: sin entradas vacías', corpusV.entradas.every((e) => e.texto && e.texto.length && e.texto.every((p) => p.trim())));
comprobar('Volguine: meta declara redacción propia', /redacción propia/i.test(corpusV.meta.fuentes || ''));

swe.dispose();
console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
process.exit(fallos === 0 ? 0 : 1);
