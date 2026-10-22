# Progreso — Módulo Firdaria (cronología planetaria persa/árabe)

Fecha: 2026-08-25

## Qué se ha hecho

Nueva pestaña **«Firdaria»** en la app de carta natal: la cronología clásica de
los períodos planetarios (fardarat) superpuesta a la vida del nativo.

### 1. Estructura del cálculo (tradición)

- Ciclo de **75 años**: Sol 10 · Venus 8 · Mercurio 13 · Luna 9 · Saturno 11 ·
  Júpiter 12 · Marte 7 · Nodo Norte 3 · Nodo Sur 2.
- **Secta diurna** (Sol sobre el horizonte, casas 7-12): Sol→Venus→Mercurio→
  Luna→Saturno→Júpiter→Marte→NN→SN.
- **Secta nocturna** (Sol bajo el horizonte): Luna→Saturno→Júpiter→Marte→Sol→
  Venus→Mercurio→NN→SN.
- Los **nodos alternan su orden** en cada ciclo de 75 años.
- **Subperíodos**: duración = añosX × añosY / 75; el orden sigue el ciclo de los
  7 planetas desde el anfitrión (los nodos cierran; si el anfitrión es un nodo,
  abre su propio subperíodo y sigue la secuencia de 7).

### 2. Fuentes

- Abu Ma'shar, *Mundkhab kitab al-uluf* (fardariyas y tablas) — confirmación del
  sistema.
- Aben Ragel, *Libro conplido en los iudizios de las estrellas*, L.IV (tabla de
  sistemas de cronología de la tradición árabe: fardarat, máximo 75 años) —
  digitalizado en `imports/astrologia/aben-ragel/`.
- Demetrio Santos, *Nomenclator* (referencia a las fardariyas de Abu Ma'shar).
- La biblioteca local no desarrolla el método completo: la **interpretación del
  corpus es doctrinal propia** (redactada por el agente 2026-08-25 siguiendo las
  significaciones clásicas de los planetas), documentada en `datos/firdaria.json`
  → `preparar-firdaria.mjs` (reproducible).

### 3. Archivos

- `js/firdaria.js` — motor puro (secuenciaFirdaria, calcularFirdaria,
  periodoActivo, determinarSecta, jdDeFecha) + render (período actual con
  interpretación, subperíodos del período actual, línea de tiempo de 150 años).
- `datos/firdaria.json` — corpus: 9 períodos con textos (7 planetas + 2 nodos),
  generado con `preparar-firdaria.mjs`.
- `index.html` — pestaña «Firdaria» (entre Revolución Solar y Ayuda).
- `js/app.js` — import + render; `js/ayuda.js` — descripción en la guía.
- `test-firdaria.mjs` — **TODO OK** (28 comprobaciones: corpus, secuencias,
  nodos alternos, períodos consecutivos, 2 ciclos = 150 años, subperíodos suman
  el mayor, ejemplo real Prueba 1 → secta diurna).

### 4. Despliegue

Subido a https://arquetypo.uno/: `index.html`, `js/app.js`, `js/firdaria.js`,
`js/ayuda.js`, `datos/firdaria.json` (todos HTTP 200).

## Pendiente / ideas

- Notable doctrinal: la firdaria se usa como telón de fondo (encuadra tránsitos,
  atacires y profecciones); está anotado en el render.
- Posible matiz futuro: texto del subperíodo combinado con el anfitrión
  («la materia de X bajo el marco de Y») — ya insinuado en la nota del render.
- Pulir con fuente impresa si Arturo localiza un tratado con desarrollo completo
  (p. ej. edición de Bonatti sobre firdaria) y revisar el corpus.