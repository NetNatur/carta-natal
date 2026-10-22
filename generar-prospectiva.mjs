// Genera el manuscrito del libro de prospectiva (Tomo IV de la serie «Carta Natal»).
// La Parte I (método) y las Partes IV-V (atacires, firdaria) y apéndices son de
// redacción propia; los diccionarios de tránsitos y revolución solar vierten los
// corpus de redacción propia de la app (datos/transitos.json, datos/volguine.json,
// datos/firdaria.json). El corpus de Tito Maciá (revolucion-solar.json) NO se
// vuelca: sigue pendiente de saneamiento legal.
// Uso: node generar-prospectiva.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const T = JSON.parse(readFileSync('datos/transitos.json', 'utf8'));
const V = JSON.parse(readFileSync('datos/volguine.json', 'utf8'));
const F = JSON.parse(readFileSync('datos/firdaria.json', 'utf8'));

const out = [];
const p = (s = '') => out.push(s);

// ---------- Portada ----------
p('# Carta Natal: Manual de interpretación astrológica tradicional');
p('Tomo IV · La prospectiva: tránsitos, revolución solar, atacires y firdaria');
p();
p('Autor: Arturo Mata');
p('Con textos de Sinesio Rodenas y Jesús Ripero');
p('Edición 2026 · https://arquetypo.uno/');
p();
p('© 2026 Arturo Mata (con Sinesio Rodenas y Jesús Ripero). Todos los derechos reservados.');
p();
p('ÍNDICE');
p();
p('PARTE I · EL MÉTODO DE LA PROSPECTIVA — 1. Qué es la prospectiva · 2. Los cuatro relojes del cielo · 3. Los tránsitos: método y reglas · 4. La revolución solar · 5. Atacires y profecciones · 6. Los relojes caldeos y los dominios · 7. El hileg, el alcocoden y Aben Ragel · 8. La firdaria · 9. El filtro del tema natal');
p('PARTE II · DICCIONARIO DE TRÁNSITOS — los tránsitos de Mercurio, Venus, Marte, Júpiter, Saturno, Urano y Neptuno sobre los puntos natales, por los signos y por las casas');
p('PARTE III · DICCIONARIO DE LA REVOLUCIÓN SOLAR — el Ascendente y el Mediocielo anuales en las casas natales, el Ascendente anual por los signos, las superposiciones de casas y los planetas de la revolución en las casas natales');
p('PARTE IV · ATACIRES Y PROFECCIONES — significadores, relojes y dominios, orden de juicio y ejemplos del clásico');
p('PARTE V · LA FIRDARIA — las nueve estaciones de la vida y las reglas del cálculo');
p('APÉNDICES — A. Cómo se calcula cada técnica · B. Fuentes clásicas · C. Glosario mínimo · D. Aviso legal');
p();

// ---------- PARTE I ----------
p('# PARTE I · EL MÉTODO DE LA PROSPECTIVA');

p('## 1. Qué es la prospectiva');
p('Una carta natal describe una vida completa: tendencias, dones, límites y promesas. La prospectiva responde a la otra mitad de la pregunta, la que más urge al consultante: ¿cuándo? La natal dice qué puede ocurrir; la prospectiva, en qué época tiene el cielo previsto que ocurra.');
p('La astrología clásica nunca prometió hechos. Prometió épocas. Un tránsito de Saturno sobre el Sol no es una desgracia: es un período en el que lo que el tema natal ya decía de Saturno —su oferta y su exigencia— se vuelve urgente y visible. El astrólogo antiguo lo decía sin rodeos: el cielo de un momento no puede prometer nada que el tema natal no prometa. Esta es la regla de oro de toda la prospectiva, y se repite en este libro porque es la que separa la técnica de la superstición.');
p('Este tomo reúne las cuatro familias de técnicas con las que la tradición mide el tiempo, tal y como las aplica el método de esta obra: los tránsitos —el cielo real del día—, la revolución solar —la carta del año—, los atacires y profecciones —la dirección uniforme de los significadores— y la firdaria —el reparto de la vida en períodos planetarios—. De cada técnica se da el método en la primera parte y el recetario en las partes siguientes, con el mismo criterio de los tomos anteriores: primero se domina el instrumento, después se consulta el diccionario.');

p('## 2. Los cuatro relojes del cielo');
p('El tiempo astrológico no corre a una sola velocidad. La tradición usó cuatro relojes, cada uno con su resolución, y el juicio fino nace de combinarlos:');
p('• Los tránsitos: el cielo real de hoy sobre la carta fija del nacimiento. Son el reloj del día y de la semana; los planetas lentos marcan el clima de años, los rápidos el tiempo del día concreto.');
p('• Las direcciones simbólicas: los significadores de la carta avanzando a velocidad constante. El atacir caldeo y la profección ptolemaica son esta técnica; resuelven meses y marcan el suceso que prepara el año.');
p('• Las revoluciones: la carta que el cielo forma en el momento en que el Sol regresa a su lugar natal. Es el reloj del año: describe el escenario en el que los tránsitos y atacires del período se moverán.');
p('• Los períodos planetarios: el reparto de la vida entera en estaciones gobernadas por un planeta. La firdaria persa y árabe es la forma que este método toma en esta obra; resuelve décadas y épocas.');
p('El orden de lectura es de lo general a lo particular: la firdaria señala la época, la revolución solar el año dentro de esa época, el atacir el mes sensible, el tránsito la fecha. Quien busca una fecha saltándose los relojes gruesos lee el diario sin haber mirado el almanaque: acierta por casualidad, no por método.');

p('## 3. Los tránsitos: método y reglas');
p('Un tránsito es la posición real de un planeta del cielo en un momento dado, tomada como aspecto al tema fijo del nacimiento. Tres reglas gobiernan su lectura.');
p('Primera: el planeta en tránsito actúa sobre el punto natal, y no al revés. La direccionalidad es del cielo hacia la carta: Neptuno alcanza al Ascendente natal; el Ascendente no alcanza a Neptuno. La geometría admite ambos ángulos; el juicio, no.');
p('Segunda: el aspecto natal de fondo. El tránsito no inventa: libera lo que el radical ya promete. Antes de leer un tránsito de Marte tenso sobre la Luna, se mira qué Marte y qué Luna había en el nacimiento y qué aspecto se hicieron allí. Si el aspecto natal era armónico, el tránsito tenso es una grieta en un muro sólido; si el natal era tenso, es el temblor que la prueba la construcción entera. Los textos del diccionario de esta parte se leen siempre con ese filtro.');
p('Tercera: la velocidad decide la duración. Los tránsitos de los planetas lentos —desde Júpiter en adelante— definen clima; los de Mercurio, Venus y Marte, el tiempo concreto. Un planeta retrógrado que vuelve sobre un punto lo toca tres veces: el suceso llega, se repliega y se confirma. El triple paso no es un accidente del almanaque: es la firma de los asuntos que piden revisión antes de cerrarse.');
p('El diccionario de la parte II ofrece los tránsitos de Mercurio a Neptuno sobre los puntos natales —en sus tres aspectos posibles—, su paso por los signos y su paso por las casas. Los tránsitos del Sol y la Luna, de paso diario, se leen con las reglas del capítulo y no necesitan recetario: su obra es la del día.');

p('## 4. La revolución solar: el cumpleaños que manda el año');
p('La revolución solar es la carta del instante exacto en que el Sol, avanzando por la eclíptica, regresa a la longitud que ocupaba en el nacimiento. Esa carta rige desde ese instante hasta el siguiente aniversario: es el escenario del año.');
p('Se calcula para el lugar en que vive la persona, no para el de nacimiento: el cielo del año se forma sobre quien lo vive, donde lo vive. El retorno exacto se obtiene por bisección a partir de las efemérides; la app que acompaña a esta obra lo calcula al segundo.');
p('La lectura de la revolución gira sobre tres ejes. Primero, el Ascendente y el Mediocielo anuales: el año se lee según la casa natal en la que caen —el Ascendente anual sobre la casa natal 7, por ejemplo, pone el año bajo el signo de los otros—. Segundo, las superposiciones: las casas de la revolución se tienden sobre las casas natales, y cada caída colorea el asunto anual. Tercero, los planetas de la revolución en las casas natales: cada planeta anual ocupa un departamento de la vida y lo activa con su naturaleza.');
p('El detalle fino importa: cuando el Ascendente o el Mediocielo anuales caen cerca del borde de una casa natal —a menos de dos grados de una cúspide—, el año vive a caballo entre esa casa y la siguiente. El diccionario ofrece las dos lecturas, la estricta y la complementaria, y el juicio elige según la vida concreta del consultante.');
p('La revolución no sustituye al radical: se lee sobre él. Es un escenario, no un destino. El diccionario de la parte III recoge la técnica completa de la comparación natal-revolución según la escuela de Alexandre Volguine, en redacción propia de esta obra.');

p('## 5. Atacires y profecciones: la dirección uniforme');
p('La familia más antigua de la prospectiva es la de las direcciones simbólicas: un significador de la carta avanza a velocidad constante y se anota el instante en que alcanza, por aspecto, un punto sensible del tema. La fórmula es una sola: posición dirigida es igual a posición natal más velocidad por edad.');
p('Ptolomeo llamó profección a la variante en que el significador recorre el zodíaco en giros uniformes —de ahí el nombre: la profección «perfecciona» el circuito—. La escuela medieval árabe y judía refinó el método y le dio el nombre con el que ha llegado a esta obra: el atacir, del árabe al-tasyir, «el conducir». Abraham Zacuto lo sistematizó y Aben Ragel lo integró en su juicio del nacimiento. En el siglo XX, Demetrio Santos recuperó el ciclo de sesenta años como reloj de la vida cotidiana.');
p('La diferencia con las direcciones primarias es de cielo, no de papel: las primarias usan el giro real de la esfera en las primeras horas de vida; el atacir y la profección usan velocidades simbólicas, uniformes, independientes del horario de nacimiento. Por eso el atacir es la dirección del pueblo y de la escuela caldea: no exige reloj de nacimiento exacto, y su precisión es la de los períodos, no la de los minutos.');
p('Lo que se conduce son los significadores: el Ascendente —para la persona y su salud—, el Mediocielo —para la honra—, el Sol —para la voluntad, el padre y los grandes—, la Luna —para el cuerpo, el alma y las mujeres de la familia—, la Parte de la Fortuna —para la suerte material— y cada planeta, que arrastra a los asuntos que gobierna en el tema. Lo que se alcanza son los puntos sensibles: los planetas natales, los ángulos, las cúspides y las partes.');

p('## 6. Los relojes caldeos y los dominios de la vida');
p('Un reloj es el número de años que el significador tarda en dar la vuelta completa. Cuanto menor es el reloj, más rápido corre el significador y más concreto es el suceso que señala. La tradición caldea conservó una escala de relojes, cada uno asociado a un dominio de la vida:');
p('• C5 — cuatro grados y medio al año: el reloj rápido del amor y de los amores repentinos.');
p('• C12 — treinta grados al año: el reloj social del año a año, hermano del signo solar.');
p('• C13 — el reloj de la muerte en la escuela de los maestros árabes.');
p('• C15 — veinticuatro grados al año: el segundo reloj del amor, más lento y más duradero.');
p('• C25 — el reloj del amor maduro, de las alianzas que se crían.');
p('• C45 — ocho grados al año: el reloj grave de la muerte.');
p('• C60 — seis grados al año: el reloj de la vida cotidiana según Demetrio Santos, y el reloj de la enfermedad.');
p('• C72 — cinco grados al año: el reloj de la enfermedad en la escuela de Huber.');
p('• C96 y C156 — los relojes lentos de la muerte.');
p('• C144 — dos grados y medio al año: el reloj de la enfermedad larga.');
p('• C360 — un grado al año: la dirección clásica, la del grado por año.');
p('El dominio decide el reloj: para el amor se vigilan C5, C15 y C25; para la enfermedad, C60, C72 y C144; para lo social, C12, C60 y C360; para la muerte —que solo se juzga en su contexto, nunca como servicio— la tradición usaba C13, C45, C96 y C156. La guía de interpretación de la parte IV ofrece, para cada significador, su lectura en cada dominio.');

p('## 7. El hileg, el alcocoden y la doctrina de Aben Ragel');
p('Aben Ragel dio al atacir su forma de juicio en el Libro cuarto de la octavaesfera. Su doctrina es precisa: no se conduce cualquier punto, sino el hileg —el dador de vida— proyectado por los grados. Los cinco hilegs de la tradición son el Sol, la Luna, el grado del Ascendente, la Parte de la Fortuna y el lugar de la conjunción o de la oposición precedente. El que manda en cada carta lo decide el juicio del tema; el que da los años es el alcocoden, el planeta con más dignidad en el lugar del hileg.');
p('El orden de fuerza de los aspectos sirve para desempatar cuando el orbe no decide: conjunción, oposición, cuadratura, trígono y, muy por detrás, sextil. La conjunción es la llegada al lugar mismo; la oposición, la cara oculta del asunto; la cuadratura, el obstáculo; el trígono, la ayuda; el sextil, apenas una esquirla de favor.');
p('Los ejemplos del clásico enseñan el método mejor que las definiciones. Un hileg en Sagitario, en el término de Júpiter, con Marte en cuadratura, anunciaba la batalla: el atacir que llega a la casa séptima —la de los enemigos declarados— cerraba el juicio. Un hileg en la tercera con el ángulo de tierra en Aries anunciaba la prisión al llegar el atacir al grado del término de Marte. Saturno o la cola del dragón en Escorpio prometían retención de orina; en Tauro, la esquinancia. Son juicios de otra época, y se leen como se lee todo clásico: por el método, no por la materia. El astrólogo de hoy usa los mismos engranajes para épocas de crisis, cirugías y retiros, y deja la sentencia de muerte donde pertenece: en la historia de la técnica, no en la consulta.');

p('## 8. La firdaria: los períodos de la vida');
p('La firdaria —las fardariyas de los persas y de los árabes, «los grados de la vida»— reparte la existencia en estaciones gobernadas por un planeta. En carta diurna manda primero el Sol; en nocturna, la Luna. El orden y los años de esta obra, siguiendo a Abu Ma\'shar y a Aben Ragel, son: Sol 10, Venus 8, Mercurio 13, Luna 9, Saturno 11, Júpiter 12, Marte 7, y los nodos 5 —tres el Norte y dos el Sur—. Completan el ciclo de setenta y cinco años; lo que venga después vuelve a empezar.');
p('Cada período tiene su subperíodo: dentro de los años del anfitrión, cada planeta toma una porción proporcional —los años del anfitrión por los años del subanfitrión, dividido entre setenta y cinco—, en el orden cíclico que arranca en el propio anfitrión. El anfitrión manda la época; el subperíodo la colorea.');
p('El diccionario de la parte V ofrece la lectura de las nueve estaciones. Se lee así: la firdaria señala el planeta que tiene la palabra en esos años; todo lo que ocurra en ellos —tránsitos, revoluciones, atacires— se vive con el acento de ese gobernante. La firdaria no sucede: tiñe.');

p('## 9. El filtro del tema natal y los límites de la prospectiva');
p('Toda la prospectiva de esta obra descansa en una sola regla, ya dicha y aquí sellada: el cielo de un momento no promete nada que el tema natal no prometa. Las técnicas cronometrían; no inventan. Un juicio de prospectiva sin el radical a la vista es un monstruo de cálculo sin alma.');
p('El método práctico es de capas: la firdaria nombra el planeta de la época; la revolución solar abre el escenario del año; el atacir señala el mes en que el significador dirigido alcanza su blanco; el tránsito fija la fecha. Cuando cuatro capas cuentan la misma historia, el período es serio. Cuando solo una la cuenta, es un rumor del almanaque.');
p('Y la ética, que es técnica y no decorado: la prospectiva señala períodos de lluvia y de siega, no sentencias. Del juicio de la vida y la muerte se habla en los libros de historia de la astrología; en la consulta se habla de lo que el consultante puede hacer con su tiempo. Este libro enseña a mirar el calendario del cielo; el resto pertenece a la prudencia del practicante y al libre albedrío de cada vida.');

// ---------- PARTE II: TRÁNSITOS ----------
p();
p('# PARTE II · DICCIONARIO DE TRÁNSITOS');
p('Los textos de este diccionario siguen el estilo intenso de la fuente de la técnica —Georges Antarès, «Tránsitos Planetarios y Destino»—, de la que son redacción propia de esta obra: se leen como posibilidades, no como destino, y siempre con el filtro del aspecto que el tránsito y el punto hicieron en el nacimiento. Cada planeta reúne primero los aspectos a los puntos natales, después el paso por los signos y por fin el paso por las casas.');
p('Mercurio y Venus, por su rapidez, llevan recetario solo de los aspectos a los puntos natales: su paso por signos y casas se lee con las reglas generales del capítulo 3. Los de Plutón y de Sol y Luna no llevan recetario en esta obra: los de Plutón se leen con esas mismas reglas por su lentitud extrema; los de Sol y Luna son el tiempo diario.');

const ORDEN_PLANETAS = ['Neptuno', 'Urano', 'Saturno', 'Júpiter', 'Marte', 'Venus', 'Mercurio'];
let prevTituloBloque = null;
for (const planeta of ORDEN_PLANETAS) {
  const bloques = [
    ['punto', 'Tránsitos sobre los puntos natales'],
    ['signo', 'El paso por los signos'],
    ['casa', 'El paso por las casas'],
  ];
  for (const [tipo, nombreBloque] of bloques) {
    const es = T.entradas.filter((e) => e.tipo === tipo && e.planeta === planeta);
    if (!es.length) continue;
    const tituloBloque = `## ${planeta} en tránsito — ${nombreBloque}`;
    if (tituloBloque !== prevTituloBloque) {
      p();
      p(tituloBloque);
      prevTituloBloque = tituloBloque;
    }
    for (const e of es) {
      p();
      p(`### ${e.titulo || ''}`.trim());
      for (const parrafo of e.texto) p(parrafo);
    }
  }
}

// ---------- PARTE III: REVOLUCIÓN SOLAR ----------
p();
p('# PARTE III · DICCIONARIO DE LA REVOLUCIÓN SOLAR');
p('Los textos de esta parte aplican la técnica de la comparación natal-revolución según la escuela de Alexandre Volguine, en redacción propia de esta obra. Se lee siempre sobre el tema natal: la revolución es el escenario del año que va de cumpleaños a cumpleaños, calculada para el lugar de residencia.');
p();
p('## El Ascendente anual en las casas natales');
p('El Ascendente de la revolución marca la puerta por la que entra el año. Su caída en una casa natal indica el departamento de la vida que recibe el empuje anual.');
for (const e of V.entradas.filter((x) => x.tipo === 'asc-casa-natal')) {
  const frase = e.texto[0] || '';
  const idx = frase.indexOf(':');
  p();
  p(`### ${idx > 0 ? frase.slice(0, idx).trim() : 'Ascendente anual en la casa ' + e.casa + ' natal'}`);
  for (const parrafo of e.texto) p(idx > 0 && parrafo === e.texto[0] ? frase.slice(idx + 1).trim() : parrafo);
}
p();
p('## El Mediocielo anual en las casas natales');
p('El Mediocielo de la revolución describe la posición que el año prepara: la honra, la vocación y la proyección pública, leídas sobre la casa natal que ocupan.');
for (const e of V.entradas.filter((x) => x.tipo === 'mc-casa-natal')) {
  const frase = e.texto[0] || '';
  const idx = frase.indexOf(':');
  p();
  p(`### ${idx > 0 ? frase.slice(0, idx).trim() : 'Mediocielo anual en la casa ' + e.casa + ' natal'}`);
  for (const parrafo of e.texto) p(idx > 0 && parrafo === e.texto[0] ? frase.slice(idx + 1).trim() : parrafo);
}
p();
p('## El Ascendente anual por los signos');
p('El signo del Ascendente anual da el tono con el que la persona vivirá el año: el vestido del período.');
for (const e of V.entradas.filter((x) => x.tipo === 'asc-signo')) {
  const frase = e.texto[0] || '';
  const idx = frase.indexOf(':');
  p();
  p(`### ${idx > 0 ? frase.slice(0, idx).trim() : 'Ascendente anual'}`);
  for (const parrafo of e.texto) p(idx > 0 && parrafo === e.texto[0] ? frase.slice(idx + 1).trim() : parrafo);
}
p();
p('## Las superposiciones de casas');
p('Las casas de la revolución se tienden sobre las casas natales: cada caída pone en marcha, en el asunto anual, los asuntos de la casa natal sobre la que se apoya.');
let superpActual = null;
for (const e of V.entradas.filter((x) => x.tipo === 'superposicion')) {
  const frase = e.texto[0] || '';
  const idx = frase.indexOf(':');
  const titulo = e.anual && e.natal ? `La casa ${e.anual} anual sobre la casa ${e.natal} natal` : (idx > 0 ? frase.slice(0, idx).trim() : frase);
  p();
  p(`### ${titulo}`);
  for (const parrafo of e.texto) p(idx > 0 && parrafo === e.texto[0] ? frase.slice(idx + 1).trim() : parrafo);
}
p();
p('## Los planetas de la revolución en las casas natales');
p('Cada planeta de la revolución ocupa una casa natal y activa ese departamento con su naturaleza: el Sol manda en la casa, los demás piden y ofrecen.');
const ORDEN_RSV = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'];
for (const planeta of ORDEN_RSV) {
  const es = V.entradas.filter((x) => x.tipo === 'planeta-casa' && (x.planeta === planeta || (x.texto[0] || '').startsWith(planeta)));
  if (!es.length) continue;
  for (const e of es) {
    const frase = e.texto[0] || '';
    const idx = frase.indexOf(':');
    p();
    p(`### ${e.planeta ? 'El ' + e.planeta + ' de la revolución en la casa ' + e.casa + ' natal' : (idx > 0 ? frase.slice(0, idx).trim() : 'Planeta anual')}`);
    for (const parrafo of e.texto) p(idx > 0 && parrafo === e.texto[0] ? frase.slice(idx + 1).trim() : parrafo);
  }
}

// ---------- PARTE IV: ATACIRES ----------
p();
p('# PARTE IV · ATACIRES Y PROFECCIONES');
p('Esta parte recoge la guía de interpretación de la dirección uniforme: qué asunto anuncia cada significador cuando su atacir alcanza un punto natal, con qué relojes se mide cada dominio de la vida y en qué orden se juzga. Las significaciones siguen a la tradición —Ptolomeo, Abu Ma\'shar, Aben Ragel— y a los maestros del atacir; la redacción es propia de esta obra.');

p('## Los significadores');
p('### El Ascendente');
p('El Ascendente dirigido es el reloj de la persona: su cuerpo, su salud y su forma de presentarse al mundo. Cuando el atacir del Ascendente llega a un planeta natal, la época toma el color de ese planeta; cuando un planeta dirigido alcanza al Ascendente natal, es el asunto del planeta el que toca a la puerta de la vida personal. Es el significador principal en los juicios de salud.');
p('### El Mediocielo');
p('El Mediocielo dirigido gobierna la honra y la vocación: cargos, reconocimientos, caídas y ascensos. Su atacir sobre Júpiter o el Sol señala época de nombramiento o de brillo; sobre Saturno, de responsabilidad o de deshonra según el estado del planeta; sobre Marte, de litigios y competencias públicas.');
p('### El Sol');
p('El Sol dirigido conduce la voluntad, el padre, el esposo en las cartas de mujer de la tradición y las personas importantes de la vida. Su llegada a Marte anuncia épocas de brillo y de riesgo; a Saturno, de gravedad y duelo paterno; a Venus, de honores suaves y alianzas; a los ángulos, años que se deciden.');
p('### La Luna');
p('La Luna dirigida conduce el cuerpo y el alma: la salud cotidiana, los afectos, la madre, las mujeres de la familia y el público. Es significador fundamental en los juicios de muerte de los clásicos y en los de embarazo y maternidad. Su ataque a Saturno melancoliza y envejece la época; a Júpiter la ensancha; a Marte la fiebre y la prisa.');
p('### Mercurio');
p('Mercurio dirigido conduce los estudios, los escritos, el comercio, los viajes cortos y los hijos varones de la tradición. Su ataque a Júpiter abre época de aprendizaje y de trato con extranjeros; a Saturno, de estudios graves y de silencios; a Mercurio mismo, de papeles que se multiplican.');
p('### Venus');
p('Venus dirigida conduce el amor, las hijas, el dinero y las artes. Es el significador del romance: su llegada a Marte enciende; a Saturno casa con lo mayor o enfría; a Júpiter trae el amor generoso o el extranjero; a la Luna, el matrimonio y la maternidad en las cartas que la tradición reservaba a las mujeres —hoy, a quien la espera—.');
p('### Marte');
p('Marte dirigido conduce el empuje, la lucha, la cirugía y los militares. Es el matador natural de los clásicos: su ataque al hileg exige prudencia y vigila heridas y operaciones. En el dominio del amor excita y despierta pasión; en el social, impone la competencia.');
p('### Júpiter');
p('Júpiter dirigido conduce los extranjeros, los grandes, los profesores y la fe. Su ataque al Ascendente o al Sol ensancha la época: viajes, estudios superiores, amparo de los poderosos. En el amor de la tradición era el príncipe azul; en lo social, el viaje largo y el ascenso por el saber.');
p('### Saturno');
p('Saturno dirigido conduce la autoridad, los mayores, los jueces y el tiempo que madura. Su ataque al hileg pesa: duelos, lutos, cargas. En lo social trae dificultades y responsabilidades que se heredan; en la enfermedad, lo huesudo y lo crónico.');
p('### Urano');
p('Urano dirigido conduce los amigos ingeniosos, los técnicos, lo repentino. Su ataque al hileg anuncia lo inesperado; en la enfermedad, lo neurológico; en el amor, amistades sorprendentes que se vuelven amor; en lo social, sorpresas y giros de agenda.');
p('### Neptuno');
p('Neptuno dirigido conduce lo espiritual, lo creativo, lo evasivo y lo engañoso. En la enfermedad de la escuela moderna, lo infeccioso y lo autoinmune; en el amor, los sueños y los desengaños; en lo social, los enfermos, los necesitados y los refugios.');
p('### Plutón');
p('Plutón dirigido conduce la transformación, el poder y lo magnético. Su ataque al hileg exigía en los clásicos toda la prudencia; en la enfermedad moderna, las crisis regenerativas; en el amor, el deseo según el dispositor; en lo social, los cambios radicales de agenda.');
p('### La Parte de la Fortuna');
p('La Fortuna dirigida conduce la suerte material: el cuerpo económico de la vida. Su ataque a Júpiter prospera; a Saturno constriñe; a Marte gasta y quiebra; a los ángulos decide la economía de los años. En el juicio de la salud de los clásicos era el cuarto hileg.');

p('## Los relojes y sus dominios');
p('El reloj —los años de la vuelta completa— decide la resolución temporal y el dominio del juicio. Esta es la escala de esta obra, con la velocidad de cada uno:');
p('• C5 (72°/año) y C15 (24°/año) y C25 (14,4°/año): los relojes del amor, del rápido al maduro.');
p('• C12 (30°/año): el reloj social del ciclo anual.');
p('• C60 (6°/año): el reloj de la vida cotidiana y de la enfermedad (Demetrio Santos).');
p('• C72 (5°/año) y C144 (2,5°/año): los relojes de la enfermedad larga.');
p('• C13, C45 (8°/año), C96 (3,75°/año) y C156 (2,3°/año): los relojes de la muerte, reservados al juicio histórico y de contexto.');
p('• C360 (1°/año): la dirección clásica del grado por año, el reloj general de la vida.');
p('El dominio elige el reloj; el reloj, la fecha. El mismo ataque del Sol a Saturno se lee como duelo paterno con C45 y como carga profesional con C360: el reloj es el interrogatorio, el ataque es la respuesta.');

p('## El orden de juicio');
p('La prospectiva por atacires se juzga en cinco pasos:');
p('1. El dominio y el reloj: qué se pregunta y con qué resolución se mide.');
p('2. El significador dirigido: qué asunto conduce el ataque.');
p('3. El punto natal alcanzado y el aspecto: qué se activa y cómo —conjunción, oposición, cuadratura, trígono o sextil—, con el orden de fuerza para desempatar.');
p('4. El orbe: cuánto falta o cuán recién pasado está el contacto; la exactitud es la fecha.');
p('5. El filtro del radical: qué dice el nacimiento del asunto. Sin promesa natal no hay suceso; sin este quinto paso, no hay juicio.');

p('## Ejemplos del clásico');
p('Aben Ragel ilustra la técnica con juicios que enseñan el engranaje. Se citan por el método, en redacción propia:');
p('• Hileg en Sagitario, en el término de Júpiter, con Marte en cuadratura al grado: el ataque del hileg al ángulo de la séptima —los enemigos declarados— cerró el juicio en la batalla. La lección: el significador grave con el maléfico comprometido en su término pide vigilar la casa que el ataque alcanza.');
p('• Hileg en la tercera, con el ángulo de tierra en Aries: el ataque al grado del término de Marte trajo prisión y muerte en prisión. La lección: los términos deciden el matiz del planeta y el grado exacto decide la fecha.');
p('• Saturno o la cola del dragón en Escorpio: esquinancia y retención de orina; en Tauro: la misma esquinancia por otra vía. La lección: la casa y el signo del infortunio fija el órgano y la materia; el atacir cronometra.');
p('Leídos con la prudencia del capítulo 9, estos ejemplos enseñan lo esencial: el atacir no adivina, cronometra lo que la carta ya tiene escrito.');

// ---------- PARTE V: FIRDARIA ----------
p();
p('# PARTE V · LA FIRDARIA');
p('La firdaria reparte la vida en estaciones planetarias: setenta y cinco años entre nueve gobernantes, en orden distinto según el nacimiento sea diurno o nocturno. En carta diurna abren el Sol; en nocturna, la Luna. El orden completo de esta obra —Abu Ma\'shar y Aben Ragel— es: Sol 10, Venus 8, Mercurio 13, Luna 9, Saturno 11, Júpiter 12, Marte 7, Nodo Norte 3 y Nodo Sur 2. Dentro de cada período, cada planeta toma un subperíodo proporcional —los años del anfitrión por los del subanfitrión, entre setenta y cinco—, en el orden cíclico que arranca en el anfitrión.');
p();
p('## Las nueve estaciones');
for (const per of F.periodos) {
  p();
  p(`### El período de ${per.planeta} (${per.anos} años)`);
  for (const parrafo of per.texto) p(parrafo);
}
p();
p('## Las reglas del cálculo');
p('• Secta: carta diurna —Sol sobre el horizonte— abre con el Sol; nocturna, con la Luna. El orden de los gobernantes sigue la secuencia de cada secta.');
p('• Los nodos cierran el ciclo: tres años el Norte —el viraje que tira hacia adelante— y dos el Sur —el desapego y las cuentas del pasado—. En el segundo ciclo de setenta y cinco años, el orden de los nodos se alterna.');
p('• Los subperíodos se reparten en el orden cíclico de los siete planetas desde el anfitrión, con los nodos al final; sus años son los del anfitrión por los del subanfitrión, divididos entre setenta y cinco.');
p('• La firdaria se lee con el filtro del radical: el gobernante de la época tiñe todos los sucesos que los otros relojes —revolución, atacir, tránsito— sitúen en sus años.');

// ---------- APÉNDICES ----------
p();
p('# APÉNDICES');
p();
p('## A. Cómo se calcula cada técnica');
p('Tránsitos. La posición real de los planetas del cielo en la fecha, por efemérides de precisión (Swiss Ephemeris en la app que acompaña a esta obra), tomada como aspecto al tema natal: conjunción, sextil, cuadratura, trígono y oposición, con orbe según el planeta. Los cruces se detectan por muestreo diario y se afinan por bisección; los retrógrados forman pasos dobles y triples.');
p('Revolución solar. El instante exacto en que el Sol regresa a su longitud natal, calculado por bisección a partir del cumpleaños y para el lugar de residencia. La carta anual se lee comparada con el natal: Ascendente y Mediocielo anuales sobre las casas natales, superposiciones de casas, planetas anuales en las casas natales, con aviso de zona de transición a menos de dos grados de una cúspide.');
p('Atacir. Posición dirigida igual a posición natal más el cociente trescientos sesenta entre el reloj, por la edad exacta en años decimales. Se miden los aspectos de cada posición dirigida a los puntos natales, se ordenan por orbe y se desempatan por la fuerza del aspecto: conjunción, oposición, cuadratura, trígono, sextil.');
p('Firdaria. Reparto de setenta y cinco años entre nueve gobernantes según la secta; subperíodos proporcionales —años del anfitrión por los del subanfitrión entre setenta y cinco— en el orden cíclico desde el anfitrión, con los nodos al final.');
p();
p('## B. Fuentes clásicas');
p('La doctrina de este tomo se apoya en los maestros de la tradición: Ptolomeo, para las profecciones y el Tetrabiblos; Abu Ma\'shar, para las fardariyas y la cronología planetaria; Aben Ragel, cuyo Libro cuarto integra el hileg, el alcocoden y el atacir en el juicio del nacimiento; Abraham Zacuto, sistematizador del atacir medieval. De la escuela moderna se citan como técnicas —no como textos— la comparación natal-revolución de Alexandre Volguine, el método de tránsitos de Georges Antarès y el ciclo de sesenta años de Demetrio Santos. Todas las interpretaciones de este libro son de redacción propia.');
p();
p('## C. Glosario mínimo');
p('• Atacir (al-tasyir): dirección simbólica de un significador a velocidad constante.');
p('• Alcocoden: el dador de los años; el planeta con más dignidad en el lugar del hileg.');
p('• Almutén: el planeta con más dignidad en un lugar o asunto del tema.');
p('• Dirección primaria: dirección por el giro real de la esfera en las horas siguientes al nacimiento; distinta del atacir, que usa velocidades simbólicas.');
p('• Firdaria (fardariyas): los períodos planetarios de la vida, setenta y cinco años entre nueve gobernantes.');
p('• Hileg: el dador de vida; los cinco significadores vitales de la tradición.');
p('• Profección: la dirección por giros uniformes del zodíaco, según Ptolomeo.');
p('• Regencia: el gobierno de un planeta sobre casas, signos o asuntos del tema.');
p('• Retrogradación: el movimiento aparente hacia atrás de un planeta; produce los pasos dobles y triples de los tránsitos.');
p('• Revolución solar: la carta del retorno exacto del Sol a su lugar natal.');
p('• Superposición: la caída de una casa de la revolución sobre una casa natal.');
p('• Triple paso: el contacto de un tránsito retrógrado que toca tres veces el mismo punto.');
p();
p('## D. Aviso legal');
p('Este libro tiene fines divulgativos y educativos. La astrología tradicional es un arte de interpretación simbólica; nada de lo aquí escrito constituye diagnóstico médico, psicológico, financiero ni legal. Las decisiones importantes se toman con profesionales cualificados.');

writeFileSync('../registro/volumen4 - prospectiva.md', out.join('\n'), 'utf8');
const total = out.join('\n').length;
console.log(`OK: volumen4 - prospectiva.md (${total} caracteres, ${out.length} líneas)`);