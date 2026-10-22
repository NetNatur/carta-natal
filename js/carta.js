// ============================================================
//  Carta Natal — dibujo de la rueda astrológica (Canvas)
//  Orientaciones: zodiacal (0° Aries a la izquierda, antihorario)
//  o por casas (Ascendente a la izquierda, los signos giran).
// ============================================================

export const GLIFOS_SIGNOS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
export const NOMBRES_SIGNOS = ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'];

const ELEMENTO = ['fuego', 'tierra', 'aire', 'agua', 'fuego', 'tierra', 'aire', 'agua', 'fuego', 'tierra', 'aire', 'agua'];
const COLOR_ELEMENTO = { fuego: '#ff8c5a', tierra: '#6fe3b0', aire: '#ffd75a', agua: '#6bc5ff' };
const COLOR_ASPECTO = {
  Conjunction: '#ff6b6b', Opposition: '#ff4f8c', Square: '#ff8c5a',
  Trine: '#5affa8', Sextile: '#6bc5ff',
};

export function gradosTexto(lon) {
  const s = Math.floor(lon / 30) % 12;
  const d = Math.floor(lon % 30);
  const m = Math.floor(((lon % 30) % 1) * 60);
  return `${GLIFOS_SIGNOS[s]} ${d}°${String(m).padStart(2, '0')}'`;
}

export function dibujarCarta(canvas, datos) {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth || 600;
  const h = canvas.clientHeight || 600;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const { planetas = [], cusps = [], asc = 0, mc = 0, aspectos = [], orientacion = 'zodiacal', referencia = null } = datos;
  // Modo zodiacal: 0° Aries a la izquierda y los grados crecen en sentido horario
  // en pantalla (Tauro abajo-izquierda → Géminis abajo → Cáncer abajo-derecha →
  // Leo derecha → Virgo arriba-derecha → Libra arriba). Eje Aries-Libra horizontal.
  // Es la carta clásica espejo: ángulo = 180° − longitud.
  // Modo casas: el Ascendente a la izquierda; los signos giran alrededor de las
  // casas fijas (ángulo = 180° − (longitud − ASC)).
  const offset = orientacion === 'casas' ? (asc || 0) : 0;
  const ang = (lon) => (offset - lon + 180) * Math.PI / 180;

  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) / 2 - 6;
  const rOut = R;                 // borde exterior (signos)
  const rSignos = R * 0.82;       // borde interior del anillo de signos
  const rCasas = R * 0.64;        // borde interior del anillo de casas
  const rAsp = R * 0.52;          // radio de los aspectos
  const rPlanetas = R * 0.56;     // radio base de los planetas

  // ---------- Anillo de signos ----------
  for (let i = 0; i < 12; i++) {
    // En la orientación espejo los ángulos decrecen con la longitud (a2 < a1).
    // Elegimos el flag anticlockwise para recorrer siempre el arco corto (30°).
    const a1 = ang(i * 30), a2 = ang((i + 1) * 30);
    const ccw = a2 < a1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a1) * rOut, cy + Math.sin(a1) * rOut);
    ctx.arc(cx, cy, rOut, a1, a2, ccw);
    ctx.arc(cx, cy, rSignos, a2, a1, !ccw);
    ctx.closePath();
    ctx.fillStyle = i % 2 === 0 ? 'rgba(24, 32, 70, 0.55)' : 'rgba(29, 39, 82, 0.55)';
    ctx.fill();

    const am = ang(i * 30 + 15);
    ctx.fillStyle = COLOR_ELEMENTO[ELEMENTO[i]];
    ctx.font = `600 ${rOut * 0.085}px 'AstroSymbols', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(GLIFOS_SIGNOS[i], cx + Math.cos(am) * (rOut + rSignos) / 2, cy + Math.sin(am) * (rOut + rSignos) / 2);
  }

  // ---------- Ticks de grado ----------
  for (let g = 0; g < 360; g += 5) {
    const a = ang(g);
    const borde = g % 30 === 0;
    const decano = g % 10 === 0;
    const len = borde ? 13 : decano ? 7 : 4;
    ctx.strokeStyle = borde ? 'rgba(201, 163, 92, 0.85)' : 'rgba(168, 176, 204, 0.35)';
    ctx.lineWidth = borde ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * (rOut - len), cy + Math.sin(a) * (rOut - len));
    ctx.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
    ctx.stroke();

    if (decano && g % 30 !== 0) {
      const rN = rSignos + (rOut - rSignos) * 0.42;
      ctx.fillStyle = 'rgba(168, 176, 204, 0.8)';
      ctx.font = `${rOut * 0.042}px sans-serif`;
      ctx.fillText(String(g % 30), cx + Math.cos(a) * rN, cy + Math.sin(a) * rN);
    }
  }

  // ---------- Casas ----------
  if (cusps.length >= 12) {
    for (let i = 0; i < 12; i++) {
      const a = ang(cusps[i]);
      ctx.strokeStyle = 'rgba(201, 163, 92, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rSignos, cy + Math.sin(a) * rSignos);
      ctx.lineTo(cx + Math.cos(a) * rCasas, cy + Math.sin(a) * rCasas);
      ctx.stroke();

      const medio = (((cusps[(i + 1) % 12] - cusps[i] + 360) % 360) / 2 + cusps[i]) % 360;
      const am = ang(medio);
      ctx.fillStyle = '#c9a35c';
      ctx.font = `600 ${rCasas * 0.085}px sans-serif`;
      ctx.fillText(String(i + 1), cx + Math.cos(am) * (rSignos + rCasas) / 2, cy + Math.sin(am) * (rSignos + rCasas) / 2);
    }
  }

  // ---------- ASC / MC ----------
  for (const [lon, label, color] of [[asc, 'ASC', '#ff8c5a'], [mc, 'MC', '#6bc5ff']]) {
    const a = ang(lon);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a) * rCasas, cy + Math.sin(a) * rCasas);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = `700 ${R * 0.05}px sans-serif`;
    ctx.fillText(label, cx + Math.cos(a) * (rCasas + R * 0.055), cy + Math.sin(a) * (rCasas + R * 0.055));
  }

  // ---------- Carta de referencia superpuesta ----------
  // (p. ej. la natal bajo la revolución solar): cúspides, ASC/MC y planetas
  // en azul tenue, para ver la superposición de ambas cartas.
  if (referencia && referencia.cusps && referencia.cusps.length >= 12) {
    const rRef = rPlanetas - 0.085 * R; // radio interior para los planetas de referencia
    for (let i = 0; i < 12; i++) {
      const a = ang(referencia.cusps[i]);
      ctx.strokeStyle = 'rgba(107, 197, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rSignos, cy + Math.sin(a) * rSignos);
      ctx.lineTo(cx + Math.cos(a) * rCasas, cy + Math.sin(a) * rCasas);
      ctx.stroke();
      ctx.setLineDash([]);

      const medio = (((referencia.cusps[(i + 1) % 12] - referencia.cusps[i] + 360) % 360) / 2 + referencia.cusps[i]) % 360;
      ctx.fillStyle = 'rgba(107, 197, 255, 0.5)';
      ctx.font = `600 ${rCasas * 0.058}px sans-serif`;
      ctx.fillText(String(i + 1), cx + Math.cos(ang(medio)) * (rSignos - R * 0.03), cy + Math.sin(ang(medio)) * (rSignos - R * 0.03));
    }
    // ASC / MC de la referencia (discontinuos, etiqueta pequeña)
    for (const [lon, label] of [[referencia.asc || 0, 'ASC n'], [referencia.mc || 0, 'MC n']]) {
      if (!lon) continue;
      const a = ang(lon);
      ctx.strokeStyle = 'rgba(107, 197, 255, 0.5)';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * rCasas, cy + Math.sin(a) * rCasas);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(107, 197, 255, 0.65)';
      ctx.font = `600 ${R * 0.03}px sans-serif`;
      ctx.fillText(label, cx + Math.cos(a) * (rCasas - R * 0.02), cy + Math.sin(a) * (rCasas - R * 0.02));
    }
    // Planetas de la referencia (glifo + nombre pequeños, azul tenue)
    if (referencia.planetas && referencia.planetas.length) {
      const ordenados = [...referencia.planetas].sort((a, b) => a.lon - b.lon);
      const grupos = [];
      for (const p of ordenados) {
        const g = grupos.find((gr) => Math.abs((p.lon - gr.lon + 540) % 360 - 180) < 5);
        if (g) { g.items.push(p); g.lon = (g.lon + p.lon) / 2; }
        else grupos.push({ lon: p.lon, items: [p] });
      }
      for (const g of grupos) {
        g.items.forEach((p, i) => {
          const r = rRef + (i % 4) * 0.07 * R;
          const a = ang(p.lon);
          const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = '#6bc5ff';
          ctx.font = `600 ${R * 0.045}px 'AstroSymbols', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif`;
          ctx.fillText(p.glifo, x, y - R * 0.008);
          ctx.fillStyle = 'rgba(140, 190, 235, 0.8)';
          ctx.font = `${R * 0.023}px sans-serif`;
          ctx.fillText(p.nombre, x, y + R * 0.04);
          ctx.globalAlpha = 1;
        });
      }
    }
  }

  // ---------- Aspectos ----------
  const pos = new Map(planetas.map((p) => [p.id, ang(p.lon)]));
  for (const asp of aspectos) {
    const a1 = pos.get(asp.de), a2 = pos.get(asp.a);
    if (a1 === undefined || a2 === undefined) continue;
    const alpha = 0.15 + 0.6 * (1 - Math.min(1, asp.orb / (asp.maxOrb || 8)));
    ctx.strokeStyle = COLOR_ASPECTO[asp.tipo] || '#9aa3c0';
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a1) * rAsp, cy + Math.sin(a1) * rAsp);
    ctx.lineTo(cx + Math.cos(a2) * rAsp, cy + Math.sin(a2) * rAsp);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // ---------- Planetas (con separación de colisiones) ----------
  const ordenados = [...planetas].sort((a, b) => a.lon - b.lon);
  const grupos = [];
  for (const p of ordenados) {
    const g = grupos.find((gr) => {
      const d = Math.abs((p.lon - gr.lon + 540) % 360 - 180);
      return d < 5;
    });
    if (g) { g.items.push(p); g.lon = (g.lon + p.lon) / 2; }
    else grupos.push({ lon: p.lon, items: [p] });
  }
  for (const g of grupos) {
    g.items.forEach((p, i) => {
      const r = rPlanetas + (i % 4) * 0.085 * R;
      const a = ang(p.lon);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;

      ctx.fillStyle = '#f0e6c8';
      ctx.font = `600 ${R * 0.062}px 'AstroSymbols', 'Segoe UI Symbol', 'Arial Unicode MS', sans-serif`;
      ctx.fillText(p.glifo, x, y - R * 0.012);

      ctx.fillStyle = 'rgba(232, 230, 223, 0.85)';
      ctx.font = `${R * 0.031}px sans-serif`;
      ctx.fillText(p.nombre, x, y + R * 0.052);

      if (p.retro) {
        ctx.fillStyle = '#ff8c5a';
        ctx.font = `600 ${R * 0.03}px sans-serif`;
        ctx.fillText('R', x + R * 0.05, y - R * 0.032);
      }
    });
  }

  // ---------- Centro ----------
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#101731';
  ctx.fill();
  ctx.strokeStyle = 'rgba(201, 163, 92, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const nombre = (datos.nombre || '').length > 24 ? (datos.nombre || '').slice(0, 22) + '…' : (datos.nombre || '');
  ctx.fillStyle = '#c9a35c';
  ctx.font = `600 ${R * 0.05}px Georgia, serif`;
  ctx.fillText(nombre, cx, cy - R * 0.08);
  ctx.fillStyle = 'rgba(232, 230, 223, 0.85)';
  ctx.font = `${R * 0.033}px sans-serif`;
  ctx.fillText(datos.fechaTexto || '', cx, cy + R * 0.005);
  ctx.fillText(datos.lugarTexto || '', cx, cy + R * 0.06);

  // ---------- Marco ----------
  ctx.beginPath();
  ctx.arc(cx, cy, rOut, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(201, 163, 92, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}
