// Test de los términos egipcios (tabla de R. Gil) y su integración en el alcocoden.
// Uso: node test-terminos.mjs   (desde la carpeta carta-natal)
import { TERMINOS_EGIPCIOS, terminoDe } from './js/terminos.js';
import { hyleg, alcocoden } from './js/fichas-tema.js';

let fallos = 0;
const comprobar = (nombre, cond) => {
  console.log(`${cond ? '  OK  ' : 'FALLO '} ${nombre}`);
  if (!cond) fallos++;
};

// ---------- 1. Cada signo suma 30° ----------
console.log('== Suma 30° por signo ==');
for (const [signo, terminos] of Object.entries(TERMINOS_EGIPCIOS)) {
  const suma = terminos.reduce((s, [, tam]) => s + tam, 0);
  comprobar(`${signo}: suma ${suma}`, suma === 30);
}

// ---------- 2. Sumas por planeta = años mayores (verificación de Gil) ----------
console.log('== Sumas por planeta = años mayores ==');
const TOTALES_ESPERADOS = { Júpiter: 79, Venus: 82, Mercurio: 76, Marte: 66, Saturno: 57 };
const totales = {};
for (const terminos of Object.values(TERMINOS_EGIPCIOS)) {
  for (const [planeta, tam] of terminos) totales[planeta] = (totales[planeta] || 0) + tam;
}
for (const [planeta, esperado] of Object.entries(TOTALES_ESPERADOS)) {
  comprobar(`${planeta}: ${totales[planeta]} (esperado ${esperado})`, totales[planeta] === esperado);
}

// ---------- 3. Muestras conocidas ----------
console.log('== Muestras ==');
const PISCIS = 11 * 30; // 330
const CANCER = 3 * 30;
const ARIES = 0;
comprobar('Aries 0° → Júpiter', terminoDe(ARIES + 0).planeta === 'Júpiter');
comprobar('Aries 6° → Venus (borde)', terminoDe(ARIES + 6).planeta === 'Venus');
comprobar('Aries 5.9° → Júpiter', terminoDe(ARIES + 5.9).planeta === 'Júpiter');
comprobar('Tauro 8.5° → Mercurio', terminoDe(30 + 8.5).planeta === 'Mercurio');
comprobar('Cáncer 3° → Marte', terminoDe(CANCER + 3).planeta === 'Marte');
comprobar('Piscis 25° → Marte', terminoDe(PISCIS + 25).planeta === 'Marte');
comprobar('Acuario 7.5° → Mercurio (variante de Gil: Ve 6, Me 7, Ju 7, Ma 6, Sa 4)', terminoDe(10 * 30 + 7.5).planeta === 'Mercurio');
comprobar('Acuario 15° → Júpiter', terminoDe(10 * 30 + 15).planeta === 'Júpiter');
comprobar('Acuario 2° → Venus', terminoDe(10 * 30 + 2).planeta === 'Venus');
// Sol de Harald V: Piscis 2°27' → término de Venus
comprobar("Sol de Harald V (Piscis 2°27') → Venus", terminoDe(PISCIS + 2.45).planeta === 'Venus');
// Sol de Diana: Cáncer 9°04' → término de Venus (Marte 0-7, Venus 7-13)
comprobar("Sol de Diana (Cáncer 9°04') → Venus", terminoDe(CANCER + 9.07).planeta === 'Venus');
// Hileg de Aben Ragel: Sagitario en término de Júpiter → Sagitario 0° (0-12 Júpiter)
comprobar('Sagitario 5° → Júpiter (ejemplo del clásico)', terminoDe(8 * 30 + 5).planeta === 'Júpiter');

// ---------- 4. Alcocoden con términos (integración) ----------
console.log('== Alcocoden con términos ==');
const planetasPresentes = ['Sol', 'Luna', 'Mercurio', 'Venus', 'Marte', 'Júpiter', 'Saturno']
  .map((nombre) => ({ nombre, lon: 0 }));
// Hyleg en Cáncer 9° (como el Sol de Diana), carta diurna (triplicidad simplificada de la app):
// Cáncer 9° → término de Venus (7-13, +3) · domicilio Cáncer → Luna (5) · exaltación Cáncer → Júpiter (4)
// triplicidad Agua día → Marte (+2, no presente) · faz 0 (0-10) → Venus (+1)
const al = alcocoden(CANCER + 9.07, planetasPresentes, true);
comprobar(`alcocoden = Luna 5 (domicilio) y Venus suma 4 con el término (3 + faz 1)`, al.nombre === 'Luna' && al.pts === 5 && al.termino.planeta === 'Venus');
comprobar('alcocoden registra el término (Cáncer 7-13)', al.termino && al.termino.planeta === 'Venus' && al.termino.inicio === 7 && al.termino.fin === 13);
// El término decide: hyleg en Piscis 0.5° (nocturno) — Venus es exaltada (4) y regente del término (3) = 7 > Júpiter regente (5)
const al3 = alcocoden(11 * 30 + 0.5, planetasPresentes, false);
comprobar(`Piscis 0.5° nocturno → Venus 7 (exaltación 4 + término 3): el término decide sobre el regente`, al3.nombre === 'Venus' && al3.pts === 7);
// Escala nueva aplicada (término 3, triplicidad 2): hyleg en Virgo 3° (nocturno):
// Virgo 3° → término de Mercurio (0-7, +3) · domicilio Virgo → Mercurio (+5) · exaltación Virgo → Mercurio (+4) = 12 pts
const al2 = alcocoden(5 * 30 + 3, planetasPresentes, false);
comprobar(`Virgo 3° nocturno → Mercurio ganador (obtuvo ${al2.pts} pts: domicilio 5 + exaltación 4 + término 3)`, al2.nombre === 'Mercurio' && al2.pts === 12);

console.log(fallos === 0 ? '\n== TODO OK ==' : `\n== ${fallos} FALLO(S) ==`);
process.exit(fallos === 0 ? 0 : 1);