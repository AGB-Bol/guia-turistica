/**
 * Panel lateral desplegable (izquierda) - Guía Internacional de Turismo
 * Pestaña con flecha en el borde izquierdo que despliega 3 tarjetas:
 * Policía Turística, Red de Información Turística y Secretaría Municipal (GAMLP).
 * Cada tarjeta abre una ventana con más detalles y su código QR.
 *
 * Sustituye a js/mascota.js (que se conserva en el repo pero ya no se carga).
 * Incluir en cada página:  <script src="js/panel-lateral.js"></script>
 *
 * Para editar contenido, modifica solo el arreglo ENTIDADES.
 * Para agregar un QR nuevo: copia la imagen en img/panel/ y ponla en `qr`.
 */
(function () {
  'use strict';

  // ---- Contenido -----------------------------------------------------------
  var ENTIDADES = [
    {
      id: 'policia',
      etiqueta: 'Policía Turística',
      resumen: 'Atención y orientación al visitante.',
      logo: 'img/panel/policia-escudo.webp',
      fondoLogo: '#ffffff',
      titulo: 'Policía Turística',
      subtitulo: 'Seguridad y orientación para el visitante',
      parrafos: [
        'La Policía Turística acompaña al turista durante su visita: orienta, atiende consultas y brinda apoyo ante cualquier inconveniente.',
        'Escanea el código QR con la cámara de tu celular para acceder a sus canales de contacto.'
      ],
      qr: 'img/panel/policia-qr.webp',
      qrTexto: 'Escanea para contactar a la Policía Turística',
      qrAncho: 'normal'
    },
    {
      id: 'red-info',
      etiqueta: 'Red de Información Turística',
      resumen: 'Información compartida entre el sector público y privado.',
      logo: 'img/panel/red-informacion-turistica.webp',
      fondoLogo: '#ffffff',
      titulo: 'Red de Información Turística',
      subtitulo: 'Dirección de Turismo · La Paz',
      parrafos: [
        'Al escanear el código QR, el turista accede a una plataforma de WhatsApp desde la cual puede comunicarse con operadores turísticos y recibir asistencia por chat, llamada o videollamada, de 06:00 a 00:00 horas. También hay asistencia en inglés.',
        'La red impulsa un intercambio permanente de información entre el sector público y privado: los establecimientos y empresas que participan comparten con la Dirección de Turismo sus nuevos servicios, experiencias, actividades, promociones y ofertas.',
        'La finalidad es que La Paz cuente con un sistema de información turística más accesible, dinámico y articulado, en beneficio del destino y de sus visitantes.'
      ],
      enlaceA: { texto: 'Ver el QR de atención', destino: 'gamlp' }
    },
    {
      id: 'gamlp',
      etiqueta: 'Secretaría Municipal de Turismo',
      resumen: 'Ciudad Cultural, Turismo de Altura y Economía Naranja.',
      logo: 'img/empresas/escudo-institucional-en-letra-dorada.webp',
      fondoLogo: '#ffffff',
      titulo: 'Secretaría Municipal de Ciudad Cultural, Turismo de Altura y Economía Naranja',
      subtitulo: 'Gobierno Autónomo Municipal de La Paz · Dirección de Turismo',
      parrafos: [
        'Es el QR de información y asistencia turística de la Dirección de Turismo del GAMLP, creado para que los visitantes accedan a información oficial, actualizada y oportuna sobre la oferta turística del municipio de La Paz.',
        'El material se distribuye entre los actores de la cadena de valor del turismo, como hoteles, restaurantes, agencias de viajes, museos y otros establecimientos, para que lo coloquen en sus espacios y lo pongan a disposición de los visitantes.',
        'Chat, llamada o videollamada. Asistencia en inglés disponible.'
      ],
      qr: 'img/panel/gamlp-welcome-center.webp',
      qrTexto: 'Welcome Center · Información turística',
      qrAncho: 'cartel'
    }
  ];

  // ---- Estilos -------------------------------------------------------------
  var CSS = [
    '#plg-panel{position:fixed;left:0;top:50%;transform:translate(calc(-100% + 2.1rem),-50%);z-index:900;display:flex;align-items:center;transition:transform .35s cubic-bezier(.22,1,.36,1);font-family:"Nunito",system-ui,sans-serif}',
    '#plg-panel.plg-abierto{transform:translate(0,-50%)}',
    '#plg-cuerpo{width:min(15.5rem,calc(100vw - 4.5rem));background:#fffcf2;border:2px solid #0f172a;border-left:0;border-radius:0 18px 18px 0;padding:.65rem;box-shadow:4px 4px 0 0 #0f172a;display:flex;flex-direction:column;gap:.55rem;max-height:calc(100vh - 6rem);overflow-y:auto}',
    '#plg-cuerpo .plg-cab{font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#64748b;padding:.1rem .25rem 0}',
    '.plg-tarjeta{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:.6rem;background:#fff;border:2px solid #0f172a;border-radius:14px;padding:.5rem;transition:transform .15s,box-shadow .15s,background .15s}',
    '.plg-tarjeta:hover,.plg-tarjeta:focus-visible{background:#fef3c7;transform:translateX(2px);box-shadow:3px 3px 0 0 #0f172a}',
    '.plg-tarjeta:focus-visible{outline:3px solid #dc2626;outline-offset:2px}',
    '.plg-tarjeta:active{transform:scale(.98)}',
    '.plg-logo{flex:none;width:3.1rem;height:3.1rem;border-radius:10px;border:2px solid #0f172a;background:#fff;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:.2rem}',
    '.plg-logo img{max-width:100%;max-height:100%;object-fit:contain}',
    '.plg-txt{min-width:0}',
    '.plg-txt b{display:block;font-size:.8rem;line-height:1.15;font-weight:800;color:#0f172a}',
    '.plg-txt span{display:block;font-size:.68rem;line-height:1.25;color:#475569;margin-top:.15rem}',
    '#plg-tirador{all:unset;box-sizing:border-box;cursor:pointer;flex:none;align-self:center;width:2.1rem;height:4.6rem;margin-left:-2px;background:#fcd34d;border:2px solid #0f172a;border-left:0;border-radius:0 12px 12px 0;box-shadow:3px 3px 0 0 #0f172a;display:flex;align-items:center;justify-content:center;transition:background .15s}',
    '#plg-tirador:hover{background:#fbbf24}',
    '#plg-tirador:focus-visible{outline:3px solid #dc2626;outline-offset:2px}',
    '#plg-tirador svg{width:1.15rem;height:1.15rem;transition:transform .3s}',
    '#plg-panel.plg-abierto #plg-tirador svg{transform:rotate(180deg)}',
    '#plg-panel:not(.plg-abierto) #plg-tirador{animation:plg-pulso 2.6s ease-in-out 1.2s 3}',
    '@keyframes plg-pulso{0%,100%{transform:translateX(0)}50%{transform:translateX(5px)}}',
    /* modal */
    '#plg-overlay{position:fixed;inset:0;z-index:1100;display:flex;align-items:center;justify-content:center;padding:1rem;background:rgba(2,6,23,.72);backdrop-filter:blur(4px);opacity:0;pointer-events:none;transition:opacity .2s}',
    '#plg-overlay.plg-visible{opacity:1;pointer-events:auto}',
    '#plg-modal{background:#fff;border:2px solid #0f172a;border-radius:18px;box-shadow:8px 8px 0 0 #0f172a;width:100%;max-width:34rem;max-height:90vh;overflow-y:auto;padding:1.4rem;transform:translateY(12px) scale(.97);transition:transform .25s cubic-bezier(.22,1,.36,1);font-family:"Nunito",system-ui,sans-serif;color:#0f172a}',
    '#plg-overlay.plg-visible #plg-modal{transform:none}',
    '#plg-modal .plg-m-cab{display:flex;gap:.9rem;align-items:center;padding-bottom:1rem;border-bottom:2px solid #0f172a}',
    '#plg-modal .plg-m-logo{flex:none;width:4.2rem;height:4.2rem;border:2px solid #0f172a;border-radius:12px;background:#fff;padding:.3rem;display:flex;align-items:center;justify-content:center;overflow:hidden}',
    '#plg-modal .plg-m-logo img{max-width:100%;max-height:100%;object-fit:contain}',
    '#plg-modal h2{font-family:"Bricolage Grotesque","Nunito",sans-serif;font-size:1.2rem;line-height:1.2;font-weight:800;margin:0}',
    '#plg-modal .plg-m-sub{font-size:.75rem;color:#64748b;margin:.25rem 0 0;font-weight:600}',
    '#plg-modal .plg-m-cerrar{all:unset;cursor:pointer;margin-left:auto;flex:none;width:2.25rem;height:2.25rem;border-radius:10px;background:#fcd34d;border:2px solid #0f172a;display:flex;align-items:center;justify-content:center;align-self:flex-start}',
    '#plg-modal .plg-m-cerrar:hover{background:#fde68a}',
    '#plg-modal .plg-m-cerrar:focus-visible{outline:3px solid #dc2626;outline-offset:2px}',
    '#plg-modal .plg-m-txt{margin:1rem 0 0;font-size:.9rem;line-height:1.6;color:#334155}',
    '#plg-modal .plg-m-txt p{margin:0 0 .7rem}',
    '#plg-modal .plg-m-qr{margin:.6rem auto 0;text-align:center}',
    '#plg-modal .plg-m-qr img{display:block;margin:0 auto;border:2px solid #0f172a;border-radius:14px;background:#fff;width:100%;max-width:17rem}',
    '#plg-modal .plg-m-qr.plg-cartel img{max-width:15rem}',
    '#plg-modal .plg-m-qr figcaption{font-size:.75rem;font-weight:700;color:#475569;margin-top:.55rem}',
    '#plg-modal .plg-m-enlace{all:unset;cursor:pointer;box-sizing:border-box;display:inline-flex;align-items:center;gap:.4rem;margin-top:.4rem;padding:.55rem .9rem;border:2px solid #0f172a;border-radius:12px;background:#fcd34d;font-size:.8rem;font-weight:800}',
    '#plg-modal .plg-m-enlace:hover{background:#fbbf24}',
    '#plg-modal .plg-m-enlace:focus-visible{outline:3px solid #dc2626;outline-offset:2px}',
    '@media (prefers-reduced-motion:reduce){#plg-panel,#plg-overlay,#plg-modal,#plg-tirador svg{transition:none}#plg-panel:not(.plg-abierto) #plg-tirador{animation:none}}'
  ].join('\n');

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function buscar(id) {
    for (var i = 0; i < ENTIDADES.length; i++) if (ENTIDADES[i].id === id) return ENTIDADES[i];
    return null;
  }

  // ---- Construcción --------------------------------------------------------
  var panel, tirador, overlay, modal, ultimoFoco = null;

  function construir() {
    if (document.getElementById('plg-panel')) return;

    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);

    panel = document.createElement('aside');
    panel.id = 'plg-panel';
    panel.setAttribute('aria-label', 'Información y asistencia turística');
    panel.innerHTML =
      '<div id="plg-cuerpo" role="region" aria-label="Accesos rápidos">' +
        '<div class="plg-cab">Asistencia al turista</div>' +
        ENTIDADES.map(function (e) {
          return '<button type="button" class="plg-tarjeta" data-id="' + esc(e.id) + '" aria-haspopup="dialog">' +
            '<span class="plg-logo" style="background:' + esc(e.fondoLogo) + '"><img src="' + esc(e.logo) + '" alt="" loading="lazy"></span>' +
            '<span class="plg-txt"><b>' + esc(e.etiqueta) + '</b><span>' + esc(e.resumen) + '</span></span>' +
          '</button>';
        }).join('') +
      '</div>' +
      '<button type="button" id="plg-tirador" aria-expanded="false" aria-controls="plg-cuerpo" aria-label="Mostrar asistencia al turista">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>' +
      '</button>';
    document.body.appendChild(panel);

    tirador = panel.querySelector('#plg-tirador');
    tirador.addEventListener('click', function () { alternar(); });
    panel.addEventListener('click', function (ev) {
      var t = ev.target.closest('.plg-tarjeta');
      if (t) abrirModal(t.getAttribute('data-id'));
    });

    overlay = document.createElement('div');
    overlay.id = 'plg-overlay';
    overlay.innerHTML = '<div id="plg-modal" role="dialog" aria-modal="true" aria-labelledby="plg-m-titulo" tabindex="-1"></div>';
    document.body.appendChild(overlay);
    modal = overlay.querySelector('#plg-modal');
    overlay.addEventListener('click', function (ev) { if (ev.target === overlay) cerrarModal(); });
    modal.addEventListener('click', function (ev) {
      if (ev.target.closest('.plg-m-cerrar')) return cerrarModal();
      var a = ev.target.closest('.plg-m-enlace');
      if (a) abrirModal(a.getAttribute('data-destino'), true);
    });

    document.addEventListener('keydown', function (ev) {
      if (ev.key !== 'Escape') return;
      if (overlay.classList.contains('plg-visible')) cerrarModal();
      else if (panel.classList.contains('plg-abierto')) alternar(false);
    });

    // Cierra el panel al hacer clic fuera de él
    document.addEventListener('click', function (ev) {
      if (!panel.classList.contains('plg-abierto')) return;
      if (panel.contains(ev.target) || overlay.contains(ev.target)) return;
      alternar(false);
    });
  }

  function alternar(forzar) {
    var abrir = typeof forzar === 'boolean' ? forzar : !panel.classList.contains('plg-abierto');
    panel.classList.toggle('plg-abierto', abrir);
    tirador.setAttribute('aria-expanded', abrir ? 'true' : 'false');
    tirador.setAttribute('aria-label', abrir ? 'Ocultar asistencia al turista' : 'Mostrar asistencia al turista');
  }

  function abrirModal(id, desdeModal) {
    var e = buscar(id);
    if (!e) return;
    if (!desdeModal) ultimoFoco = document.activeElement;

    var html =
      '<div class="plg-m-cab">' +
        '<div class="plg-m-logo" style="background:' + esc(e.fondoLogo) + '"><img src="' + esc(e.logo) + '" alt="Logo de ' + esc(e.etiqueta) + '"></div>' +
        '<div><h2 id="plg-m-titulo">' + esc(e.titulo) + '</h2><p class="plg-m-sub">' + esc(e.subtitulo) + '</p></div>' +
        '<button type="button" class="plg-m-cerrar" aria-label="Cerrar ventana">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M6 18L18 6M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="plg-m-txt">' + e.parrafos.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      (e.qr
        ? '<figure class="plg-m-qr' + (e.qrAncho === 'cartel' ? ' plg-cartel' : '') + '"><img src="' + esc(e.qr) + '" alt="Código QR: ' + esc(e.etiqueta) + '"><figcaption>' + esc(e.qrTexto || '') + '</figcaption></figure>'
        : '') +
      (e.enlaceA
        ? '<button type="button" class="plg-m-enlace" data-destino="' + esc(e.enlaceA.destino) + '">' + esc(e.enlaceA.texto) +
          ' <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>'
        : '');

    modal.innerHTML = html;
    modal.scrollTop = 0;
    overlay.classList.add('plg-visible');
    document.body.style.overflow = 'hidden';
    modal.focus();
  }

  function cerrarModal() {
    overlay.classList.remove('plg-visible');
    document.body.style.overflow = '';
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', construir);
  else construir();
})();
