/**
 * Selects con menú propio - Guía Internacional de Turismo
 * Convierte cada <select> en un menú que se abre al pasar el ratón o al enfocar
 * (igual que el menú "Rubros" de la barra de navegación). En pantallas táctiles
 * se abre con un toque. El <select> original se conserva oculto, así que
 * .value, el evento "change" y el resto del código siguen funcionando igual.
 * Incluir antes de js/footer.js:
 *   <script src="js/selects.js"></script>
 */
(function () {
  var CSS =
    ".hsel{position:relative;display:block}" +
    ".hsel-btn{display:flex;align-items:center;justify-content:space-between;gap:.5rem;width:100%;text-align:left;cursor:pointer}" +
    ".hsel-btn>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".hsel-btn svg{flex:none;width:1rem;height:1rem;transition:transform .15s cubic-bezier(.23,1,.32,1)}" +
    ".hsel-menu{position:absolute;left:0;top:100%;min-width:100%;z-index:80;padding-top:6px;visibility:hidden;opacity:0;transform:scale(.97);transform-origin:top left;" +
    "transition:opacity .15s cubic-bezier(.23,1,.32,1),transform .15s cubic-bezier(.23,1,.32,1),visibility .15s}" +
    ".hsel-panel{background:#fff;border:2px solid #0f172a;border-radius:.75rem;box-shadow:4px 4px 0 0 #0f172a;max-height:18rem;overflow:auto;padding:.375rem}" +
    ".hsel:hover .hsel-menu,.hsel:focus-within .hsel-menu,.hsel.hsel-abierto .hsel-menu{visibility:visible;opacity:1;transform:none}" +
    ".hsel:hover .hsel-btn svg,.hsel:focus-within .hsel-btn svg,.hsel.hsel-abierto .hsel-btn svg{transform:rotate(180deg)}" +
    ".hsel.hsel-cerrado .hsel-menu,.hsel.hsel-cerrado:hover .hsel-menu,.hsel.hsel-cerrado:focus-within .hsel-menu{visibility:hidden;opacity:0;transform:scale(.97)}" +
    ".hsel-op{display:block;width:100%;text-align:left;padding:.5rem .75rem;border-radius:.5rem;font-size:.875rem;font-weight:700;color:#334155;cursor:pointer;white-space:nowrap}" +
    ".hsel-op:hover,.hsel-op:focus{background:#FFE58A;color:#0f172a;outline:none}" +
    ".hsel-op[aria-selected=true]{background:#0f172a;color:#fff}" +
    "@media (prefers-reduced-motion:reduce){.hsel-menu,.hsel-btn svg{transition:none}}";

  var CHEVRON =
    '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>';

  var descValor = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value");
  var haySoloToque = !window.matchMedia("(hover: hover)").matches;

  function mejorar(sel) {
    if (sel.dataset.mejorado) return;
    sel.dataset.mejorado = "1";

    var wrap = document.createElement("div");
    wrap.className = "hsel";

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = sel.className + " hsel-btn";
    btn.setAttribute("aria-haspopup", "listbox");
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
    var panel = document.createElement("div");
    panel.className = "hsel-panel";
    panel.setAttribute("role", "listbox");
    menu.appendChild(panel);

    var opciones = [];
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
        // Cerrar el menú aunque el ratón siga encima; vuelve a abrir al reentrar
        wrap.classList.remove("hsel-abierto");
        wrap.classList.add("hsel-cerrado");
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

    // Que asignar .value desde el código también actualice el menú
    Object.defineProperty(sel, "value", {
      configurable: true,
      get: function () { return descValor.get.call(this); },
      set: function (v) { descValor.set.call(this, v); actualizar(); }
    });

    wrap.addEventListener("mouseleave", function () { wrap.classList.remove("hsel-cerrado"); });
    wrap.addEventListener("focusout", function (e) {
      if (!wrap.contains(e.relatedTarget)) wrap.classList.remove("hsel-cerrado");
    });
    wrap.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        wrap.classList.remove("hsel-abierto");
        wrap.classList.add("hsel-cerrado");
        btn.focus();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        var lista = [btn].concat(opciones);
        var i = lista.indexOf(document.activeElement);
        var sig = e.key === "ArrowDown" ? Math.min(i + 1, lista.length - 1) : Math.max(i - 1, 0);
        wrap.classList.remove("hsel-cerrado");
        lista[sig].focus();
      }
    });

    if (haySoloToque) {
      btn.addEventListener("click", function () { wrap.classList.toggle("hsel-abierto"); });
      document.addEventListener("click", function (e) {
        if (!wrap.contains(e.target)) wrap.classList.remove("hsel-abierto");
      });
    }

    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(btn);
    wrap.appendChild(menu);
    wrap.appendChild(sel);
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
