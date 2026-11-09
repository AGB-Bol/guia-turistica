/**
 * ============================================================================
 * GUÍA TURÍSTICA DE BOLIVIA - FOOTER DINÁMICO & REUTILIZABLE
 * ============================================================================
 * Se puede incluir en cualquier archivo HTML agregando:
 *   <div id="main-footer"></div>
 *   <script src="js/footer.js"></script>
 *
 * Características:
 * - No estático: Año automático, botón volver arriba con scroll suave,
 *   newsletter interactivo con validación y confirmación en tiempo real.
 * - Enlaces e índices completos a todas las secciones y categorías.
 * - Redes sociales interactivas y canales de contacto.
 * - Modales interactivos de Políticas de Privacidad y Términos de Servicio.
 */

(function () {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const isHome = currentPath === "" || currentPath === "index.html";
  const homePrefix = isHome ? "" : "index.html";
  const currentYear = new Date().getFullYear();

  function generateFooterHTML() {
    return `
    <footer class="relative bg-[#090D16] text-slate-300 border-t border-slate-800/80 pt-12 pb-8 overflow-hidden select-none">
      
      <!-- Resplandores ambientales de fondo -->
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Barra superior del Footer: Estado en vivo, Newsletter y Botón Volver Arriba -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800/80">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <!-- Presentación del directorio -->
          <div class="lg:col-span-5 space-y-2">
            <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight">
              Directorio Abierto del Turismo en Bolivia
            </h3>
            <p class="text-xs text-slate-400 leading-relaxed font-light max-w-md">
              Conectamos viajeros con agencias, hoteles y transporte certificados sin intermediarios ni comisiones.
            </p>
          </div>

          <!-- Formulario interactivo de Newsletter / Novedades -->
          <div class="lg:col-span-5">
            <form id="footer-newsletter-form" class="space-y-2" onsubmit="event.preventDefault(); window.suscribirNewsletter(this);">
              <label for="newsletter-email" class="block text-xs font-semibold text-slate-300">
                Recibe novedades y ofertas turísticas exclusivas:
              </label>
              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="Ingresa tu correo electrónico..."
                    class="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                  >
                </div>
                <button
                  type="submit"
                  class="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-amber-600 hover:brightness-110 text-white shadow-lg shadow-red-900/20 flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95"
                >
                  <span>Suscribirme</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                </button>
              </div>
              <p id="newsletter-msg" class="text-[11px] text-emerald-400 hidden flex items-center gap-1">
                <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <span>¡Gracias por unirte! Te mantendremos informado de lo mejor de Bolivia.</span>
              </p>
            </form>
          </div>

          <!-- Botón Volver Arriba -->
          <div class="lg:col-span-2 flex lg:justify-end">
            <button
              type="button"
              onclick="window.scrollTo({ top: 0, behavior: 'smooth' });"
              class="group px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 transition-all cursor-pointer shadow-md"
              title="Volver al inicio de la página"
            >
              <span>Subir</span>
              <div class="w-5 h-5 rounded-lg bg-white/10 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                <svg class="w-3 h-3 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>
              </div>
            </button>
          </div>

        </div>
      </div>

      <!-- Cuerpo Principal del Footer: 5 Columnas de Índices y Contenido -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          <!-- Columna 1: Marca, Identidad y Redes Sociales (4 cols) -->
          <div class="lg:col-span-4 space-y-4">
            <a href="${homePrefix || 'index.html'}" class="inline-flex items-center gap-3 group">
              <img
                src="img/logo.png"
                alt="Logo Guía Turística"
                onerror="this.onerror=null; this.src='img/logo-placeholder.svg';"
                class="h-9 w-auto max-w-[140px] object-contain transition-transform group-hover:scale-105"
              >
              <div class="flex flex-col">
                <span class="font-black text-base tracking-tight text-white">
                  Guía <span class="text-red-500">Turística</span>
                </span>
                <span class="text-[10px] text-slate-400 font-mono uppercase tracking-widest">Bolivia · Edición Digital</span>
              </div>
            </a>

            <p class="text-xs text-slate-400 leading-relaxed font-light">
              La plataforma abierta de difusión del turismo boliviano. Diseñada para dar visibilidad a prestadores de servicios de las tierras altas, valles y llanos, promoviendo un turismo responsable y directo.
            </p>

            <!-- Barra tricolor nacional -->
            <div class="flex items-center gap-1 w-28 h-1 rounded-full overflow-hidden">
              <div class="flex-1 h-full bg-red-600"></div>
              <div class="flex-1 h-full bg-amber-400"></div>
              <div class="flex-1 h-full bg-emerald-600"></div>
            </div>

            <!-- Redes Sociales Interactivas -->
            <div class="pt-2">
              <span class="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Conéctate con nosotros:
              </span>
              <div class="flex items-center gap-2 flex-wrap">
                <!-- Facebook -->
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-all" title="Facebook">
                  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
                </a>
                <!-- Instagram -->
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500 hover:bg-pink-600/20 text-slate-400 hover:text-pink-400 flex items-center justify-center transition-all" title="Instagram">
                  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <!-- TikTok -->
                <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-all" title="TikTok">
                  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.77 1.81-.02 3.25-1.51 3.32-3.32.06-2.85.02-5.71.04-8.56 0-3.32 0-6.63-.01-9.95z"/></svg>
                </a>
                <!-- WhatsApp -->
                <a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-600/20 text-slate-400 hover:text-emerald-400 flex items-center justify-center transition-all" title="WhatsApp Oficial">
                  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                </a>
                <!-- YouTube -->
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500 hover:bg-red-600/20 text-slate-400 hover:text-red-400 flex items-center justify-center transition-all" title="YouTube">
                  <svg class="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              </div>
            </div>
          </div>

          <!-- Columna 2: Directorio & Categorías (2 cols) -->
          <div class="lg:col-span-2 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-white">
              Directorio
            </span>
            <ul class="space-y-2 text-xs text-slate-400">
              <li><a href="agencias.html" class="hover:text-red-400 transition-colors">Agencias de Viaje</a></li>
              <li><a href="hoteles.html" class="hover:text-red-400 transition-colors">Hoteles y Hospedajes</a></li>
              <li><a href="transporte.html" class="hover:text-red-400 transition-colors">Transporte Turístico</a></li>
              <li><a href="instituciones.html" class="hover:text-red-400 transition-colors">Instituciones Públicas</a></li>
              <li><a href="embajadas.html" class="hover:text-red-400 transition-colors">Embajadas y Consulados</a></li>
              <li><a href="servicios-especiales.html" class="hover:text-red-400 transition-colors">Vinos, Café y Artesanías</a></li>
            </ul>
          </div>

          <!-- Columna 3: Explorar por Región (2 cols) -->
          <div class="lg:col-span-2 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-white">
              Destinos Clave
            </span>
            <ul class="space-y-2 text-xs text-slate-400">
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Salar de Uyuni</a></li>
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Lago Titicaca</a></li>
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Madidi y Rurrenabaque</a></li>
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Misiones Jesuíticas</a></li>
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Torotoro y Dinosaurios</a></li>
              <li><a href="${homePrefix}#seccion-mapa" class="hover:text-amber-400 transition-colors">Ruta del Vino Tarijeño</a></li>
            </ul>
          </div>

          <!-- Columna 4: Empresas & Operadores (2 cols) -->
          <div class="lg:col-span-2 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-white">
              Para Empresas
            </span>
            <ul class="space-y-2 text-xs text-slate-400">
              <li>
                <a href="${homePrefix}#seccion-registro" class="text-amber-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Registrar Empresa</span>
                  <span>→</span>
                </a>
              </li>
              <li><a href="${homePrefix}#socios" class="hover:text-slate-200 transition-colors">Socios y Aliados</a></li>
              <li><a href="${homePrefix}#seccion-proposito" class="hover:text-slate-200 transition-colors">¿Qué somos?</a></li>
              <li><a href="https://wa.me/59170000000" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors">Soporte Anfitriones</a></li>
              <li><a href="#" onclick="event.preventDefault(); window.abrirModalLegal('faq');" class="hover:text-slate-200 transition-colors">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <!-- Columna 5: Transparencia & Legal (2 cols) -->
          <div class="lg:col-span-2 space-y-3">
            <span class="block text-xs font-bold uppercase tracking-wider text-white">
              Legal y Ayuda
            </span>
            <ul class="space-y-2 text-xs text-slate-400">
              <li>
                <button type="button" onclick="window.abrirModalLegal('privacidad')" class="hover:text-white transition-colors text-left cursor-pointer">
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button type="button" onclick="window.abrirModalLegal('terminos')" class="hover:text-white transition-colors text-left cursor-pointer">
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button type="button" onclick="window.abrirModalLegal('etica')" class="hover:text-white transition-colors text-left cursor-pointer">
                  Turismo Responsable
                </button>
              </li>
              <li>
                <a href="mailto:contacto@guiaturisticabolivia.com" class="hover:text-white transition-colors">
                  contacto@guiaturistica.bo
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <!-- Barra Inferior de Derechos y Créditos -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div class="flex items-center gap-2">
          <span>&copy; <span id="footer-anio">${currentYear}</span> Guía Turística de Bolivia.</span>
          <span class="hidden sm:inline text-slate-700">|</span>
          <span class="hidden sm:inline">Todos los derechos reservados.</span>
        </div>
      </div>

    </footer>

    <!-- ========================================================= -->
    <!-- MODAL INTERACTIVO DE POLÍTICAS Y TÉRMINOS LEGALES          -->
    <!-- ========================================================= -->
    <div id="modal-legal-footer" class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden transition-all select-none">
      <div id="modal-legal-caja" class="relative w-full max-w-2xl bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh] transform scale-95 opacity-0 transition-all duration-200">
        
        <!-- Cabecera del modal -->
        <div class="p-6 bg-gradient-to-r from-slate-900 to-[#1A2234] border-b border-white/10 flex items-center justify-between">
          <div>
            <span class="text-[10px] font-mono font-bold tracking-widest text-red-500 uppercase block mb-1">
              Guía Turística de Bolivia · Transparencia
            </span>
            <h3 id="modal-legal-titulo" class="text-xl font-black text-white tracking-tight">
              Términos Legales
            </h3>
          </div>
          <button type="button" onclick="window.cerrarModalLegal()" class="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer" aria-label="Cerrar modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Contenido escroleable -->
        <div id="modal-legal-cuerpo" class="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
          <!-- Inyectado dinámicamente -->
        </div>

        <!-- Pie del modal -->
        <div class="p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Actualizado al año ${currentYear}</span>
          <button type="button" onclick="window.cerrarModalLegal()" class="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors cursor-pointer">
            Entendido y cerrar
          </button>
        </div>

      </div>
    </div>
    `;
  }

  // Textos y contenido para los modales legales interactivos
  const LEGAL_CONTENT = {
    privacidad: {
      titulo: "Política de Privacidad y Manejo de Datos",
      html: `
        <p><strong>1. Compromiso de Transparencia:</strong> En la <em>Guía Turística de Bolivia</em> valoramos y protegemos la privacidad de cada usuario y prestador turístico. No vendemos, comercializamos ni compartimos información privada con terceros sin consentimiento expreso.</p>
        <p><strong>2. Datos del Registro de Empresas:</strong> La información provista en los formularios de registro (nombre de empresa, contacto público de WhatsApp, teléfono, tarifas referenciales y fotografías) se utiliza exclusivamente para la creación y exhibición de su ficha pública en el catálogo y mapa interactivo.</p>
        <p><strong>3. Enlaces Directos:</strong> Facilitamos el contacto directo e inmediato entre el viajero y el prestador mediante botones de llamada o WhatsApp. La plataforma no intermedia pagos bancarios ni retiene comisiones.</p>
        <p><strong>4. Derechos ARCO:</strong> Cualquier empresa o usuario puede solicitar la actualización o remoción inmediata de su ficha escribiendo a nuestro correo oficial de soporte.</p>
      `
    },
    terminos: {
      titulo: "Términos y Condiciones de Uso",
      html: `
        <p><strong>1. Finalidad Informativa:</strong> La plataforma opera como un directorio abierto y colaborativo para la difusión del turismo receptivo y nacional en los 9 departamentos de Bolivia.</p>
        <p><strong>2. Veracidad de la Información:</strong> Las agencias y prestadores son responsables de la autenticidad de sus licencias turísticas, licencias de funcionamiento municipal y condiciones comerciales pactadas directamente con el viajero.</p>
        <p><strong>3. Exención de Comisiones:</strong> Este directorio no cobra porcentaje ni comisión por reservas generadas, garantizando tarifas transparentes y justas.</p>
        <p><strong>4. Uso Apropiado:</strong> Queda prohibido el uso indebido de los datos de contacto publicados para fines distintos al turismo, promociones fraudulentas o spam.</p>
      `
    },
    etica: {
      titulo: "Código de Turismo Responsable y Sostenible",
      html: `
        <p><strong>1. Respeto al Patrimonio y Comunidades:</strong> Fomentamos expediciones y visitas que respeten la identidad cultural, tradiciones de pueblos originarios y la integridad de monumentos históricos y áreas protegidas.</p>
        <p><strong>2. Cero Residuos en Destino:</strong> Instamos a viajeros y operadores en destinos frágiles (Salar de Uyuni, Lago Titicaca, Parque Nacional Madidi, Torotoro) a implementar políticas de retorno de residuos y respeto estricto a la flora y fauna.</p>
        <p><strong>3. Contratación Local:</strong> Apoyamos activamente el turismo comunitario y la contratación de guías locales certificados de cada departamento.</p>
      `
    },
    faq: {
      titulo: "Preguntas Frecuentes (FAQ)",
      html: `
        <p><strong>¿Tiene algún costo registrar mi empresa en el directorio?</strong><br>No, el registro básico en la Guía Turística de Bolivia es gratuito para operadores, hoteles y servicios debidamente constituidos.</p>
        <p><strong>¿Cómo se verifican los datos?</strong><br>Nuestro equipo revisa las solicitudes recibidas mediante el formulario de registro, confirmando número de contacto, fotografías y vigencia del servicio antes de su publicación en el mapa.</p>
        <p><strong>¿Cómo contactan los clientes a mi empresa?</strong><br>Directamente a través de tu número de WhatsApp, llamada telefónica o enlace web registrado en tu ficha, sin intermediarios.</p>
      `
    }
  };

  // Función interactiva para abrir modales legales con transición
  window.abrirModalLegal = function (tipo) {
    const data = LEGAL_CONTENT[tipo] || LEGAL_CONTENT.terminos;
    const modal = document.getElementById("modal-legal-footer");
    const caja = document.getElementById("modal-legal-caja");
    const tit = document.getElementById("modal-legal-titulo");
    const cuerpo = document.getElementById("modal-legal-cuerpo");

    if (!modal || !caja) return;

    tit.textContent = data.titulo;
    cuerpo.innerHTML = data.html;

    modal.classList.remove("hidden");

    if (typeof gsap !== "undefined") {
      gsap.killTweensOf([modal, caja]);
      gsap.set(modal, { opacity: 0 });
      gsap.set(caja, { scale: 0.94, opacity: 0, y: 16 });
      gsap.to(modal, { opacity: 1, duration: 0.28, ease: "power2.out" });
      gsap.to(caja, { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: "back.out(1.15)" });
    } else {
      setTimeout(() => {
        caja.classList.remove("scale-95", "opacity-0");
        caja.classList.add("scale-100", "opacity-100");
      }, 10);
    }
  };

  let modalLegalAnimando = false;
  window.cerrarModalLegal = function () {
    const modal = document.getElementById("modal-legal-footer");
    const caja = document.getElementById("modal-legal-caja");
    if (!modal || !caja || modal.classList.contains("hidden") || modalLegalAnimando) return;

    if (typeof gsap !== "undefined") {
      modalLegalAnimando = true;
      gsap.killTweensOf([modal, caja]);
      gsap.to(caja, { scale: 0.95, opacity: 0, y: 12, duration: 0.22, ease: "power2.in" });
      gsap.to(modal, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.add("hidden");
          modalLegalAnimando = false;
        }
      });
    } else {
      caja.classList.remove("scale-100", "opacity-100");
      caja.classList.add("scale-95", "opacity-0");
      setTimeout(() => {
        modal.classList.add("hidden");
      }, 200);
    }
  };

  // Suscripción al newsletter interactiva sin recargar página
  window.suscribirNewsletter = function (form) {
    const input = form.querySelector("#newsletter-email");
    const msg = document.getElementById("newsletter-msg");
    if (!input || !input.value) return;

    if (msg) {
      msg.classList.remove("hidden");
      input.value = "";
      setTimeout(() => {
        msg.classList.add("hidden");
      }, 5000);
    }
  };

  function initFooter() {
    let container = document.getElementById("main-footer");
    if (!container) {
      container = document.querySelector("footer");
    }

    if (container) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = generateFooterHTML().trim();
      
      // Reemplazar o montar
      const newFooterElements = Array.from(tempDiv.children);
      if (newFooterElements.length > 0) {
        container.replaceWith(...newFooterElements);
      }

      // Event listener para cerrar modal al hacer clic en el backdrop
      const modal = document.getElementById("modal-legal-footer");
      if (modal) {
        modal.addEventListener("click", (e) => {
          if (e.target.id === "modal-legal-footer") {
            window.cerrarModalLegal();
          }
        });
      }

      // Cerrar modal legal con ESC
      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          window.cerrarModalLegal();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFooter);
  } else {
    initFooter();
  }
})();
