// ============================================================
//  Tránsitos planetarios — prospectiva
//  Motor de cálculo + mapeo al corpus de interpretación.
//
//  Fuente del corpus: "Tránsitos Planetarios y Destino",
//  Georges Antarès (Ed. Obelisco, 1982) → datos/transitos.json
//  (generado con preparar-transitos.mjs).
//
//  Reglas de Antarès aplicadas:
//   · Direccionalidad: el planeta en tránsito actúa sobre el punto natal
//     (no es reversible).
//   · Aspecto natal de fondo: el juicio del tránsito se modula según el
//     aspecto que esos dos factores tenían en el radical.
//   · Triple paso: se avisa cuando el planeta está en retrogradación.
// ============================================================
import { Body, Flag } from './vendor/dist/index.js';
import { FetchEphemeris } from './vendor/dist/ephemeris/sources.js';
import { NOMBRES_SIGNOS } from './carta.js';

// ---------- Catálogo ----------
// Planetas en tránsito (todos los clásicos; Plutón sin texto en la fuente)
const TRANSITOS = [
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
const MAYORES = new Set(['Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno']);

// Puntos sensibles del tema natal (según el libro)
const PUNTOS_NATALES = ['Ascendente', 'Medio Cielo', 'Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno'];

// Aspecto (ángulo → clase del corpus)
const ASPECTOS = [
  [0, 'Conjunción', 'conjuncion'],
  [30, 'Semisextil', 'bueno'],
  [60, 'Sextil', 'bueno'],
  [90, 'Cuadratura', 'malo'],
  [120, 'Trígono', 'bueno'],
  [135, 'Sesquicuadratura', 'malo'],
  [180, 'Oposición', 'malo'],
];

// Orbes (grados) para tránsitos: la conjunción y disonancias se sienten más
const ORBE = { 0: 3, 30: 1.5, 60: 2, 90: 3, 120: 2, 135: 2, 180: 3 };

const norm = (lon) => (((lon % 360) + 360) % 360);
const signoDe = (lon) => NOMBRES_SIGNOS[Math.floor(norm(lon) / 30)];

function casaDe(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((lon - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
}

// ---------- Carga del corpus ----------
let corpusPromise = null;
export function cargarCorpus() {
  if (!corpusPromise) {
    corpusPromise = fetch('datos/transitos.json').then((r) => r.json());
  }
  return corpusPromise;
}

// ---------- Núcleo puro (testable) ----------
// natales: [{nombre, lon}]; transitos: [{nombre, lon, retro, signo, casa}]
export function calcularTransitos(natales, transitos, corpus, aspectosNatal = []) {
  const porPunto = {};
  for (const e of corpus.entradas) {
    if (e.tipo !== 'punto') continue;
    const k = `${e.planeta}||${e.punto}||${e.aspecto}`;
    porPunto[k] = e;
  }
  const porSigno = {};
  const porCasa = {};
  for (const e of corpus.entradas) {
    if (e.tipo === 'signo') porSigno[`${e.planeta}||${e.signo}`] = e;
    if (e.tipo === 'casa') porCasa[`${e.planeta}||${e.casa}`] = e;
  }

  // Índice de aspectos natales (regla §3.2 de Antarès): "A||B" → tipo
  const natalAspecto = {};
  for (const a of aspectosNatal || []) {
    natalAspecto[[a.de, a.a].sort().join('||')] = a.tipo;
  }

  const contactos = [];
  for (const tr of transitos) {
    for (const n of natales) {
      if (tr.nombre === n.nombre) continue; // un planeta no transita sobre sí mismo
      const diff = Math.abs(((tr.lon - n.lon + 540) % 360) - 180);
      for (const [ang, nombreAspecto, clase] of ASPECTOS) {
        const orb = Math.abs(diff - ang);
        if (orb > ORBE[ang]) continue;
        const esMenor = !MAYORES.has(tr.nombre);
        const entrada = buscarEntrada(porPunto, tr.nombre, n.nombre, esMenor ? 'conjuncion' : clase);
        if (!entrada) continue; // sin texto: no se muestra (p. ej. Plutón, Sol en aspecto)
        contactos.push({
          transitante: tr, punto: n.nombre, ang, nombreAspecto, clase, orb,
          entrada, esMenor, retro: tr.retro,
          fondoNatal: fondoNatal(tr.nombre, n.nombre, natalAspecto),
        });
      }
    }
  }
  contactos.sort((a, b) => a.orb - b.orb);

  const porSignoList = transitos.filter((t) => MAYORES.has(t.nombre))
    .map((t) => ({ transitante: t, entrada: porSigno[`${t.nombre}||${t.signo}`] }))
    .filter((x) => x.entrada);
  const porCasaList = transitos.filter((t) => MAYORES.has(t.nombre))
    .map((t) => ({ transitante: t, entrada: porCasa[`${t.nombre}||${t.casa}`] }))
    .filter((x) => x.entrada);

  return { contactos, porSignoList, porCasaList };
}

function buscarEntrada(porPunto, planeta, punto, clase) {
  const directa = porPunto[`${planeta}||${punto}||${clase}`];
  if (directa) return directa;
  // Conjunción plegada en el corpus: Júpiter la une al buen aspecto,
  // Saturno y Marte al mal aspecto (para la mayoría de puntos).
  if (clase === 'conjuncion') {
    const plegada = planeta === 'Júpiter' ? 'bueno' : 'malo';
    return porPunto[`${planeta}||${punto}||${plegada}`] || null;
  }
  return null;
}

// Regla §3.2 de Antarès: aspecto natal de fondo entre el planeta en tránsito
// y el punto natal (solo aplica a planetas, no a ángulos).
function fondoNatal(planeta, punto, natalAspecto) {
  if (punto === 'Ascendente' || punto === 'Medio Cielo') return null;
  const tipo = natalAspecto[[planeta, punto].sort().join('||')];
  if (!tipo) return 'ninguno';
  if (/Sextile|Trine/i.test(tipo)) return 'bueno';
  if (/Square|Opposition/i.test(tipo)) return 'malo';
  if (/Conjunction/i.test(tipo)) return 'conjuncion';
  return 'ninguno';
}

// Texto de modulación para mostrar junto al contacto.
function notaFondo(fondoNatal, clase) {
  if (!fondoNatal || fondoNatal === 'ninguno') return '';
  if (fondoNatal === 'bueno') {
    if (clase === 'bueno') return ' · fondo natal armónico: refuerza (efectos afortunados)';
    if (clase === 'malo') return ' · fondo natal armónico: mal débil, prueba con lección provechosa';
    return ' · fondo natal armónico';
  }
  if (fondoNatal === 'malo') {
    if (clase === 'bueno') return ' · fondo natal disonante: bien atenuado, de poco alcance';
    if (clase === 'malo') return ' · fondo natal disonante: el mal puede manifestarse íntegramente';
    return ' · fondo natal disonante';
  }
  if (fondoNatal === 'conjuncion') return ' · conjunción natal de fondo';
  return '';
}

// ---------- Render ----------

// ============================================================
//  Fechas exactas de aspecto / doble y triple paso
//  Se barre el movimiento real del planeta día a día dentro de
//  la ventana elegida y se afina por bisección cada momento en
//  que un aspecto se vuelve exacto contra un punto natal.
//  Los pasos próximos del mismo planeta+punto+aspecto se agrupan
//  en ciclos de retrogradación: 2 pasos = doble, 3 = triple.
// ============================================================
const PASOS_VENTANA_DIAS = 300; // separación máx. entre pasos de un ciclo
const ASPECTOS_EXACTOS = [
  [0, 'Conjunción'],
  [60, 'Sextil'],
  [90, 'Cuadratura'],
  [120, 'Trígono'],
  [180, 'Oposición'],
];
// Planetas capaces de doble/triple paso (retrogradan); Sol y Luna no.
const LENTOS = TRANSITOS.filter((c) => c.nombre !== 'Sol' && c.nombre !== 'Luna');

const pad2 = (n) => String(n).padStart(2, '0');

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

function sumarMeses(swe, anio, mes, dia, delta) {
  let m = mes + delta;
  let a = anio;
  while (m > 12) { m -= 12; a++; }
  while (m < 1) { m += 12; a--; }
  return swe.julianDay(a, m, dia, 12);
}

// Distancia con signo (en [-180,180]) del ángulo delta al aspecto A.
// Es continua al cruzar el aspecto (no salta en el punto del evento).
const desvAspecto = (delta, A) => ((((delta - A + 180) % 360) + 360) % 360) - 180;

// Núcleo puro: detecta los cruces exactos del aspecto A contra un punto
// natal en una serie diaria de longitudes [{jd, lon}]. Devuelve [{jd}].
export function detectarCruces(serie, lonNatal, A) {
  const cruces = [];
  const g = (lon) => desvAspecto(((lon - lonNatal) % 360 + 360) % 360, A);
  for (let i = 0; i < serie.length - 1; i++) {
    const g0 = g(serie[i].lon);
    if (Math.abs(g0) < 1e-9) { cruces.push({ jd: serie[i].jd, i }); continue; }
    const g1 = g(serie[i + 1].lon);
    if (g1 !== 0 && (g0 > 0) === (g1 > 0)) continue;
    const t = g0 / (g0 - g1);
    cruces.push({ jd: serie[i].jd + t * (serie[i + 1].jd - serie[i].jd), i });
  }
  // Deduplica el mismo evento cuando el muestreo diario toca el cero exacto
  // (se detecta en el par anterior y en el posterior); el intervalo de
  // refinado no cambia porque i apunta al par correcto.
  return cruces.filter((c, idx) => idx === 0 || c.jd - cruces[idx - 1].jd > 0.5);
}

// Núcleo puro: agrupa eventos próximos (mismo planeta+punto+aspecto) en
// ciclos de retrogradación y etiqueta cada grupo como simple/doble/triple.
export function agruparPasos(eventos, ventanaDias = PASOS_VENTANA_DIAS) {
  const ordenados = [...eventos].sort((a, b) => a.jd - b.jd);
  const ultimoPorClave = {};
  let grupo = 0;
  for (const ev of ordenados) {
    const clave = `${ev.planeta}||${ev.punto}||${ev.aspecto}`;
    const anterior = ultimoPorClave[clave];
    if (anterior && ev.jd - anterior.jd <= ventanaDias) {
      ev.grupo = anterior.grupo;
    } else {
      ev.grupo = ++grupo;
    }
    ev.retro = !!ev.retro;
    ultimoPorClave[clave] = ev;
  }
  const cuenta = {};
  for (const ev of ordenados) cuenta[ev.grupo] = (cuenta[ev.grupo] || 0) + 1;
  for (const ev of ordenados) {
    ev.tipo = cuenta[ev.grupo] >= 3 ? 'triple' : cuenta[ev.grupo] === 2 ? 'doble' : 'simple';
  }
  return ordenados;
}

function refinarCruce(swe, body, lonNatal, A, jd0, jd1) {
  const g = (jd) => {
    const p = swe.calcWithSign(jd, body, { flags: Flag.Speed });
    return desvAspecto(((p.longitude - lonNatal) % 360 + 360) % 360, A);
  };
  let a = jd0, b = jd1;
  let ga = g(a);
  for (let i = 0; i < 40; i++) {
    const m = (a + b) / 2;
    const gm = g(m);
    if ((ga > 0) === (gm > 0)) { a = m; ga = gm; } else { b = m; }
  }
  return (a + b) / 2;
}

// Barrido astronómico completo: todos los planetas lentos contra todos los
// puntos natales dentro de [jdInicio, jdFin]. Devuelve eventos agrupados.
export async function buscarFechasExactas(swe, natales, jdInicio, jdFin, onProgreso) {
  const dias = Math.max(1, Math.round(jdFin - jdInicio));
  const series = {};
  for (const c of LENTOS) series[c.nombre] = [];
  for (let d = 0; d <= dias; d++) {
    const jd = jdInicio + d;
    for (const c of LENTOS) {
      const p = swe.calcWithSign(jd, c.body, { flags: Flag.Speed });
      series[c.nombre].push({ jd, lon: p.longitude });
    }
    if (onProgreso && d % 15 === 0) onProgreso(d, dias);
  }

  const eventos = [];
  for (const c of LENTOS) {
    const serie = series[c.nombre];
    for (const n of natales) {
      for (const [A, nombreAspecto] of ASPECTOS_EXACTOS) {
        for (const cr of detectarCruces(serie, n.lon, A)) {
          const jdExacto = refinarCruce(swe, c.body, n.lon, A, serie[cr.i].jd, serie[cr.i + 1].jd);
          const p = swe.calcWithSign(jdExacto, c.body, { flags: Flag.Speed });
          eventos.push({
            planeta: c.nombre, glifo: c.glifo, punto: n.nombre,
            aspecto: nombreAspecto, ang: A, jd: jdExacto, retro: p.retrograde,
          });
        }
      }
    }
    if (onProgreso) onProgreso(dias, dias);
  }
  return agruparPasos(eventos);
}

const estado = { fecha: '' };

function fechaHoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function gradosTexto(lon) {
  const s = Math.floor(norm(lon) / 30);
  const d = Math.floor(norm(lon) % 30);
  const m = Math.floor(((norm(lon) % 30) % 1) * 60);
  return `${NOMBRES_SIGNOS[s]} ${d}°${String(m).padStart(2, '0')}'`;
}

export function renderTransitos(contenedor, datos, swe) {
  if (!datos || !datos.planetas || datos.planetas.length === 0) {
    contenedor.hidden = true;
    return;
  }
  contenedor.hidden = false;
  estado.datos = datos;

  if (!contenedor.dataset.init) {
    contenedor.dataset.init = '1';
    if (!estado.fecha) estado.fecha = fechaHoyISO();
    contenedor.innerHTML = `
      <h2>Tránsitos planetarios</h2>
      <p class="nota-prospectiva">Posiciones astronómicas <em>reales</em> del cielo en una fecha, cruzadas con el tena natal. Fuente: técnica de Georges Antarès, <em>Tránsitos Planetarios y Destino</em> (1982); textos de redacción propia (2026) sobre las significaciones clásicas, sin reproducir la edición de Obelisco. El planeta en tránsito actúa sobre el punto natal (direccionalidad, no reversible); el juicio se modula según el aspecto que ambos tenían en el radical.</p>
      <div class="prospectiva-controles">
        <label class="campo mini">
          <span>Fecha del cielo</span>
          <input id="trans-fecha" type="date" value="${estado.fecha}">
        </label>
        <button type="button" id="trans-calcular" class="boton-secundario">Calcular tránsitos</button>
      </div>
      <div id="trans-resultado" class="prosp-resultado"></div>
      <div class="prospectiva-controles" style="margin-top:10px">
        <label class="campo mini">
          <span>Ventana de búsqueda</span>
          <select id="trans-ventana">
            <option value="3">±3 meses</option>
            <option value="6" selected>±6 meses</option>
            <option value="12">±12 meses</option>
            <option value="24">±24 meses</option>
          </select>
        </label>
        <button type="button" id="trans-pasos" class="boton-secundario">Buscar fechas exactas · doble/triple paso</button>
      </div>
      <div id="trans-pasos-resultado" class="prosp-resultado"></div>
    `;
    contenedor.querySelector('#trans-calcular').addEventListener('click', pintar);
    contenedor.querySelector('#trans-fecha').addEventListener('change', (e) => { estado.fecha = e.target.value; pintar(); });
    contenedor.querySelector('#trans-pasos').addEventListener('click', buscarPasos);
  } else {
    contenedor.querySelector('#trans-fecha').value = estado.fecha;
  }

  async function pintar() {
    const datos = estado.datos;
    const out = contenedor.querySelector('#trans-resultado');
    const fecha = contenedor.querySelector('#trans-fecha').value || fechaHoyISO();
    estado.fecha = fecha;
    const [y, m, d] = fecha.split('-').map(Number);
    out.innerHTML = '<p class="nota">Calculando posiciones del cielo…</p>';
    try {
      const corpus = await cargarCorpus();
      const jd = swe.julianDay(y, m, d, 12); // mediodía UT (un tránsito apenas se mueve en un día)
      await swe.loadEphemeris(new FetchEphemeris({ baseUrl: 'datos/ephe' }), {
        fromYear: y - 1, toYear: y + 1, kinds: ['planets', 'moon'],
      });

      // Posiciones de los planetas en tránsito
      const transitos = [];
      for (const c of TRANSITOS) {
        const p = swe.calcWithSign(jd, c.body, { flags: Flag.Speed });
        const lon = p.longitude;
        transitos.push({
          nombre: c.nombre, glifo: c.glifo, lon,
          retro: p.retrograde, signo: signoDe(lon), casa: casaDe(lon, datos.cusps),
        });
      }

      // Puntos sensibles natales
      const natales = [
        { nombre: 'Ascendente', lon: datos.asc },
        { nombre: 'Medio Cielo', lon: datos.mc },
        ...datos.planetas.filter((p) => PUNTOS_NATALES.includes(p.nombre)).map((p) => ({ nombre: p.nombre, lon: p.lon })),
      ];

      const { contactos, porSignoList, porCasaList } = calcularTransitos(natales, transitos, corpus, datos.aspectos);

      pintarResultado(out, fecha, transitos, contactos, porSignoList, porCasaList);
    } catch (e) {
      out.innerHTML = `<p class="nota">Error al calcular tránsitos: ${e.message}</p>`;
      console.error(e);
    }
  }

  function pintarResultado(out, fecha, transitos, contactos, porSignoList, porCasaList) {
    // Tabla de posiciones en tránsito
    const filas = transitos.map((t) =>
      `<tr><td class="glifo">${t.glifo}</td><td>${t.nombre}</td><td>${gradosTexto(t.lon)}</td><td>Casa ${t.casa}</td><td class="retro">${t.retro ? 'R' : ''}</td></tr>`
    ).join('');

    let contactosHtml = '<p class="nota">Sin contactos dentro de orbe en esta fecha. Prueba con otra fecha cercana.</p>';
    if (contactos.length) {
      contactosHtml = contactos.slice(0, 60).map((c) => `
        <div class="receta-tarjeta">
          <h4>${c.transitante.glifo} ${c.transitante.nombre} ${c.nombreAspecto.toLowerCase()} a ${c.punto} natal
            <span class="nota-casa">· orb ${c.orb.toFixed(2)}°${c.retro ? ' · ⚠ retrógrado (posible repetición)' : ''}${notaFondo(c.fondoNatal, c.clase)}</span></h4>
          ${c.entrada.texto.map((p) => `<p>${p}</p>`).join('')}
        </div>`).join('');
    }

    const signoHtml = porSignoList.length ? `
      <h3>Planetas mayores por signo (efectos psicológicos)</h3>
      <div class="grupo-interp">${porSignoList.map((x) => `
        <div class="receta-tarjeta"><h4>${x.transitante.glifo} ${x.transitante.nombre} en ${x.transitante.signo}</h4>
        ${x.entrada.texto.map((p) => `<p>${p}</p>`).join('')}</div>`).join('')}</div>` : '';

    const casaHtml = porCasaList.length ? `
      <h3>Planetas mayores por casa (plano material)</h3>
      <div class="grupo-interp">${porCasaList.map((x) => `
        <div class="receta-tarjeta"><h4>${x.transitante.glifo} ${x.transitante.nombre} en casa ${x.transitante.casa}</h4>
        ${x.entrada.texto.map((p) => `<p>${p}</p>`).join('')}</div>`).join('')}</div>` : '';

    out.innerHTML = `
      <h3>Cielo del ${fecha} (mediodía UT)</h3>
      <table class="tabla-prosp">
        <thead><tr><th></th><th>Planeta</th><th>Posición</th><th>Casa (radical)</th><th></th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <h3>Contactos con el tema natal — ${contactos.length} activos (mostrando ${Math.min(60, contactos.length)})</h3>
      <div class="grupo-interp">${contactosHtml}</div>
      ${signoHtml}
      ${casaHtml}
      <p class="nota">Los tránsitos señalan <strong>tendencias y períodos sensibles</strong>, no hechos garantizados: solo una parte de cada influjo atraviesa el filtro del tema natal. Las interpretaciones de la fuente son deliberadamente intensas; léelas como posibilidades, no como destino.</p>
    `;
  }

  async function buscarPasos() {
    const out = contenedor.querySelector('#trans-pasos-resultado');
    const datos = estado.datos;
    const fecha = contenedor.querySelector('#trans-fecha').value || estado.fecha;
    const ventana = Number(contenedor.querySelector('#trans-ventana').value || 6);
    const [y, m, d] = fecha.split('-').map(Number);
    const jdInicio = sumarMeses(swe, y, m, d, -ventana);
    const jdFin = sumarMeses(swe, y, m, d, ventana);
    const fIni = jdAFecha(jdInicio);
    const fFin = jdAFecha(jdFin);
    out.innerHTML = `<p class="nota">Preparando búsqueda ${fecha} ±${ventana} meses (${fIni.anio}-${pad2(fIni.mes)}-${pad2(fIni.dia)} a ${fFin.anio}-${pad2(fFin.mes)}-${pad2(fFin.dia)})…</p>`;
    try {
      await swe.loadEphemeris(new FetchEphemeris({ baseUrl: 'datos/ephe' }), {
        fromYear: Math.min(fIni.anio, y) - 1, toYear: Math.max(fFin.anio, y) + 1, kinds: ['planets', 'moon'],
      });
      const natales = [
        { nombre: 'Ascendente', lon: datos.asc },
        { nombre: 'Medio Cielo', lon: datos.mc },
        ...datos.planetas.filter((p) => PUNTOS_NATALES.includes(p.nombre)).map((p) => ({ nombre: p.nombre, lon: p.lon })),
      ];
      const eventos = await buscarFechasExactas(swe, natales, jdInicio, jdFin, (hecho, total) => {
        out.innerHTML = `<p class="nota">Barriendo el cielo (${fIni.anio}-${pad2(fIni.mes)}-${pad2(fIni.dia)} a ${fFin.anio}-${pad2(fFin.mes)}-${pad2(fFin.dia)})… día ${hecho}/${total}</p>`;
      });
      pintarPasos(out, eventos, fecha, ventana);
    } catch (e) {
      out.innerHTML = `<p class="nota">Error al buscar fechas exactas: ${e.message}</p>`;
      console.error(e);
    }
  }

  function pintarPasos(out, eventos, fecha, ventana) {
    if (!eventos.length) {
      out.innerHTML = `<p class="nota">Sin cruces exactos de aspectos en ${fecha} ±${ventana} meses. Amplía la ventana o prueba otra fecha.</p>`;
      return;
    }
    const porPlaneta = {};
    for (const ev of eventos) (porPlaneta[ev.planeta] = porPlaneta[ev.planeta] || []).push(ev);
    let html = `<h3>Fechas exactas — ${eventos.length} cruces alrededor del ${fecha} (±${ventana} meses)</h3>`;
    html += `<p class="nota">Horas en Tiempo Universal (UT). <strong>Doble paso:</strong> el planeta toca el punto, retrograda y lo retoca. <strong>Triple paso:</strong> ida-retro-ida; el tercer paso consuma lo que los anteriores anunciaron.</p>`;
    for (const [planeta, lista] of Object.entries(porPlaneta)) {
      const glifo = lista[0].glifo;
      html += `<div class="receta-tarjeta"><h4>${glifo} ${planeta}</h4><ul class="lista-fechas">`;
      for (const ev of lista) {
        const f = jdAFecha(ev.jd);
        const marca = ev.tipo === 'triple' ? ' · <strong class="triple-paso">TRIPLE PASO</strong>' : ev.tipo === 'doble' ? ' · <em>doble paso</em>' : '';
        html += `<li>${f.anio}-${pad2(f.mes)}-${pad2(f.dia)} ${pad2(f.hora)}:${pad2(f.min)} UT — ${ev.aspecto.toLowerCase()} a ${ev.punto} natal${ev.retro ? ' (R)' : ''}${marca}</li>`;
      }
      html += '</ul></div>';
    }
    html += `<p class="nota">El triple paso es típico de la retrogradación: la primera visita abre el asunto, la segunda (retrógrada) lo revisa y la tercera lo cierra. Las fechas marcan la máxima tensión del aspecto.</p>`;
    out.innerHTML = html;
  }

  pintar();
}
