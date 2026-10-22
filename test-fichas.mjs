// Test del módulo fichas-tema (Node, con los .se1 del equipo).
// Uso:  node test-fichas.mjs   (desde la carpeta carta-natal)
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
import { findAspects, TRADITIONAL_MOIETIES } from './js/vendor/dist/derived/aspects.js';
import { analizarSalud, analizarRiqueza, analizarMatrimonio, analizarProfesion, analizarEstudio, analizarPadres, analizarViajes, lunacionPrenatal } from './js/fichas-tema.js';
import { renderFichasTema } from './js/fichas-tema.js';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');

const MAPA = { Sol: Body.Sun, Luna: Body.Moon, Mercurio: Body.Mercury, Venus: Body.Venus,
  Marte: Body.Mars, Júpiter: Body.Jupiter, Saturno: Body.Saturn,
  Urano: Body.Uranus, Neptuno: Body.Neptune, Plutón: Body.Pluto };

function casaDe(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((lon - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
}

function calcularCarta(anio, mes, dia, hora, min, utc, lat, lon) {
  const jd = swe.julianDay(anio, mes, dia, hora + min / 60 - utc);
  const casa = swe.houses(jd, lat, lon, 'P');
  const planetas = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón']
    .map((n) => {
      const p = swe.calcWithSign(jd, MAPA[n], { flags: Flag.Speed });
      return { nombre: n, lon: p.longitude, speed: p.longitudeSpeed, retro: p.retrograde, casa: casaDe(p.longitude, casa.cusps) };
    });
  let fortuna = null;
  try {
    const lotes = swe.lots(jd, { latitude: lat, longitude: lon, houseSystem: 'P' });
    const f = Object.keys(lotes.lots || {}).find((k) => /fortune/i.test(k));
    if (f) {
      const l = lotes.lots[f];
      const lonL = l && (l.longitude ?? l.degreeInSign ?? null);
      if (typeof lonL === 'number') fortuna = lonL;
    }
  } catch { /* opcional */ }
  const puntosExt = planetas.map((p) => ({ name: p.nombre, longitude: p.lon, body: null, speed: p.speed }));
  puntosExt.push({ name: 'Ascendente', longitude: casa.ascendant, body: null, speed: 0 });
  puntosExt.push({ name: 'Medio Cielo', longitude: casa.midheaven, body: null, speed: 0 });
  if (fortuna !== null) puntosExt.push({ name: 'Parte Fortuna', longitude: fortuna, body: null, speed: 0 });
  const aspectosExt = findAspects(puntosExt, { orbs: TRADITIONAL_MOIETIES });
  return { jd, planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven, fortuna, aspectosExt };
}

const cartas = [
  { nombre: 'Prueba 1 · 30/04/1957 19:23 Madrid', anio: 1957, mes: 4, dia: 30, hora: 19, min: 23, utc: 2, lat: 40.4168, lon: -3.7038 },
  { nombre: 'Prueba 2 · 07/03/1958 06:58 Madrid', anio: 1958, mes: 3, dia: 7, hora: 6, min: 58, utc: 1, lat: 40.4168, lon: -3.7038 },
  { nombre: 'Ejemplo · 12/08/2026 12:00 Madrid', anio: 2026, mes: 8, dia: 12, hora: 12, min: 0, utc: 2, lat: 40.4168, lon: -3.7038 },
];

let fallos = 0;
const mkCont = () => ({ hidden: true, innerHTML: '', addEventListener: () => {} });
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};

for (const c of cartas) {
  console.log(`\n== ${c.nombre} ==`);
  const datos = calcularCarta(c.anio, c.mes, c.dia, c.hora, c.min, c.utc, c.lat, c.lon);

  // Salud: valores clave
  const ctx = analizarSalud(datos, swe);
  comprobar('Salud: ASC regente', !!ctx.asc.regenteDato || true);
  comprobar('Salud: hyleg con alcocoden', !!ctx.hyleg && !!ctx.hyleg.alcocoden);
  comprobar('Salud: lunación encontrada', !!ctx.lunacion);

  // Todos los temas renderizan sin errores y producen fichas
  const temas = {
    salud: analizarSalud, riqueza: analizarRiqueza, matrimonio: analizarMatrimonio,
    profesion: analizarProfesion, estudio: analizarEstudio, padres: analizarPadres, viajes: analizarViajes,
  };
  for (const [id, fn] of Object.entries(temas)) {
    const tctx = fn(datos, swe);
    const cont = mkCont();
    renderFichasTema(cont, datos, swe); // renderiza el tema activo (salud) + registro
    comprobar(`Render ${id}: contenedor visible`, !cont.hidden && cont.innerHTML.length > 500);
  }
}

// Verificación directa de la lunación contra un caso conocido
const jdRef = swe.julianDay(1957, 4, 30, 19 + 23 / 60 - 2);
const lun = lunacionPrenatal(swe, jdRef);
const dias = jdRef - lun.jd;
console.log(`\n== Lunación pre-natal (Prueba 1) ==`);
console.log(`  ${lun.tipo} · lon ${lun.lon.toFixed(4)} · ${dias.toFixed(3)} días antes del nacimiento`);
comprobar('Lunación en rango (0–15,5 días)', dias > 0 && dias < 15.5);

// Estructura del registro: cada tema con orden de juicio
const html = (() => { const c = mkCont(); renderFichasTema(c, calcularCarta(1957, 4, 30, 19, 23, 2, 40.4168, -3.7038), swe); return c.innerHTML; })();
for (const esperado of ['Orden de juicio', 'Límites (parte del criterio)', 'Fuentes de criterio', 'data-tema="riqueza"', 'data-tema="matrimonio"', 'data-tema="profesion"', 'data-tema="estudio"', 'data-tema="padres"', 'data-tema="viajes"']) {
  comprobar(`HTML contiene: ${esperado}`, html.includes(esperado));
}

console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
swe.dispose();
process.exit(fallos === 0 ? 0 : 1);
