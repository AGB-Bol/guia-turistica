/**
 * ============================================================================
 * GUÍA TURÍSTICA DE BOLIVIA - CONTROLADOR DINÁMICO DE CATÁLOGO Y SUBPÁGINAS
 * ============================================================================
 * Características:
 *  1. Filtrado dinámico por texto, tipo de servicio y departamento.
 *  2. Paginación automática a 9 bloques por página.
 *  3. Tarjetas con "Representante: [Nombre]" entre título y descripción.
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
          (item.cargo || '') + ' ' +
          (item.descripcion || '') + ' ' +
          (item.pais || '') + ' ' +
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
          '<div class="col-span-full py-16 text-center bg-white border-2 border-slate-900 rounded-2xl p-8 shadow-[4px_4px_0_0_#0f172a]">',
          '  <div class="w-14 h-14 bg-amber-300 text-slate-900 border-2 border-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">',
          '    <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>',
          '  </div>',
          '  <h3 class="text-lg font-extrabold text-slate-900">No se encontraron resultados</h3>',
          '  <p class="text-sm text-slate-600 max-w-sm mx-auto mt-1.5">Intenta cambiar las palabras clave de búsqueda o restablecer los filtros de tipo y departamento.</p>',
          '  <button type="button" onclick="CatalogoSeccion.resetearFiltros()" class="mt-4 px-4 py-2.5 bg-red-600 text-white text-sm font-extrabold rounded-lg border-2 border-slate-900 hover:bg-red-700 active:scale-[0.97] transition duration-150">',
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
        var logoSrc = item.logo || 'img/logo-cuadrado.svg';
        var ubicacion = self.ubicacion(item);

        // Representante + cargo (etiquetas del Excel)
        var representante = item.representado
          ? '    <div class="text-xs text-slate-600 mb-2.5 pb-2.5 border-b border-slate-200">' +
            '<span class="text-slate-400 font-medium">Representante:</span> ' +
            '<strong class="font-semibold text-slate-700">' + self.esc(item.representado) + '</strong>' +
            (item.cargo ? '<span class="block text-slate-500">' + self.esc(item.cargo) + '</span>' : '') +
            '</div>'
          : '    <div class="mb-2.5 pb-2.5 border-b border-slate-200"></div>';

        var descripcion = item.descripcion
          ? '    <p class="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">' + self.esc(item.descripcion) + '</p>'
          : '';

        // Filas de datos de contacto con su etiqueta
        var filas = [
          self.fila('Teléfono', item.contacto),
          self.fila('Correo', item.email),
          self.fila('Dirección', item.direccion)
        ].join('');

        // Iconos de enlaces externos
        var enlaces = self.enlacesExternos(item, true);

        return [
          '<article class="bg-white border-2 border-slate-900 rounded-2xl p-5 flex flex-col justify-between shadow-[4px_4px_0_0_#0f172a] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#0f172a] transition duration-200 group">',
          '  <div>',
          '    <div class="flex items-center justify-between gap-2 mb-3">',
          '      <span class="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border-2 ' + self.config.colorBadge + '">' + self.esc(item.categoria || 'Directorio') + '</span>',
          '      <span class="text-xs font-semibold text-slate-400 truncate text-right">' + self.esc(ubicacion) + '</span>',
          '    </div>',
          '    <div class="flex items-center gap-3 mb-2.5">',
          '      <div class="w-12 h-12 rounded-xl border-2 border-slate-900 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden">',
          '        <img src="' + self.esc(logoSrc) + '" alt="' + self.esc(item.nombre) + '" loading="lazy" class="w-full h-full object-contain" onerror="this.onerror=null;this.src=\'img/logo-cuadrado.svg\'">',
          '      </div>',
          '      <h2 class="font-display text-lg font-extrabold text-slate-900 group-hover:text-red-700 transition-colors leading-snug line-clamp-2">' + self.esc(item.nombre) + '</h2>',
          '    </div>',
          representante,
          descripcion,
          '    <dl class="space-y-1 text-xs">' + filas + '</dl>',
          '  </div>',
          '  <div class="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-sm">',
          '    <div class="flex items-center gap-1.5">' + enlaces + '</div>',
          '    <button type="button" onclick="CatalogoSeccion.abrirModal(\'' + item.id + '\')" class="font-extrabold text-slate-900 bg-amber-300 hover:bg-amber-200 border-2 border-slate-900 px-3 py-1.5 rounded-lg inline-flex items-center gap-1 active:scale-[0.97] transition duration-150 shrink-0">',
          '      Ver detalle',
          '      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
          '    </button>',
          '  </div>',
          '</article>'
        ].join('');
      }).join('');

      grid.innerHTML = html;
    },

    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },

    ubicacion: function (item) {
      var partes = [];
      if (item.ciudad) partes.push(item.ciudad);
      if (item.pais && String(item.pais).toLowerCase() !== 'bolivia') partes.push(item.pais);
      return partes.length ? partes.join(', ') : (item.departamento || 'Bolivia');
    },

    // Fila "Etiqueta: valor" (solo si hay valor)
    fila: function (etiqueta, valor) {
      if (!valor) return '';
      return '<div class="flex gap-1.5"><dt class="text-slate-400 font-medium shrink-0">' + etiqueta + ':</dt>' +
        '<dd class="text-slate-700 font-semibold truncate" title="' + this.esc(valor) + '">' + this.esc(valor) + '</dd></div>';
    },

    // Iconos de sitio web / redes (compactos para la tarjeta, o botones para el modal)
    enlacesExternos: function (item, compacto) {
      var self = this;
      var defs = [
        ['web', 'Sitio web', 'M21 12a9 9 0 11-18 0 9 9 0 0118 0zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 010 18M12 3a14 14 0 000 18'],
        ['facebook', 'Facebook', 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'],
        ['instagram', 'Instagram', 'M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm5 5a5 5 0 100 10 5 5 0 000-10zm5.5-1.5h.01'],
        ['tiktok', 'TikTok', 'M9 12a4 4 0 104 4V3a5 5 0 005 5']
      ];
      return defs.map(function (d) {
        var href = item[d[0]];
        if (!href) return '';
        var clase = compacto
          ? 'w-8 h-8 rounded-lg border-2 border-slate-900 bg-white hover:bg-amber-200 flex items-center justify-center transition-colors'
          : 'px-3 py-2 rounded-xl border-2 border-slate-900 bg-white hover:bg-amber-200 text-xs font-bold text-slate-900 inline-flex items-center gap-1.5 transition-colors';
        return '<a href="' + self.esc(href) + '" target="_blank" rel="noopener noreferrer" title="' + d[1] + '" aria-label="' + d[1] + '" class="' + clase + '">' +
          '<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="' + d[2] + '"/></svg>' +
          (compacto ? '' : '<span>' + d[1] + '</span>') + '</a>';
      }).join('');
    },

    // Primer número de teléfono utilizable (para tel: y WhatsApp)
    primerTelefono: function (item) {
      var bruto = String(item.contacto || '');
      var m = bruto.match(/\+?\(?\d[\d\s().-]{5,}/);
      var num = m ? m[0] : bruto;
      var digitos = num.replace(/[^0-9]/g, '');
      if (!digitos) return { tel: '', wa: '' };
      var conPrefijo = num.trim().charAt(0) === '+';
      if (!conPrefijo && digitos.indexOf('591') !== 0 && item.departamento !== 'internacional') digitos = '591' + digitos;
      return { tel: '+' + digitos, wa: digitos };
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
      html.push('<div class="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t-2 border-slate-900 mt-8">');
      
      // Resumen
      html.push('  <div class="text-xs text-slate-500 font-medium">');
      html.push('    Mostrando <span class="font-bold text-slate-900">' + inicio + '–' + fin + '</span> de <span class="font-bold text-slate-900">' + totalItems + '</span> registros');
      html.push('  </div>');

      // Botones
      html.push('  <div class="flex items-center gap-1.5 flex-wrap justify-center">');

      // Botón Anterior
      var prevDisabled = this.paginaActual === 1;
      html.push('    <button type="button" ' + (prevDisabled ? 'disabled' : '') + ' onclick="CatalogoSeccion.irAPagina(' + (this.paginaActual - 1) + ')" class="px-3 py-1.5 text-sm font-bold rounded-lg border-2 ' + (prevDisabled ? 'border-slate-300 text-slate-300 cursor-not-allowed bg-slate-50' : 'border-slate-900 text-slate-900 bg-white hover:bg-amber-200 active:scale-[0.97]') + ' transition duration-150 inline-flex items-center gap-1">');
      html.push('      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>');
      html.push('      Anterior');
      html.push('    </button>');

      // Números de página
      for (var p = 1; p <= totalPaginas; p++) {
        var esActual = p === this.paginaActual;
        html.push('    <button type="button" onclick="CatalogoSeccion.irAPagina(' + p + ')" class="w-9 h-9 text-sm font-extrabold rounded-lg border-2 border-slate-900 active:scale-[0.97] transition duration-150 ' + (esActual ? 'bg-red-600 text-white' : 'text-slate-900 bg-white hover:bg-amber-200') + '">');
        html.push('      ' + p);
        html.push('    </button>');
      }

      // Botón Siguiente
      var nextDisabled = this.paginaActual === totalPaginas;
      html.push('    <button type="button" ' + (nextDisabled ? 'disabled' : '') + ' onclick="CatalogoSeccion.irAPagina(' + (this.paginaActual + 1) + ')" class="px-3 py-1.5 text-sm font-bold rounded-lg border-2 ' + (nextDisabled ? 'border-slate-300 text-slate-300 cursor-not-allowed bg-slate-50' : 'border-slate-900 text-slate-900 bg-white hover:bg-amber-200 active:scale-[0.97]') + ' transition duration-150 inline-flex items-center gap-1">');
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
        '<div id="modal-catalogo-overlay" class="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 opacity-0 pointer-events-none transition-opacity duration-200" role="dialog" aria-modal="true" onclick="CatalogoSeccion.clickBackdrop(event)">',
        '  <div id="modal-catalogo-card" class="bg-white border-2 border-slate-900 rounded-2xl max-w-xl w-full shadow-[8px_8px_0_0_#0f172a] p-6 sm:p-7 max-h-[90vh] overflow-y-auto">',
        '    <!-- Cabecera del modal -->',
        '    <div class="flex items-start justify-between gap-4 pb-4 border-b-2 border-slate-900">',
        '      <div class="flex items-center gap-2 flex-wrap">',
        '        <span id="modal-badge-categoria" class="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border-2"></span>',
        '        <span id="modal-badge-ciudad" class="text-xs font-semibold text-slate-400"></span>',
        '      </div>',
        '      <button type="button" onclick="CatalogoSeccion.cerrarModal()" class="w-9 h-9 rounded-lg bg-amber-300 hover:bg-amber-200 border-2 border-slate-900 text-slate-900 flex items-center justify-center active:scale-[0.97] transition duration-150 shrink-0" aria-label="Cerrar ventana">',
        '        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
        '      </button>',
        '    </div>',
        '',
        '    <!-- Título y Logotipo Cuadrado -->',
        '    <div class="flex items-center gap-3.5 mt-4 mb-3">',
        '      <div class="w-14 h-14 rounded-xl border-2 border-slate-900 bg-white p-1.5 shrink-0 flex items-center justify-center overflow-hidden">',
        '        <img id="modal-logo" src="img/logo-cuadrado.svg" alt="Logotipo" class="w-full h-full object-contain">',
        '      </div>',
        '      <div>',
        '        <h2 id="modal-titulo" class="font-display text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug"></h2>',
        '        <div class="text-xs text-slate-500 mt-1">',
        '          <span class="text-slate-400 font-medium">Representante:</span>',
        '          <strong id="modal-representado" class="font-semibold text-slate-800 ml-1"></strong>',
        '          <span id="modal-cargo" class="block text-slate-500"></span>',
        '        </div>',
        '      </div>',
        '    </div>',
        '',
        '    <!-- Descripción Detallada -->',
        '    <div class="my-4 text-sm text-slate-700 leading-relaxed bg-amber-50 border-2 border-slate-900/20 rounded-xl p-4" id="modal-descripcion">',
        '    </div>',
        '',
        '    <!-- Datos de contacto (campos del Excel) -->',
        '    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">',
        '      <div class="p-3 bg-white border-2 border-slate-900 rounded-xl">',
        '        <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Teléfono</span>',
        '        <span id="modal-telefono" class="font-extrabold text-slate-900 text-sm break-words"></span>',
        '      </div>',
        '      <div class="p-3 bg-white border-2 border-slate-900 rounded-xl">',
        '        <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Correo</span>',
        '        <span id="modal-email" class="font-semibold text-slate-700 leading-snug block break-all"></span>',
        '      </div>',
        '      <div class="p-3 bg-white border-2 border-slate-900 rounded-xl sm:col-span-2">',
        '        <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-0.5">Ubicación / Dirección</span>',
        '        <span id="modal-direccion" class="font-semibold text-slate-700 leading-snug block"></span>',
        '      </div>',
        '    </div>',
        '',
        '    <!-- Sitio web y redes -->',
        '    <div class="mb-5" id="modal-enlaces-bloque">',
        '      <span class="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">Sitio web y redes</span>',
        '      <div id="modal-enlaces" class="flex flex-wrap gap-2"></div>',
        '    </div>',
        '',
        '    <!-- Botones de Acción Directa -->',
        '    <div class="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row gap-2.5">',
        '      <a id="modal-btn-whatsapp" href="#" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl border-2 border-slate-900 inline-flex items-center justify-center gap-2 active:scale-[0.97] transition duration-150">',
        '        <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>',
        '        <span>Contactar por WhatsApp</span>',
        '      </a>',
        '      <a id="modal-btn-tel" href="#" class="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl border-2 border-slate-900 inline-flex items-center justify-center gap-2 active:scale-[0.97] transition duration-150">',
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
      document.getElementById('modal-badge-ciudad').textContent = this.ubicacion(item);

      document.getElementById('modal-logo').src = item.logo || 'img/logo-cuadrado.svg';
      document.getElementById('modal-logo').onerror = function () { this.onerror = null; this.src = 'img/logo-cuadrado.svg'; };
      document.getElementById('modal-titulo').textContent = item.nombre;
      document.getElementById('modal-representado').textContent = item.representado || 'No registrado';
      document.getElementById('modal-cargo').textContent = item.cargo || '';

      var desc = item.descripcionDetallada || item.descripcion;
      var descEl = document.getElementById('modal-descripcion');
      descEl.style.display = desc ? '' : 'none';
      descEl.textContent = desc || '';

      document.getElementById('modal-telefono').textContent = item.contacto || 'No registrado';
      document.getElementById('modal-email').textContent = item.email || 'No registrado';
      document.getElementById('modal-direccion').textContent = item.direccion || this.ubicacion(item);

      var enlaces = this.enlacesExternos(item, false);
      document.getElementById('modal-enlaces').innerHTML = enlaces;
      document.getElementById('modal-enlaces-bloque').style.display = enlaces ? '' : 'none';

      // Botones de contacto directo
      var btnWa = document.getElementById('modal-btn-whatsapp');
      var btnTel = document.getElementById('modal-btn-tel');
      var tels = this.primerTelefono(item);

      if (btnWa) {
        var msgWa = encodeURIComponent('Hola, me comunico a través de la Guía Internacional de Turismo para consultar información sobre ' + item.nombre);
        btnWa.href = tels.wa ? 'https://wa.me/' + tels.wa + '?text=' + msgWa : '#';
        btnWa.style.display = tels.wa ? '' : 'none';
      }
      if (btnTel) {
        btnTel.href = tels.tel ? 'tel:' + tels.tel : (item.email ? 'mailto:' + item.email : '#');
        btnTel.querySelector('span').textContent = tels.tel ? 'Llamar Directo' : 'Enviar correo';
        btnTel.style.display = (tels.tel || item.email) ? '' : 'none';
      }

      // Animación suave de apertura (GSAP si está disponible, o CSS fallback)
      overlay.classList.remove('pointer-events-none');
      overlay.classList.remove('opacity-0');
      overlay.classList.add('opacity-100');

      window.Motion.entrar(card);

      this.modalActivo = true;
      document.body.style.overflow = 'hidden';
    },

    cerrarModal: function () {
      var overlay = document.getElementById('modal-catalogo-overlay');
      var card = document.getElementById('modal-catalogo-card');
      if (!overlay || !card) return;

      var self = this;
      window.Motion.salir(card, function () {
        overlay.classList.add('opacity-0');
        overlay.classList.add('pointer-events-none');
        overlay.classList.remove('opacity-100');
        self.modalActivo = false;
        document.body.style.overflow = '';
      });
    }
  };

  window.CatalogoSeccion = CatalogoSeccion;
})();
