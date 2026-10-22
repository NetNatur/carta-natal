// ============================================================
//  Divisores de términos y anareta — Aben Ragel, Libro VI, cap. 2
//  («de la división y el divisor y el que participa con ellos por
//  cuerpo o por rayos», vía Al-Biruni y el estudio de R. Gil).
//  La vida se sitúa entre el lugar radical del hileg y el punto
//  anarético; el intervalo se divide por los términos de los signos
//  y el regente de cada término es su cronocrator (divisor). El
//  planeta natal que se halla en el término o le envía rayos es el
//  participante. La conducción avanza a 1° por año.
// ============================================================

const norm = (d) => ((d % 360) + 360) % 360;

const REGENTES = {
  Aries: 'Marte', Tauro: 'Venus', Géminis: 'Mercurio', Cáncer: 'Luna',
  Leo: 'Sol', Virgo: 'Mercurio', Libra: 'Venus', Escorpio: 'Marte',
  Sagitario: 'Júpiter', Capricornio: 'Saturno', Acuario: 'Saturno', Piscis: 'Júpiter',
};
const NOMBRES_SIGNOS_LOCAL = ['Aries', 'Tauro', 'G\u00e9minis', 'C\u00e1ncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];
const MALEFICOS = ['Marte', 'Saturno'];
const ASPECTOS_DESTRUCTIVOS = [0, 90, 180]; // conjunción, cuadratura, oposición
const NOMBRES_ASPECTO = { 0: 'conjunción', 60: 'sextil', 90: 'cuadratura', 120: 'trígono', 180: 'oposición' };
const TABLA_ASPECTOS = [0, 60, 90, 120, 180];

function signoIdx(lon) { return Math.floor(norm(lon) / 30); }

function casaDe(lon, cusps) {
  lon = norm(lon);
  for (let i = 0; i < 12; i++) {
    const span = norm(cusps[(i + 1) % 12] - cusps[i]) || 360;
    if (norm(lon - cusps[i]) < span) return i + 1;
  }
  return 12;
}

// Menor arco positivo (grados; 1° = 1 año) desde el hyleg hasta que la
// conducción forma uno de los aspectos indicados con la longitud dada.
export function arcoAAspecto(hylegLon, planetaLon, aspectos = [0, 90, 180]) {
  let mejor = Infinity;
  for (const A of aspectos) {
    for (const s of [1, -1]) {
      let t = norm(planetaLon + s * A - hylegLon);
      if (t <= 0.001) t = 360; // ya en aspecto exacto: la destrucción llega al cerrar la vuelta
      if (t < mejor) mejor = t;
    }
  }
  return mejor;
}

// Candidatos anareta según la doctrina clásica, ordenados por arco:
// el primero que alcanza la conducción del hileg destruye.
export function candidatosAnareta(datos, hylegLon) {
  const res = [];
  const reg8 = REGENTES[NOMBRES_SIGNOS_LOCAL[signoIdx(datos.cusps[7])]];
  const porNombre = (n) => datos.planetas.find((p) => p.nombre === n);

  for (const nombre of MALEFICOS) {
    const p = porNombre(nombre);
    if (!p) continue;
    const arco = arcoAAspecto(hylegLon, p.lon, ASPECTOS_DESTRUCTIVOS);
    if (arco < Infinity) res.push({ tipo: 'maléfico aspectando al hileg', planeta: nombre, arco });
    if (casaDe(p.lon, datos.cusps) === 8) {
      const arcoVIII = arcoAAspecto(hylegLon, p.lon, ASPECTOS_DESTRUCTIVOS);
      if (arcoVIII < Infinity) res.push({ tipo: 'maléfico en la casa VIII', planeta: nombre, arco: arcoVIII });
    }
  }
  const reg8p = porNombre(reg8);
  if (reg8p) {
    const arco = arcoAAspecto(hylegLon, reg8p.lon, ASPECTOS_DESTRUCTIVOS);
    if (arco < Infinity) res.push({ tipo: 'regente de la casa VIII', planeta: reg8, arco });
  }
  const nn = porNombre('Nodo Norte');
  if (nn) {
    const cola = norm(nn.lon + 180);
    const arco = arcoAAspecto(hylegLon, cola, ASPECTOS_DESTRUCTIVOS);
    if (arco < Infinity) res.push({ tipo: 'cola del dragón (nodo sur)', planeta: 'Nodo Sur', arco });
  }
  return res.sort((a, b) => a.arco - b.arco);
}

// Distancia de una longitud a un rango zodiacal [a, b] (sentido directo).
// 0 = dentro (cuerpo); ≤ 3° de un extremo por aspecto mayor = rayos.
const distARango = (pLon, a, b) => {
  const span = norm(b - a) || 360;
  if (norm(pLon - a) < span) return { d: 0, modo: 'cuerpo' };
  let mejorD = Infinity;
  for (const extremo of [a, b]) {
    for (const A of TABLA_ASPECTOS) {
      const d = Math.abs(norm(pLon - extremo) - A);
      if (d < mejorD) mejorD = d;
    }
  }
  return mejorD <= 3 ? { d: +mejorD.toFixed(2), modo: 'rayos' } : null;
};

// División del arco hileg→anareta por secciones de términos.
export function divisoresDeArco(hylegLon, arcoAnios, planetas) {
  const secciones = [];
  let arcoDesde = 0;
  let guard = 0;
  while (arcoDesde < arcoAnios - 1e-9 && guard++ < 240) {
    const lonActual = norm(hylegLon + arcoDesde);
    const idx = signoIdx(lonActual);
    const grado = lonActual - idx * 30;
    const signo = SIGNOS_LOCAL[idx];
    // término actual
    let t = null;
    let ini = 0;
    for (const [planeta, tam] of TERM_LOCAL[signo]) {
      if (grado < ini + tam) { t = { planeta, inicio: ini, fin: ini + tam }; break; }
      ini += tam;
    }
    if (!t) t = { planeta: TERM_LOCAL[signo][4][0], inicio: 30 - TERM_LOCAL[signo][4][1], fin: 30 };
    const arcoHastaTerm = t.fin - grado;
    const arcoHasta = Math.min(arcoDesde + arcoHastaTerm, arcoAnios);
    const rangoB = norm(lonActual + (arcoHasta - arcoDesde));
    const participantes = [];
    for (const p of planetas) {
      if (p.nombre === t.planeta) continue;
      const r = distARango(p.lon, lonActual, rangoB);
      if (r) participantes.push(`${p.nombre} (${r.modo})`);
    }
    secciones.push({
      planeta: t.planeta, signo,
      desde: +arcoDesde.toFixed(2), hasta: +arcoHasta.toFixed(2),
      participantes: participantes.length ? participantes : null,
    });
    arcoDesde = arcoHasta;
  }
  return secciones;
}

// Tabla egipcia local (idéntica a js/terminos.js; consistencia cruzada en test-divisores.mjs)
const TERM_LOCAL = {
  Aries: [['Júpiter', 6], ['Venus', 6], ['Mercurio', 8], ['Marte', 5], ['Saturno', 5]],
  Tauro: [['Venus', 8], ['Mercurio', 6], ['Júpiter', 8], ['Saturno', 5], ['Marte', 3]],
  Géminis: [['Mercurio', 6], ['Júpiter', 6], ['Venus', 5], ['Saturno', 7], ['Marte', 6]],
  Cáncer: [['Marte', 7], ['Venus', 6], ['Mercurio', 6], ['Júpiter', 7], ['Saturno', 4]],
  Leo: [['Júpiter', 6], ['Venus', 5], ['Saturno', 7], ['Mercurio', 6], ['Marte', 6]],
  Virgo: [['Mercurio', 7], ['Venus', 10], ['Júpiter', 4], ['Marte', 7], ['Saturno', 2]],
  Libra: [['Saturno', 6], ['Mercurio', 8], ['Júpiter', 7], ['Venus', 7], ['Marte', 2]],
  Escorpio: [['Marte', 7], ['Venus', 4], ['Mercurio', 8], ['Júpiter', 5], ['Saturno', 6]],
  Sagitario: [['Júpiter', 12], ['Venus', 5], ['Mercurio', 4], ['Saturno', 5], ['Marte', 4]],
  Capricornio: [['Mercurio', 7], ['Júpiter', 7], ['Venus', 8], ['Saturno', 4], ['Marte', 4]],
  Acuario: [['Venus', 6], ['Mercurio', 7], ['Júpiter', 7], ['Marte', 6], ['Saturno', 4]],
  Piscis: [['Venus', 12], ['Júpiter', 4], ['Mercurio', 3], ['Marte', 9], ['Saturno', 2]],
};
const SIGNOS_LOCAL = Object.keys(TERM_LOCAL);

// Cálculo completo: candidatos, anareta elegido y divisores del arco.
export function duracionVida(datos, hylegLon) {
  const candidatos = candidatosAnareta(datos, hylegLon);
  const anareta = candidatos.length ? candidatos[0] : null;
  const divisores = anareta ? divisoresDeArco(hylegLon, anareta.arco, datos.planetas) : [];
  return { candidatos, anareta, anios: anareta ? anareta.arco : null, divisores };
}