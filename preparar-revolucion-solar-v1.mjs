// ============================================================
//  preparar-revolucion-solar.mjs
//  Extrae el corpus de interpretación de la Revolución Solar:
//   · "Ascendente en los signos" y "Sol en las casas" — Tito Maciá,
//     "La Revolución Solar y sus Atacires".
//   · "Regente del Ascendente en casas" — "Cómo Trabajarla".
//  Genera datos/revolucion-solar.json
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const FUENTE_MACIA = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/imports/astrologia/principiantes/texto/515525647-Tito-Macia-La-Revolucion-Solar-y-Sus-Atacires.txt';
const SALIDA = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/projects/agente-astrologia/carta-natal/datos/revolucion-solar.json';

const text = readFileSync(FUENTE_MACIA, 'utf8').replace(/\r/g, '');
const lines = text.split('\n');

const SIGNO_MAPA = {
  aries: 'Aries', tauro: 'Tauro', 'géminis': 'Géminis', geminis: 'Géminis', cancer: 'Cáncer', 'cáncer': 'Cáncer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', escorpio: 'Escorpio', sagitario: 'Sagitario',
  capricornio: 'Capricornio', acuario: 'Acuario', piscis: 'Piscis',
};
const ROMANO = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };

// Detecta encabezados
function clasificar(line) {
  const m1 = line.match(/^Ascendente en ([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/);
  if (m1) {
    const signo = SIGNO_MAPA[m1[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')];
    if (signo) return { tipo: 'asc-signo', signo };
  }
  const m2 = line.match(/^Sol de revoluci[oó]n en Casa ([IVX]+)/i);
  if (m2 && ROMANO[m2[1]]) return { tipo: 'sol-casa', casa: ROMANO[m2[1]] };
  return null;
}

function esRuido(l) {
  if (!l) return true;
  if (/^===== PDF page/.test(l)) return true;
  const t = l.trim();
  if (/^(LA REVOLUCI[OÓ]N SOLAR Y SUS ATACIRES|Tito Maci[áa]|Tito Macia)$/i.test(t)) return true;
  if (/^\d{1,4}$/.test(t)) return true; // número de página
  // Fragmentos de gráfico: muchas cifras/símbolos y pocas letras
  const letras = (t.match(/[A-Za-zÁÉÍÓÚáéíóúñÑ]/g) || []).length;
  const total = t.length;
  if (total < 6) return true;
  if (total < 40 && letras / total < 0.5) return true;
  return false;
}

const entradas = [];
let actual = null;

for (const line of lines) {
  const s = line.trim();
  const cl = clasificar(s);
  if (cl) {
    if (actual) entradas.push(actual);
    actual = { ...cl, texto: [] };
  } else if (actual && !esRuido(line)) {
    actual.texto.push(s);
  }
}
if (actual) entradas.push(actual);

// Reconstruir párrafos
for (const e of entradas) {
  const parrafos = [];
  let buf = '';
  for (const l of e.texto) {
    if (!buf) { buf = l; continue; }
    if (/[.!?]$/.test(buf.trim()) && /^[A-ZÁÉÍÓÚÑ"“]/.test(l)) {
      parrafos.push(buf);
      buf = l;
    } else {
      buf += ' ' + l;
    }
  }
  if (buf) parrafos.push(buf);
  e.texto = parrafos.map((p) => limpiar(p.trim())).filter(Boolean);
}

// Limpieza de ruido OCR (ñ, tildes, guiones de fin de línea)
function limpiar(t) {
  t = t.replace(/([a-záéíóúñ])-\s+([a-záéíóúñ])/gi, '$1$2');
  return t
    .replace(/\bafio\b/g, 'año').replace(/\bafǐo\b/g, 'año')
    .replace(/\baflo\b/g, 'año').replace(/\barios\b/g, 'años')
    .replace(/\bario\b/g, 'año').replace(/\banos\b/g, 'años')
    .replace(/\bano\b/g, 'año')
    .replace(/\bcaracter\b/g, 'carácter').replace(/\bdecision\b/g, 'decisión')
    .replace(/\bdesempefiar\b/g, 'desempeñar').replace(/\bdesempeiar\b/g, 'desempeñar')
    .replace(/\bsignc\b/g, 'signo').replace(/\bafio\b/g, 'año');
}

// Regente del Ascendente en casas (de "Cómo Trabajarla")
const REGENTE_CASA = {
  1: 'Remodelación de carácter y hábitos.',
  2: 'Época de ganar dinero por rentas, ventas, negocios, etc.',
  3: 'Escribir, estudiar, publicar, viajar, comunicación, etc.',
  4: 'Construcción, arreglos, mejoras de vivienda, negocio personal.',
  5: 'Creatividad, fundar algo nuevo, tener hijos.',
  6: 'Nuevas habilidades laborales.',
  7: 'Nuevos hábitos por colaboración con otros.',
  8: 'Tiempo de terminar un asunto del pasado.',
  9: 'Nuevas conductas laborales, viajes, extranjero, estudios superiores.',
  10: 'Innovaciones y crecimiento profesional.',
  11: 'Nuevas esperanzas, anhelos y deseos.',
  12: 'Tiempo de retiro, recogimiento o introversión.',
};
for (const [casa, txt] of Object.entries(REGENTE_CASA)) {
  entradas.push({ tipo: 'regente-casa', casa: Number(casa), texto: [txt] });
}

const salida = {
  meta: {
    titulo: 'Revolución Solar — corpus de interpretación',
    fuentes: ['Tito Maciá, "La Revolución Solar y sus Atacires"', '"Revolución Solar — Cómo Trabajarla"'],
    total: entradas.length,
  },
  entradas,
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 1), 'utf8');

const porTipo = {};
for (const e of entradas) porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1;
console.log('Entradas:', entradas.length, porTipo);
const vacias = entradas.filter((e) => !e.texto.length);
console.log('Vacías:', vacias.length, vacias.map((e) => e.tipo + ' ' + (e.signo || e.casa)));
