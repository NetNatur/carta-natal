// ============================================================
//  Prospectiva — atacires y profecciones (direcciones simbólicas)
//  posición dirigida = posición natal + (360 / ciclo) × edad  (mod 360°)
//
//  Fuentes: Tito Maciá («Profecciones», «Atacir»), Demetrio Santos
//  (ciclo C-60), Ptolomeo (Tetrabiblos IV.9), Zacuto, y Aly Aben Ragel
//  (Libro conplido en los iudizios de las estrellas, Libro IV cap. VII:
//  el atacir como proyección del hileg, con su orden de fuerza y ejemplos).
// ============================================================
import { NOMBRES_SIGNOS } from './carta.js';

// Dominios → relojes (ciclo C = años por vuelta completa de 360°)
export const DOMINIOS = [
  ['social', 'Social y general (C12, C60, C360)', [12, 60, 360]],
  ['amor', 'Amor y relaciones (C5, C15, C25)', [5, 15, 25]],
  ['salud', 'Salud y enfermedad (C60, C72, C144)', [60, 72, 144]],
  ['muerte', 'Muerte y crisis (C13, C45, C96, C156)', [13, 45, 96, 156]],
  ['todos', 'Todos los relojes', [1, 5, 12, 13, 15, 25, 45, 60, 72, 96, 144, 156, 360]],
];

const ASUNTO = {
  Sol: 'voluntad, padre, esposo y éxito social',
  Luna: 'cuerpo/alma, madre, mujer y afectos',
  Mercurio: 'intelecto, jóvenes, viajes y estudios',
  Venus: 'amor, matrimonio, hijas, dinero y placer',
  Marte: 'sexo, lucha, accidentes, cirugía y energía',
  Júpiter: 'expansión, protección, extranjeros y éxito',
  Saturno: 'autoridad, pruebas, duelos, mayores y responsabilidad',
  Urano: 'cambios, sorpresas, amigos, innovación y accidentes',
  Neptuno: 'espiritualidad, sueños, engaños y enfermedades difusas',
  Plutón: 'transformación, crisis, poder y regeneración',
};

const ASPECTOS = [
  [0, 'Conjunción', 2],
  [60, 'Sextil', 3],
  [90, 'Cuadratura', 3],
  [120, 'Trígono', 3],
  [180, 'Oposición', 3],
];

// Orden de fuerza del atacir según Aben Ragel (Libro IV, cap. VII):
// conjunción > oposición > cuadratura > trígono > sextil (el sextil, muy débil).
// Se usa para ordenar los contactos cuando el orbe no decide.
const FUERZA_ASPECTO = { 0: 5, 180: 4, 90: 3, 120: 2, 60: 1 };
const NOMBRE_ASPECTO = { 0: 'Conjunción', 60: 'Sextil', 90: 'Cuadratura', 120: 'Trígono', 180: 'Oposición' };
const SIGNO_ASPECTO = { 0: 'conjunta', 60: 'hace sextil a', 90: 'cuadra a', 120: 'trina a', 180: 'se opone a' };

// Estado persistente entre recálculos de la carta
const estado = { edad: 30, dominio: 'social' };

const norm = (lon) => (((lon % 360) + 360) % 360);
const signoDe = (lon) => NOMBRES_SIGNOS[Math.floor(norm(lon) / 30)];
const dirigir = (lon, C, edad) => norm(lon + (360 / C) * edad);

function gradosTexto(lon) {
  const s = Math.floor(norm(lon) / 30);
  const d = Math.floor(norm(lon) % 30);
  const m = Math.floor(((norm(lon) % 30) % 1) * 60);
  return `${NOMBRES_SIGNOS[s]} ${d}°${String(m).padStart(2, '0')}'`;
}

function puntosNatales(datos) {
  const pts = {};
  const add = (k, lon) => { if (typeof lon === 'number' && isFinite(lon)) pts[k] = norm(lon); };
  add('Ascendente', datos.asc);
  add('Descendente', datos.asc + 180);
  add('Medio Cielo', datos.mc);
  add('Fondo Cielo', datos.mc + 180);
  for (const p of datos.planetas) add(p.nombre, p.lon);
  add('Parte Fortuna', datos.fortuna);
  return pts;
}

function significadores(datos) {
  const sigs = [];
  const add = (nombre, glifo, asunto, lon) => {
    if (typeof lon === 'number' && isFinite(lon)) sigs.push({ nombre, glifo, asunto, lon: norm(lon) });
  };
  add('Ascendente', 'ASC', 'constitución física, salud y cuerpo', datos.asc);
  add('Medio Cielo', 'MC', 'prestigio, profesión, cargos y madre', datos.mc);
  for (const p of datos.planetas) {
    if (ASUNTO[p.nombre]) add(p.nombre, p.glifo, ASUNTO[p.nombre], p.lon);
  }
  add('Parte Fortuna', '⊗', 'bienes, riqueza y fortuna material', datos.fortuna);
  return sigs;
}

export function calcularContactos(datos, edad, relojes) {
  const pts = puntosNatales(datos);
  const sigs = significadores(datos);
  const contactos = [];
  for (const sig of sigs) {
    for (const C of relojes) {
      const posDir = dirigir(sig.lon, C, edad);
      for (const [nombre, lonNatal] of Object.entries(pts)) {
        if (nombre === sig.nombre) continue;
        const diff = Math.abs(((posDir - lonNatal + 540) % 360) - 180);
        for (const [ang, tipo, orbMax] of ASPECTOS) {
          const orb = Math.abs(diff - ang);
          if (orb <= orbMax) {
            contactos.push({ sig, reloj: C, punto: nombre, tipo, ang, orb, posDir });
          }
        }
      }
    }
  }
  contactos.sort((a, b) => (a.orb - b.orb) || (FUERZA_ASPECTO[b.ang] - FUERZA_ASPECTO[a.ang]));
  return { contactos, sigs, relojes, edad };
}

// ---------- Render ----------
export function renderProspectiva(contenedor, datos) {
  if (!datos || !datos.planetas || datos.planetas.length === 0) {
    contenedor.hidden = true;
    return;
  }
  contenedor.hidden = false;
  estado.datos = datos;

  if (!contenedor.dataset.init) {
    contenedor.dataset.init = '1';
    contenedor.innerHTML = `
      <h2>Prospectiva · atacires y profecciones</h2>
      <p class="nota-prospectiva">Dirección simbólica: se hace avanzar cada significador a velocidad fija y se cronometran los contactos (conjunción/aspecto) con los puntos natales. Los relojes son el ciclo (años por vuelta): C12 = Ptolomeo (1 signo/año), C60 = Demetrio Santos, C360 = 1°/año clásico.</p>
      <p class="nota-prospectiva"><strong>Doctrina clásica (Aben Ragel, <em>Libro conplido</em> IV.7):</strong> el atacir es la proyección del <strong>hileg</strong> por los grados (no solo del Ascendente); el dador de años es el <strong>alcocoden</strong>. Orden de fuerza del contacto: <strong>conjunción &gt; oposición &gt; cuadratura &gt; trígono &gt; sextil</strong> (el sextil, muy débil). Los contactos se ordenan por orbe y, a orbe igual, por esa jerarquía.</p>
      <div class="prospectiva-controles">
        <label class="campo mini">
          <span>Edad (años)</span>
          <input id="prosp-edad" type="number" min="0" max="120" step="0.1" value="${estado.edad}">
        </label>
        <label class="campo">
          <span>Dominio</span>
          <select id="prosp-dominio">
            ${DOMINIOS.map(([v, l]) => `<option value="${v}" ${v === estado.dominio ? 'selected' : ''}>${l}</option>`).join('')}
          </select>
        </label>
        <button type="button" id="prosp-calcular" class="boton-secundario">Calcular prospectiva</button>
      </div>
      <div id="prosp-resultado" class="prosp-resultado"></div>
    `;
    contenedor.querySelector('#prosp-calcular').addEventListener('click', pintar);
    contenedor.querySelector('#prosp-edad').addEventListener('change', (e) => { estado.edad = +e.target.value; pintar(); });
    contenedor.querySelector('#prosp-dominio').addEventListener('change', (e) => { estado.dominio = e.target.value; pintar(); });
  } else {
    // actualizar inputs por si la carta cambió de año (mantener estado)
    contenedor.querySelector('#prosp-edad').value = estado.edad;
    contenedor.querySelector('#prosp-dominio').value = estado.dominio;
  }

  function pintar() {
    const edad = +contenedor.querySelector('#prosp-edad').value || 0;
    const dom = contenedor.querySelector('#prosp-dominio').value;
    estado.edad = edad;
    estado.dominio = dom;
    const relojes = (DOMINIOS.find(([v]) => v === dom) || DOMINIOS[0])[2];
    const { contactos, sigs } = calcularContactos(estado.datos, edad, relojes);

    const out = contenedor.querySelector('#prosp-resultado');
    if (!contactos.length) {
      out.innerHTML = `<p class="nota">Sin contactos exactos a los ${edad} años en el dominio «${DOMINIOS.find(([v]) => v === dom)[1].split(' (')[0]}». Prueba con otra edad u otro dominio.</p>`;
      return;
    }

    // Posiciones dirigidas por significador
    const filasSig = sigs.map((s) => {
      const celdas = relojes.map((C) => `${gradosTexto(dirigir(s.lon, C, edad))} <small>(C${C})</small>`).join(' · ');
      return `<tr><td class="glifo">${s.glifo}</td><td>${s.nombre}</td><td class="celda-dir">${celdas}</td></tr>`;
    }).join('');

    const contactosHtml = contactos.slice(0, 40).map((c) => `
      <div class="receta-tarjeta">
        <h4>Atacir de ${c.sig.nombre} (C${c.reloj}) ${SIGNO_ASPECTO[c.ang]} ${c.punto} natal
          <span class="nota-casa">· orb ${c.orb.toFixed(2)}°</span></h4>
        <p>${c.sig.asunto} se activa sobre ${c.punto}. ${NOMBRE_ASPECTO[c.ang]} aplicada desde ${gradosTexto(c.posDir)}.</p>
      </div>`).join('');

    out.innerHTML = `
      <h3>Posiciones dirigidas a los ${edad} años</h3>
      <table class="tabla-prosp">
        <thead><tr><th></th><th>Significador</th><th>Posición dirigida por reloj</th></tr></thead>
        <tbody>${filasSig}</tbody>
      </table>
      <h3>Contactos (ordenados por orbe) — ${contactos.length} encontrados, mostrando ${Math.min(40, contactos.length)}</h3>
      <div class="grupo-interp">${contactosHtml}</div>
      <p class="nota">Los atacires señalan <strong>períodos sensibles</strong>, no hechos garantizados: el tema natal actúa como filtro y solo materializa una parte de cada influjo.</p>
    `;
  }

  pintar();
}
