# Revolución Solar — progreso

Fecha: 23/08/2026

## Entregado
- **Cálculo exacto del retorno del Sol** (`js/revolucion-solar.js`):
  - `encontrarRetornoSolar(swe, solNatal, anio, jdNatal)`: ancla la búsqueda en el
    cumpleaños del año (el retorno cae a ±1 día de él) y barre día a día para acotar
    el cruce, luego afina por bisección (50 iteraciones). Robusto ante la velocidad
    variable del Sol (perihelio/afelio).
  - Error comprobado: Δ = 0,0000° para 1960, 2000 y 2026.
  - **Corregido un bug de estimación**: la primera versión usaba el movimiento medio
    (0,9856°/día), que cerca del perihelio se desvía ~1,8 días y dejaba el cruce fuera
    de la ventana de bisección (error sistemático de ~0,32°). Solución: barrido diario
    anclado al cumpleaños.
- **Carta de la RS** (`calcularRevolucionSolar`): 10 planetas con signo/casa/retrogradación,
  cúspides, ASC, MC, regente del Ascendente (regencia tradicional: Marte→Escorpio,
  Saturno→Acuario, Júpiter→Piscis), casa del regente, casa del Sol, ASC de RS superpuesto
  a la casa natal.
- **Corpus de interpretación** (`datos/revolucion-solar.json`, 36 entradas):
  - `asc-signo` (12): Ascendente anual en los 12 signos — Tito Maciá, *La Revolución
    Solar y sus Atacires*.
  - `sol-casa` (12): Sol de la revolución en las 12 casas — ídem.
  - `regente-casa` (12): regente del Ascendente en las 12 casas — *Cómo Trabajarla*.
  - Extraído con `preparar-revolucion-solar.mjs`, con limpieza de ruido OCR
    (ñ→n/f/rio, tildes, guiones de fin de línea).
- **Interfaz**: pestaña «Revolución Solar» con selector de año y tres bloques de
  interpretación (clima del año / voluntad / regente) + tabla de posiciones.

## Tests
- `node test-revolucion-solar.mjs` → TODO OK (retorno exacto, carta completa,
  regente, casas, formato de fecha).

## Desplegado
- `index.html`, `js/app.js`, `js/revolucion-solar.js`, `datos/revolucion-solar.json`
  subidos por FTPS a https://arquetypo.uno/ (HTTP 200 verificado).

## Pendiente (módulos siguientes)
- **Firdaria** (periodos planetarios persas).
- **Búsqueda de fechas exactas / triple paso** para tránsitos.
- Ampliar el corpus: aspectos del Sol en la RS, ASC de RS sobre planetas natales
  (de *Cómo Trabajarla*), y las casas regidas por el Sol.

## Ampliación Volguine (23/08/2026)

Integrada la técnica de **comparación carta natal ↔ revolución solar** de
Alexandre Volguine (*La técnica de las revoluciones solares*, Ed. Kier 1988),
OCR completo (188 págs) y corpus extraído (`datos/volguine.json`, 270 entradas):

- **asc-casa-natal** (12): Ascendente anual en las 12 casas natales.
- **mc-casa-natal** (12): Mediocielo anual en las 12 casas natales.
- **superposicion** (114): casas anuales (2-9, 11-12) ↔ casas natales
  (las casas 1 y 10 no se listan porque son el ASC y el MC, tratados aparte).
- **asc-signo** (12): Ascendente anual en los 12 signos.
- **planeta-casa** (120): los 10 planetas en las 12 casas de la RS.

Extractor: `preparar-volguine.mjs`. Cálculo añadido: `mcCasaNatal` y
`superposiciones` (qué casa natal ocupa cada cúspide anual). Render reorganizado
en: resumen (ASC/MC/Sol), comparación con la natal (Volguine), clima del año,
planetas por casa, superposiciones, regente del ASC (Tito Maciá) y tabla de
posiciones. `test-revolucion-solar.mjs` TODO OK. Desplegado en arquetypo.uno.

## Añadido 2026-08-25 — Detalle fino: zonas de transición
- Nueva utilidad exportada zonaTransicion(lon, cusps, umbral=2) en js/revolucion-solar.js:
  - Casa estricta por posición + distancias a las cúspides (entrada/salida) + casaComplementaria.
  - Borde de signo (0°-2° y 28°-30°) con signoComplementario (el anterior si entra, el siguiente si sale).
  - Reutilizable para sinastría y cualquier comparación de cartas (mismo problema de cúspides).
- El cálculo de la RS devuelve ahora ascZona, mcZona y zonaNatal por planeta.
- Render: avisos ⚖ en el ASC/MC anuales (orbe a la cúspide, en grados), lectura complementaria del corpus Volguine para la casa adyacente (ASC/MC) y para el signo adyacente del ASC, y marcas en la tabla de posiciones (borde de signo / cúspide natal).
- Criterio (poco documentado en la tradición, decisión de Arturo): asignación estricta + lectura complementaria explícita cuando el orbe ≤ 2°, sin descartar la casa técnica.
- Caso real verificado (espejo del caso de Arturo): Prueba 1, RS 2026 — ASC anual a 1.75° de la cúspide 10 natal (MC Cáncer 23°34') → marcado ⚖ con lectura complementaria de la casa 9.
- Test ampliado (test-revolucion-solar.mjs): 16 comprobaciones nuevas, TODO OK; sin regresiones (transitos, cálculo, fichas OK).
- Desplegado en https://arquetypo.uno/ (js/revolucion-solar.js, HTTP 200, 19.426 bytes).

## 2026-08-25 — Reescritura legal del corpus Volguine (derechos de autor)
- **Contexto**: los textos de datos/volguine.json reproducían la traducción española de Ed. Kier («La técnica de las revoluciones solares», trad. Boris Cristoff, ediciones 1971-1988, ISBN 950-17-0426-2). Volguine †1976 → protegido en España hasta 31/12/2056 (80 años p.m.a., LPI art. 26), Argentina y Francia hasta ~2047; la traducción además por derechos de traductor/editor. Riesgo real para una app pública; Arturo eligió la opción 1 (reescritura).
- **Solución**: nuevo preparar-volguine-propio.mjs que genera datos/volguine.json con **redacción doctrinal propia** (significaciones clásicas + técnica de Volguine), manteniendo **las 270 claves exactas** del corpus original (12+12+12+114+120; superposiciones sin anual 1/10 y sin las 6 combinaciones ausentes en el original: 2/6, 3/6, 4/2, 5/9, 7/2, 8/6). Verificado: mismas claves, 0 vacías.
- El meta del corpus y las notas del render declaran la redacción propia y la atribución de la técnica. Test ampliado (4 comprobaciones del corpus) — TODO OK.
- Desplegado en https://arquetypo.uno/ (datos/volguine.json 130.891 B, js/revolucion-solar.js 20.824 B; HTTP 200).

## Pendiente legal (misma situación que Volguine)
- datos/transitos.json — textos literales de Antarès, «Tránsitos Planetarios y Destino» (Obelisco, 1982): reescribir (preparar-transitos-propio.mjs).
- datos/revolucion-solar.json (Tito Maciá) y textos de js/fichas-tema.js citados de Maciá: reescribir o verificar con el autor.
