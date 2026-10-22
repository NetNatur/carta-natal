// ============================================================
//  Firdaria (fardarat) — períodos planetarios persas/árabes
//  Cronología tradicional: la vida se reparte en períodos
//  regidos por los planetas clásicos (y los nodos), según la
//  secta del nacimiento. Cada período mayor se divide en
//  subperíodos proporcionales.
//
//  Estructura del ciclo (Abu Ma'shar; Aben Ragel L.IV):
//    Sol 10 · Venus 8 · Mercurio 13 · Luna 9 · Saturno 11 ·
//    Júpiter 12 · Marte 7 · Nodo Norte 3 · Nodo Sur 2  = 75
//  Diurna:   Sol→Venus→Mercurio→Luna→Saturno→Júpiter→Marte→NN→SN
//  Nocturna: Luna→Saturno→Júpiter→Marte→Sol→Venus→Mercurio→NN→SN
//  Los nodos alternan su orden en cada ciclo.
//  Subperíodo (X en Y) = añosX × añosY / 75, desde el anfitrión.
// ============================================================
import { NOMBRES_SIGNOS } from './carta.js';

// Solo se usan los signos para la nota de la secta; la lógica no los necesita.

const FIRDARIA = [
  { planeta: 'Sol', anos: 10 },
  { planeta: 'Venus', anos: 8 },
  { planeta: 'Mercurio', anos: 13 },
  { planeta: 'Luna', anos: 9 },
  { planeta: 'Saturno', anos: 11 },
  { planeta: 'Júpiter', anos: 12 },
  { planeta: 'Marte', anos: 7 },
  { planeta: 'Nodo Norte', anos: 3 },
  { planeta: 'Nodo Sur', anos: 2 },
];
export const TOTAL_FIRDARIA = FIRDARIA.reduce((s, p) => s + p.anos, 0); // 75
const ANIO_DIAS = 365.2425;
const SEC_DIURNA = ['Sol', 'Venus', 'Mercurio', 'Luna', 'Saturno', 'Júpiter', 'Marte', 'Nodo Norte', 'Nodo Sur'];
const SEC_NOCTURNA = ['Luna', 'Saturno', 'Júpiter', 'Marte', 'Sol', 'Venus', 'Mercurio', 'Nodo Norte', 'Nodo Sur'];
const GLIFOS = {
  Sol: '☉', Luna: '☽', Mercurio: '☿', Venus: '♀', Marte: '♂',
  Júpiter: '♃', Saturno: '♄', 'Nodo Norte': '☊', 'Nodo Sur': '☋',
};

const norm = (lon) => (((lon % 360) + 360) % 360);

// JD gregoriano (Meeus) — solo para la fecha de hoy en el render
export function jdDeFecha(anio, mes, dia) {
  const a = Math.floor((14 - mes) / 12);
  const y = anio + 4800 - a;
  const m = mes + 12 * a - 3;
  return dia + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

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

function casaDe(lon, cusps) {
  for (let i = 0; i < 12; i++) {
    const a = cusps[i], b = cusps[(i + 1) % 12];
    if (norm(lon - a) < norm(b - a)) return i + 1;
  }
  return 1;
}

// ---------- Núcleo puro (testable) ----------

// Secuencia de un ciclo según la secta; en ciclos impares los nodos intercambian su orden.
export function secuenciaFirdaria(secta, ciclo = 0) {
  const base = secta === 'nocturna' ? [...SEC_NOCTURNA] : [...SEC_DIURNA];
  if (ciclo % 2 === 1) {
    const iN = base.indexOf('Nodo Norte');
    const iS = base.indexOf('Nodo Sur');
    [base[iN], base[iS]] = [base[iS], base[iN]];
  }
  return base;
}

// Períodos mayores y subperíodos desde el nacimiento.
// numCiclos: cuántos ciclos de 75 años generar (por defecto 2 → 150 años).
export function calcularFirdaria(jdNatal, secta, numCiclos = 2) {
  const periodos = [];
  let jd = jdNatal;
  let edad = 0;
  for (let c = 0; c < numCiclos; c++) {
    const seq = secuenciaFirdaria(secta, c);
    for (const nombre of seq) {
      const p = FIRDARIA.find((x) => x.planeta === nombre);
      const inicio = jd;
      const fin = jd + p.anos * ANIO_DIAS;
      // Subperíodos: orden cíclico de los 7 planetas desde el anfitrión,
      // con los nodos siempre al final (en el orden del ciclo). Si el
      // anfitrión es un nodo, abre su propio subperíodo y sigue la
      // secuencia de los 7 planetas desde el principio.
      const seq7 = seq.slice(0, 7);
      const nodos = seq.slice(7);
      let seqSub;
      if (seq7.includes(nombre)) {
        const idx = seq7.indexOf(nombre);
        seqSub = [...seq7.slice(idx), ...seq7.slice(0, idx), ...nodos];
      } else {
        const otroNodo = nodos.find((n) => n !== nombre);
        seqSub = [nombre, ...seq7, ...(otroNodo ? [otroNodo] : [])];
      }
      const subperiodos = [];
      let sjd = inicio;
      for (const snombre of seqSub) {
        const sp = FIRDARIA.find((x) => x.planeta === snombre);
        const durDias = (sp.anos * p.anos / TOTAL_FIRDARIA) * ANIO_DIAS;
        subperiodos.push({ planeta: snombre, inicio: sjd, fin: sjd + durDias, anos: durDias / ANIO_DIAS });
        sjd += durDias;
      }
      periodos.push({
        planeta: nombre, anos: p.anos, inicio, fin,
        edadInicio: edad, edadFin: edad + p.anos,
        subperiodos,
      });
      jd = fin;
      edad += p.anos;
    }
  }
  return periodos;
}

// Período y subperíodo que contienen el instante jd.
export function periodoActivo(jd, periodos) {
  for (const p of periodos) {
    if (jd >= p.inicio && jd < p.fin) {
      const sub = p.subperiodos.find((s) => jd >= s.inicio && jd < s.fin) || p.subperiodos[0];
      return { periodo: p, subperiodo: sub };
    }
  }
  const ultimo = periodos[periodos.length - 1];
  return { periodo: ultimo, subperiodo: ultimo.subperiodos[ultimo.subperiodos.length - 1] };
}

// Secta del nacimiento: diurna si el Sol está sobre el horizonte (casas 7-12).
export function determinarSecta(datos) {
  const sol = (datos.planetas || []).find((p) => p.nombre === 'Sol');
  if (!sol || !datos.cusps) return 'diurna';
  return casaDe(sol.lon, datos.cusps) >= 7 ? 'diurna' : 'nocturna';
}

// ---------- Carga del corpus ----------
let corpusPromise = null;
export function cargarCorpus() {
  if (!corpusPromise) {
    corpusPromise = fetch('datos/firdaria.json').then((r) => r.json());
  }
  return corpusPromise;
}

// ---------- Render ----------
const pad2 = (n) => String(n).padStart(2, '0');
const fechaTxt = (jd) => {
  const f = jdAFecha(jd);
  return `${pad2(f.dia)}/${pad2(f.mes)}/${f.anio}`;
};

export function renderFirdaria(contenedor, datos) {
  if (!datos || !datos.planetas || datos.planetas.length === 0) {
    contenedor.hidden = true;
    return;
  }
  contenedor.hidden = false;
  if (contenedor.dataset.init) { pintar(); return; }
  contenedor.dataset.init = '1';
  contenedor.innerHTML = `
    <h2>Firdaria</h2>
    <p class="nota-prospectiva">Cronología clásica de períodos planetarios (fardarat): el tiempo de la vida se reparte entre los planetas según la secta del nacimiento. Estructura de la tradición (Abu Ma'shar; Aben Ragel, <em>Libro conplido</em> IV): ciclo de <strong>75 años</strong> — Sol 10, Venus 8, Mercurio 13, Luna 9, Saturno 11, Júpiter 12, Marte 7, Nodo Norte 3, Nodo Sur 2.</p>
    <div id="firdaria-resultado" class="prosp-resultado"></div>
  `;

  function pintar() {
    const out = contenedor.querySelector('#firdaria-resultado');
    out.innerHTML = '<p class="nota">Calculando períodos…</p>';
    cargarCorpus().then((corpus) => {
      const secta = determinarSecta(datos);
      const periodos = calcularFirdaria(datos.jd, secta);
      const ahora = new Date();
      const jdHoy = jdDeFecha(ahora.getFullYear(), ahora.getMonth() + 1, ahora.getDate());
      pintarResultado(out, corpus, secta, periodos, jdHoy);
    }).catch((e) => {
      out.innerHTML = `<p class="nota">Error: ${e.message}</p>`;
      console.error(e);
    });
  }

  function pintarResultado(out, corpus, secta, periodos, jdHoy) {
    const porPlaneta = {};
    for (const p of corpus.periodos || []) porPlaneta[p.planeta] = p;
    const parrafos = (txt) => (txt || []).map((t) => `<p>${t}</p>`).join('');
    const activo = periodoActivo(jdHoy, periodos);
    const pAct = activo.periodo;
    const sAct = activo.subperiodo;

    // Línea de tiempo de períodos mayores (hasta 2 ciclos / ~150 años)
    const filas = periodos.map((p) => {
      const activa = p === pAct;
      return `<tr class="${activa ? 'fila-activa' : ''}">
        <td class="glifo">${GLIFOS[p.planeta] || ''}</td>
        <td><strong>${p.planeta}</strong></td>
        <td>${p.edadInicio.toFixed(1)}–${p.edadFin.toFixed(1)} años</td>
        <td>${fechaTxt(p.inicio)}</td>
        <td>${fechaTxt(p.fin)}</td>
      </tr>`;
    }).join('');

    // Subperíodos del período actual
    const subFilas = pAct.subperiodos.map((s) => {
      const activoSub = s === sAct;
      return `<tr class="${activoSub ? 'fila-activa' : ''}">
        <td class="glifo">${GLIFOS[s.planeta] || ''}</td>
        <td>${s.planeta}</td>
        <td>${s.anos.toFixed(2)} años</td>
        <td>${fechaTxt(s.inicio)}</td>
        <td>${fechaTxt(s.fin)}</td>
      </tr>`;
    }).join('');

    const edadHoy = (jdHoy - datos.jd) / ANIO_DIAS;

    out.innerHTML = `
      <h3>Período actual</h3>
      <div class="grupo-interp">
        <div class="receta-tarjeta">
          <h4>${GLIFOS[pAct.planeta]} ${pAct.planeta} · período mayor (${pAct.anos} años)</h4>
          <p class="nota">Nacimiento en secta <strong>${secta === 'diurna' ? 'diurna' : 'nocturna'}</strong> (el Sol ${secta === 'diurna' ? 'sobre' : 'bajo'} el horizonte). Edad actual: ${edadHoy.toFixed(1)} años — ${fechaTxt(pAct.inicio)} a ${fechaTxt(pAct.fin)}.</p>
          ${parrafos(porPlaneta[pAct.planeta]?.texto)}
        </div>
        <div class="receta-tarjeta">
          <h4>${GLIFOS[sAct.planeta]} ${sAct.planeta} · subperíodo (${sAct.anos.toFixed(2)} años)</h4>
          <p class="nota">Dentro del período de ${pAct.planeta}, el subperíodo de ${sAct.planeta} va de ${fechaTxt(sAct.inicio)} a ${fechaTxt(sAct.fin)}: la materia del ${sAct.planeta.toLowerCase()} se expresa bajo el marco del ${pAct.planeta.toLowerCase()}.</p>
          ${parrafos(porPlaneta[sAct.planeta]?.texto)}
        </div>
      </div>

      <h3>Subperíodos del período de ${pAct.planeta}</h3>
      <table class="tabla-prosp">
        <thead><tr><th></th><th>Planeta</th><th>Duración</th><th>Inicio</th><th>Fin</th></tr></thead>
        <tbody>${subFilas}</tbody>
      </table>

      <h3>Línea de tiempo (períodos mayores)</h3>
      <table class="tabla-prosp">
        <thead><tr><th></th><th>Planeta</th><th>Edad</th><th>Inicio</th><th>Fin</th></tr></thead>
        <tbody>${filas}</tbody>
      </table>
      <p class="nota">Cada subperíodo dura <em>años del planeta × años del anfitrión / 75</em>, en el orden del ciclo comenzando por el anfitrión. Los nodos alternan su orden en cada ciclo de 75 años. Interpretación: el período mayor marca el tono de la época; el subperíodo señala el área y el agente por donde se manifiesta.</p>
      <p class="nota">Fechas en Tiempo Universal. La firdaria se usa como telón de fondo: matiza y encuadra lo que los tránsitos, atacires y profecciones señalan con más precisión.</p>
    `;
  }

  pintar();
}