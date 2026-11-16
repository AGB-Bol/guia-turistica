/**
 * Selects con menú propio - Guía Internacional de Turismo
 * Convierte cada <select> en un menú que se abre al pasar el ratón o al enfocar
 * (igual que el menú "Rubros" de la barra de navegación). En pantallas táctiles
 * se abre con un toque. El <select> original se conserva oculto, así que
 * .value, el evento "change" y el resto del código siguen funcionando igual.
 *
 * La lista se dibuja en <body> con position:fixed y el z-index máximo, para que
 * siempre quede por encima de tarjetas, cabeceras y cualquier otro elemento.
 *
 * Incluir antes de js/footer.js:
 *   <script src="js/selects.js"></script>
 */
(function () {
  var CSS =
    ".hsel{position:relative;display:block}" +
    ".hsel-btn{display:flex;align-items:center;justify-content:space-between;gap:.5rem;width:100%;text-align:left;cursor:pointer}" +
    ".hsel-btn>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".hsel-btn svg{flex:none;width:1rem;height:1rem;transition:transform .15s cubic-bezier(.23,1,.32,1)}" +
    ".hsel.hsel-abierto .hsel-btn svg{transform:rotate(180deg)}" +
    ".hsel-menu{position:fixed;z-index:2147483000;visibility:hidden;opacity:0;transform:scale(.97);transform-origin:top left;" +
    "transition:opacity .15s cubic-bezier(.23,1,.32,1),transform .15s cubic-bezier(.23,1,.32,1),visibility .15s}" +
    ".hsel-menu.hsel-arriba{transform-origin:bottom left}" +
    ".hsel-menu.hsel-visible{visibility:visible;opacity:1;transform:none}" +
    ".hsel-menu .hsel-puente{height:6px}" +
    ".hsel-panel{background:#fff;border:2px solid #0f172a;border-radius:.75rem;box-shadow:4px 4px 0 0 #0f172a;max-height:18rem;overflow:auto;padding:.375rem}" +
    ".hsel-op{display:block;width:100%;text-align:left;padding:.5rem .75rem;border-radius:.5rem;font-family:inherit;font-size:.875rem;font-weight:700;color:#334155;cursor:pointer;white-space:nowrap}" +
    ".hsel-op:hover,.hsel-op:focus{background:#FFE58A;color:#0f172a;outline:none}" +
    ".hsel-op[aria-selected=true]{background:#0f172a;color:#fff}" +
    "@media (prefers-reduced-motion:reduce){.hsel-menu,.hsel-btn svg{transition:none}}";

  var CHEVRON =
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>';

  var descValor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
  var haySoloToque = !window.matchMedia("(hover: hover)").matches;
  var cierres = []; // funciones para cerrar todos los menús

  function cerrarTodos(excepto) {
    cierres.forEach(function (c) { if (c !== excepto) c(); });
  }

  function mejorar(sel) {
    if (sel.dataset.mejorado) return;
    sel.dataset.mejorado = "1";

    var wrap = document.createElement("div");
    wrap.className = "hsel";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = sel.className + " hsel-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    var etiqueta = sel.getAttribute("aria-label");
    if (!etiqueta && sel.id) {
      var lab = document.querySelector('label[for="' + sel.id + '"]');
      if (lab) etiqueta = lab.textContent.trim();
    }
    if (etiqueta) btn.setAttribute("aria-label", etiqueta);

    var texto = document.createElement("span");
    btn.appendChild(texto);
    btn.insertAdjacentHTML("beforeend", CHEVRON);

    var menu = document.createElement("div");
    menu.className = "hsel-menu";
    var puente = document.createElement("div");
    puente.className = "hsel-puente";
    var panel = document.createElement("div");
    panel.className = "hsel-panel";
    panel.setAttribute("role", "listbox");
    menu.appendChild(puente);
    menu.appendChild(panel);

    var opciones = [];
    var temporizador = null;
    var abierto = false;

    Array.prototype.forEach.call(sel.options, function (o) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "hsel-op";
      b.setAttribute("role", "option");
      b.dataset.valor = o.value;
      b.textContent = o.textContent;
      b.addEventListener("click", function () {
        descValor.set.call(sel, o.value);
        sel.dispatchEvent(new Event("input", { bubbles: true }));
        sel.dispatchEvent(new Event("change", { bubbles: true }));
        actualizar();
        cerrar();
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      });
      panel.appendChild(b);
      opciones.push(b);
    });

    function actualizar() {
      var actual = sel.options[sel.selectedIndex];
      texto.textContent = actual ? actual.textContent : "";
      opciones.forEach(function (b) {
        b.setAttribute("aria-selected", String(b.dataset.valor === descValor.get.call(sel)));
      });
    }

    // Coloca la lista pegada al botón; si no cabe abajo, la abre hacia arriba
    function posicionar() {
      var r = btn.getBoundingClientRect();
      menu.style.minWidth = r.width + "px";
      menu.style.left = Math.max(8, Math.min(r.left, window.innerWidth - menu.offsetWidth - 8)) + "px";
      var alto = menu.offsetHeight;
      var espacioAbajo = window.innerHeight - r.bottom;
      var arriba = espacioAbajo < alto + 8 && r.top > espacioAbajo;
      menu.classList.toggle("hsel-arriba", arriba);
      puente.style.order = arriba ? "2" : "0";
      menu.style.display = "flex";
      menu.style.flexDirection = "column";
      menu.style.top = arriba ? Math.max(8, r.top - alto) + "px" : r.bottom + "px";
    }

    function abrir() {
      clearTimeout(temporizador);
      if (abierto) return;
      cerrarTodos(cerrar);
      abierto = true;
      posicionar();
      wrap.classList.add("hsel-abierto");
      menu.classList.add("hsel-visible");
      btn.setAttribute("aria-expanded", "true");
    }

    function cerrar() {
      clearTimeout(temporizador);
      if (!abierto) return;
      abierto = false;
      wrap.classList.remove("hsel-abierto");
      menu.classList.remove("hsel-visible");
      btn.setAttribute("aria-expanded", "false");
    }

    function programarCierre() {
      clearTimeout(temporizador);
      temporizador = setTimeout(cerrar, 140);
    }

    cierres.push(cerrar);

    // Que asignar .value desde el código también actualice el menú
    Object.defineProperty(sel, "value", {
      configurable: true,
      get: function () { return descValor.get.call(this); },
      set: function (v) { descValor.set.call(this, v); actualizar(); }
    });

    // Ratón: abre al entrar al botón o a la lista; cierra con un pequeño margen
    wrap.addEventListener("mouseenter", function () { if (!haySoloToque) abrir(); });
    wrap.addEventListener("mouseleave", programarCierre);
    menu.addEventListener("mouseenter", function () { clearTimeout(temporizador); });
    menu.addEventListener("mouseleave", programarCierre);

    // Teclado
    btn.addEventListener("focus", function () { if (!haySoloToque) abrir(); });
    function alPerderFoco(e) {
      var destino = e.relatedTarget;
      if (!destino || (!wrap.contains(destino) && !menu.contains(destino))) programarCierre();
    }
    btn.addEventListener("blur", alPerderFoco);
    menu.addEventListener("focusout", alPerderFoco);
    function teclas(e) {
      if (e.key === "Escape") {
        cerrar();
        btn.focus({ preventScroll: true });
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        abrir();
        var lista = [btn].concat(opciones);
        var i = lista.indexOf(document.activeElement);
        var sig = e.key === "ArrowDown" ? Math.min(i + 1, lista.length - 1) : Math.max(i - 1, 0);
        lista[sig].focus({ preventScroll: true });
      }
    }
    wrap.addEventListener("keydown", teclas);
    menu.addEventListener("keydown", teclas);

    // Táctil: un toque abre o cierra; tocar fuera cierra
    if (haySoloToque) {
      btn.addEventListener("click", function () { abierto ? cerrar() : abrir(); });
      document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target) && !menu.contains(e.target)) cerrar();
      });
    }

    // Si la página se desplaza o cambia de tamaño, se recoloca
    window.addEventListener("resize", function () { if (abierto) posicionar(); });
    window.addEventListener("scroll", function () { if (abierto) posicionar(); }, true);

    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(btn);
    wrap.appendChild(sel);
    document.body.appendChild(menu);
    sel.style.display = "none";
    sel.setAttribute("aria-hidden", "true");
    sel.tabIndex = -1;
    actualizar();
  }

  function iniciar() {
    if (!document.getElementById("selects-estilo")) {
      var st = document.createElement("style");
      st.id = "selects-estilo";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    Array.prototype.forEach.call(document.querySelectorAll("select"), mejorar);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }

  window.MejorarSelects = iniciar;
})();
