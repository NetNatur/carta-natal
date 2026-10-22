// ============================================================
//  Interpretación — cruza la carta calculada con el recetario
//  (datos/recetario.json: 864 configuraciones × 12 temas)
//
//  Textos de interpretación compilados mediante IA de
//  Arturo Mata, Sinesio Rodenas y Jesús Ripero.
// ============================================================
import { NOMBRES_SIGNOS } from './carta.js';

// ---------- Constantes ----------
export const TEMAS = [
  ['personalidad', 'Personalidad'],
  ['amor', 'Amor'],
  ['pareja', 'Pareja'],
  ['relaciones', 'Relaciones'],
  ['familia', 'Familia'],
  ['hijos', 'Hijos'],
  ['salud', 'Salud'],
  ['intelecto', 'Intelecto'],
  ['intereses', 'Intereses'],
  ['proyectos', 'Proyectos'],
  ['posición social', 'Posición social'],
  ['viajes', 'Viajes'],
];

const PLANETAS_CLASICOS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];

// Casas con entrada propia en el recetario (I, IV, VII y X se cubren con los ángulos)
const CASAS_RECETARIO = { 1: null, 2: 'II', 3: 'III', 4: null, 5: 'V', 6: 'VI', 7: null, 8: 'VIII', 9: 'IX', 10: null, 11: 'XI', 12: 'XII' };

// Regencia tradicional (caldea): signo -> planeta regente
const REGENTES = {
  Aries: 'Marte', Tauro: 'Venus', Géminis: 'Mercurio', Cáncer: 'Luna',
  Leo: 'Sol', Virgo: 'Mercurio', Libra: 'Venus', Escorpio: 'Marte',
  Sagitario: 'Júpiter', Capricornio: 'Saturno', Acuario: 'Saturno', Piscis: 'Júpiter',
};

// Tipo de aspecto (librería) -> tipo del recetario
const TIPO_ASPECTO = {
  Conjunction: 'unión',
  Sextile: 'armónico',
  Trine: 'armónico',
  Square: 'tensión',
  Opposition: 'tensión',
  'Semi-sextile': 'armónico',
  'Semi-square': 'tensión',
  Quintile: 'armónico',
  Sesquiquadrate: 'tensión',
  'Bi-quintile': 'armónico',
  Quincunx: 'tensión',
};

// Participantes de los aspectos en el recetario (14): planetas clásicos + Nodo Norte + ASC + MC + Fortuna
export const PARTICIPANTES_ASPECTO = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón', 'Nodo Norte', 'Ascendente', 'Medio Cielo', 'Parte Fortuna'];

const ORDEN_TIPOS = ['planeta_signo', 'angulo', 'casa_signo', 'regencia_casa', 'punto', 'regencia_cuerpo', 'aspecto'];
const NOMBRE_TIPOS = {
  planeta_signo: 'Planetas en los signos',
  angulo: 'Ángulos y ejes',
  casa_signo: 'Casas en los signos',
  regencia_casa: 'Regentes de casas y ángulos',
  punto: 'Puntos de la carta',
  regencia_cuerpo: 'Regentes de cuerpos',
  aspecto: 'Aspectos',
};

// Objetivos de regencia por categoría
const OBJETIVOS_ANGULOS = ['Ascendente', 'Descendente', 'Fondo Cielo', 'Medio Cielo'];
const OBJETIVOS_CASAS = ['II', 'III', 'V', 'VI', 'VIII', 'IX', 'XI', 'XII'];
const OBJETIVOS_PUNTOS = ['Nodo Norte', 'Nodo Sur', 'Parte Fortuna'];
const ES_REGENCIA_CASA = new Set([...OBJETIVOS_ANGULOS, ...OBJETIVOS_CASAS]);

let recetario = null;

// ---------- Utilidades ----------
const signoDe = (lon) => NOMBRES_SIGNOS[Math.floor((((lon % 360) + 360) % 360) / 30)];

// ---------- Carga ----------
export async function cargarRecetario() {
  if (recetario) return recetario;
  const r = await fetch('datos/recetario.json');
  recetario = await r.json();
  return recetario;
}

// ---------- Construcción de la lista de configuraciones ----------
// Pura: recibe los datos de la carta y el recetario; devuelve
// [{ config, tipo, recetas: { tema: texto } }] solo para configs existentes.
export function construirLista(datos, rec) {
  const lista = [];
  const pos = {}; // planeta -> longitud

  for (const p of datos.planetas) pos[p.nombre] = p.lon;

  // Planetas en signo (10 clásicos)
  for (const p of datos.planetas) {
    if (!PLANETAS_CLASICOS.includes(p.nombre)) continue;
    lista.push({ config: `${p.nombre} en ${signoDe(p.lon)}`, tipo: 'planeta_signo' });
  }

  // Ángulos y ejes
  lista.push({ config: `Ascendente en ${signoDe(datos.asc)}`, tipo: 'angulo' });
  lista.push({ config: `Descendente en ${signoDe(datos.asc + 180)}`, tipo: 'angulo' });
  lista.push({ config: `Medio Cielo en ${signoDe(datos.mc)}`, tipo: 'angulo' });
  lista.push({ config: `Fondo Cielo en ${signoDe(datos.mc + 180)}`, tipo: 'angulo' });

  // Casas en signo (solo las que tienen entrada propia)
  for (let i = 0; i < 12; i++) {
    const rom = CASAS_RECETARIO[i + 1];
    if (rom) lista.push({ config: `${rom} en ${signoDe(datos.cusps[i])}`, tipo: 'casa_signo' });
  }

  // Puntos
  const nn = datos.planetas.find((p) => p.nombre === 'Nodo Norte');
  if (nn) {
    lista.push({ config: `Nodo Norte en ${signoDe(nn.lon)}`, tipo: 'punto' });
    lista.push({ config: `Nodo Sur en ${signoDe(nn.lon + 180)}`, tipo: 'punto' });
  }
  if (datos.fortuna !== null && datos.fortuna !== undefined) {
    lista.push({ config: `Parte Fortuna en ${signoDe(datos.fortuna)}`, tipo: 'punto' });
  }

  // Regencias: para cada área, su signo -> regente -> signo del regente
  const areas = [
    ['Ascendente', datos.asc],
    ['Descendente', datos.asc + 180],
    ['Fondo Cielo', datos.mc + 180],
    ['Medio Cielo', datos.mc],
  ];
  for (let i = 0; i < 12; i++) {
    const rom = CASAS_RECETARIO[i + 1];
    if (rom) areas.push([rom, datos.cusps[i]]);
  }
  for (const p of datos.planetas) {
    if (PLANETAS_CLASICOS.includes(p.nombre)) areas.push([p.nombre, p.lon]);
  }
  if (nn) {
    areas.push(['Nodo Norte', nn.lon]);
    areas.push(['Nodo Sur', nn.lon + 180]);
  }
  if (datos.fortuna !== null && datos.fortuna !== undefined) {
    areas.push(['Parte Fortuna', datos.fortuna]);
  }
  for (const [objetivo, lon] of areas) {
    const regente = REGENTES[signoDe(lon)];
    if (!regente || !(regente in pos)) continue;
    const item = { config: `Regente de ${objetivo} en ${signoDe(pos[regente])}`, tipo: 'regencia_casa' };
    if (!ES_REGENCIA_CASA.has(objetivo)) item.tipo = 'regencia_cuerpo';
    // Casa del regente como dato auxiliar (cuando la carta la tiene calculada)
    const planetaRegente = datos.planetas.find((p) => p.nombre === regente);
    if (planetaRegente && planetaRegente.casa) item.casaRegente = planetaRegente.casa;
    lista.push(item);
  }

  // Aspectos (probar las dos direcciones; el filtro por existencia decide)
  for (const a of datos.aspectosExt || []) {
    const tipo = TIPO_ASPECTO[a.aspect.name];
    if (!tipo) continue;
    const c1 = `${a.from.name} ${tipo} ${a.to.name}`;
    const c2 = `${a.to.name} ${tipo} ${a.from.name}`;
    lista.push({ config: c1, tipo: 'aspecto' });
    if (c2 !== c1) lista.push({ config: c2, tipo: 'aspecto' });
  }

  // Filtrar por existencia en el recetario y adjuntar recetas
  const vistos = new Set();
  const resultado = [];
  for (const item of lista) {
    const recetas = rec[item.config];
    if (!recetas) continue;
    if (vistos.has(item.config)) continue;
    vistos.add(item.config);
    resultado.push({ ...item, recetas });
  }
  return resultado;
}

// ---------- Render ----------
export function renderInterpretacion(contenedor, datos) {
  if (!recetario) {
    contenedor.hidden = true;
    return;
  }
  const items = construirLista(datos, recetario);
  if (!items.length) {
    contenedor.hidden = true;
    return;
  }
  contenedor.hidden = false;

  contenedor.innerHTML = `
    <h2>Interpretación</h2>
    <div class="chips" id="chips-temas"></div>
    <div id="cuerpo-interpretacion" class="cuerpo-interp"></div>
  `;
  const chips = contenedor.querySelector('#chips-temas');
  const cuerpo = contenedor.querySelector('#cuerpo-interpretacion');

  const porTema = {};
  for (const it of items) {
    for (const [tema] of TEMAS) {
      if (!it.recetas[tema]) continue;
      (porTema[tema] = porTema[tema] || []).push(it);
    }
  }

  let temaActivo = 'personalidad';
  if (!porTema[temaActivo]) temaActivo = Object.keys(porTema)[0];

  const pintarTema = (tema) => {
    const grupo = porTema[tema] || [];
    const porTipo = {};
    for (const it of grupo) (porTipo[it.tipo] = porTipo[it.tipo] || []).push(it);

    const orden = ORDEN_TIPOS.filter((t) => porTipo[t]);
    cuerpo.innerHTML = orden.map((tipo) => {
      const tarjetas = porTipo[tipo].map((it) => `
        <div class="receta-tarjeta">
          <h4>${it.config}${it.casaRegente ? ` <span class="nota-casa">· en casa ${it.casaRegente}</span>` : ''}</h4>
          <p>${it.recetas[tema]}</p>
        </div>`).join('');
      return `<section class="grupo-interp"><h3>${NOMBRE_TIPOS[tipo]}</h3>${tarjetas}</section>`;
    }).join('');
  };

  chips.innerHTML = TEMAS
    .filter(([t]) => porTema[t])
    .map(([t, label]) => `<button type="button" class="chip" data-tema="${t}">${label} (${porTema[t].length})</button>`)
    .join('');

  chips.querySelectorAll('.chip').forEach((b) => {
    b.addEventListener('click', () => {
      chips.querySelectorAll('.chip').forEach((x) => x.classList.remove('activo'));
      b.classList.add('activo');
      pintarTema(b.dataset.tema);
    });
  });

  const btnActivo = chips.querySelector(`[data-tema="${temaActivo}"]`);
  if (btnActivo) btnActivo.classList.add('activo');
  pintarTema(temaActivo);
}
