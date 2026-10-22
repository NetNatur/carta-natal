// Verificación de fiabilidad del motor contra astrodata (carta-natal.es):
// Sol, Luna y ASC de Alfonso XIII y Carlos IV, probando hipótesis de TZ.
// Uso: node test-astrodata.mjs
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';

const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');
const SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];

function texto(lon) {
  lon = ((lon % 360) + 360) % 360;
  const signo = SIGNOS[Math.floor(lon / 30)];
  const g = lon - Math.floor(lon / 30) * 30;
  const gr = Math.floor(g), min = Math.floor((g - gr) * 60), sec = Math.round(((g - gr) * 60 - min) * 60);
  return `${signo} ${gr}°${String(min).padStart(2, '0')}'${String(sec).padStart(2, '0')}"`;
}

const CASOS = [
  {
    nombre: 'Alfonso XIII (Madrid)',
    fecha: [1886, 5, 17], horaLocal: 12.5, lat: 40.4168, lon: -3.7038,
    ref: { sol: 30 + 26 + 29 / 60 + 34 / 3600, luna: 210 + 19 + 44 / 60 + 53 / 3600, asc: 150 + 8 + 16 / 60 + 47 / 3600 },
    tzs: [
      ['GMT+0 (hora civil de Madrid de la época)', 0],
      ['LMT Madrid 3°42\'W (-0h14m44s)', -3.7 / 15],
      ['CET +1 (implausible para 1886, control)', 1],
    ],
  },
  {
    nombre: 'Carlos IV (Portici, Nápoles)',
    fecha: [1748, 11, 11], horaLocal: 3.0, lat: 40.8518, lon: 14.2486,
    ref: { sol: 210 + 19 + 6 / 60 + 32 / 3600, luna: 90 + 25 + 32 / 60 + 7 / 3600, asc: 180 + 4 + 24 / 60 + 48 / 3600 },
    tzs: [
      ['LMT Nápoles 14°15\'E (+0h57m)', 14.25 / 15],
      ['CET +1 (control)', 1],
      ['GMT+0 (control)', 0],
    ],
  },
];

for (const c of CASOS) {
  console.log(`\n===== ${c.nombre} =====`);
  console.log(`Referencia astrodata: Sol ${texto(c.ref.sol)} | Luna ${texto(c.ref.luna)} | ASC ${texto(c.ref.asc)}`);
  for (const [nombreTZ, tz] of c.tzs) {
    const jd = swe.julianDay(c.fecha[0], c.fecha[1], c.fecha[2], c.horaLocal - tz);
    const sol = swe.calcWithSign(jd, Body.Sun).longitude;
    const lun = swe.calcWithSign(jd, Body.Moon).longitude;
    const h = swe.houses(jd, c.lat, c.lon, 'P');
    const errSol = Math.abs(sol - c.ref.sol);
    const errLun = Math.abs(lun - c.ref.luna);
    let errAsc = Math.abs(h.ascendant - c.ref.asc); if (errAsc > 180) errAsc = 360 - errAsc;
    const veredicto = errSol < 0.05 && errLun < 0.05 && errAsc < 0.3 ? ' ★ COINCIDE' : '';
    console.log(`  TZ ${nombreTZ}:`);
    console.log(`    Sol ${texto(sol)} (Δ ${errSol.toFixed(3)}°) | Luna ${texto(lun)} (Δ ${errLun.toFixed(3)}°) | ASC ${texto(h.ascendant)} (Δ ${errAsc.toFixed(3)}°)${veredicto}`);
  }
}
swe.dispose();