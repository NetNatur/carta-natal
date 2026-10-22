// ============================================================
//  Carta Natal — lógica de cálculo e interfaz
//  Motor: Swiss Ephemeris 2.10.03 (WebAssembly) + efemérides .se1
// ============================================================
import { createSwissEph, Body, Flag } from './vendor/dist/index.js';
import { findAspects, MODERN_ORBS, TRADITIONAL_MOIETIES, TIGHT_ORBS } from './vendor/dist/derived/aspects.js';
import { FetchEphemeris } from './vendor/dist/ephemeris/sources.js';
import { dibujarCarta, gradosTexto, NOMBRES_SIGNOS } from './carta.js';
import { cargarRecetario, renderInterpretacion, PARTICIPANTES_ASPECTO } from './interpretacion.js';
import { renderFichasTema } from './fichas-tema.js';
import { terminoDe } from './terminos.js';
import { renderProspectiva } from './prospectiva.js';
import { renderTransitos } from './transitos.js';
import { renderRevolucionSolar } from './revolucion-solar.js';
import { renderFirdaria } from './firdaria.js';
import { renderAyuda } from './ayuda.js';

const $ = (id) => document.getElementById(id);

// ---------- Catálogo de cuerpos ----------
const CUERPOS_BASE = [
  { body: Body.Sun, nombre: 'Sol', glifo: '☉' },
  { body: Body.Moon, nombre: 'Luna', glifo: '☽' },
  { body: Body.Mercury, nombre: 'Mercurio', glifo: '☿' },
  { body: Body.Venus, nombre: 'Venus', glifo: '♀' },
  { body: Body.Mars, nombre: 'Marte', glifo: '♂' },
  { body: Body.Jupiter, nombre: 'Júpiter', glifo: '♃' },
  { body: Body.Saturn, nombre: 'Saturno', glifo: '♄' },
  { body: Body.Uranus, nombre: 'Urano', glifo: '♅' },
  { body: Body.Neptune, nombre: 'Neptuno', glifo: '♆' },
  { body: Body.Pluto, nombre: 'Plutón', glifo: '♇' },
  { body: Body.TrueNode, nombre: 'Nodo Norte', glifo: '☊' },
  { body: Body.BlackMoonLilithMean, nombre: 'Lilith', glifo: '⚸' },
];
const EXTRAS = {
  chiron: { body: Body.Chiron, nombre: 'Quirón', glifo: '⚷' },
  ceres: { body: Body.Ceres, nombre: 'Ceres', glifo: '⚳' },
  pallas: { body: Body.Pallas, nombre: 'Palas', glifo: '⚴' },
  juno: { body: Body.Juno, nombre: 'Juno', glifo: '⚵' },
  vesta: { body: Body.Vesta, nombre: 'Vesta', glifo: '⚶' },
};

const NOMBRE_ASPECTO_ES = {
  Conjunction: 'Conjunción', Sextile: 'Sextil', Square: 'Cuadratura',
  Trine: 'Trígono', Opposition: 'Oposición', 'Semi-sextile': 'Semisextil',
  'Semi-square': 'Semicuadratura', Quintile: 'Quintil',
  Sesquiquadrate: 'Sesquicuadratura', 'Bi-quintile': 'Biquintil',
  Quincunx: 'Quincuncio',
};
const ORBES = { trad: TRADITIONAL_MOIETIES, modern: MODERN_ORBS, tight: TIGHT_ORBS };

let swe = null;
let CIUDADES = [];
let ciudadSel = null;
let ultimasSugerencias = [];
let ultimosDatos = null;

// ---------- Utilidades ----------
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function offsetHorasUTC(f, tz) {
  // Offset real (con DST) de una zona IANA para una fecha local dada.
  const utc = Date.UTC(f.y, f.m - 1, f.d, f.h, f.min, 0);
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const parts = {};
  for (const p of dtf.formatToParts(new Date(utc))) if (p.type !== 'literal') parts[p.type] = p.value;
  const comoUTC = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (comoUTC - utc) / 3600000;
}

function casaDe(longitud, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    const dentro = ((longitud - a + 360) % 360) < ((b - a + 360) % 360);
    if (dentro) return i + 1;
  }
  return 1;
}

function formatGrado(lon) {
  const s = Math.floor(lon / 30) % 12;
  const d = Math.floor(lon % 30);
  const m = Math.floor(((lon % 30) % 1) * 60);
  return `${d}°${String(m).padStart(2, '0')}' ${NOMBRES_SIGNOS[s]}`;
}
function formatOrbe(o) {
  const d = Math.floor(o);
  const m = Math.round((o - d) * 60);
  return m === 60 ? `${d + 1}°00'` : `${d}°${String(m).padStart(2, '0')}'`;
}

// ---------- Ciudades ----------
async function cargarCiudades() {
  const r = await fetch('datos/ciudades.json');
  CIUDADES = await r.json();
}

function buscarCiudades(q, limite = 10) {
  const nq = norm(q).trim();
  if (nq.length < 2) return [];
  const res = [];
  for (const c of CIUDADES) {
    if (norm(c.n).includes(nq) || norm(c.p).includes(nq)) {
      res.push(c);
      if (res.length >= limite * 3) break;
    }
  }
  res.sort((a, b) => {
    const sa = norm(a.n).startsWith(nq) ? 1 : 0;
    const sb = norm(b.n).startsWith(nq) ? 1 : 0;
    if (sa !== sb) return sb - sa;
    return (b.pop || 0) - (a.pop || 0);
  });
  return res.slice(0, limite);
}

// ---------- Estado ----------
function setEstado(tipo, mensaje) {
  const el = $('estado');
  el.className = 'estado ' + tipo;
  el.textContent = mensaje;
}

// ---------- Cálculo principal ----------
async function calcular() {
  const btn = $('calcular');
  btn.disabled = true;
  try {
    setEstado('info', 'Calculando…');

    const nombre = ($('nombre').value || '').trim() || 'Sin nombre';
    const anioLocal = +$('anio').value;
    const ac = $('ac').checked;
    let anio = anioLocal;
    if (ac) anio = 1 - anio; // año astronómico
    const dia = +$('dia').value, mes = +$('mes').value;
    const hora = $('hora-desconocida').checked ? 12 : (+$('hora').value + +$('minuto').value / 60);
    const lat = +$('lat').value, lon = +$('lon').value;

    if (!(dia >= 1 && dia <= 31) || !(mes >= 1 && mes <= 12) || !Number.isFinite(anio)) throw new Error('Fecha no válida.');
    if (!(hora >= 0 && hora < 24)) throw new Error('Hora no válida (0–23).');
    if (!(lat >= -90 && lat <= 90) || !(lon >= -180 && lon <= 180)) throw new Error('Coordenadas no válidas (lat −90..90, lon −180..180).');

    let offset;
    if ($('utc-manual').checked) {
      offset = +$('utc').value;
      if (!Number.isFinite(offset) || offset < -12 || offset > 14) throw new Error('Diferencia UTC no válida.');
    } else if (ciudadSel && ciudadSel.t) {
      offset = offsetHorasUTC({ y: anioLocal, m: mes, d: dia, h: Math.floor(hora), min: Math.round((hora % 1) * 60) }, ciudadSel.t);
    } else {
      offset = 0;
    }

    const jd = swe.julianDay(anio, mes, dia, hora - offset);

    // Carga las efemérides .se1 necesarias para el rango (si faltan, Swiss Ephemeris cae a Moshier)
    await swe.loadEphemeris(new FetchEphemeris({ baseUrl: 'datos/ephe' }), {
      fromYear: anio - 1, toYear: anio + 1, kinds: ['planets', 'moon', 'asteroids'],
    });

    const hsys = $('sistema').value;
    const casa = swe.houses(jd, lat, lon, hsys);

    const lista = [...CUERPOS_BASE];
    document.querySelectorAll('input[data-extra]').forEach((cb) => {
      if (cb.checked && EXTRAS[cb.dataset.extra]) lista.push(EXTRAS[cb.dataset.extra]);
    });

    let efem = 'swiss';
    const planetas = [];
    for (const c of lista) {
      const p = swe.calcWithSign(jd, c.body, { flags: Flag.Speed });
      if (p.ephemeris === 'moshier') efem = 'moshier';
      planetas.push({
        id: c.nombre, nombre: c.nombre, glifo: c.glifo,
        lon: p.longitude, speed: p.longitudeSpeed, retro: p.retrograde,
        casa: casaDe(p.longitude, casa.cusps),
      });
    }

    const aspectos = findAspects(
      planetas.map((p) => ({ name: p.nombre, longitude: p.lon, body: null, speed: p.speed })),
      { orbs: ORBES[$('orbes').value] }
    );

    // Partes árabes (Fortuna y Espíritu, si la librería los calcula)
    let fortuna = null;
    try {
      const lotes = swe.lots(jd, { latitude: lat, longitude: lon, houseSystem: hsys });
      const claves = Object.keys(lotes.lots || {});
      const f = claves.find((k) => /fortune/i.test(k));
      if (f) {
        const l = lotes.lots[f];
        const lonL = (l && (l.longitude ?? l.degreeInSign ?? l.longitudeDeg ?? null));
        if (typeof lonL === 'number') fortuna = lonL;
      }
    } catch { /* opcional */ }

    // ---- Render ----
    const hh = Math.floor(hora), mm = Math.round((hora % 1) * 60);
    const fechaTexto = `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${anioLocal}${ac ? ' a.C.' : ''} · ${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    const lugarTexto = ciudadSel ? `${ciudadSel.n} (${ciudadSel.p})` : `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

    // Aspectos extendidos para la interpretación: planetas del recetario + ASC + MC + Fortuna
    const puntosExt = planetas
      .filter((p) => PARTICIPANTES_ASPECTO.includes(p.nombre))
      .map((p) => ({ name: p.nombre, longitude: p.lon, body: null, speed: p.speed }));
    puntosExt.push({ name: 'Ascendente', longitude: casa.ascendant, body: null, speed: 0 });
    puntosExt.push({ name: 'Medio Cielo', longitude: casa.midheaven, body: null, speed: 0 });
    if (fortuna !== null) puntosExt.push({ name: 'Parte Fortuna', longitude: fortuna, body: null, speed: 0 });
    const aspectosExt = findAspects(puntosExt, { orbs: ORBES[$('orbes').value] });

    ultimosDatos = {
      nombre, fechaTexto, lugarTexto, jd, lat, lon,
      planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven,
      fortuna, aspectosExt,
      orientacion: $('orientacion').value,
      aspectos: aspectos.map((a) => ({
        tipo: a.aspect.name, de: a.from.name, a: a.to.name, orb: a.orb, maxOrb: a.maxOrb, applying: a.applying,
      })),
    };
    dibujarCarta($('rueda'), ultimosDatos);
    renderInterpretacion($('interpretacion'), ultimosDatos);
    renderFichasTema($('fichas-tema'), ultimosDatos, swe);
    renderProspectiva($('prospectiva'), ultimosDatos);
    renderTransitos($('transitos'), ultimosDatos, swe);
    renderRevolucionSolar($('revolucion-solar'), ultimosDatos, swe);
renderFirdaria($('firdaria'), ultimosDatos);
    renderAyuda($('ayuda'));

    // Resumen
    $('resumen').hidden = false;
    $('resumen').innerHTML = `<strong>${esc(nombre)}</strong> · ${fechaTexto} · ${esc(lugarTexto)}`;
    $('pestanas').hidden = false;

    // Tabla de posiciones
    const tbP = $('tabla-posiciones').querySelector('tbody');
    tbP.innerHTML = planetas.map((p) =>
      `<tr><td class="glifo">${p.glifo}</td><td>${esc(p.nombre)}</td><td>${formatGrado(p.lon)}</td><td>${terminoDe(p.lon).planeta}</td><td>${p.casa}</td><td class="retro">${p.retro ? 'R' : ''}</td></tr>`
    ).join('');

    // Tabla de casas
    const tbC = $('tabla-casas').querySelector('tbody');
    tbC.innerHTML = casa.cusps.slice(0, 12).map((c, i) =>
      `<tr><td>${i + 1}</td><td>${formatGrado(c)}</td></tr>`
    ).join('');

    // Tabla de aspectos
    const tbA = $('tabla-aspectos').querySelector('tbody');
    tbA.innerHTML = aspectos.map((a) =>
      `<tr><td>${NOMBRE_ASPECTO_ES[a.aspect.name] || a.aspect.name}</td><td>${esc(a.from.name)} – ${esc(a.to.name)}</td><td>${formatOrbe(a.orb)}</td><td>${a.applying ? 'Aplicativo' : 'Separativo'}</td></tr>`
    ).join('');

    // Detalles técnicos
    const jdFrac = jd - (Math.floor(jd) + 0.5);
    const utcH = Math.floor(jdFrac * 24), utcM = Math.floor((jdFrac * 24 - utcH) * 60);
    const dT = swe.deltaT(jd) * 1440;
    const sis = $('sistema').options[$('sistema').selectedIndex].text;
    const det = [
      `JD ${jd.toFixed(6)}`, `Hora UT ${String(utcH).padStart(2, '0')}:${String(utcM).padStart(2, '0')}`,
      `ΔT ${dT.toFixed(1)} min`, `Sistema: ${sis}`,
      efem === 'swiss' ? 'Efemérides: JPL (archivos .se1)' : 'Efemérides: Moshier (sin .se1 en ese rango)',
      fortuna !== null ? `Fortuna: ${formatGrado(fortuna)}` : null,
    ].filter(Boolean);
    $('detalles').hidden = false;
    $('detalles').innerHTML = det.map((d) => `<span>${d}</span>`).join(' · ');

    setEstado('ok', efem === 'swiss'
      ? 'Carta calculada con efemérides JPL (tus archivos .se1)'
      : 'Carta calculada · aviso: sin archivo .se1 para ese rango, se usó la teoría Moshier');
  } catch (e) {
    setEstado('error', 'Error: ' + e.message);
    console.error(e);
  } finally {
    btn.disabled = false;
  }
}

// ---------- Carta de ejemplo ----------
const CARTAS_PRUEBA = {
  p1: { // John Lennon - 09/10/1940 18:30 BST (UTC+1), Liverpool
    nombre: 'John Lennon', ciudad: 'Liverpool', pais: 'Reino Unido',
    dia: 9, mes: 10, anio: 1940, hora: 18, minuto: 30,
    lat: 53.4084, lon: -2.9916, lugar: 'Liverpool, Reino Unido',
    tz: 'Europe/London', utc: 1,
  },
  p2: { // Marie Curie - 07/11/1867 22:15 LMT, Varsovia
    nombre: 'Marie Curie', ciudad: 'Varsovia', pais: 'Polonia',
    dia: 7, mes: 11, anio: 1867, hora: 22, minuto: 15,
    lat: 52.2297, lon: 21.0122, lugar: 'Varsovia, Polonia',
    tz: 'Europe/Warsaw', utc: 1.4,
  },
};

function cargarCarta(c) {
  $('nombre').value = c.nombre;
  $('dia').value = c.dia; $('mes').value = c.mes; $('anio').value = c.anio; $('ac').checked = false;
  $('hora').value = c.hora; $('minuto').value = c.minuto; $('hora-desconocida').checked = false;
  $('hora').disabled = false; $('minuto').disabled = false;
  $('lugar').value = c.lugar;
  $('lat').value = c.lat; $('lon').value = c.lon;
  $('zona-info').textContent = 'Zona: ' + c.tz;
  $('utc-manual').checked = false; $('fila-utc').hidden = true;
  $('utc').value = c.utc;
  ciudadSel = { n: c.ciudad || c.nombre, p: c.pais || '', lat: c.lat, lon: c.lon, t: c.tz };
  calcular();
}

function ahora() {
  const hoy = new Date();
  cargarCarta({
    nombre: 'Ahora', dia: hoy.getDate(), mes: hoy.getMonth() + 1, anio: hoy.getFullYear(),
    hora: hoy.getHours(), minuto: hoy.getMinutes(),
    lat: 40.4168, lon: -3.7038, lugar: 'Madrid, España', tz: 'Europe/Madrid', utc: 0,
  });
}

// ---------- Pestañas de resultado ----------
function activarPestana(nombre) {
  document.querySelectorAll('.pestana').forEach((b) => {
    b.classList.toggle('activa', b.dataset.pestana === nombre);
  });
  document.querySelectorAll('.panel-pestana').forEach((p) => {
    p.hidden = (p.id !== 'pestana-' + nombre);
  });
  // El canvas no se dibuja bien dentro de un panel oculto: redibujar al volver a «Carta».
  if (nombre === 'carta' && ultimosDatos) {
    dibujarCarta($('rueda'), ultimosDatos);
  }
}

// ---------- Eventos ----------
function iniciar() {
  $('lugar').addEventListener('input', () => {
    const res = buscarCiudades($('lugar').value);
    ultimasSugerencias = res;
    const ul = $('sugerencias');
    if (!res.length) { ul.hidden = true; return; }
    ul.innerHTML = res.map((c, i) =>
      `<li data-i="${i}">${esc(c.n)}, ${esc(c.p)} — ${esc(c.r || '')} <small>(${esc(c.t || '')})</small></li>`
    ).join('');
    ul.hidden = false;
  });

  $('sugerencias').addEventListener('click', (ev) => {
    const li = ev.target.closest('li');
    if (!li) return;
    const c = ultimasSugerencias[+li.dataset.i];
    if (!c) return;
    ciudadSel = c;
    $('lugar').value = `${c.n}, ${c.p}`;
    $('lat').value = c.lat;
    $('lon').value = c.lon;
    $('zona-info').textContent = 'Zona: ' + (c.t || 'desconocida');
    $('sugerencias').hidden = true;
  });

  document.addEventListener('click', (ev) => {
    if (!ev.target.closest('#lugar') && !ev.target.closest('#sugerencias')) $('sugerencias').hidden = true;
  });

  $('utc-manual').addEventListener('change', () => { $('fila-utc').hidden = !$('utc-manual').checked; });
  $('hora-desconocida').addEventListener('change', () => {
    const d = $('hora-desconocida').checked;
    $('hora').disabled = d; $('minuto').disabled = d;
    if (d) { $('hora').value = 12; $('minuto').value = 0; }
  });
  $('calcular').addEventListener('click', calcular);
  $('ejemplo').addEventListener('click', ahora);
  $('carta-prueba').addEventListener('change', (ev) => {
    const c = CARTAS_PRUEBA[ev.target.value];
    if (c) cargarCarta(c);
  });

  $('orientacion').addEventListener('change', () => {
    if (ultimosDatos) {
      ultimosDatos.orientacion = $('orientacion').value;
      dibujarCarta($('rueda'), ultimosDatos);
    }
  });

  window.addEventListener('resize', () => {
    if (ultimosDatos) dibujarCarta($('rueda'), ultimosDatos);
  });

  document.querySelectorAll('.pestana').forEach((b) => {
    b.addEventListener('click', () => activarPestana(b.dataset.pestana));
  });
}

// ---------- Arranque ----------
async function init() {
  try {
    // Parámetro de URL opcional: ?orientacion=casas (útil para enlaces directos)
    const params = new URLSearchParams(location.search);
    if (params.get('orientacion') === 'casas') $('orientacion').value = 'casas';
    await cargarCiudades();
    setEstado('info', 'Cargando motor de cálculo (Swiss Ephemeris WebAssembly)…');
    swe = await createSwissEph();
    try { await cargarRecetario(); } catch (e) { console.warn('Recetario no disponible:', e); }
    iniciar();
    await calcular();
  } catch (e) {
    setEstado('error', 'Error al iniciar: ' + e.message);
    console.error(e);
  }
}

init();
