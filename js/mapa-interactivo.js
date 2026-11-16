/**
 * ============================================================================
 * GUÍA INTERNACIONAL DE TURISMO - MAPA INTERACTIVO DE AMÉRICA (SVG)
 * ============================================================================
 * Sin librerías externas (solo JS nativo + CSS en css/mapa-interactivo.css).
 *
 * Flujo:
 *  1) Entrada: al llegar a la sección los contornos se dibujan, se rellenan y los
 *     países "despegan"; luego flotan con un vaivén suave.
 *  2) Hover (mapa o lista): el país se eleva y el panel muestra su información.
 *  3) Clic en un país: zoom animado hacia él.
 *       - Bolivia: aparecen los puntos de servicios turísticos (clic = ficha).
 *       - Resto de países: se muestra la insignia "Próximamente".
 *  4) "Volver al mapa" / Esc: regresa a la vista de América.
 *
 * Datos: data/mapa-datos.js (países, banderas, servicios) y data/mapa-geo.js.
 * Globales que se mantienen: abrirModalLugar, ocultarModalLugar,
 * enfocarBolivia, volverAlMundo.
 */

(function () {
  "use strict";

  var GEO = window.MAPA_GEO;
  var PAISES = window.MAPA_PAISES;
  var BANDERAS = window.MAPA_BANDERAS || {};
  var LUGARES = window.MARCADORES_TURISMO || [];

  var escena = document.getElementById("mapa-escena");
  var svg = document.getElementById("mapa-svg");
  var lista = document.getElementById("mapa-lista");
  var panel = document.getElementById("mapa-panel");
  var lienzo = document.getElementById("mapa-lienzo");
  var capaPuntos = document.getElementById("mapa-puntos");
  var aviso = document.getElementById("mapa-aviso");
  var btnVolver = document.getElementById("btn-volver-mundo");

  var NS = "http://www.w3.org/2000/svg";
  var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var puedeAnimar = !reducido && typeof Element.prototype.animate === "function";

  // ==========================================================================
  // UTILIDADES
  // ==========================================================================
  function el(tag, attrs, padre) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (padre) padre.appendChild(n);
    return n;
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function bandera(id) {
    return '<svg class="gm-bandera" viewBox="0 0 30 20" aria-hidden="true">' + (BANDERAS[id] || "") + "</svg>";
  }

  // Animación WAAPI segura: si no hay soporte / movimiento reducido, no hace nada
  function animar(nodo, keyframes, opciones) {
    if (!puedeAnimar || !nodo) return null;
    return nodo.animate(keyframes, opciones);
  }

  function lugaresDe(p) {
    return LUGARES.filter(function (l) {
      return String(l.pais || "").toLowerCase() === p.slug;
    });
  }

  // ==========================================================================
  // 1. CONSTRUCCIÓN DEL SVG
  // ==========================================================================
  function construir() {
    svg.setAttribute("viewBox", "0 0 " + GEO.W + " " + GEO.H);

    var defs = el("defs", {}, svg);
    var blur = el("filter", { id: "gm-blur", x: "-25%", y: "-25%", width: "150%", height: "150%" }, defs);
    el("feGaussianBlur", { stdDeviation: 5 }, blur);

    // Bandera de Bolivia (rojo / amarillo / verde) como relleno del país
    var grad = el("linearGradient", { id: "gm-bandera", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    [["0", "#D52B1E"], ["0.3333", "#D52B1E"], ["0.3333", "#F9E300"], ["0.6666", "#F9E300"], ["0.6666", "#007934"], ["1", "#007934"]].forEach(function (s) {
      el("stop", { offset: s[0], "stop-color": s[1] }, grad);
    });

    // Estrellitas de fondo (decorativas)
    var gEstrellas = el("g", { "class": "gm-estrellas" }, svg);
    var semilla = 7;
    function azar() { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; }
    for (var i = 0; i < 34; i++) {
      var e = el("circle", { cx: (azar() * GEO.W).toFixed(1), cy: (azar() * GEO.H).toFixed(1), r: (0.5 + azar() * 1.1).toFixed(2), "class": "gm-estrella" }, gEstrellas);
      e.style.animationDelay = (azar() * 4).toFixed(2) + "s";
      e.style.animationDuration = (2.5 + azar() * 3).toFixed(2) + "s";
    }

    el("path", { d: GEO.fondo, "class": "gm-fondo" }, svg); // países no interactivos
    var gSombras = el("g", { "class": "gm-sombras" }, svg);
    var gVis = el("g", { "class": "gm-paises" }, svg);
    var gEtq = el("g", { "class": "gm-etqs" }, svg);
    var gHit = el("g", { "class": "gm-hits" }, svg);
    svg._gVis = gVis;
    svg._gHit = gHit;

    // De norte a sur: el país que se eleva queda por encima de sus vecinos del norte
    var orden = PAISES.slice().sort(function (a, b) { return GEO.paises[a.id].c[1] - GEO.paises[b.id].c[1]; });

    orden.forEach(function (p) {
      var g = GEO.paises[p.id];
      var esBo = p.id === "bo";
      p.d = g.d;
      p.c = g.c;
      p.activo = p.estado === "activo";

      if (esBo) { // resplandor pulsante bajo Bolivia
        p.halo = el("path", { d: p.d, "class": "gm-halo", filter: "url(#gm-blur)" }, gSombras);
      }
      p.sombra = el("path", { d: p.d, "class": "gm-sombra", filter: "url(#gm-blur)" }, gSombras);

      // idle (vaivén JS) > lift (elevación CSS) > grosor + cara
      p.idle = el("g", { "class": "gm-idle" }, gVis);
      p.lift = el("g", { "class": "gm-lift gm-lift--pais" }, p.idle);
      p.grosor = el("path", { d: p.d, "class": "gm-grosor" + (esBo ? " gm-grosor--bo" : "") }, p.lift);
      p.cara = el("path", { d: p.d, "class": "gm-cara" + (esBo ? " gm-cara--bo" : "") }, p.lift);

      if (esBo) {
        // Brillo que barre la bandera + pulso sobre Sucre
        var clip = el("clipPath", { id: "gm-clip-bo" }, defs);
        el("path", { d: p.d }, clip);
        var gBrillo = el("g", { "clip-path": "url(#gm-clip-bo)", "pointer-events": "none" }, p.lift);
        el("rect", { x: -60, y: 300, width: 34, height: 130, "class": "gm-brillo" }, gBrillo);
        p.radar = el("circle", { cx: GEO.sucre[0], cy: GEO.sucre[1], r: 3, "class": "gm-radar" }, p.lift);
        el("circle", { cx: GEO.sucre[0], cy: GEO.sucre[1], r: 2, "class": "gm-punto-sucre" }, p.lift);
      }

      // Etiqueta (sube junto con el país)
      var l = p.lab || {};
      p.etqIdle = el("g", { "class": "gm-etq-g gm-idle" }, gEtq);
      p.etqLift = el("g", { "class": "gm-lift" }, p.etqIdle);
      var x = p.c[0] + (l.dx || 0), y = p.c[1] + (l.dy || 0);
      var t = el("text", { x: x, y: y, "class": "gm-etq" + (esBo ? " gm-etq--bo" : "") }, p.etqLift);
      t.style.fontSize = (l.tam || 13) + "px";
      if (l.vertical) t.setAttribute("transform", "rotate(-90 " + x + " " + y + ")");
      t.textContent = p.nombre;

      // Zona clicable fija (no se mueve con el vuelo → el hover no parpadea)
      p.link = el("g", {
        "class": "gm-link", role: "button", tabindex: 0,
        "aria-label": p.nombre + (p.activo ? ": ver servicios turísticos" : ": próximamente")
      }, gHit);
      el("path", { d: p.d, "class": "gm-hit" }, p.link);
    });

    // Lista de países (orden original; Bolivia primero)
    PAISES.forEach(function (p) {
      var it = document.createElement("button");
      it.type = "button";
      it.className = "gm-item" + (p.id === "bo" ? " gm-item--bo" : "");
      it.innerHTML =
        bandera(p.id) +
        "<span class=\"gm-item-nombre\">" + esc(p.nombre) + "</span>" +
        "<span class=\"gm-item-estado " + (p.activo ? "is-ok" : "is-pronto") + "\">" + (p.activo ? "Disponible" : "Pronto") + "</span>";
      lista.appendChild(it);
      p.item = it;
    });
  }

  // ==========================================================================
  // 2. VISTA (viewBox) Y ZOOM ANIMADO
  // ==========================================================================
  var vb = [0, 0, GEO.W, GEO.H];
  var raf = 0;

  function aplicarVista(v) {
    vb = v;
    svg.setAttribute("viewBox", v[0].toFixed(2) + " " + v[1].toFixed(2) + " " + v[2].toFixed(2) + " " + v[3].toFixed(2));
  }

  // Calcula un viewBox que contiene el rectángulo y respeta el aspecto del lienzo
  function vistaPara(x, y, w, h, relleno, altoMin) {
    var r = (svg.clientWidth / svg.clientHeight) || 1.2;
    var H = Math.max(h * (1 + relleno), (w * (1 + relleno)) / r, altoMin || 0);
    var W = H * r;
    return [x + w / 2 - W / 2, y + h / 2 - H / 2, W, H];
  }

  function vistaMundo() {
    return vistaPara(0, 0, GEO.W, GEO.H, 0.02, 0);
  }

  // Interpola centro (lineal) y tamaño (exponencial) → zoom uniforme y natural
  function irA(destino, duracion, alFinal) {
    cancelAnimationFrame(raf);
    if (!duracion || !puedeAnimar) {
      aplicarVista(destino);
      if (alFinal) alFinal();
      return;
    }
    var ini = vb.slice();
    var t0 = performance.now();
    var cx0 = ini[0] + ini[2] / 2, cy0 = ini[1] + ini[3] / 2;
    var cx1 = destino[0] + destino[2] / 2, cy1 = destino[1] + destino[3] / 2;
    function paso(t) {
      var k = Math.min(1, (t - t0) / duracion);
      var e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      var W = ini[2] * Math.pow(destino[2] / ini[2], e);
      var H = ini[3] * Math.pow(destino[3] / ini[3], e);
      var cx = cx0 + (cx1 - cx0) * e, cy = cy0 + (cy1 - cy0) * e;
      aplicarVista([cx - W / 2, cy - H / 2, W, H]);
      if (k < 1) raf = requestAnimationFrame(paso);
      else if (alFinal) alFinal();
    }
    raf = requestAnimationFrame(paso);
  }

  // ==========================================================================
  // 3. ESTADO: país activo (hover) y país enfocado (zoom)
  // ==========================================================================
  var porId = {};
  var activoId = null;
  var zoomId = null;

  function activar(id) {
    if (id === activoId) return;
    activoId = id;
    PAISES.forEach(function (q) {
      var on = q.id === id;
      [q.cara, q.lift, q.etqLift, q.sombra, q.item, q.halo].forEach(function (n) {
        if (n && n.classList) n.classList.toggle("is-activo", on);
      });
    });
    pintarPanel(porId[id]);
  }

  // ---- Panel de información ----
  function pintarPanel(p) {
    var lugares = lugaresDe(p);
    var html =
      '<div class="gm-panel-cab">' + bandera(p.id) +
      "<div><h3>" + esc(p.nombre) + "</h3><small>" + esc(p.oficial) + "</small></div></div>";

    if (p.activo) {
      html += '<span class="gm-badge gm-badge--ok"><i></i>' + lugares.length + " servicios turísticos disponibles</span>";
      html += '<ul class="gm-lugares">' + lugares.map(function (l) {
        return '<li><button type="button" class="gm-lugar" data-id="' + esc(l.id) + '">' +
          '<span class="gm-lugar-dot"></span>' +
          "<span><strong>" + esc(l.nombre) + "</strong><small>" + esc(l.categoria) + " · " + esc(l.departamento) + "</small></span>" +
          '<span class="gm-lugar-flecha" aria-hidden="true">→</span></button></li>';
      }).join("") + "</ul>";
      if (!zoomId) html += '<button type="button" class="gm-cta">Explorar ' + esc(p.nombre) + " en el mapa</button>";
    } else {
      html += '<span class="gm-badge gm-badge--pronto"><i></i>Próximamente</span>';
      html += '<p class="gm-texto">Estamos preparando la guía de servicios turísticos de ' + esc(p.nombre) + ". Muy pronto podrás encontrar aquí hoteles, agencias y más.</p>";
      html += '<span class="gm-sub">Destinos que vendrán</span><div class="gm-tags">' +
        (p.destinos || []).map(function (d) { return "<span>" + esc(d) + "</span>"; }).join("") + "</div>";
    }

    panel.setAttribute("data-pais", p.id);
    panel.innerHTML = html;

    var cta = panel.querySelector(".gm-cta");
    if (cta) cta.addEventListener("click", function () { enfocar(p.id); });

    Array.prototype.forEach.call(panel.querySelectorAll(".gm-lugar"), function (b) {
      var lugar = LUGARES.filter(function (l) { return l.id === b.getAttribute("data-id"); })[0];
      b.addEventListener("click", function () {
        if (!zoomId) enfocar(p.id);
        else window.abrirModalLugar(lugar);
      });
      b.addEventListener("mouseenter", function () { resaltarPunto(lugar.id, true); });
      b.addEventListener("mouseleave", function () { resaltarPunto(lugar.id, false); });
    });

    if (puedeAnimar) {
      Array.prototype.forEach.call(panel.children, function (n, i) {
        animar(n, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
          { duration: 380, delay: i * 70, easing: "cubic-bezier(.2,.8,.2,1)", fill: "backwards" });
      });
    }
  }

  // ==========================================================================
  // 4. ENFOCAR (zoom) / VOLVER
  // ==========================================================================
  function proyectar(lat, lng) {
    // Mercator calibrado con Bolivia (contorno real) → válido para todo el mapa
    function merc(l) { return Math.log(Math.tan(Math.PI / 4 + (l * Math.PI) / 360)); }
    var N = merc(-9.761988), S = merc(-22.872919);
    return [
      341.5 + (lng + 69.590424) * 7.02941,
      315.9 + ((merc(lat) - N) * (413.1 - 315.9)) / (S - N)
    ];
  }

  function enfocar(id) {
    var p = porId[id];
    if (!p || zoomId === id) return;
    zoomId = id;

    quitarPuntos(true);
    ocultarAviso(true);
    detenerFlotar();
    inclinar(0, 0);

    activoId = null;
    activar(id);
    escena.classList.add("gm-zoom");
    PAISES.forEach(function (q) {
      var otro = q.id !== id;
      [q.idle, q.etqIdle, q.sombra, q.halo].forEach(function (n) { if (n) n.classList.toggle("gm-oculto", otro); });
      q.link.setAttribute("tabindex", "-1");
      q.item.classList.toggle("is-sel", !otro);
    });
    svg._gVis.appendChild(p.idle); // el país enfocado queda por encima de sus vecinos
    if (btnVolver) btnVolver.hidden = false;

    var bb = p.cara.getBBox();
    var destino = vistaPara(bb.x, bb.y, bb.width, bb.height, 0.55, 70);
    escena.style.setProperty("--gm-esc", (destino[2] / svg.clientWidth).toFixed(4));
    irA(destino, 1200, function () {
      if (zoomId !== id) return;
      if (p.activo) mostrarPuntos(p); else mostrarAviso(p);
    });
  }

  function volver() {
    if (!zoomId) return;
    zoomId = null;
    quitarPuntos(false);
    ocultarAviso(false);
    escena.classList.remove("gm-zoom");
    PAISES.forEach(function (q) {
      [q.idle, q.etqIdle, q.sombra, q.halo].forEach(function (n) { if (n) n.classList.remove("gm-oculto"); });
      q.link.setAttribute("tabindex", "0");
      q.item.classList.remove("is-sel");
    });
    reordenarCapas();
    if (btnVolver) btnVolver.hidden = true;
    pintarPanel(porId[activoId]);
    irA(vistaMundo(), 1100, function () { if (!zoomId) iniciarFlotar(); });
  }

  function reordenarCapas() {
    PAISES.slice().sort(function (a, b) { return a.c[1] - b.c[1]; }).forEach(function (q) { svg._gVis.appendChild(q.idle); });
  }

  // ---- Puntos de servicios (Bolivia) ----
  function posicionEnPantalla(p, x, y) {
    var m = p.lift.getScreenCTM();
    var pt = svg.createSVGPoint();
    pt.x = x; pt.y = y;
    var s = pt.matrixTransform(m);
    var r = capaPuntos.getBoundingClientRect();
    return [s.x - r.left, s.y - r.top];
  }

  function mostrarPuntos(p) {
    capaPuntos.innerHTML = "";
    lugaresDe(p).forEach(function (l, i) {
      var xy = proyectar(l.lat, l.lng);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "gm-punto gm-punto--" + (l.etiqueta || "abajo");
      b.setAttribute("data-id", l.id);
      b.setAttribute("aria-label", "Ver " + l.nombre);
      b._xy = xy;
      b.style.setProperty("--i", i);
      b.innerHTML =
        '<span class="gm-punto-in"><span class="gm-punto-ping"></span>' +
        '<span class="gm-punto-core"><i></i></span>' +
        '<span class="gm-punto-label">' + esc(l.nombre) + "</span></span>";
      b.addEventListener("click", function (ev) { ev.stopPropagation(); window.abrirModalLugar(l); });
      capaPuntos.appendChild(b);
    });
    ubicarPuntos(p);
  }

  function ubicarPuntos(p) {
    Array.prototype.forEach.call(capaPuntos.children, function (b) {
      var s = posicionEnPantalla(p, b._xy[0], b._xy[1]);
      b.style.left = s[0].toFixed(1) + "px";
      b.style.top = s[1].toFixed(1) + "px";
    });
  }

  function quitarPuntos(ya) {
    var viejos = Array.prototype.slice.call(capaPuntos.children);
    if (!viejos.length) return;
    if (ya || !puedeAnimar) { capaPuntos.innerHTML = ""; return; }
    viejos.forEach(function (b) { b.classList.add("gm-saliendo"); });
    setTimeout(function () {
      viejos.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
    }, 260);
  }

  function resaltarPunto(id, on) {
    var b = capaPuntos.querySelector('[data-id="' + id + '"]');
    if (b) b.classList.toggle("is-resaltado", on);
  }

  // ---- Insignia "Próximamente" ----
  function mostrarAviso(p) {
    if (!aviso) return;
    document.getElementById("mapa-aviso-titulo").textContent = "Próximamente en " + p.nombre;
    document.getElementById("mapa-aviso-texto").textContent = "Estamos sumando hoteles, agencias y servicios. Por ahora, explora Bolivia.";
    aviso.hidden = false;
    aviso.classList.remove("gm-aviso--sale");
    animar(aviso, [{ opacity: 0, transform: "translate(-50%, 16px) scale(.96)" }, { opacity: 1, transform: "translate(-50%, 0) scale(1)" }],
      { duration: 450, easing: "cubic-bezier(.2,.8,.2,1)" });
  }

  function ocultarAviso(ya) {
    if (!aviso || aviso.hidden) return;
    if (ya || !puedeAnimar) { aviso.hidden = true; return; }
    var a = animar(aviso, [{ opacity: 1 }, { opacity: 0 }], { duration: 200 });
    if (a) a.onfinish = function () { if (!zoomId) aviso.hidden = true; };
  }

  // ==========================================================================
  // 5. ANIMACIONES: entrada, flotación e inclinación
  // ==========================================================================
  var flotando = [];

  function iniciarFlotar() {
    if (!puedeAnimar || flotando.length) return;
    PAISES.forEach(function (p, i) {
      [p.idle, p.etqIdle].forEach(function (n) {
        var a = animar(n, [{ transform: "translateY(0px)" }, { transform: "translateY(-3px)" }],
          { duration: 2600 + (i % 4) * 380, delay: -i * 330, direction: "alternate", iterations: Infinity, easing: "ease-in-out" });
        if (a) flotando.push(a);
      });
    });
  }

  function detenerFlotar() {
    flotando.forEach(function (a) { a.cancel(); });
    flotando = [];
  }

  function entrada() {
    if (!puedeAnimar) { escena.classList.remove("gm-pre"); iniciarFlotar(); return; }
    var anims = [];
    function A(nodo, kf, op) {
      op.fill = "both";
      var a = animar(nodo, kf, op);
      if (a) anims.push(a);
    }
    var fuera = "cubic-bezier(.16,1,.3,1)";

    A(svg.querySelector(".gm-fondo"), [{ opacity: 0 }, { opacity: 1 }], { duration: 800 });
    A(svg.querySelector(".gm-estrellas"), [{ opacity: 0 }, { opacity: 1 }], { duration: 1200, delay: 200 });

    // Bolivia aparece primero; los demás países despegan uno tras otro
    var rebote = "cubic-bezier(.34,1.56,.64,1)";
    PAISES.forEach(function (p, i) {
      var d = i === 0 ? 200 : 1100 + (i - 1) * 170;
      [p.idle, p.etqIdle].forEach(function (n) {
        A(n, [{ opacity: 0, transform: "translateY(46px) scale(.92)" }, { opacity: 1, transform: "none" }], { duration: 1000, delay: d, easing: rebote });
      });
      A(p.sombra, [{ opacity: 0 }, { opacity: 0.55 }], { duration: 800, delay: d + 200 });
    });

    Array.prototype.forEach.call(lista.children, function (n, i) {
      A(n, [{ opacity: 0, transform: "translateX(-24px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 500 + i * 60, easing: fuera });
    });
    A(panel, [{ opacity: 0, transform: "translateX(24px)" }, { opacity: 1, transform: "none" }], { duration: 700, delay: 900, easing: fuera });

    Promise.all(anims.map(function (a) { return a.finished.catch(function () {}); })).then(function () {
      escena.classList.remove("gm-pre");
      anims.forEach(function (a) { a.cancel(); });
      if (!zoomId) iniciarFlotar();
    });
  }

  // Inclinación 3D sutil siguiendo el cursor (solo en vista de América)
  var inclinacion = { x: 0, y: 0 };
  function inclinar(rx, ry) {
    inclinacion.x = rx; inclinacion.y = ry;
    svg.style.transform = rx || ry ? "perspective(1100px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)" : "";
  }

  // ==========================================================================
  // 6. EVENTOS
  // ==========================================================================
  function enlazar() {
    PAISES.forEach(function (p, i) {
      p.link.addEventListener("mouseenter", function () { if (!zoomId) activar(p.id); });
      p.link.addEventListener("focus", function () { if (!zoomId) activar(p.id); });
      p.link.addEventListener("click", function () { enfocar(p.id); });
      p.link.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); enfocar(p.id); }
      });

      p.item.addEventListener("mouseenter", function () { if (!zoomId) activar(p.id); });
      p.item.addEventListener("focus", function () { if (!zoomId) activar(p.id); });
      p.item.addEventListener("click", function () { enfocar(p.id); });
      // Flechas ↑ ↓ / ← → para recorrer la lista como un menú de juego
      p.item.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        PAISES[(i + d + PAISES.length) % PAISES.length].item.focus();
      });
    });

    if (btnVolver) btnVolver.addEventListener("click", volver);

    if (puedeAnimar && window.matchMedia("(hover: hover)").matches) {
      lienzo.addEventListener("pointermove", function (e) {
        if (zoomId) return;
        var r = lienzo.getBoundingClientRect();
        var nx = (e.clientX - r.left) / r.width - 0.5;
        var ny = (e.clientY - r.top) / r.height - 0.5;
        inclinar(-ny * 5, nx * 6);
      });
      lienzo.addEventListener("pointerleave", function () { inclinar(0, 0); });
    }

    // Adaptación al tamaño del lienzo
    var pendiente = 0;
    function reajustar() {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(function () {
        if (zoomId) {
          var p = porId[zoomId], bb = p.cara.getBBox();
          cancelAnimationFrame(raf);
          var v = vistaPara(bb.x, bb.y, bb.width, bb.height, 0.55, 70);
          escena.style.setProperty("--gm-esc", (v[2] / svg.clientWidth).toFixed(4));
          aplicarVista(v);
          if (p.activo && capaPuntos.children.length) ubicarPuntos(p);
        } else {
          aplicarVista(vistaMundo());
        }
      });
    }
    if ("ResizeObserver" in window) new ResizeObserver(reajustar).observe(lienzo);
    else window.addEventListener("resize", reajustar);

    // Esc: cierra la ficha y, si no hay ficha abierta, vuelve al mapa
    window.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var modal = document.getElementById("modal-lugar-mapa");
      if (modal && !modal.classList.contains("hidden")) window.ocultarModalLugar();
      else volver();
    });
  }

  // ==========================================================================
  // 7. INICIO
  // ==========================================================================
  function iniciar() {
    if (escena.getAttribute("data-listo")) return;
    escena.setAttribute("data-listo", "1");

    PAISES = PAISES.filter(function (p) { return GEO.paises[p.id]; });
    PAISES.forEach(function (p) { porId[p.id] = p; });

    construir();
    aplicarVista(vistaMundo());
    enlazar();
    activar("bo");

    window.enfocarBolivia = function () { enfocar("bo"); };
    window.volverAlMundo = function () { volver(); window.ocultarModalLugar(); };

    if (puedeAnimar) {
      escena.classList.add("gm-pre"); // estado inicial oculto; se revela al entrar en pantalla
      if ("IntersectionObserver" in window) {
        var obs = new IntersectionObserver(function (es) {
          if (es[0].isIntersecting) { obs.disconnect(); entrada(); }
        }, { threshold: 0.25 });
        obs.observe(escena);
      } else {
        entrada();
      }
    }
  }

  // ==========================================================================
  // MODAL INTERACTIVO DEL SERVICIO SELECCIONADO (ficha del punto)
  // ==========================================================================
  window.abrirModalLugar = function (lugar) {
    var modal = document.getElementById("modal-lugar-mapa");
    if (!modal) return;

    var imgEl = document.getElementById("modal-lugar-img");
    var logoEl = document.getElementById("modal-lugar-logo");
    var catEl = document.getElementById("modal-lugar-categoria");
    var depEl = document.getElementById("modal-lugar-departamento");
    var nomEl = document.getElementById("modal-lugar-nombre");
    var descEl = document.getElementById("modal-lugar-descripcion");
    var servEl = document.getElementById("modal-lugar-servicios");
    var precioEl = document.getElementById("modal-lugar-precio");
    var contactoEl = document.getElementById("modal-lugar-contacto");
    var enlaceEl = document.getElementById("modal-lugar-enlace");

    if (imgEl) imgEl.src = lugar.imagen || "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80";
    if (logoEl) logoEl.src = lugar.logo || "img/logo-placeholder.svg";
    if (catEl) catEl.textContent = lugar.categoria || "Alojamiento Turístico";
    if (depEl) depEl.textContent = lugar.departamento || "Bolivia";
    if (nomEl) nomEl.textContent = lugar.nombre || "Destino Turístico";
    if (descEl) descEl.textContent = lugar.resumen || "";
    if (precioEl) precioEl.textContent = lugar.precioReferencial || "Consultar tarifa";
    if (contactoEl) {
      contactoEl.textContent = lugar.contacto || "+591 70000000";
      contactoEl.href = "tel:" + (lugar.contacto ? lugar.contacto.replace(/\s+/g, "") : "");
    }
    if (enlaceEl) enlaceEl.href = lugar.enlace || "hoteles.html";

    // Servicios / Tags
    if (servEl) {
      servEl.innerHTML = "";
      (lugar.servicios || []).forEach(function (srv) {
        var tag = document.createElement("span");
        tag.className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-slate-200 border border-white/10";
        tag.innerHTML =
          '<svg class="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">' +
          '<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>' +
          "</svg> " + esc(srv);
        servEl.appendChild(tag);
      });
    }

    // Animación suave de apertura (fade + sutil escala)
    modal.classList.remove("hidden");
    var dialog = modal.querySelector(".modal-card-anim");

    if (typeof gsap !== "undefined" && dialog) {
      gsap.killTweensOf([modal, dialog]);
      gsap.set(modal, { opacity: 0 });
      gsap.set(dialog, { scale: 0.93, opacity: 0, y: 16 });
      gsap.to(modal, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.to(dialog, { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "back.out(1.15)" });
    } else {
      modal.style.opacity = "1";
    }
  };

  var modalLugarAnimando = false;
  window.ocultarModalLugar = function () {
    var modal = document.getElementById("modal-lugar-mapa");
    if (!modal || modal.classList.contains("hidden") || modalLugarAnimando) return;
    var dialog = modal.querySelector(".modal-card-anim");

    if (typeof gsap !== "undefined" && dialog) {
      modalLugarAnimando = true;
      gsap.killTweensOf([modal, dialog]);
      gsap.to(dialog, { scale: 0.94, opacity: 0, y: 12, duration: 0.22, ease: "power2.in" });
      gsap.to(modal, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: function () {
          modal.classList.add("hidden");
          modalLugarAnimando = false;
        }
      });
    } else {
      modal.classList.add("hidden");
    }
  };

  // Cerrar modal al hacer clic en el fondo oscuro
  var modalFondo = document.getElementById("modal-lugar-mapa");
  if (modalFondo) {
    modalFondo.addEventListener("click", function (e) {
      if (e.target.id === "modal-lugar-mapa") window.ocultarModalLugar();
    });
  }

  // Arranque (si faltan datos o el contenedor, no hace nada)
  if (escena && svg && GEO && PAISES) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
    else iniciar();
  }
})();
