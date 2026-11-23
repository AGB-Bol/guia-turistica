/**
 * Página principal: pinta
 *  1. Carrusel de EMPRESAS en 3 filas (izq→der, der→izq, izq→der) desde window.LOGOS_EMPRESAS
 *  2. Slider de ALIADOS (9 por página) desde window.ALIADOS
 * Los datos se editan en data/patrocinadores.js
 */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---------------- EMPRESAS ----------------
  function pintarEmpresas() {
    var cont = document.getElementById('empresas-filas');
    var logos = window.LOGOS_EMPRESAS || [];
    if (!cont || !logos.length) return;

    var velocidades = ['animate-marquee-lento', 'animate-marquee-medio', 'animate-marquee-rapido'];
    var filas = [[], [], []];
    logos.forEach(function (l, i) { filas[i % 3].push(l); });

    function tarjeta(l, oculto) {
      return '<div class="w-44 h-24 sm:w-56 sm:h-28 shrink-0 bg-white rounded-xl border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] flex items-center justify-center p-3">' +
        '<img src="img/empresas/' + esc(l.archivo) + '" alt="' + (oculto ? '' : esc(l.nombre)) + '" loading="lazy" decoding="async" class="max-h-full max-w-full object-contain"></div>';
    }
    function grupo(fila, oculto) {
      return '<div class="flex items-center gap-6 shrink-0 pr-6"' + (oculto ? ' aria-hidden="true"' : '') + '>' +
        fila.map(function (l) { return tarjeta(l, oculto); }).join('') + '</div>';
    }

    cont.innerHTML = filas.map(function (fila, i) {
      var reversa = i === 1 ? ' animate-marquee-reverse' : '';
      return '<div class="animate-marquee ' + velocidades[i] + reversa + '">' + grupo(fila, false) + grupo(fila, true) + '</div>';
    }).join('');
  }

  // ---------------- ALIADOS ----------------
  function pintarAliados() {
    var track = document.getElementById('aliados-track');
    var aliados = window.ALIADOS || [];
    if (!track || !aliados.length) return;

    var porPagina = 9;
    var paginas = [];
    for (var i = 0; i < aliados.length; i += porPagina) paginas.push(aliados.slice(i, i + porPagina));

    track.innerHTML = paginas.map(function (pag) {
      return '<div class="aliados-pagina snap-start shrink-0 w-full px-2"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">' +
        pag.map(function (a) {
          return '<article class="bg-white border-2 border-slate-900 rounded-2xl p-5 flex flex-col shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition duration-200">' +
            '<div class="h-24 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 p-3 mb-4">' +
              '<img src="img/empresas/' + esc(a.archivo) + '" alt="Logo de ' + esc(a.nombre) + '" loading="lazy" decoding="async" class="max-h-full max-w-full object-contain"></div>' +
            '<span class="self-start text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border-2 border-red-100 bg-red-50 text-red-700">' + esc(a.categoria) + '</span>' +
            '<h3 class="text-base font-bold text-slate-900 mt-2 leading-snug">' + esc(a.nombre) + '</h3>' +
            '<p class="text-sm text-slate-600 mt-1.5 leading-relaxed">' + esc(a.descripcion) + '</p>' +
          '</article>';
        }).join('') + '</div></div>';
    }).join('');

    var prev = document.getElementById('aliados-prev');
    var next = document.getElementById('aliados-next');
    var etiqueta = document.getElementById('aliados-pagina');

    function paginaActual() {
      return Math.round(track.scrollLeft / track.clientWidth);
    }
    function actualizar() {
      var p = Math.min(paginaActual(), paginas.length - 1);
      if (etiqueta) etiqueta.textContent = (p + 1) + ' / ' + paginas.length;
      if (prev) prev.disabled = paginas.length < 2;
      if (next) next.disabled = paginas.length < 2;
    }
    function ir(dir) {
      var p = paginaActual() + dir;
      if (p < 0) p = paginas.length - 1;
      if (p >= paginas.length) p = 0;
      track.scrollTo({ left: p * track.clientWidth, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', function () { ir(-1); });
    if (next) next.addEventListener('click', function () { ir(1); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(actualizar); }, { passive: true });
    window.addEventListener('resize', actualizar);
    actualizar();
  }

  function iniciar() { pintarEmpresas(); pintarAliados(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
