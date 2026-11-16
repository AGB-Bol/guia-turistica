/**
 * Mascota Policía Turística - Guía Internacional de Turismo
 * Perro policía que se asoma por el borde izquierdo, centrado en vertical, en todas las páginas.
 * Alterna poses (normal, guiño, letrero…), reacciona a lo que hace el visitante y, al hacer clic,
 * abre un modal informativo.
 *
 * Incluir después de js/motion.js:
 *   <script src="js/mascota.js"></script>
 *
 * Para cambiar de PNG a WebP: edita solo las rutas de SPRITES.
 * Para añadir una pose: una línea en SPRITES y usar su nombre en GUION, HOVER, CLIC, etc.
 */
(function () {
  // ---- Configuración -------------------------------------------------------
  // Pose -> archivo (según el dibujo, no según el número del archivo).
  // Si una imagen no existe, esa pose se omite sola.
  var SPRITES = {
    normal: "img/mascota/3.png",
    guino: "img/mascota/1.png",
    letrero: "img/mascota/2.png",
    sorpresa: "img/mascota/4.png",
    saludo: "img/mascota/5.png",
    pulgar: "img/mascota/6.png",
    dormido: "img/mascota/7.png",
    senalando: "img/mascota/8.png"
  };

  // Guion de la animación base: [pose, milisegundos]. Se repite en bucle.
  // El letrero dura 3,5 s (mínimo pedido: 3 s); normal y guiño se alternan para dar fluidez.
  var GUION = [
    ["normal", 2400],
    ["guino", 450],
    ["normal", 1800],
    ["guino", 450],
    ["normal", 1500],
    ["letrero", 3500]
  ];

  var HOVER = "letrero";            // mientras el ratón o el teclado están sobre la mascota
  var INTRO = ["saludo", 2200];     // al aparecer en la página
  var CLIC = ["sorpresa", 4000];    // al hacer clic (mientras se abre el modal)
  var AL_CERRAR = ["pulgar", 1800]; // al cerrar el modal
  var DESPERTAR = ["saludo", 1600]; // cuando el visitante vuelve tras un rato sin actividad
  var INACTIVIDAD_MS = 45000;       // tiempo sin actividad para que se duerma
  // Al entrar una sección en pantalla (id -> [pose, ms]); solo una vez cada 25 s
  var SECCIONES = {
    "seccion-mapa": ["senalando", 2600],
    "seccion-registro": ["pulgar", 2600]
  };

  // Zona útil dentro del PNG (373 x 669 px): el resto es transparente y se recorta
  var IMG_W = 373, IMG_H = 669;
  var CAJA = { x: 67, y: 110, w: 268, h: 359 }; // x=67: el borde plano del cuerpo queda pegado al borde de la pantalla

  // ---- Estilos -------------------------------------------------------------
  var pctW = (IMG_W / CAJA.w) * 100;
  var pctLeft = -(CAJA.x / CAJA.w) * 100;
  var pctTop = -(CAJA.y / CAJA.h) * 100;
  var CSS =
    "#mascota-btn{position:fixed;left:0;top:50%;z-index:900;width:104px;aspect-ratio:" + CAJA.w + "/" + CAJA.h + ";" +
    "padding:0;border:0;background:transparent;cursor:pointer;overflow:hidden;transform:translate(-110%,-50%);transform-origin:left center;" +
    "transition:transform .5s cubic-bezier(.23,1,.32,1);-webkit-tap-highlight-color:transparent;filter:drop-shadow(3px 3px 0 rgba(15,23,42,.35))}" +
    "@media (min-width:768px){#mascota-btn{width:150px}}" +
    "#mascota-btn.mascota-lista{transform:translate(0,-50%)}" +
    "#mascota-btn.mascota-lista:hover,#mascota-btn.mascota-lista:focus-visible{transform:translate(0,-50%) scale(1.06)}" +
    "#mascota-btn:active{transition-duration:.12s}" +
    "#mascota-btn:focus-visible{outline:3px solid #FFC21A;outline-offset:2px;border-radius:12px}" +
    "#mascota-btn .mascota-pose{position:absolute;display:block;max-width:none;height:auto;pointer-events:none;user-select:none;" +
    "width:" + pctW.toFixed(3) + "%;left:" + pctLeft.toFixed(3) + "%;top:" + pctTop.toFixed(3) + "%;opacity:0;transition:opacity .12s linear}" +
    "#mascota-btn .mascota-pose.activa{opacity:1}" +
    "@media (prefers-reduced-motion:reduce){#mascota-btn{transition:none}#mascota-btn .mascota-pose{transition:none}}";

  // ---- Utilidades ----------------------------------------------------------
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (html) n.innerHTML = html;
    return n;
  }

  function reducido() {
    return window.Motion ? Motion.reducido() : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  // ---- Mascota (botón + animación) -----------------------------------------
  function crearMascota() {
    var btn = el("button", {
      id: "mascota-btn",
      type: "button",
      "aria-label": "Abrir información de la Policía Turística",
      "aria-haspopup": "dialog"
    });
    var poses = {};
    Object.keys(SPRITES).forEach(function (nombre) {
      var img = el("img", { src: SPRITES[nombre], alt: "", class: "mascota-pose", draggable: "false" });
      poses[nombre] = img;
      btn.appendChild(img);
    });
    document.body.appendChild(btn);

    function mostrar(nombre) {
      if (!poses[nombre]) nombre = poses.normal ? "normal" : Object.keys(poses)[0];
      Object.keys(poses).forEach(function (n) { poses[n].classList.toggle("activa", n === nombre); });
    }

    // Poses cuyo archivo no cargó: se quitan para no mostrar huecos
    function descartar(nombre) {
      if (poses[nombre]) { poses[nombre].remove(); delete poses[nombre]; }
    }

    var guion = GUION;
    var paso = 0;
    var reloj = null;       // temporizador del guion base
    var relojReac = null;   // temporizador de una reacción puntual
    var retenida = false;   // el ratón/teclado está sobre la mascota
    var reaccionando = false;
    var dormida = false;
    var activa = false;     // ya empezó la animación
    var ultimaActividad = Date.now();

    // Guion base: se detiene si hay hover, reacción o sueño
    function siguiente() {
      clearTimeout(reloj);
      if (!activa || retenida || reaccionando || dormida) return;
      var actual = guion[paso % guion.length];
      mostrar(actual[0]);
      reloj = setTimeout(function () { paso++; siguiente(); }, actual[1]);
    }

    function retomar() {
      paso = guion.length; // vuelve al inicio del guion (pose normal)
      if (retenida) mostrar(HOVER);
      else if (dormida) mostrar("dormido");
      else siguiente();
    }

    // Reacción puntual: muestra una pose un rato y luego retoma lo que tocaba
    function reaccion(par) {
      if (!activa || !par || !poses[par[0]] || reducido()) return;
      clearTimeout(reloj);
      clearTimeout(relojReac);
      reaccionando = true;
      mostrar(par[0]);
      relojReac = setTimeout(function () {
        reaccionando = false;
        retomar();
      }, par[1]);
    }

    // Hover / teclado: el ratón manda sobre cualquier reacción
    function retener() {
      retenida = true;
      clearTimeout(reloj);
      clearTimeout(relojReac);
      reaccionando = false;
      mostrar(HOVER);
    }
    function soltar() {
      if (!retenida) return;
      retenida = false;
      retomar();
    }

    btn.addEventListener("mouseenter", retener);
    btn.addEventListener("mouseleave", soltar);
    btn.addEventListener("focus", retener);
    btn.addEventListener("blur", soltar);

    // ---- Dormirse tras un rato sin actividad ----
    function hayActividad() {
      ultimaActividad = Date.now();
      if (dormida) {
        dormida = false;
        reaccion(DESPERTAR);
        if (!reaccionando) retomar();
      }
    }
    ["mousemove", "scroll", "keydown", "pointerdown", "touchstart"].forEach(function (ev) {
      window.addEventListener(ev, hayActividad, { passive: true });
    });
    setInterval(function () {
      if (!activa || document.hidden || dormida || retenida || reducido()) return;
      if (Date.now() - ultimaActividad > INACTIVIDAD_MS) {
        dormida = true;
        clearTimeout(reloj);
        clearTimeout(relojReac);
        reaccionando = false;
        mostrar("dormido");
      }
    }, 2000);

    // ---- Reaccionar cuando una sección entra en pantalla ----
    if ("IntersectionObserver" in window) {
      var ultimoAviso = {};
      var obs = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          var ahora = Date.now();
          if (ultimoAviso[id] && ahora - ultimoAviso[id] < 25000) return;
          ultimoAviso[id] = ahora;
          if (!dormida && !retenida) reaccion(SECCIONES[id]);
        });
      }, { threshold: 0.35 });
      Object.keys(SECCIONES).forEach(function (id) {
        var s = document.getElementById(id);
        if (s) obs.observe(s);
      });
    }

    // ---- Precarga: no se empieza hasta tener todas las imágenes (evita parpadeos) ----
    var pendientes = Object.keys(SPRITES).length;
    function listaUna() {
      pendientes--;
      if (pendientes > 0) return;
      guion = GUION.filter(function (p) { return poses[p[0]]; });
      if (!guion.length) { btn.remove(); return; }
      btn.classList.add("mascota-lista");
      if (reducido()) {
        // Sin animación: queda quieta con el letrero para que se entienda que se puede pulsar
        mostrar(HOVER);
      } else {
        activa = true;
        if (poses[INTRO[0]]) reaccion(INTRO);
        else siguiente();
      }
    }
    Object.keys(poses).forEach(function (n) {
      var img = poses[n];
      if (img.complete && img.naturalWidth) listaUna();
      else {
        img.addEventListener("load", listaUna);
        img.addEventListener("error", function () { descartar(n); listaUna(); });
      }
    });

    // Se pausa si la pestaña no está visible
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearTimeout(reloj);
      } else {
        ultimaActividad = Date.now();
        if (!reaccionando) siguiente();
      }
    });

    return {
      btn: btn,
      alHacerClic: function () { reaccion(CLIC); },
      alCerrarModal: function () { reaccion(AL_CERRAR); }
    };
  }

  // ---- Modal ---------------------------------------------------------------
  // CONTENIDO DE EJEMPLO: reemplazar por la información oficial de la Policía Turística.
  function crearModal() {
    var html =
      '<div id="modal-mascota-caja" class="relative w-full max-w-lg bg-white rounded-2xl border-2 border-slate-900 shadow-[8px_8px_0_0_#FFC21A] overflow-hidden max-h-[90vh] flex flex-col">' +
      '  <div class="bg-emerald-600 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b-2 border-slate-900">' +
      '    <div>' +
      '      <span class="text-xs font-extrabold uppercase tracking-wider text-amber-300">Información para el viajero</span>' +
      '      <h2 id="mascota-titulo" class="text-2xl sm:text-3xl font-extrabold leading-tight mt-1">Policía Turística</h2>' +
      '      <p class="text-sm text-emerald-50 mt-1">Tu apoyo cuando viajas por Bolivia.</p>' +
      '    </div>' +
      '    <button type="button" data-cerrar class="w-9 h-9 shrink-0 rounded-full bg-amber-400 hover:bg-amber-300 border-2 border-slate-900 text-slate-900 flex items-center justify-center active:scale-[0.97] transition duration-150" aria-label="Cerrar">' +
      '      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"/></svg>' +
      '    </button>' +
      '  </div>' +
      '  <div class="p-5 sm:p-6 overflow-y-auto space-y-5">' +
      '    <div data-ejemplo="contenido" class="space-y-4">' +
      '      <div><h3 class="text-base font-extrabold text-slate-900">¿Qué hace?</h3>' +
      '        <p class="text-sm text-slate-700 mt-1 leading-relaxed">Orienta y asiste a los visitantes, y coordina con las autoridades locales cuando hace falta.</p></div>' +
      '      <div><h3 class="text-base font-extrabold text-slate-900">¿Cuándo acudir?</h3>' +
      '        <p class="text-sm text-slate-700 mt-1 leading-relaxed">Si pierdes tus documentos, sufres un robo o necesitas ayuda en cualquier destino.</p></div>' +
      '      <div><h3 class="text-base font-extrabold text-slate-900">Consejos rápidos</h3>' +
      '        <ul class="mt-2 space-y-1.5 text-sm text-slate-700">' +
      '          <li class="flex gap-2"><span class="text-emerald-600 font-extrabold" aria-hidden="true">✓</span>Guarda copias de tu pasaporte y de tus reservas.</li>' +
      '          <li class="flex gap-2"><span class="text-emerald-600 font-extrabold" aria-hidden="true">✓</span>Contrata operadores y agencias registrados en la guía.</li>' +
      '          <li class="flex gap-2"><span class="text-emerald-600 font-extrabold" aria-hidden="true">✓</span>Cuéntale tu ruta a alguien de confianza.</li>' +
      '        </ul></div>' +
      '    </div>' +
      '    <div data-ejemplo="contacto" class="grid grid-cols-1 sm:grid-cols-2 gap-3">' +
      '      <div class="bg-amber-100 border-2 border-slate-900 rounded-xl p-3"><span class="text-xs font-bold uppercase tracking-wider text-slate-600 block">Línea de ayuda</span><span class="font-extrabold text-slate-900">Por confirmar</span></div>' +
      '      <div class="bg-amber-100 border-2 border-slate-900 rounded-xl p-3"><span class="text-xs font-bold uppercase tracking-wider text-slate-600 block">WhatsApp</span><span class="font-extrabold text-slate-900">Por confirmar</span></div>' +
      '    </div>' +
      '  </div>' +
      '  <div class="p-4 sm:p-5 border-t-2 border-slate-900 bg-slate-50 flex justify-end">' +
      '    <button type="button" data-cerrar class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm border-2 border-slate-900 active:scale-[0.97] transition duration-150">Entendido</button>' +
      '  </div>' +
      '</div>';

    var modal = el("div", {
      id: "modal-mascota",
      class: "fixed inset-0 z-[1100] hidden flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "mascota-titulo"
    }, html);
    document.body.appendChild(modal);
    return modal;
  }

  // ---- Arranque ------------------------------------------------------------
  function iniciar() {
    if (document.getElementById("mascota-btn")) return;
    var estilo = el("style", { id: "mascota-estilo" });
    estilo.textContent = CSS;
    document.head.appendChild(estilo);

    var mascota = crearMascota();
    var btn = mascota.btn;
    var modal = crearModal();
    var caja = modal.querySelector("#modal-mascota-caja");

    var conTeclado = false; // si se abrió con teclado, al cerrar se devuelve el foco al botón

    function abrir(e) {
      conTeclado = !!e && e.detail === 0;
      mascota.alHacerClic();
      modal.classList.remove("hidden");
      if (window.Motion) Motion.abrirModal(modal, caja);
      var cerrarBtn = modal.querySelector("[data-cerrar]");
      if (cerrarBtn) cerrarBtn.focus({ preventScroll: true });
    }

    function cerrar() {
      if (modal.classList.contains("hidden")) return;
      var terminar = function () {
        modal.classList.add("hidden");
        if (conTeclado) btn.focus({ preventScroll: true });
        mascota.alCerrarModal();
      };
      if (window.Motion) Motion.cerrarModal(modal, caja, terminar);
      else terminar();
    }

    btn.addEventListener("click", abrir);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-cerrar]")) cerrar();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") cerrar();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
