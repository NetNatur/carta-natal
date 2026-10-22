// ============================================================
//  Fichas por tema - los significadores reales de la carta
//  Patrón: un tema se juzga por sus significadores, no por todo.
//  Para cada factor: ¿qué accidente? → ¿se dará? → ¿calidad y
//  cantidad? (triple pregunta de Morin).
//  Temas: Salud, Riqueza, Matrimonio, Profesión, Estudio,
//  Padres, Viajes y fe.
//  Fuentes: Morin (Libro XXI: determinación local; Libro 25:
//  lunación pre-natal), Weiss (Astrología Racional), Aben Ragel
//  (Libro I: naturalezas, partes; Libro IV: hyleg, alcocoden).
// ============================================================
import { Body } from './vendor/dist/index.js';
import { NOMBRES_SIGNOS } from './carta.js';
import { terminoDe } from './terminos.js';
import { duracionVida } from './divisores.js';

// ---------- Constantes ----------
const REGENTES = {
  Aries: 'Marte', Tauro: 'Venus', Géminis: 'Mercurio', Cáncer: 'Luna',
  Leo: 'Sol', Virgo: 'Mercurio', Libra: 'Venus', Escorpio: 'Marte',
  Sagitario: 'Júpiter', Capricornio: 'Saturno', Acuario: 'Saturno', Piscis: 'Júpiter',
};
const EXALTACIONES = {
  Aries: 'Sol', Tauro: 'Luna', Cáncer: 'Júpiter', Virgo: 'Mercurio',
  Libra: 'Saturno', Capricornio: 'Marte', Piscis: 'Venus',
};
// Decanatos caldeos (faces): señores por signo y decano (Aben Ragel, Libro I)
const FACES = [
  ['Marte', 'Sol', 'Venus'],       // Aries
  ['Mercurio', 'Luna', 'Saturno'], // Tauro
  ['Júpiter', 'Marte', 'Sol'],     // Géminis
  ['Venus', 'Mercurio', 'Luna'],   // Cáncer
  ['Saturno', 'Júpiter', 'Marte'], // Leo
  ['Sol', 'Venus', 'Mercurio'],    // Virgo
  ['Luna', 'Saturno', 'Júpiter'],  // Libra
  ['Marte', 'Sol', 'Venus'],       // Escorpio
  ['Mercurio', 'Luna', 'Saturno'], // Sagitario
  ['Júpiter', 'Marte', 'Sol'],     // Capricornio
  ['Venus', 'Mercurio', 'Luna'],   // Acuario
  ['Saturno', 'Júpiter', 'Marte'], // Piscis
];
// Triplicidades por sect (Doroteo): señor de día / de noche
const TRIPLICIDADES = {
  fuego: { dia: 'Sol', noche: 'Júpiter' },
  tierra: { dia: 'Venus', noche: 'Luna' },
  aire: { dia: 'Saturno', noche: 'Mercurio' },
  agua: { dia: 'Marte', noche: 'Luna' },
};
const ELEMENTO = ['fuego', 'tierra', 'aire', 'agua', 'fuego', 'tierra', 'aire', 'agua', 'fuego', 'tierra', 'aire', 'agua'];
const INDICE_SIGNO = { Aries: 0, Tauro: 1, Géminis: 2, Cáncer: 3, Leo: 4, Virgo: 5, Libra: 6, Escorpio: 7, Sagitario: 8, Capricornio: 9, Acuario: 10, Piscis: 11 };
export const ANIOS_MAYORES = { Sol: 120, Luna: 108, Mercurio: 76, Venus: 82, Marte: 66, Júpiter: 79, Saturno: 57 };
const NOMBRE_ASPECTO_ES = {
  Conjunction: 'Conjunción', Sextile: 'Sextil', Square: 'Cuadratura',
  Trine: 'Trígono', Opposition: 'Oposición',
};
const TEXTO_ELEMENTO = {
  fuego: 'caliente y seco: dolencias agudas, febriles, inflamatorias',
  tierra: 'frío y seco: huesos, piel, dientes, retención',
  aire: 'cálido y húmedo: sangre, nervios, contracturas',
  agua: 'frío y húmedo: linfa, digestiones, retención de líquidos',
};
const TEXTO_ELEMENTO_TEMA = {
  fuego: 'se vive con intensidad y prontitud; lo que se inicia prende rápido',
  tierra: 'se asienta despacio y de forma estable; lo que se construye dura',
  aire: 'se resuelve por la palabra, el trato y las ideas',
  agua: 'se siente y se hereda; lo emocional lo impregna',
};
// Naturaleza de cada planeta según el asunto de la casa que ocupa
const NATURALEZA = {
  Saturno: 'freno, estructura, demora, herencia',
  Júpiter: 'expansión, ganancia, protección, fe',
  Marte: 'impulso, esfuerzo, conflicto, corte',
  Sol: 'autoridad, honores, vitalidad',
  Luna: 'cambio, hábitos, el público, la madre',
  Mercurio: 'ingenio, comercio, escritura, trato',
  Venus: 'unión, gusto, dinero, armonía',
  Urano: 'cambios súbitos, rupturas, inventiva',
  Neptuno: 'disolución, inspiración, engaño',
  Plutón: 'crisis, transformación, poder',
};
const NATURALEZA_VI = {
  Saturno: 'dolencias lentas y frías (huesos, piel)',
  Marte: 'accidentes, fiebres, inflamaciones, cortes',
  Luna: 'salud fluctuante, digestiones y humores',
  Sol: 'el corazón y la vitalidad misma',
  Mercurio: 'nervios, vías respiratorias, inquietud',
  Venus: 'mitiga la casa: buena asimilación; excesos (garganta, riñón)',
  Júpiter: 'mitiga la casa: recuperación y buena sangre',
  Urano: 'trastornos súbitos e intermitentes, nervios',
  Neptuno: 'dolencias difusas y difíciles de diagnosticar',
  Plutón: 'crisis profundas con regeneración',
};
const GLIFO = {
  Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂',
  Júpiter: '♃', Saturno: '♄', Urano: '♅', Neptuno: '♆', Plutón: '♇',
};

// ---------- Utilidades ----------
const signoDe = (lon) => NOMBRES_SIGNOS[Math.floor((((lon % 360) + 360) % 360) / 30)];
const casaDe = (lon, cusps) => {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (((lon - a + 360) % 360) < ((b - a + 360) % 360)) return i + 1;
  }
  return 1;
};
const gradoEnSigno = (lon) => {
  const d = ((lon % 30) + 30) % 30;
  return `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, '0')}'`;
};
const fmtLon = (lon) => `${gradoEnSigno(lon)} ${signoDe(lon)}`;

function estadoEsencial(nombre, lon) {
  const s = signoDe(lon), sOp = signoDe(lon + 180);
  if (REGENTES[s] === nombre) return { nombre: 'Domicilio', grado: 5 };
  if (EXALTACIONES[s] === nombre) return { nombre: 'Exaltación', grado: 4 };
  if (REGENTES[sOp] === nombre) return { nombre: 'Detrimento', grado: -5 };
  if (EXALTACIONES[sOp] === nombre) return { nombre: 'Caída', grado: -4 };
  return { nombre: 'Peregrino', grado: 0 };
}
function fraseEstado(est) {
  switch (est.nombre) {
    case 'Domicilio': return 'en domicilio: obra con toda su fuerza';
    case 'Exaltación': return 'exaltado: obra por encima de su naturaleza';
    case 'Detrimento': return 'en detrimento: su asunto se tuerce';
    case 'Caída': return 'en caída: su asunto se hunde';
    default: return 'peregrino: obra según quien lo reciba';
  }
}
function faseLunar(lonSol, lonLun) {
  const f = (((lonLun - lonSol) % 360) + 360) % 360;
  if (f < 45 || f >= 315) return 'Nueva';
  if (f < 135) return 'Creciente';
  if (f < 225) return 'Llena';
  return 'Menguante';
}
const esDiurno = (datos) => {
  const sol = datos.planetas.find((p) => p.nombre === 'Sol');
  if (!sol) return true;
  return casaDe(sol.lon, datos.cusps) >= 7; // ☉ sobre el horizonte (casas VII-XII)
};
function aspectosDe(datos, nombre, con = null) {
  const res = [];
  for (const a of datos.aspectosExt || []) {
    let otro = null;
    if (a.from.name === nombre) otro = a.to.name;
    else if (a.to.name === nombre) otro = a.from.name;
    if (!otro) continue;
    if (con && !con.includes(otro)) continue;
    if (NOMBRE_ASPECTO_ES[a.aspect.name]) res.push({ otro, tipo: a.aspect.name, orb: a.orb, applying: a.applying });
  }
  return res;
}
function aspectosManual(lon, planetas, orbes = { Conjunction: 8, Sextile: 6, Square: 7, Trine: 7, Opposition: 8 }) {
  const res = [];
  for (const p of planetas) {
    if (p.nombre === 'Sol' || p.nombre === 'Luna') continue;
    const d = Math.abs(((lon - p.lon + 540) % 360) - 180);
    for (const [tipo, ang] of [['Conjunction', 0], ['Sextile', 60], ['Square', 90], ['Trine', 120], ['Opposition', 180]]) {
      const orb = Math.abs(d - ang);
      if (orb <= orbes[tipo]) { res.push({ otro: p.nombre, tipo, orb }); break; }
    }
  }
  return res;
}
function fraseAspecto(a) {
  const es = NOMBRE_ASPECTO_ES[a.tipo];
  const armonico = a.tipo === 'Trine' || a.tipo === 'Sextile';
  const matiz = armonico ? 'el contacto se vuelve apoyo' : 'el contacto lastra';
  return `${es} de ${a.otro} (orbe ${a.orb.toFixed(1)}°): ${matiz}`;
}
function maleficosTexto(datos, nombre) {
  const lista = aspectosDe(datos, nombre, ['Saturno', 'Marte']);
  if (!lista.length) return null;
  return lista.map(fraseAspecto).join('; ');
}
function aspectoCuspide(datos, lonCusp, nombres) {
  const res = [];
  for (const a of aspectosManual(lonCusp, datos.planetas)) {
    if (nombres.includes(a.otro)) res.push(a);
  }
  return res;
}

// ---------- Contexto común ----------
function baseContext(datos) {
  const P = {};
  for (const p of datos.planetas) P[p.nombre] = p;
  return { P, datos, diurno: esDiurno(datos) };
}
function mkCasa(datos, P, n, nombreCasa) {
  const cusp = datos.cusps[n - 1];
  const reg = REGENTES[signoDe(cusp)];
  return {
    casa: n, nombreCasa, cuspideSigno: signoDe(cusp), cuspideLon: cusp,
    regente: reg, regenteDato: P[reg] || null,
    planetas: datos.planetas.filter((p) => p.casa === n && !['Nodo Norte', 'Lilith'].includes(p.nombre)),
  };
}
const cuerpo = (P, nombre) => P[nombre] || null;

// ---------- Lunación pre-natal (Morin, Libro 25) ----------
export function lunacionPrenatal(swe, jd) {
  const fase = (j) => {
    const s = swe.calcWithSign(j, Body.Sun);
    const m = swe.calcWithSign(j, Body.Moon);
    return { fase: (((m.longitude - s.longitude) % 360) + 360) % 360, sol: s.longitude, luna: m.longitude };
  };
  // Hacia atrás, la fase decrece (~13°/día). Cruce de 0 → nueva; de 180 → llena.
  let prev = fase(jd);
  let cruce = null;
  for (let d = jd - 1; d > jd - 32; d--) {
    const cur = fase(d);
    const fCur = cur.fase, fPrev = prev.fase;
    if (fCur > 180 && fPrev < 180) { cruce = { tipo: 'nueva', a: d, b: d + 1 }; break; }
    if (fCur < 180 && fPrev > 180) { cruce = { tipo: 'llena', a: d, b: d + 1 }; break; }
    prev = cur;
  }
  if (!cruce) return null;
  const g = (j) => { const f = fase(j).fase; return f < 180 ? f : f - 360; };
  let a = cruce.a, b = cruce.b;
  let ga = g(a), gb = g(b);
  for (let i = 0; i < 20; i++) {
    const m = (a + b) / 2;
    const gm = g(m);
    if (Math.sign(ga) === Math.sign(gm)) { a = m; ga = gm; } else { b = m; gb = gm; }
  }
  const t = (a + b) / 2;
  const f = fase(t);
  const lon = cruce.tipo === 'nueva' ? f.sol : f.luna;
  return { tipo: cruce.tipo, lon, jd: t };
}

// ---------- Hyleg y alcocoden (simplificado: sin términos) ----------
export function hyleg(datos, diurno) {
  const sol = datos.planetas.find((p) => p.nombre === 'Sol');
  const lun = datos.planetas.find((p) => p.nombre === 'Luna');
  const en = (lon, casas) => casas.includes(casaDe(lon, datos.cusps));
  if (diurno) {
    if (sol && en(sol.lon, [1, 9, 10, 11])) return { nombre: 'Sol', lon: sol.lon, razon: 'nacimiento diurno y ☉ en casa apta (I, IX, X, XI)' };
    if (lun && en(lun.lon, [1, 4, 7, 9, 10, 11])) return { nombre: 'Luna', lon: lun.lon, razon: '☉ sin luz suficiente; ☽ en casa apta' };
  } else {
    if (lun && en(lun.lon, [1, 4, 7, 9, 10, 11])) return { nombre: 'Luna', lon: lun.lon, razon: 'nacimiento nocturno y ☽ en casa apta' };
    if (sol && en(sol.lon, [1, 9, 10, 11])) return { nombre: 'Sol', lon: sol.lon, razon: '☽ sin luz suficiente; ☉ en casa apta' };
  }
  return { nombre: 'Ascendente', lon: datos.asc, razon: 'los luminares no califican; el Ascendente toma la vida' };
}
export function alcocoden(hylegLon, planetas, diurno) {
  const s = signoDe(hylegLon);
  const dec = Math.floor((((hylegLon % 30) + 30) % 30) / 10);
  const puntos = {};
  const sumar = (nombre, pts) => {
    if (nombre && planetas.some((p) => p.nombre === nombre)) puntos[nombre] = (puntos[nombre] || 0) + pts;
  };
  sumar(REGENTES[s], 5);
  sumar(EXALTACIONES[s], 4);
  sumar(terminoDe(hylegLon).planeta, 3);
  sumar(TRIPLICIDADES[ELEMENTO[INDICE_SIGNO[s]]][diurno ? 'dia' : 'noche'], 2);
  sumar(FACES[INDICE_SIGNO[s]][dec], 1);
  let mejor = null;
  for (const [nombre, pts] of Object.entries(puntos)) {
    if (!mejor || pts > mejor.pts) mejor = { nombre, pts };
  }
  if (mejor) mejor.termino = terminoDe(hylegLon);
  return mejor;
}

// ---------- Partes (Aben Ragel, Libro I) ----------
function parteEnfermedad(datos, diurno) {
  const sat = datos.planetas.find((p) => p.nombre === 'Saturno');
  if (!sat || datos.fortuna === null || datos.fortuna === undefined) return null;
  const parte = diurno ? datos.asc + datos.fortuna - sat.lon : datos.asc + sat.lon - datos.fortuna;
  return ((parte % 360) + 360) % 360;
}
function fortunaInfo(datos, P) {
  if (datos.fortuna === null || datos.fortuna === undefined) return null;
  const lon = datos.fortuna;
  const reg = REGENTES[signoDe(lon)];
  return {
    lon, signo: signoDe(lon), casa: casaDe(lon, datos.cusps),
    regente: reg, regenteDato: P[reg] || null,
    dispositor: P[reg] || null,
    beneficos: aspectosManual(lon, datos.planetas).filter((a) => a.otro === 'Júpiter' || a.otro === 'Venus'),
    maleficos: aspectosManual(lon, datos.planetas).filter((a) => a.otro === 'Saturno' || a.otro === 'Marte'),
  };
}

// ============================================================
//  ANÁLISIS POR TEMA
// ============================================================
export function analizarSalud(datos, swe) {
  const { P, datos: d, diurno } = baseContext(datos);
  const enCasa = (n) => datos.planetas.filter((p) => p.casa === n);

  const asc = {
    signo: signoDe(datos.asc), lon: datos.asc,
    planetaEnAsc: enCasa(1).filter((p) => p.nombre !== 'Sol' && p.nombre !== 'Luna'),
    regente: REGENTES[signoDe(datos.asc)],
  };
  asc.regenteDato = P[asc.regente] || null;
  asc.maleficos = maleficosTexto(datos, 'Ascendente');

  const sol = P['Sol'] ? {
    lon: P.Sol.lon, signo: signoDe(P.Sol.lon), casa: P.Sol.casa,
    estado: estadoEsencial('Sol', P.Sol.lon), retro: P.Sol.retro,
    maleficos: maleficosTexto(datos, 'Sol'),
    dispositor: P[REGENTES[signoDe(P.Sol.lon)]] || null,
  } : null;
  const lun = P['Luna'] ? {
    lon: P.Luna.lon, signo: signoDe(P.Luna.lon), casa: P.Luna.casa,
    fase: faseLunar(P.Sol ? P.Sol.lon : 0, P.Luna.lon),
    estado: estadoEsencial('Luna', P.Luna.lon), retro: P.Luna.retro,
    maleficos: maleficosTexto(datos, 'Luna'),
    dispositor: P[REGENTES[signoDe(P.Luna.lon)]] || null,
  } : null;

  const c6 = mkCasa(datos, P, 6, 'VI'), c12 = mkCasa(datos, P, 12, 'XII'), c8 = mkCasa(datos, P, 8, 'VIII');

  const parte = parteEnfermedad(datos, diurno);
  const parteInfo = parte === null ? null : {
    lon: parte, signo: signoDe(parte), casa: casaDe(parte, datos.cusps),
    regente: REGENTES[signoDe(parte)], regenteDato: P[REGENTES[signoDe(parte)]] || null,
    maleficos: aspectosManual(parte, datos.planetas).filter((a) => a.otro === 'Saturno' || a.otro === 'Marte'),
  };

  let lunacion = null;
  if (swe && datos.jd) {
    const l = lunacionPrenatal(swe, datos.jd);
    if (l) {
      lunacion = {
        ...l, signo: signoDe(l.lon), casa: casaDe(l.lon, datos.cusps),
        maleficos: aspectosManual(l.lon, datos.planetas).filter((a) => a.otro === 'Saturno' || a.otro === 'Marte'),
        regente: REGENTES[signoDe(l.lon)], regenteDato: P[REGENTES[signoDe(l.lon)]] || null,
      };
    }
  }

  const h = hyleg(datos, diurno);
  const al = alcocoden(h.lon, datos.planetas, diurno);
  const hylegDato = {
    ...h, estado: estadoEsencial(h.nombre, h.lon),
    maleficos: maleficosTexto(datos, h.nombre),
    alcocoden: al,
    anios: al && ANIOS_MAYORES[al.nombre] ? ANIOS_MAYORES[al.nombre] : null,
    termino: terminoDe(h.lon),
    divisores: duracionVida(datos, h.lon),
  };

  return { diurno, asc, sol, lun, c6, c12, c8, parte: parteInfo, lunacion, hyleg: hylegDato, P, datos: d };
}

export function analizarRiqueza(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  return {
    P, datos: d,
    c2: mkCasa(datos, P, 2, 'II'),
    c8: mkCasa(datos, P, 8, 'VIII'),
    fortuna: fortunaInfo(datos, P),
    jupiter: cuerpo(P, 'Júpiter'),
    venus: cuerpo(P, 'Venus'),
  };
}

export function analizarMatrimonio(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  const c7 = mkCasa(datos, P, 7, 'VII');
  const venus = cuerpo(P, 'Venus');
  const luna = cuerpo(P, 'Luna');
  const sol = cuerpo(P, 'Sol');
  return {
    P, datos: d,
    c7,
    venus: venus ? {
      lon: venus.lon, signo: signoDe(venus.lon), casa: venus.casa,
      estado: estadoEsencial('Venus', venus.lon), retro: venus.retro,
      maleficos: maleficosTexto(d, 'Venus'),
      enVII: venus.casa === 7,
    } : null,
    luna: luna ? {
      lon: luna.lon, signo: signoDe(luna.lon), casa: luna.casa,
      estado: estadoEsencial('Luna', luna.lon), retro: luna.retro,
      maleficos: maleficosTexto(d, 'Luna'),
      enVII: luna.casa === 7,
    } : null,
    sol: sol ? { lon: sol.lon, signo: signoDe(sol.lon), casa: sol.casa, estado: estadoEsencial('Sol', sol.lon) } : null,
    aspectoCuspideVII: aspectoCuspide(d, c7.cuspideLon, ['Venus', 'Luna', 'Sol', 'Júpiter', 'Saturno', 'Marte']),
  };
}

export function analizarProfesion(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  return {
    P, datos: d,
    c10: mkCasa(datos, P, 10, 'X'),
    sol: cuerpo(P, 'Sol') ? {
      lon: P.Sol.lon, signo: signoDe(P.Sol.lon), casa: P.Sol.casa,
      estado: estadoEsencial('Sol', P.Sol.lon), retro: P.Sol.retro,
      maleficos: maleficosTexto(d, 'Sol'),
    } : null,
    mc: { signo: signoDe(datos.mc), lon: datos.mc },
    saturno: cuerpo(P, 'Saturno') ? { lon: P.Saturno.lon, signo: signoDe(P.Saturno.lon), casa: P.Saturno.casa, estado: estadoEsencial('Saturno', P.Saturno.lon) } : null,
    marte: cuerpo(P, 'Marte') ? { lon: P.Marte.lon, signo: signoDe(P.Marte.lon), casa: P.Marte.casa, estado: estadoEsencial('Marte', P.Marte.lon) } : null,
  };
}

export function analizarEstudio(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  const regenteAsc = REGENTES[signoDe(datos.asc)];
  const mercurio = cuerpo(P, 'Mercurio');
  const contacto = mercurio && P[regenteAsc]
    ? aspectoCuspide(d, P[regenteAsc].lon, ['Mercurio']).concat(aspectosDe(d, regenteAsc, ['Mercurio']))
    : [];
  return {
    P, datos: d,
    mercurio: mercurio ? {
      lon: mercurio.lon, signo: signoDe(mercurio.lon), casa: mercurio.casa,
      estado: estadoEsencial('Mercurio', mercurio.lon), retro: mercurio.retro,
      maleficos: maleficosTexto(d, 'Mercurio'),
      saturno: aspectosDe(d, 'Mercurio', ['Saturno']),
      jupiter: aspectosDe(d, 'Mercurio', ['Júpiter']),
      luna: aspectosDe(d, 'Mercurio', ['Luna']),
    } : null,
    c3: mkCasa(datos, P, 3, 'III'),
    c9: mkCasa(datos, P, 9, 'IX'),
    regenteAsc,
    regenteAscDato: P[regenteAsc] || null,
    contacto,
  };
}

export function analizarPadres(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  const sol = cuerpo(P, 'Sol');
  const luna = cuerpo(P, 'Luna');
  const c4 = mkCasa(datos, P, 4, 'IV');
  return {
    P, datos: d,
    c4,
    sol: sol ? {
      lon: sol.lon, signo: signoDe(sol.lon), casa: sol.casa,
      estado: estadoEsencial('Sol', sol.lon), retro: sol.retro,
      maleficos: maleficosTexto(d, 'Sol'),
      enIV: sol.casa === 4,
    } : null,
    luna: luna ? {
      lon: luna.lon, signo: signoDe(luna.lon), casa: luna.casa,
      estado: estadoEsencial('Luna', luna.lon), retro: luna.retro,
      maleficos: maleficosTexto(d, 'Luna'),
      enIV: luna.casa === 4,
    } : null,
    saturno: cuerpo(P, 'Saturno') ? { lon: P.Saturno.lon, signo: signoDe(P.Saturno.lon), casa: P.Saturno.casa, estado: estadoEsencial('Saturno', P.Saturno.lon), enIV: P.Saturno.casa === 4 } : null,
    venus: cuerpo(P, 'Venus') ? { lon: P.Venus.lon, signo: signoDe(P.Venus.lon), casa: P.Venus.casa, estado: estadoEsencial('Venus', P.Venus.lon), enIV: P.Venus.casa === 4 } : null,
  };
}

export function analizarViajes(datos, swe) {
  const { P, datos: d } = baseContext(datos);
  const luna = cuerpo(P, 'Luna');
  return {
    P, datos: d,
    c9: mkCasa(datos, P, 9, 'IX'),
    c3: mkCasa(datos, P, 3, 'III'),
    jupiter: cuerpo(P, 'Júpiter') ? {
      lon: P['Júpiter'].lon, signo: signoDe(P['Júpiter'].lon), casa: P['Júpiter'].casa,
      estado: estadoEsencial('Júpiter', P['Júpiter'].lon), retro: P['Júpiter'].retro,
      maleficos: maleficosTexto(d, 'Júpiter'),
      enIX: P['Júpiter'].casa === 9,
    } : null,
    luna: luna ? {
      lon: luna.lon, signo: signoDe(luna.lon), casa: luna.casa,
      estado: estadoEsencial('Luna', luna.lon),
      enIX: luna.casa === 9, enIII: luna.casa === 3,
    } : null,
  };
}

// ============================================================
//  GENERADORES DE FICHAS
// ============================================================
function htmlFicha(f, i, abierta) {
  return `
    <details class="ficha"${abierta ? ' open' : ''}>
      <summary><span class="ficha-titulo">${f.titulo}</span> <span class="ficha-dato">${f.dato}</span></summary>
      <div class="ficha-cuerpo">
        <div class="ficha-bloque"><h5>¿Qué accidente?</h5><p>${f.accidente}</p></div>
        <div class="ficha-bloque"><h5>¿Se dará?</h5><ul>${f.seDara.map((s) => `<li>${s}</li>`).join('')}</ul></div>
        <div class="ficha-bloque"><h5>Calidad y cantidad</h5><p>${f.calidad}</p></div>
        <div class="ficha-fuente">${f.fuente}</div>
      </div>
    </details>`;
}

// Ficha genérica de casa + regente (el asunto se describe con `enfasis` y naturaleza por tema)
function fichaCasaTema(ctx, c, enfasis, fuente, opts = {}) {
  const natura = opts.naturaleza || NATURALEZA;
  const seDara = [];
  if (c.planetas.length) {
    seDara.push(`En la ${c.nombreCasa} están ${c.planetas.map((p) => `${GLIFO[p.nombre] || ''} ${p.nombre}`).join(', ')}: ${c.planetas.map((p) => `${p.nombre}: ${natura[p.nombre] || 'obra según su especie'}`).join('; ')}.`);
  } else if (!opts.silencioVacia) {
    seDara.push(`La ${c.nombreCasa} está vacía: el asunto entra por su regente, no por ocupación.`);
  }
  if (c.regenteDato) {
    const r = c.regenteDato;
    const est = estadoEsencial(c.regente, r.lon);
    seDara.push(`El regente de la ${c.nombreCasa}, ${c.regente}, está en ${fmtLon(r.lon)} (casa ${r.casa}) y ${fraseEstado(est)}${r.retro ? ', retrógrado' : ''}.`);
    const mal = maleficosTexto(ctx.datos, r.nombre);
    if (mal) seDara.push(`El regente mismo recibe daño: ${mal}.`);
  } else if (!opts.silencioSinRegente) {
    seDara.push(`El regente de la ${c.nombreCasa}, ${c.regente}, no está entre los cuerpos calculados.`);
  }
  const elem = ELEMENTO[INDICE_SIGNO[c.cuspideSigno]];
  return {
    titulo: `${c.nombreCasa} + regente - ${enfasis}`,
    dato: `cúspide en ${c.cuspideSigno}${c.planetas.length ? ` · ocupada por ${c.planetas.map((p) => p.nombre).join(', ')}` : ''} · regente ${c.regente}`,
    accidente: enfasis,
    seDara,
    calidad: `El signo de la cúspide, ${c.cuspideSigno} (elemento ${elem}), matiza el asunto: ${opts.textoElemento ? opts.textoElemento[elem] : TEXTO_ELEMENTO_TEMA[elem]}.`,
    fuente,
  };
}

// Ficha genérica de planeta significador
function fichaPlanetaTema(ctx, nombre, enfasis, accidente, fuente, opts = {}) {
  const p = ctx.P[nombre];
  if (!p) return null;
  const est = estadoEsencial(nombre, p.lon);
  const seDara = [];
  if (opts.frasesEstado) {
    const frase = opts.frasesEstado[est.nombre];
    seDara.push(frase ? frase(p, est) : `${fraseEstado(est)}.`);
  } else {
    seDara.push(`${fraseEstado(est)}.`);
  }
  if (opts.frasesCasa && opts.frasesCasa[p.casa]) seDara.push(opts.frasesCasa[p.casa](p));
  const mal = maleficosTexto(ctx.datos, nombre);
  if (mal && !opts.sinMaleficos) seDara.push(`Recibe daño: ${mal}.`);
  if (p.retro) seDara.push('Retrógrado: su asunto se contiene, se repasa o se demora.');
  if (!seDara.length) seDara.push('Sin señales destacadas: obra según su casa y sus aspectos.');
  let calidad = opts.calidad ? opts.calidad(ctx, p, est) : '';
  if (!calidad) calidad = `El signo de ${nombre}, ${signoDe(p.lon)} (${ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]}), matiza el asunto: ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`;
  return {
    titulo: `${GLIFO[nombre] || ''} ${nombre} - ${enfasis}`,
    dato: `en ${signoDe(p.lon)} casa ${p.casa} · ${est.nombre}${p.retro ? ' R' : ''}`,
    accidente,
    seDara,
    calidad,
    fuente,
  };
}

// ---------- Fichas de Salud ----------
function fichaAscendente(ctx) {
  const a = ctx.asc;
  const elem = ELEMENTO[INDICE_SIGNO[a.signo]];
  const seDara = [];
  if (a.planetaEnAsc.length) {
    seDara.push(`Hay ${a.planetaEnAsc.map((p) => `${GLIFO[p.nombre] || ''} ${p.nombre}`).join(' y ')} en el Ascendente: su naturaleza tiñe directamente la constitución (${a.planetaEnAsc.map((p) => NATURALEZA_VI[p.nombre] || 'obra según su especie').join('; ')}).`);
  }
  if (a.regenteDato) {
    const r = a.regenteDato;
    const est = estadoEsencial(a.regente, r.lon);
    seDara.push(`El regente del Asc, ${a.regente}, está en ${fmtLon(r.lon)} (casa ${r.casa}) y ${fraseEstado(est)}${r.retro ? ', retrógrado: la vitalidad se contiene o tarda en manifestarse' : ''}.`);
  }
  if (a.maleficos) seDara.push(`Marca de fragilidad: ${a.maleficos}.`);
  if (!seDara.length) seDara.push('Sin maléficos sobre el Ascendente ni su regente: la constitución se recibe limpia; el estado del regente manda.');
  return {
    titulo: 'Ascendente - constitución y resistencia',
    dato: `en ${a.signo} ${gradoEnSigno(a.lon)}${a.regenteDato ? ` · regente ${a.regente}` : ''}`,
    accidente: 'La constitución del cuerpo, su forma y su resistencia. El Ascendente es el primer candidato a hyleg cuando los luminares no califican (Aben Ragel, Libro IV).',
    seDara,
    calidad: `El elemento del signo, ${elem}, define el temperamento: ${TEXTO_ELEMENTO[elem]}.`,
    fuente: 'Weiss, Tectónica cap. III · Aben Ragel, Libro IV (hyleg) · Morin, Libro XXI (regente).',
  };
}

function fichaSolSalud(ctx) {
  const s = ctx.sol;
  if (!s) return null;
  const seDara = [];
  if (s.estado.nombre === 'Domicilio' || s.estado.nombre === 'Exaltación') seDara.push(`${fraseEstado(s.estado)}: vitalidad robusta.`);
  else if (s.estado.nombre === 'Detrimento' || s.estado.nombre === 'Caída') seDara.push(`${fraseEstado(s.estado)}: la vitalidad se gasta pronto; defensas irregulares.`);
  if (s.maleficos) seDara.push(s.maleficos);
  if (!seDara.length) seDara.push('☉ peregrino y sin contacto con ♄/♂: la vitalidad depende de quien lo reciba (casa y dispositor).');
  let calidad = `El signo del ☉, ${s.signo} (${ELEMENTO[INDICE_SIGNO[s.signo]]}), orienta la dolencia que lo ataca.`;
  if (s.dispositor) {
    const d = s.dispositor;
    calidad += ` El dispositor del ☉, ${d.nombre}, está en ${fmtLon(d.lon)} (casa ${d.casa}) y ${fraseEstado(estadoEsencial(d.nombre, d.lon))}: por él pasa el origen del bien o del mal vital.`;
  }
  return {
    titulo: '☉ Sol - vitalidad y fuerza vital',
    dato: `en ${s.signo} casa ${s.casa} · ${s.estado.nombre}`,
    accidente: 'La fuerza vital, el corazón y la vida misma. Primer hyleg en nacimiento diurno (Aben Ragel, Libro IV).',
    seDara,
    calidad,
    fuente: 'Weiss, Tectónica cap. III · Aben Ragel, Libro IV · Morin, Libro XXI (dispositor).',
  };
}

function fichaLunaSalud(ctx) {
  const l = ctx.lun;
  if (!l) return null;
  const seDara = [];
  if (l.fase === 'Nueva' || l.fase === 'Llena') seDara.push(`En fase ${l.fase}: momento de máxima tensión corporal (☽ en conjunción u oposición al ☉).`);
  if (l.estado.nombre === 'Domicilio' || l.estado.nombre === 'Exaltación') seDara.push(`${fraseEstado(l.estado)}: buena recuperación y asimilación.`);
  else if (l.estado.nombre === 'Detrimento' || l.estado.nombre === 'Caída') seDara.push(`${fraseEstado(l.estado)}: la salud oscila con el ánimo y la digestión.`);
  if (l.maleficos) seDara.push(l.maleficos);
  if (!seDara.length) seDara.push('Sin contacto de la ☽ con ♄/♂: la enfermedad no encuentra puerta por la ☽; su signo y casa matizan.');
  const idx = INDICE_SIGNO[l.signo];
  return {
    titulo: '☽ Luna - salud general y cuerpo',
    dato: `en ${l.signo} casa ${l.casa} · fase ${l.fase}`,
    accidente: 'La salud general y cambiante del cuerpo. Aben Ragel: la ☽ significa el cuerpo (y el estómago, por la nutrición).',
    seDara,
    calidad: `El signo de la ☽, ${l.signo} (${ELEMENTO[idx]}), describe la dolencia: ${TEXTO_ELEMENTO[ELEMENTO[idx]]}. ${l.dispositor ? `Su dispositor, ${l.dispositor.nombre} en ${fmtLon(l.dispositor.lon)} (casa ${l.dispositor.casa}), ${fraseEstado(estadoEsencial(l.dispositor.nombre, l.dispositor.lon))}.` : ''}`,
    fuente: 'Aben Ragel, Libro I cap. IV (☽ = cuerpo) · Weiss, Tectónica cap. III · Morin, Libro XXI.',
  };
}

function fichaHyleg(ctx) {
  const h = ctx.hyleg;
  const seDara = [`Hyleg: ${h.nombre} (${h.razon}). ${fraseEstado(h.estado)}.`];
  if (h.maleficos) seDara.push(`El hyleg recibe daño de los maléficos (${h.maleficos}): los períodos críticos son reales.`);
  else seDara.push('El hyleg no recibe daño directo de ♄/♂: vida larga sin quiebras marcadas por los luminares.');
  if (h.divisores && h.divisores.anareta) {
    const dv = h.divisores;
    seDara.push(`Anareta: ${dv.anareta.planeta} (${dv.anareta.tipo}) — la conducción del hyleg a 1°/año lo alcanza a los ${dv.anios.toFixed(0)} años (promesa del alcocoden: ${h.anios || '—'}).`);
    const ult = dv.divisores.slice(-4);
    seDara.push(`Cronocratores finales (divisores de términos, Aben Ragel VI): ${ult.map((s) => `${s.planeta} (${s.desde.toFixed(0)}–${s.hasta.toFixed(0)} años)`).join(' · ')}.`);
  }
  let calidad;
  if (h.alcocoden) {
    calidad = `Alcocoden: ${h.alcocoden.nombre} con ${h.alcocoden.pts} puntos de dignidad sobre el grado del hyleg (domicilio 5, exaltación 4, término 3, triplicidad 2, faz 1 — Alquindi, vía Aben Ragel).`;
    if (h.termino) calidad += ` Términos egipcios (tabla de R. Gil): el hileg cae en el término de ${h.termino.planeta} (${h.termino.inicio}°–${h.termino.fin}° de ${h.termino.signo}), candidato a divisor en la conducción por grados.`;
    if (h.anios) calidad += ` Otorga ${h.anios} años máximos (tabla de años mayores); el anareta y los cronocratores acotan la promesa (véanse arriba).`;
  } else {
    calidad = 'Sin alcocoden claro entre los planetas presentes: la vida queda en manos del estado del hyleg y del atacir.';
  }
  return {
    titulo: '✶ Hyleg y Alcocoden - años de vida y períodos críticos',
    dato: `hyleg ${h.nombre}${h.alcocoden ? ` · alcocoden ${h.alcocoden.nombre} (${h.alcocoden.pts} pts)${h.anios ? ` · ${h.anios} años` : ''}` : ''}`,
    accidente: 'El dador de vida (hyleg) y el dador de años (alcocoden): cuánta vida hay y por qué manos pasa. Los períodos críticos se marcan cuando el atacir lleva el significador a los maléficos (Aben Ragel, Libro IV).',
    seDara,
    calidad,
    fuente: 'Aben Ragel, Libro IV (hileg, alcocoden, atacir) · Weiss, Tectónica cap. III.',
  };
}

function fichaParte(ctx) {
  const p = ctx.parte;
  if (!p) return {
    titulo: '☍ Parte de la enfermedad - las prisiones y las dolencias',
    dato: 'no disponible (requiere ♄ y la Parte de la Fortuna)',
    accidente: 'La parte de ♄: las prisiones, las cárceles y las dolencias (Aben Ragel, Libro I). Es el punto de la enfermedad en la carta.',
    seDara: ['Esta carta no expone la Parte de la Fortuna, así que la parte de la enfermedad no puede situarse.'],
    calidad: 'Fórmula (Aben Ragel): de día Asc + Fortuna - ♄; de noche Asc + ♄ - Fortuna.',
    fuente: 'Aben Ragel, Libro I cap. sobre las partes.',
  };
  const seDara = [`La parte cae en casa ${p.casa}: ${p.casa === 6 ? 'confirma la enfermedad del cuerpo' : p.casa === 12 ? 'enfermedad oculta o reclusión' : p.casa === 8 ? 'crisis y deterioro' : p.casa === 1 ? 'se padece en el cuerpo mismo' : 'señal débil: la dolencia no está focalizada'}.`];
  if (p.maleficos.length) seDara.push(`Aspectada por los maléficos (${p.maleficos.map((a) => `${NOMBRE_ASPECTO_ES[a.tipo]} de ${a.otro}`).join('; ')}): refuerza el mal.`);
  else seDara.push('Sin aspectos de ♄/♂ sobre la parte: señal de enfermedad atenuada.');
  let calidad = `Su regente, ${p.regente}${p.regenteDato ? `, está en ${fmtLon(p.regenteDato.lon)} (casa ${p.regenteDato.casa}) y ${fraseEstado(estadoEsencial(p.regente, p.regenteDato.lon))}` : ' no está entre los cuerpos calculados'}.`;
  calidad += ' Fórmula (Aben Ragel): de día Asc + Fortuna - ♄; de noche Asc + ♄ - Fortuna.';
  return {
    titulo: '☍ Parte de la enfermedad - las prisiones y las dolencias',
    dato: `en ${p.signo} casa ${p.casa} · regente ${p.regente}`,
    accidente: 'La parte de ♄: las prisiones, las cárceles y las dolencias (Aben Ragel, Libro I). Es el punto de la enfermedad en la carta.',
    seDara,
    calidad,
    fuente: 'Aben Ragel, Libro I (partes) y Libro IV · Morin, Libro XXI.',
  };
}

function fichaLunacion(ctx) {
  const l = ctx.lunacion;
  if (!l) return {
    titulo: '☽☉ Lunación pre-natal - la constitución del momento',
    dato: 'no disponible en este cálculo',
    accidente: 'La constitución del momento: la lunación (nueva o llena) anterior al nacimiento imprime el cuerpo. Morin (Libro 25) la usa como capa previa a toda la carta.',
    seDara: ['No se pudo localizar la lunación pre-natal (rango de búsqueda superado).'],
    calidad: 'Morin, Libro 25, Parte II cap. 14.',
    fuente: 'Morin, Libro 25 · Weiss, Síntesis (estado cósmico).',
  };
  const seDara = [`Lunación ${l.tipo === 'nueva' ? 'nueva' : 'llena'} en ${fmtLon(l.lon)}: cae en la casa natal ${l.casa}. ${l.casa === 6 ? 'Refuerza la zona de enfermedad del cuerpo' : l.casa === 12 ? 'Enfermedad oculta o larga gestación de un mal' : l.casa === 8 ? 'Marca un tránsito de crisis en los orígenes' : l.casa === 1 ? 'Marca el cuerpo de nacimiento' : 'Influye según su casa'}.`];
  if (l.maleficos.length) seDara.push(`Aspectada por los maléficos (${l.maleficos.map((a) => `${NOMBRE_ASPECTO_ES[a.tipo]} de ${a.otro}`).join('; ')}): predisposición gestacional o heredada.`);
  else seDara.push('Limpia de ♄/♂: sin carga previa sobre la constitución.');
  const idx = INDICE_SIGNO[l.signo];
  return {
    titulo: '☽☉ Lunación pre-natal - la constitución del momento',
    dato: `${l.tipo === 'nueva' ? 'nueva' : 'llena'} en ${fmtLon(l.lon)} · casa natal ${l.casa}`,
    accidente: 'La constitución del momento: la lunación (nueva o llena) anterior al nacimiento imprime el cuerpo. Morin (Libro 25) la usa como capa previa a toda la carta.',
    seDara,
    calidad: `El signo de la lunación, ${l.signo} (${ELEMENTO[idx]}), matiza: ${TEXTO_ELEMENTO[ELEMENTO[idx]]}.`,
    fuente: 'Morin, Libro 25, Parte II cap. 14 · Weiss, Síntesis cap. III (estado cósmico).',
  };
}

// ---------- Fichas de Riqueza ----------
function fichasRiqueza(ctx) {
  const f = [];
  f.push(fichaCasaTema(ctx, ctx.c2, 'la sustancia y el patrimonio', 'Morin, Libro XXI (la II: la sustancia) · Weiss, Elementos cap. IV · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  // Fortuna
  const fo = ctx.fortuna;
  if (fo) {
    const seDara = [`La Fortuna cae en ${fmtLon(fo.lon)} (casa ${fo.casa}). ${fo.casa === 2 ? 'En la II: el dinero se gana y se tiene con naturalidad' : fo.casa === 8 ? 'Los bienes llegan por herencia, alianza o recursos ajenos' : fo.casa === 10 ? 'La posición social trae sustento' : fo.casa === 11 ? 'El dinero llega por amigos, redes y proyectos compartidos' : fo.casa === 1 ? 'La propia persona es su capital' : 'Influye según su casa y su regente'}.`];
    if (fo.beneficos.length) seDara.push(`Aspectada por los benéficos (${fo.beneficos.map((a) => `${NOMBRE_ASPECTO_ES[a.tipo]} de ${a.otro}`).join('; ')}): el dinero se conserva y multiplica.`);
    if (fo.maleficos.length) seDara.push(`Aspectada por los maléficos (${fo.maleficos.map((a) => `${NOMBRE_ASPECTO_ES[a.tipo]} de ${a.otro}`).join('; ')}): pérdidas, deudas o gastos forzosos.`);
    let calidad = `Su regente, ${fo.regente}${fo.regenteDato ? `, está en ${fmtLon(fo.regenteDato.lon)} (casa ${fo.regenteDato.casa}) y ${fraseEstado(estadoEsencial(fo.regente, fo.regenteDato.lon))}` : ' no está entre los cuerpos calculados'}.`;
    calidad += ' Fórmula (Aben Ragel): de día Asc + ☽ - ☉; de noche Asc + ☉ - ☽.';
    f.push({
      titulo: '☀ Parte de la Fortuna - los bienes',
      dato: `en ${fo.signo} casa ${fo.casa} · regente ${fo.regente}`,
      accidente: 'La Parte de la Fortuna: la sustancia, los bienes y la prosperidad material. Su regente y sus aspectos deciden cómo entra y cómo sale el dinero.',
      seDara,
      calidad,
      fuente: 'Aben Ragel, Libro I (partes) · Morin, Libro XXI · Weiss, Elementos (puntos).',
    });
  } else {
    f.push({
      titulo: '☀ Parte de la Fortuna - los bienes',
      dato: 'no disponible en este cálculo',
      accidente: 'La Parte de la Fortuna: la sustancia, los bienes y la prosperidad material.',
      seDara: ['La librería no expuso la Fortuna en este cálculo.'],
      calidad: 'Fórmula (Aben Ragel): de día Asc + ☽ - ☉; de noche Asc + ☉ - ☽.',
      fuente: 'Aben Ragel, Libro I (partes) · Morin, Libro XXI.',
    });
  }
  f.push(fichaPlanetaTema(ctx, 'Júpiter', 'el benéfico mayor de la ganancia', 'Júpiter: expansión, ganancia, protección y buena fortuna. Su estado y su casa dicen por dónde crece el patrimonio.',
    'Morin, Libro XXI (benéficos) · Weiss, Elementos cap. IV.',
    {
      frasesEstado: {
        Domicilio: () => 'Júpiter en domicilio: la fortuna acompaña, la ganancia llega sin forzarla.',
        Exaltación: () => 'Júpiter exaltado: generosidad y ganancia por encima de lo esperado.',
        Detrimento: () => 'Júpiter en detrimento: el exceso o la confianza mal puesta cuestan dinero.',
        Caída: () => 'Júpiter en caída: las promesas de ganancia se desinflan.',
      },
      frasesCasa: {
        2: () => 'En la II: el crecimiento del patrimonio es su oficio natural.',
        8: () => 'En la VIII: ganancia por herencias, socios o recursos ajenos.',
        11: () => 'En la XI: los contactos y las asociaciones traen beneficio.',
        10: () => 'En la X: el prestigio y el cargo rinden económicamente.',
      },
    }));
  f.push(fichaCasaTema(ctx, ctx.c8, 'herencias y bienes ajenos', 'Morin, Libro XXI (la VIII: herencias) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  return f.filter(Boolean);
}

// ---------- Fichas de Matrimonio ----------
function fichasMatrimonio(ctx) {
  const f = [];
  f.push(fichaCasaTema(ctx, ctx.c7, 'las uniones y el cónyuge', 'Morin, Libro XXI (la VII: matrimonio) · Weiss, Elementos cap. IV.', { naturaleza: NATURALEZA }));
  if (ctx.venus) {
    f.push(fichaPlanetaTema(ctx, 'Venus', 'el amor y la unión', 'Venus: el deseo, el gusto y la alianza. Su estado dice cómo se ama y cómo se elige pareja.',
      'Morin, Libro XXI · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => 'Venus en domicilio: el amor se da con naturalidad y se recibe igual.',
          Exaltación: () => 'Venus exaltado: unión brillante, afecto idealizado.',
          Detrimento: () => 'Venus en detrimento: el gusto se tuerce, las elecciones afectivas fallan.',
          Caída: () => 'Venus en caída: el amor se busca donde no hay.',
        },
        frasesCasa: {
          7: () => 'En la VII: el matrimonio es un asunto central de la vida.',
          5: () => 'En la V: el amor nace del juego, el cortejo o los hijos.',
          12: () => 'En la XII: el amor en secreto, el sacrificio o la entrega oculta.',
        },
        calidad: (ctx2, p) => {
          let t = '';
          if (p.casa === 7) t += 'Venus en la casa VII refuerza la promesa de unión.';
          const mal = ctx2.venus.maleficos;
          if (mal) t += ` Daño recibido (${mal}): retraso, frialdad o conflicto en las uniones.`;
          return t || `Venus en ${signoDe(p.lon)} (${ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]}): ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`;
        },
      }));
  }
  if (ctx.luna) {
    f.push({
      titulo: '☽ Luna - el cónyuge (tradición)',
      dato: `en ${ctx.luna.signo} casa ${ctx.luna.casa} · ${ctx.luna.estado.nombre}`,
      accidente: 'La tradición reparte el significador del cónyuge por sexo: la ☽ en la carta del hombre, el ☉ en la de la mujer. Aquí se muestran ambos luminares; la app no pide el sexo.',
      seDara: [
        `La ☽ está en ${ctx.luna.signo} (casa ${ctx.luna.casa}) y ${fraseEstado(ctx.luna.estado)}${ctx.luna.enVII ? '. En la VII: el cónyuge entra en la vida de forma central' : ''}.`,
        ctx.luna.maleficos ? `Daño sobre la ☽ (${ctx.luna.maleficos}): el vínculo se prueba con demoras, distancias o pérdidas.` : 'Sin daño de ♄/♂ sobre la ☽: el vínculo no encuentra obstáculo por esta vía.',
      ],
      calidad: ctx.sol ? `El ☉ (significador del cónyuge en carta femenina) está en ${ctx.sol.signo} (casa ${ctx.sol.casa}) y ${fraseEstado(ctx.sol.estado)}.` : '',
      fuente: 'Ptolomeo, Tetrabiblos (significadores del matrimonio) · Morin, Libro XXI · Aben Ragel, Libro IV.',
    });
  }
  // Aspectos a la cúspide VII
  if (ctx.aspectoCuspideVII.length) {
    const seDara = ctx.aspectoCuspideVII.map((a) => {
      const es = NOMBRE_ASPECTO_ES[a.tipo];
      const bueno = ['Venus', 'Júpiter', 'Luna', 'Sol'].includes(a.otro) && (a.tipo === 'Trine' || a.tipo === 'Sextile' || a.tipo === 'Conjunction');
      return `${es} de ${a.otro} a la cúspide VII (orbe ${a.orb.toFixed(1)}°): ${bueno ? 'apoyo a las uniones' : a.otro === 'Saturno' ? 'el matrimonio se demora o pesa' : a.otro === 'Marte' ? 'conflicto o ruptura en las alianzas' : 'marca en las uniones'}.`;
    });
    f.push({
      titulo: '✳ Aspectos a la cúspide VII',
      dato: `${ctx.aspectoCuspideVII.length} contacto(s)`,
      accidente: 'Los contactos sobre la cúspide de la VII (el punto del matrimonio) tiñen todas las uniones, no solo la principal.',
      seDara,
      calidad: 'Un contacto benéfico (♀/♃/☽/☉ armónico) apoya; uno maléfico (♄/♂) demora o rompe.',
      fuente: 'Morin, Libro XXI (determinación local) · Weiss, Síntesis cap. III.',
    });
  }
  return f.filter(Boolean);
}

// ---------- Fichas de Profesión ----------
function fichasProfesion(ctx) {
  const f = [];
  f.push(fichaCasaTema(ctx, ctx.c10, 'la dignidad, el empleo y la reputación', 'Morin, Libro XXI (la X: dignidad y empleo) · Weiss, Elementos cap. IV · Aben Ragel, Libro IV.',
    { naturaleza: NATURALEZA, textoElemento: TEXTO_ELEMENTO_TEMA }));
  if (ctx.sol) {
    f.push(fichaPlanetaTema(ctx, 'Sol', 'los honores y la autoridad', 'El ☉: la dignidad, el reconocimiento y la autoridad pública. Su estado dice cuánto pesa el nativo en su oficio.',
      'Morin, Libro XXI (el ☉ y los honores) · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => 'El ☉ en domicilio: autoridad natural, el cargo le sienta.',
          Exaltación: () => 'El ☉ exaltado: honores por encima de lo esperado.',
          Detrimento: () => 'El ☉ en detrimento: la autoridad se discute o se ejerce mal.',
          Caída: () => 'El ☉ en caída: el reconocimiento cuesta más de lo que rinde.',
        },
        frasesCasa: {
          10: () => 'En la X: la carrera es el escenario central de la vida.',
          1: () => 'En la I: el nativo es su propio jefe; el cargo lo define.',
          6: () => 'En la VI: el trabajo de servicio, el empleo subordinado o la técnica.',
        },
        calidad: (ctx2, p) => `El signo del ☉, ${p.signo || signoDe(p.lon)}, y el MC en ${ctx2.mc.signo} describen el tipo de reconocimiento: el ☉ da la autoridad, el MC el escenario.`,
      }));
  }
  f.push(fichaCasaTema(ctx, ctx.c10, 'los ocupantes de la X - el tipo de trabajo', 'Morin, Libro XXI (los planetas en la X determinan el oficio) · Aben Ragel, Libro IV.',
    { naturaleza: NATURALEZA, silencioVacia: true, silencioSinRegente: true }));
  // ♄ y ♂ como determinadores del oficio
  const seDara = [];
  if (ctx.saturno) seDara.push(`♄ está en ${ctx.saturno.signo} (casa ${ctx.saturno.casa}) y ${fraseEstado(ctx.saturno.estado)}: oficios de estructura, tierra, tiempo, administración o herencia.`);
  if (ctx.marte) seDara.push(`♂ está en ${ctx.marte.signo} (casa ${ctx.marte.casa}) y ${fraseEstado(ctx.marte.estado)}: oficios de esfuerzo, fuego, hierro, cirugía, competencia.`);
  if (!seDara.length) seDara.push('♄ y ♂ presentes en la carta: sus casas matizan el oficio, pero la X y su regente mandan.');
  f.push({
    titulo: '♄ ♂ - los determinadores del oficio',
    dato: `♄ en ${ctx.saturno ? ctx.saturno.signo : '-'} · ♂ en ${ctx.marte ? ctx.marte.signo : '-'}`,
    accidente: 'La tradición usa ♄ y ♂ (según sect y estado) para concretar el tipo de trabajo: ♄ da el oficio que se construye despacio; ♂ el que se gana con esfuerzo.',
    seDara,
    calidad: 'El planeta más fuerte de los dos (mejor estado, más angular) determina el tono del oficio; el otro lo matiza.',
    fuente: 'Morin, Libro XXI · Aben Ragel, Libro IV · Weiss, Tectónica.',
  });
  return f.filter(Boolean);
}

// ---------- Fichas de Estudio ----------
function fichasEstudio(ctx) {
  const f = [];
  if (ctx.mercurio) {
    f.push(fichaPlanetaTema(ctx, 'Mercurio', 'el ingenio y el aprendizaje', '☿: el ingenio, la palabra y el estudio. Su estado dice cómo aprende el nativo.',
      'Morin, Libro XXI (☿ y el ingenio) · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => '☿ en domicilio: mente rápida, palabra fluida, aprendizaje natural.',
          Exaltación: () => '☿ exaltado: el ingenio se adelanta a los demás.',
          Detrimento: () => '☿ en detrimento: la mente se dispersa; el estudio exige método doble.',
          Caída: () => '☿ en caída: aprender cuesta; el ingenio trabaja a contracorriente.',
        },
        frasesCasa: {
          3: () => 'En la III: el estudio cercano y la escritura son su territorio.',
          9: () => 'En la IX: el saber superior, la filosofía o el derecho le son propios.',
          1: () => 'En la I: la inteligencia se muestra; el nativo aprende hablando.',
        },
        calidad: (ctx2, p) => {
          const partes = [];
          if (ctx2.mercurio.saturno.length) partes.push('♄ toca a ☿: método, rigor y lentitud - aprende profundo, no rápido.');
          if (ctx2.mercurio.jupiter.length) partes.push('♃ toca a ☿: comprensión amplia, el estudio rinde sabiduría.');
          if (ctx2.mercurio.luna.length) partes.push('☽ toca a ☿: memoria viva, aprende por hábito y repetición.');
          return partes.join(' ') || `☿ en ${signoDe(p.lon)} (${ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]}): ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`;
        },
      }));
  }
  f.push(fichaCasaTema(ctx, ctx.c3, 'el aprendizaje cercano', 'Morin, Libro XXI (la III: el estudio elemental) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  f.push(fichaCasaTema(ctx, ctx.c9, 'el saber superior', 'Morin, Libro XXI (la IX: la ciencia y la fe) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  // Regente del Asc y su contacto con ☿
  const seDara = [];
  if (ctx.regenteAscDato) {
    seDara.push(`El regente del Asc, ${ctx.regenteAsc}, está en ${fmtLon(ctx.regenteAscDato.lon)} (casa ${ctx.regenteAscDato.casa}) y ${fraseEstado(estadoEsencial(ctx.regenteAsc, ctx.regenteAscDato.lon))}: es quien estudia.`);
  } else {
    seDara.push(`El regente del Asc, ${ctx.regenteAsc}, no está entre los cuerpos calculados.`);
  }
  if (ctx.contacto.length) {
    seDara.push(`Contacto entre ${ctx.regenteAsc} y ☿ (${ctx.contacto.map((a) => `${NOMBRE_ASPECTO_ES[a.tipo]}`).join(', ')}): el estudio es asunto personal; el nativo se identifica con su formación.`);
  } else {
    seDara.push('Sin contacto directo entre el regente del Asc y ☿: el estudio es un medio, no una seña de identidad.');
  }
  f.push({
    titulo: `♄ regente del Asc - el que estudia`,
    dato: `${ctx.regenteAsc} ${ctx.regenteAscDato ? `en ${signoDe(ctx.regenteAscDato.lon)} casa ${ctx.regenteAscDato.casa}` : '-'}${ctx.contacto.length ? ' · toca a ☿' : ''}`,
    accidente: 'El regente del Ascendente es el propio nativo: su estado y su contacto con ☿ dicen cuánto le importa y le cuesta el estudio.',
    seDara,
    calidad: 'Regente del Asc fuerte y tocando a ☿: estudiar es parte de su carácter. Regente débil: el estudio depende de la ocasión, no del hábito.',
    fuente: 'Morin, Libro XXI (regente del Asc) · Weiss, Tectónica cap. II.',
  });
  return f.filter(Boolean);
}

// ---------- Fichas de Padres ----------
function fichasPadres(ctx) {
  const f = [];
  f.push(fichaCasaTema(ctx, ctx.c4, 'los padres y el origen', 'Morin, Libro XXI (la IV: los padres) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  if (ctx.sol) {
    f.push(fichaPlanetaTema(ctx, 'Sol', 'el padre', 'El ☉ es el significador del padre en la tradición (Ptolomeo). Su estado describe la figura paterna y su herencia.',
      'Ptolomeo, Tetrabiblos (☉ padre) · Morin, Libro XXI · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => 'El ☉ en domicilio: padre presente, autoridad sana, herencia clara.',
          Exaltación: () => 'El ☉ exaltado: padre admirado, figura brillante.',
          Detrimento: () => 'El ☉ en detrimento: padre ausente, autoridad discutida o figura débil.',
          Caída: () => 'El ☉ en caída: la figura paterna se vive como pérdida o carga.',
        },
        frasesCasa: {
          4: () => 'En la IV: el padre y el hogar se confunden; la raíz familiar pesa.',
          10: () => 'En la X: el padre es figura pública o autoridad visible.',
          12: () => 'En la XII: padre lejano, sacrificado u oculto.',
        },
        calidad: (ctx2, p) => ctx2.sol.enIV ? 'El ☉ en la IV refuerza la presencia del padre en el origen.' : `El ☉ en ${signoDe(p.lon)} matiza su figura: ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`,
      }));
  }
  if (ctx.luna) {
    f.push(fichaPlanetaTema(ctx, 'Luna', 'la madre', 'La ☽ es el significador de la madre en la tradición. Su estado describe la figura materna y la crianza.',
      'Ptolomeo, Tetrabiblos (☽ madre) · Morin, Libro XXI · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => 'La ☽ en domicilio: madre nutricia, vínculo de cuidado sólido.',
          Exaltación: () => 'La ☽ exaltada: madre protectora, el hogar se siente seguro.',
          Detrimento: () => 'La ☽ en detrimento: la figura materna se vive con ambivalencia.',
          Caída: () => 'La ☽ en caída: la madre como ausencia, peso o sacrificio.',
        },
        frasesCasa: {
          4: () => 'En la IV: la madre y la casa son una misma cosa.',
          10: () => 'En la X: madre visible, autoridad doméstica fuerte.',
          7: () => 'En la VII: la madre se refleja en las alianzas del nativo.',
        },
        calidad: (ctx2, p) => ctx2.luna.enIV ? 'La ☽ en la IV: la madre impregna el origen y la memoria familiar.' : `La ☽ en ${signoDe(p.lon)} matiza su figura: ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`,
      }));
  }
  // ♄ y ♀ como significadores secundarios
  const seDara = [];
  if (ctx.saturno) seDara.push(`♄ (significador secundario del padre) está en ${ctx.saturno.signo} (casa ${ctx.saturno.casa}) y ${fraseEstado(ctx.saturno.estado)}${ctx.saturno.enIV ? '; en la IV refuerza la raíz paterna' : ''}.`);
  if (ctx.venus) seDara.push(`♀ (significadora secundaria de la madre) está en ${ctx.venus.signo} (casa ${ctx.venus.casa}) y ${fraseEstado(ctx.venus.estado)}${ctx.venus.enIV ? '; en la IV refuerza la figura materna' : ''}.`);
  if (!seDara.length) seDara.push('♄ y ♀ presentes: se miran solo como refuerzo cuando están en la IV o aspectan a ☉/☽.');
  f.push({
    titulo: '♄ ♀ - significadores secundarios',
    dato: `♄ en ${ctx.saturno ? ctx.saturno.signo : '-'} · ♀ en ${ctx.venus ? ctx.venus.signo : '-'}`,
    accidente: 'La tradición tardía añade ♄ (padre) y ♀ (madre) como refuerzo. Solo pesan cuando tocan la IV o los luminares.',
    seDara,
    calidad: '☉ y ☽ mandan; ♄ y ♀ confirman o contradicen.',
    fuente: 'Ptolomeo · Morin, Libro XXI · Weiss, Elementos cap. IV.',
  });
  return f.filter(Boolean);
}

// ---------- Fichas de Viajes ----------
function fichasViajes(ctx) {
  const f = [];
  f.push(fichaCasaTema(ctx, ctx.c9, 'viajes largos, fe y saber', 'Morin, Libro XXI (la IX: viajes y fe) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  if (ctx.jupiter) {
    f.push(fichaPlanetaTema(ctx, 'Júpiter', 'la fe y la expansión', '♃: la fe, la peregrinación y el horizonte. Su estado dice cómo se vive lo que se cree y hasta dónde se viaja.',
      'Morin, Libro XXI (♃ y la IX) · Weiss, Elementos cap. IV.',
      {
        frasesEstado: {
          Domicilio: () => '♃ en domicilio: fe firme, horizonte amplio, los viajes traen ganancia.',
          Exaltación: () => '♃ exaltado: el viaje y la fe elevan la vida.',
          Detrimento: () => '♃ en detrimento: excesos de fe o de viaje; promesas que no se cumplen.',
          Caída: () => '♃ en caída: la confianza se pierde; el viaje decepciona.',
        },
        frasesCasa: {
          9: () => 'En la IX: la fe y el viaje largo son el eje de la vida.',
          12: () => 'En la XII: la fe se vive en silencio; viajes de retiro o servicio.',
        },
        calidad: (ctx2, p) => ctx2.jupiter.enIX ? '♃ en la IX: peregrino por vocación; el extranjero le es favorable.' : `♃ en ${signoDe(p.lon)} matiza: ${TEXTO_ELEMENTO_TEMA[ELEMENTO[INDICE_SIGNO[signoDe(p.lon)]]]}.`,
      }));
  }
  if (ctx.luna) {
    f.push(fichaPlanetaTema(ctx, 'Luna', 'el movimiento y los viajes', 'La ☽: el movimiento, el cambio de lugar y el trato con lo desconocido. Su casa dice cuánto viaja el nativo.',
      'Aben Ragel, Libro I (la ☽ y los caminos) · Morin, Libro XXI.',
      {
        frasesCasa: {
          9: () => 'En la IX: viajero de largo recorrido; se siente en casa lejos de casa.',
          3: () => 'En la III: muchos desplazamientos cortos, vida en movimiento.',
          12: () => 'En la XII: viajes de retiro, exilio voluntario o servicio.',
        },
        calidad: (ctx2, p) => {
          if (ctx2.luna.enIX) return 'La ☽ en la IX refuerza los viajes largos como necesidad del alma.';
          if (ctx2.luna.enIII) return 'La ☽ en la III: el nativo rara vez está quieto, pero viaja en círculo corto.';
          return `La ☽ en ${signoDe(p.lon)} (casa ${p.casa}): el movimiento según su casa - la III corto, la IX largo.`;
        },
      }));
  }
  f.push(fichaCasaTema(ctx, ctx.c3, 'los viajes cortos y el trato diario', 'Morin, Libro XXI (la III: viajes breves) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA }));
  return f.filter(Boolean);
}

// ============================================================
//  REGISTRO DE TEMAS
// ============================================================
const TEMAS = [
  {
    id: 'salud', glifo: '✚', nombre: 'Salud',
    resumen: 'constitución, enfermedad y períodos críticos',
    analizar: analizarSalud,
    fichas: (ctx) => [
      fichaAscendente(ctx),
      fichaSolSalud(ctx),
      fichaLunaSalud(ctx),
      fichaCasaTema(ctx, ctx.c6, 'enfermedad aguda y servidumbre del cuerpo', 'Weiss, Tectónica cap. III (casas VI/VIII/XII) · Morin, Libro XXI (regente de casa) · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA_VI }),
      fichaCasaTema(ctx, ctx.c12, 'enfermedad crónica y oculta', 'Weiss, Tectónica cap. III · Morin, Libro XXI · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA_VI }),
      fichaCasaTema(ctx, ctx.c8, 'crisis y deterioro', 'Weiss, Tectónica cap. III · Morin, Libro XXI · Aben Ragel, Libro IV.', { naturaleza: NATURALEZA_VI }),
      fichaHyleg(ctx),
      fichaParte(ctx),
      fichaLunacion(ctx),
    ].filter(Boolean),
    orden: [
      ['Constitución', 'Ascendente (signo, planeta en el Asc, regente), ☉ (vitalidad), ☽ (salud general). Se mira el signo, el estado y los aspectos de cada uno.'],
      ['Enfermedad', 'casa VI (aguda, la economía del organismo) y casa XII (crónica u oculta, el encierro). Planetas presentes y regentes.'],
      ['Desenlace', 'casa VIII (deterioro, crisis). Solo entra en juego cuando hay señales previas en VI o XII.'],
      ['Determinación local antes que analogía', 'un planeta solo significa enfermedad si está determinado hacia VI, XII u VIII (por posición, regencia o aspecto a sus cúspides).'],
      ['Años y períodos críticos', 'hyleg (dador de vida), alcocoden (dador de años) y atacir (conducción). Es cálculo: la app lo resuelve; el criterio interpreta.'],
      ['Capas de matiz', 'la parte de la enfermedad y la lunación pre-natal confirman o atenúan; el decanato (faz) matiza en último lugar - nunca es capa 1.'],
    ],
    limites: 'La astrología médica clásica es un <strong>aviso de períodos críticos</strong>, no un diagnóstico (Weiss desconfía del diagnóstico burdo por signos). Estas fichas señalan riesgo y naturaleza del riesgo; la medicina decide. Un juicio de salud serio exige que <strong>varios significadores concuerden</strong>: un solo indicio no es indicio.',
    fuentes: 'Morin de Villefranche, <em>Astrología Gallica</em> (Libro XXI: la triple pregunta y la determinación local; Libro 25: la lunación pre-natal) · A. Weiss, <em>Astrología Racional</em> (Tectónica cap. III: Asc/☉/☽, hyleg, reserva médica; casas VI/VIII/XII) · Aly Aben Ragel, <em>Libro conplido</em> (Libro I: naturalezas, términos, faces, parte de ♄; Libro IV: hileg, alcocoden, atacir).',
  },
  {
    id: 'riqueza', glifo: '♃', nombre: 'Riqueza y bienes',
    resumen: 'sustancia, ganancia y herencias',
    analizar: analizarRiqueza,
    fichas: fichasRiqueza,
    orden: [
      ['La sustancia', 'casa II y su regente: cómo se gana, se tiene y se gasta el dinero. Regente fuerte y bien aspectado: patrimonio que crece.'],
      ['La Fortuna', 'su casa, su regente y sus aspectos: por dónde entra el bienestar material. ♃/♀ armónicos multiplican; ♄/♂ lastran.'],
      ['La herencia', 'casa VIII y su regente: bienes ajenos, herencias y alianzas económicas. Solo pesa si apunta (ocupación, regencia o aspectos).'],
      ['Los benéficos', '♃ (ganancia por expansión) y ♀ (dinero por arte, trato o gusto) confirman o contradicen a la II.'],
      ['Concordancia', 'varias señales en la misma dirección (II fuerte + Fortuna apoyada + ♃ en buen estado) = riqueza estable; señales cruzadas = altibajos.'],
    ],
    limites: 'La riqueza no se juzga por una sola casa: <strong>la II, la Fortuna y sus regentes deben concordar</strong>. Estas fichas señalan la vía del dinero (trabajo, herencia, alianza, arte) y su estabilidad; un solo indicio no es indicio (Weiss).',
    fuentes: 'Morin, <em>Astrología Gallica</em> (Libro XXI: la II y la sustancia) · A. Weiss, <em>Astrología Racional</em> (Elementos cap. IV: casas y partes) · Aly Aben Ragel, <em>Libro conplido</em> (Libro I: partes; Libro IV: casas natales).',
  },
  {
    id: 'matrimonio', glifo: '♀', nombre: 'Matrimonio',
    resumen: 'uniones y cónyuge',
    analizar: analizarMatrimonio,
    fichas: fichasMatrimonio,
    orden: [
      ['La casa VII', 'su cúspide, ocupantes y regente: el matrimonio como institución. ♀/☽/☉ en la VII refuerzan; ♄/♂ dañan o demoran.'],
      ['El significador del cónyuge', '☽ en carta masculina, ☉ en femenina (la tradición); ♀ como naturaleza de la unión. Estado y casa del significador.'],
      ['El daño', '♄/♂ sobre la VII, su regente, ♀ o ☽: retraso, frialdad, conflicto o ruptura según el aspecto (□/☍ graves; △/⚹ atenuados).'],
      ['Los contactos a la cúspide', 'los aspectos sobre el punto mismo de la VII tiñen todas las uniones.'],
      ['Concordancia', 'la VII y el significador deben hablar igual: casa fuerte + significador sano = unión estable; señales cruzadas = matrimonio difícil de mantener.'],
    ],
    limites: 'La VII y sus significadores describen la <strong>tendencia y la calidad</strong> de las uniones, no una sentencia sobre una persona concreta: el libre albedrío y la elección pesan. Varios significadores concordantes = señal; uno solo = matiz (Weiss).',
    fuentes: 'Ptolomeo, <em>Tetrabiblos</em> (significadores del matrimonio) · Morin, <em>Astrología Gallica</em> (Libro XXI: la VII) · Aben Ragel, <em>Libro conplido</em> (Libro IV).',
  },
  {
    id: 'profesion', glifo: '☉', nombre: 'Profesión',
    resumen: 'empleo, honores y reputación',
    analizar: analizarProfesion,
    fichas: fichasProfesion,
    orden: [
      ['La casa X', 'cúspide, ocupantes y regente: la dignidad, el empleo y la reputación. El regente de la X en buen estado = carrera que rinde.'],
      ['El ☉', 'los honores y la autoridad pública. Su estado dice cuánto reconocimiento acompaña al oficio.'],
      ['Los ocupantes de la X', 'su naturaleza concreta el tipo de trabajo (♄: estructura; ♂: esfuerzo y fuego; ☿: comercio y palabra; ♀: arte y trato).'],
      ['♄ y ♂', 'los determinadores del oficio según sect y estado: el que esté más fuerte matiza el tono de la carrera.'],
      ['Concordancia', 'X + regente + ☉ deben apuntar igual: si el regente de la X está dañado pero ☉ está fuerte, el reconocimiento llega sin empleo estable (o al revés).'],
    ],
    limites: 'La X describe la <strong>carrera y la reputación</strong>, no un puesto concreto: el mismo cielo admite muchos oficios según formación y circunstancias. Concordancia de varios significadores = señal firme; uno solo = matiz (Weiss).',
    fuentes: 'Morin, <em>Astrología Gallica</em> (Libro XXI: la X, el ☉ y los honores) · A. Weiss, <em>Astrología Racional</em> (Elementos cap. IV) · Aben Ragel, <em>Libro conplido</em> (Libro IV: casas natales).',
  },
  {
    id: 'estudio', glifo: '☿', nombre: 'Estudio',
    resumen: 'ingenio y saber',
    analizar: analizarEstudio,
    fichas: fichasEstudio,
    orden: [
      ['☿', 'el ingenio: su estado (domicilio/exaltación = mente rápida; detrimento/caída = estudio trabajoso) y su casa.'],
      ['La III', 'el aprendizaje cercano: la escuela, la escritura, el método. Su regente y ocupantes.'],
      ['La IX', 'el saber superior: filosofía, derecho, ciencia, fe. Su regente y ocupantes.'],
      ['El regente del Asc', 'el propio nativo: su estado y su contacto con ☿ dicen si el estudio es vocación o trámite.'],
      ['Matices', '♄ sobre ☿ = método y lentitud (aprende profundo); ♃ = comprensión amplia; ☽ = memoria por hábito.'],
    ],
    limites: 'Estas fichas describen la <strong>capacidad y la vía</strong> del estudio, no el éxito académico: la constancia y la oportunidad deciden. Concordancia de ☿, la III y la IX = señal; una sola = matiz (Weiss).',
    fuentes: 'Morin, <em>Astrología Gallica</em> (Libro XXI: ☿ y el ingenio; la III y la IX) · A. Weiss, <em>Astrología Racional</em> (Elementos cap. IV) · Aben Ragel, <em>Libro conplido</em> (Libro IV).',
  },
  {
    id: 'padres', glifo: '♄', nombre: 'Padres',
    resumen: 'origen y herencia familiar',
    analizar: analizarPadres,
    fichas: fichasPadres,
    orden: [
      ['La casa IV', 'cúspide, ocupantes y regente: el origen, el hogar y la raíz familiar.'],
      ['El ☉', 'el padre: estado, casa y aspectos. ☉ en buen estado = padre presente y sano; dañado = ausencia, conflicto o carga.'],
      ['La ☽', 'la madre: estado, casa y aspectos. ☽ en buen estado = vínculo nutrido; dañada = pérdida o ambivalencia.'],
      ['Refuerzos', '♄ (padre) y ♀ (madre) como significadores secundarios: pesan cuando están en la IV o tocan a los luminares.'],
      ['Concordancia', 'la IV, ☉ y ☽ deben hablar igual; si discrepan, la lectura se matiza (p. ej. IV dañada pero ☉ sano: origen difícil, padre aceptable).'],
    ],
    limites: '☉ y ☽ describen la <strong>figura</strong> y la herencia, no la biografía: la relación real se construye con el tiempo. Señales concordantes = lectura firme; una sola = matiz (Weiss).',
    fuentes: 'Ptolomeo, <em>Tetrabiblos</em> (☉ padre, ☽ madre) · Morin, <em>Astrología Gallica</em> (Libro XXI: la IV) · A. Weiss, <em>Astrología Racional</em> (Elementos cap. IV).',
  },
  {
    id: 'viajes', glifo: '♃', nombre: 'Viajes y fe',
    resumen: 'horizonte y creencias',
    analizar: analizarViajes,
    fichas: fichasViajes,
    orden: [
      ['La casa IX', 'cúspide, ocupantes y regente: los viajes largos, la fe y el saber superior. Regente fuerte = horizonte abierto.'],
      ['♃', 'la fe y la expansión: su estado y su casa. ♃ en la IX = peregrino por vocación; ♃ dañado = excesos o promesas vacías.'],
      ['La ☽', 'el movimiento: ☽ en la III = muchos viajes cortos; ☽ en la IX = viajes largos y necesidad de horizonte.'],
      ['La III', 'los viajes cortos y el trato diario: complementa a la IX (corto vs. largo).'],
      ['Concordancia', 'la IX, ♃ y la ☽ deben apuntar igual: dos señales = viajero; una sola = ocasiones de viaje, no vocación.'],
    ],
    limites: 'La IX y sus significadores describen la <strong>afición y la vía</strong> (viaje, fe, estudio), no una lista de destinos. Concordancia de varios = señal; uno solo = matiz (Weiss).',
    fuentes: 'Morin, <em>Astrología Gallica</em> (Libro XXI: la IX) · Aben Ragel, <em>Libro conplido</em> (Libro I: la ☽ y los caminos) · A. Weiss, <em>Astrología Racional</em> (Elementos cap. IV).',
  },
];

// ============================================================
//  RENDER
// ============================================================
let temaActivoId = 'salud';
let ultimoRender = null;

// Tema inicial desde la URL (?tema=riqueza), como ?orientacion=casas en la app
(() => {
  try {
    const t = new URLSearchParams(location.search).get('tema');
    if (t && TEMAS.some((x) => x.id === t)) temaActivoId = t;
  } catch { /* sin location (Node/test) */ }
})();

export function renderFichasTema(contenedor, datos, swe) {
  if (!datos || !datos.planetas || !datos.cusps) return;
  ultimoRender = { contenedor, datos, swe };
  const tema = TEMAS.find((t) => t.id === temaActivoId) || TEMAS[0];
  let ctx;
  try { ctx = tema.analizar(datos, swe); } catch (e) { console.error('Fichas por tema:', e); return; }

  const fichas = tema.fichas(ctx).filter(Boolean);
  const htmlFichas = fichas.map((f, i) => htmlFicha(f, i, i === 0)).join('');
  const chips = TEMAS.map((t) =>
    `<button type="button" class="chip${t.id === tema.id ? ' activo' : ''}" data-tema="${t.id}" title="${t.resumen}">${t.glifo} ${t.nombre}</button>`
  ).join('');
  const orden = tema.orden.map(([k, v], i) => `<li><strong>${k}:</strong> ${v}</li>`).join('');

  contenedor.hidden = false;
  contenedor.innerHTML = `
    <div class="fichas-tema">
      <div class="fichas-cabecera">
        <h2>Fichas por tema</h2>
        <p class="fichas-principio">Un tema se juzga por sus <strong>significadores</strong>, no por todos los factores de la carta. Para cada uno se aplica la triple pregunta de Morin: <em>¿qué accidente?</em> → <em>¿se dará?</em> → <em>¿con qué calidad y cantidad?</em>.</p>
        <div class="chips">${chips}</div>
      </div>

      <div class="fichas-grid">${htmlFichas}</div>

      <div class="fichas-bloque-extra">
        <h3>Orden de juicio · ${tema.glifo} ${tema.nombre}</h3>
        <ol class="orden-juicio">${orden}</ol>
      </div>

      <div class="fichas-bloque-extra">
        <h3>Límites (parte del criterio)</h3>
        <p>${tema.limites}</p>
      </div>

      <div class="fichas-bloque-extra fichas-fuentes">
        <h3>Fuentes de criterio</h3>
        <p>${tema.fuentes}</p>
      </div>
    </div>`;

  // Selector de temas (delegación: el contenedor persiste entre renders)
  if (!contenedor._fichasListener) {
    contenedor.addEventListener('click', (ev) => {
      const chip = ev.target.closest('.chip[data-tema]');
      if (!chip || chip.classList.contains('activo')) return;
      temaActivoId = chip.dataset.tema;
      if (ultimoRender) renderFichasTema(ultimoRender.contenedor, ultimoRender.datos, ultimoRender.swe);
    });
    contenedor._fichasListener = true;
  }
}
