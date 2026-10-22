// ============================================================
//  Regenera datos/revolucion-solar.json con textos de redacción propia.
//  Conserva la ESTRUCTURA y las CLAVES del corpus (tipo + casa/signo/clave:
//  el motor de la app no cambia), pero sustituye los textos recopilados de
//  la obra de Tito Maciá por redacción doctrinal original.
//
//  Motivo (2026-10-12): los textos anteriores eran recopilación literal
//  (OCR) de «La Revolución Solar y sus Atacires» y «Revolución Solar —
//  Cómo Trabajarla». El método y las significaciones clásicas no son
//  protegibles; la expresión literal sí. Este corpus expresa la misma
//  doctrina con palabras propias.
//
//  Uso: node preparar-revolucion-solar-propio.mjs
// ============================================================
import { writeFileSync } from 'node:fs';

const P = {};

// ============ part01 · asc-casa-natal (12) + mc-casa-natal (12) ============
// Redacción propia (12-oct-2026): misma doctrina, expresión original.
P.ASC_CASA = {
  1: [
    'El Ascendente del año cae sobre la primera casa natal: una posición que se repite aproximadamente cada treinta y tres años, la vuelta completa del ciclo, y que marca un año singular de mayor libertad para organizar la propia vida. El papel personal se renueva y facilita el desarrollo social; para muchos será el año de mudarse, de planear la casa propia o de poner en marcha el negocio personal.',
    'Es el año de ser más uno mismo: se sueltan los patrones de conducta heredados que estorbaban y los horarios se reajustan al ritmo de vida de cada cual.',
  ],
  2: [
    'Con el Ascendente sobre la casa II natal se esperan cambios de hábitos en lo económico o en la alimentación, y una revisión del modo de ganarse la vida. Se adoptan conductas nuevas para mejorar la economía o para hacer compras de cierta importancia; es una época en la que uno tiende a medir su valer por lo que posee: bienes materiales, lazos afectivos, información o ideas.',
    'Si el Ascendente recibe buenos aspectos: nuevo papel laboral, mejores ingresos o inversiones acertadas. Con aspectos duros: el esfuerzo por ganar dinero se redobla para sostener a los hijos, el negocio o el propio ocio.',
  ],
  3: [
    'Superpuesto a la casa III natal, el Ascendente anuncia un año de mucho trasiego: viajes continuos, rutas que cambian, fines de semana en otros sitios. Por dentro, regresa el apetito de aprender y una mentalidad renovada; llegarán personas nuevas que con el tiempo serán compañeros o colegas.',
    'Lo habitual es arrancar estudios, cambiar de trabajo o de centro, o rodar más kilómetros por caminos nuevos. Para algunos, dormitorio nuevo; para otros, coche nuevo; para otros, una relación sentimental libre; y para unos pocos, las tres cosas.',
  ],
  4: [
    'Año de cambio de residencia, de vivienda o de modificaciones profundas en el hogar o en el negocio personal. Es una época de esfuerzo para sacar adelante proyectos de envergadura; algo se mueve en el seno de la familia y obliga a tomar decisiones que condicionarán los bienes raíces.',
    'Con buenos aspectos: una casa que llega de la familia —heredada, donada o con ayuda— o una buena hipoteca para financiar la vivienda o el negocio. Con cuadraturas u oposiciones: dificultades para entenderse con la familia, la pareja, los socios o los superiores, con tensiones que consumen energía de más.',
  ],
  5: [
    'El Ascendente en la quinta casa natal trae cambios de hábitos y de horarios causados por los hijos —colegios, juegos, comidas—, si los hay. Para otros, experiencias íntimas nuevas que obligan a variar pautas y horarios para verse en privado. Y para otros, formas nuevas de invertir, sembrar, crear o especular.',
    'En general cambian las actitudes hacia los hijos y las amistades íntimas; en los mayores, hacia los nietos. Es, además, un año de aficiones renovadas.',
  ],
  6: [
    'Con el Ascendente sobre la casa VI natal se esperan cambios de hábitos y de horarios laborales; en el trabajo puede haber cierta inestabilidad que exige ajustes. Para los jóvenes, puede ser el año del primer empleo.',
    'Buenos aspectos: éxito laboral, reconocimiento o mejores ingresos por el trabajo. Malos aspectos: horarios impuestos, dificultades de adaptación o roces que hacen cuesta arriba la vida laboral. Para algunos será cambiar de indumentaria o de uniforme; para otros, nuevos hábitos por un cambio de trabajo o por la llegada de un animal doméstico.',
  ],
  7: [
    'Situado sobre la séptima casa natal, el Ascendente trae cambios de horarios, de rol o de costumbres a causa de la pareja, las asociaciones o las alianzas: para cumplir los objetivos propios se necesita la ayuda o el complemento de otras personas. Año de reajustes con los protagonistas de esa casa y, en ocasiones, de volver a elegir con quién convivir: nuevos acuerdos, nuevas parejas.',
    'Crece el interés por la vida pública y social, con mayor participación política o asociativa. Las vivencias de esta época dependen, en gran medida, del tipo de aspectos que forme el Ascendente.',
  ],
  8: [
    'Superpuesto a la casa VIII natal, el Ascendente modifica las ambiciones y gira hacia lo que aporta más tranquilidad; puede haber una renuncia o una venta importante. Desde fuera se perciben cambios en los bienes compartidos —pareja, socio, familia—: costumbres que cambian por los ingresos del cónyuge o del socio, al alza o a la baja según los aspectos, pero con la presencia notoria del otro.',
    'Con buenos aspectos y planetas en la casa IV, es tiempo de comprar una segunda vivienda o de cambiar hábitos al disponer de un lugar distinto donde refugiarse o pasar las vacaciones.',
  ],
  9: [
    'El Ascendente sobre la novena casa natal señala un año de expansión y de búsqueda de metas nuevas: cambia la manera de percibir el mundo, unas veces por viajes y otras por relaciones sociales o culturales nuevas. Para muchos es tiempo de cambios en el lugar de trabajo —más que de viajes—, con relevo de personas o reformas y transformaciones del local.',
    'También pueden variar las metas de la vida, con cambios de carrera o de papel social que coinciden con el final de unos estudios, la vuelta de un viaje o la culminación de ciertas experiencias. Es el año de mostrar lo aprendido —las maestrías— y de contar los viajes.',
  ],
  10: [
    'Con el Ascendente sobre la casa X natal se sale más a escena: más vida pública, profesional o social, y mayor notoriedad en el propio medio. Es época de cambiar de imagen social; la dirección del cambio —mejora o desgaste— depende de los planetas situados en la décima casa y de los aspectos del Ascendente con el Sol y los demás planetas.',
    'Los buenos aspectos de los benéficos apuntalan la posición social; los aspectos duros de los infortunas, la erosionan. En todo caso, un año de mayor visibilidad.',
  ],
  11: [
    'El Ascendente sobre la casa XI suele marcar un viaje colectivo —con un grupo de gente, a un lugar lejano— o algo semejante, y abre la puerta a amistades nuevas. Las circunstancias sociales o profesionales llevan a cambiar hábitos por los amigos y a tratar con compañeros nuevos. Para los profesionales suele ser la aparición de clientes nuevos y de perspectivas nuevas, con esperanzas que cuajarán o no según los planetas y aspectos activos.',
    'Es un año en el que se ve el valor real de la amistad: durante algún tiempo se puede depender de los amigos, de los clientes amigos o de los clientes fieles.',
  ],
  12: [
    'Con el Ascendente sobre la casa XII natal cambian los hábitos íntimos y los horarios de dormir y levantarse. Suele ser un año de cierto retraimiento social, con menos libertad de movimientos. La vida íntima y personal se transforma, y a veces hay que mantener esos cambios en secreto.',
    'Son corrientes las visitas a hospitales o casas de reposo por algún familiar ingresado, las actividades discretas —espirituales o idealistas— con un grupo pequeño, los papeles reservados y los vínculos que se guardan en la sombra. Con malos aspectos de planetas dañinos conviene vigilar la salud: pueden aparecer enfermedades que obliguen a hospitalización.',
  ],
};
P.MC_CASA = {
  1: [
    'El Mediocielo de la revolución sobre la casa I natal señala cambios sociales o profesionales de gran importancia: gracias a las propias habilidades se puede dar un giro notable a la vida social o profesional. Para muchos es el año de estrenar una etapa —nuevo empleo, nuevo trabajo, nueva residencia—, con una transformación social muy marcada.',
    'Toca ajustar la vida social a las capacidades personales, intervenir con más influencia en el propio medio y cosechar reconocimiento por lo que uno es y por lo que sabe hacer. Un año en el que resultamos socialmente más atractivos y con más demanda social o profesional.',
  ],
  2: [
    'Si el Mediocielo se sitúa en la casa II natal, el año tiende a la estabilización económica: hay que mostrar públicamente las aptitudes para adquirir ganancias o administrar los medios disponibles. De un modo u otro, se destaca social o profesionalmente por los asuntos económicos, con su dosis de esfuerzo y de reflexión, porque la rutina de ganar dinero se impone.',
    'Puede llegar reconocimiento por la capacidad de obtener dinero, de invertir en negocios nuevos o en actividades sociales nuevas. Es año de alguna adquisición importante: un local, una vivienda, o un puesto profesional fijo que traiga seguridad. Se ensayan nuevas formas de invertir o de tentar la suerte económica.',
  ],
  3: [
    'Con el Mediocielo sobre la casa III natal, las influencias sociales o profesionales empujan hacia el movimiento y la información: un año social o profesionalmente nómada, sin domicilio fijo. Surgen impulsos que llevan a buscar conocimientos nuevos, a informarse de alguna materia que exija el potencial intelectual propio.',
    'Las tendencias expansivas se canalizan por la palabra y la escritura: conversaciones, coloquios, conferencias, cursillos, y adaptación a las nuevas formas de comunicar. La reputación se juega en el trabajo que se hace: es el año de la autopromoción.',
  ],
  4: [
    'Cuando el Mediocielo se superpone a la casa IV natal, lo más probable es un cambio de residencia, un local nuevo para lo profesional o un giro importante en la vida social; además, se hace visible la posición social heredada de los progenitores.',
    'Entran en juego los bienes raíces, las propiedades, el patrimonio, la vivienda y, para algunos, el negocio familiar. Nace un patrón nuevo de vida en el hogar o en la profesión, a veces por la pareja o por terceras personas; puede tocar reajustar la convivencia, con cambios de hábitos y costumbres. La vida pública, social o profesional, exige más participación.',
  ],
  5: [
    'Si el Mediocielo cae sobre la casa V natal, el año rebosa actividad creadora. Para quien tiene hijos, ellos ganan importancia social: puede ser una boda, una emancipación o el arranque profesional de los hijos. Para otros, creaciones de todo tipo con eco social o profesional: terminar una obra, cerrar un trabajo, o la llegada de hijos, nietos, alumnos o amistades íntimas nuevas que renuevan la imagen pública.',
    'Las relaciones íntimas o sentimentales también pueden dar un giro: lo que se fija y se consolida este año deja una huella profunda.',
  ],
  6: [
    'Superpuesto a la casa VI natal, el Mediocielo trae transformaciones importantes en la vida laboral y profesional: cambiar de empresa, de trabajo o de etapa, creando los motivos del cambio y concretando situaciones nuevas, a costa de una pérdida de libertad por los horarios nuevos. El año refleja lo que cada uno es capaz de dar de sí, la cantidad y calidad del aporte personal al colectivo: la capacidad de servicio.',
    'De un modo u otro, toca sentirse exigido y aceptar obligaciones nuevas con sus límites a la libertad personal; en cierta medida, se es cautivo de la propia profesión o de las actividades sociales. Aparecen proveedores o encargos remunerados nuevos.',
  ],
  7: [
    'Con el Mediocielo sobre la casa VII natal, la vida social o profesional se exterioriza y expande: más reuniones, más trato con otros, más habilidades sociales en juego y capacidad de colaborar de forma estable. También es tiempo de competir: aparecen los rivales, quienes se oponen a nuestros planes.',
    'Con los demás se abren siempre dos caminos: los arreglos, pactos y ajustes, o la confrontación abierta. Por otra parte, es un año de actividades públicas en las que se representa a otros: un grupo, una asociación, una colectividad.',
  ],
  8: [
    'El Mediocielo sobre la casa VIII natal pide una renuncia para progresar social o profesionalmente: un cargo, una relación o una comodidad se dejan atrás. A lo largo del año se transforman a fondo las ambiciones y conviene rebajar las metas hasta hacerlas alcanzables; los límites surgen con claridad y, para algunos, será el año de rendirse ante lo que era demasiado difícil de sostener en solitario.',
    'Los beneficios sociales o profesionales llegan, eso sí, gracias a la pareja, los socios o quienes colaboran habitualmente con nosotros.',
  ],
  9: [
    'Si el Mediocielo se superpone a la casa IX, el año invita a reflexionar sobre la vida social y las metas profesionales y a plantearse objetivos nuevos. Muchos se marcan fines espirituales, filosóficos o intelectuales y se alejan de la empresa pública o del trabajo ordinario para atender sus ideales más altos.',
    'Otros vivirán experiencias en lugares alejados, países extranjeros o sitios desconocidos, y tratarán con gentes de esos lugares, con los desplazamientos que ello conlleva. Suelen verse cambios importantes en el centro de trabajo —a veces dejar el empleo—; con suerte, es tiempo de disfrutar de un año sabático.',
  ],
  10: [
    'Cuando el Mediocielo se superpone a su casa natal X, hay cambio de metas sociales o profesionales: probar una ocupación nueva, ejercer otro oficio, emprender un negocio o iniciar una actividad distinta. Los cambios más importantes giran alrededor del medio social propio: la familia y el grupo al que se pertenece.',
    'Es un tiempo en el que puede apreciarse el mérito propio y quizá varie la opinión que los demás tienen de nosotros. Se ven las posibilidades de destacar y de alcanzar cargos honoríficos o de autoridad, al tiempo que se pone de relieve el peso que la autoridad —quienes mandan sobre nosotros— tiene para cada cual.',
  ],
  11: [
    'Con el Mediocielo sobre la casa XI natal, el año trae éxito profesional, esperanzas cumplidas o premios: la sensación de sentirse compensado socialmente por la profesión, el cargo o el logro alcanzado. Es, en cierta medida, un año premiado socialmente, de expansión de la personalidad social y de consecución de aspiraciones.',
    'Las influencias sobre los demás se perciben de forma más abierta y la satisfacción llega por vías como los viajes colectivos —con un equipo, con amigos o clientes—, dentro de un año en el que suelen cambiar las formas de ganarse la vida. Los amigos y los valedores juegan un papel muy importante.',
  ],
  12: [
    'Con el Mediocielo sobre la casa XII natal, el resultado de las acciones sociales o profesionales se viene encima: una etapa socialmente dura. Para quien tiene negocio propio, puede significar una acumulación de deudas difícil de soportar, que muestra las carencias y obliga a tomar conciencia de lo que falta sin posibilidad de obtenerlo; suele coincidir con un periodo de pérdidas o privaciones profesionales o sociales.',
    'Pueden darse situaciones de marginación, desengaño, desprestigio o derrumbamiento, y hasta verse obligado a abandonar una profesión ejercida durante años. En lo positivo, puede ser un año para ejercer autoridad dentro de un grupo reducido.',
  ],
};

// ============ part02 · asc-signo (12) + asc-planeta (1) ============
P.ASC_SIGNO = {
  Aries: [
    'Con Aries en el Ascendente anual, el papel que pide el año es el de viveza de carácter, dinamismo y decisión: tocará tomar decisiones rápidas o emprender algo nuevo que remueva la vida cotidiana o familiar. La creatividad se apoya en la acción, y es tiempo de llevar a la práctica objetivos nuevos, familiares o sociales. Uno se desenvuelve con más facilidad y la capacidad de organizar se vuelve muy activa. Año de decidir y entrar en acción.',
  ],
  Tauro: [
    'Con Tauro en el Ascendente anual toca aprender a escuchar con paciencia y a esperar a que los demás cambien de opinión; conviene actuar con reflexión y pensarlo dos veces antes de moverse. A cambio, el papel social o familiar gana atractivo: uno queda como la guinda, como quien tiene el dinero o eso que los demás quieren, y la presencia pesa más.',
    'Hace falta una coraza amable que evite abusos y ofensas, y desarrollar aguante y prudencia con los más cercanos —familia, pareja y allegados—, donde pide diplomacia.',
  ],
  Géminis: [
    'Con Géminis en el Ascendente anual, el año obliga a moverse con ligereza, con agilidad y buena comunicación para alcanzar los objetivos: hay que estar dispuesto al instante, preparado para viajar o para tratar con la familia, la pareja y el entorno, y para acomodarse a situaciones sociales o familiares nuevas.',
    'No queda otra que hablar mucho y participar en el medio propio para persuadir o convencer de algún cambio, mostrándose simpático, inteligente y oportuno. Año de estudiar y escribir, con tareas de comunicación, docencia, ocupaciones auxiliares o burocracia; a veces se duplica o se divide la vida laboral. Se aprende a ser más avispado.',
  ],
  Cáncer: [
    'Con Cáncer en el Ascendente anual, el año pide relacionarse mucho y hacer vida social; para cubrir los objetivos propios hay que aprender a ser acogedor, a dar hospedaje, ayuda o protección —incluso a quien no es de la propia familia—. Se desarrolla el instinto de protección y la naturaleza maternal, y uno se vuelve más amable, sociable y sensible; también más permeable a los estados emocionales ajenos.',
    'Esa nueva permeabilidad trae cambios de humor y altibajos, de la alegría desmedida a la tristeza profunda. En lo social o profesional, trabajos de cara al público y relaciones con personas variadas, donde se demuestra la capacidad como emprendedor u organizador de encuentros.',
  ],
  Leo: [
    'Con Leo en el Ascendente anual, toca desempeñar un papel digno y escuchar el impulso interno hacia la fama, el poder o las situaciones de privilegio; hay que aprender a hallar soluciones y a mirar la realidad con ojos nuevos, ordenando y arreglando asuntos para que la vida marche lo más cerca posible de la propia voluntad. Para lograrlo se necesita resolución, temperamento fuerte, entusiasmo, ambición y capacidad de organización, y ganar prestigio personal —el contacto con personas influyentes será una ayuda inestimable—.',
    'Año de carácter más extrovertido y de confianza en uno mismo; hay que hablar claro y decir las cosas con nitidez, aunque se roce la sinceridad excesiva, mostrándose generoso para merecer el respeto y la estima de los demás y de uno mismo.',
  ],
  Virgo: [
    'Con Virgo en el Ascendente anual, la vida sitúa ante un papel de servicio, de higiene y de ahorro; se está a gusto en lugares limpios, ordenados y bien ventilados. Para lograr los objetivos hay que rebajar el orgullo o la vanidad y mantenerse en un segundo plano, con menos protagonismo —lo que también libra de cargas y responsabilidades—.',
    'Toca ser educado, pulcro, exacto y preciso; la formalidad, el detalle, la puntualidad y cierta severidad marcan el papel, con prudencia y mesura, lo que convierte a la persona en buena conversadora y consejera. También se afina el arte de la sisa y del regateo, asegurando los negocios e intercambios y aprendiendo a ahorrar. Buenas condiciones para el éxito laboral o profesional.',
  ],
  Libra: [
    'Con Libra en el Ascendente anual se aprende a compartir y a colaborar con otras personas: para muchos será el año de convivir en pareja o en sociedad, así que conviene asumir un papel amable, divertido y atrayente, de buen compañero. Hace falta despertar simpatía y admiración, participar del lado lúdico de la vida, organizar fiestas o reuniones y distinguirse por los buenos modales, la elegancia, la prudencia y la diplomacia en el trato.',
    'Año muy sociable, de convencer con argumentos amables y educados, ecuánimes, medidos y sensatos: los objetivos dependen bastante de otras personas —la pareja, los compañeros u otros—.',
  ],
  Escorpio: [
    'Con Escorpio en el Ascendente anual, el mundo exige un papel hiperactivo: para lograr los propósitos hay que estar casi siempre en acción, sin quedarse quieto —ni dejar que lo dejen a uno—. El símil del año es la abeja: producir y, a la vez, mostrar defensas temibles; colmena de miel rica para quienes se han ganado la confianza, aguijón de picadura cruel para quien se atreva a entrar sin ganársela.',
    'Toca representar el papel de persona resistente, firme y perseverante, con fortaleza moral ante los obstáculos que la vida presente, sin caer en el abatimiento ni en el desánimo: no rendirse y soportar tareas duras o fatigosas, aunque la procesión vaya por dentro.',
  ],
  Sagitario: [
    'Con Sagitario en el Ascendente anual, es tiempo de aprender a ser libre y a actuar sin miedo: conviene estar preparado para los viajes al exterior y los encuentros con gentes de lugares lejanos, y surgirán anhelos de desplazarse y de disfrutar de esa libertad.',
    'El año pide buen humor y desenfado; resulta fácil mostrar la naturaleza bondadosa y tender al bien y a la equidad, procurando la felicidad de quienes rodean, en una actitud acogedora y afectuosa que se hace querer. Harán falta papeles muy variados y capacidad de improvisar, con algún momento ejemplar o sobresaliente en el que se demuestre lo que se sabe —o se cuenten las historias de los viajes.',
  ],
  Capricornio: [
    'Con Capricornio en el Ascendente anual, conviene ser emprendedor y cauteloso a la vez: actitudes dinámicas y responsables que hagan parecer serio, trabajador, enérgico y cumplidor, porque los objetivos del año suelen ser de bastante envergadura. El papel es activo y emprendedor: mostrar energía, tomar parte activa en la vida, juzgar rápido las situaciones y decidir sin dudar.',
    'Toca creer solo en lo que se puede tocar, ver o analizar, desconfiar del criterio o la eficacia ajenos y reprimir más de una manifestación sentimental; también aguantar, padecer y sostener situaciones que otros no soportarían, con la mirada puesta en lo alto: sublimar ciertas aspiraciones hacia metas más elevadas o responsables.',
  ],
  Acuario: [
    'Con Acuario en el Ascendente anual toca aprender a «hacerse el desentendido» y a mirar desde lo alto de la torre, por encima del tumulto. Es etapa de vivir sin depender de nadie y sin que nadie dependa de uno, con valores de amistad y libertad para lograr los objetivos, evolucionar y crear algo nuevo.',
    'El papel del año es original e independiente, sin dejarse arrastrar por emociones o sentimientos corrientes; resulta fácil desarrollar lo artístico o estético, mirar la realidad con ojos nuevos e incorporar mejoras o reformas en algún sector de la vida. Se nota incluso en la manera de vestir, con una nota particular. Año de refinar el gusto, resolver enigmas y ejercer el sentido crítico con las emociones ajenas.',
  ],
  Piscis: [
    'Con Piscis en el Ascendente anual, el papel del año es gregario, grupal, colectivo: no queda más remedio que desarrollar la sensibilidad y tener en cuenta las emociones y sentimientos de los demás. Hay que ser camaleónico, adaptarse a cualquier situación y leer el estado de ánimo de quienes rodean, porque los objetivos personales tendrán un tinte colectivo o grupal.',
    'Es etapa de aparentar saber más que otros para medrar entre grupos y agrupaciones, atento a cualquier corriente —como los peces oceánicos, que esperan la corriente marina para colocarse en ella y avanzar con facilidad—; conviene estudiar con detenimiento la situación del grupo social y discurrir cómo comprenderla y mejorarla.',
  ],
};
P.ASC_PLANETA = [
  'Cada año el Ascendente de la revolución va cambiando de posición, y cuando se coloca junto a un planeta natal —a menos de 2°— el año resulta excepcional y extraordinario, teñido por la naturaleza esencial de ese planeta.',
  'Los matrimonios, por ejemplo, están ligados a Venus por regir el signo de Libra y la casa VII: un Ascendente anual sobre Venus natal acompaña a los años de boda. En el extremo opuesto, un Ascendente anual junto a un planeta duro, en conjunción a la vez con Marte y con la cúspide de la casa VIII, marca los años de episodios críticos.',
  'La regla general: el planeta tocado por el Ascendente de la revolución imprime su naturaleza esencial a todo el año, y conviene leerlo con atención en el conjunto de la carta.',
];

// ============ part03 · sol-casa (12) ============
P.SOL_CASA = {
  1: [
    'Con el Sol de la revolución en la casa I, el año gira en torno a uno mismo: el papel, el rol, la identidad. Hay más libertad para asumir roles nuevos y la voluntad empuja hacia hábitos y costumbres renovados; es el año de rehacer el propio papel, de ser más digno, brillante y veraz, con la autoestima en juego.',
    'Con buenos aspectos (trígonos o sextiles) sube la autoridad personal y mejora el amor propio; con el Sol afligido por cuadraturas u oposiciones de planetas duros, será un año de presiones profesionales o familiares en el que habrá que ganarse la autoestima a fuerza de trabajo.',
    'La casa I refleja el estado del cuerpo, así que los malos aspectos al Sol pueden dejarse notar físicamente, en la parte del cuerpo regida por el planeta que aflige —el caso típico: una dolencia de rodilla bajo una cuadratura de Saturno—.',
  ],
  2: [
    'Con el Sol en la casa II, los asuntos económicos son el eje del año: la autoestima y la búsqueda de dignidad pasan por el dinero, las compras, las ventas o las inversiones. Los hábitos económicos —cómo se gana, se gasta y se invierte— toman el protagonismo.',
    'Con trígonos: aumento de salario o mejora profesional con reflejo directo en el bolsillo. Con cuadraturas u oposición: gastos excesivos que obligan a trabajar más o traen preocupaciones por los hijos, la pareja o los clientes. Si el Sol va junto a un planeta, se matiza: Júpiter, Neptuno o Plutón anuncian aumento de riquezas; Urano, irregularidad; Marte, gastos fuertes o inversiones de riesgo; Venus, tranquilidad económica; Mercurio, mucho ajetreo de dinero, y la Luna deja siempre lo suficiente para vivir.',
  ],
  3: [
    'Con el Sol en la casa III, el año es de mucho movimiento: viajes, desplazamientos continuos, estudios y escapadas de fin de semana. Para muchos implicará formarse: cursos, cursillos o una nueva formación intelectual.',
    'Con malos aspectos, el mundo laboral exige un esfuerzo adicional para ponerse a la altura —aprender un idioma, sacar el carné de conducir—. Con buenos aspectos, llegan relaciones nuevas que pueden tener tinte romántico. Puede aparecer un medio de transporte nuevo y los fines de semana se vuelven lo más importante del año; también es un periodo de gran creatividad intelectual.',
  ],
  4: [
    'Con el Sol en la casa IV, la vida se centra en el hogar o el negocio personal: las relaciones familiares ganan protagonismo y, a veces, todo pasa por un cambio notable de vivienda —o por el negocio propio—. La posición personal dentro de la familia brilla más.',
    'Con trígonos de planetas benéficos: herencias, adquisición de bienes raíces, incremento del patrimonio, mejoras en la vivienda y en el negocio familiar. Con cuadraturas de planetas tensos: pérdidas de patrimonio o situaciones delicadas que exigen el máximo esfuerzo para sostener la vida familiar o el negocio. Con buenos aspectos se cubren metas y llega el reconocimiento; con malos, surgen dificultades familiares y numerosos esfuerzos para cumplir los objetivos del año.',
  ],
  5: [
    'Para muchos es el año en que se desea tener un hijo: la voluntad empuja a crear, fundar, concebir u organizar algo nuevo para afirmar la autoestima o demostrar la capacidad creadora. Para otros, el tiempo de montar el estudio, el despacho o la consulta donde desarrollar la actividad profesional, laboral o social.',
    'El año deja una semilla plantada: se muestra una obra, se expone una creación o se hacen inversiones importantes. Es tiempo de encuentros íntimos con personas admirables —maestros, amistades brillantes, hijos— y, en general, de actividad creadora, juegos y diversiones. Cuando la cúspide de la casa está en Libra y Venus acompaña al Sol, es típico el nacimiento de una hija.',
    'La voluntad encuentra su mejor cauce en la creatividad o en trabajos secretos o no remunerados. Puede llegar el primer hijo o hija; con malos aspectos, surgen problemas con los hijos, los amigos íntimos o las inversiones.',
  ],
  6: [
    'Con el Sol en la casa VI, la voluntad se centra en la salud o el trabajo. Para muchos, una etapa de trabajos creativos o de mejor organización de la vida laboral.',
    'Es el año de brillar por el trabajo: con buenos aspectos crece la confianza para desempeñar las ocupaciones, hay apoyos, facilidades para integrarse en el mundo laboral y compensaciones por el esfuerzo. Con malos aspectos, cuesta soportar el papel subordinado: en un empleado, suele empezar por una baja de salud y acabar en somatización. El año reclama reconocimiento por el servicio; si falta, aparecen los desequilibrios de salud.',
    'Tiempo, además, de dietas y nuevas normas de higiene, de mejorar el vestuario y hasta de adquirir un animal doméstico de valor.',
  ],
  7: [
    'Con el Sol en la casa VII, la voluntad se exterioriza a través de otras personas: para cumplir los objetivos se necesita la colaboración de alguien que aporte, en algún sentido, el prestigio que falta. Año de relaciones, participaciones y adaptaciones; se apalabra, se contrata y se formalizan situaciones estables con los demás.',
    'Con buenos aspectos: ajustes, negociaciones, alianzas, uniones, contratos nuevos —y, para muchos, actividades públicas con representación de otros, como acceder a un cargo por vía asociativa o colectiva; un caso liviano: ser nombrado administrador de un consorcio—.',
    'Con malos aspectos: conflictos, litigios, pleitos, confrontación con rivales descubiertos y hasta peleas conyugales o problemas con contratos. En todo caso, un año de pactos, ajustes y acuerdos de palabra, siempre con situaciones ligadas a contratos legales o firmas ante notario. Si es mujer casada y el Sol recibe malos aspectos de maléficos, puede ser el año de la ruptura de pareja o de una boda llena de dificultades.',
  ],
  8: [
    'Con el Sol en la casa VIII, año de interiorización y cierto repliegue, en el que no suele faltar algún drama o reflexión emocional. La voluntad bascula hacia la posesión o el disfrute de algo: se manifiesta lo que no se tiene y, por tanto, lo que se desea —lo que tiene el otro y de él o ella queremos: un cuerpo, dinero, posición, juventud—. Etapa de transformación profunda de las ambiciones.',
    'Casi siempre toca alguna renuncia —un cargo, un lugar de trabajo, un puesto, un amigo, unos clientes, un salario, un viaje—, y la finalidad de esa renuncia es alcanzar lo que la ambición persigue. Con buenos aspectos: beneficios, ganancias o dinero por herencias, litigios, el socio, el colaborador o la pareja; posible segunda vivienda o refugio. Con malos aspectos: injusticias, pérdidas, agobios y obsesiones por exigencias de pago.',
  ],
  9: [
    'Con el Sol en la casa IX se manifiesta lo más elevado de la voluntad: tiempo de reflexionar, idealizar, discernir y experimentar; de poner a prueba la mente superior y la capacidad de comprensión y abstracción. Siempre se aprende algo que los demás desconocen o conocen menos. Puede ser año de viajes a lugares lejanos —turismo o peregrinación— y de trato con gentes de esos lugares.',
    'A menudo es un viaje largo, y también una etapa de mayor reconocimiento o prestigio en el lugar de trabajo o en el extranjero. Con buenos aspectos: beneficios por relaciones con extranjeros o por actividades turísticas. Posición favorable para los sucesos que ocurren fuera del país natal o con personas de países ajenos.',
    'El Sol goza en esta casa: los grandes saltos llegan de la mano de lo lejano —reconocimientos, elecciones o encargos que se juegan fuera del entorno habitual—, muchas veces con el respaldo de figuras protectoras.',
  ],
  10: [
    'Con el Sol en la casa X, el objetivo principal del año se relaciona con el medio social o el grupo al que se pertenece: entran en juego la opinión que los demás tienen de uno, la reputación, el cargo, la categoría y las aptitudes profesionales. Se ven las posibilidades de destacar y de alcanzar cargos o empleos honoríficos o de autoridad.',
    'La época se convierte en escaparate: los demás ven las cualidades propias. Con buenos aspectos se favorece la celebridad y la elevación social —lo usual es ser el individuo más brillante de la familia o del clan, ascender o acabar ocupando puestos de cierta relevancia—, y a menudo llegan empleos públicos o cargos de bastante responsabilidad.',
    'Con malos aspectos, puede ser el momento elegido por el destino para los cambios bruscos de estatus o los dolorosos derrumbes de situación, ante los que la voluntad poco o nada puede hacer.',
  ],
  11: [
    'Con el Sol en la casa XI, el año se escenifica a través de la renovación del círculo de amistades o clientes. Es el año en que se cumplen anhelos y esperanzas, en el que las influencias sobre los demás hacen sentir la amistad y llega ayuda desinteresada.',
    'Señala relaciones nuevas con amistades de mejor posición o más alto estatus, asociaciones voluntarias e informales, y un círculo de amistades, clientes o alumnos de los que sentirse orgulloso. Para algunos, el año de conocer al yerno o a la nuera; para otros, de encontrar un mecenas o personas que, por rango social o económico, ejercen una acción benefactora.',
    'Tiempo de viajes colectivos —con un equipo, con amigos o compañeros brillantes, hacia lugares abiertos, al aire libre— y de relacionarse con personas de mayor elevación social, más ricas o con notoriedad o influencia política. Es el año de los premios, los viajes especiales y las compensaciones.',
  ],
  12: [
    'Con el Sol en la casa XII, lo destacable ronda los lugares colectivos —colegios, hospitales, centros de retiro— y los sitios donde se mantienen actividades reservadas o relaciones secretas, a veces con personajes de cierta fama. Para algunos puede ser un tiempo de privaciones, un año algo oscuro en el que se oculta algo a los demás o a uno mismo; pero también el tiempo de sacar a la luz lo que permanecía oculto y de realizar actividades ideales.',
    'Para unos, momento de experimentar lo trascendente o lo místico; para otros, especialmente con trígonos al Sol, la estancia en un hotel de lujo. El brillo personal no mengua: se traslada a lo íntimo. La creatividad se expresa en grupos pequeños y se demuestra capacidad de organización en reuniones de poca concurrencia.',
    'Tiempo de dedicación a alguna asociación secreta, esotérica o de carácter oculto; de éxito a través de ocupaciones retiradas; de trabajar en solitario o de manera discreta. Conviene contar con un lugar de retiro para aislarse y mantener un plano social discreto, sin complicarse la vida.',
  ],
};

// ============ part04 · regente-guia + astrodinas (intro/aspectos/posicion) + astrodina-nota (13) ============
P.REGENTE_GUIA = [
  'Además del Sol, el regente del Ascendente de la carta de la revolución es el otro gran protagonista del año: el llamado acelcadem —regente del año— en la astrología clásica.',
  'Informa de la naturaleza de los asuntos y personajes centrales del año y de la intensidad de los cambios que traerán. Cada revolución es un capítulo nuevo con un invitado especial: un planeta que asume el papel principal y que puede tener un guion importante… o pasar sin dejar recuerdo.',
  'El tipo de invitado y la fuerza de su intervención dependen del planeta: Venus como regente puede escenificarse en una hija, un asunto de amor o de dinero; Mercurio, en un hijo, un hermano o un buen negocio. Su potencia se mide por las astrodinas.',
  'El regente puede ser cualquiera de los planetas —incluidos el Sol y la Luna—, estar en cualquiera de las doce casas, en cualquier estado cósmico, recibir distintos aspectos y sumar más o menos astrodinas. Con todo ello se arma una interpretación esquemática que, combinada después, revela las tendencias del año. Primer paso: conocer su fuerza, para saber qué se puede esperar de él.',
];
P.ASTRO_INTRO = [
  'Desde la tradición se cuantifican los planetas para conocer el resultado de sus activaciones: son las dignidades —así llamadas hasta la Edad Media, luego «quilates» y hoy «astrodinas»—. Es una medida evaluativa, no un valor matemático exacto, pero muy útil en la interpretación.',
  'Hay dos familias: las astrodinas de posición —domicilio, exaltación, término, gozo y demás dignidades— y las que se originan por los aspectos.',
  'La suma por aspectos mide la intensidad del suceso, crisis o sincronicidad ligada al regente del año; las de posición informan de la calidad y el resultado: quién es el personaje que encarna el año y con qué facilidad va a salir.',
];
P.ASTRO_ASPECTOS = [
  'Según su intensidad —astrodinas por aspecto del regente—, los años se catalogan así: años simples, que no cambian nada en el curso de la vida; años complejos, que dejan alguna secuela en la conducta o en la vida; años notables, que varían el rumbo (cambio de empleo, de vivienda o de pareja); y años extraordinarios, que cambian por completo el modo de vida.',
  'Valores orientativos por aspecto (en la línea de Demetrio Santos): conjunción y oposición 10; cuadratura 6; trígono 4; sextil 3; aspectos menores —quintil, biquintil, semicuadratura, sesquicuadratura, quincuncio, semisextil— 2.',
  'Umbrales de la suma: más de 40, año extraordinario —la forma de vida cambia por completo—; más de 30, año notable —cambios de hábitos, horarios y trayectos que afectan al rumbo—; más de 20, año complejo —deja huella y recuerdo, sin ser trascendental—; menos de 20, año normal, sin grandes vaivenes; y por debajo de 10, no cabe esperar crisis ni cambios: la lectura se conduce por temas menores.',
  'Los aspectos armónicos (conjunción armónica, sextil, trígono) y los tensos (cuadratura, oposición, conjunciones duras) se perciben hacia fuera: unos traen sucesos oportunos, en el lugar y con las personas adecuadas; los otros, sucesos inoportunos que exigen más esfuerzo. Los menores, en cambio, tocan los estados internos: muchas semicuadraturas o sesquicuadraturas anuncian un año de miedos, preocupación o excitación, sin grandes sucesos externos.',
];
P.ASTRO_POSICION = [
  'La calidad y la satisfacción del año dependen de la fuerza o dignidad del regente, también medida en astrodinas: cuanta más dignidad sume, tanto más probable es que lo que determina —según su casa— se cumpla de manera satisfactoria o, si falla, notoria.',
  'Se cuentan como dignidades: domicilio, exaltación, triplicidad, decanato, dodecatemoria, el gozo, directo y oriental.',
];
P.ASTRO_NOTA = {
  domicilio: [
    'Regente en su domicilio: año de acontecimientos correctos, sin errores ni defectos, con personas de conducta irreprochable, lugares adecuados y momentos oportunos. Cabe esperar que lo significado por el planeta se realice en el mejor sentido y se traduzca en bienestar, armonía y benignidad.',
  ],
  exaltacion: [
    'Regente en exaltación: año en el que llegan ayudas y apoyos de personas, lugares o cosas relacionadas con el planeta; situaciones de privilegio y resultados que superan lo esperado. Un planeta exaltado tiende a realizar lo que determina antes de lo previsto, a menudo por simpatías, influencias o contactos.',
    'Relaciona con personas de mayor rango, fuerza, destreza o belleza, y lleva a lugares que se sienten grandes, lujosos o desmedidos —con el riesgo de que todo llegue de forma prematura o adelantada—.',
  ],
  'sobre-tierra': [
    'Regente sobre la tierra —en arco de las casas VII, X y XII—: los resultados de sus determinaciones se vuelven visibles o se sincronizan con sucesos de dominio público.',
  ],
  oriental: [
    'Regente oriental —sale por el horizonte antes que el Sol o se pone después de él—: tiene fuerza para elevar su significado. En la tradición, el planeta oriental es como un paladín que cabalga delante de su señor anunciando su llegada.',
    'Año de regente oriental: lo que el planeta significa llega con aviso previo, se conoce mucho antes de que ocurra, puede programarse y no pilla por sorpresa.',
  ],
  directo: [
    'Regente directo: más fuerza para cumplir su determinación. El planeta directo es como quien va de un sitio a otro sin detenerse en el camino: lo que determina el regente del año se realizará sin retrasos ni desvíos.',
  ],
  dodecatemoria: [
    'Las dodecatemorias dividen cada signo en doce porciones de 2° 30′ que se corresponden con los doce signos; en cada una tienen dignidad ciertos planetas. El planeta en su dodecatemoria es como quien está sentado en su silla a la mesa.',
    'Si el regente del año ocupa su dodecatemoria, siempre habrá un lugar, un momento y unas personas que faciliten lo significado por el planeta.',
  ],
  retrogrado: [
    'Regente retrógrado: refleja un asunto o una persona de la que se esperaba conseguir algo y que no llega, dejando una sensación de decepción; muchas veces se vive como una traición, una sorpresa que deja sin lo pactado, un compromiso que se rompe o un encargo que no se cumple.',
  ],
  gozo: [
    'El Gozo liga cada planeta a una casa, sea cual sea el signo: una suerte de domicilio domal donde su significado se expresa con mayor benignidad. Con el regente en su gozo, el mundo pone los elementos necesarios para cubrir las metas ligadas al planeta, y este adquiere fuerza para manifestarse al margen de su estado cósmico y de sus aspectos.',
    'Mercurio goza en la casa I —el mejor lugar para el mensajero: comunicar, hablar, exponer, escribir—; la Luna en la III, donde todo está en movimiento, con cambios de compañeros y experiencias de fin de semana; Venus en la V, con su creatividad y sentido estético, su gusto por las fiestas y los espectáculos; y Marte en la VI, donde el hierro se vuelve arado sobre la tierra del trabajo y el año facilita emprender tareas nuevas.',
    'El Sol goza en la IX, la casa del maestro superior —la meta espiritual, moral o intelectual más alta—, que sitúa a la persona ante lo lejano y lo exterior. Júpiter goza en la XI, la mejor casa para él: amigos, viajes en compañía, premios y celebraciones. Y Saturno en la XII, que induce al estudio y la investigación: el año del regente en su gozo es cuando más sabios y eruditos nos hacemos.',
  ],
  dispositor: [
    'El regente del año gana mucho peso cuando dispone de otros planetas: cuando varios planetas ocupan signos regidos por él. Señala sucesos importantes que girarán en torno a los significados de su casa y de su naturaleza.',
  ],
  destierro: [
    'Regente en destierro: sucesos y encuentros a destiempo, fuera de lugar, a desgana o impuestos por alguien antipático. El destierro impide que el planeta realice lo que determina, destruye lo ya realizado y trae experiencias desfavorables que pueden volverse fuente de infelicidad, falsedad o malogro.',
  ],
  caida: [
    'Regente en caída: actuaciones inadecuadas en cuanto a lugar, gente y momento; la reacción se retrasa o se desvía hacia un sector donde no viene a cuento. Suele sincronizar con acontecimientos que impiden lo determinado por el planeta y lo transforman en desasosiego, preocupación o infelicidad.',
  ],
  peregrino: [
    'Regente peregrino —sin dignidad ni debilidad—: su suerte dependerá de su estado cósmico; como no tiene señor propio, hereda el estado del planeta que lo rige.',
  ],
  recepcion: [
    'Hay recepción mutua cuando el regente ocupa un domicilio o exaltación de otro planeta que, a su vez, está en un domicilio o exaltación del regente, y además forman algún aspecto entre sí.',
    'Si el aspecto es tenso —cuadratura u oposición—, la recepción es inarmónica: año de aprender a golpe de error, con desacuerdos, enredos, malas interpretaciones, decepciones y trabajos baldíos.',
    'Si el aspecto es armónico: sucesos rápidos y diligentes —como un parto rápido—, improvisaciones afortunadas, activaciones súbitas e inesperadas, alivios y adelantos; siempre, ganar tiempo.',
    'Regla general: los planetas fuertes —domicilio, exaltación y, en menor cuantía, trigonocracia— realizan lo determinado en el momento oportuno, con acontecimientos que impactan en la vida de la persona. Los débiles —caída, destierro, retrógrado, combusto— se manifiestan a destiempo o con gente inadecuada, dejando sin efecto lo que se esperaba. Los peregrinos pasan a depender del estado cósmico del regente de su signo.',
  ],
};

// ============ part05 · regente-casa-macia (12, extensos) ============
P.REG_CASA_MACIA = {
  1: [
    'Con el regente de la revolución en la casa I, el año remodela el carácter y los hábitos: casi siempre toca adoptar un rol nuevo, un papel distinto al de los años anteriores. La intensidad del cambio y su resultado dependen de las astrodinas del regente, por aspecto y por posición.',
    'Sol: año de reafirmación de la personalidad y de subida de la autoestima; surgen situaciones en las que demostrar la capacidad de organización, centrarse y dirigir el entorno, muchas veces imponiéndose. Suele coincidir con un aumento de la vitalidad (lo habitual en nacidos de Leo y, en menor medida, de Virgo).',
    'Luna: cambio de rol hacia lo más sociable o hacia la protección; para muchas mujeres, el año de tener un hijo o de asumir el papel de madre; para los hombres, de cumplir una función protectora —tareas públicas o sociales—. El cambio de papel ante los demás se nota.',
    'Mercurio: toca demostrar habilidades personales y capacidad de argumentación; año de matizar, contar, medir, pesar y tomar notas. Escritos, cartas, mensajes, movimiento de mercancías y una amplia gama de oficios —comercial, administrativo, artesanal, estudiantil— según el resto de la carta.',
    'Venus: el rol se vuelve más pacífico, sosegado y atractivo; momento de representar la bondad y la belleza, de sentirse enamorado o artista. Se nota en el trato —atención, respeto, gentileza, buenos modales— y en el acicalado personal.',
    'Marte: año de rol activo; toca endurecer el carácter y prepararse para decisiones dinámicas y acciones con esfuerzo o con riesgo. Año de hacer ejercicio, practicar deporte o emprender una aventura o un trabajo nuevo; suele coincidir con más músculo.',
    'Júpiter: sensación de ejercer de extranjero, de viajar o de ser admirado por algo; el ambiente lleva a representar un papel más honorable o de mayor prestigio. Para muchos, año de querer retirarse del mundo dejando buenas acciones; suele coincidir con un aumento de peso.',
    'Saturno: papel más sobrio y cargado de responsabilidades; etapa para demostrar que se sabe ser responsable. Un periodo sosegado —ni triste ni alegre—, en el que se predica con el ejemplo; en lo físico, suele coincidir con adelgazamiento.',
  ],
  2: [
    'Con el regente en la casa II, año de transacciones económicas importantes: intentos de ganar por rentas, compras, ventas o negocios —con ganancias si el regente recibe buenos aspectos; con pérdidas, gastos o dificultades si los aspectos son tensos, en especial oposiciones y cuadraturas—. Los matices los aporta cada planeta.',
    'Sol: con buenos aspectos, adquisición de riqueza a través del mando, la dirección de empresas, las actividades minoristas o los cargos oficiales —en la mujer, la determinación puede recaer en el marido—; con malos, año de pagos y de muchos gastos.',
    'Luna: con buenos aspectos, dinero con numerosas fluctuaciones, por función pública o ayudas familiares; posibles compras importantes, como una casa. Con malos, los gastos familiares dejan cierto malestar.',
    'Mercurio: con buenos, ganancias por negocios personales, escritos, artesanías, dependientes, comunicaciones o enseñanza —a veces, ayudas de hermanos—; con malos, gastos a causa de hijos, estudios o comunicaciones.',
    'Venus: ganancias del mundo femenino, de la pareja o del socio, o por la venta de objetos de arte, decoración, vestidos o elementos estéticos.',
    'Marte: se inician trabajos, negocios o especulaciones arriesgadas; con malos aspectos, gastos fuertes o embargos.',
    'Júpiter: condición de fortuna —poco esfuerzo y mucho beneficio— por el negocio familiar, las transacciones de importación y exportación o los cargos con privilegios; con malos aspectos, los beneficios no llegan con tanta facilidad.',
    'Saturno: con buenos aspectos, beneficios por herencia o por la venta de bienes heredados —y también pérdidas o dilapidación del patrimonio o de los bienes del padre—; con malos, cierta carencia de liquidez.',
    'Urano: economía sujeta a alteraciones e inestabilidades, con algún momento boyante según sus aspectos. Neptuno: confusión económica o beneficios por vías extrañas o que es mejor mantener discretas —el llamado dinero B—. Plutón: ganancias por herencia, medicinas naturales, empresas grandes o de mucha envergadura, y también por oficios antiguos —carnicería, zapatería— o por asuntos ocultos.',
  ],
  3: [
    'Según la tradición, año de viajar —más seguro cuando se trata de Júpiter—; en general, de estudiar, escribir, publicar o manifestarse ante los medios. Muchas veces señala un viaje de cierta importancia o la llegada de fuera de un hermano o de alguien que lo será.',
    'Suele ser un año de cambio de mentalidad: romper con la monotonía, salir del aburrimiento y transformar las ideas —nuevos aprendizajes, nuevas ganas de compañía, nueva manera de comunicar y de entender la vida—.',
    'Luna (en su gozo): el mundo pone los elementos para cubrir las metas sociales; se aprende a percibir a los demás y a manifestarse con inteligencia emocional, con facilidad para el lenguaje y mayor control de las emociones.',
    'Mercurio: la mente se agiliza; año de estudiar, hablar, escribir y moverse: desplazamientos, estudios nuevos, cursillos y actividades intelectuales. Para algunos, el año de escribir su libro, su tesis o su novela.',
    'Venus: la manera de manifestarse se vuelve más dulce, educada y halagadora; se logran los propósitos por la seducción, la simpatía y los buenos modales —o por el engaño inofensivo si Venus recibe malos aspectos—. Buen año para la vida romántica libre.',
    'Marte: cambio brusco en la forma de expresarse, con la valentía de decir abiertamente lo que se piensa; si forma cuadraturas, disgustos y conflictos, y accidentes en los desplazamientos por irritación o negligencia; con buenos aspectos, poner las cosas en su sitio: espacio personal y relaciones fluidas y dinámicas, con numerosos desplazamientos.',
    'Júpiter: se despierta el interés por los estudios superiores y las lenguas extranjeras; necesidad de aprender cosas nuevas o visitar lugares nuevos. Casi siempre, un viaje largo de corta duración; a veces, relaciones nuevas de tinte sexual o libres con colegas; posibilidad de coche nuevo, estudio o dormitorio nuevo.',
    'Saturno: la forma de pensar se disciplina y las ideas se vuelven serias y realistas. Año de iniciar estudios formales o de retomar los abandonados, con desplazamientos incómodos y pesados por el tráfico o el trayecto; etapa para organizarse un estudio o un despacho donde estudiar o escribir.',
  ],
  4: [
    'Dice Ben Ragel que el regente en la casa IV sin ningún aspecto anuncia un año sin viajes, sedentario, ocupado en heredades y posesiones, con dinero obtenido de los padres o por herencia. Hoy, para quien tiene negocio o establecimiento, suele ser un año de reorganización o creación del negocio propio; para los demás, de construcción, arreglo o mejora de la vivienda o las tierras —a veces, simplemente el arreglo de la cocina—.',
    'Luna: aumentan las posibilidades de una transformación importante en la familia o en el lugar donde se reside; para muchos, un cambio de casa o de residencia; para otros, el año de montar el negocio personal con apoyo de la familia.',
    'Mercurio: cambios en estanterías, librerías, muebles o enseres; aparición de gente joven —niños en casa: hijos, sobrinos, nietos— que transforma la vida hogareña; visitas de los hijos que viven fuera; con negocio propio, ideas y proyectos nuevos, a veces en colaboración con hermanos o colegas.',
    'Venus: fiesta o celebración importante en casa o en la familia —boda, bautismo, comunión—; arreglos, mejoras y embellecimientos de la vivienda. Para el negocio propio, mejoran las ventas y los ingresos; mejoran las relaciones familiares y, para los emparejados, se encuentra el amor en casa.',
    'Marte: mucha actividad en el hogar —obras, albañiles, carpinteros, cambios de mobiliario—. Mal dispuesto, la agresividad acumulada en el exterior se descarga en casa: discusiones familiares, ambiente hostil, incluso pequeños incendios en la cocina o el negocio; para las empresas, agotamiento por acumulación de tareas. Siempre, mucha actividad donde antes había descanso.',
    'Júpiter: crecimiento y desarrollo en la familia; mejoras en la vivienda o el negocio y más confort —reforma de cocina, nueva calefacción, buenos sillones—; aumento de la familia o mejores relaciones con ella; a veces, vivir en el extranjero; más visitas en casa o más clientes en el negocio.',
    'Saturno: probable aparición de una persona mayor en el hogar —el padre, la madre, la suegra— por una temporada; cuando no, la vivienda se vuelve fría, construyen enfrente algo que quita luz o cuesta acceder a casa —averías de ascensor, escaleras—. Bien aspectado, obras o mejoras en la casa o una vivienda nueva, incómodas durante un tiempo; para el negocio propio, época de poner cimientos y afianzarse.',
  ],
  5: [
    'Dicen en la tradición que el regente en la casa V da ganancias por comerciar, sembrar, regalos o los hijos; y que quien no los tenga tendrá un hijo, recibirá regalos y le llegarán mensajeros. En general: año de mucha creatividad, de fundar algo o de tener un hijo.',
    'Luna: cambios ligados a las creaciones de todo tipo; tiempo de innovar el fruto de la acción creadora —tener hijas o nietas, fundar, especular, jugársela de nuevo—. Resulta más fácil intimar y se transforman las relaciones íntimas o el círculo más cercano; para quienes tienen hijos, cambio de costumbres a causa de ellos (emancipación, matrimonio).',
    'Mercurio: creatividad intelectual y estímulos especulativos; año de pensar en ahorrar, invertir o estrenar una afición. Con hijos, desplazamientos y viajes cortos, o nuevos horarios por ellos; para otros, relaciones con personas más jóvenes o de tipo intelectual. Objetos pequeños y coquetos, libros nuevos en el salón.',
    'Venus (en su gozo): año afortunado para los hijos, las creaciones y lo amoroso: actividades lúdicas y creativas, fiestas, reuniones, diversiones y amores en aumento; más relaciones con amigos, más creatividad, ideas y modas nuevas. Buen entendimiento con los hijos y alegrías por una hija. Los amores románticos, más al alcance que nunca.',
    'Marte: necesidad de planificar y lanzar nuevas labores o proyectos, y de poner en marcha especulaciones o actividades nuevas del negocio; se quema mucha energía en diversiones y celebraciones, con ganas de deporte. No es buen periodo para los juegos de azar —se puede perder dinero—; más ganas de fiesta y, por tanto, más gastos.',
    'Júpiter: el año del disfrute casi sin límites —salvo temperamentos muy saturninos—: placer y emociones gratas que, en algunos casos, toman tintes sexuales. La vieja imagen del príncipe azul se traduce hoy en un viajante, un extranjero o una aventura sin más; para todos, año de máxima desinhibición sensual y de creatividad: obras, fundaciones, negocios y proyectos nuevos.',
    'Saturno: retraimiento de la vida sexual, voluntario o impuesto por las circunstancias —una suerte de enfriamiento—; los vínculos se vuelven más monógamos, restringidos o serios, a veces con personas mayores o del pasado. Época de poner en práctica ideas aplazadas desde hace más de diez años; en los negocios, especulaciones de trabajos pesados cuyos frutos tardan años. Los hijos empiezan a decidir por sí mismos; a veces, se llega a abuelo.',
  ],
  6: [
    'Cuando el regente está en la casa VI, dicen en la tradición que llegan beneficios por siervos, ganado y animales domésticos. Hoy lo que suele verse es un cambio de hábitos a causa del mundo laboral: cambio de trabajo, nuevos horarios originados por la actividad profesional o —para quien no se somete a horarios— el año de las bajas, los dolores y las enfermedades que no matan.',
    'Luna: inestabilidad laboral; casi siempre, al final del periodo se desempeña un trabajo o servicio distinto al de años atrás. Cambios en el trabajo, la salud o los cuidados —régimen alimentario, nuevas actitudes higiénicas—; con empleados a cargo, cambios de personal.',
    'Mercurio: también cambios laborales, más o menos importantes según las astrodinas; el pensamiento se ocupa de más y aparece la obligación de comunicar, escribir o realizar servicios; a veces se necesita tiempo extra para animales, plantas, armarios o archivos. Los empresarios renuevan la plantilla con empleados jóvenes o bien formados.',
    'Venus: el trabajo se hace más agradable y los ingresos se estabilizan; mejora la salud; pequeños cambios domésticos —armarios, plantas, animales—; para algunos, romance con alguien del entorno del trabajo —con malos aspectos, cuidado con las enfermedades venéreas—.',
    'Marte (en su gozo): año muy afortunado para los asuntos de esta casa: mejoras e incrementos de la actividad laboral, nuevas tareas o servicios especiales. Con malos aspectos, las tareas obligatorias resultan fatigosas o irritantes; responsabilizarse de un animal o de una carga extra; fiebres o pequeños accidentes. Retrógrado, puede sincronizar con la enfermedad grave o la pérdida de un animal, un empleado o un tío.',
    'Júpiter: se amplían las fronteras laborales o llegan largos desplazamientos por el trabajo; año de mejoras, pero muy sensible a los malos aspectos —puede indicar un paréntesis de desempleo—. Se deja una tarea por otra más cómoda o rentable, con pocos descansos o sin vacaciones; en salud, posible aparición de quistes o tumores de grasa, sin gravedad. Mejora el vestuario o llegan dependencias y armarios nuevos.',
    'Saturno: para el empleado, alta probabilidad de quedarse sin trabajo —basta con un mal aspecto—; para el resto, trabajos pesados, en lugares oscuros o de extrema erudición que otros desechan. Épocas de despidos, poco trabajo o trabajo clandestino; el mérito del servicio queda en manos ajenas y apenas llega reconocimiento. Para el autónomo, periodo duro pero de afianzamiento; a veces, compra o alquiler del local. En salud, debilidades y cansancio; en el vestir, austeridad o falta de ropa nueva.',
  ],
  7: [
    'Dice la tradición que el regente en la casa VII da beneficios gracias a la pareja y que, si se encuentra sin formar aspectos, es señal de boda. En general: año de cambio de hábitos por la colaboración con otras personas.',
    'Luna: el foco del año gira en torno a las asociaciones, las alianzas y la necesidad de complementarse; para muchos, interés centrado en la pareja y en buscar de nuevo con quién convivir; cambios de actitud o de pareja; interés por la vida pública —participación política o representativa—, con incremento de popularidad salvo que otras disposiciones lo anulen.',
    'Mercurio: hay que recurrir a consultas con otras personas para asesorarse o cubrir carencias —por temas laborales, hijos, papeles o asuntos personales—; toca hablar en público, dialogar o pactar de palabra para lograr un objetivo; posible firma de un contrato o documento pequeño.',
    'Venus: mejoran notablemente las relaciones de pareja y con los colaboradores habituales; año de reconciliaciones y encuentros donde se hacen las paces y se resuelven viejas rencillas; buen año para asociarse, casarse o realizar actividades públicas o sociales.',
    'Marte: más de una disputa o problema con la pareja, el socio o los colaboradores; ajuste de cuentas, poner asuntos sobre la mesa y medir el poder personal. Los demás están fuertes y dispuestos a la lucha: toca dar la cara y hablar sin pelos en la lengua.',
    'Júpiter: crecimiento social y económico de la pareja y de los colaboradores; apertura hacia las relaciones sociales, de pareja y asociativas; para algunos, el año del matrimonio o de encontrar el socio que complemente. Aparece la persona o la situación ideal para comprometerse; pero Júpiter es muy sensible a los malos aspectos: entonces, desencantos, litigios o sensación de engaño.',
    'Saturno: la pareja toma un valor más importante porque las cargas familiares o las responsabilidades materiales pueden recaer en ella —se puede depender exclusivamente del otro—; se siente la pareja como más real y auténtica y se descubre la verdadera diferencia: se valora lo que se tiene y se plantea lo que se necesita. Con malos aspectos, riesgo para el vínculo, hasta el cambio de pareja; bien aspectado, estabilización y bodas con personas mayores o de carácter serio.',
  ],
  8: [
    'Dicen en la tradición que el regente en la casa VIII es año de terminar con asuntos del pasado. Cabe esperar un periodo con alguna renuncia —a una propiedad, un local, un negocio, una relación, una amistad o una colaboración—; los beneficios suelen ser para los demás, o llegan de la pareja, del socio o de la colaboración con otras personas.',
    'Luna: con buenos aspectos, herencias familiares —la casa VIII no suele señalar muertes, salvo en muy pocos casos—; cambios a causa de los bienes o los ingresos del cónyuge o del socio, al alza o a la baja, con la participación del otro siempre notoria; en los incrementos, posible compra de segunda vivienda o grandes viajes. En mujeres en edad apropiada, deseos de un nuevo hogar o de volver a ser madre.',
    'Mercurio: año de pagar deudas; los asuntos del pasado obligan a quitarse de encima temas legales o económicos; algún susto por recibos o impuestos antiguos; pequeños trapicheos con objetos, libros o cosas antiguas.',
    'Venus: aumenta el deseo sexual y la sensibilidad; se percibe más a través de los sentidos y la sensación de sentirse seducido es más notable: al final, uno se vuelve más atrevido; algunos empiezan a gastar en asuntos de amores y en servicios íntimos.',
    'Marte: decisiones para afrontar pagos, con cierta tensión, a veces ocasionada por el cónyuge o el socio; las pulsiones y ambiciones de poseer o disfrutar se vuelven más fuertes y en algunos casos se desvían; gastos de reparación de la segunda vivienda; tiempo de transformar, de deshacerse de lo viejo y preparar algo nuevo.',
    'Júpiter: crecen las pretensiones y ambiciones personales —prestigio, dinero, afecto, poder—; posible periodo de carencia afectiva o económica con el deseo incrementado: menos de lo que se desea o más deseo que bienes. Viajes al extranjero duros o costosos; gestiones de compraventa de una casa aislada, un apartamento o una segunda vivienda; en los peores casos, agobios económicos y créditos caros. A veces, el fallecimiento de un familiar mayor; el socio o la pareja mejoran su economía, en ocasiones a costa de uno.',
    'Saturno: con buenos aspectos, herencia de casas viejas, muebles u objetos antiguos de escaso valor; año de concretar ambiciones o de llevar a la práctica deseos que implican rupturas y transformaciones importantes. Con malos, sensación de pérdida inminente de bienes, puestos o relaciones; para el negocio propio, riesgo de ruina o temporadas difíciles, con inspecciones de hacienda y pagos dolorosos.',
  ],
  9: [
    'Si el regente está en la casa IX, es señal de viajes —especialmente con Júpiter—, pero también puede significar un año de iniciar estudios o de nuevos conocimientos. Para muchos, un periodo de cambios en el lugar de trabajo. La naturaleza del regente aclara de qué tipo de cambios, experiencias o viajes se trata.',
    'Luna: el foco queda en los cambios del medio laboral —relevo de gente en el trabajo, reformas y cambios del lugar— más que en viajes al extranjero, salvo que el tema radical lo determine; a veces, cambio de metas, de carrera o finalización de estudios.',
    'Mercurio: conexión y comunicación con el extranjero que amplía la información sobre el mundo; compra de libros de colección o volúmenes especiales; sensación de conocimiento nuevo; correspondencia con extranjeros y, en muchos casos, viajes y encuentros fuera o con comunidades de otra lengua.',
    'Marte: año extraordinario para deportistas y para actividades físicas ligadas a la educación o el espectáculo; aumentan los viajes y los gastos por desplazamientos —matrículas, congresos, entradas—; asistencia a seminarios, convenciones o espectáculos con mucho movimiento; más actividad mental abstracta. Con malos aspectos, discusiones en el trabajo o problemas con la familia política.',
    'Júpiter: con bastante seguridad, largos viajes o estancias en el extranjero; o tratos y relaciones profesionales con extranjeros, trabajos de turismo o con gentes de otros países. Puede aparecer un personaje importante que cause profunda admiración —un buen maestro, un guía espiritual o filosófico—; inicio de una profesión nueva, ampliación del trabajo o traslado a un sitio más satisfactorio; mejoras y cambios agradables en el medio laboral.',
    'Saturno: casi siempre un viaje a un lugar desconocido con encuentros con personajes importantes y serios que causan fuerte impresión; desplazamientos pesados o con inconvenientes; en los peores casos, estancias en lugares exóticos sumidos en la pobreza, de los que no se olvidan los robos ni las penalidades. Los estudios o ciertas experiencias suponen una carga difícil; el lugar de trabajo puede volverse frío o aplastante.',
  ],
  10: [
    'El regente en la casa X equivalía, para los antiguos, a alcanzar una dignidad de rey. Hoy cabe esperar un año de innovaciones profesionales y de puestos de mayor rango o reconocimiento gracias a los méritos propios. Con la Luna, año de popularidad; con Saturno, de asumir alguna responsabilidad.',
    'Luna: mucha popularidad por el papel social que se desempeña; uno se vuelve más conocido en su medio; importante cambio de imagen social —de soltero a casado, de estudiante a profesional—; a veces, mudanza de residencia. La relación de la Luna con el Sol u otros planetas matiza la mejora o el empeoramiento de la posición. Siempre, una época de mayor notoriedad.',
    'Mercurio: cambio en el ejercicio de la profesión, con un papel importante de comunicación y movimiento; mucho trato con gente joven y situaciones donde demostrar el talento oratorio o el sentido de la orientación; actividades vinculadas al público joven o a los comerciantes.',
    'Venus: el papel social o profesional resulta muy atractivo; mejora la imagen y se sobresale —un año de éxito social o profesional, más aún si se es artista—; a veces, boda o inicio de una actividad nueva. Las relaciones con las autoridades resultan llevaderas; con malos aspectos, mujeres con autoridad que la aplican con severidad.',
    'Marte: la imagen social se proyecta más agresiva o activa; toca competir por mantener o lograr la posición y se pone en marcha el impulso vocacional: casi siempre, mejora o incremento de la actividad profesional. Con malos aspectos, duelos en la familia o pérdidas sociales o profesionales.',
    'Júpiter: nuevas oportunidades profesionales, mejoras sociales y cargos de mayor relevancia; recuperación de la imagen social; viajes al exterior como extranjero o persona ilustrada; relaciones sociales de mayor escala y más rentables. En las mujeres puede coincidir con matrimonio o separación vividos como liberación; posibilidad de cargos honorables y lucrativos; se despierta la admiración y la notoriedad.',
    'Saturno: cambio de actividad profesional, de negocio o de tipo social; periodo para demostrar lo aprendido y llevar a la práctica la experiencia de años anteriores; prueba social o profesional, crisis o rectificación de la profesión y del estatus —de soltero a casado, de empleado a desempleado—; mudanzas presionadas por el ambiente o por necesidades profesionales; los problemas de estatus se viven como un lastre que hay que sobrellevar.',
  ],
  11: [
    'Dicen en la tradición que, con el regente en la casa XI, hay buen estado para la persona y logro de lo que desea y anhela. Año de esperanzas nuevas y objetivos nuevos; los amigos, las relaciones y los clientes juegan un papel muy importante; lo normal es compartir con ellos no solo esperanzas, sino también la mesa, y realizar viajes en grupo.',
    'Sol: amistades nuevas de mejor posición o más alto estatus; asociaciones voluntarias e informales; un círculo de amigos, clientes o alumnos de los que sentirse orgulloso; para algunos, el año de conocer al yerno o a la nuera; para otros, de encontrar un mecenas o personas benefactoras; viajes colectivos hacia lugares abiertos; trato con personas de alto nivel económico o con influencia. Año de los premios y las compensaciones.',
    'Luna: año marcado por el cambio de amistades; nuevos compañeros, clientes y perspectivas con esperanzas nuevas; se comparte la mesa con numerosas amistades; viajes en grupo o vivir temporalmente en comuna con amigos; se eligen amistades de condición social o económica inferior, o se acepta sin problema la amistad de la gente normal.',
    'Venus: renovación de amistades, relaciones o clientes —gente simpática, artistas, mujeres—; algún viaje muy agradable con amistades encantadoras; posibles encuentros románticos en esos viajes; premios o algo que se siente como tal; en general, mejora de las relaciones: los amigos se vuelven más agradables y nosotros también a sus ojos.',
    'Marte: año marcado por un viaje con amigos o por necesidades profesionales o laborales; desplazamientos al exterior en grupo que acaban agotadores, y en el peor de los casos con ganas de volver por culpa de ciertos compañeros; amigos bruscos o agresivos; pérdidas por juego; tiempo de poner rejas en las ventanas.',
    'Júpiter: aumento importante del núcleo de amistades y de la popularidad, sobre todo entre amigos, clientes o alumnos; personas forasteras con las que se establece una relación especial y gratificante; para los profesionales, más clientela y mejor rentabilidad; viajes en grupo a lugares admirables o para asistir a congresos y espectáculos. Con hijos en edad adecuada, hace aparición su pareja —a veces sorprendente—; ayudas que podrían considerarse providenciales; nuevas esperanzas y sensación de privilegio.',
    'Saturno: variación, alejamiento o enfriamiento de amistades o clientes; en algún momento, una experiencia poco grata con una amistad —alguien con autoridad priva de un viaje deseado o de un disfrute anhelado, y se vive como una traición resentida—; a veces, cargar con las responsabilidades de los amigos; pero también, gracias a otras amistades, nuevas experiencias donde sale a relucir la erudición o la sabiduría, y viajes sugeridos por amigos de alto nivel.',
  ],
  12: [
    'El regente en la casa XII es, según la tradición, señal de enfermedad y mala situación, de tristezas y soledad. Puede considerarse un año de cierto retiro, de mayor recogimiento o de introversión.',
    'Luna: con malos aspectos, año algo penoso, con enfermedades de algún familiar o periodos de importante retraimiento; en general, interiorización o cambios en los hábitos íntimos que deben mantenerse en secreto. Para muchos, la casa se cae encima, el hogar se vuelve frío y triste o la madre se convierte en enemiga temporal; siempre se nota falta de alegría con los familiares. Se visita un hospital o casa de salud por algún pariente. En su mejor sentido, actividades secretas de tipo espiritual o idealista con un grupo pequeño, o relaciones afectivas que deben guardarse bajo el más riguroso secreto.',
    'Mercurio: revuelo por cosas pequeñas, disgustos a causa de hermanos, hijos, colegas, vecinos o noticias de enfermos; alteración nerviosa por una reunión íntima. Con malos aspectos, dificultad para conciliar el sueño —la mente no desconecta—, preocupaciones por deudas o sensación de carencia; posibilidad de estudios en secreto o de manera privada; algún allegado da un disgusto.',
    'Venus: aislamiento o reclusión placentera, con ensueños amorosos o fantasías sensuales; el mejor año para mejorar el aspecto físico —favorece adelgazar—; las mejores experiencias íntimas o románticas, eso sí, de manera secreta. En lo negativo: peligro de escándalo por cuestiones amorosas, falta de dinero de bolsillo y pérdida de apetito.',
    'Marte: el deseo sexual suele disminuir; lo romántico o afectivo puede transformarse en carga o fastidio; tensiones por situaciones de impotencia, gastos que no se pueden cubrir, dificultades y enfrentamientos en el trabajo, conflictos familiares.',
    'Júpiter: acontecimientos impactantes; estancias o visitas a lugares de retiro, hospitales o emplazamientos de reclusión; probable recurso a créditos, hipotecas o préstamos —un dinero no ganado que habrá que devolver—; los enemigos salen a la luz y algunos se transforman en aliados; se pierden miedos y se facilita el ingreso en asociaciones reservadas; posibles contactos con personas de carácter paranormal; se experimenta el peso de la justicia, como premio o castigo. Aminora los problemas: cabe esperar algún éxito por ocupaciones retiradas.',
    'Saturno: se llevan a la práctica proyectos guardados en la mente desde hace años: el año de materializar sueños; a menudo, tareas de cuidado de mayores enfermos; visitas a un mayor de la familia en el hospital. Con aspectos tensos, puede producirse el fallecimiento de ese mayor; en lo social o profesional, acumulación de cargas y responsabilidades, o préstamos muy duros que traerán honda preocupación. El peor momento para pedir prestado: lo mejor, los trabajos en solitario, los estudios serios y la preparación de oposiciones.',
  ],
};

// ============ part06 · notas-aclaratorias + infortunio (guia, conjuncion, casas 12) ============
P.NOTAS = [
  'El estado cósmico del regente informa del resultado de sus determinaciones: en buen estado, lo determinado se realiza y se convierte en felicidad o satisfacción; en exaltación, se adelanta o se exagera y se facilita su realización; peregrino, depende de otras personas.',
  'En destierro, la realización se impide o se dificulta y, si se logra, se transforma en fuente de pesar o malestar. En caída, se atrasa la realización o se convierte en desgracia.',
  'Los aspectos señalan la manera de llevarse a efecto estas determinaciones: los tensos traen esfuerzos, conflictos o ataduras severas a otras personas, y cumplir los propósitos nunca resulta del todo agradable; los ligeros facilitan la integración en el medio, el movimiento, los impulsos de la voluntad y el desarrollo de proyectos nuevos. La conjunción tiene lectura especial: el regente en conjunción con la Luna indica, por ejemplo, formación de hogar.',
  'Una escena típica de malos aspectos con maléficos señala la casa VIII: la pérdida —un robo, por ejemplo—, donde Mercurio es el arquetipo del que sustrae, sobre todo combinado con Marte. Son episodios que no trascienden del capítulo anual, pero se escenifican en momentos bien señalados de la carta de la revolución… y quedan refrendados por los atacires: la verdad de cualquier lectura astrológica se comprueba en los atacires; lo demás no pasa de especulación.',
];
P.INF_GUIA = [
  'El Infortunio es el parte que se extrae del arco que existe entre Saturno y Marte, añadido al Ascendente. La tradición le da otros nombres: Ben Ezra lo denomina Parte de las Enfermedades y las Heridas; Albubater, Parte de las Enfermedades; y Ben Ragel, Parte del Azemena o Parte de la Enfermedad.',
  'Sus funciones son varias. La principal: sirve para calcular la llegada del atacir del Ascendente a ese lugar —una medida igual al arco que separa a Saturno de Marte; o sea, lo mismo que calcular la llegada del atacir de Saturno a Marte—. Cuando el atacir del Ascendente llega al Infortunio, Saturno está llegando a Marte en algún otro lugar de la carta: son unos días peligrosos del año.',
  'Para comprender lo que puede esperarse de este parte conviene recordar los significados de los dos planetas: Saturno frena, para, disminuye y concreta; Marte es la herramienta con la que ejecuta. En su cara sombría, Saturno sería el alcaide y Marte, sus policías o sus cirujanos; en su cara amable, el padre que lleva al hijo sujeto con una cuerda y lo detiene cuando le conviene.',
  'Si el arco entre Saturno y Marte es cercano a un aspecto armónico (40°, 60°, 80°, 120°, 160°), los tirones de la cuerda son suaves y no se esperan sufrimientos ni daños; si el arco es de aspecto tenso, la acción del parte se nota en tirones fuertes, vividos como ataduras severas y situaciones restrictivas o penosas. Y no es lo mismo que el regente sea Júpiter o Venus —un padre bondadoso— que Marte o Saturno —un padre de mal genio—.',
  'Como Saturno hace de Ascendente del cálculo, la lectura se orienta sobre todo por la casa en la que cae el Infortunio: en ciertas condiciones puede ser una parada a tiempo que libra de males peores —en la casa V o en la IX, por ejemplo, evita los juegos peligrosos, las inversiones arriesgadas, los maestros engañosos o los viajes a lugares peligrosos—. Conviene estudiarlo con mente clara y sin prejuicios: es un parte que no suele anunciar nada bueno, pero orienta.',
];
P.INF_CONJ = [
  'La posición del Infortunio cobra especial importancia cuando forma conjunción con alguno de los planetas de la revolución: cuando esto ocurre se observan sincronicidades contundentes, de bastante gravedad si la conjunción es con planetas maléficos.',
  'Estas conjunciones marcan los años de episodios duros en el terreno de la casa: golpes en asuntos que tocan a su fin, en especial cuando el punto cae sobre planetas que gobiernan áreas sensibles —la pareja, los afectos, la salud—.',
  'Aun así, es un punto sobre el que se puede actuar antes del cumpleaños: el Infortunio es un arco sujeto al Ascendente del año, y la posición del Ascendente puede variarse con la relocación, cumpliendo años en otra localidad donde el Infortunio se separe a más de 3° del planeta afectado. Es como una luz roja ante un paso a nivel: se puede esquivar.',
  'Cuando el Infortunio no se combina con ningún otro punto astrológico, no cabe esperar sincronicidades que dejen huella ni sucesos relevantes.',
];
P.INF_CASA = {
  1: [
    'Con el Infortunio cerca del Ascendente conviene observar en qué casa se produce la conjunción entre Saturno y Marte, porque el significado tendrá relación directa con ella. Si la conjunción es en la casa I, suele indicar un año de retiro voluntario y estudio, o en el que se deja de representar un rol o de ejercer una profesión: se vivirá de forma grata o provechosa con regente Júpiter o Venus, y triste, dura o difícil con regente Marte o Saturno. Si la conjunción es en la casa VII, lo determinado tocará asuntos de pareja o pleitos, que se ganan o se pierden según el regente.',
    'En todo caso, son asuntos que se activan a los pocos días del cumpleaños y que suponen parar, «dejar de», detenerse, por asuntos que han tocado a su fin. Solo se relaciona con enfermedades si la conjunción está en la casa VI. El regente del parte aclara el resultado: no es lo mismo un parte regido por Venus o Júpiter que otro regido por Marte o Saturno.',
  ],
  2: [
    'La casa II es quizá uno de los lugares donde mejor se identifica al Infortunio: se percibe con claridad el resultado de su acción, siempre ligada al dinero, los bienes o los intercambios económicos. Para saber cuál será su efecto hay que considerar su regente y el aspecto que forma con el Ascendente —el mismo que forma Saturno con Marte—.',
    'Si el Infortunio está regido por un planeta fortuna y el arco ronda los 40° (novil), señala evitar una compra, un negocio o una inversión que habría resultado fatal: con el tiempo se reconocerá como positivo. Si ronda los 45° y lo rige un infortuna, aparece el sufrimiento por paralización económica o por malas compras y peores ventas. En todos los casos se experimentan cuentas bloqueadas, dificultad de liquidez, una compra deseada que no se concreta o un dinero esperado que no llega.',
  ],
  3: [
    'En la casa III, el Infortunio se percibe hoy en los medios de comunicación y de desplazamiento, en especial en el vehículo personal: el coche. Puede significar simplemente necesitar un coche y carecer de él; o sufrir averías y quedarse parado en un lugar —una gasolinera con comodidades si el regente es fortuna; un descampado o un sitio peligroso si el regente es infortuna—.',
    'La tradición también lo relaciona con situaciones problemáticas o perjuicios causados por los hermanos, extensible a compañeros de trabajo u otras personas del entorno inmediato. En general: dificultades para desplazarse, viajar o comunicarse durante un tiempo.',
  ],
  4: [
    'Cuando el arco del Infortunio con el Ascendente es cercano a los 90°, hay cuadratura entre Saturno y Marte: «la cuerda está tensa». Desde el hogar o el negocio personal surge una situación difícil que puede terminar mal, con sensación de mengua o pérdida si el parte está regido por un infortuna; si lo rige Venus o Júpiter, la pérdida no es grave: un mal trago, un susto o un problema con solución.',
    'A veces el parte se traduce en sentirse atado a un lugar en contra de la voluntad, o a un negocio que no deja tiempo para nada. En los peores casos: enfermedades en personas mayores de la familia, o la venta o pérdida de una casa o tierras con arraigo —la casa de los abuelos, de los padres, el negocio propio—.',
  ],
  5: [
    'En general —y en especial para quienes tienen hijos—, año de ataduras severas causadas por los hijos: obligaciones ineludibles que consumen más energía y tiempo de lo habitual. Cuando el arco con el Ascendente ronda los 120°, Saturno y Marte parten de un trígono —intenciones creadoras y conservadoras—, y las gestiones buscan beneficiarles, más aún con un regente fortuna.',
    'Al margen de los hijos, el Infortunio puede señalar el final de una relación íntima, un amor que hay que dejar por imposible o dificultades para seguir disfrutando de la vida sexual: liberación si el arco es de 120° y el regente es fortuna; penoso si lo rige un infortuna. También puede tocar las creaciones, las inversiones o el juego, con pérdidas o malas inversiones.',
  ],
  6: [
    'En esta casa, el Infortunio no siempre se manifiesta como enfermedades: depende mucho del arco con el Ascendente y del regente. Con arco cercano a los 150° (quincuncio positivo), Saturno pasa en su atacir anual por el trígono de Marte: nuevas oportunidades laborales, ayudas o decisiones de otros que favorecen la vida laboral o ayudan a emprender un trabajo remunerado, sobre todo con regente fortuna.',
    'Con arco cercano a los 160° (nonagon), una circunstancia que se vive como descanso: desde una gripe o enfermedad leve que obliga a dejar el trabajo unos días hasta sentirse muy atado a los empleados o ver cómo alguno intenta liberarse al tiempo que busca su beneficio. En los peores casos: enfermedades análogas al regente de la casa VI, que requieren terapias y descanso.',
  ],
  7: [
    'Con el Infortunio en la casa VII, cerca del Descendente, Saturno y Marte están cercanos a la oposición: enfrentamientos y tensiones de difícil solución. Las heridas en las relaciones de pareja, con socios o competidores pueden ser fatales o irrecuperables si el parte está regido por un infortuna: el principio de una fractura, una ruptura o una separación.',
    'Si el Infortunio está en la casa VII pero junto a los 10° del Descendente —arco de 160° con el Ascendente (nonagon)—, las tensiones se transforman en separaciones suaves, libertades nuevas o contactos que permiten pensar en colaboraciones o asociaciones. Si está a finales de la casa VII, cerca de los 150°, el significado vuelve a cambiar: decisiones del socio, los colaboradores o la pareja para mantenernos más atados, agradable o insatisfactoriamente según el regente.',
  ],
  8: [
    'En la casa VIII tiene diferentes lecturas, además de las relacionadas con la muerte. En general, año que anuncia sufrimientos serios a causa de la economía: decisiones ajenas que afectan a los bienes, el dinero o la actividad propia.',
    'Suele ocurrir cuando falta liquidez para afrontar una deuda o unos pagos y los demás cortan el suministro o se rompen las relaciones comerciales y económicas: para algunos, arruinarse y perder buena parte de los bienes. Con regentes afortunados (Júpiter, Venus), aun con la crisis se pueden salvar bienes y dinero depositándolos en la pareja o en una persona de confianza; en el peor de los casos, embargos o pagos forzosos que ponen entre la espada y la pared. Solo a veces anuncia la muerte de un familiar, y para ello hace falta una conjunción con un planeta infortunado.',
  ],
  9: [
    'El Infortunio en la casa IX admite varias lecturas según el ángulo y el regente. A 120° del Ascendente: año de detenerse a reflexionar sobre temas religiosos, espirituales o filosóficos, con los asuntos de otros países o de personas extranjeras en primer plano, y a la vez una dificultad o atadura que entorpece esos encuentros. A veces, retenciones o retrasos en los viajes que esconden ventaja o suerte; o librarse de una creencia o de un maestro que condicionaba en exceso el pensamiento.',
    'Con ángulo cercano a los 135°: dejar un lugar, interrumpir estudios, cancelar un viaje, romper una relación o sufrir un sinsabor; sentirse atado al lugar de trabajo o a un personaje insoportable; maestros que infunden temor y malestar.',
  ],
  10: [
    'En la casa X, el Infortunio deja alguna huella en el plano social: los asuntos profesionales o la vida social se alteran por sucesos desafortunados contrarios a los propósitos. Con el ángulo cercano a los 90° y regente infortuna, hace temer un año en que se pierde el empleo, el cargo o la posición; a veces coincide con la muerte de un familiar importante —el padre— o con la pérdida de patrimonio.',
    'Con ángulo cercano a los 80° y regente fortuna: un descanso en la vida profesional, unas vacaciones merecidas, un respiro en las obligaciones. En conjunción con un planeta: fin de un cargo o de una posición social o profesional.',
  ],
  11: [
    'Con el Infortunio en la casa XI, los amigos desaparecen en algún sentido —muchas veces por cambios de residencia— o se dificulta enormemente el acceso a ellos; para los profesionales libres, pérdida de clientes o dificultades que ellos mismos padecen.',
    'Con ángulo cercano a los 60° y regente fortuna: desplazamientos en compañía de amigos a lugares un poco conflictivos, donde se pueden padecer robos o alguna pérdida. Con aspecto próximo a los 45°: conflictos, tensiones o celos causados por los amigos, que desembocan en situaciones embarazosas y dejan una huella profunda en esas relaciones. Para quien se dedica a la docencia: problemas, pérdidas o desencuentros con los alumnos.',
  ],
  12: [
    'En la casa XII, el Infortunio introduce asuntos que llevan a crearse deudas o a perder buena parte de la libertad personal. Con ángulo de 30° y regente fortuna (Júpiter): consecución de un crédito o préstamo que libra de una situación restrictiva —falta de casa, de salud o de trabajo—.',
    'Con arco cercano a los 45° y regente infortuna: año de muchas dificultades y pesares, en el que las acciones incorrectas del pasado se hacen presentes acumulando deudas o carencias —como el perro atado bajo la higuera a dos metros del agua: sin poder avanzar por el pasado, por lo irremediable o por la infracción de alguna ley—, lo que también puede llevar a pasar por un hospital o un lugar de encierro.',
  ],
};

// ============ part07 · atacires (guia, asc por casas 12, mc, planetas guia, sol, luna, venus, marte, saturno) ============
P.AT_GUIA = [
  'La carta de la revolución admite dos lecturas. La primera: contemplarla como los fotogramas de una película —el contenido está ahí, pero quieto, como un reloj parado—.',
  'La segunda y más importante es verla en movimiento, a través de las direcciones o atacires: todos los puntos de la carta avanzan un grado por día. Así, a los 30 días del cumpleaños el atacir del Ascendente llega a la cúspide de la casa II; a los 60, a la casa III; a los seis meses, al Descendente —con todos los planetas en oposición a la carta de partida—; y al acercarse los 30 días previos al siguiente cumpleaños, a la casa XII. Se forma un circuito anual completo: el Ascendente es la gran manecilla del reloj del año.',
  'Mientras recorre las casas, el atacir del Ascendente va formando conjunciones y aspectos con las cúspides y los planetas. La regla única de interpretación: los planetas escenifican su influencia cuando les llega el atacir del Ascendente —o al revés—; también cuando el atacir del Mediocielo llega al lugar de los planetas y viceversa, y cuando el atacir de un planeta llega al lugar de otro, especialmente si forman aspecto entre sí.',
  'Los planetas tienen doble naturaleza: la esencial —dejan notar su influencia a través de asuntos o personas afines— y la adquirida por la casa en que están, su regente y sus aspectos, que no admite recetario. La influencia se percibe a través de nuestros encuentros con otras personas: alegrías y disgustos, premios y castigos, todo lo que refleja la carta se expresa mediante la gente del entorno inmediato. (Las revoluciones solares no describen asuntos psicológicos; para eso están los atacires de ciclo largo.)',
  'La influencia de un atacir se nota unos 2° antes y 2° después de la llegada, es decir, a lo largo de dos, tres o cuatro días en torno a la fecha: asuntos de duración corta, como un viaje de fin de semana o un congreso.',
];
P.AT_ASC = {
  1: [
    'Los primeros treinta días posteriores al cumpleaños, el atacir del Ascendente atraviesa la casa I: primera etapa anual de autoafirmación y reajuste de relaciones. Es el mes en que sentimos la necesidad de cambiar o mejorar la imagen, comprar ropa nueva o adoptar roles y patrones de conducta para los objetivos del año, según el signo y los planetas que ocupen la casa I.',
    'Si ese año hay planetas en la casa VII —la de enfrente—, surgen tomas de posición frente a los demás, enfrentamientos o situaciones de dependencia: colaboradores, socios, pareja. Acuerdos favorables si hay planetas afortunados; conflictos y tensiones si son infortunados.',
  ],
  2: [
    'Hacia los 30 días, el atacir llega a la casa II: tiempo de adquisiciones y compras de todo tipo, de cambios en la manera de ganarse la vida, de balance y de cuentas —la cosecha del año—. Con buenos aspectos de planetas benéficos: ingresos o compras ventajosas; con aspectos tensos de infortunados: tensiones económicas por gastos difíciles de cubrir.',
    'En torno al día 33, todos los puntos forman el oncil (33°): días de acumular, como quien guarda los frutos en el granero y toma conciencia del trabajo del año. Si hay un planeta a 33° medidos desde el Ascendente (orbe 2°), la acumulación es más evidente.',
    'Cerca del día 40 es tiempo de recibir dinero o de cierto relax por los beneficios logrados o una buena compra. A mitad del segundo mes, la semicuadratura (45°) sube la adrenalina: días de gastos, pagos e inquietudes económicas —las causas las dirá el planeta que ocupe ese grado: malos aspectos con la casa V, gastos por hijos o amigos íntimos; con la casa XI, un amigo o allegado que pide dinero; con la casa VII, pagos ineludibles—.',
    'Antes de terminar el mes, hacia los 52 días, el septil trae sorpresas que muchas veces deprimen el ánimo: notificaciones de pagos que hay que aplazar.',
  ],
  3: [
    'Hacia los 60 días, al tercer mes, todos los puntos forman entre sí sextil, cuya influencia moviliza: días de movimiento, intercambio, escribir o leer más, desplazamientos inusuales y encuentros especiales.',
    'En torno al día 66, el bioncil: pequeños encuentros que son la gota que colma el vaso y llevan a romper ataduras y transgredir —la necesidad de liberarse de leyes o normas grupales—; el tipo de transgresión depende de los planetas de esa casa.',
    'A los 72 días toca estar con los cinco sentidos y esforzarse con la mente para modificar el entorno: cambios en el dormitorio o transformaciones en las relaciones sentimentales; máxima movilidad, momento oportuno para viajes y estudios. Hacia el día 80: relax y estado de felicidad, a menudo ligados a un viaje corto o un fin de semana señalado, de buena mesa y buena compañía.',
  ],
  4: [
    'Alrededor del día 90, el Ascendente llega a la casa IV: regreso a casa, trabajo y esfuerzo para adaptarse a la vida doméstica o diaria. Días como un lunes que se prolonga: la vida familiar toma protagonismo a lo largo del cuarto mes, y los primeros días suelen ser algo críticos —aquí se pagan las libertades o transgresiones de semanas anteriores—.',
    'Hacia el día 100 aparece un estado pletórico: final de la crisis y alguna libertad recuperada. Cinco días después, tiempo de sueño y retiro: introspección, quedarse en casa reposando o dormir más que en días anteriores.',
  ],
  5: [
    'Cerca del quinto mes, el Ascendente entra en la casa V: uno de los mejores meses del año. Sensación de que el tiempo juega a favor; moral alta, protección, armonía, placer, disfrute, sucesos afortunados. Mes de libertad creadora, con facilidad para integrarse y propalar obras, ideas o mercancías; casi siempre, experiencias divertidas de las que se sale indemne o gratificado.',
    'Para quienes tienen hijos: si hay infortunados en esa casa, padecimiento a causa de ellos. Y si el Sol o la Luna están implicados y la persona está en edad fértil, el paso del atacir del Ascendente sobre el Sol o la Luna puede coincidir con el nacimiento de un hijo o una hija: la regla única en acción.',
  ],
  6: [
    'Hacia el sexto mes, el Ascendente llega a la casa VI. Cerca del día 150 hay que tener precaución: alguien puede tomar una decisión que nos afecte —una pérdida de libertad, un traslado, trabajos impuestos—; las decisiones de los demás pueden perjudicar en este periodo. El mes trae alguna novedad que significa trabajo: cambio de horarios o tarea adicional inesperada.',
    'Hacia el día 160 aparece el respiro en medio de la actividad: relax o compensación, a veces un viaje de trabajo que rompe la rutina. Con infortunados en la casa o aspectos tensos: alteraciones de salud por exceso de trabajo o mal ambiente.',
  ],
  7: [
    'Al cumplirse el medio año, el Ascendente cruza la casa VII: etapa en la que hay que contar con los demás para cubrir los objetivos. Los primeros 20 días no están exentos de tensiones, tira y afloja o dependencias; toca enfrentarse o asociarse, competir por algo —un puesto, una persona, un trabajo, una meta—. Es el momento de darse cuenta de que hay alguien enfrente a quien rendir cuentas o con quien contar.',
    'Con infortunados y malos aspectos: conflictos severos, luchas y enfrentamientos que pueden llevar a ruptura, separación o divorcio. Con buenos planetas y buenos aspectos: unión, asociación, matrimonio, cargos públicos o éxito social. Después, un tiempo de relax, tregua o viaje de placer.',
  ],
  8: [
    'El octavo mes se inicia con cierta inquietud, con algún miedo a perder algo; casi siempre alguien toma una decisión que nos va a afectar —un lugar, una labor, un encuentro— que no nace de nuestra voluntad y que se percibirá abiertamente a principios del noveno mes. Aunque al principio inquieten, esas decisiones de otros suelen ser favorables.',
    'La mayor parte del mes es tiempo de reformas o renuncias; con planetas infortunados y malos aspectos, pérdidas de relaciones, pagos importantes o bloqueos desagradables. Si hay varios aspectos tensos sobre planetas como la Luna, hay que temer una crisis importante con enfermedad grave o pérdida de un ser querido. La época más difícil o crítica del año se centra en la mitad de este octavo mes.',
  ],
  9: [
    'La entrada en el noveno mes suele ser un respiro, un alivio, una mejora en algún sentido, o el fin de tensiones, miedos e inquietudes: se reciben ayudas o apoyos que hacen sentirse más libre o más ligero de cargas.',
    'Con planetas afortunados y buenos aspectos —en especial Júpiter o sus conexiones—: viajes especiales o desplazamientos a lugares desconocidos; con Saturno, viajes donde se ve la miseria. Para algunos, tiempo de peregrinaje; para otros, de espectáculos excepcionales; para unos pocos, de terminar estudios. Lo normal del mes: cambios en el lugar de trabajo, gratos con afortunados y desagradables con infortunados —con cuadraturas hacia las casas VI o XII, crisis laboral—.',
  ],
  10: [
    'La entrada en el décimo mes siempre implica un esfuerzo, una acción o una actitud contraria a la voluntad que obliga a presentarse en público —un acto familiar, profesional o social— y mostrar la personalidad social.',
    'Con planetas afortunados o el Sol bien aspectado: reconocimiento profesional, mejora de puesto, nuevo cargo, mejor posición o incrementos importantes. Con infortunados y malos aspectos: crisis de las condiciones sociales, familiares o profesionales. Es el mes de ponerse a prueba y demostrar las capacidades, que dependerán de la actitud social del planeta presente o regente de ese lugar.',
  ],
  11: [
    'El undécimo mes del año personal se inicia con un pequeño viaje, una comida con amigos o clientes, o una salida: un oasis gratificante donde llegan las compensaciones por el trabajo del año. Suele ser el mes más afortunado: se puede tratar libremente, sin ataduras, y hay más tiempo para los amigos.',
    'Con Venus o planetas conectados: algo que celebrar con los afectos —la pareja formal o la persona que nos gusta—; también es una de las señales de premios, sobre todo por oposición. Con infortunados como Saturno aspectando a la casa II: un amigo o cliente pide un préstamo o un aval y luego no cumple su palabra, dejando mal sabor de boca. Frecuentes: viajes en compañía, celebraciones y comidas.',
  ],
  12: [
    'Al llegar el duodécimo mes —unos 30 días antes del cumpleaños—, es el momento de recuperar algo: la ventaja resultante de las acciones del año, lo que se salva, las reservas que quedan hasta el nuevo ciclo. El mes va oscureciendo las perspectivas hasta dejarnos un poco perdidos, aislados o desconcertados.',
    'Con planetas afortunados: estancia en un lugar apartado —un estupendo hotel con Júpiter; un paraje bucólico con experiencias de amor con Venus—; con Neptuno y varios malos aspectos de infortunados: un lugar sombrío que puede sentirse como calabozo u hospital. Saturno aquí no es tan maléfico como se imagina: salvo malos aspectos, señala un tiempo de reflexión y retiro provechoso, como estudiar en un lugar apartado para preparar exámenes.',
  ],
};
P.AT_MC = [
  'El Mediocielo (MC) es el segundo ángulo importante de la carta: con su atacir —siempre a razón de un grado por día— funciona como otra gran manecilla de reloj; cada vez que llega al lugar de un planeta escenifica el guion que ese planeta lleva escrito, haciéndolo público y notorio.',
  'Lo normal es que refleje asuntos, eventos o encuentros de dos o tres días de duración —como un viaje de fin de semana del que todo el mundo se entera—. Lo más interesante: conforme va alcanzando a los planetas, hace público su contenido, con una importancia que depende de las astrodinas del planeta y de los asuntos de su casa.',
];
P.AT_PLAN_GUIA = [
  'Cuando se mueven por atacir, el Sol y los demás planetas llevan consigo su naturaleza esencial y arrastran la adquirida por su casa. Un Venus de casa I arrastra belleza y lozanía; Júpiter, expansión; Saturno, contracción o disminución.',
  'En la casa I todo esto afecta principalmente al cuerpo: los atacires de Saturno señalan momentos en que se pierde peso —disgustos, falta de descanso, control de la alimentación—; los de Júpiter, viajes, descansos placenteros, comidas sabrosas y el consiguiente aumento de peso.',
  'Los planetas de la casa I —o su regente— ejercen de alfareros y nuestro cuerpo es el barro: un Marte alfarero puede adelgazar y aumentar la musculatura —buen año para empezar a hacer ejercicio; si no se le deja fluir, quemaduras, accidentes y operaciones—. Un planeta presente influye más que el regente: no es lo mismo un Saturno en la casa II —control sobre el dinero, cuesta llegar a fin de mes— que un Venus —prendas y objetos de belleza— o un Urano —elementos informáticos o telefónicos—. Así, cada planeta adquiere su significado según la casa que ocupa.',
];
P.AT_SOL = [
  'El atacir del Sol arrastra su naturaleza esencial —el protagonismo, la autoridad, el mostrarse— y, cuando llega al lugar de otros planetas, escenifica los días en que uno actúa con autoridad o se hace visible ante los demás. En cartas mundanas, los pasos del Sol por las casas de lo público marcan proclamaciones, tomas de posesión y actos solemnes; en lo personal, los días en que uno se presenta y es reconocido.',
];
P.AT_LUNA = [
  'La Luna arrastra en sus atacires su naturaleza esencial: para las mujeres en edad adecuada, la maternidad. Un atacir de la Luna llegando al Nodo Norte de la Luna en la casa I —la puerta que se abre en el cuerpo para ser madre— es uno de los pasos clásicos que sincronizan con un embarazo y un parto.',
];
P.AT_VENUS = [
  'La influencia de Venus también se escenifica a través de las hijas: el paso del atacir de Venus por el Sol o por los puntos de la casa V sincroniza con nacimientos y con los episodios clave de la vida afectiva. El resto de la carta —oposiciones, conjunciones, la posición de la Luna— matiza si el episodio resulta extraordinario o asistido.',
];
P.AT_MARTE = [
  'Los atacires de Marte arrastran su naturaleza: acción, corte, esfuerzo, riesgo. En años con Marte afligido, sus pasos pueden sincronizar con accidentes, operaciones o episodios de violencia; bien aspectado e integrado, con decisiones valientes, deporte y cirugías que salen bien.',
];
P.AT_SATURNO = [
  'Saturno deja notar su influencia según la casa que ocupe: en la casa I representa a la misma persona, y sus atacires muestran cómo se mueve la persona a lo largo del año. Un atacir de Saturno hacia la casa IX, por ejemplo, acompaña los desplazamientos a lugares duros o lejanos; el regente del año y los aspectos dirán la tónica del paso.',
];

// ============ part08 · relocacion + fortuna-guia + fortuna-afortunar + regente-casa (12) ============
P.RELOC = [
  'La relocación —contracción de recolocación— es colocarse en el lugar adecuado el día del cumpleaños para obtener la carta del año en las mejores condiciones: volver a situarse, en el sentido más literal. Es una técnica polémica —acto de fe para unos, acto de libertad para otros—, pero su función principal es clara: evitar que planetas dañinos o dañados queden en la casa XII, el escenario de las enfermedades, porque la experiencia muestra que esa posición suele arrastrar males de salud.',
  'Solo quien lo ha experimentado está en posición de aceptarlo, y es normal dudar. La técnica funciona girando la carta como un caleidoscopio: al cambiar de lugar, los planetas cambian de casas —los de la XII pasan a la XI, de la casa de los «castigos» a la de los «premios», y Saturno puede pasar de la VII a la V, la casa de los hijos—.',
  'Se considera necesario cambiar de localidad el día del cumpleaños cuando concurren estos factores: 1) hay planetas maléficos o dañados en la casa XII; 2) hay planetas maléficos formando malos aspectos en la casa VIII; y 3) por precaución, cuando concurren planetas dañados o dañinos en la casa VI. Conviene además relocar cuando el Parte del Infortunio queda a menos de 2° de un planeta de la revolución.',
  'En los años en que Marte y Urano forman malos aspectos, conviene observar el Parte de los Accidentes —el arco que separa a Marte de Urano, añadido al Ascendente—: si el parte se sitúa sobre un planeta, se separa más de 2° mediante la relocación adecuada, y así se esquivan accidentes.',
  'La relocación es la terapia preventiva del astrólogo: el remedio sencillo que ayuda a evitar las malas influencias que pueden reflejar enfermedades, muertes o daños de cualquier tipo. En ese sentido, el astrólogo se parece al antiguo médico chino: su objetivo es mantener la salud, no tratar la enfermedad ya declarada.',
  'Una de sus mejores funciones es la ayuda a la maternidad: potenciar la influencia de la Luna —situarla en el mismo grado del Ascendente, por ejemplo— facilita el embarazo y el parto. Es donde más éxitos se cosechan; y el paso del atacir de la Luna por el Mediocielo suele acompañar el nacimiento.',
  'En definitiva: la revolución y las relocaciones convierten al astrólogo en una suerte de genio de la lámpara, que ofrece elegir qué papel quiere cada uno tener en el teatro del año. La técnica permite tomar decisiones sobre lo que se quiere y lo que conviene: la mejor forma de prevenir.',
];
P.FORT_GUIA = [
  'Las enseñanzas tradicionales —Ben Ragel, Albubater, Ben Ezra, Morin de Villefranche— incluyeron siempre el Parte de Fortuna en la lectura de las revoluciones: un sistema muy extendido entre los astrólogos árabes, muy práctico, que se ha ido perdiendo con el tiempo.',
  'El Parte de Fortuna es el arco más importante de la carta de las revoluciones: se extrae añadiendo al Ascendente el arco de separación entre el Sol y la Luna. Tiene significado de amparo o suerte en el sector o la casa en que se sitúe, y adquiere interpretación especial cuando se encuentra en conjunción con un planeta: se dice que lo «afortuna», y los asuntos de ese planeta y de su casa serán afortunados ese año.',
  'La fortuna tiene coordenadas de tiempo, lugar y gente: se vincula a los encuentros con personas providenciales, en lugares adecuados y en momentos de máxima oportunidad. Puede favorecerse con la técnica de las relocaciones.',
  'Pensado en dinámico: cuando el atacir del Sol llegue al lugar de la Luna, el atacir del Ascendente estará sobre el punto señalado por el parte —y si en ese lugar hay un planeta, se añade su influencia a la del atacir del Sol sobre la Luna—. Es entonces cuando ocurren los sucesos providenciales, las coincidencias y los encuentros afortunados de los que se obtiene provecho, relacionado con la casa donde se ubica el parte.',
];
P.FORT_AFORT = [
  'Dentro de la técnica de las relocaciones, y como mejora de las condiciones de la carta del año, se puede modificar la carta para mejorar las posiciones de los planetas y cambiar la posición del Parte de Fortuna —que se mueve en función de la longitud del lugar donde se cumplan los años—. Son muchas las cosas que pueden hacerse para uno mismo, para clientes, parientes o amigos.',
  'Un ejemplo de escuela: una revolución que en la ciudad natal deja a la Luna al final de la casa VII —relaciones y pareja— recibiendo cuadratura del Sol, anuncia un conflicto que habrá que resolver ese año; y el Parte de Fortuna queda al final de la casa VIII, en zona de reposo, como un buen coche aparcado en el garaje que no se usa.',
  'Buscando un lugar hacia el este, el parte se coloca justo en la cúspide de la casa IV, entre Venus y Marte en trígono con la Luna: cuando llegue el atacir del Sol al lugar de la Luna —los dos o tres días en que se descarga la tensión de la cuadratura—, el atacir del Ascendente estará en el lugar del parte, entre Venus y Marte, cuya influencia facilita los acuerdos y las avenencias de toda clase. Así se «afortuna» el cielo del año y se suavizan las tensiones sociales.',
  'El Parte de Fortuna es «parada y fonda» en el largo camino del año: la casa en que se ubique señala el sector donde habrá beneficio, descanso, compensación o encuentros interesantes, según el planeta con el que se una. Mover la Fortuna es magia práctica: se deja de ser pasivo y se mueve el cielo propio para mejorar. La relocación rompe así el pensamiento determinista, porque reorienta el rumbo; y no hace falta creer en nada: basta con practicarla.',
  'Mejor decirle al consultante «vamos a preparar el año» que tratar de «adivinarle el año». La carta de la revolución es la agenda anual astrológica donde organizar los días, complemento de la agenda vulgar: en ella está el guion escrito para cada uno, y cada uno es el artista intérprete. Si se tiene apuntador, la obra del año puede ser perfecta; y aprender astrología permite retocar ese guion a gusto o necesidad. Esa es la única libertad que este arte ofrece.',
];
P.REG_CASA = {
  1: ['Puesta a punto del carácter y de las rutinas: el año remodela el rol personal.'],
  2: ['Temporada de ingresos por rentas, ventas y negocios.'],
  3: ['Estudiar, escribir, publicar, viajar, comunicar.'],
  4: ['Obras, arreglos y mejoras en la vivienda o en el negocio propio.'],
  5: ['Creatividad, fundar algo nuevo, los hijos.'],
  6: ['Nuevas habilidades laborales: ajustes de trabajo y rutina.'],
  7: ['Nuevos hábitos de colaboración con otros.'],
  8: ['Tiempo de cerrar asuntos del pasado.'],
  9: ['Nuevas conductas laborales: viajes, extranjero, estudios superiores.'],
  10: ['Innovación y crecimiento profesional.'],
  11: ['Esperanzas, anhelos y deseos nuevos.'],
  12: ['Tiempo de retiro, recogimiento o introspección.'],
};


// ---------- Composición (mismo orden, estructura y claves que el corpus) ----------
const entradas = [];
let vacias = 0;
const add = (t) => { if (!t || !t.length || t.some((p) => !p.trim())) vacias++; };
const push = (tipo, campos, texto) => { add(texto); entradas.push({ tipo, ...campos, texto }); };

for (let c = 1; c <= 12; c++) push('asc-casa-natal', { casa: c }, P.ASC_CASA[c]);
for (let c = 1; c <= 12; c++) push('mc-casa-natal', { casa: c }, P.MC_CASA[c]);
for (const s of ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis']) push('asc-signo', { signo: s }, P.ASC_SIGNO[s]);
push('asc-planeta', {}, P.ASC_PLANETA);
for (let c = 1; c <= 12; c++) push('sol-casa', { casa: c }, P.SOL_CASA[c]);
push('regente-guia', {}, P.REGENTE_GUIA);
push('astrodinas-intro', {}, P.ASTRO_INTRO);
push('astrodinas-aspectos', {}, P.ASTRO_ASPECTOS);
push('astrodinas-posicion', {}, P.ASTRO_POSICION);
for (const k of ['domicilio', 'exaltacion', 'sobre-tierra', 'oriental', 'directo', 'dodecatemoria', 'retrogrado', 'gozo', 'dispositor', 'destierro', 'caida', 'peregrino', 'recepcion']) push('astrodina-nota', { clave: k }, P.ASTRO_NOTA[k]);
for (let c = 1; c <= 12; c++) push('regente-casa-macia', { casa: c }, P.REG_CASA_MACIA[c]);
push('notas-aclaratorias', {}, P.NOTAS);
push('infortunio-guia', {}, P.INF_GUIA);
push('infortunio-conjuncion', {}, P.INF_CONJ);
for (let c = 1; c <= 12; c++) push('infortunio-casa', { casa: c }, P.INF_CASA[c]);
push('atacir-guia', {}, P.AT_GUIA);
for (let c = 1; c <= 12; c++) push('atacir-asc-casa', { casa: c }, P.AT_ASC[c]);
push('atacir-mc', {}, P.AT_MC);
push('atacir-planetas-guia', {}, P.AT_PLAN_GUIA);
push('atacir-sol', {}, P.AT_SOL);
push('atacir-luna', {}, P.AT_LUNA);
push('atacir-venus', {}, P.AT_VENUS);
push('atacir-marte', {}, P.AT_MARTE);
push('atacir-saturno', {}, P.AT_SATURNO);
push('relocacion', {}, P.RELOC);
push('fortuna-guia', {}, P.FORT_GUIA);
push('fortuna-afortunar', {}, P.FORT_AFORT);
for (let c = 1; c <= 12; c++) push('regente-casa', { casa: c }, P.REG_CASA[c]);

const corpus = {
  meta: {
    titulo: 'Revolución Solar — corpus de interpretación (redacción propia)',
    fuentes: [
      'Tito Maciá, «La Revolución Solar y sus Atacires» (técnica; TEXTOS DE REDACCIÓN PROPIA, 12-oct-2026)',
      '«Revolución Solar — Cómo Trabajarla» (metodología; textos de redacción propia)',
    ],
    tecnica: 'Superposiciones ASC/MC, Sol por casas, regente y astrodinas, Parte del Infortunio, atacires de la revolución, relocación y Parte de Fortuna.',
    total: entradas.length,
  },
  entradas,
};
writeFileSync('datos/revolucion-solar.json', JSON.stringify(corpus, null, 2), 'utf8');

const conteo = {};
for (const e of entradas) conteo[e.tipo] = (conteo[e.tipo] || 0) + 1;
const esperado = { 'asc-casa-natal': 12, 'mc-casa-natal': 12, 'asc-signo': 12, 'asc-planeta': 1, 'sol-casa': 12, 'regente-guia': 1, 'astrodinas-intro': 1, 'astrodinas-aspectos': 1, 'astrodinas-posicion': 1, 'astrodina-nota': 13, 'regente-casa-macia': 12, 'notas-aclaratorias': 1, 'infortunio-guia': 1, 'infortunio-conjuncion': 1, 'infortunio-casa': 12, 'atacir-guia': 1, 'atacir-asc-casa': 12, 'atacir-mc': 1, 'atacir-planetas-guia': 1, 'atacir-sol': 1, 'atacir-luna': 1, 'atacir-venus': 1, 'atacir-marte': 1, 'atacir-saturno': 1, 'relocacion': 1, 'fortuna-guia': 1, 'fortuna-afortunar': 1, 'regente-casa': 12 };
const ok = JSON.stringify(conteo) === JSON.stringify(esperado);
console.log(`OK: datos/revolucion-solar.json (${entradas.length} entradas) | vacías: ${vacias} | conteos: ${ok ? 'correctos' : 'DISTINTOS'}`);
if (!ok) { console.log(JSON.stringify(conteo)); }
if (vacias || !ok || entradas.length !== 128) process.exit(1);
