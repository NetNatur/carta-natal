// ============================================================
//  preparar-transitos.mjs
//  Extrae el corpus de interpretación de tránsitos del libro
//  "Tránsitos Planetarios y Destino" de Georges Antarès (1982)
//  y lo convierte en datos/transitos.json
//
//  Fuente: imports/astrologia/principiantes/texto/
//          antares-transitos-planetarios-destino.txt
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const FUENTE = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/imports/astrologia/principiantes/texto/antares-transitos-planetarios-destino.txt';
const SALIDA = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/projects/agente-astrologia/carta-natal/datos/transitos.json';

const text = readFileSync(FUENTE, 'utf8').replace(/\r/g, '');
const lines = text.split('\n');

const PLANETAS = ['NEPTUNO', 'URANO', 'SATURNO', 'JUPITER', 'MARTE', 'VENUS', 'MERCURIO', 'SOL', 'LUNA'];
const SIGNOS = ['ARIES', 'TAURO', 'GEMINIS', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'ESCORPIO', 'SAGITARIO', 'CAPRICORNIO', 'ACUARIO', 'PISCIS'];

// Puntos sensibles → clave canónica (regex en orden, multi-palabra primero)
const PUNTO_REGEX = [
  [/ASCENDENTE/, 'Ascendente'],
  [/MEDIO[\s-]*CIELO|MERIDIANO|M[\s.-]*C/, 'Medio Cielo'],
  [/SOL/, 'Sol'],
  [/LUNA/, 'Luna'],
  [/MERCURIO/, 'Mercurio'],
  [/VENUS/, 'Venus'],
  [/MARTE/, 'Marte'],
  [/JUPITER/, 'Júpiter'],
  [/SATURNO/, 'Saturno'],
  [/URANO/, 'Urano'],
  [/NEPTUNO/, 'Neptuno'],
];

const canon = (s) => s
  .replace(/\./g, '')
  .replace(/[ÁÉÍÓÚ]/g, (c) => ({ Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }[c]))
  .replace(/\s+/g, ' ')
  .trim();

function esTitulo(h) {
  const hh = canon(h);
  const meta = [
    'TRANSITOS PLANETARIOS', 'Y DESTINO', 'EDICIONES Z OBELISCO', 'INTRODUCCION', 'ADVERTENCIA',
    'CAPITULO', 'LOS TRANSITOS DE', 'MAYORES QUE FORMAN ASPECTO', 'LOS PUNTOS SENSIBLES', 'TEMA NATAL',
    'NOTA IMPORTANTE', 'EFECTOS PSICOLOGICOS', 'EFECTOS SOBRE EL PLANO MATERIAL', 'PASOS DE',
    'COMPARACION ENTRE EL TIEMPO', 'LOS TRANSITOS APARENTES DEL SOL', 'LOS TRANSITOS DE LOS PLANETAS MENORES',
    'VENUS Y MERCURIO', 'LOS TRANSITOS ESPECIALES', 'CARTA DEL CIELO', 'PARALELOS DE DECLINACION',
    'MODELO DE TRAZADO', 'COMO ESTABLECER', 'COMO INSCRIBIR', 'PREVISIONES PARA', 'CONSIDERACIONES SOBRE',
    'LOS ASTROS Y LA BUSQUEDA', 'INDICE', 'COLECCION URANIA', 'LOS EFECTOS DE', 'LA IMPORTANCIA DE',
    'SIGNOS DEL ZODIACO', 'EN LAS CASAS', 'POR UN RELOJ', 'LATITUDES DE LOS PLANETAS', 'INTENSIDAD DE LOS TRANSITOS',
    'TRANSITOS PARA UN PERIODO', 'EJEMPLO Y LAS TABLAS', 'LA PREDICCION', 'ESTUDIADO',
  ];
  return meta.some((m) => hh.startsWith(m) || hh.includes(m));
}

function clasificar(h) {
  // Determina planeta transitante (primer token que sea planeta)
  const toks = h.split(/\s+/);
  let planeta = null;
  let planetaIdx = -1;
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i].replace(/[.\-]/g, '');
    if (PLANETAS.includes(t)) { planeta = t; planetaIdx = i; break; }
  }
  if (!planeta) return null;

  // Capítulo II: paso por signo
  const resto = toks.slice(planetaIdx + 1).join(' ').replace(/[.\-]/g, '');
  const mSigno = resto.match(/PASANDO POR (ARIES|TAURO|GEMINIS|CANCER|LEO|VIRGO|LIBRA|ESCORPIO|SAGITARIO|CAPRICORNIO|ACUARIO|PISCIS)/);
  if (mSigno) return { tipo: 'signo', planeta: canonPlaneta(planeta), signo: cap(mSigno[1]) };
  const mSigno2 = resto.match(/^EN (ARIES|TAURO|GEMINIS|CANCER|LEO|VIRGO|LIBRA|ESCORPIO|SAGITARIO|CAPRICORNIO|ACUARIO|PISCIS)$/);
  if (mSigno2) return { tipo: 'signo', planeta: canonPlaneta(planeta), signo: cap(mSigno2[1]) };
  const mSigno3 = h.match(/^(URANO|SATURNO|JUPITER|MARTE|NEPTUNO) (EN|POR) (ARIES|TAURO|GEMINIS|CANCER|LEO|VIRGO|LIBRA|ESCORPIO|SAGITARIO|CAPRICORNIO|ACUARIO|PISCIS)$/i);
  if (mSigno3) return { tipo: 'signo', planeta: canonPlaneta(mSigno3[1]), signo: cap(mSigno3[3]) };

  // Capítulo II: paso por casa
  const mCasa = resto.match(/PASANDO POR CASA (I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|1|2|3|4|5|6|7|8|9|10|11|12)\b/);
  if (mCasa) return { tipo: 'casa', planeta: canonPlaneta(planeta), casa: numCasa(mCasa[1]) };
  const mCasa2 = resto.match(/^POR CASA (I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|1|2|3|4|5|6|7|8|9|10|11|12)$/);
  if (mCasa2) return { tipo: 'casa', planeta: canonPlaneta(planeta), casa: numCasa(mCasa2[1]) };

  // Capítulo IV: menores (Venus/Mercurio/Luna) — solo conjunción
  if (planeta === 'VENUS' || planeta === 'MERCURIO' || planeta === 'LUNA') {
    const punto = localizarPunto(h, canonPlaneta(planeta));
    if (punto) return { tipo: 'punto', planeta: canonPlaneta(planeta), punto, aspecto: 'conjuncion' };
  }

  // Capítulo I: planeta × punto × aspecto
  const punto = localizarPunto(h, canonPlaneta(planeta));
  if (!punto) return null;

  const hh = canon(h);
  let aspecto;
  if (/CONJUNCION/.test(hh)) aspecto = 'conjuncion';
  else if (/MAL/.test(hh)) aspecto = 'malo';
  else if (/BIEN|BUEN/.test(hh)) aspecto = 'bueno';
  else aspecto = 'conjuncion';

  // Combinados: "EN CONJUNCION Y EN MAL ASPECTO" → malo; "EN CONJUNCION Y EN BUEN ASPECTO" → bueno
  if (/CONJUNCION/.test(hh) && /MAL/.test(hh)) aspecto = 'malo';
  if (/CONJUNCION/.test(hh) && /(BUEN|BIEN)/.test(hh)) aspecto = 'bueno';
  // Marte: la conjunción se juzga junto al mal aspecto (OCR a veces omite "MAL");
  // Saturno sí separa la conjunción ("EN TRANSITO POR CONJUNCION SOBRE...").
  if (/CONJUNCION/.test(hh) && !/(BUEN|BIEN|MAL)/.test(hh) && planeta === 'MARTE') aspecto = 'malo';

  return { tipo: 'punto', planeta: canonPlaneta(planeta), punto, aspecto };
}

function canonPlaneta(p) {
  return { NEPTUNO: 'Neptuno', URANO: 'Urano', SATURNO: 'Saturno', JUPITER: 'Júpiter', MARTE: 'Marte', VENUS: 'Venus', MERCURIO: 'Mercurio', SOL: 'Sol', LUNA: 'Luna' }[p] || p;
}

function cap(s) {
  const m = { ARIES: 'Aries', TAURO: 'Tauro', GEMINIS: 'Géminis', CANCER: 'Cáncer', LEO: 'Leo', VIRGO: 'Virgo', LIBRA: 'Libra', ESCORPIO: 'Escorpio', SAGITARIO: 'Sagitario', CAPRICORNIO: 'Capricornio', ACUARIO: 'Acuario', PISCIS: 'Piscis' };
  return m[s] || s;
}

function numCasa(s) {
  const rom = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };
  return rom[s] || parseInt(s, 10);
}

function localizarPunto(h, planetaCanonico) {
  const hh = canon(h);
  // Quitar la primera aparición del planeta transitante (deja el punto natal, p. ej. "... SATURNO NATAL")
  const rest = hh.replace(planetaCanonico.toUpperCase().replace(/[ÁÉÍÓÚ]/g, (c) => ({ Á: 'A', É: 'E', Í: 'I', Ó: 'O', Ú: 'U' }[c])), '', 1);
  let punto = null;
  for (const [re, name] of PUNTO_REGEX) {
    if (re.test(rest)) punto = name;
  }
  return punto;
}

// ---------- Recorrer el archivo ----------
const entradas = [];
let actual = null;
const noClasificadas = [];

for (const line of lines) {
  const s = line.trim();
  const esHeading = /^[A-ZÁÉÍÓÚÑÜ][A-ZÁÉÍÓÚÑÜ0-9\s\.°\-,'´]{5,70}$/.test(s) && s.length > 6 && /[A-ZÁÉÍÓÚÑ]/.test(s) && !/^[A-ZÁÉÍÓÚÑ0-9\s\.°\-,'´]*[a-záéíóúñü]+/.test(s);

  if (esHeading) {
    if (esTitulo(s)) { if (actual) entradas.push(actual); actual = null; continue; }
    const cl = clasificar(s);
    if (cl) {
      if (actual) entradas.push(actual);
      actual = { ...cl, titulo: s, texto: [] };
    } else {
      if (actual) entradas.push(actual);
      actual = null;
      noClasificadas.push(s);
    }
  } else if (s && actual) {
    actual.texto.push(s);
  }
}
if (actual) entradas.push(actual);

// Unir párrafos: agrupar líneas separadas por línea en blanco no se conservan aquí;
// simplemente juntamos líneas contiguas en párrafos por saltos dobles.
for (const e of entradas) {
  // El texto viene línea a línea; reconstruir párrafos uniendo líneas que no terminan en punto
  const parrafos = [];
  let buf = '';
  for (const l of e.texto) {
    if (!buf) { buf = l; continue; }
    // Si la línea anterior termina en punto y esta empieza con mayúscula → nuevo párrafo
    if (/[.!?]$/.test(buf.trim()) && /^[A-ZÁÉÍÓÚÑ"]/.test(l)) {
      parrafos.push(buf);
      buf = l;
    } else {
      buf += ' ' + l;
    }
  }
  if (buf) parrafos.push(buf);
  e.texto = parrafos.map((p) => p.trim()).filter(Boolean);
}

const salida = {
  meta: {
    titulo: 'Tránsitos Planetarios y Destino',
    autor: 'Georges Antarès',
    edicion: 'Ediciones Obelisco, Barcelona, 1982 (colección Urania)',
    fuente: 'antares-transitos-planetarios-destino.txt',
    nota: 'Interpretaciones deliberadamente exageradas por el autor (ver Advertencia); aplicar siempre el juicio del practicante y el filtro del tema natal.',
    total: entradas.length,
  },
  entradas,
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 1), 'utf8');

// Diagnóstico
const porTipo = {};
for (const e of entradas) porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1;
console.log('Entradas extraídas:', entradas.length);
console.log('Por tipo:', porTipo);
console.log('Sin clasificar:', noClasificadas.length);
noClasificadas.forEach((n) => console.log('  ?', n));
