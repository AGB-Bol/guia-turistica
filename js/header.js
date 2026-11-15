/**
 * Header Reutilizable - Guía Internacional de Turismo
 * Se puede incluir en cualquier archivo HTML agregando:
 *   <div id="main-header"></div>
 *   <script src="js/header.js"></script>
 */

(function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const isHome = currentPath === "" || currentPath === "index.html";

  // Enlaces que deben redirigir a index.html si estamos en una subpágina
  const homePrefix = isHome ? "" : "index.html";

  const rubrosLinks = [
    { href: "operadores.html", text: "Operadores" },
    { href: "agencias.html", text: "Agencias de Viaje" },
    { href: "hoteles.html", text: "Hoteles" },
    { href: "transporte.html", text: "Transporte" },
    { href: "embajadas.html", text: "Embajadas y Consulados" },
    { href: "instituciones.html", text: "Instituciones y Municipios" },
    { href: "servicios-especiales.html", text: "Otros Servicios" },
  ];

  const isRubroActive = rubrosLinks.some((s) => s.href === currentPath);

  function generateHeaderHTML(ctaText = "Registrar Empresa", ctaHref = null) {
    const targetCtaHref = ctaHref || `${homePrefix}#seccion-registro`;
    return `
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
      
      <!-- Brand & Logo -->
      <a href="${homePrefix || 'index.html'}" class="flex items-center gap-3 group">
        <div class="relative flex items-center">
          <img 
            id="site-logo"
            src="img/logo.png" 
            alt="Logo"
            onerror="this.onerror=null; this.src='img/logo-placeholder.svg';" 
            class="h-9 w-auto max-w-[150px] object-contain transition-transform group-hover:scale-105"
          >
        </div>
        <span class="font-extrabold text-base tracking-tight text-slate-900">
          Guía <span class="text-red-700">Internacional</span>
        </span>
      </a>

      <!-- Navegación Escritorio -->
      <nav class="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
        <a href="${homePrefix}#hero-section" class="hover:text-slate-900 transition-colors">
          Inicio
        </a>
        <a href="${homePrefix}#nosotros" class="hover:text-slate-900 transition-colors">
          Nosotros
        </a>
        
        <!-- Dropdown Rubros -->
        <div class="relative dropdown py-3">
          <button type="button" class="flex items-center gap-1 ${isRubroActive ? 'text-red-700 font-bold' : 'text-slate-700 hover:text-slate-900'} py-1 transition-colors">
            <span>Rubros</span>
            <svg class="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          <div class="dropdown-menu hidden absolute left-0 top-full w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50">
            ${rubrosLinks
              .map(
                (item) => `
              <a href="${item.href}" class="block px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  currentPath === item.href
                    ? 'text-red-700 font-bold bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }">
                ${item.text}
              </a>
            `
              )
              .join("")}
          </div>
        </div>

        <a href="${homePrefix}#destinos" class="hover:text-slate-900 transition-colors">Destinos</a>
        <a href="${homePrefix}#empresas" class="hover:text-slate-900 transition-colors">Empresas</a>
        <a href="${homePrefix}#reconocimientos" class="hover:text-slate-900 transition-colors">Reconocimientos</a>
      </nav>

      <!-- Acción & Botón Mobile -->
      <div class="flex items-center gap-3">
        <a href="${targetCtaHref}" class="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors">
          ${ctaText}
        </a>

        <!-- Botón Hamburguesa Móvil -->
        <button 
          id="mobile-menu-btn" 
          type="button" 
          class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menú"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>
      </div>

    </div>

    <!-- Menú Desplegable Móvil -->
    <div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
      <a href="${homePrefix}#hero-section" class="block text-sm font-semibold text-slate-700">
        Inicio
      </a>
      <a href="${homePrefix}#nosotros" class="block text-sm font-semibold text-slate-700">
        Nosotros
      </a>
      <div class="pt-2 border-t border-slate-100">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Rubros</span>
        <div class="grid grid-cols-1 gap-1 pl-2">
          ${rubrosLinks
            .map(
              (item) => `
            <a href="${item.href}" class="text-xs py-1.5 font-medium ${
                currentPath === item.href
                  ? 'text-red-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }">
              ${item.text}
            </a>
          `
            )
            .join("")}
        </div>
      </div>
      <div class="pt-2 border-t border-slate-100 space-y-2">
        <a href="${homePrefix}#destinos" class="block text-sm font-semibold text-slate-700">Destinos</a>
        <a href="${homePrefix}#empresas" class="block text-sm font-semibold text-slate-700">Empresas</a>
        <a href="${homePrefix}#reconocimientos" class="block text-sm font-semibold text-slate-700">Reconocimientos</a>
      </div>
      <div class="pt-2">
        <a href="${targetCtaHref}" class="block text-center w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-lg transition-colors">
          ${ctaText}
        </a>
      </div>
    </div>
  </header>
    `;
  }

  function initHeader() {
    let container = document.getElementById("main-header");
    if (!container) {
      container = document.querySelector("header");
    }

    if (container) {
      const ctaText = container.getAttribute("data-cta-text") || "Registrar Empresa";
      const ctaHref = container.getAttribute("data-cta-href") || `${homePrefix}#seccion-registro`;

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generateHeaderHTML(ctaText, ctaHref).trim();
      const newHeader = tempDiv.firstElementChild;
      container.replaceWith(newHeader);

      // Event listener para menú móvil
      const mobileBtn = newHeader.querySelector("#mobile-menu-btn");
      const mobileMenu = newHeader.querySelector("#mobile-menu");
      if (mobileBtn && mobileMenu) {
        mobileBtn.addEventListener("click", () => {
          mobileMenu.classList.toggle("hidden");
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeader);
  } else {
    initHeader();
  }
})();
