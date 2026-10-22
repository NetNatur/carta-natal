// ============================================================
//  Ayuda — explicaciones del programa y bibliografía
//  Contenido estático (no depende de la carta calculada).
// ============================================================

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const SECCIONES = [
  {
    titulo: 'Qué es este programa',
    cuerpo: `
      <p><strong>Carta Natal</strong> calcula cartas natales completas con el motor
      <strong>Swiss Ephemeris 2.10.03</strong> (© Astrodienst AG) compilado a WebAssembly
      y las efemérides JPL DE441 del equipo (54 archivos <code>.se1</code>, que cubren del
      1200 a.C. al 5400 d.C.). Todo el cálculo es <strong>local</strong>: no se envía nada
      a internet.</p>
      <p>Muestra posiciones, casas, aspectos, partes árabes, la rueda gráfica, la
      interpretación del recetario, fichas por tema, prospectiva (atacires y profecciones)
      y tránsitos.</p>`,
  },
  {
    titulo: 'Cómo usarlo',
    cuerpo: `
      <ol>
        <li>Introduce <strong>fecha</strong> (con la casilla <em>a.C.</em> para cartas históricas),
            <strong>hora local</strong> (o marca «hora desconocida», que usa el mediodía) y
            <strong>lugar</strong> (busca entre 69.000+ ciudades; la zona horaria y el horario de
            verano se aplican solos).</li>
        <li>Elige el <strong>sistema de casas</strong> (Placidus por defecto), los
            <strong>orbes</strong> (tradicionales por defecto) y la <strong>orientación</strong>
            (zodiacal o por casas).</li>
        <li>Pulsa <strong>Calcular carta</strong>. El resultado se reparte en pestañas:
            Carta, Interpretación, Temas, Prospectiva, Tránsitos y Ayuda.</li>
        <li>Para cerrar el programa, cierra la ventana de consola (o pulsa Ctrl+C en ella).</li>
      </ol>
      <p class="nota">El botón <strong>«Ahora»</strong> calcula la carta del instante actual
      (en Madrid); el desplegable <strong>«Cartas de prueba»</strong> carga dos ejemplos ya
      verificados.</p>`,
  },
  {
    titulo: 'Las pestañas del resultado',
    cuerpo: `
      <dl class="ayuda-dl">
        <dt>Carta</dt><dd>Rueda gráfica, tabla de posiciones, casas, aspectos y detalles técnicos (JD, hora UT, ΔT, efemérides usadas, Fortuna).</dd>
        <dt>Interpretación</dt><dd>Textos del recetario (10.368 recetas) cruzados con la carta: planetas en signo, ángulos, casas, regentes y aspectos, en 12 temas.</dd>
        <dt>Temas</dt><dd>Fichas por tema (salud, riqueza, matrimonio, profesión, estudio, padres, viajes) con sus significadores reales, orden de juicio, límites y fuentes.</dd>
        <dt>Prospectiva</dt><dd>Atacires y profecciones (direcciones simbólicas) con relojes C1–C360 y dominios (social, amor, salud, muerte).</dd>
        <dt>Tránsitos</dt><dd>Tránsitos planetarios sobre los puntos natales para una fecha elegida, con fechas exactas y doble/triple paso.</dd>
<dt>Revolución Solar</dt><dd>Carta del retorno anual del Sol con la técnica de comparación natal↔RS (Volguine), zonas de transición y gráfico superpuesto.</dd>
<dt>Firdaria</dt><dd>Cronología clásica de períodos planetarios (fardarat, ciclo 75 años): período y subperíodo actuales con sus interpretaciones.</dd>
        <dt>Ayuda</dt><dd>Esta guía y la bibliografía.</dd>
      </dl>`,
  },
  {
    titulo: 'Notas sobre la interpretación',
    cuerpo: `
      <ul>
        <li>La interpretación usa <strong>regencia tradicional</strong>: Marte rige Escorpio,
            Saturno Acuario, Júpiter Piscis.</li>
        <li>Los textos son «recetas» que combinan configuraciones; <strong>no sustituyen</strong>
            el juicio sintético de un astrólogo: señalan tendencias y énfasis, no hechos garantizados.</li>
        <li>Las fichas por tema siguen el principio <em>«se juzga por significadores, no por todo»</em>,
            con la triple pregunta de Morin (qué accidente → si se dará → calidad y cantidad).</li>
        <li>La <strong>prospectiva</strong> (atacires/profecciones) indica <strong>períodos sensibles</strong>:
            la carta natal actúa como filtro y solo materializa una parte de cada influjo.</li>
      </ul>`,
  },
  {
    titulo: 'Glosario de la prospectiva',
    cuerpo: `
      <dl class="ayuda-dl">
        <dt>Atacir (al-tasyir)</dt><dd>Dirección simbólica de un significador a velocidad constante; el término viene de la escuela medieval árabe y judía (Zacuto, Ben Ragel).</dd>
        <dt>Alcocoden</dt><dd>El dador de los años; el planeta con más dignidad en el lugar del hileg.</dd>
        <dt>Almutén</dt><dd>El planeta con más dignidad en un lugar o asunto del tema.</dd>
        <dt>Aspecto natal de fondo</dt><dd>Regla de Antarès: el tránsito no promete nada que el radical no prometa; su efecto se modula según el aspecto que tránsito y punto hicieron en el nacimiento.</dd>
        <dt>Dirección primaria</dt><dd>Dirección por el giro real de la esfera en las horas siguientes al nacimiento; distinta del atacir, que usa velocidades simbólicas.</dd>
        <dt>Firdaria (fardariyas)</dt><dd>Los períodos planetarios de la vida: setenta y cinco años repartidos entre nueve gobernantes según la secta del nacimiento.</dd>
        <dt>Hileg</dt><dd>El dador de vida; los cinco significadores vitales de la tradición (Sol, Luna, Ascendente, Parte de la Fortuna y lugar de la conjunción/oposición precedente).</dd>
        <dt>Profección</dt><dd>La dirección por giros uniformes del zodíaco, según Ptolomeo.</dd>
        <dt>Regencia</dt><dd>El gobierno de un planeta sobre casas, signos o asuntos del tema.</dd>
        <dt>Retrogradación</dt><dd>El movimiento aparente hacia atrás de un planeta; produce los pasos dobles y triples de los tránsitos.</dd>
        <dt>Retorno exacto</dt><dd>El instante preciso en que un planeta regresa a su longitud natal; la revolución solar se calcula por bisección a partir del cumpleaños y para el lugar de residencia.</dd>
        <dt>Revolución solar</dt><dd>La carta del retorno exacto del Sol a su lugar natal; rige de cumpleaños a cumpleaños.</dd>
        <dt>Superposición</dt><dd>La caída de una casa de la revolución sobre una casa natal.</dd>
        <dt>Triple paso</dt><dd>El contacto de un tránsito retrógrado que toca tres veces el mismo punto: el suceso llega, se repliega y se confirma.</dd>
        <dt>Zona de transición</dt><dd>Cuando el Ascendente o el Mediocielo anuales caen a menos de dos grados de una cúspide natal: el año se lee a caballo entre esa casa y la siguiente.</dd>
      </dl>`,
  },
  {
    titulo: 'Licencias',
    cuerpo: `
      <ul>
        <li><strong>Textos de interpretación</strong>: © Arturo Mata (con Sinesio Rodenas y
            Jesús Ripero) — obra registrada, prohibida la reproducción sin autorización.
            Licencia <strong>CC BY-NC-ND 4.0</strong>.</li>
        <li><strong>Swiss Ephemeris</strong>: © Astrodienst AG. Uso no comercial gratuito;
            para uso comercial se requiere licencia de Astrodienst (astro.com/swisseph).
            El paquete WASM se distribuye bajo AGPL-3.0.</li>
        <li><strong>Efemérides <code>.se1</code></strong>: JPL DE441, propiedad de Astrodienst,
            redistribuidas con el equipo.</li>
        <li><strong>Ciudades</strong>: GeoNames (CC-BY 4.0), dump cities5000.</li>
      </ul>`,
  },
];

const BIBLIOGRAFIA = [
  ['Alpherat', 'Tratado de Astrología', '10.ª ed., Editorial Kier, Buenos Aires (1.ª ed. 1939). Manual de referencia en español: signos, planetas, casas, previsiones.'],
  ['Aly Aben Ragel (Ibn Abi l-Riyal)', 'El Libro conplido en los iudizios de las estrellas', 'Ed. Gracentro, Zaragoza (coord. José Luis Carrión); texto alfonsí (Toledo, 1254). Fuente clásica hispanoárabe: faces/decanatos caldeos, términos, almuten, hileg, alcocoden y atacir (Libro IV).'],
  ['Ptolomeo', 'Tetrabiblos', 'Base de la profección (dirección 1 signo/año), los cinco hilegs y la astrología tradicional.'],
  ['Jean-Baptiste Morin de Villefranche', 'Astrología Gallica', 'Libro XXI (la triple pregunta y la determinación local) y Libro 25 (lunación pre-natal).'],
  ['A. Weiss', 'Astrología Racional', 'Tectónica (cap. III: Asc/Sol/Luna, hyleg, casas VI/VIII/XII) y Elementos (casas y partes).'],
  ['Tito Maciá', 'Profecciones · Atacir · La Revolución Solar y sus Atacires · Atacires Sociales', 'Doctrina moderna del atacir por dominios (muerte, enfermedad, amor, sociales) y los relojes C5–C156.'],
  ['Demetrio Santos', 'Ciclo de 60 años (C-60)', 'Reformulación del atacir como ciclo de 60 años con «astrodinas» (intensidad por descarga de aspectos).'],
  ['Rafael A. Reverte Pérez (comp.)', 'Manual de Astrología', 'Compilación de varios autores: planetas en los signos, nodos, ascendente, interpretación básica.'],
  ['Charles E. O. Carter', 'Los Aspectos Astrológicos (1930) · An Encyclopaedia of Psychological Astrology (1924)', 'Teoría de los aspectos y complemento psicológico.'],
  ['Marion D. March y Joan McEvers', 'Aprenda Astrología, vol. 3: El análisis del horóscopo', 'Ediciones Martínez Roca. Método de análisis del horóscopo.'],
  ['Recetario astrológico propio (Arturo Mata)', 'Bases Access DATOS.accdb / MARGA61.accdb', 'Tabla Inter_Natal_Tabla (10.488 configuraciones), interpretación de Sinesio, tránsitos, revolución solar, decanatos caldeos, genios de los grados.'],
  ['Zacuto', '—', 'Recogido vía Maciá: «los planetas escenifican su influencia cuando el atacir del Ascendente llega al lugar del planeta o viceversa».'],
];

export function renderAyuda(contenedor) {
  if (!contenedor) return;
  if (!contenedor.dataset.init) {
    contenedor.dataset.init = '1';

    const seccionesHtml = SECCIONES.map((s) => `
      <section class="ayuda-seccion">
        <h3>${esc(s.titulo)}</h3>
        ${s.cuerpo}
      </section>`).join('');

    const bibHtml = BIBLIOGRAFIA.map(([a, t, n]) => `
      <li><strong>${esc(a)}</strong> — <em>${esc(t)}</em>. ${esc(n)}</li>`).join('');

    contenedor.innerHTML = `
      <h2>Ayuda y bibliografía</h2>
      ${seccionesHtml}
      <section class="ayuda-seccion">
        <h3>Bibliografía y fuentes</h3>
        <p>Fuentes consultadas para la elaboración de los textos de interpretación y el cálculo
           (biblioteca local en <code>imports/astrologia/</code>):</p>
        <ol class="ayuda-bib">${bibHtml}</ol>
      </section>
      <p class="nota">Motor: Swiss Ephemeris 2.10.03 · efemérides JPL (DE441) · cálculo local sin internet.</p>
    `;
  }
}
