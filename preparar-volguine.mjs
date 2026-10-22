// ============================================================
//  preparar-volguine.mjs
//  Extrae el corpus de interpretación de "La técnica de las
//  revoluciones solares" de Alexandre Volguine (OCR previo) y
//  genera datos/volguine.json
//
//  Secciones:
//   · asc-casa-natal   (12)  — Ascendente anual en las casas natales
//   · mc-casa-natal    (12)  — Mediocielo anual en las casas natales
//   · superposicion    (N)   — casas anuales ↔ casas natales
//   · asc-signo        (12)  — Ascendente anual en los signos
//   · planeta-casa     (120) — los 10 planetas en las 12 casas
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const FUENTE = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/imports/astrologia/principiantes/texto/620779950-Volguine-Alexandre-La-tecnica-de-las-revoluciones-solares.txt';
const SALIDA = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/projects/agente-astrologia/carta-natal/datos/volguine.json';

const text = readFileSync(FUENTE, 'utf8').replace(/\r/g, '');
const lines = text.split('\n');
const N = lines.length;

// ---------- limpieza OCR ----------
function limpiar(t) {
  t = t.replace(/([a-záéíóúñ])-\s+([a-záéíóúñ])/gi, '$1$2');
  return t
    .replace(/\bafio\b/g, 'año').replace(/\bafios\b/g, 'años')
    .replace(/\baflo\b/g, 'año').replace(/\barios\b/g, 'años')
    .replace(/\bario\b/g, 'año').replace(/\banos\b/g, 'años')
    .replace(/\bano\b/g, 'año')
    .replace(/\bcaracter\b/g, 'carácter').replace(/\bdecision\b/g, 'decisión')
    .replace(/\bdesempefiar\b/g, 'desempeñar').replace(/\bdesempeiar\b/g, 'desempeñar')
    .replace(/\bindice\b/g, 'índice').replace(/\bindices\b/g, 'índices')
    .replace(/\bnifios\b/g, 'niños').replace(/\bnino\b/g, 'niño')
    .replace(/\bsegun\b/g, 'según').replace(/\bSegun\b/g, 'Según')
    .replace(/\bsujeto\b/g, 'sujeto');
}

function esRuido(l) {
  if (!l) return true;
  if (/^===== PDF page/.test(l)) return true;
  const t = l.trim();
  if (/^\d{1,4}$/.test(t)) return true; // número de página
  const letras = (t.match(/[A-Za-zÁÉÍÓÚáéíóúñÑ]/g) || []).length;
  if (t.length < 5) return true;
  if (t.length < 40 && letras / t.length < 0.45) return true;
  return false;
}

// Reconstruye párrafos (mantiene la primera línea: encabezado + inicio del texto)
function parrafos(lineas) {
  const out = [];
  let buf = '';
  for (const l of lineas) {
    const s = l.trim();
    if (!s) continue;
    if (!buf) { buf = s; continue; }
    if (/[.!?]$/.test(buf) && /^[A-ZÁÉÍÓÚÑ"“(]/.test(s)) { out.push(buf); buf = s; }
    else buf += ' ' + s;
  }
  if (buf) out.push(buf);
  return out.map((p) => limpiar(p.trim())).filter((p) => p.length > 0);
}

// ---------- parseo de número de casa (con ruido de ordinal ª) ----------
function parseCasa(tok) {
  const n = parseInt(tok, 10);
  if (isNaN(n)) return null;
  if (n >= 1 && n <= 12) return n;
  const m = parseInt(String(n).slice(0, -1), 10);
  return (m >= 1 && m <= 12) ? m : null;
}

const PLANETAS = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
const normalizarSigno = (s) => {
  const n = s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const mapa = { aries: 'Aries', tauro: 'Tauro', geminis: 'Géminis', cancer: 'Cáncer', leo: 'Leo', virgo: 'Virgo', libra: 'Libra', escorpio: 'Escorpio', sagitario: 'Sagitario', capricornio: 'Capricornio', acuario: 'Acuario', piscis: 'Piscis' };
  return mapa[n] || null;
};

// ---------- utilidad: agrupar líneas en bloques por encabezado ----------
function bloques(desde, hasta, esHeading) {
  const res = [];
  let actual = null;
  for (let i = desde; i <= hasta && i <= N; i++) {
    const l = lines[i - 1]; // 1-indexado
    if (esHeading(l)) {
      if (actual) res.push(actual);
      actual = [l];
    } else if (actual && !esRuido(l)) {
      actual.push(l);
    }
  }
  if (actual) res.push(actual);
  return res;
}

// ============================================================
function extraerAscCasas() {
  const esH = (l) => /^Ascendente( anual)?\s+(en|de|sobre)\s+(la|el)\s+/i.test(l);
  const bl = bloques(1148, 1493, esH);
  return bl.slice(0, 12).map((b, idx) => ({
    tipo: 'asc-casa-natal', casa: idx + 1, texto: parrafos(b),
  }));
}

function extraerMcCasas() {
  const esH = (l) => /^(Si el |El )Mediocielo/i.test(l);
  const bl = bloques(1533, 1756, esH);
  return bl.slice(0, 12).map((b, idx) => ({
    tipo: 'mc-casa-natal', casa: idx + 1, texto: parrafos(b),
  }));
}

function extraerSuperposiciones() {
  const esH = (l) => /^La\s+\d/.test(l);
  const bl = bloques(1793, 2555, esH);
  const entradas = [];
  for (const b of bl) {
    const h = b[0].trim();
    const m = h.match(/^La\s+(\d+)/);
    if (!m) continue;
    const anual = parseCasa(m[1]);
    const m2 = h.match(/en\s+(?:la\s+)?(\d+)/i);
    const natal = m2 ? parseCasa(m2[1]) : null;
    if (anual == null || natal == null) continue;
    const texto = parrafos(b);
    if (!texto.length) continue;
    entradas.push({ tipo: 'superposicion', anual, natal, texto });
  }
  return entradas;
}

function extraerAscSignos() {
  const esH = (l) => /(?:Ascendente|cendente)\s+anual\s+en\s+[A-ZÁÉÍÓÚ]/i.test(l);
  const bl = bloques(2560, 2690, esH);
  const entradas = [];
  for (const b of bl) {
    const h = b[0].trim();
    const m = h.match(/(?:Ascendente|cendente)\s+anual\s+en\s+([A-ZÁÉÍÓÚ][a-záéíóúñ]+)/);
    const signo = m ? normalizarSigno(m[1]) : null;
    if (!signo) continue;
    entradas.push({ tipo: 'asc-signo', signo, texto: parrafos(b) });
  }
  return entradas;
}

function extraerPlanetas() {
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const esH = (l) => {
    const hn = norm(l.trim());
    return PLANETAS.some((p) => {
      const pn = norm(p);
      return new RegExp('^(el ' + pn + '|la ' + pn + '|' + pn + ')\\s+en\\s+la\\s+').test(hn);
    });
  };
  const getPlaneta = (h) => {
    const hn = norm(h.trim());
    for (const p of PLANETAS) {
      const pn = norm(p);
      if (hn.startsWith(pn + ' en la') || hn.startsWith('el ' + pn + ' en la') || hn.startsWith('la ' + pn + ' en la')) return p;
    }
    return null;
  };
  const bl = bloques(2744, 3820, esH);
  const contadores = {};
  const entradas = [];
  for (const b of bl) {
    const planeta = getPlaneta(b[0]);
    if (!planeta) continue;
    contadores[planeta] = (contadores[planeta] || 0) + 1;
    const casa = contadores[planeta];
    if (casa > 12) continue;
    entradas.push({ tipo: 'planeta-casa', planeta, casa, texto: parrafos(b) });
  }
  return entradas;
}

// ============================================================
const entradas = [
  ...extraerAscCasas(),
  ...extraerMcCasas(),
  ...extraerSuperposiciones(),
  ...extraerAscSignos(),
  ...extraerPlanetas(),
];

const salida = {
  meta: {
    titulo: 'Volguine — La técnica de las revoluciones solares (corpus)',
    fuente: 'Alexandre Volguine, "La técnica de las revoluciones solares", Ed. Kier (1988)',
    total: entradas.length,
  },
  entradas,
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 1), 'utf8');

const porTipo = {};
for (const e of entradas) porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1;
console.log('Total entradas:', entradas.length, porTipo);
const vacias = entradas.filter((e) => !e.texto.length);
console.log('Vacías:', vacias.length);

// detalle planetas
for (const p of PLANETAS) {
  const n = entradas.filter((e) => e.tipo === 'planeta-casa' && e.planeta === p).length;
  if (n !== 12) console.log(`  planeta ${p}: ${n}/12`);
}
// detalle asc-signo
const got = entradas.filter((e) => e.tipo === 'asc-signo').map((e) => e.signo);
console.log('asc-signo:', got.join(', '));
// detalle superposiciones
const sup = entradas.filter((e) => e.tipo === 'superposicion');
console.log('Superposiciones:', sup.length);
