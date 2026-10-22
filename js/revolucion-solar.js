// ============================================================
//  Revolución Solar — prospectiva
//  Calcula el retorno anual del Sol a su longitud natal y
//  levanta la carta de la revolución (RS) con Swiss Ephemeris.
//
//  Fuentes de interpretación:
//   · Tito Maciá, "La Revolución Solar y sus Atacires" (superposiciones, Sol y
//     regente/astrodinas, Parte del Infortunio, atacires de la revolución)
//   · "Revolución Solar — Cómo Trabajarla" (metodología PASO 1-12)
//   · comparación natal↔RS: Volguine (volguine.json)
//  v2 (12-oct-2026): ampliaciones Maciá + cálculo de atacires (≈1°/día).
// ============================================================
import { Body, Flag } from './vendor/dist/index.js';
import { FetchEphemeris } from './vendor/dist/ephemeris/sources.js';
import { NOMBRES_SIGNOS, dibujarCarta } from './carta.js';

const CUERPOS = [
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
];

// Regencia tradicional (Marte rige Escorpio, Saturno Acuario, Júpiter Piscis)
const REGENTES = {
  Aries: 'Marte', Tauro: 'Venus', Géminis: 'Mercurio', Cáncer: 'Luna',
  Leo: 'Sol', Virgo: 'Mercurio', Libra: 'Venus', Escorpio: 'Marte',
  Sagitario: 'Júpiter', Capricornio: 'Saturno', Acuario: 'Saturno', Piscis: 'Júpiter',
};

const norm = (lon) => (((lon % 360) + 360) % 360);
const signoDe = (lon) => NOMBRES_SIGNOS[Math.floor(norm(lon) / 30)];

// ---------- Carga del corpus de interpretación ----------
let corpusPromise = null;
export function cargarCorpus() {
  if (!corpusPromise) {
    corpusPromise = fetch('datos/revolucion-solar.json').then((r) => r.json());
  }
  return corpusPromise;
}

// Devuelve los párrafos de una entrada del corpus (o [] si no existe)
function buscarCorpus(corpus, tipo, clave) {
  const e = (corpus.entradas || []).find((x) => x.tipo === tipo && (x.signo === clave || x.casa === clave || x.clave === clave));
  return e ? e.texto : [];
}

// Texto de una entrada única del corpus (sin clave)
function textoDe(corpus, tipo) {
  const e = (corpus.entradas || []).find((x) => x.tipo === tipo);
  return e ? e.texto : [];
}

// ---------- Ampliaciones v2 (12-oct-2026) — Tito Maciá ----------
// Superposiciones ampliadas, Parte del Infortunio (Asc + Marte − Saturno),
// atacires de la revolución (≈1°/día) y astrodinas del regente.
export function calcularAmpliaciones(rs, datosNatal, corpus) {
  const C = corpus || { entradas: [] };
  const buscar = (tipo, clave) => buscarCorpus(C, tipo, clave);
  const parr = (txt) => (txt || []).map((x) => `<p>${x}</p>`).join('');

  // a) textos nuevos de superposición (Maciá)
  const mAscCasa = buscar('asc-casa-natal', rs.ascCasaNatal);
  const mMcCasa = buscar('mc-casa-natal', rs.mcCasaNatal);
  const mRegCasa = rs.regenteCasa == null ? [] : buscar('regente-casa-macia', rs.regenteCasa);

  // b) ASC de la RS junto a un planeta NATAL (a menos de 2°)
  const ascCerca = (datosNatal.planetas || []).map((q) => {
    const d = Math.abs(((rs.asc - q.lon + 540) % 360) - 180);
    return { nombre: q.nombre, distancia: d };
  }).filter((q) => q.distancia <= 2);
  const ascCercaTexto = ascCerca.length ? textoDe(C, 'asc-planeta') : [];

  // c) Parte del Infortunio
  const marte = rs.planetas.find((q) => q.nombre === 'Marte');
  const saturno = rs.planetas.find((q) => q.nombre === 'Saturno');
  let infortunio = null;
  if (marte && saturno) {
    const lon = norm(rs.asc + marte.lon - saturno.lon);
    const casa = casaDe(lon, rs.cusps);
    infortunio = { lon, casa, dias: Math.round(norm(lon - rs.asc)), texto: buscar('infortunio-casa', casa) };
  }
  const infortunioGuia = textoDe(C, 'infortunio-guia');
  const infortunioConj = textoDe(C, 'infortunio-conjuncion');

  // d) Atacires de la revolución (~1°/día)
  const atacires = [];
  for (let k = 0; k < 12; k++) atacires.push({ d: norm(rs.cusps[k] - rs.asc), txt: `el atacir del Ascendente entra en la casa ${k + 1} (RS)` });
  for (const q of rs.planetas) {
    atacires.push({ d: norm(q.lon - rs.asc), txt: `el atacir del Ascendente llega a ${q.nombre}` });
    atacires.push({ d: norm(q.lon - rs.mc), txt: `el atacir del Mediocielo llega a ${q.nombre}` });
  }
  const ORBES_PAR = { 0: 6, 60: 4, 90: 5, 120: 5, 180: 6 };
  for (const a of rs.planetas) {
    for (const b of rs.planetas) {
      if (a === b) continue;
      const dif = norm(b.lon - a.lon);
      const alinea = Object.keys(ORBES_PAR).some((ang) => Math.abs(((dif - Number(ang) + 540) % 360) - 180) <= ORBES_PAR[ang]);
      if (alinea) atacires.push({ d: dif, txt: `el atacir de ${a.nombre} llega a ${b.nombre}` });
    }
  }
  atacires.sort((x, y) => x.d - y.d);
  for (const a of atacires) {
    const f = jdAFecha(rs.jd + a.d);
    a.fechaTexto = `${String(f.dia).padStart(2, '0')}/${String(f.mes).padStart(2, '0')}/${f.anio}`;
  }
  const atacirGuia = textoDe(C, 'atacir-guia');
  const atacirCasas = [];
  for (let k = 1; k <= 12; k++) { const tx = buscar('atacir-asc-casa', k); if (tx.length) atacirCasas.push({ casa: k, texto: tx }); }
  const atacirTextos = {
    mc: textoDe(C, 'atacir-mc'),
    planetas: textoDe(C, 'atacir-planetas-guia'),
    sol: textoDe(C, 'atacir-sol'),
    luna: textoDe(C, 'atacir-luna'),
    venus: textoDe(C, 'atacir-venus'),
    marte: textoDe(C, 'atacir-marte'),
    saturno: textoDe(C, 'atacir-saturno'),
  };

  // e) Astrodinas del regente
  const regP = rs.planetas.find((q) => q.nombre === rs.regenteAsc) || null;
  const ASTRO_ASPECTOS = [[0, 10], [180, 10], [90, 6], [120, 4], [60, 3], [144, 2], [36, 2], [45, 2], [135, 2], [150, 2], [30, 2]];
  const astroAspectos = [];
  if (regP) {
    for (const q of rs.planetas) {
      if (q === regP) continue;
      const dif = norm(q.lon - regP.lon);
      for (const [ang, val] of ASTRO_ASPECTOS) {
        const dist = Math.abs(((dif - ang + 540) % 360) - 180);
        const orb = [0, 60, 90, 120, 180].includes(ang) ? 6 : 2;
        if (dist <= orb) { astroAspectos.push({ nombre: q.nombre, ang, val, dist }); break; }
      }
    }
  }
  const sumaAstro = astroAspectos.reduce((s, a) => s + a.val, 0);
  const bandaAstro = sumaAstro > 40 ? 'año extraordinario' : sumaAstro > 30 ? 'año notable'
    : sumaAstro > 20 ? 'año complejo' : sumaAstro >= 10 ? 'año normal (sin grandes cambios)' : 'tema menor (sin crisis ni cambios)';
  const astroPos = [];
  if (regP) {
    if (REGENTES[regP.signo] === regP.nombre) astroPos.push({ v: 5, t: `en su domicilio (${regP.signo})` });
    const EXALT = { Sol: 'Aries', Luna: 'Tauro', Mercurio: 'Virgo', Venus: 'Piscis', Marte: 'Capricornio', 'Júpiter': 'Cáncer', Saturno: 'Libra' };
    if (EXALT[regP.nombre] === regP.signo) astroPos.push({ v: 4, t: `en exaltación (${regP.signo})` });
    const CALDEO = ['Marte', 'Sol', 'Venus', 'Mercurio', 'Luna', 'Saturno', 'Júpiter'];
    if (CALDEO[Math.floor(norm(regP.lon) / 10) % 7] === regP.nombre) astroPos.push({ v: 2, t: 'rige su decanato (faz)' });
    const ddSig = (Math.floor(norm(regP.lon) / 30) * 12 + Math.floor((norm(regP.lon) % 30) / 2.5)) % 12;
    if (REGENTES[NOMBRES_SIGNOS[ddSig]] === regP.nombre) astroPos.push({ v: 1, t: 'rige su dodecatemoria' });
    if (!regP.retro) astroPos.push({ v: 1, t: 'directo' });
    const GOZOS = { Mercurio: 1, Luna: 3, Venus: 5, Marte: 6, Sol: 9, 'Júpiter': 11, Saturno: 12 };
    if (GOZOS[regP.nombre] === regP.casa) astroPos.push({ v: 3, t: `en su gozo (casa ${regP.casa})` });
  }
  const sumaPos = astroPos.reduce((s, a) => s + a.v, 0);
  const astroNotas = [];
  for (const k of ['domicilio', 'exaltacion', 'dodecatemoria', 'sobre-tierra', 'oriental', 'directo', 'retrogrado', 'gozo', 'dispositor', 'destierro', 'caida', 'peregrino', 'recepcion']) {
    const tx = buscar('astrodina-nota', k);
    if (tx.length) astroNotas.push({ clave: k, texto: tx });
  }
  const astroGuias = { intro: textoDe(C, 'astrodinas-intro'), aspectos: textoDe(C, 'astrodinas-aspectos'), posicion: textoDe(C, 'astrodinas-posicion') };

  // f) notas finales
  const notasFinales = {
    relocacion: textoDe(C, 'relocacion'),
    fortuna: textoDe(C, 'fortuna-guia'),
    afortunar: textoDe(C, 'fortuna-afortunar'),
  };

  return { parr, mAscCasa, mMcCasa, mRegCasa, ascCerca, ascCercaTexto, infortunio, infortunioGuia, infortunioConj, atacires, atacirGuia, atacirCasas, atacirTextos, astrodinas: { regP, aspectos: astroAspectos, suma: sumaAstro, banda: bandaAstro, pos: astroPos, sumaPos, notas: astroNotas, guias: astroGuias }, notasFinales };
}

// ---------- Carga del corpus Volguine ----------
let corpusVolguinePromise = null;
export function cargarCorpusVolguine() {
  if (!corpusVolguinePromise) {
    corpusVolguinePromise = fetch('datos/volguine.json').then((r) => r.json());
  }
  return corpusVolguinePromise;
}

function buscarVolguine(corpus, tipo, match) {
  const e = (corpus.entradas || []).find((x) => x.tipo === tipo && match(x));
  return e ? e.texto : [];
}

function casaDe(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((lon - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
}

function gradosTexto(lon) {
  const s = Math.floor(norm(lon) / 30);
  const d = Math.floor(norm(lon) % 30);
  const m = Math.floor(((norm(lon) % 30) % 1) * 60);
  return `${NOMBRES_SIGNOS[s]} ${d}°${String(m).padStart(2, '0')}'`;
}

// ---------- Zonas de transición (detalle fino) ----------
// Un punto a menos de `umbral` grados de una cúspide de la carta de referencia
// tiene lectura ambivalente: la casa estricta (por posición) se complementa con
// la casa adyacente. Lo mismo ocurre en los bordes de signo (0°-umbral y
// 30°-umbral). La tradición apenas documenta estas franjas; criterio de la app:
// asignación estricta + lectura complementaria explícita cuando el orbe es
// pequeño. Utilizable también para sinastría y otras comparaciones de cartas.
export function zonaTransicion(lon, cusps, umbral = 2) {
  const lonN = norm(lon);
  let casa = 1;
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (norm(lonN - a) < norm(b - a)) { casa = i + 1; break; }
  }
  const cuspEntrada = cusps[casa - 1];
  const cuspSalida = cusps[casa % 12];
  const distEntrada = Math.min(norm(lonN - cuspEntrada), 360 - norm(lonN - cuspEntrada));
  const distSalida = Math.min(norm(lonN - cuspSalida), 360 - norm(lonN - cuspSalida));
  const enEntrada = distEntrada <= umbral;
  const enSalida = distSalida <= umbral;
  const tamCasa = norm(cuspSalida - cuspEntrada);
  const posicionEnCasa = tamCasa > 0 ? norm(lonN - cuspEntrada) / tamCasa : 0;

  const signoIdx = Math.floor(lonN / 30);
  const gradoEnSigno = lonN % 30;
  const enBordeSigno = gradoEnSigno <= umbral || 30 - gradoEnSigno <= umbral;
  let signoComplementario = null;
  if (30 - gradoEnSigno <= umbral) signoComplementario = (signoIdx + 1) % 12;    // saliendo del signo
  else if (gradoEnSigno <= umbral) signoComplementario = (signoIdx + 11) % 12;   // entrando en el signo

  const casaComplementaria = enSalida ? (casa % 12) + 1 : enEntrada ? ((casa - 2 + 12) % 12) + 1 : null;

  return {
    casa,
    distEntrada, distSalida,
    enEntrada, enSalida, enTransicion: enEntrada || enSalida,
    casaComplementaria,
    lado: enSalida ? 'salida' : 'entrada',
    posicionEnCasa,
    gradoEnSigno, enBordeSigno,
    signoComplementario: signoComplementario === null ? null : NOMBRES_SIGNOS[signoComplementario],
  };
}

function notaZona(z, nombrePunto) {
  if (!z || !z.enTransicion || !z.casaComplementaria) return '';
  const distC = Math.min(z.distEntrada, z.distSalida);
  return `<p class="nota">⚖ <strong>Zona de transición</strong>: el ${nombrePunto} anual cae a <strong>${distC.toFixed(2)}°</strong> de la cúspide entre las casas ${z.casa} y ${z.casaComplementaria} de la natal. Técnicamente está en la casa ${z.casa}; muchos intérpretes lo leerían también (o principalmente) en la casa ${z.casaComplementaria}.</p>`;
}

function notaBordeSigno(z, nombrePunto) {
  if (!z || !z.enBordeSigno || !z.signoComplementario) return '';
  const distB = Math.min(z.gradoEnSigno, 30 - z.gradoEnSigno);
  return `<p class="nota">⚖ <strong>Borde de signo</strong>: el ${nombrePunto} anual está a ${distB.toFixed(1)}° del cambio a <strong>${z.signoComplementario}</strong>; su lectura participa de ambos signos.</p>`;
}

// Conversión JD → calendario gregoriano (UT)
function jdAFecha(jd) {
  const Z = Math.floor(jd + 0.5);
  const F = jd + 0.5 - Z;
  let A = Z;
  if (Z >= 2299161) {
    const alfa = Math.floor((Z - 1867216.25) / 36524.25);
    A = Z + 1 + alfa - Math.floor(alfa / 4);
  }
  const B = A + 1524;
  const C = Math.floor((B - 122.1) / 365.25);
  const D = Math.floor(365.25 * C);
  const E = Math.floor((B - D) / 30.6001);
  const dia = B - D - Math.floor(30.6001 * E) + F;
  const mes = E < 14 ? E - 1 : E - 13;
  const anio = mes > 2 ? C - 4716 : C - 4715;
  const diaInt = Math.floor(dia);
  const frac = dia - diaInt;
  const hora = Math.floor(frac * 24);
  const min = Math.floor((frac * 24 - hora) * 60);
  return { anio, mes, dia: diaInt, hora, min };
}

// ---------- Núcleo puro (testable) ----------
// Encuentra el JD del retorno del Sol a su longitud natal. Ancla la búsqueda
// en el cumpleaños del año `anio` (el retorno cae siempre a ±1 día de él) y
// barre día a día para acotar el cruce, luego afina por bisección. Robusto ante
// la velocidad variable del Sol (perihelio/afelio).
export function encontrarRetornoSolar(swe, solNatal, anio, jdNatal) {
  const nac = jdAFecha(jdNatal);
  const jdCumple = swe.julianDay(anio, nac.mes, nac.dia, 0);
  let jd = jdCumple - 3;
  let prevD = norm(swe.calcWithSign(jd, Body.Sun, { flags: Flag.Speed }).longitude - solNatal);
  for (let i = 0; i < 8; i++) { // cubre [cumpleaños-3, cumpleaños+5]
    const nextJd = jd + 1;
    const nextD = norm(swe.calcWithSign(nextJd, Body.Sun, { flags: Flag.Speed }).longitude - solNatal);
    if (prevD > 180 && nextD < 180) {
      let lo = jd, hi = nextJd;
      for (let k = 0; k < 50; k++) {
        const mid = (lo + hi) / 2;
        const d = norm(swe.calcWithSign(mid, Body.Sun, { flags: Flag.Speed }).longitude - solNatal);
        if (d < 180) hi = mid; else lo = mid;
      }
      return (lo + hi) / 2;
    }
    jd = nextJd;
    prevD = nextD;
  }
  return null;
}

// Levanta la carta de la revolución solar del año `anio`.
// `datos` es la carta natal (ultimosDatos): { planetas, cusps, asc, mc, jd }.
export function calcularRevolucionSolar(swe, datos, anio, lat, lon) {
  const sol = datos.planetas.find((p) => p.nombre === 'Sol');
  if (!sol) return null;
  const solNatal = sol.lon;

  // Lugar de cálculo: el indicado (si es válido) o el natal por defecto.
  const latUso = Number.isFinite(lat) ? lat : datos.lat;
  const lonUso = Number.isFinite(lon) ? lon : datos.lon;

  const jd = encontrarRetornoSolar(swe, solNatal, anio, datos.jd);
  const casa = swe.houses(jd, latUso, lonUso, 'P');
  const f = jdAFecha(jd);

  const planetas = CUERPOS.map((c) => {
    const p = swe.calcWithSign(jd, c.body, { flags: Flag.Speed });
    const lon = p.longitude;
    return {
      nombre: c.nombre, glifo: c.glifo, lon,
      signo: signoDe(lon), casa: casaDe(lon, casa.cusps), retro: p.retrograde,
      zonaNatal: zonaTransicion(lon, datos.cusps),
    };
  });

  const ascSigno = signoDe(casa.ascendant);
  const regenteAsc = REGENTES[ascSigno];
  const solCasa = casaDe(solNatal, casa.cusps); // el Sol vuelve a su grado natal → casa en RS
  const ascCasaNatal = casaDe(casa.ascendant, datos.cusps); // ASC de RS superpuesto a CN
  const mcCasaNatal = casaDe(casa.midheaven, datos.cusps);   // MC de RS superpuesto a CN
  const superposiciones = casa.cusps.map((cusp, i) => ({ anual: i + 1, natal: casaDe(cusp, datos.cusps) }));

  const ascZona = zonaTransicion(casa.ascendant, datos.cusps);
  const mcZona = zonaTransicion(casa.midheaven, datos.cusps);

  const regente = planetas.find((p) => p.nombre === regenteAsc);
  const regenteCasa = regente ? regente.casa : null;
  const regenteSigno = regente ? regente.signo : null;

  return {
    anio, jd, fecha: f,
    fechaTexto: `${String(f.dia).padStart(2, '0')}/${String(f.mes).padStart(2, '0')}/${f.anio} ${String(f.hora).padStart(2, '0')}:${String(f.min).padStart(2, '0')} UT`,
    solNatal,
    planetas, cusps: casa.cusps, asc: casa.ascendant, mc: casa.midheaven,
    ascSigno, regenteAsc, solCasa, ascCasaNatal, mcCasaNatal, regenteCasa, regenteSigno,
    superposiciones, ascZona, mcZona,
    lat: latUso, lon: lonUso,
  };
}

// ---------- Render ----------
const estado = { anio: new Date().getFullYear() };

export function renderRevolucionSolar(contenedor, datos, swe) {
  if (!datos || !datos.planetas || datos.planetas.length === 0) {
    contenedor.hidden = true;
    return;
  }
  contenedor.hidden = false;
  estado.datos = datos;

  if (!contenedor.dataset.init) {
    contenedor.dataset.init = '1';
    contenedor.innerHTML = `
      <h2>Revolución Solar</h2>
      <p class="nota-prospectiva">Retorno anual del Sol a su grado natal: carta del año, que se lee en superposición con la natal. Fuentes de la técnica: Tito Maciá, <em>La Revolución Solar y sus Atacires</em>; metodología «Cómo Trabajarla»; comparación natal↔RS de <strong>Volguine</strong>. Los textos interpretativos son de <strong>redacción propia</strong> sobre esas técnicas (no reproducen las ediciones originales; revisión de redacción: 25-ago-2026 Volguine · 12-oct-2026 Maciá).</p>
      <div class="prospectiva-controles">
        <label class="campo mini"><span>Año</span><input id="rs-anio" type="number" min="1900" max="2300" value="${estado.anio}"></label>
        <label class="campo mini"><span>Latitud</span><input id="rs-lat" type="number" step="0.0001" min="-90" max="90" placeholder="Lugar de cálculo"></label>
        <label class="campo mini"><span>Longitud</span><input id="rs-lon" type="number" step="0.0001" min="-180" max="180" placeholder="Oeste = negativo"></label>
        <button type="button" id="rs-lugar-natal" class="boton-secundario" title="Restablece al lugar de nacimiento">Lugar de nacimiento</button>
        <button type="button" id="rs-calcular" class="boton-secundario">Calcular revolución</button>
      </div>
      <div id="rs-resultado" class="prosp-resultado"></div>
      <div class="rueda" style="margin-top:12px"><canvas id="rs-rueda"></canvas></div>
      <p class="nota">En azul, superpuesta: la carta natal (cúspides, ASC/MC y planetas). Rueda orientada con el Ascendente anual a la izquierda (modo casas).</p>
    `;
    contenedor.querySelector('#rs-calcular').addEventListener('click', pintar);
    contenedor.querySelector('#rs-anio').addEventListener('change', (e) => { estado.anio = +e.target.value; pintar(); });
    contenedor.querySelector('#rs-lugar-natal').addEventListener('click', () => { usarLugarNatal(); pintar(); });
  } else {
    contenedor.querySelector('#rs-anio').value = estado.anio;
  }

  function usarLugarNatal() {
    contenedor.querySelector('#rs-lat').value = (datos.lat != null && Number.isFinite(datos.lat)) ? datos.lat : '';
    contenedor.querySelector('#rs-lon').value = (datos.lon != null && Number.isFinite(datos.lon)) ? datos.lon : '';
  }
  usarLugarNatal();

  async function pintar() {
    const datos = estado.datos;
    const out = contenedor.querySelector('#rs-resultado');
    const anio = +contenedor.querySelector('#rs-anio').value || estado.anio;
    estado.anio = anio;
    const lat = parseFloat(contenedor.querySelector('#rs-lat').value);
    const lon = parseFloat(contenedor.querySelector('#rs-lon').value);
    const latOk = Number.isFinite(lat) && lat >= -90 && lat <= 90;
    const lonOk = Number.isFinite(lon) && lon >= -180 && lon <= 180;
    out.innerHTML = '<p class="nota">Calculando retorno del Sol…</p>';
    try {
      await swe.loadEphemeris(new FetchEphemeris({ baseUrl: 'datos/ephe' }), {
        fromYear: anio - 1, toYear: anio + 1, kinds: ['planets', 'moon'],
      });
      const [corpus, corpusV] = await Promise.all([cargarCorpus(), cargarCorpusVolguine()]);
      const rs = calcularRevolucionSolar(swe, datos, anio, latOk ? lat : undefined, lonOk ? lon : undefined);
      if (!rs) { out.innerHTML = '<p class="nota">No se pudo calcular (falta el Sol natal).</p>'; return; }
      pintarResultado(out, rs, corpus, corpusV);
    } catch (e) {
      out.innerHTML = `<p class="nota">Error: ${e.message}</p>`;
      console.error(e);
    }
  }

  function pintarResultado(out, rs, corpus, corpusV) {
    const filas = rs.planetas.map((p) => {
      const marcas = [];
      if (p.zonaNatal?.enBordeSigno) marcas.push(`borde de ${p.zonaNatal.signoComplementario}`);
      if (p.zonaNatal?.enTransicion) marcas.push(`cúspide casa ${p.zonaNatal.casaComplementaria} natal`);
      const nota = marcas.length ? ` <span class="nota">(${marcas.join('; ')})</span>` : '';
      return `<tr><td class="glifo">${p.glifo}</td><td>${p.nombre}${nota}</td><td>${gradosTexto(p.lon)}</td><td>Casa ${p.casa}</td><td class="retro">${p.retro ? 'R' : ''}</td></tr>`;
    }).join('');
    const parrafos = (txt) => txt.map((t) => `<p>${t}</p>`).join('');

    // Volguine — comparación natal↔RS
    const vAscCasa = buscarVolguine(corpusV, 'asc-casa-natal', (x) => x.casa === rs.ascCasaNatal);
    const vMcCasa = buscarVolguine(corpusV, 'mc-casa-natal', (x) => x.casa === rs.mcCasaNatal);
    const vAscSigno = buscarVolguine(corpusV, 'asc-signo', (x) => x.signo === rs.ascSigno);

    const ascZ = rs.ascZona || {};
    const mcZ = rs.mcZona || {};
    // Lectura complementaria cuando el punto cae en la franja de una cúspide natal
    const ascComp = (ascZ.enTransicion && ascZ.casaComplementaria)
      ? buscarVolguine(corpusV, 'asc-casa-natal', (x) => x.casa === ascZ.casaComplementaria) : [];
    const mcComp = (mcZ.enTransicion && mcZ.casaComplementaria)
      ? buscarVolguine(corpusV, 'mc-casa-natal', (x) => x.casa === mcZ.casaComplementaria) : [];
    // Lectura complementaria cuando el ASC cae en el borde de un signo
    const ascSignoComp = (ascZ.enBordeSigno && ascZ.signoComplementario)
      ? buscarVolguine(corpusV, 'asc-signo', (x) => x.signo === ascZ.signoComplementario) : [];

    const planetasHtml = rs.planetas.map((p) => {
      const t = buscarVolguine(corpusV, 'planeta-casa', (x) => x.planeta === p.nombre && x.casa === p.casa);
      return t.length ? `<div class="receta-tarjeta interp"><h4>${p.glifo} ${p.nombre} en casa ${p.casa}</h4>${parrafos(t)}</div>` : '';
    }).join('');

    const supHtml = rs.superposiciones.map((s) => {
      if (s.anual === 1 || s.anual === 10) return ''; // ASC y MC ya tratados
      const t = buscarVolguine(corpusV, 'superposicion', (x) => x.anual === s.anual && x.natal === s.natal);
      return t.length ? `<div class="receta-tarjeta interp"><h4>Casa ${s.anual} de la RS sobre la casa ${s.natal} natal</h4>${parrafos(t)}</div>` : '';
    }).join('');

    // Tito Maciá — regente del ASC (único que Volguine no cubre explícitamente)
    const regTxt = buscarCorpus(corpus, 'regente-casa', rs.regenteCasa);
    let amp = null;
    try { amp = calcularAmpliaciones(rs, estado.datos, corpus); } catch (e) { console.warn('ampliaciones RS:', e); }

    out.innerHTML = `
      <h3>Retorno del Sol · ${rs.fechaTexto}</h3>
      <p class="nota">Lugar de cálculo: ${rs.lat.toFixed(4)}°, ${rs.lon.toFixed(4)}°.</p>
      <div class="grupo-interp">
        <div class="receta-tarjeta"><h4>Ascendente anual</h4><p>${rs.ascSigno} (${gradosTexto(rs.asc)}) · regente: <strong>${rs.regenteAsc}</strong> · cae en la casa ${rs.ascCasaNatal} de la natal.</p>${notaZona(ascZ, 'Ascendente')}${notaBordeSigno(ascZ, 'Ascendente')}</div>
        <div class="receta-tarjeta"><h4>Mediocielo anual</h4><p>${gradosTexto(rs.mc)} · cae en la casa ${rs.mcCasaNatal} de la natal.</p>${notaZona(mcZ, 'Mediocielo')}${notaBordeSigno(mcZ, 'Mediocielo')}</div>
        <div class="receta-tarjeta"><h4>Sol de la revolución</h4><p>${gradosTexto(rs.solNatal)} · casa ${rs.solCasa} de la RS.</p></div>
      </div>

      <h3>Comparación con la natal (Volguine · Maciá)</h3>
      ${vAscCasa.length ? `<div class="receta-tarjeta interp"><h4>Ascendente anual en la casa ${rs.ascCasaNatal} natal</h4>${parrafos(vAscCasa)}</div>` : ''}
      ${ascComp.length ? `<div class="receta-tarjeta interp"><h4>Ascendente anual en la casa ${ascZ.casaComplementaria} natal · <em>lectura complementaria (zona de transición)</em></h4>${parrafos(ascComp)}</div>` : ''}
      ${vMcCasa.length ? `<div class="receta-tarjeta interp"><h4>Mediocielo anual en la casa ${rs.mcCasaNatal} natal</h4>${parrafos(vMcCasa)}</div>` : ''}
      ${mcComp.length ? `<div class="receta-tarjeta interp"><h4>Mediocielo anual en la casa ${mcZ.casaComplementaria} natal · <em>lectura complementaria (zona de transición)</em></h4>${parrafos(mcComp)}</div>` : ''}
      ${amp && amp.mAscCasa.length ? `<div class="receta-tarjeta interp"><h4>Ascendente anual en la casa ${rs.ascCasaNatal} natal · <em>lectura de Tito Maciá</em></h4>${amp.parr(amp.mAscCasa)}</div>` : ''}
      ${amp && amp.mMcCasa.length ? `<div class="receta-tarjeta interp"><h4>Mediocielo anual en la casa ${rs.mcCasaNatal} natal · <em>lectura de Tito Maciá</em></h4>${amp.parr(amp.mMcCasa)}</div>` : ''}

      <h3>El clima del año (Volguine)</h3>
      ${vAscSigno.length ? `<div class="receta-tarjeta interp"><h4>Ascendente en ${rs.ascSigno}</h4>${parrafos(vAscSigno)}</div>` : ''}
      ${ascSignoComp.length ? `<div class="receta-tarjeta interp"><h4>Ascendente en ${ascZ.signoComplementario} · <em>lectura complementaria (borde de signo)</em></h4>${parrafos(ascSignoComp)}</div>` : ''}

      <h3>Planetas en las casas (Volguine)</h3>
      ${planetasHtml}

      <h3>Superposiciones de casas anuales ↔ natales (Volguine)</h3>
      ${supHtml}

      ${(regTxt.length || (amp && (amp.mRegCasa.length || amp.astrodinas.regP))) ? `<h3>El regente del año (Tito Maciá)</h3>` : ''}
      ${regTxt.length ? `<div class="receta-tarjeta interp"><h4>${rs.regenteAsc} en casa ${rs.regenteCasa} — resumen</h4>${parrafos(regTxt)}</div>` : ''}
      ${amp && amp.mRegCasa.length ? `<div class="receta-tarjeta interp"><h4>El regente en la casa ${rs.regenteCasa} — texto completo</h4>${amp.parr(amp.mRegCasa)}</div>` : ''}
      ${amp && amp.astrodinas.regP ? `<div class="receta-tarjeta interp"><h4>Astrodinas del regente — «${amp.astrodinas.banda}»</h4>
        <p><strong>Intensidad (aspectos):</strong> ${amp.astrodinas.suma} astrodinas.${amp.astrodinas.aspectos.length ? ` Aspectos recibidos: ${amp.astrodinas.aspectos.map((a) => `${a.nombre} ${a.ang}° (${a.val})`).join(' · ')}.` : ' Sin aspectos en orbe.'}</p>
        ${amp.astrodinas.pos.length ? `<p><strong>Posición (+${amp.astrodinas.sumaPos}):</strong> ${amp.astrodinas.pos.map((a) => `${a.t} (${a.v})`).join('; ')}.</p>` : ''}
        <p class="nota">Medida evaluativa aproximada (valores orientativos de Maciá / Demetrio Santos). Guía y notas en «Más de Maciá sobre la RS».</p>
      </div>` : ''}

      ${amp && amp.infortunio ? `<h3>El Parte del Infortunio</h3>
      <div class="receta-tarjeta interp"><h4>Infortunio en ${gradosTexto(amp.infortunio.lon)} · casa ${amp.infortunio.casa} de la RS</h4>
        <p class="nota">Fórmula de Maciá: Ascendente + Marte − Saturno. El atacir del Ascendente llega a este lugar a los ~${amp.infortunio.dias} días del retorno: días para vigilar.</p>
        ${amp.parr(amp.infortunio.texto)}</div>` : ''}

      ${amp && amp.atacires.length ? `<h3>Atacires de la revolución (Tito Maciá)</h3>
      <details class="prog-lista"><summary>Tabla de atacires del año — ${amp.atacires.length} pasos (≈1°/día)</summary>
        <table class="tabla-mini"><thead><tr><th>Fecha</th><th>Día</th><th>Atacir</th></tr></thead><tbody>
        ${amp.atacires.map((a) => `<tr><td>${a.fechaTexto}</td><td>+${Math.round(a.d)}</td><td>${a.txt}</td></tr>`).join('')}
        </tbody></table></details>
      <details class="prog-lista"><summary>Guía de los atacires y textos por casa</summary>
        ${amp.parr(amp.atacirGuia)}
        ${amp.atacirCasas.map((c) => `<h4>Atacir del Ascendente en la casa ${c.casa} (mes ${c.casa})</h4>${amp.parr(c.texto)}`).join('')}
        ${['mc', 'planetas', 'sol', 'luna', 'venus', 'marte', 'saturno'].map((k) => amp.atacirTextos[k].length ? `<h4>${k === 'mc' ? 'Atacires del Mediocielo' : k === 'planetas' ? 'Atacires de los planetas' : 'Atacires de ' + k}</h4>${amp.parr(amp.atacirTextos[k])}` : '').join('')}
      </details>` : ''}

      ${amp ? `<details class="prog-lista"><summary>Más de Maciá sobre la RS (astrodinas, Parte de Fortuna, relocación)</summary>
        ${amp.parr(amp.astrodinas.guias.intro)}
        ${amp.parr(amp.astrodinas.guias.aspectos)}
        ${amp.parr(amp.astrodinas.guias.posicion)}
        ${amp.astrodinas.notas.map((n) => `<h4>${n.clave}</h4>${amp.parr(n.texto)}`).join('')}
        ${amp.notasFinales.fortuna.length ? `<h4>La influencia del Parte de Fortuna</h4>${amp.parr(amp.notasFinales.fortuna)}` : ''}
        ${amp.notasFinales.afortunar.length ? `<h4>«Afortunar» planetas del año</h4>${amp.parr(amp.notasFinales.afortunar)}` : ''}
        ${amp.notasFinales.relocacion.length ? `<h4>La relocación (terapia preventiva)</h4>${amp.parr(amp.notasFinales.relocacion)}` : ''}
        ${amp.infortunioGuia.length ? `<h4>El Parte del Infortunio (introducción)</h4>${amp.parr(amp.infortunioGuia)}` : ''}
        ${amp.infortunioConj.length ? `<h4>El Infortunio en conjunción con otros planetas</h4>${amp.parr(amp.infortunioConj)}` : ''}
      </details>` : ''}

      <h3>Posiciones de la revolución</h3>
      <table class="tabla-prosp">
        <thead><tr><th></th><th>Planeta</th><th>Posición</th><th>Casa (RS)</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <p class="nota">Lectura por superposición (Volguine): el Ascendente y el Mediocielo anuales dan el «tono del año»; las casas anuales superpuestas a las natales y los planetas por casa precisan los asuntos. Las <strong>zonas de transición</strong> (a menos de 2° de una cúspide natal o en los bordes de signo) se marcan con ⚖ y añaden una lectura complementaria: la casa estricta no se descarta, pero se enriquece con la adyacente. Los textos son de redacción propia sobre la técnica de Volguine (la técnica se atribuye; la expresión es original).</p>
      <p class="nota">Ampliación 12-oct-2026: superposiciones, Parte del Infortunio, atacires de la revolución y astrodinas del regente, según Tito Maciá (textos del corpus reescritos en redacción propia el mismo día).</p>
    `;

    // Rueda gráfica de la revolución, con la natal superpuesta
    const cv = contenedor.querySelector('#rs-rueda');
    if (cv && typeof dibujarCarta === 'function') {
      dibujarCarta(cv, {
        planetas: rs.planetas.map((p) => ({ id: p.nombre, lon: p.lon, glifo: p.glifo, nombre: p.nombre, retro: p.retro })),
        cusps: rs.cusps, asc: rs.asc, mc: rs.mc,
        orientacion: 'casas',
        nombre: `Revolución Solar ${rs.anio}`,
        fechaTexto: `Retorno: ${rs.fechaTexto}`,
        lugarTexto: `${rs.lat.toFixed(4)}°, ${rs.lon.toFixed(4)}°`,
        referencia: {
          cusps: estado.datos.cusps, asc: estado.datos.asc, mc: estado.datos.mc,
          planetas: (estado.datos.planetas || []).map((p) => ({ lon: p.lon, glifo: p.glifo, nombre: p.nombre })),
        },
      });
    }
  }

  pintar();
}
