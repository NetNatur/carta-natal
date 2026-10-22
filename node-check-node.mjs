// node-check-node.mjs - nodo medio vs verdadero (Arturo 1957 y Londres 2025)
import { createSwissEph, Body, Flag } from './js/vendor/dist/index.js';
const swe = await createSwissEph();
swe.mountEphemerisDirectory('./datos/ephe');
console.log('swe keys:', Object.keys(swe).join(','));
console.log('Body keys:', Object.keys(Body).join(','));
console.log('Flag keys:', Object.keys(Flag).join(','));
const norm = d => ((d % 360) + 360) % 360;
const lon = r => (typeof r === 'number' ? r : Array.isArray(r) ? r[0] : (r && typeof r.longitude === 'number') ? r.longitude : null);
const fl = (Flag && (Flag.SwissEphemeris ?? Flag.SEFLG_SWIEPH)) ?? 2;
const calc = (jd, name, fallback) => {
  const body = (Body && Body[name] !== undefined) ? Body[name] : fallback;
  for (const fname of ['calc', 'calcUT', 'swe_calc_ut']) {
    try {
      const r = swe[fname](jd, body, fl);
      return { fn: fname, val: lon(r) };
    } catch (e) { last = e.message; }
  }
  let last = '';
  return { err: last };
};
const cases = [
  ['Arturo UT18:23:23', swe.julianDay(1957, 4, 30, 18 + 23/60 + 23/3600)],
  ['Arturo UT17:23:23', swe.julianDay(1957, 4, 30, 17 + 23/60 + 23/3600)],
  ['Londres 2025-01-01 12:00', swe.julianDay(2025, 1, 1, 12.0)],
];
for (const [tag, jd] of cases) {
  console.log('---', tag, '(jd ' + jd.toFixed(5) + ')');
  for (const [name, fb] of [['Sun',0],['Moon',1],['MeanNode',10],['TrueNode',11]]) {
    const r = calc(jd, name, fb);
    if (r.err) { console.log('   ', name, 'ERR', r.err); continue; }
    const v = r.val;
    console.log('   ', name, '=', v.toFixed(4), '-> int', Math.floor(norm(v)), '[' + r.fn + ']');
  }
}
