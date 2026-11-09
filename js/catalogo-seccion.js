/**
 * ============================================================================
 * GUÍA TURÍSTICA DE BOLIVIA - CONTROLADOR DINÁMICO DE CATÁLOGO Y SUBPÁGINAS
 * ============================================================================
 * Características:
 *  1. Filtrado dinámico por texto, tipo de servicio y departamento.
 *  2. Paginación automática a 9 bloques por página.
 *  3. Tarjetas con "Representado por: [Nombre]" entre título y descripción.
 *  4. Logotipo o imagen cuadrada al lado del título.
 *  5. Modal interactivo con animación suave (fade & scale) para ver detalles y contacto directo.
 *  6. Cero dependencias de base de datos externa; funciona directamente con los mocks en /data/.
 */

(function () {
  'use strict';

  var CatalogoSeccion = {
    datos: [],
    filtrados: [],
    paginaActual: 1,
    itemsPorPagina: 9,
    config: {},
    modalActivo: false,

    init: function (opciones) {
      this.config = Object.assign({
        datos: [],
        contenedorGrid: 'grid-catalogo',
        contenedorPaginacion: 'paginacion-catalogo',
        filtroInputId: 'filtro-busqueda',
        filtroTipoId: 'filtro-tipo',
        filtroDeptId: 'filtro-departamento',
        contadorId: 'total-registros-badge',
        itemsPorPagina: 9,
        colorBadge: 'text-red-700 bg-red-50 border-red-100',
        colorBoton: 'text-red-700 hover:text-red-800'
      }, opciones || {});

      this.datos = Array.isArray(this.config.datos) ? this.config.datos : [];
      this.itemsPorPagina = this.config.itemsPorPagina || 9;
      this.paginaActual = 1;

      this.crearEstructuraModal();
      this.enlazarEventosFiltro();
      this.aplicarFiltros();
    },

    enlazarEventosFiltro: function () {
      var self = this;
      var input = document.getElementById(this.config.filtroInputId);
      var selectTipo = document.getElementById(this.config.filtroTipoId);
      var selectDept = document.getElementById(this.config.filtroDeptId);

      if (input) {
        input.addEventListener('input', function () {
          self.paginaActual = 1;
          self.aplicarFiltros();
        });
      }

      if (selectTipo) {
        selectTipo.addEventListener('change', function () {
          self.paginaActual = 1;
          self.aplicarFiltros();
        });
      }

      if (selectDept) {
        selectDept.addEventListener('change', function () {
          self.paginaActual = 1;
          self.aplicarFiltros();
        });
      }

      // Si viene con parámetros en URL (ej: ?dept=potosi o ?q=uyuni)
      var params = new URLSearchParams(window.location.search);
      if (params.has('q') && input) input.value = params.get('q');
      if (params.has('tipo') && selectTipo) selectTipo.value = params.get('tipo');
      if (params.has('dept') && selectDept) selectDept.value = params.get('dept');
    },

    aplicarFiltros: function () {
      var input = document.getElementById(this.config.filtroInputId);
      var selectTipo = document.getElementById(this.config.filtroTipoId);
      var selectDept = document.getElementById(this.config.filtroDeptId);

      var q = input ? input.value.trim().toLowerCase() : '';
      var tipo = selectTipo ? selectTipo.value.trim().toLowerCase() : '';
      var dept = selectDept ? selectDept.value.trim().toLowerCase() : '';

      this.filtrados = this.datos.filter(function (item) {
        var textoUnificado = (
          (item.nombre || '') + ' ' +
          (item.representado || '') + ' ' +
          (item.descripcion || '') + ' ' +
          (item.ciudad || '') + ' ' +
          (item.departamento || '') + ' ' +
          (item.tags ? item.tags.join(' ') : '')
        ).toLowerCase();

        var coincideTexto = !q || textoUnificado.indexOf(q) !== -1;
        var coincideTipo = !tipo || (item.tipo && item.tipo.toLowerCase() === tipo);
        var coincideDept = !dept || (item.departamento && item.departamento.toLowerCase() === dept);

        return coincideTexto && coincideTipo && coincideDept;
      });

      this.actualizarContador();
      this.renderizarCatalogo();
      this.renderizarPaginacion();
    },

    actualizarContador: function () {
      var el = document.getElementById(this.config.contadorId);
      if (el) {
        var total = this.filtrados.length;
        el.innerHTML = '<span class="font-bold text-slate-900">' + total + '</span> registros' +
          (total !== this.datos.length ? ' <span class="text-slate-400 font-normal">(de ' + this.datos.length + ')</span>' : '');
      }
    },

    renderizarCatalogo: function () {
      var grid = document.getElementById(this.config.contenedorGrid);
      if (!grid) return;

      if (this.filtrados.length === 0) {
        grid.innerHTML = [
          '<div class="col-span-full py-16 text-center bg-white border border-slate-200 rounded-2xl p-8">',
          '  <div class="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-4">',
          '    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
          '  </div>',
          '  <h3 class="text-base font-bold text-slate-900">No se encontraron resultados</h3>',
          '  <p class="text-xs text-slate-500 max-w-sm mx-auto mt-1.5">Intenta cambiar las palabras clave de búsqueda o restablecer los filtros de tipo y departamento.</p>',
          '  <button type="button" onclick="CatalogoSeccion.resetearFiltros()" class="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors">',
          '    Restablecer filtros',
          '  </button>',
          '</div>'
        ].join('');
        return;
      }

      var inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      var fin = inicio + this.itemsPorPagina;
      var itemsPagina = this.filtrados.slice(inicio, fin);

      var self = this;
      var html = itemsPagina.map(function (item) {
        var tagsHtml = (item.tags && item.tags.length > 0)
          ? item.tags.slice(0, 3).map(function (t) {
              return '<span class="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">' + t + '</span>';
            }).join(' ')
          : '';

        var logoSrc = item.logo || 'img/logo-cuadrado.svg';

        return [
          '<article class="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-slate-400 hover:shadow-md transition-all duration-200 group">',
          '  <div>',
          '    <!-- Fila superior: categoría y ciudad -->',
          '    <div class="flex items-center justify-between gap-2 mb-3">',
          '      <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ' + self.config.colorBadge + '">',
          '        ' + (item.categoria || 'Directorio') + '',
          '      </span>',
          '      <span class="text-xs font-semibold text-slate-400 truncate text-right">',
          '        ' + (item.ciudad || item.departamento || 'Bolivia') + '',
          '      </span>',
          '    </div>',
          '',
          '    <!-- Bloque Título con logotipo cuadrado pequeño al lado -->',
          '    <div class="flex items-center gap-3 mb-2.5">',
          '      <div class="w-11 h-11 rounded-lg border border-slate-200 bg-slate-50 p-1 shrink-0 flex items-center justify-center overflow-hidden">',
          '        <img src="' + logoSrc + '" alt="' + item.nombre + '" class="w-full h-full object-contain" onerror="this.src=\'img/logo-cuadrado.svg\'">',
          '      </div>',
          '      <h2 class="text-base font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">',
          '        ' + item.nombre + '',
          '      </h2>',
          '    </div>',
          '',
          '    <!-- Representado por: [Nombre] -->',
          '    <div class="text-xs text-slate-500 mb-2.5 pb-2.5 border-b border-slate-100 flex items-center gap-1.5 flex-wrap">',
          '      <span class="text-slate-400 font-medium">Representado por:</span>',
          '      <strong class="font-semibold text-slate-700">' + (item.representado || 'Acreditación Directa') + '</strong>',
          '    </div>',
          '',
          '    <!-- Descripción breve -->',
          '    <p class="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-3">',
          '      ' + item.descripcion + '',
          '    </p>',
          '',
          '    <!-- Tags -->',
          '    <div class="flex flex-wrap gap-1 mt-auto">',
          '      ' + tagsHtml + '',
          '    </div>',
          '  </div>',
          '',
          '  <!-- Pie de Tarjeta: Precio y Botón de Modal -->',
          '  <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">',
          '    <span class="font-bold text-slate-800">' + (item.precio || 'Consultar') + '</span>',
          '    <button type="button" onclick="CatalogoSeccion.abrirModal(\'' + item.id + '\')" class="font-bold ' + self.config.colorBoton + ' inline-flex items-center gap-1 hover:underline">',
          '      Ver detalle',
          '      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
          '    </button>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');

      grid.innerHTML = html;
    },

    renderizarPaginacion: function () {
      var cont = document.getElementById(this.config.contenedorPaginacion);
      if (!cont) return;

      var totalItems = this.filtrados.length;
      var totalPaginas = Math.ceil(totalItems / this.itemsPorPagina);

      if (totalPaginas <= 1) {
        cont.innerHTML = '';
        return;
      }

      var inicio = (this.paginaActual - 1) * this.itemsPorPagina + 1;
      var fin = Math.min(this.paginaActual * this.itemsPorPagina, totalItems);

      var html = [];
      html.push('<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-200 mt-8">');
      
      // Resumen
      html.push('  <div class="text-xs text-slate-500 font-medium">');
      html.push('    Mostrando <span class="font-bold text-slate-900">' + inicio + '–' + fin + '</span> de <span class="font-bold text-slate-900">' + totalItems + '</span> registros');
      html.push('  </div>');

      // Botones
      html.push('  <div class="flex items-center gap-1.5 flex-wrap justify-center">');

      // Botón Anterior
      var prevDisabled = this.paginaActual === 1;
      html.push('    <button type="button" ' + (prevDisabled ? 'disabled' : '') + ' onclick="CatalogoSeccion.irAPagina(' + (this.paginaActual - 1) + ')" class="px-3 py-1.5 text-xs font-semibold rounded-lg border ' + (prevDisabled ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400') + ' transition-colors inline-flex items-center gap-1">');
      html.push('      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>');
      html.push('      Anterior');
      html.push('    </button>');

      // Números de página
      for (var p = 1; p <= totalPaginas; p++) {
        var esActual = p === this.paginaActual;
        html.push('    <button type="button" onclick="CatalogoSeccion.irAPagina(' + p + ')" class="w-8 h-8 text-xs font-bold rounded-lg transition-colors ' + (esActual ? 'bg-slate-900 text-white shadow-sm' : 'border border-slate-200 text-slate-700 bg-white hover:bg-slate-100 hover:border-slate-300') + '">');
        html.push('      ' + p);
        html.push('    </button>');
      }

      // Botón Siguiente
      var nextDisabled = this.paginaActual === totalPaginas;
      html.push('    <button type="button" ' + (nextDisabled ? 'disabled' : '') + ' onclick="CatalogoSeccion.irAPagina(' + (this.paginaActual + 1) + ')" class="px-3 py-1.5 text-xs font-semibold rounded-lg border ' + (nextDisabled ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-400') + ' transition-colors inline-flex items-center gap-1">');
      html.push('      Siguiente');
      html.push('      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>');
      html.push('    </button>');

      html.push('  </div>');
      html.push('</div>');

      cont.innerHTML = html.join('');
    },

    irAPagina: function (numero) {
      var totalPaginas = Math.ceil(this.filtrados.length / this.itemsPorPagina);
      if (numero < 1 || numero > totalPaginas) return;
      this.paginaActual = numero;
      this.renderizarCatalogo();
      this.renderizarPaginacion();

      // Scroll suave hacia el catálogo
      var grid = document.getElementById(this.config.contenedorGrid);
      if (grid) {
        var rect = grid.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    },

    resetearFiltros: function () {
      var input = document.getElementById(this.config.filtroInputId);
      var selectTipo = document.getElementById(this.config.filtroTipoId);
      var selectDept = document.getElementById(this.config.filtroDeptId);
      if (input) input.value = '';
      if (selectTipo) selectTipo.value = '';
      if (selectDept) selectDept.value = '';
      this.paginaActual = 1;
      this.aplicarFiltros();
    },

    crearEstructuraModal: function () {
      if (document.getElementById('modal-catalogo-overlay')) return;

      var modalHtml = [
        '<div id="modal-catalogo-overlay" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-300" role="dialog" aria-modal="true" onclick="CatalogoSeccion.clickBackdrop(event)">',
        '  <div id="modal-catalogo-card" class="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl p-6 sm:p-7 transform scale-95 transition-all duration-300 max-h-[90vh] overflow-y-auto">',
        '    <!-- Cabecera del modal -->',
        '    <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">',
        '      <div class="flex items-center gap-2 flex-wrap">',
        '        <span id="modal-badge-categoria" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border"></span>',
        '        <span id="modal-badge-ciudad" class="text-xs font-semibold text-slate-400"></span>',
        '      </div>',
        '      <button type="button" onclick="CatalogoSeccion.cerrarModal()" class="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shrink-0" aria-label="Cerrar ventana">',
        '        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        '      </button>',
        '    </div>',
        '',
        '    <!-- Título y Logotipo Cuadrado -->',
        '    <div class="flex items-center gap-3.5 mt-4 mb-3">',
        '      <div class="w-14 h-14 rounded-xl border border-slate-200 bg-slate-50 p-1.5 shrink-0 flex items-center justify-center overflow-hidden">',
        '        <img id="modal-logo" src="img/logo-cuadrado.svg" alt="Logotipo" class="w-full h-full object-contain">',
        '      </div>',
        '      <div>',
        '        <h2 id="modal-titulo" class="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug"></h2>',
        '        <div class="text-xs text-slate-500 mt-1">',
        '          <span class="text-slate-400 font-medium">Representado por:</span>',
        '          <strong id="modal-representado" class="font-semibold text-slate-800 ml-1"></strong>',
        '        </div>',
        '      </div>',
        '    </div>',
        '',
        '    <!-- Descripción Detallada -->',
        '    <div class="my-4 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/70 border border-slate-100 rounded-xl p-4" id="modal-descripcion">',
        '    </div>',
        '',
        '    <!-- Bloque de Precios y Contacto -->',
        '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">',
        '      <div class="p-3 bg-white border border-slate-200 rounded-xl">',
        '        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Tarifa / Arancel</span>',
        '        <span id="modal-precio" class="font-extrabold text-slate-900 text-sm"></span>',
        '      </div>',
        '      <div class="p-3 bg-white border border-slate-200 rounded-xl">',
        '        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Ubicación / Dirección</span>',
        '        <span id="modal-direccion" class="font-semibold text-slate-700 leading-snug block truncate"></span>',
        '      </div>',
        '    </div>',
        '',
        '    <!-- Tags / Especialidades -->',
        '    <div class="mb-5">',
        '      <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Atributos y Servicios</span>',
        '      <div id="modal-tags" class="flex flex-wrap gap-1.5"></div>',
        '    </div>',
        '',
        '    <!-- Botones de Acción Directa -->',
        '    <div class="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">',
        '      <a id="modal-btn-whatsapp" href="#" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-colors">',
        '        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
        '        <span>Contactar por WhatsApp</span>',
        '      </a>',
        '      <a id="modal-btn-tel" href="#" class="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl inline-flex items-center justify-center gap-2 transition-colors">',
        '        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
        '        <span>Llamar Directo</span>',
        '      </a>',
        '    </div>',
        '  </div>',
        '</div>'
      ].join('');

      document.body.insertAdjacentHTML('beforeend', modalHtml);

      // Cerrar con Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && CatalogoSeccion.modalActivo) {
          CatalogoSeccion.cerrarModal();
        }
      });
    },

    clickBackdrop: function (e) {
      if (e.target.id === 'modal-catalogo-overlay') {
        this.cerrarModal();
      }
    },

    abrirModal: function (id) {
      var item = this.datos.find(function (x) { return x.id === id; });
      if (!item) return;

      var overlay = document.getElementById('modal-catalogo-overlay');
      var card = document.getElementById('modal-catalogo-card');
      if (!overlay || !card) return;

      // Inyectar datos
      document.getElementById('modal-badge-categoria').textContent = item.categoria || 'Directorio';
      document.getElementById('modal-badge-categoria').className = 'text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ' + this.config.colorBadge;
      document.getElementById('modal-badge-ciudad').textContent = item.ciudad || item.departamento || 'Bolivia';
      
      document.getElementById('modal-logo').src = item.logo || 'img/logo-cuadrado.svg';
      document.getElementById('modal-titulo').textContent = item.nombre;
      document.getElementById('modal-representado').textContent = item.representado || 'Acreditación Directa';
      
      var desc = item.descripcionDetallada || item.descripcion;
      document.getElementById('modal-descripcion').innerHTML = '<p>' + desc + '</p>';
      
      document.getElementById('modal-precio').textContent = item.precio || 'Tarifa oficial / Consultar';
      document.getElementById('modal-direccion').textContent = item.direccion || (item.ciudad + ', Bolivia');

      // Tags
      var tagsContainer = document.getElementById('modal-tags');
      if (tagsContainer) {
        tagsContainer.innerHTML = (item.tags && item.tags.length > 0)
          ? item.tags.map(function (t) {
              return '<span class="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-semibold">' + t + '</span>';
            }).join('')
          : '<span class="text-xs text-slate-400">Sin etiquetas adicionales</span>';
      }

      // Enlaces
      var btnWa = document.getElementById('modal-btn-whatsapp');
      var btnTel = document.getElementById('modal-btn-tel');
      var telLimpio = (item.contacto || '').replace(/[^0-9]/g, '');

      if (btnWa) {
        var numWa = telLimpio.startsWith('591') ? telLimpio : ('591' + telLimpio);
        var msgWa = encodeURIComponent('Hola, me comunico a través de la Guía Turística de Bolivia para consultar información sobre ' + item.nombre);
        btnWa.href = 'https://wa.me/' + numWa + '?text=' + msgWa;
      }

      if (btnTel) {
        btnTel.href = 'tel:' + (item.contacto || '+59122000000');
      }

      // Animación suave de apertura (GSAP si está disponible, o CSS fallback)
      overlay.classList.remove('pointer-events-none');
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');

      if (window.gsap) {
        window.gsap.fromTo(card,
          { opacity: 0, scale: 0.92, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      } else {
        card.classList.remove('scale-95');
        card.classList.add('scale-100');
      }

      this.modalActivo = true;
      document.body.style.overflow = 'hidden';
    },

    cerrarModal: function () {
      var overlay = document.getElementById('modal-catalogo-overlay');
      var card = document.getElementById('modal-catalogo-card');
      if (!overlay || !card) return;

      var self = this;
      if (window.gsap) {
        window.gsap.to(card, {
          opacity: 0,
          scale: 0.94,
          y: 10,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: function () {
            overlay.classList.add('opacity-0');
            overlay.classList.add('pointer-events-none');
            overlay.classList.remove('opacity-100');
            self.modalActivo = false;
            document.body.style.overflow = '';
          }
        });
      } else {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
        overlay.classList.add('opacity-0');
        overlay.classList.add('pointer-events-none');
        overlay.classList.remove('opacity-100');
        this.modalActivo = false;
        document.body.style.overflow = '';
      }
    }
  };

  window.CatalogoSeccion = CatalogoSeccion;
})();
