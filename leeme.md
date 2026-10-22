# Carta Natal — programa de cálculo astrológico

Primera pieza del **Agente de Astrología**. Calcula cartas natales completas con
entrada de datos, búsqueda de coordenadas geográficas, posiciones planetarias,
casas, aspectos, partes árabes y gráfico de la rueda zodiacal.

Motor: **Swiss Ephemeris 2.10.03** (© Astrodienst AG) compilado a **WebAssembly**
— sin compilar nada, sin instalar nada. Las efemérides usan los **archivos `.se1`
del equipo** (basados en JPL DE441, 54 archivos copiados de
`Documents\_ViejosTiempos\archive_zip`), que cubren del 1200 a.C. al 5400 d.C.

## Cómo ejecutarlo

1. Doble clic en **`Iniciar Carta Natal.bat`** (o, en una terminal: `node server.js`).
2. Se abre el navegador en `http://localhost:8765`.
3. Escribe los datos (fecha, hora, ciudad) y pulsa **Calcular carta**.
4. Para cerrar: cierra la ventana de consola o pulsa Ctrl+C.

Requiere **Node.js** (ya instalado en este equipo, v22). No necesita Internet:
todo el cálculo y los datos son locales.

## Qué hace

| Entrada | Cómo |
|---|---|
| Fecha | Día/mes/año, con casilla **a.C.** para cartas históricas (astrología caldea) |
| Hora | Hora local (24 h) o "hora desconocida" (mediodía) |
| Lugar | Búsqueda entre 69.589 ciudades con coordenadas y zona horaria (base local GeoNames) |
| UTC | Automático desde la ciudad (con horario de verano) o ajuste manual |
| Casas | Placidus, Whole Sign, Koch, Regiomontanus, Campanus, Equal, Porfirio, Alcabitius |
| Orbes | Tradicional (moieties), Moderno o Estricto |
| Orientación | **Zodiacal** (0° Aries a la izquierda, grados en sentido horario — carta clásica espejo, eje Aries-Libra horizontal; buena para comparar cartas y sinastría) o **Casas** (Ascendente a la izquierda, los signos giran — para interpretación natal) |
| Extras | Quirón, Ceres, Palas, Juno, Vesta (además de Nodo Norte y Lilith fijos) |

| Salida | Qué muestra |
|---|---|
| Rueda | Signos con colores por elemento, casas numeradas, ASC/MC, aspectos con intensidad, planetas con glifo y R de retrógrado. Orientación zodiacal o por casas, cambiable sin recalcular |
| Posiciones | Cuerpo, grado (signo), casa, retrogradación |
| Casas | Las 12 cúspides |
| Aspectos | Tipo, planetas, orbe, aplicativo/separativo |
| Detalles | Fecha juliana, hora UT, ΔT, sistema usado, efemérides JPL o Moshier, Parte de Fortuna |
| **Interpretación** | **Textos del recetario (10.368 recetas) cruzados con la carta: planetas en signo, ángulos, casas, puntos, regentes y aspectos, en 12 temas (personalidad, amor, pareja, familia, hijos, salud, intelecto, intereses, proyectos, posición social, relaciones, viajes)** |
| **Fichas por tema** | **Piloto «Salud» del patrón «se juzga por significadores, no por todo»: 9 tarjetas con los significadores reales de la carta (Asc, ☉, ☽, casas VI/XII/VIII + regentes, hyleg/alcocoden, parte de la enfermedad, lunación pre-natal), cada una con la triple pregunta de Morin (¿qué accidente? → ¿se dará? → ¿calidad y cantidad?), orden de juicio, límites y fuentes** |
| **Fichas por tema (completo)** | **7 temas con selector: Salud, Riqueza (II, Fortuna, ♃, VIII), Matrimonio (VII, ♀, ☽/☉, cúspide VII), Profesión (X, ☉, ♄/♂), Estudio (☿, III, IX, regente del Asc), Padres (IV, ☉, ☽, ♄/♀), Viajes y fe (IX, ♃, ☽, III). Cada tema con su orden de juicio, límites y fuentes. Enlace directo por URL: `?tema=riqueza`** |

## Estructura de archivos

| Archivo | Función |
|---|---|
| `index.html` | Interfaz (formulario y resultados) |
| `css/estilos.css` | Tema visual (colores, fuentes, responsivo) |
| `js/app.js` | Lógica: entrada → UTC → JD → cálculo → tablas |
| `js/carta.js` | Dibujo de la rueda en Canvas |
| `js/interpretacion.js` | Cruce carta ↔ recetario: construye las configuraciones presentes y renderiza la interpretación por temas |
| `js/fichas-tema.js` | Fichas por tema: detecta los significadores reales de la carta (regentes de VI/XII/VIII, parte de la enfermedad de Aben Ragel, hyleg/alcocoden simplificado, lunación pre-natal de Morin con Swiss Ephemeris) y renderiza las fichas condicionales |
| `js/prospectiva.js` | Prospectiva: atacires y profecciones (direcciones simbólicas `pos = natal + (360/ciclo)×edad`) con relojes C1–C360 y significadores por dominio (social, amor, salud, muerte). Incluye la doctrina del atacir de Aben Ragel (orden de fuerza conjunción>oposición>cuadratura>trígono>sextil como desempate) |
| `js/ayuda.js` | Pestaña Ayuda: explicaciones del programa y bibliografía/fuentes (contenido estático) |
| `datos/recetario.json` | Recetario de interpretación (864 configuraciones × 12 temas = 10.368 recetas; generado desde `Inter_Natal_Tabla.json` con `preparar-recetario-web.py`) |
| `js/vendor/` | Swiss Ephemeris WASM (librería de terceros, AGPL) |
| `datos/ciudades.json` | 69.589 ciudades (GeoNames, CC-BY 4.0) |
| `datos/ephe/*.se1` | Efemérides JPL (54 archivos, del equipo) |
| `server.js` | Servidor local sin dependencias |
| `test-calculo.mjs` | Validación del motor (`node test-calculo.mjs`) |

## Guía de modificación

- **Textos de la interfaz**: `index.html` (etiquetas) y `js/app.js` (nombres de cuerpos, aspectos).
- **Colores**: `css/estilos.css` (variables `--*`) y `js/carta.js` (colores de elementos, aspectos, glifos).
- **Sistema de casas por defecto**: `index.html`, opción `selected` del selector `#sistema` (P = Placidus).
- **Orientación del gráfico**: `index.html`, selector `#orientacion` (zodiacal = 0° Aries a la izquierda; casas = ASC a la izquierda). La geometría está en `js/carta.js`: `ang(lon) = (offset − lon + 180)°` con offset = 0 o ASC (fórmula espejo, grados en sentido horario; el anillo de signos usa el flag anticlockwise del arco para los sectores de 30°). También se puede forzar con la URL `?orientacion=casas`.
- **Cuerpos por defecto**: `js/app.js`, arrays `CUERPOS_BASE` y `EXTRAS`.
- **Interpretación**: el módulo `js/interpretacion.js` usa regencia tradicional (Marte rige Escorpio, Saturno Acuario, Júpiter Piscis), casas I/IV/VII/X cubiertas por los ángulos, y mapea los aspectos de la librería (Conjunction → unión, Sextile/Trine → armónico, Square/Opposition/tensiones → tensión). Los regentes se muestran en dos secciones: **Regentes de casas y ángulos** (ASC, DESC, FC, MC y casas II/III/V/VI/VIII/IX/XI/XII, con la casa del regente como dato auxiliar) y **Regentes de cuerpos** (planetas clásicos, Nodos y Fortuna). Para regenerar `datos/recetario.json` desde el recetario maestro: `python preparar-recetario-web.py`.
- **Orbes**: `js/app.js`, mapa `ORBES` (usa los esquemas de `js/vendor/dist/derived/aspects.js`).
- **Ciudades**: sustituir `datos/ciudades.json` por otro dump de GeoNames (mismo formato: `n,a,lat,lon,p,r,t,pop`).
- **Efemérides**: añadir o quitar `.se1` en `datos/ephe/` (nombres: `sepl_18.se1` planetas, `semo_18.se1` Luna, `seas_18.se1` asteroides, `seplm06.se1` años a.C.). El programa los carga solos según el año.
- **Puerto**: variable `PORT` en `server.js` (por defecto 8765).

## Validación

`node test-calculo.mjs` comprueba contra valores de referencia:
- JD 2000-01-01 12:00 UT = 2451545.0
- Sol en J2000 ≈ 280.46° (10°27' Capricornio)
- Sol en el equinoccio de marzo de 2024 ≈ 0° Aries
- Uso real de los archivos `.se1` (JPL), incluido un caso a.C.

`node test-fichas.mjs` valida el módulo de fichas por tema (3 cartas de prueba):
- Hyleg (☉ de día / ☽ de noche / Asc) y alcocoden simplificado (domicilio 5, exaltación 4, triplicidad 3, faz 1; sin términos)
- Parte de la enfermedad (Aben Ragel): de día Asc + Fortuna − ♄; de noche Asc + ♄ − Fortuna
- Lunación pre-natal (Morin): localiza la nueva/llena anterior al nacimiento con bisección (verificada contra la fase de la ☽)
- Render de las 9 fichas con datos reales

## Licencias y notas

- **Textos de interpretación**: compilados mediante IA de **Arturo Mata,
  Sinesio Rodenas y Jesús Ripero** (recetario astrológico propio, exportado de
  las bases Access `DATOS.accdb` / `MARGA61.accdb` del proyecto ACC-TUR).
- **Swiss Ephemeris**: © Astrodienst AG. Uso no comercial gratuito; para uso
  comercial se requiere licencia de Astrodienst (astro.com/swisseph). El paquete
  WASM se distribuye bajo AGPL-3.0.
- **Archivos `.se1`**: propiedad de Astrodienst, redistribuidos con el equipo.
- **Ciudades**: GeoNames (CC-BY 4.0), dump cities5000.

## Bibliografía y fuentes

Fuentes consultadas para la elaboración de los textos de interpretación y el
cálculo de la carta (biblioteca local en `imports/astrologia/`):

1. **Alpherat — Tratado de Astrología** (10.ª ed., Editorial Kier, Buenos Aires;
   1.ª ed. 1939; colaboración del Prof. Julio C. Hiriart). Manual de referencia
   en español: signos, planetas, planetas en los signos, teoría de las casas,
   análisis de las doce casas, previsiones (progresiones, tránsitos, revolución
   solar).
2. **Rafael A. Reverte Pérez (comp.) — Manual de Astrología** (compilación de
   varios autores; aparece citado en el índice como «Américo»). Planetas en los
   signos, nodos, ascendente y pareja, interpretación básica.
3. **Charles E. O. Carter — Los Aspectos Astrológicos** (original: *The
   Astrological Aspects*, 1930). Conjunción, sextil, cuadratura, trígono,
   oposición; aspectos del Sol y de la Luna.
4. **Charles E. O. Carter — An Encyclopaedia of Psychological Astrology**
   (1.ª ed. 1924, Theosophical Publishing House, Londres; en inglés,
   complemento psicológico).
5. **Astrología — Guía para principiantes** (edición en español, sin autor
   visible en portada).
6. **Marion D. March y Joan McEvers — Aprenda Astrología, vol. 3: El análisis
   del horóscopo** (Ediciones Martínez Roca, 4.ª ed.; escaneado sin capa de
   texto, pendiente de OCR).
7. **Recetario astrológico propio** (Arturo Mata): bases Access `DATOS.accdb`
   y `MARGA61.accdb` — tabla `Inter_Natal_Tabla` (10.488 configuraciones),
   `Interpretación de Sinesio` (108 textos), tránsitos (233), revolución solar
   (146), decanatos caldeos (36), genios de los grados (360).
8. **Decanatos y genios caldeos** (proyecto del libro de decanatos de Arturo
   Mata): sistema de decanatos por planetas y casas, ángeles y genios caldeos
   (dioses mesopotámicos), grados con sus genios — base doctrinal del módulo de
   astrología caldea.

## Próximos pasos previstos

1. ~~Interpretación natal automática~~ ✅ (recetario de 10.368 recetas integrado en `js/interpretacion.js`)
2. ~~Fichas por tema (piloto Salud)~~ ✅ (`js/fichas-tema.js`; patrón replicable a otros temas: riqueza, matrimonio, profesión, estudio, padres, viajes — ver `projects/agente-astrologia/fichas-temas/README.md`)
3. ~~Fichas por tema (7 temas completos)~~ ✅ (selector interactivo + `?tema=` por URL)
3. Prospectiva: ~~tránsitos, revoluciones solares, firdaria~~ ✅ **atacires y profecciones** (dirección simbólica, `js/prospectiva.js`); pendientes: tránsitos, revoluciones solares y firdaria.
4. Exportar la carta (imagen PNG o PDF).

## Burocracia (16/08/2026)

- **Aviso de privacidad/cookies** añadido: la app no usa cookies de seguimiento ni
  recopila datos personales (cálculo 100 % local); el aviso lo informa y guarda la
  preferencia en `localStorage`. Archivos tocados: `index.html` + `css/estilos.css`.
- **Copyright**: el pie ahora declara © Arturo Mata (con Sinesio Rodenas y Jesús
  Ripero) y licencia CC BY-NC-ND 4.0. Pendiente de decisión: registro en
  SafeCreative y/o publicación del libro en Amazon KDP como prueba pública.

## Revolución Solar v2 (12-oct-2026) — ampliaciones Maciá

- `datos/revolucion-solar.json` ampliado de 36 → **128 entradas**: superposiciones ASC/MC
  anuales sobre las casas natales (12+12), ASC anual sobre los planetas natales, regente del
  año (texto completo 12 casas + guía + notas aclaratorias), **astrodinas** (guía de
  aspectos/posiciones + 13 notas), **Parte del Infortunio** (guía + conjunciones + 12 casas),
  **atacires de la revolución** (guía + ASC por casas + MC + Sol/Luna/Venus/Marte/Saturno),
  **Parte de Fortuna / «afortunar»** y **relocación**.
- Extractor: `preparar-revolucion-solar.mjs` (v2; el v1 queda como
  `preparar-revolucion-solar-v1.mjs`). Corrige bugs del v1 (sol-casa-12 y asc-signo Piscis se
  comían texto de secciones siguientes).
- `js/revolucion-solar.js` v2: nuevas secciones en la pestaña **Revolución Solar**: tarjetas
  Maciá de comparación (ASC/MC anuales sobre casas natales), alerta «ASC anual junto a un
  planeta natal (≤2°)», regente ampliado + **astrodinas calculadas** (suma por aspectos +
  posición orientativa + banda de intensidad), **Tabla de atacires del año** (≈1°/día; ASC por
  casas, MC y planetas; pares en aspecto) con fechas y textos plegables, y notas de
  Fortuna/relocación. Fórmula del Infortunio: Asc + Marte − Saturno.
- Prueba: `test-revolucion-solar-v2.mjs` (TODO OK). Desplegado y verificado md5
  (`js/revolucion-solar.js`, `datos/revolucion-solar.json`, `css/estilos.css`).
- Pendiente: pasada de **redacción propia** de los textos Maciá (entran como recopilación,
  igual que estaba marcado en el saneamiento) y **cruce con el Libro VI del Conplido**
  («Revoluciones de los nacimientos»; OCR pendiente del escaneo grande de 1150 págs).

## Redacción propia del corpus Maciá (12-oct-2026)

- El corpus de la Revolución Solar (`datos/revolucion-solar.json`, 128 entradas)
  está **reescrito con redacción propia**: misma doctrina, mismas claves
  (tipo + casa/signo/clave), expresión original; no reproduce literalmente
  «La Revolución Solar y sus Atacires» ni «Cómo Trabajarla».
- Generador: `preparar-revolucion-solar-propio.mjs` (node). El extractor
  `preparar-revolucion-solar.mjs` (v2) queda como herramienta de estudio del
  texto original; su salida NO se despliega.
