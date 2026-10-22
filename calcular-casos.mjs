// Contraste prospectivo de los casos de casas reales (Tomo IV).
// Para cada acontecimiento: firdaria vigente, revolución solar del año,
// atacires del dominio (posiciones dirigidas a puntos natales) y tránsitos
// del día (corpus propio de la app). Salida: casos-prospectiva/contraste-casos.md
// Uso: node calcular-casos.mjs
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { calcularFirdaria, periodoActivo, determinarSecta } from './js/firdaria.js';
import { calcularRevolucionSolar } from './js/revolucion-solar.js';
import { calcularTransitos } from './js/transitos.js';
import { readFileSync } from 'node:fs';
import { writeFileSync } from 'node:fs';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

const CUERPOS = [
  ['Sol', Body.Sun], ['Luna', Body.Moon], ['Mercurio', Body.Mercury], ['Venus', Body.Venus],
  ['Marte', Body.Mars], ['Júpiter', Body.Jupiter], ['Saturno', Body.Saturn],
  ['Urano', Body.Uranus], ['Neptuno', Body.Neptune], ['Plutón', Body.Pluto],
  ['Nodo Norte', Body.MeanNode !== undefined ? Body.MeanNode : null],
].filter(([, b]) => b !== null);

const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
const signoDe = (lon) => SIGNOS[Math.floor(((lon % 360) + 360) % 360 / 30)];
const norm = (d) => ((d % 360) + 360) % 360;
const RELOJES_ASPECTO = [0, 60, 90, 120, 180];
const NOMBRES_ASPECTO = { 0: 'conjunción', 60: 'sextil', 90: 'cuadratura', 120: 'trígono', 180: 'oposición' };

function casaDe(lon, cusps) {
  lon = norm(lon);
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    const span = norm(b - a) || 360;
    if (norm(lon - a) < span) return i + 1;
  }
  return 12;
}

function calcCarta(natal, fechaUT) {
  const jd = swe.julianDay(fechaUT.anio, fechaUT.mes, fechaUT.dia, fechaUT.horaUT);
  const planetas = CUERPOS.map(([nombre, body]) => {
    const p = swe.calcWithSign(jd, body, { flags: Flag.Speed });
    return { nombre, lon: p.longitude, retro: !!p.retrograde };
  });
  const h = swe.houses(jd, natal.lat, natal.lon, 'P');
  return { jd, planetas, asc: h.ascendant, mc: h.midheaven, cusps: h.cusps };
}

function aspectosA(punto, lista, maxOrbe) {
  const res = [];
  for (const p of lista) {
    if (p.nombre === punto.nombre) continue;
    const dif = Math.abs(norm(p.lon - punto.lon));
    for (const A of RELOJES_ASPECTO) {
      const orbe = Math.min(Math.abs(dif - A), 360 - Math.abs(dif - A));
      if (orbe <= maxOrbe) {
        res.push({ planeta: p.nombre, aspecto: NOMBRES_ASPECTO[A], orbe: +orbe.toFixed(2), lon: p.lon });
        break;
      }
    }
  }
  return res.sort((a, b) => a.orbe - b.orbe);
}

// ---------- Casos ----------
const CASOS = [
  {
    nombre: 'Diana, Princesa de Gales',
    natal: { y: 1961, m: 7, d: 1, horaLocal: 19.75, tz: 1, lat: 52.833, lon: 0.5 },
    eventos: [
      { f: [1981, 2, 24], tz: 0, cat: 'ascenso', desc: 'anuncio del compromiso' },
      { f: [1981, 7, 29], h: 11.28, tz: 1, cat: 'boda', desc: 'boda con Carlos (San Pablo)' },
      { f: [1982, 6, 21], tz: 1, cat: 'hijo', desc: 'nace Guillermo' },
      { f: [1984, 9, 15], tz: 1, cat: 'hijo', desc: 'nace Enrique' },
      { f: [1992, 3, 3], tz: 0, cat: 'perdida-familiar', desc: 'muerte del padre' },
      { f: [1992, 12, 9], tz: 0, cat: 'perdida-poder', desc: 'anuncio de la separación' },
      { f: [1996, 8, 28], tz: 1, cat: 'perdida-poder', desc: 'divorcio definitivo' },
      { f: [1997, 8, 31], h: 1.83, tz: 2, cat: 'muerte', desc: 'accidente y muerte (París)' },
    ],
  },
  {
    nombre: 'Eduardo VIII',
    natal: { y: 1894, m: 6, d: 23, horaLocal: 21.9167, tz: 0, lat: 51.445, lon: -0.2647 },
    eventos: [
      { f: [1936, 1, 20], tz: 0, cat: 'ascenso', desc: 'muerte de Jorge V; ascensión' },
      { f: [1936, 12, 11], tz: 0, cat: 'perdida-poder', desc: 'abdicación' },
      { f: [1937, 6, 3], tz: 1, cat: 'boda', desc: 'boda con Wallis Simpson (Candé)' },
      { f: [1940, 7, 15], tz: 1, cat: 'nombramiento', desc: 'gobernador de las Bahamas' },
      { f: [1971, 12, 1], tz: 0, cat: 'enfermedad', desc: 'diagnóstico de cáncer de garganta' },
      { f: [1972, 5, 28], tz: 2, cat: 'muerte', desc: 'muerte en París' },
    ],
  },
  {
    nombre: 'María Antonieta',
    natal: { y: 1755, m: 11, d: 2, horaLocal: 19.5, tz: 1.0915, lat: 48.2167, lon: 16.373 },
    eventos: [
      { f: [1770, 4, 19], tz: 1.0915, cat: 'boda', desc: 'matrimonio por poderes (Viena)' },
      { f: [1774, 5, 10], tz: 0.1528, cat: 'ascenso', desc: 'muerte de Luis XV; ascensión al trono' },
      { f: [1789, 6, 1], tz: 0.1528, cat: 'perdida', desc: 'muerte del hijo mayor; revolución' },
      { f: [1789, 10, 6], tz: 0.1528, cat: 'perdida-poder', desc: 'traslado forzado a las Tullerías' },
      { f: [1793, 1, 21], tz: 0.1528, cat: 'perdida-familiar', desc: 'ejecución de Luis XVI' },
      { f: [1793, 10, 16], h: 12.25, tz: 0.1528, cat: 'muerte', desc: 'ejecución (guillotina)' },
    ],
  },
  {
    nombre: 'Jorge VI',
    natal: { y: 1895, m: 12, d: 14, horaLocal: 3.0833, tz: 0, lat: 52.833, lon: 0.5 },
    eventos: [
      { f: [1923, 4, 26], tz: 1, cat: 'boda', desc: 'boda con Elizabeth Bowes-Lyon' },
      { f: [1926, 4, 21], tz: 1, cat: 'hijo', desc: 'nace Isabel' },
      { f: [1930, 8, 21], tz: 1, cat: 'hijo', desc: 'nace Margarita' },
      { f: [1936, 12, 11], tz: 0, cat: 'ascenso', desc: 'ascensión por abdicación de Eduardo VIII' },
      { f: [1937, 5, 12], tz: 1, cat: 'ascenso', desc: 'coronación' },
      { f: [1951, 9, 23], tz: 1, cat: 'enfermedad', desc: 'operación de cáncer de pulmón' },
      { f: [1952, 2, 6], h: 7.5, tz: 0, cat: 'muerte', desc: 'muerte en Sandringham' },
    ],
  },
  {
    nombre: 'Harald V',
    natal: { y: 1937, m: 2, d: 21, horaLocal: 12.75, tz: 1, lat: 59.85, lon: 10.5 },
    eventos: [
      { f: [1968, 8, 29], tz: 1, cat: 'boda', desc: 'boda con Sonja Haraldsen' },
      { f: [1971, 9, 22], tz: 1, cat: 'hijo', desc: 'nace Märtha Louise' },
      { f: [1973, 7, 20], tz: 2, cat: 'hijo', desc: 'nace Haakon' },
      { f: [1991, 1, 17], tz: 1, cat: 'ascenso', desc: 'muerte de Olav V; ascensión al trono' },
      { f: [1991, 6, 23], tz: 2, cat: 'ascenso', desc: 'consagración en Nidaros' },
      { f: [2003, 12, 15], tz: 1, cat: 'enfermedad', desc: 'diagnóstico de cáncer de vejiga' },
      { f: [2005, 4, 1], tz: 2, cat: 'enfermedad', desc: 'bypass coronario' },
      { f: [2026, 8, 28], h: 6.5833, tz: 2, cat: 'muerte', desc: 'muerte en el Hospital Universitario de Oslo' },
    ],
  },
  {
    nombre: 'Alfonso XIII',
    natal: { y: 1886, m: 5, d: 17, horaLocal: 12.5, tz: -3.7 / 15, lat: 40.4168, lon: -3.7038 },
    eventos: [
      { f: [1902, 5, 17], tz: 1, cat: 'ascenso', desc: 'mayoría de edad y juramento constitucional' },
      { f: [1906, 5, 31], tz: 1, cat: 'boda', desc: 'boda con Victoria Eugenia (atentado el mismo día)' },
      { f: [1907, 5, 10], tz: 1, cat: 'hijo', desc: 'nace Alfonso' },
      { f: [1923, 9, 13], tz: 1, cat: 'perdida-poder', desc: 'golpe de Primo de Rivera; acepta la dictadura' },
      { f: [1931, 4, 14], tz: 1, cat: 'perdida-poder', desc: 'proclamación de la Segunda República; exilio' },
      { f: [1941, 1, 10], tz: 1, cat: 'perdida-poder', desc: 'abdicación formal en favor de Juan' },
      { f: [1941, 2, 28], tz: 1, cat: 'muerte', desc: 'muerte en Roma' },
    ],
  },
  {
    nombre: 'Carlos IV',
    natal: { y: 1748, m: 11, d: 11, horaLocal: 3.0, tz: 14.25 / 15, lat: 40.8518, lon: 14.2486 },
    eventos: [
      { f: [1765, 9, 4], tz: -3.7 / 15, cat: 'boda', desc: 'boda con María Luisa de Parma' },
      { f: [1784, 10, 4], tz: -3.7 / 15, cat: 'hijo', desc: 'nace Fernando (VII)' },
      { f: [1788, 12, 14], tz: -3.7 / 15, cat: 'ascenso', desc: 'muerte de Carlos III; ascensión al trono' },
      { f: [1808, 3, 19], tz: -3.7 / 15, cat: 'perdida-poder', desc: 'Motín de Aranjuez; abdicación a favor de Fernando VII' },
      { f: [1808, 5, 6], tz: 0, cat: 'perdida-poder', desc: 'abdicaciones de Bayona en favor de Napoleón' },
      { f: [1819, 1, 20], tz: 1, cat: 'muerte', desc: 'muerte en Roma' },
    ],
  },
];

const RELOJES_DOMINIO = {
  boda: [5, 15, 25], hijo: [5, 15, 25], ascenso: [12, 60, 360], nombramiento: [12, 60, 360],
  'perdida-poder': [12, 60, 360], enfermedad: [60, 72, 144], muerte: [45, 96, 60],
  perdida: [12, 60], 'perdida-familiar': [60, 12],
};

const SIGNIFICADORES = ['Ascendente', 'Medio Cielo', 'Sol', 'Luna', 'Fortuna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno'];

const corpus = JSON.parse(readFileSync('datos/transitos.json', 'utf8'));
const out = [];
const p = (s = '') => out.push(s);

p('# Contraste prospectivo — casos de casas reales (v1)');
p('Cálculos: motor Swiss Ephemeris de la app (efemérides DE441 locales). Por cada acontecimiento: firdaria vigente, revolución solar del año (lugar natal, v1), atacires del dominio (orbe ≤ 1,5°) y tránsitos del día con texto del corpus (orbe ≤ 3°). Es un contraste de exploración: la fecha exacta del ataque dirigido se anota como desfase respecto del acontecimiento.');
p();

for (const caso of CASOS) {
  p(`# ${caso.nombre}`);
  const horaUT = caso.natal.horaLocal - caso.natal.tz;
  const fechaUTN = { anio: caso.natal.y, mes: caso.natal.m, dia: caso.natal.d, horaUT };
  const nat = calcCarta(caso.natal, fechaUTN);
  const datosNatal = {
    jd: nat.jd, lat: caso.natal.lat, lon: caso.natal.lon,
    planetas: nat.planetas.map((x) => ({ ...x })), cusps: nat.cusps,
    asc: nat.asc, mc: nat.mc,
  };
  const secta = determinarSecta(datosNatal);
  const fird = calcularFirdaria(nat.jd, secta, 2);
  const solN = nat.planetas.find((x) => x.nombre === 'Sol').lon;
  const lunaN = nat.planetas.find((x) => x.nombre === 'Luna').lon;
  const fortuna = secta === 'diurna' ? norm(nat.asc + lunaN - solN) : norm(nat.asc + solN - lunaN);
  const puntos = [
    { nombre: 'Ascendente', lon: nat.asc }, { nombre: 'Medio Cielo', lon: nat.mc },
    { nombre: 'Fortuna', lon: fortuna },
    ...nat.planetas.map((x) => ({ nombre: x.nombre, lon: x.lon })),
  ].filter((x) => x.nombre !== 'Plutón' && x.nombre !== 'Nodo Norte');
  const aspectosNatal = [];
  for (const a of puntos) for (const b of puntos) {
    if (a.nombre >= b.nombre) continue;
    const dif = Math.abs(norm(a.lon - b.lon));
    for (const A of RELOJES_ASPECTO) {
      if (Math.min(Math.abs(dif - A), 360 - Math.abs(dif - A)) < 1) { aspectosNatal.push({ de: a.nombre, a: b.nombre, tipo: A === 0 ? 'conjuncion' : (A === 60 || A === 120) ? 'bueno' : 'malo' }); break; }
    }
  }
  p(`Natal: ${secta} · ASC ${signoDe(nat.asc)} ${((nat.asc % 30)).toFixed(1)}° · Fortuna ${signoDe(fortuna)} ${(fortuna % 30).toFixed(1)}°`);
  p();
  for (const ev of caso.eventos) {
    const horaEUT = (ev.h !== undefined ? ev.h : 12) - ev.tz;
    const [y, m, d] = ev.f;
    const jdE = swe.julianDay(y, m, d, horaEUT);
    const jdEdia = swe.julianDay(y, m, d, 12);
    p(`## ${d}-${m}-${y} — ${ev.desc} [${ev.cat}]`);
    // firdaria
    const f = periodoActivo(jdE, fird);
    p(`- Firdaria: ${f.periodo.planeta} (sub: ${f.subperiodo.planeta})`);
    // revolución solar del año vigente
    const cumple = new Date(caso.natal.y + (y - caso.natal.y), caso.natal.m - 1, caso.natal.d);
    const anioRS = (new Date(y, m - 1, d) >= new Date(y, caso.natal.m - 1, caso.natal.d)) ? y : y - 1;
    const rs = calcularRevolucionSolar(swe, datosNatal, anioRS, caso.natal.lat, caso.natal.lon);
    if (rs) {
      p(`- Revolución solar ${anioRS}: ASC anual en casa natal ${rs.ascCasaNatal} · MC anual en casa natal ${rs.mcCasaNatal}`);
    }
    // atacires del dominio
    const edad = jdE - nat.jd;
    const edadAnios = edad / 365.2422;
    const relojes = RELOJES_DOMINIO[ev.cat] || [60];
    const dirigibles = [
      { nombre: 'Ascendente', lon: nat.asc, vel: null }, { nombre: 'Medio Cielo', lon: nat.mc, vel: null },
      { nombre: 'Sol', lon: solN, vel: null }, { nombre: 'Luna', lon: lunaN, vel: null }, { nombre: 'Fortuna', lon: fortuna, vel: null },
      ...nat.planetas.filter((x) => !['Plutón', 'Nodo Norte'].includes(x.nombre)).map((x) => ({ nombre: x.nombre, lon: x.lon, vel: null })),
    ];
    const contactos = [];
    for (const reloj of relojes) {
      const vel = 360 / reloj;
      for (const sig of dirigibles) {
        const posDir = norm(sig.lon + vel * edadAnios);
        for (const punto of puntos) {
          if (punto.nombre === sig.nombre) continue;
          const aspActual = norm(posDir - punto.lon);
          let mejor = null;
          for (const A of RELOJES_ASPECTO) {
            const dist = Math.abs(aspActual - A);
            const orbe = Math.min(dist, 360 - dist);
            if (orbe > 1.5) continue;
            const d = norm(punto.lon - sig.lon);
            const soluciones = [norm(d - A) / vel, norm(d + A) / vel];
            for (const e0 of soluciones) {
              for (let k = 0; e0 + k * reloj <= edadAnios + reloj; k++) {
                const e = e0 + k * reloj;
                if (e < 0 || e > 110) continue;
                const desfase = (edadAnios - e) * 12;
                if (!mejor || Math.abs(desfase) < Math.abs(mejor.desfase)) mejor = { A, orbe, desfase };
              }
            }
          }
          if (mejor) {
            const cuando = mejor.desfase >= 0 ? `exacto hace ${mejor.desfase.toFixed(1)} meses` : `exacto en ${(-mejor.desfase).toFixed(1)} meses`;
            contactos.push(`Atacir de ${sig.nombre} (C${reloj}) en ${NOMBRES_ASPECTO[mejor.A]} a ${punto.nombre} — orbe ${mejor.orbe.toFixed(2)}° · ${cuando}`);
          }
        }
      }
    }
    const unicos = [...new Set(contactos)];
    if (unicos.length) for (const c of unicos.slice(0, 8)) p(`- ${c}`);
    else p('- Sin contactos de atacir del dominio con orbe ≤ 1,5°');
    // tránsitos del día
    const transitosDia = CUERPOS.map(([nombre, body]) => {
      const pos = swe.calcWithSign(jdEdia, body, { flags: Flag.Speed });
      return { nombre, lon: pos.longitude, retro: !!pos.retrograde, signo: signoDe(pos.longitude), casa: casaDe(pos.longitude, nat.cusps) };
    });
    const puntosTransitos = puntos.map((x) => ({ nombre: x.nombre, lon: x.lon }));
    const res = calcularTransitos(puntosTransitos, transitosDia, corpus, aspectosNatal);
    for (const x of res.porSignoList || []) {
      const texto = (x.entrada.texto[0] || '').slice(0, 150);
      p(`- En el cielo: ${x.transitante.nombre} pasa por ${x.transitante.signo} (${x.entrada.titulo || ''}): ${texto}…`);
    }
    for (const x of res.porCasaList || []) {
      const texto = (x.entrada.texto[0] || '').slice(0, 150);
      p(`- En el año: ${x.transitante.nombre} pasa por la casa natal ${x.transitante.casa} (${x.entrada.titulo || ''}): ${texto}…`);
    }
    const MAYORES_OK = [0, 60, 90, 120, 180];
    const conOrbe = (res.contactos || []).filter((c) => MAYORES_OK.includes(c.ang) && c.orb <= 3);
    for (const c of conOrbe.slice(0, 6)) {
      const texto = (c.entrada && c.entrada.texto && c.entrada.texto[0] || '').slice(0, 160);
      p(`- Tránsito: ${c.transitante.nombre} → ${c.punto} (${c.nombreAspecto}, orbe ${c.orb.toFixed(1)}°${c.fondoNatal && c.fondoNatal !== 'ninguno' ? ', fondo natal: ' + c.fondoNatal : ''}): ${texto}…`);
    }
    if (!conOrbe.length) p('- Sin tránsitos mayores con texto del corpus a orbe ≤ 3°');
    p();
  }
}

writeFileSync('../casos-prospectiva/contraste-casos.md', out.join('\n'), 'utf8');
console.log(`OK: contraste-casos.md (${out.length} líneas)`);
swe.dispose();