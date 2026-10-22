# Progreso — Módulo de tránsitos (prospectiva)

Fecha: 2026-08-22 (sesión autónoma mientras Arturo estaba desconectado)

## Qué se ha hecho

Se ha construido el **módulo de tránsitos planetarios** del agente de astrología,
partiendo del libro *Tránsitos Planetarios y Destino* de Georges Antarès (1982)
que ya estaba digitalizado en `imports/astrologia/principiantes/texto/`.

### 1. Corpus de interpretación extraído → `datos/transitos.json`

- **271 entradas** estructuradas desde el texto íntegro del libro:
  - `punto` (154): planeta transitante × punto natal × tipo de aspecto
    (Neptuno, Urano, Saturno, Júpiter, Marte sobre Asc/MC/Sol/Luna/Mercurio/
    Venus/Marte/Júpiter/Saturno/Urano/Neptuno; + Venus y Mercurio como menores).
  - `signo` (60): los 5 planetas mayores por los 12 signos (efectos psicológicos).
  - `casa` (57): los 5 planetas mayores por las casas (plano material).
- Generado con `preparar-transitos.mjs` (reproducible; documenta las reglas de
  clasificación y los matices: Júpiter pliega la conjunción al buen aspecto,
  Saturno/Marte al mal aspecto, Neptuno/Urano la tratan por separado).
- Cada entrada conserva el texto íntegro de la fuente (párrafos reconstruidos).

### 2. Motor + render → `js/transitos.js`

- `calcularTransitos(natales, transitos, corpus)` — función pura y testable:
  encuentra aspectos (conjunción, semisextil, sextil, cuadratura, trígono,
  sesquicuadratura, oposición) con orbes propios de tránsito, y los mapea al
  corpus (con plegado de conjunción para Júpiter/Saturno/Marte).
- `renderTransitos(contenedor, datos, swe)` — panel con selector de fecha y
  cálculo real de posiciones con Swiss Ephemeris (mediodía UT).
- Aplicadas las reglas de Antarès:
  - **Direccionalidad**: el planeta en tránsito actúa sobre el punto natal.
  - **No reversibilidad**: un planeta no transita sobre sí mismo.
  - **Retrogradación/triple paso**: se marca ⚠ cuando el planeta está retrógrado.
  - **Plutón** se calcula pero no se interpreta (la fuente lo excluye expresamente).

### 3. Integración en la app

- Nueva pestaña **«Tránsitos»** en `index.html` + llamada `renderTransitos(...)`
  en `js/app.js`.

### 4. Test → `test-transitos.mjs` (TODO OK)

- Integridad del corpus (conteos, texto no vacío, claves completas).
- Mapeo puro (conjunción plegada, menores, Plutón excluido, auto-tránsito).
- Cálculo real con Swiss Ephemeris a dos fechas (1960 y 2026) con contactos y
  mapeo por casa verificados.
- Tests previos (`test-calculo`, `test-fichas`) siguen en TODO OK (sin regresión).

## Cómo regenerar / probar

```
node preparar-transitos.mjs   # regenera datos/transitos.json desde el libro
node test-transitos.mjs       # valida corpus + motor
```

## Pendiente (siguientes pasos)

- **Aspecto natal de fondo** (regla §3.2 de Antarès): modular el juicio del
  tránsito según el aspecto que los dos factores tenían en el radical
  (ya hay base: `datos.aspectos` / `aspectosExt` disponibles en app.js).
- **Búsqueda de fechas exactas**: escanear día a día para localizar el «día D»
  y los tres pasos (directo → retrógrado → directo) con sus períodos.
- **Revolución solar y firdaria** (siguientes módulos de prospectiva; fuentes en
  `texto/`: *Tito Maciá — La Revolución Solar y sus Atacires*, *Revolución solar*,
  *Tránsitos y Revolución Solar*).
- Revisión humana de los textos extraídos (hay ruido OCR leve: «sujetó» por
  «sujeto», «sé» por «se», etc.) si se quiere pulir el corpus para publicación.

## Corrección 2026-08-23
- Bug: la tabla de tránsitos usaba las cúspides de la carta inicial (por defecto) en vez de la carta seleccionada, porque \pintar()\ capturaba \datos\ en el cierre y no había auto-render. Solución: \pintar()\ ahora lee \estado.datos\ y se llama \pintar()\ al final de \enderTransitos\ (auto-refresca al cambiar de carta).

## Añadido 2026-08-25 — Fechas exactas · doble/triple paso
- Nueva sección en la pestaña Tránsitos: **«Buscar fechas exactas · doble/triple paso»**, con ventana configurable (±3, ±6, ±12, ±24 meses) y progreso.
- Núcleo puro testable en js/transitos.js:
  - detectarCruces(serie, lonNatal, A) — cruces por interpolación del desvío angular con signo (deduplica el evento cuando el muestreo diario toca el cero exacto).
  - agruparPasos(eventos, ventanaDias=300) — agrupa en ciclos de retrogradación y etiqueta simple/doble/triple.
  - buscarFechasExactas(swe, natales, jdInicio, jdFin) — barrido diario de Mercurio→Plutón (los que retrogradan; Sol/Luna fuera) contra Asc, MC y los 10 planetas, con refinado por bisección (40 iteraciones) de cada cruce de conjunción/sextil/cuadratura/trígono/oposición.
- Doctrina: el triple paso (ida-retro-ida) consuma lo que los dos primeros anunciaron; cada cruce se muestra con hora UT y estado de retrogradación.
- Test ampliado (test-transitos.mjs): serie sintética con triple paso (cruces en 5/13.33/26.67), agrupación doble+simple, y barrido astronómico real de 50 días en 1960 (50 cruces, 14 dobles). TODO OK.
- Desplegado en https://arquetypo.uno/ (js/transitos.js, HTTP 200, 22.809 bytes).

## Pendiente tras esta tanda
- **Firdaria** (períodos planetarios persas; elegir fuente para el corpus interpretativo).
- Ampliación del corpus RS: aspectos del Sol, ASC de la RS sobre planetas natales, casas regidas por el Sol.

## 2026-08-25 — Corpus reescrito (redacción propia)
- `preparar-transitos-propio.mjs` regenera `datos/transitos.json` con textos propios (271 entradas: 154 punto, 60 signo, 57 casa), conservando las claves exactas del corpus original (verificado programáticamente, 0 vacías).
- Motivo: el corpus literal reproducía la edición de Obelisco (1982). Ahora declara técnica de Antarès + textos propios.
- `transitos.js`: nota de la pestaña actualizada ("técnica de Georges Antarès; textos de redacción propia (2026)").
- Test ampliado (meta redacción propia, claves únicas, títulos) → TODO OK. Desplegado: transitos.json 161.735 B + transitos.js 22.933 B (HTTP 200).
