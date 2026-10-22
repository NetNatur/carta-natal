// ============================================================
//  Preparador del corpus de firdaria → datos/firdaria.json
//  Técnica: fardarat (períodos planetarios persas/árabes).
//  Estructura del ciclo (Abu Ma'shar, Mundkhab kitab al-uluf;
//  Aben Ragel, Libro conplido L.IV — tabla de sistemas: 75 años):
//    Sol 10 · Venus 8 · Mercurio 13 · Luna 9 · Saturno 11 ·
//    Júpiter 12 · Marte 7 · Nodo Norte 3 · Nodo Sur 2  = 75
//  Secta diurna:   Sol→Venus→Mercurio→Luna→Saturno→Júpiter→Marte→NN→SN
//  Secta nocturna: Luna→Saturno→Júpiter→Marte→Sol→Venus→Mercurio→NN→SN
//  Los nodos alternan su orden en cada ciclo de 75 años.
//  Subperíodo (X dentro de Y) = añosX × añosY / 75, en el orden del
//  ciclo comenzando por el planeta anfitrión.
//  Redacción de los textos: corpus doctrinal propio (2026-08-25)
//  siguiendo las significaciones clásicas de los planetas.
//  Uso: node preparar-firdaria.mjs
// ============================================================
import { writeFileSync } from 'node:fs';

const PERIODOS = [
  {
    planeta: 'Sol', anos: 10,
    texto: [
      'Época de luz propia: el yo se hace visible. Autoridad, reconocimiento, presencia pública y la relación con el padre o las figuras de mando ocupan el centro. La vitalidad y la salud reclaman atención: lo que se siembra en estos años tiende a verse.',
      'Es tiempo de definirse: lo que se emprende bajo el Sol cobra rango o fracasa con estrépito, porque la mirada del mundo está puesta en uno. Los honores, los cargos y los proyectos personales maduran; el orgullo bien dirigido es el motor de la década.',
    ],
  },
  {
    planeta: 'Venus', anos: 8,
    texto: [
      'El año del amor y de los recursos: alianzas, matrimonio, arte, dinero y armonía toman la palabra. Lo que se pacta en esta época tiende a perdurar; lo que se descuida en lo afectivo deja huella.',
      'Favorable para la diplomacia y el arreglo de cuentas pendientes con las personas. La economía personal y el gusto por la vida buena crecen; el exceso de comodidad y la dejación son las trampas de la época.',
    ],
  },
  {
    planeta: 'Mercurio', anos: 13,
    texto: [
      'Los años de la mente y del trato: estudios, escritos, comercio, viajes cortos, hermanos, vecinos y contactos. El ingenio rinde y la palabra abre puertas; se aprende y se enseña.',
      'Buen momento para firmar, publicar, examinar y mover asuntos menudos que luego pesan. La dispersión y la prisa son el riesgo: conviene acabar lo empezado antes de abrir nuevos frentes.',
    ],
  },
  {
    planeta: 'Luna', anos: 9,
    texto: [
      'Tiempo de raíces: hogar, familia, afectos, hábitos y público. La vida doméstica pesa y el ánimo oscila con las circunstancias; la salud y el descanso piden cuidado.',
      'Cambios y vaivenes marcan la época: mudanzas, altibajos de la fortuna menuda y de la salud, sensibilidad a flor de piel. Atender lo doméstico y lo nutritivo es la mejor inversión de estos años.',
    ],
  },
  {
    planeta: 'Saturno', anos: 11,
    texto: [
      'Los años de la prueba y de la obra: madurez, límites, responsabilidad, maestros, y la vejez o enfermedad de los padres. Se cosecha lo sembrado y se paga lo aplazado; los huesos y lo crónico piden respeto.',
      'Quien trabaja con paciencia edifica para largo; quien esquiva, tropieza. Es época de estructura —casa, oficio, cuerpo— y de aprender de la autoridad o de las figuras que ponen freno.',
    ],
  },
  {
    planeta: 'Júpiter', anos: 12,
    texto: [
      'Época de crecimiento: beneficio, éxito social, estudios superiores, fe, justicia y viajes largos. Crece lo que se extiende: negocios, prestigio, horizontes, y también la familia.',
      'La suerte acompaña a quien se arriesga con medida; el exceso de confianza y la largueza sin cálculo son la trampa. Buen momento para pedir, publicar, enseñar y ampliar el círculo.',
    ],
  },
  {
    planeta: 'Marte', anos: 7,
    texto: [
      'Los años del empuje: acción, esfuerzo, trabajo físico, competencia y, a veces, cirugía o accidentes. Se gana por audacia y se pierde por precipitación; la fuerza del impulso manda.',
      'Tiempo de defender lo propio y de emprender con temple. Cuidar lo que requiere sangre fría —herramientas, fuego, prisa— y no gastar la pólvora en salvas.',
    ],
  },
  {
    planeta: 'Nodo Norte', anos: 3,
    texto: [
      'Viraje de destino: personas y asuntos que entran en la vida y tiran hacia adelante; encuentros que marcan dirección. Lo que empuja el mundo suele ser lo correcto, aunque incomode.',
      'Años de apertura a lo nuevo y de dejar de lado lo que estorba el camino. Las puertas que se abren ahora no se abren dos veces; atender las señales.',
    ],
  },
  {
    planeta: 'Nodo Sur', anos: 2,
    texto: [
      'Tiempo de desapego: lo que se retira, se disuelve o se deja atrás; lecciones del pasado que reclaman saldo. Años de limpieza más que de conquista.',
      'Perder a tiempo es ganar: cortar amarras, saldar cuentas, soltar hábitos. Lo que queda al final de la época es lo que de verdad sostiene.',
    ],
  },
];

writeFileSync(
  'datos/firdaria.json',
  JSON.stringify({
    meta: {
      tecnica: 'Firdaria (fardarat) — períodos planetarios persas/árabes de la cronología',
      fuentes: 'Abu Ma\'shar, Mundkhab kitab al-uluf (fardariyas y tablas); Aben Ragel, Libro conplido en los iudizios de las estrellas, L.IV (tabla de sistemas de cronología: fardarat 75 años); significaciones clásicas de los planetas.',
      estructura: 'Ciclo de 75 años: Sol 10, Venus 8, Mercurio 13, Luna 9, Saturno 11, Júpiter 12, Marte 7, Nodo Norte 3, Nodo Sur 2. Diurna: Sol→Venus→Mercurio→Luna→Saturno→Júpiter→Marte→NN→SN. Nocturna: Luna→Saturno→Júpiter→Marte→Sol→Venus→Mercurio→NN→SN. Los nodos alternan su orden en cada ciclo. Subperíodo X dentro de Y: añosX × añosY / 75, en el orden del ciclo desde el anfitrión.',
      redaccion: 'Corpus doctrinal redactado por el agente (2026-08-25) siguiendo las significaciones clásicas; la estructura del cálculo es la de la tradición (Abu Ma\'shar / Aben Ragel).',
    },
    periodos: PERIODOS,
  }, null, 2),
  'utf8',
);
console.log(`OK: datos/firdaria.json (${PERIODOS.length} períodos, total ${PERIODOS.reduce((s, p) => s + p.anos, 0)} años)`);