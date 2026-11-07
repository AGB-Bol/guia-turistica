/**
 * ============================================================================
 * GUÍA TURÍSTICA DE BOLIVIA - MAPA INTERACTIVO CON LEAFLET & TILES CARTO DARK
 * ============================================================================
 * - Contorno geográfico vectorial real de Bolivia (GeoJSON interactivo).
 * - En vista mundial: Solo se aprecia el país resaltado con borde brillante interactivo.
 * - Al hacer clic en Bolivia: Zoom dinámico suave hacia el país y RECIÉN ahí
 *   se revelan los marcadores turísticos (hoteles y destinos).
 * - Botón flotante para volver al mundo con flecha.
 */

(function () {
  let mapInstance = null;
  let marcadoresLayer = null;
  let boliviaGeoJSONLayer = null;

  // Estilos visuales del contorno de Bolivia (Sólidos, limpios y continuos)
  const ESTILOS_BOLIVIA = {
    normal: {
      color: "#F59E0B",      // Borde dorado fino continuo
      weight: 1.8,
      opacity: 0.9,
      fillColor: "#DC2626",  // Relleno rojo suave
      fillOpacity: 0.22,
      dashArray: ""          // Línea continua sin punteados
    },
    hover: {
      color: "#FEF08A",      // Amarillo luminoso
      weight: 2.8,
      opacity: 1,
      fillColor: "#EF4444",  // Rojo vibrante
      fillOpacity: 0.42,
      dashArray: ""
    },
    enfocado: {
      color: "#F59E0B",
      weight: 1.2,
      opacity: 0.35,
      fillColor: "#DC2626",
      fillOpacity: 0.03,
      dashArray: ""
    }
  };

  function intentarInicializar() {
    const mapaContenedor = document.getElementById("mapa-leaflet");
    if (!mapaContenedor) return;

    // Si Leaflet aún no terminó de descargar de la CDN, reintentar en bucle breve
    if (typeof L === "undefined") {
      let intentos = 0;
      const reintento = setInterval(() => {
        intentos++;
        if (typeof L !== "undefined") {
          clearInterval(reintento);
          crearMapa();
        } else if (intentos > 50) {
          clearInterval(reintento);
          console.warn("No se pudo cargar la librería Leaflet.");
        }
      }, 100);
      return;
    }

    crearMapa();
  }

  function crearMapa() {
    const mapaContenedor = document.getElementById("mapa-leaflet");
    const btnVolver = document.getElementById("btn-volver-mundo");

    if (!mapaContenedor || typeof L === "undefined") return;

    if (mapInstance) {
      mapInstance.invalidateSize();
      return;
    }

    const config = window.MAPA_CONFIG || {
      mundoCenter: [15, -25],
      mundoZoom: 2,
      minZoom: 2,
      maxZoom: 14,
      boliviaCenter: [-16.5, -64.5],
      boliviaZoom: 6
    };

    // 1. Crear instancia de Leaflet (Con scrollWheelZoom bloqueado en vista mundial)
    mapInstance = L.map("mapa-leaflet", {
      center: config.mundoCenter,
      zoom: config.mundoZoom,
      minZoom: config.minZoom,
      maxZoom: config.maxZoom,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false, // Bloqueado para no interferir con el scroll de la página
      doubleClickZoom: false   // Desactivado para evitar zooms accidentales
    });

    // 2. Capa de mosaicos OpenStreetMap con shader oscuro CSS (100% libre, sin API key)
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      className: "osm-dark-tiles",
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    L.control.zoom({ position: "bottomright" }).addTo(mapInstance);

    // 3. Capa para los marcadores de hoteles/destinos (Inicialmente VACÍA en vista mundial)
    marcadoresLayer = L.layerGroup().addTo(mapInstance);

    // 4. Dibujar el CONTORNO VECTORIAL REAL de Bolivia con GeoJSON
    if (window.BOLIVIA_GEOJSON) {
      boliviaGeoJSONLayer = L.geoJSON(window.BOLIVIA_GEOJSON, {
        style: ESTILOS_BOLIVIA.normal
      }).addTo(mapInstance);

      // Eventos interactivos en el contorno del país
      boliviaGeoJSONLayer.on("mouseover", function () {
        if (mapInstance.getZoom() < 5) {
          this.setStyle(ESTILOS_BOLIVIA.hover);
        }
      });

      boliviaGeoJSONLayer.on("mouseout", function () {
        if (mapInstance.getZoom() < 5) {
          this.setStyle(ESTILOS_BOLIVIA.normal);
        }
      });

      boliviaGeoJSONLayer.on("click", function () {
        enfocarBolivia();
      });

      // Tooltip flotante al pasar el mouse por el país
      boliviaGeoJSONLayer.bindTooltip(
        '<span class="font-bold text-amber-300">Bolivia</span><br><span class="text-[11px] text-slate-300">Haz clic para explorar destinos</span>',
        { sticky: true, opacity: 0.9, className: "tooltip-pais-custom" }
      );
    }

    // 5. Escuchar cambios de zoom para gestionar visibilidad condicional
    mapInstance.on("zoomend moveend", () => {
      const zoomActual = mapInstance.getZoom();
      
      if (zoomActual >= 5) {
        // En vista enfocada (Bolivia):
        // Habilitar zoom con rueda para explorar detalles locales y mostrar marcadores
        mapInstance.scrollWheelZoom.enable();
        if (btnVolver) btnVolver.classList.remove("hidden");
        if (boliviaGeoJSONLayer) {
          boliviaGeoJSONLayer.setStyle(ESTILOS_BOLIVIA.enfocado);
          boliviaGeoJSONLayer.unbindTooltip();
        }
        mostrarMarcadoresBolivia();
      } else {
        // En vista global (Mundo):
        // Bloquear rueda de scroll para que no interfiera al deslizar la página web
        mapInstance.scrollWheelZoom.disable();
        if (btnVolver) btnVolver.classList.add("hidden");
        if (boliviaGeoJSONLayer) {
          boliviaGeoJSONLayer.setStyle(ESTILOS_BOLIVIA.normal);
          boliviaGeoJSONLayer.bindTooltip(
            '<span class="font-bold text-amber-300">Bolivia</span><br><span class="text-[11px] text-slate-300">Haz clic para explorar destinos</span>',
            { sticky: true, opacity: 0.9, className: "tooltip-pais-custom" }
          );
        }
        ocultarMarcadoresBolivia();
      }
    });

    // 6. Evento del Botón Volver con Flecha
    if (btnVolver) {
      btnVolver.addEventListener("click", () => {
        volverAlMundo();
      });
    }

    // Funciones globales de navegación
    window.enfocarBolivia = function () {
      mapInstance.flyTo(config.boliviaCenter, config.boliviaZoom, {
        duration: 1.6,
        easeLinearity: 0.25
      });
    };

    window.volverAlMundo = function () {
      mapInstance.flyTo(config.mundoCenter, config.mundoZoom, {
        duration: 1.4,
        easeLinearity: 0.25
      });
      ocultarModalLugar();
    };

    // Auto-reajustes de tamaño en contenedor
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 200);
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 600);
    setTimeout(() => { if (mapInstance) mapInstance.invalidateSize(); }, 1400);

    const seccionMapa = document.getElementById("seccion-mapa");
    if (seccionMapa && "IntersectionObserver" in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && mapInstance) {
            mapInstance.invalidateSize();
          }
        });
      }, { threshold: 0.05 });
      obs.observe(seccionMapa);
    }

    window.addEventListener("resize", () => {
      if (mapInstance) mapInstance.invalidateSize();
    });
  }

  // ==========================================================================
  // RENDERIZADO CONDICIONAL DE MARCADORES (SOLO VISIBLES CON ZOOM)
  // ==========================================================================
  function mostrarMarcadoresBolivia() {
    if (!marcadoresLayer) return;
    // Si ya están dibujados, no duplicar
    if (marcadoresLayer.getLayers().length > 0) return;

    const lista = window.MARCADORES_TURISMO || [];

    lista.forEach(lugar => {
      const customIcon = L.divIcon({
        className: "marcador-leaflet-custom",
        html: `
          <div class="relative cursor-pointer group flex flex-col items-center select-none" data-id="${lugar.id}" style="width: 32px; height: 48px;">
            <!-- Radar ping exterior -->
            <div class="w-8 h-8 rounded-full bg-amber-400/35 animate-ping absolute top-0 left-0"></div>
            <!-- Pin central brillante -->
            <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 border-2 border-white shadow-xl flex items-center justify-center transform group-hover:scale-125 transition-transform relative z-10">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <!-- Rótulo del lugar -->
            <div class="mt-1 px-2.5 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] font-bold text-amber-300 shadow-xl whitespace-nowrap backdrop-blur-sm pointer-events-none group-hover:bg-red-600 group-hover:text-white transition-colors relative z-20">
              ${lugar.nombre}
            </div>
          </div>
        `,
        iconSize: [32, 48],
        iconAnchor: [16, 20]
      });

      L.marker([lugar.lat, lugar.lng], { icon: customIcon })
        .addTo(marcadoresLayer)
        .on("click", (e) => {
          L.DomEvent.stopPropagation(e);
          abrirModalLugar(lugar);
        });
    });
  }

  function ocultarMarcadoresBolivia() {
    if (!marcadoresLayer) return;
    marcadoresLayer.clearLayers();
  }

  // ==========================================================================
  // MODAL INTERACTIVO DEL MARCADOR SELECCIONADO
  // ==========================================================================
  window.abrirModalLugar = function (lugar) {
    const modal = document.getElementById("modal-lugar-mapa");
    if (!modal) return;

    const imgEl = document.getElementById("modal-lugar-img");
    const logoEl = document.getElementById("modal-lugar-logo");
    const catEl = document.getElementById("modal-lugar-categoria");
    const depEl = document.getElementById("modal-lugar-departamento");
    const nomEl = document.getElementById("modal-lugar-nombre");
    const descEl = document.getElementById("modal-lugar-descripcion");
    const servEl = document.getElementById("modal-lugar-servicios");
    const precioEl = document.getElementById("modal-lugar-precio");
    const contactoEl = document.getElementById("modal-lugar-contacto");
    const enlaceEl = document.getElementById("modal-lugar-enlace");

    if (imgEl) imgEl.src = lugar.imagen || "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80";
    if (logoEl) logoEl.src = lugar.logo || "img/logo-placeholder.svg";
    if (catEl) catEl.textContent = lugar.categoria || "Alojamiento Turístico";
    if (depEl) depEl.textContent = lugar.departamento || "Bolivia";
    if (nomEl) nomEl.textContent = lugar.nombre || "Destino Turístico";
    if (descEl) descEl.textContent = lugar.resumen || "";
    if (precioEl) precioEl.textContent = lugar.precioReferencial || "Consultar tarifa";
    if (contactoEl) {
      contactoEl.textContent = lugar.contacto || "+591 70000000";
      contactoEl.href = `tel:${lugar.contacto ? lugar.contacto.replace(/\s+/g, '') : ''}`;
    }
    if (enlaceEl) enlaceEl.href = lugar.enlace || "hoteles.html";

    // Servicios / Tags
    if (servEl) {
      servEl.innerHTML = "";
      (lugar.servicios || []).forEach(srv => {
        const tag = document.createElement("span");
        tag.className = "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-white/10 text-slate-200 border border-white/10";
        tag.innerHTML = `
          <svg class="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
          </svg>
          ${srv}
        `;
        servEl.appendChild(tag);
      });
    }

    // Animación suave de apertura (fade + sutil escala)
    modal.classList.remove("hidden");
    const dialog = modal.querySelector(".modal-card-anim");

    if (typeof gsap !== "undefined" && dialog) {
      gsap.killTweensOf([modal, dialog]);
      gsap.set(modal, { opacity: 0 });
      gsap.set(dialog, { scale: 0.93, opacity: 0, y: 16 });

      gsap.to(modal, {
        opacity: 1,
        duration: 0.28,
        ease: "power2.out"
      });
      gsap.to(dialog, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.32,
        ease: "back.out(1.15)"
      });
    } else {
      modal.style.opacity = "1";
    }
  };

  let modalLugarAnimando = false;
  window.ocultarModalLugar = function () {
    const modal = document.getElementById("modal-lugar-mapa");
    if (!modal || modal.classList.contains("hidden") || modalLugarAnimando) return;
    const dialog = modal.querySelector(".modal-card-anim");

    if (typeof gsap !== "undefined" && dialog) {
      modalLugarAnimando = true;
      gsap.killTweensOf([modal, dialog]);

      gsap.to(dialog, {
        scale: 0.94,
        opacity: 0,
        y: 12,
        duration: 0.22,
        ease: "power2.in"
      });
      gsap.to(modal, {
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          modal.classList.add("hidden");
          modalLugarAnimando = false;
        }
      });
    } else {
      modal.classList.add("hidden");
    }
  };

  // Cerrar modal al hacer clic en el fondo oscuro
  document.getElementById("modal-lugar-mapa")?.addEventListener("click", (e) => {
    if (e.target.id === "modal-lugar-mapa") {
      ocultarModalLugar();
    }
  });

  // Cerrar modal con Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ocultarModalLugar();
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", intentarInicializar);
  } else {
    intentarInicializar();
  }
  window.addEventListener("load", intentarInicializar);
})();
