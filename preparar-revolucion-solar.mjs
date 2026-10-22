// ============================================================
//  preparar-revolucion-solar2.mjs  (v2, ampliado — 12-oct-2026)
//  Extrae el corpus de interpretación de la Revolución Solar:
//   v1: asc-signo, sol-casa (Maciá) + regente-casa (Cómo Trabajarla)
//   v2 añade (Maciá): asc-casa-natal, mc-casa-natal, asc-planeta,
//     regente-casa-macia, astrodinas (guía + subnotas), infortunio
//     (guía/conjunción/casas), atacires (guía/asc-casas/mc/sol/luna/
//     venus/marte/saturno), relocación, fortuna (guía + afortunar).
//  Salida: JSON (para datos/revolucion-solar.json)
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const FUENTE = 'C:/Users/Darth Turo/.openclaw-autoclaw/workspace/imports/astrologia/principiantes/texto/515525647-Tito-Macia-La-Revolucion-Solar-y-Sus-Atacires.txt';
const SALIDA = 'C:/Users/Darth Turo/Desktop/projects/agente-astrologia/carta-natal/datos/revolucion-solar.json';

let text = readFileSync(FUENTE, 'utf8').replace(/\r/g, '');
// cortar el ÍNDICE final (repite todos los títulos)
const idxCorte = text.indexOf('\nINDICE\n');
if (idxCorte > 0) text = text.slice(0, idxCorte);
const lines = text.split('\n');

const SIGNO_MAPA = {
  aries: 'Aries', tauro: 'Tauro', 'géminis': 'Géminis', geminis: 'Géminis', cancer: 'Cáncer', 'cáncer': 'Cáncer',
  leo: 'Leo', virgo: 'Virgo', libra: 'Libra', escorpio: 'Escorpio', sagitario: 'Sagitario',
  capricornio: 'Capricornio', acuario: 'Acuario', piscis: 'Piscis',
};
const ROMANO = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12 };

// ---------------------------------------------------------------- clasificador
// devuelve {tipo, clave...} o null
function clasificar(s, prev, next) {
  let m;
  // v1
  m = s.match(/^Ascendente en ([A-Za-zÁÉÍÓÚáéíóúñÑ]+)/);
  if (m) {
    const signo = SIGNO_MAPA[m[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')];
    if (signo) return { tipo: 'asc-signo', signo };
  }
  m = s.match(/^Sol de revoluci[oó]n en Casa ([IVX]+)/i);
  if (m && ROMANO[m[1]]) return { tipo: 'sol-casa', casa: ROMANO[m[1]] };

  // v2 — cabeceras nuevas
  m = s.match(/^Ascendente de la revoluci[oó]n en Casa ([IVX]+) natal$/);
  if (m && ROMANO[m[1]]) return { tipo: 'asc-casa-natal', casa: ROMANO[m[1]] };
  m = s.match(/^Mediocielo de la revoluci[oó]n sobre la Casa ([IVX]+) natal$/);
  if (m && ROMANO[m[1]]) return { tipo: 'mc-casa-natal', casa: ROMANO[m[1]] };
  if (/^ASCENDENTE DE LA REVOLUCI[oóOÓ]N SOLAR$/.test(s) && /^SOBRE LOS PLANETAS NATALES$/.test(next || ''))
    return { tipo: 'asc-planeta' };
  m = s.match(/^(?:El )?[Rr]egente de la revoluci[oó]n en Casa ([IVX]+)$/);
  if (m && ROMANO[m[1]]) return { tipo: 'regente-casa-macia', casa: ROMANO[m[1]] };
  if (/^Astrodinas, intensidad y calidad de las sincronicidades$/i.test(s)) return { tipo: 'astrodinas-intro' };
  if (/^EL REGENTE DEL ASCENDENTE$/.test(s) && /^DE LA REVOLUCION SOLAR Y LAS ASTRODINAS$/.test(next || '')) return { tipo: 'regente-guia' };
  if (/^EL REGENTE DEL ASCENDENTE DE LA REVOLUCION SOLAR Y LAS ASTRODINAS$/.test(s)) return { tipo: 'regente-guia' };
  if (/^Notas aclaratorias$/i.test(s)) return { tipo: 'notas-aclaratorias' };
  if (/^Astrodinas por aspectos$/i.test(s)) return { tipo: 'astrodinas-aspectos' };
  if (/^Astrodinas por posici[oó]n$/i.test(s)) return { tipo: 'astrodinas-posicion' };
  if (/^Domicilio$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'domicilio' };
  if (/^Exaltaci[oó]n$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'exaltacion' };
  if (/^Dodecatemorias?$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'dodecatemoria' };
  if (/^Planeta sobre la tierra$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'sobre-tierra' };
  if (/^Planeta oriental$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'oriental' };
  if (/^Planeta directo$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'directo' };
  if (/^Planeta retr[oó]grado$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'retrogrado' };
  if (/^Gozo$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'gozo' };
  if (/^Planeta dispositor de otros planetas$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'dispositor' };
  if (/^Destierro$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'destierro' };
  if (/^Ca[ií]da$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'caida' };
  if (/^Planeta peregrino$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'peregrino' };
  if (/^Recepci[oó]n mutua$/i.test(s)) return { tipo: 'astrodina-nota', clave: 'recepcion' };
  if (/^El Infortunio en conjunci[oó]n con otros planetas/i.test(s)) return { tipo: 'infortunio-conjuncion' };
  if (/^EL PARTE DEL INFORTUNIO EN LA REVOLUCI[oóOÓ]N$/.test(s)) return { tipo: 'infortunio-guia' };
  m = s.match(/^Infortunio en Casa ([IVX]+)$/);
  if (m && ROMANO[m[1]]) return { tipo: 'infortunio-casa', casa: ROMANO[m[1]] };
  if (/^LAS DIRECCIONES O EL ATACIR$/.test(s) && /^DE LA REVOLUCI[oóOÓ]N SOLAR$/.test(next || ''))
    return { tipo: 'atacir-guia' };
  m = s.match(/^Atacir del Ascendente en Casa ([IVX]+)$/);
  if (m && ROMANO[m[1]]) return { tipo: 'atacir-asc-casa', casa: ROMANO[m[1]] };
  if (/^Atacires del Mediocielo sobre los planetas$/i.test(s)) return { tipo: 'atacir-mc' };
  if (/^Atacires de los planetas$/i.test(s)) return { tipo: 'atacir-planetas-guia' };
  if (/^Atacir del Sol de la revoluci[oó]n solar/i.test(s)) return { tipo: 'atacir-sol' };
  if (/^Atacires de la Luna$/i.test(s)) return { tipo: 'atacir-luna' };
  if (/^Atacires de Venus$/i.test(s)) return { tipo: 'atacir-venus' };
  if (/^Atacires de Marte$/i.test(s)) return { tipo: 'atacir-marte' };
  if (/^Atacires de Saturno$/i.test(s)) return { tipo: 'atacir-saturno' };
  if (/^LA RELOCACION, LA TERAPIA PREVENTIVA$/i.test(s)) return { tipo: 'relocacion' };
  if (/^LA INFLUENCIA DEL PARTE DE FORTUNA/i.test(s)) return { tipo: 'fortuna-guia' };
  if (/Afortunar/i.test(s) && /planetas del/i.test(s)) return { tipo: 'fortuna-afortunar' };
  return null;
}

function esRuido(l) {
  if (!l) return true;
  if (/^===== PDF page/.test(l)) return true;
  const t = l.trim();
  if (/^(LA REVOLUCI[OÓ]N SOLAR Y SUS ATACIRES|LA REVOLUCI[OÓ]N SOLARY SUS ATACIRES|Tito Maci[áa]|Tito Macia)$/i.test(t)) return true;
  if (/^\d{1,4}$/.test(t)) return true;
  if (/^\d+ astrodinas?$/i.test(t)) return true;
  if (/^(Atacires|Revoluci[oó]n solar) \d/i.test(t) && t.length < 60) return true; // pies de figura
  if (/^Atacires (de la revoluci[oó]n|\d)/i.test(t) && t.length < 60) return true;
  const letras = (t.match(/[A-Za-zÁÉÍÓÚáéíóúñÑ]/g) || []).length;
  const total = t.length;
  if (total < 6) return true;
  if (total < 40 && letras / total < 0.5) return true;
  return false;
}

// ---------------------------------------------------------------- recolección
const entradas = [];
let actual = null;

for (let i = 0; i < lines.length; i++) {
  const s = lines[i].trim();
  const cl = clasificar(s, lines[i - 1] || '', lines[i + 1] || '');
  if (cl) {
    if (actual) entradas.push(actual);
    actual = { ...cl, texto: [] };
  } else if (actual && !esRuido(lines[i])) {
    actual.texto.push(s);
  }
}
if (actual) entradas.push(actual);

// ---------------------------------------------------------------- párrafos
function limpiar(t) {
  return t
    .replace(/([a-záéíóúñ])-\s+([a-záéíóúñ])/gi, '$1$2')
    .replace(/^(DEL ASTROLOGO|EN LA REVOLUCION ANUAL|DE LA REVOLUCION SOLAR Y LAS ASTRODINAS|DE LA REVOLUCION SOLAR|SOBRE LOS PLANETAS NATALES|El Infortunio|EL REGENTE DEL ASCENDENTE DE LA REVOLUCION SOLAR Y LAS ASTRODINAS|Y LAS ASTRODINAS)\s+/, '')
    .replace(/\bafio\b/g, 'año').replace(/\bafǐo\b/g, 'año').replace(/\baflo\b/g, 'año')
    .replace(/\baiio\b/g, 'año').replace(/\baiios\b/g, 'años')
    .replace(/\barios\b/g, 'años').replace(/\bario\b/g, 'año').replace(/\banos\b/g, 'años')
    .replace(/\bano\b/g, 'año').replace(/\baios\b/g, 'años').replace(/\baio\b/g, 'año')
    .replace(/\bafios\b/g, 'años').replace(/\bafros\b/g, 'años')
    .replace(/\bCasalI\b/g, 'Casa I').replace(/\bCass\b/g, 'Casa')
    .replace(/\bsefialar\b/g, 'señalar').replace(/\bsefiala\b/g, 'señala').replace(/\bsefiora\b/g, 'señora')
    .replace(/\bsefior\b/g, 'señor').replace(/\bcompa[ií]ero\b/g, 'compañero').replace(/\bcompa[ií]eros\b/g, 'compañeros')
    .replace(/\bcumpleafios\b/g, 'cumpleaños').replace(/\bcumplearios\b/g, 'cumpleaños').replace(/\bcumpleafio\b/g, 'cumpleaños')
    .replace(/\bdafios\b/g, 'daños').replace(/\bengafiosos\b/g, 'engañosos').replace(/\bengafio\b/g, 'engaño')
    .replace(/\bmafiana\b/g, 'mañana').replace(/\bpequefio\b/g, 'pequeño').replace(/\bpequeiio\b/g, 'pequeño')
    .replace(/\bcaracter\b/g, 'carácter').replace(/\bdecision\b/g, 'decisión')
    .replace(/\bdesempefiar\b/g, 'desempeñar').replace(/\bdesempeiar\b/g, 'desempeñar')
    .replace(/\bsignc\b/g, 'signo').replace(/\bdiai?o\b/g, 'día')
    .replace(/\bsenala\b/g, 'señala').replace(/\bsenalado\b/g, 'señalado');
}

function ensamblar(e) {
  const parrafos = [];
  let buf = '';
  for (const l of e.texto) {
    if (!buf) { buf = l; continue; }
    if (/[.!?]$/.test(buf.trim()) && /^[A-ZÁÉÍÓÚÑ"“¿¡]/.test(l)) {
      parrafos.push(buf);
      buf = l;
    } else {
      buf += ' ' + l;
    }
  }
  if (buf) parrafos.push(buf);
  e.texto = parrafos.map((p) => limpiar(p.trim())).filter(Boolean);
}

for (const e of entradas) ensamblar(e);

// ------------------------------------------------ duplicados de secciones
// (el listado de valores de astrodinas repite 5 encabezados; «Astrodinas por
// aspectos» aparece dos veces — se combinan)
{
  const claveDe = (e) => e.tipo + '|' + (e.signo || e.casa || e.clave || '');
  const grupos = new Map();
  for (const e of entradas) {
    const k = claveDe(e);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(e);
  }
  const finales = [];
  for (const [k, lista] of grupos) {
    if (lista.length === 1) { finales.push(lista[0]); continue; }
    const tipo = lista[0].tipo;
    if (tipo === 'astrodina-nota' || tipo === 'astrodinas-aspectos') {
      // fusionar (deduplicar párrafos exactos)
      const vistos = new Set();
      const texto = [];
      for (const e of lista) for (const p of e.texto) { if (!vistos.has(p)) { vistos.add(p); texto.push(p); } }
      finales.push({ ...lista[0], texto });
    } else {
      // quedarse con la ocurrencia con más texto
      finales.push(lista.slice().sort((a, b) => b.texto.join(' ').length - a.texto.join(' ').length)[0]);
    }
  }
  entradas.length = 0;
  entradas.push(...finales);
}

// Regente del Ascendente en casas (de "Cómo Trabajarla") — v1, se conserva
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
    fuentes: [
      'Tito Maciá, "La Revolución Solar y sus Atacires" (v2 ampliada: superposiciones, regente/astrodinas, infortunio, atacires, relocación, fortuna)',
      '"Revolución Solar — Cómo Trabajarla"',
    ],
    total: entradas.length,
  },
  entradas,
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 1), 'utf8');

const porTipo = {};
for (const e of entradas) porTipo[e.tipo] = (porTipo[e.tipo] || 0) + 1;
console.log('Entradas:', entradas.length);
console.log(porTipo);
const vacias = entradas.filter((e) => !e.texto.length);
console.log('Vacías:', vacias.length, vacias.map((e) => e.tipo + ' ' + (e.signo || e.casa || e.clave || '')));
// muestras
for (const t of ['asc-casa-natal', 'mc-casa-natal', 'regente-casa-macia', 'infortunio-casa', 'atacir-asc-casa', 'astrodina-nota', 'fortuna-guia', 'relocacion', 'asc-planeta', 'atacir-guia']) {
  const e0 = entradas.find((x) => x.tipo === t);
  if (e0) console.log('\n--- muestra', t, (e0.casa || e0.clave || ''), '| párrafos:', e0.texto.length, '| chars:', e0.texto.join(' ').length);
  if (e0) console.log((e0.texto[0] || '').slice(0, 220));
}
