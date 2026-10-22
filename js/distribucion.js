// distribucion.js — modo de distribución de Carta Natal
//
// MODO = 'gratuito'  -> solo la ficha de Riqueza y bienes se muestra completa.
//                        El resto se reserva con un aviso ("Aquí su interpretación").
// MODO = 'completo'  -> todas las fichas (uso interno o versión de pago).
//
// Cambiar solo esta constante para pasar de una versión a otra.

export const MODO = 'gratuito';
export const TEMA_GRATUITO = 'riqueza';

export const AVISO_SALUD = `
  <div class="aviso-salud">
    <strong>Aviso:</strong> esta sección es un <strong>estudio experimental</strong> sobre las ideas
    antiguas de salud. No es consejo médico, no diagnostica ni prescribe.
    Consulta siempre a un profesional sanitario.
  </div>`;

export function temaBloqueado(id) {
  return MODO === 'gratuito' && id !== TEMA_GRATUITO;
}

export function placeholderTema(tema, chips) {
  const salud = tema.id === 'salud';
  return `
    <div class="fichas-tema">
      <div class="fichas-cabecera">
        <h2>Fichas por tema</h2>
        <p class="fichas-principio">Un tema se juzga por sus <strong>significadores</strong>, no por todos los factores de la carta.</p>
        <div class="chips">${chips}</div>
      </div>
      <div class="ficha-bloqueada">
        <div class="ficha-bloqueada-icono">🔒</div>
        <h3>${tema.glifo} ${tema.nombre}</h3>
        <p class="ficha-bloqueada-lead">Aquí su interpretación.</p>
        ${salud ? AVISO_SALUD : ''}
        <p>Esta ficha forma parte de la <strong>versión completa</strong>. El cálculo de la carta ya está hecho;
        la interpretación se puede encargar o adquirir próximamente.</p>
        <p><a href="https://arquetypo.uno/proyectos.html" target="_blank" rel="noopener">Más información</a></p>
      </div>
    </div>`;
}
