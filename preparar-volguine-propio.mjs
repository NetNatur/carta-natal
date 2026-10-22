// ============================================================
//  Regenera datos/volguine.json con textos de redacción propia.
//  Conserva la ESTRUCTURA y las claves del corpus (el motor de
//  la app no cambia), pero sustituye los párrafos extraídos de
//  la traducción de Ed. Kier por redacción doctrinal original,
//  siguiendo la técnica de comparación natal↔RS de Volguine.
//
//  Motivo (2026-08-25): los textos anteriores reproducían la
//  traducción española (© Editorial Kier, traductor Boris
//  Cristoff; obras de Volguine protegidas — España hasta 2056).
//  El método y las significaciones clásicas no son protegibles;
//  la expresión literal sí. Este corpus expresa la misma
//  doctrina con palabras propias.
//
//  Uso: node preparar-volguine-propio.mjs
// ============================================================
import { writeFileSync } from 'node:fs';

// ---------- Bloques base (redacción propia) ----------

// La casa como TERRENO dentro de la carta natal
const CASA_NATAL = {
  1: 'la persona, el cuerpo y la iniciativa: el modo de presentarse al mundo y las decisiones que comprometen el rumbo propio',
  2: 'los recursos, el dinero y los valores: lo que se posee, lo que se valora y la seguridad material',
  3: 'el trato cotidiano: hermanos, vecinos, estudios, escritos, gestiones y desplazamientos cortos',
  4: 'el hogar, la familia y las raíces: la vida privada, la figura del padre o del jefe de la casa, y el final de los asuntos',
  5: 'el amor, los hijos, la creación y el juego: los placeres, el riesgo y aquello que se hace por gusto',
  6: 'el trabajo, el servicio y la salud: las rutinas, los subordinados y el cuidado del cuerpo',
  7: 'la pareja, las alianzas y los contratos: los socios y el terreno de lo abiertamente opuesto',
  8: 'lo ajeno y lo compartido: herencias, deudas, crisis y transformaciones profundas',
  9: 'los viajes largos, los estudios superiores, la fe, la justicia y todo lo que ensancha el horizonte',
  10: 'la profesión, la honra y la posición: la vocación, la autoridad y la proyección pública',
  11: 'las amistades, los proyectos y las esperanzas: los grupos, las redes y los aliados del futuro',
  12: 'la interioridad y lo oculto: el retiro, los hospitales, los enemigos velados y la disolución de lo que sobra',
};

// La casa anual: QUÉ PONE EN MARCHA cada casa de la revolución
const CASA_ANUAL = {
  2: 'los asuntos del dinero y de lo propio: lo que se gana, se administra y se valora durante el año',
  3: 'las comunicaciones y el movimiento: estudios breves, documentos, trato cercano y desplazamientos',
  4: 'la vida de hogar y familia: las bases, lo privado y el cierre de ciclos',
  5: 'el amor, los hijos, la creación y el riesgo: los placeres y lo que se emprende por gusto',
  6: 'el trabajo, el servicio y la salud: las ocupaciones diarias y el cuidado del cuerpo',
  7: 'la pareja y las alianzas: contratos, socios y el trato con los demás como espejo',
  8: 'las finanzas compartidas y las crisis: herencias, deudas, transformaciones y lo que se renueva en profundidad',
  9: 'los viajes, los estudios superiores, la fe y los asuntos lejanos: el horizonte del año',
  10: 'la posición y la profesión: la honra, la vocación y el lugar que se ocupa en el mundo',
  11: 'las amistades, los proyectos y las redes: las esperanzas y los apoyos del año',
  12: 'la interioridad y lo retirado: el descanso, los secretos, las instituciones y la limpieza interna',
};

// La naturaleza del planeta como factor del año
const PLANETA = {
  Sol: 'El Sol activa la vitalidad, la voluntad y el deseo de reconocimiento: las iniciativas personales piden luz y protagonismo.',
  Luna: 'La Luna trae movimiento y sensibilidad: los estados de ánimo, la familia, el público y los hábitos dominan el ritmo del año.',
  Mercurio: 'Mercurio anima el trato, el estudio y la gestión: documentos, conversaciones, viajes cortos y todo lo que requiere ingenio.',
  Venus: 'Venus favorece los afectos, las alianzas y los recursos: la armonía, el arte, el dinero y el trato amable ganan peso.',
  Marte: 'Marte impone acción y esfuerzo: la audacia rinde, pero la prisa, las disputas y el desgaste exigen temple.',
  Júpiter: 'Júpiter expande y protege: el éxito, la fe, los viajes y el beneficio crecen con la confianza y la medida.',
  Saturno: 'Saturno estructura y prueba: la responsabilidad, la paciencia y el trabajo bien hecho sostienen el año, mientras los límites enseñan.',
  Urano: 'Urano altera e independiza: los cambios bruscos, la inventiva y la libertad rompen lo estancado.',
  Neptuno: 'Neptuno disuelve o inspira: la imaginación, la compasión y la fe se avivan, y conviene vigilar la confusión y el engaño.',
  Plutón: 'Plutón transforma en profundidad: las crisis regeneran, el poder se mueve y lo caduco cae para dejar sitio a lo nuevo.',
};

// El clima del año según el signo del Ascendente de la revolución
const ASC_SIGNO = {
  Aries: 'el año pide empuje e independencia: se comienza con decisión, aunque conviene vigilar la impaciencia y el riesgo innecesario',
  Tauro: 'el año pide estabilidad y constancia: lo que se construye despacio se sostiene, y la comodidad bien usada no es pereza',
  Géminis: 'el año pide movimiento, curiosidad y trato: abundan las noticias, los encuentros y los cambios de planes',
  Cáncer: 'el año pide sensibilidad y arraigo: el hogar, la familia y la memoria pesan, y el ánimo va a oleadas',
  Leo: 'el año pide brillo y generosidad: el orgullo bien dirigido, la autoridad y la visibilidad marcan el ritmo',
  Virgo: 'el año pide orden y atención al detalle: el trabajo fino, la salud y el análisis rinden más que la improvisación',
  Libra: 'el año pide equilibrio y alianza: la estética, la justicia y la negociación suavizan lo que divide',
  Escorpio: 'el año pide profundidad y control: las intensidades, los secretos y las crisis bien llevadas regeneran',
  Sagitario: 'el año pide expansión y horizonte: viajes, estudios, fe y exceso de confianza conviven en la misma balanza',
  Capricornio: 'el año pide ambición con método: la disciplina, la prudencia y el logro a largo plazo son la divisa',
  Acuario: 'el año pide originalidad y causas: los grupos, la independencia y el cambio razonado se abren paso',
  Piscis: 'el año pide sensibilidad y compasión: la imaginación y la fe rinden, y conviene no disolverse en lo vago',
};

// ---------- Textos largos: ASC anual en cada casa natal (redacción propia) ----------
const ASC_CASA = {
  1: 'El año vuelve sobre la persona misma: salud, cuerpo, presencia e iniciativa. Hay libertad de movimiento y de decisión, y los asuntos personales pasan a primer plano. Es un buen año para definir dirección propia, presentarse y emprender; el cuidado irá en no gastar la energía en puro impulso.',
  2: 'El año gira sobre los recursos y los valores propios: dinero, posesiones y autoestima material. Las oportunidades de estabilizar la economía aparecen, y también la tentación de gastar por apariencia. Lo que se administre con orden ahora, sostiene lo demás; conviene no confundir valor personal con patrimonio.',
  3: 'Un año de trato, estudio y movimiento: comunicaciones, escritos, gestiones, hermanos y vecinos ocupan la escena. La agenda se llena de reuniones y desplazamientos cortos. La mente está ágil y receptiva; el riesgo es la dispersión, así que conviene anotar y cerrar lo empezado.',
  4: 'El año lleva la atención al hogar, la familia y las raíces: la vida privada, los bienes inmuebles y la figura del padre o del paterno. Puede haber mudanzas, cierres de ciclo o asuntos hereditarios. Es buen momento para asegurar las bases; la vida pública queda en segundo plano.',
  5: 'El año se abre al amor, los hijos, la creación y el placer: el corazón manda y el riesgo seduce. Los asuntos sentimentales y los proyectos creativos piden protagonismo. Hay generosidad y ganas de disfrutar; el cuidado está en los excesos y en las apuestas apresuradas.',
  6: 'El año se ordena en torno al trabajo, el servicio y la salud: empleo, rutinas, subordinados y el cuidado del cuerpo. Los asuntos se resuelven con método y constancia más que con brillo. Atender la salud y el descanso es la mejor inversión del año.',
  7: 'El año pasa por el espejo de los otros: pareja, alianzas, contratos y socios. Las relaciones se activan y exigen equilibrio; lo que se pacta ahora condiciona los años siguientes. La negociación y la cortesía abren puertas que la imposición cierra.',
  8: 'El año entra en zona de transformación: recursos compartidos, herencias, deudas, crisis y renacimientos. Lo que estaba oculto o aplazado sale a la luz para reordenarse. Las pérdidas aparentes suelen ser limpieza; lo que se renueva en profundidad queda saneado.',
  9: 'El año ensancha el horizonte: viajes largos, estudios superiores, fe, justicia y asuntos extranjeros. La mirada se eleva y las preguntas de sentido ocupan la escena. Hay protección en lo lejano y en lo aprendido; conviene no prometer más de lo que se puede cumplir.',
  10: 'El año pone a prueba la posición: profesión, honra, vocación y lugar en el mundo. El trabajo y la reputación son visibles, y el esfuerzo rinde a la vista. Es un año de responsabilidad pública: se asciende por obra demostrada y se cae por imprudencia.',
  11: 'El año se apoya en las amistades y los proyectos: redes, grupos, esperanzas y aliados del futuro. Las personas que llegan abren puertas y las que se van liberan espacio. Es momento de sembrar contactos y de trabajar en equipo; los ideales piden que se les dé forma práctica.',
  12: 'El año pide repliegue y limpieza: interioridad, retiro, instituciones, secretos y enemigos velados. Las energías se vuelven hacia adentro y conviene resolver lo pendiente lejos del ruido. Lo que se guarda o se suelta en silencio ahora, pesa menos después.',
};

// MC anual en cada casa natal
const MC_CASA = {
  1: 'El Mediocielo anual sobre la casa 1 natal es de los mejores emplazamientos: la voluntad y la presencia personal se alinean con el destino. El sujeto puede obrar sobre su propia vida con ventaja y dar dirección a los acontecimientos. Año de iniciativa con respaldo.',
  2: 'El Mediocielo en la casa 2 natal favorablemente aspectado inclina el año hacia la ganancia y la buena gestión de lo propio. Los recursos y el trabajo se conectan: el esfuerzo tiene salida económica. Conviene ordenar presupuestos y cobros.',
  3: 'El Mediocielo en la casa 3 natal enlaza la posición con el trato y el saber: escritos, gestiones, estudios y viajes cortos favorecen la carrera. Los hermanos o allegados participan en los asuntos de peso. Año propicio para dar a conocer el trabajo de palabra y por escrito.',
  4: 'El Mediocielo en la casa 4 natal lleva la cuestión al terreno de las raíces: hogar, familia, bienes inmuebles y asuntos del padre. La posición se apoya en la vida privada o en el patrimonio familiar. Buen momento para consolidar lo doméstico y lo inmobiliario.',
  5: 'El Mediocielo en la casa 5 natal favorece el reconocimiento por la vía del gusto y la creación: hijos, amor, arte y empresas personales ganan visibilidad. Es un buen año para mostrar lo que se hace con pasión; el riesgo calculado tiene premio.',
  6: 'El Mediocielo en la casa 6 natal asocia la posición al trabajo y al servicio: la carrera avanza por la vía del esfuerzo ordenado y la utilidad. El cuidado de la salud y de los colaboradores condiciona el rendimiento. Año de méritos discretos que se anotan.',
  7: 'El Mediocielo en la casa 7 natal sitúa el año bajo el signo de las alianzas: pareja, socios, contratos y acuerdos públicos. La posición mejora a través de otros y de lo que se pacta. La elección de con quién se une define el rumbo.',
  8: 'El Mediocielo en la casa 8 natal atraviesa la posición por la crisis y lo compartido: herencias, deudas, fondos ajenos y transformaciones. Hay ascensos o caídas profundas según se gestionen los recursos de otros y los propios. Año de reorganización radical.',
  9: 'El Mediocielo en la casa 9 natal enlaza el destino con lo lejano: estudios superiores, viajes, religión, justicia y asuntos extranjeros. La reputación crece por la vía del conocimiento y del horizonte amplio. Buen año para publicar, enseñar o tratar con el extranjero.',
  10: 'El Mediocielo en su casa natal redobla el acento profesional: el año gira en torno a la vocación, la honra y el lugar propio en el mundo. Hay visibilidad y responsabilidad; el esfuerzo se mide en público. Año de confirmación o de examen del rumbo.',
  11: 'El Mediocielo en la casa 11 natal conecta la posición con las redes y los ideales: amistades, grupos, proyectos y protección de personas influyentes. Los apoyos llegan por el trato y la participación. Buen año para alianzas de futuro y para dar forma a las esperanzas.',
  12: 'El Mediocielo en la casa 12 natal es emplazamiento complejo: la carrera se cuece entre bastidores y topa con instituciones, secretos o enemigos velados. Conviene discreción, trámites con cuidado y resolver lo pendiente sin ruido. El reconocimiento llega con retraso, pero llega si la obra es sólida.',
};

// ---------- Composición ----------
const entradas = [];

// asc-casa-natal (12)
for (let casa = 1; casa <= 12; casa++) {
  entradas.push({ tipo: 'asc-casa-natal', casa, texto: [`Ascendente de la revolución en la casa ${casa} natal: ${ASC_CASA[casa]}`] });
}

// mc-casa-natal (12)
for (let casa = 1; casa <= 12; casa++) {
  entradas.push({ tipo: 'mc-casa-natal', casa, texto: [`Mediocielo de la revolución en la casa ${casa} natal: ${MC_CASA[casa]}`] });
}

// asc-signo (12)
for (const [signo, clima] of Object.entries(ASC_SIGNO)) {
  entradas.push({
    tipo: 'asc-signo', signo,
    texto: [`Con el Ascendente de la revolución en ${signo}, ${clima}. El signo matiza el clima general del año y la manera de encararlo: conviene aprovechar sus fuerzas y vigilar sus excesos.`],
  });
}

// superposicion (114): casa anual sobre casa natal.
// Mismas claves que el corpus original: se omiten las casas anuales 1 y 10
// (son el ASC y el MC anuales, ya tratados en sus secciones) y 6
// combinaciones que el original no recoge.
const EXCLUIDAS_SUP = new Set(['2/6', '3/6', '4/2', '5/9', '7/2', '8/6']);
const CIERRES_SUP = [
  'Conviene seguir de cerca los asuntos de la casa natal durante el tiempo en que esta casa anual está activa.',
  'Es buen momento para atender lo señalado por la casa natal: lo que se haga ahí ahora deja huella en el año.',
  'Las cuestiones de la casa natal demandan atención: la casa anual las pone en movimiento.',
  'El año invita a trabajar conscientemente el terreno de la casa natal indicado.',
];
const APERTURAS_SUP = [
  'La casa {A} de la revolución se superpone a la casa {N} natal:',
  'Con la casa anual {A} cayendo sobre la casa {N} natal,',
  'La superposición de la casa {A} de la revolución sobre la casa natal {N} significa que',
];
for (let anual = 2; anual <= 12; anual++) {
  if (anual === 10) continue; // la casa 10 anual es el MC, ya tratado
  for (let natal = 1; natal <= 12; natal++) {
    if (EXCLUIDAS_SUP.has(`${anual}/${natal}`)) continue;
    const i = (anual - 2) * 12 + (natal - 1);
    const apertura = APERTURAS_SUP[i % APERTURAS_SUP.length].replace('{A}', anual).replace('{N}', natal);
    const cierre = CIERRES_SUP[i % CIERRES_SUP.length];
    entradas.push({
      tipo: 'superposicion', anual, natal,
      texto: [
        `${apertura} el año pone en marcha ${CASA_ANUAL[anual]}.`,
        `El terreno donde se manifiesta es ${CASA_NATAL[natal]}. ${cierre}`,
      ],
    });
  }
}

// planeta-casa (120): planeta de la RS en las casas de la revolución
for (const [planeta, naturaleza] of Object.entries(PLANETA)) {
  for (let casa = 1; casa <= 12; casa++) {
    entradas.push({
      tipo: 'planeta-casa', planeta, casa,
      texto: [
        `${naturaleza}`,
        `Cae en la casa ${casa} de la revolución (${CASA_ANUAL[casa] || 'la persona y la iniciativa, término del Ascendente'}): el planeta se expresa a través de estos asuntos y les imprime su carácter.`,
      ],
    });
  }
}

// ---------- Salida ----------
const corpus = {
  meta: {
    titulo: 'Volguine — técnica de las revoluciones solares (corpus de redacción propia)',
    tecnica: 'Comparación natal↔revolución solar: ASC/MC anuales en las casas natales, superposiciones de casas, ASC por signo y planetas de la RS por casas.',
    fuentes: 'Técnica de Alexandre Volguine, "La technique des révolutions solaires" (Dervy-Livres; trad. esp. Editorial Kier). Los TEXTOS son de redacción propia (2026-08-25) basados en las significaciones clásicas; no reproducen la traducción de Kier (sustituyen al corpus literal anterior por motivos de derechos de autor).',
    total: entradas.length,
  },
  entradas,
};
writeFileSync('datos/volguine.json', JSON.stringify(corpus, null, 2), 'utf8');

const conteo = {};
for (const e of entradas) conteo[e.tipo] = (conteo[e.tipo] || 0) + 1;
const esperado = { 'asc-casa-natal': 12, 'mc-casa-natal': 12, 'asc-signo': 12, superposicion: 114, 'planeta-casa': 120 };
const vacias = entradas.filter((e) => !e.texto || !e.texto.length || e.texto.some((p) => !p.trim()));
const ok = JSON.stringify(conteo) === JSON.stringify(esperado) && vacias.length === 0;
console.log(`OK: datos/volguine.json (${entradas.length} entradas)`, JSON.stringify(conteo), '| vacías:', vacias.length, '| claves esperadas:', ok ? 'SÍ' : 'NO');
if (!ok) process.exit(1);