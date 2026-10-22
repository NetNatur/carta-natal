// Duración de vida prevista por los métodos clásicos (hyleg / alcocoden /
// arco al anareta) vs fecha real de fallecimiento, para los 7 casos de casas
// reales. La prospectiva del día de la muerte (firdaria + atacires) se resume
// de la misma lógica que calcular-casos.mjs.
// Uso: node duracion-vida.mjs
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { calcularFirdaria, periodoActivo, determinarSecta } from './js/firdaria.js';
import { hyleg, alcocoden, ANIOS_MAYORES } from './js/fichas-tema.js';
import { duracionVida } from './js/divisores.js';
import { writeFileSync } from 'node:fs';

// Nota: ANIOS_MAYORES se importa de fichas-tema.js (fuente única de la tabla).

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

const CUERPOS = [
  ['Sol', Body.Sun], ['Luna', Body.Moon], ['Mercurio', Body.Mercury], ['Venus', Body.Venus],
  ['Marte', Body.Mars], ['Júpiter', Body.Jupiter], ['Saturno', Body.Saturn],
  ['Urano', Body.Uranus], ['Neptuno', Body.Neptune], ['Plutón', Body.Pluto],
  ['Nodo Norte', Body.MeanNode !== undefined ? Body.MeanNode : null],
].filter(([, b]) => b !== null);

const norm = (d) => ((d % 360) + 360) % 360;
const RELOJES_ASPECTO = [0, 60, 90, 120, 180];
const NOMBRES_ASPECTO = { 0: 'conjunción', 60: 'sextil', 90: 'cuadratura', 120: 'trígono', 180: 'oposición' };

const CASOS = [
  { nombre: 'Diana, Princesa de Gales', natal: { y: 1961, m: 7, d: 1, h: 19.75, tz: 1, lat: 52.833, lon: 0.5 }, muerte: { y: 1997, m: 8, d: 31, h: 1.83, tz: 2 } },
  { nombre: 'Eduardo VIII', natal: { y: 1894, m: 6, d: 23, h: 21.9167, tz: 0, lat: 51.445, lon: -0.2647 }, muerte: { y: 1972, m: 5, d: 28, h: 12, tz: 2 } },
  { nombre: 'María Antonieta', natal: { y: 1755, m: 11, d: 2, h: 19.5, tz: 1.0915, lat: 48.2167, lon: 16.373 }, muerte: { y: 1793, m: 10, d: 16, h: 12.25, tz: 0.1528 } },
  { nombre: 'Jorge VI', natal: { y: 1895, m: 12, d: 14, h: 3.0833, tz: 0, lat: 52.833, lon: 0.5 }, muerte: { y: 1952, m: 2, d: 6, h: 7.5, tz: 0 } },
  { nombre: 'Harald V', natal: { y: 1937, m: 2, d: 21, h: 12.75, tz: 1, lat: 59.85, lon: 10.5 }, muerte: { y: 2026, m: 8, d: 28, h: 6.5833, tz: 2 } },
  { nombre: 'Alfonso XIII', natal: { y: 1886, m: 5, d: 17, h: 12.5, tz: -3.7 / 15, lat: 40.4168, lon: -3.7038 }, muerte: { y: 1941, m: 2, d: 28, h: 12, tz: 1 } },
  { nombre: 'Carlos IV', natal: { y: 1748, m: 11, d: 11, h: 3.0, tz: 14.25 / 15, lat: 40.8518, lon: 14.2486 }, muerte: { y: 1819, m: 1, d: 20, h: 12, tz: 1 } },
];

const out = [];
const p = (s = '') => out.push(s);

p('# Duración de vida prevista vs fecha real de fallecimiento (7 casos, v2)');
p('Métodos clásicos: **hyleg** (Aben Ragel vía la app), **alcocoden** con la escala completa (dom 5, ex 4, término 3, trip 2, faz 1) y sus **años mayores**; **arco al anareta v1** (solo Marte/Saturno en cuadratura u oposición) y **anareta completo v2** (maléficos por aspecto, maléfico en la casa VIII, regente de la VIII, cola del dragón — Aben Ragel VI), con los **divisores de términos** como cronocratores del arco (1°/año). La prospectiva de la fecha de muerte resume firdaria y atacires C45/C96 (detalle en contraste-casos.md).');
p();
p('| Caso | Hyleg | Alcocoden (años) | Arco v1 | Anareta v2 | Muerte real | Δ v2 | Divisor vigente en la muerte |');
p('|---|---|---|---|---|---|---|---|');

const filas = [];
for (const caso of CASOS) {
  const nat = { lat: caso.natal.lat, lon: caso.natal.lon };
  const jdN = swe.julianDay(caso.natal.y, caso.natal.m, caso.natal.d, caso.natal.h - caso.natal.tz);
  const planetas = CUERPOS.map(([nombre, body]) => ({ nombre, lon: swe.calcWithSign(jdN, body).longitude }));
  const h = swe.houses(jdN, nat.lat, nat.lon, 'P');
  const datos = { jd: jdN, lat: nat.lat, lon: nat.lon, planetas, cusps: h.cusps, asc: h.ascendant, mc: h.midheaven };
  const diurno = determinarSecta(datos) === 'diurna';
  const hg = hyleg(datos, diurno);
  const al = alcocoden(hg.lon, planetas, diurno);
  const aniosAl = al ? (ANIOS_MAYORES[al.nombre] || 0) : 0;

  // Arco de vida v1: primer aspecto destructivo (90/180) con Marte o Saturno
  let arco = null;
  for (const m of planetas.filter((x) => x.nombre === 'Marte' || x.nombre === 'Saturno')) {
    for (const A of [90, 180]) {
      const a1 = norm(m.lon - A - hg.lon);
      const a2 = norm(m.lon + A - hg.lon);
      const candidato = Math.min(a1, a2);
      if (!arco || candidato < arco.arco) arco = { arco: candidato, planeta: m.nombre, aspecto: NOMBRES_ASPECTO[A] };
    }
  }
  const arcoAnios = arco ? arco.arco : null;

  // Muerte real
  const jdM = swe.julianDay(caso.muerte.y, caso.muerte.m, caso.muerte.d, caso.muerte.h - caso.muerte.tz);
  const edadReal = (jdM - jdN) / 365.2422;

  // Anareta completo v2 (Aben Ragel VI) + divisores y cronocratores
  const dv = duracionVida(datos, hg.lon);
  const dv2 = dv.anareta ? dv.anareta.arco : null;
  const vigente = dv.anareta ? dv.divisores.find((s) => edadReal >= s.desde && edadReal < s.hasta) : null;
  const dif = arcoAnios !== null ? arcoAnios - edadReal : null;

  // Prospectiva de la fecha de muerte (firdaria + atacires C45/C96)
  const fird = calcularFirdaria(jdN, diurno ? 'diurna' : 'nocturna', 2);
  const f = periodoActivo(jdM, fird);
  const edadAnios = edadReal;
  const puntos = [
    { nombre: 'Ascendente', lon: h.ascendant }, { nombre: 'Medio Cielo', lon: h.midheaven },
    { nombre: 'Sol', lon: planetas.find((x) => x.nombre === 'Sol').lon },
    { nombre: 'Luna', lon: planetas.find((x) => x.nombre === 'Luna').lon },
    ...planetas.filter((x) => !['Plutón', 'Nodo Norte'].includes(x.nombre)).map((x) => ({ nombre: x.nombre, lon: x.lon })),
  ];
  const contactos = [];
  for (const reloj of [45, 96]) {
    const vel = 360 / reloj;
    for (const sig of puntos) {
      const posDir = norm(sig.lon + vel * edadAnios);
      for (const pto of puntos) {
        if (pto.nombre === sig.nombre) continue;
        const asp = norm(posDir - pto.lon);
        for (const A of RELOJES_ASPECTO) {
          const orbe = Math.min(Math.abs(asp - A), 360 - Math.abs(asp - A));
          if (orbe <= 1.5) {
            const d = norm(pto.lon - sig.lon);
            let mejor = null;
            for (const e0 of [norm(d - A) / vel, norm(d + A) / vel]) {
              for (let k = 0; e0 + k * reloj <= edadAnios + reloj; k++) {
                const e = e0 + k * reloj;
                if (e < 0 || e > 110) continue;
                const desf = (edadAnios - e) * 12;
                if (!mejor || Math.abs(desf) < Math.abs(mejor)) mejor = desf;
              }
            }
            contactos.push({ sig: sig.nombre, reloj, aspecto: NOMBRES_ASPECTO[A], pto: pto.nombre, orbe: +orbe.toFixed(2), desf: mejor });
            break;
          }
        }
      }
    }
  }
  const top = contactos.sort((a, b) => a.orbe - b.orbe).slice(0, 3);
  const resumenProsp = `firdaria ${f.periodo.planeta} (sub ${f.subperiodo.planeta})` +
    (top.length ? ` · ${top.map((t) => `${t.sig} C${t.reloj} ${t.aspecto} a ${t.pto} (${t.orbe}°)`).join(' · ')}` : ' · sin atacires de muerte ≤ 1,5°');

  filas.push({ caso: caso.nombre, hg, al, aniosAl, arco, arcoAnios, dv, dv2, edadReal, vigente, resumenProsp });
  p(`| ${caso.nombre} | ${hg.nombre} | ${al ? al.nombre + ' (' + aniosAl + ')' : '—'} | ${arcoAnios !== null ? arcoAnios.toFixed(0) : '>120'} | ${dv.anareta ? dv.anareta.planeta + ' (' + dv.anareta.tipo + ') → ' + dv2.toFixed(0) : 'sin anareta'} | ${edadReal.toFixed(1)} | ${dv2 !== null ? (dv2 - edadReal >= 0 ? '+' : '') + (dv2 - edadReal).toFixed(1) : '—'} | ${vigente ? vigente.planeta + ' (' + vigente.desde.toFixed(0) + '–' + vigente.hasta.toFixed(0) + ')' : (dv2 !== null && edadReal > dv2 ? 'más allá del arco' : '—')} |`);
}

p();
p('## Detalle por caso (anareta completo y cronocratores)');
for (const f of filas) {
  p();
  p(`### ${f.caso}`);
  p(`- Hyleg: ${f.hg.nombre} (${f.hg.razon})`);
  p(`- Alcocoden: ${f.al ? f.al.nombre + ' · ' + f.al.pts + ' pts (años mayores: ' + f.aniosAl + ')' : 'sin alcocoden claro'}`);
  p(`- Arco v1 (Marte/Saturno cuad/opp): ${f.arcoAnios !== null ? f.arcoAnios.toFixed(1) + ' años (' + f.arco.planeta + ', ' + f.arco.aspecto + ')' : '>120'}`);
  if (f.dv && f.dv.anareta) {
    p(`- Anareta completo (v2): ${f.dv.anareta.planeta} (${f.dv.anareta.tipo}) → ${f.dv.anios.toFixed(1)} años · candidatos: ${f.dv.candidatos.map((c) => c.planeta + ' ' + c.arco.toFixed(0)).join(', ')}`);
    const ult = f.dv.divisores.slice(-4);
    p(`- Cronocratores finales: ${ult.map((s) => `${s.planeta} (${s.desde.toFixed(0)}–${s.hasta.toFixed(0)} años)`).join(' · ')}`);
    p(`- Divisor vigente en la muerte real: ${f.vigente ? f.vigente.planeta + ' (' + f.vigente.desde.toFixed(0) + '–' + f.vigente.hasta.toFixed(0) + ' años)' : (f.dv2 !== null && f.edadReal > f.dv2 ? 'ninguno: la muerte cayó más allá del arco' : '—')}`);
  } else {
    p('- Anareta completo: sin candidatos');
  }
  p(`- Muerte real: ${f.edadReal.toFixed(1)} años`);
  p(`- Prospectiva del día de la muerte: ${f.resumenProsp}`);
}

writeFileSync('../casos-prospectiva/duracion-vida.md', out.join('\n'), 'utf8');
console.log(`OK: duracion-vida.md (${out.length} líneas)`);
swe.dispose();