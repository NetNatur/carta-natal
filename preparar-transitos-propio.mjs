// ============================================================
//  Regenera datos/transitos.json con textos de redacción propia.
//  Conserva las claves exactas (planeta/punto/aspecto,
//  planeta/signo, planeta/casa) leyéndolas del corpus actual:
//  el motor de la app no cambia.
//
//  Motivo (2026-08-25): los textos anteriores reproducían la
//  edición de Georges Antarès, «Tránsitos Planetarios y Destino»
//  (Ediciones Obelisco, Barcelona, 1982), obra protegida.
//  El método (direccionalidad, triple paso, aspecto natal de
//  fondo) y las significaciones clásicas no son protegibles;
//  la expresión literal sí. Este corpus expresa la misma
//  doctrina con palabras propias y atribuye la técnica.
//
//  Uso: node preparar-transitos-propio.mjs
// ============================================================
import { readFileSync, writeFileSync } from 'node:fs';

const actual = JSON.parse(readFileSync('datos/transitos.json', 'utf8'));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- Bloques base (redacción propia) ----------

// Naturaleza del planeta como factor en tránsito
const PLANETA = {
  Mercurio: 'Mercurio en tránsito acelera el trato, las gestiones, los estudios y los desplazamientos: su paso marca épocas de comunicación, papeles y movimiento, con la mente despierta y la agenda llena.',
  Venus: 'Venus en tránsito suaviza el clima: afectos, recursos, gusto y alianzas ganan peso. Su paso favorece el acercamiento y lo que une, y pone de manifiesto el estado de las relaciones y de la economía personal.',
  Marte: 'Marte en tránsito imprime energía y urgencia: acción, esfuerzo, disputas y ganas de emprender. Su paso acelera los acontecimientos y prueba el temple; lo hecho bajo su influjo deja huella rápida.',
  Júpiter: 'Júpiter en tránsito expande y protege: crecimiento, fe, suerte y horizontes. Su paso engrandece lo que toca y trae respiro; el cuidado está en la confianza excesiva y la largueza sin medida.',
  Saturno: 'Saturno en tránsito estructura y prueba: responsabilidad, límites, madurez y tiempo. Su paso hace madurar o demora; lo sembrado con paciencia bajo su influjo se consolida para largo.',
  Urano: 'Urano en tránsito altera e independiza: cambios, rupturas, inventiva y libertad. Su paso sacude lo estancado y abre vías nuevas; conviene flexibilidad y frenar la imprudencia de la prisa.',
  Neptuno: 'Neptuno en tránsito disuelve o inspira: imaginación, fe, compasión, confusión y engaño. Su paso desdibuja los límites, eleva o desorienta; conviene claridad en las cuentas y en los compromisos.',
};

// Virtud del planeta (para los textos de signo)
const VIRTUD = {
  Mercurio: 'la mente ágil y el trato fluido', Venus: 'la gracia y el sentido de la medida',
  Marte: 'la audacia y la decisión oportunas', Júpiter: 'la confianza y la expansión',
  Saturno: 'la constancia y el método', Urano: 'la inventiva y la libertad bien entendida',
  Neptuno: 'la inspiración y la compasión',
};

// Efecto del planeta según el terreno (para los textos de casa)
const EFECTO_POS = {
  Mercurio: 'agiliza gestiones y trato; todo lo que se mueve, se aprende o se firma rinde',
  Venus: 'suaviza los afectos y los recursos; lo que une o embellece prospera',
  Marte: 'imprime empuje y decisión; lo que exige esfuerzo se logra',
  Júpiter: 'expande y protege; los asuntos crecen y traen respiro',
  Saturno: 'estructura y consolida; lo hecho con método dura',
  Urano: 'sacude y renueva; lo estancado se libera',
  Neptuno: 'inspira y eleva; la intuición y la fe guían',
};
const EFECTO_NEG = {
  Mercurio: 'trae prisas, malentendidos y papeles enredados',
  Venus: 'trae excesos, dejación o líos de amor y dinero',
  Marte: 'trae disputas, prisa y desgaste',
  Júpiter: 'trae exceso de confianza, largueza o promesas incumplidas',
  Saturno: 'demora, bloquea o carga de responsabilidad',
  Urano: 'rompe sin aviso y desestabiliza lo que estaba firme',
  Neptuno: 'confunde, engaña o disuelve los límites',
};

// Qué activa cada punto natal
const PUNTO = {
  Ascendente: 'la persona y su manera de presentarse: la salud, el cuerpo y la dirección vital',
  'Medio Cielo': 'la posición y la profesión: la honra, la vocación y el lugar en el mundo',
  Sol: 'la vitalidad y el centro del ser: el propósito personal y la autoestima',
  Luna: 'las emociones, la familia y los hábitos: la casa interior y el público',
  Mercurio: 'la mente, los estudios y el trato: los papeles y los desplazamientos',
  Venus: 'los afectos, los recursos y el gusto: las alianzas y la armonía',
  Marte: 'la iniciativa y el empuje: el esfuerzo, la audacia y la pasión',
  Júpiter: 'la expansión y la fe: la suerte, los viajes y los estudios superiores',
  Saturno: 'la estructura y la madurez: los límites, la responsabilidad y el tiempo',
  Urano: 'la independencia y la originalidad: los cambios y la libertad',
  Neptuno: 'la imaginación y la espiritualidad: la compasión, la ilusión y el refugio',
  Plutón: 'la transformación y el poder: las crisis y la regeneración',
};

// Matiz del aspecto
const ASPECTO = { conjuncion: 'una conjunción con', bueno: 'un aspecto armónico con', malo: 'un aspecto tenso con' };
const EFECTO_ASPECTO = {
  conjuncion: [
    'el asunto se vuelve central y manda en la época',
    'la energía del tránsito se funde con el punto y domina la agenda',
    'el tema pasa a primer plano con toda su intensidad',
  ],
  bueno: [
    'el asunto se facilita y rinde sin esfuerzo desmedido',
    'las circunstancias acompañan y se saca partido',
    'la energía del tránsito se integra con fluidez',
  ],
  malo: [
    'el asunto se complica y exige atención',
    'las circunstancias presionan y obligan a madurar',
    'la energía del tránsito choca y pide ajuste',
  ],
};
const CIERRES = [
  'Conviene observar los asuntos de {punto} durante el paso.',
  'Es buen momento para atender conscientemente lo que señala {punto}.',
  'El efecto se concreta según el filtro del tema natal.',
];

// Tema de cada signo
const SIGNO = {
  Aries: 'la iniciativa, la independencia y la prisa',
  Tauro: 'la estabilidad, los recursos y los sentidos',
  Géminis: 'el trato, la curiosidad y el movimiento',
  Cáncer: 'la sensibilidad, el hogar y la memoria',
  Leo: 'el brillo, la autoridad y la generosidad',
  Virgo: 'el detalle, el trabajo y la salud',
  Libra: 'el equilibrio, la alianza y la estética',
  Escorpio: 'la intensidad, el secreto y la transformación',
  Sagitario: 'la expansión, la fe y el horizonte',
  Capricornio: 'la ambición, la disciplina y el logro',
  Acuario: 'la originalidad, los grupos y la libertad',
  Piscis: 'la sensibilidad, la imaginación y el refugio',
};

// Departamento de la vida de cada casa
const CASA = {
  1: 'la persona, el cuerpo y la iniciativa',
  2: 'el dinero y los recursos propios',
  3: 'el trato cercano, los estudios y los desplazamientos',
  4: 'el hogar, la familia y las raíces',
  5: 'el amor, los hijos, la creación y el juego',
  6: 'el trabajo, el servicio y la salud',
  7: 'la pareja, los contratos y los socios',
  8: 'lo ajeno, lo compartido y la transformación',
  9: 'los viajes largos, los estudios superiores y la fe',
  10: 'la profesión, la honra y la posición',
  11: 'las amistades, los proyectos y las esperanzas',
  12: 'el retiro, lo oculto y las instituciones',
};

const ROMANOS = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const MAY = (s) => s.toUpperCase();

// ---------- Generación ----------
let idxPunto = 0, idxSigno = 0, idxCasa = 0;
const entradas = actual.entradas.map((e) => {
  if (e.tipo === 'punto') {
    const { planeta, punto, aspecto } = e;
    if (!PLANETA[planeta] || !PUNTO[punto] || !ASPECTO[aspecto]) throw new Error(`Base faltante: punto ${planeta}|${punto}|${aspecto}`);
    const i = idxPunto++;
    return {
      tipo: 'punto', planeta, punto, aspecto,
      titulo: `${MAY(planeta)} ${aspecto === 'conjuncion' ? 'EN CONJUNCION CON' : aspecto === 'bueno' ? 'BIEN ASPECTADO CON' : 'MAL ASPECTADO CON'} ${MAY(punto)}`,
      texto: [
        PLANETA[planeta],
        `Cuando ${planeta} forma ${ASPECTO[aspecto]} ${punto} natal — ${PUNTO[punto]} —, ${EFECTO_ASPECTO[aspecto][i % 3]}. ${CIERRES[i % CIERRES.length].replace('{punto}', punto)}`,
      ],
    };
  }
  if (e.tipo === 'signo') {
    const { planeta, signo } = e;
    if (!PLANETA[planeta] || !SIGNO[signo]) throw new Error(`Base faltante: signo ${planeta}|${signo}`);
    const i = idxSigno++;
    return {
      tipo: 'signo', planeta, signo,
      titulo: `${MAY(planeta)} PASANDO POR ${MAY(signo)}`,
      texto: [
        `Armónico.- ${planeta} transitando por ${signo} apoya ${SIGNO[signo]}: ${VIRTUD[planeta]} encuentran ahí un cauce favorable.`,
        `Disonante.- Con el tránsito tenso, ${SIGNO[signo]} se manifiestan en exceso o se malogran: conviene moderación y no forzar las circunstancias.`,
      ],
    };
  }
  if (e.tipo === 'casa') {
    const { planeta, casa } = e;
    if (!PLANETA[planeta] || !CASA[casa]) throw new Error(`Base faltante: casa ${planeta}|${casa}`);
    const i = idxCasa++;
    return {
      tipo: 'casa', planeta, casa,
      titulo: `${MAY(planeta)} PASANDO POR CASA ${ROMANOS[casa]}`,
      texto: [
        `Armónico.- El paso de ${planeta} por la casa ${casa} favorece ${CASA[casa]}: ${EFECTO_POS[planeta]}.`,
        `Disonante.- Con mal aspecto, ${CASA[casa]} se convierten en obstáculo: ${planeta} ${EFECTO_NEG[planeta]}. Conviene prudencia en ese terreno.`,
      ],
    };
  }
  throw new Error(`Tipo desconocido: ${e.tipo}`);
});

// ---------- Salida ----------
const corpus = {
  meta: {
    titulo: 'Tránsitos planetarios — corpus de redacción propia',
    tecnica: 'Tránsitos sobre puntos natales con aspecto natal de fondo, direccionalidad y aviso de retrogradación/triple paso.',
    fuentes: 'Técnica de Georges Antarès, «Tránsitos Planetarios y Destino» (Ediciones Obelisco, Barcelona, 1982). Los TEXTOS son de redacción propia (2026-08-25) basados en las significaciones clásicas; no reproducen la edición de Obelisco (sustituyen al corpus literal anterior por motivos de derechos de autor).',
    nota: 'Las interpretaciones siguen el estilo intenso de la fuente; léelas como posibilidades, no como destino, y aplica el filtro del tema natal.',
    total: entradas.length,
  },
  entradas,
};
writeFileSync('datos/transitos.json', JSON.stringify(corpus, null, 2), 'utf8');

const conteo = {};
for (const e of entradas) conteo[e.tipo] = (conteo[e.tipo] || 0) + 1;
const vacias = entradas.filter((e) => !e.texto || !e.texto.length || e.texto.some((p) => !p.trim()));
console.log(`OK: datos/transitos.json (${entradas.length} entradas)`, JSON.stringify(conteo), '| vacías:', vacias.length);