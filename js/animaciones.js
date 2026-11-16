/**
 * ====================================================================
 * Configuración de Animaciones GSAP para Guía Turística (index.html)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Accesibilidad: con movimiento reducido se conservan los fundidos, sin desplazamientos
  const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mov = (valor) => (reducido ? 0 : valor);

  // 2. Verificar que GSAP y ScrollTrigger estén cargados
  if (typeof gsap === "undefined") {
    console.warn("GSAP no está disponible. Asegúrate de incluir el script de GSAP.");
    return;
  }

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // ==================================================================
  // ANIMACIÓN 1: Hero Fullscreen y Buscador Principal
  // ==================================================================
  const heroSection = document.getElementById("hero-section") || document.querySelector("section.py-14");
  if (heroSection) {
    const heroTitle = heroSection.querySelector("h1");
    const heroSubtitle = heroSection.querySelector("p");
    const heroForm = heroSection.querySelector("form");
    const heroPills = heroSection.querySelector("#hero-pills");
    const heroScroll = heroSection.querySelector("#hero-scroll");
    const heroBgImage = heroSection.querySelector("#hero-bg-image");

    // Efecto Parallax en la imagen turística de fondo
    if (heroBgImage && typeof ScrollTrigger !== "undefined" && !reducido) {
      gsap.to(heroBgImage, {
        scrollTrigger: {
          trigger: heroSection,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        y: 70,
        scale: 1.15,
        ease: "none",
      });
    }

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroTitle) {
      heroTimeline.from(
        heroTitle,
        {
          opacity: 0,
          y: mov(25),
          duration: 0.8,
        }
      );
    }

    if (heroSubtitle) {
      heroTimeline.from(
        heroSubtitle,
        {
          opacity: 0,
          y: mov(15),
          duration: 0.6,
        },
        "-=0.5"
      );
    }

    if (heroForm) {
      heroTimeline.from(
        heroForm,
        {
          opacity: 0,
          y: mov(20),
          scale: reducido ? 1 : 0.98,
          duration: 0.7,
        },
        "-=0.4"
      );
    }

    if (heroPills) {
      heroTimeline.from(
        heroPills,
        {
          opacity: 0,
          y: mov(10),
          duration: 0.5,
        },
        "-=0.3"
      );
    }

    if (heroScroll) {
      heroTimeline.from(
        heroScroll,
        {
          opacity: 0,
          y: mov(-10),
          duration: 0.6,
        },
        "-=0.2"
      );
    }
  }

  // ==================================================================
  // ANIMACIÓN ENTRADA: Sección Mapa Interactivo 2D
  // ==================================================================
  const seccionMapa = document.getElementById("seccion-mapa");
  if (seccionMapa && typeof ScrollTrigger !== "undefined") {
    const mapaCard = document.getElementById("map")?.parentElement;
    if (mapaCard) {
      gsap.from(mapaCard, {
        scrollTrigger: {
          trigger: seccionMapa,
          start: "top 85%",
          toggleActions: "play none none none",
          onEnter: () => {
            setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 150);
          }
        },
        opacity: 0,
        y: mov(16),
        duration: 0.5,
        ease: "power4.out",
        clearProps: "transform,opacity"
      });
    }
  }

  // ==================================================================
  // ENTRADAS DE SECCIÓN: una entrada por contenedor, una sola vez
  // ==================================================================
  if (typeof ScrollTrigger !== "undefined") {
    // GSAP anima transform en cada fotograma; se apaga la transición CSS del elemento mientras dura
    const sinTransicion = (elementos) => ({
      onStart: () => elementos.forEach((el) => { el.style.transition = "none"; }),
      onComplete: () => elementos.forEach((el) => { el.style.transition = ""; }),
    });

    const entradaGrupo = (disparador, elementos) => {
      if (!disparador || !elementos || elementos.length === 0) return;
      gsap.from(elementos, {
        ...sinTransicion(elementos),
        scrollTrigger: {
          trigger: disparador,
          start: "top 85%",
          once: true,
        },
        opacity: 0,
        y: mov(16),
        duration: 0.5,
        ease: "power4.out",
        stagger: 0.06,
        clearProps: "transform,opacity",
      });
    };

    // Rubros: las tarjetas "saltan" al entrar, con un pequeño giro
    const rejillaRubros = document.querySelector("#rubros .grid");
    if (rejillaRubros) {
      const tarjetas = Array.from(rejillaRubros.children);
      gsap.from(tarjetas, {
        ...sinTransicion(tarjetas),
        scrollTrigger: { trigger: rejillaRubros, start: "top 85%", once: true },
        opacity: 0,
        y: mov(32),
        rotate: reducido ? 0 : -3,
        duration: 0.6,
        ease: "back.out(1.5)",
        stagger: 0.07,
        clearProps: "transform,opacity",
      });
    }

    // Destinos: solo las tres primeras tarjetas (las visibles en escritorio)
    const carruselDestinos = document.getElementById("carrusel-destinos");
    if (carruselDestinos) {
      entradaGrupo(carruselDestinos, Array.from(carruselDestinos.querySelectorAll(".destino-card")).slice(0, 3));
    }

    // Fundadores: las tarjetas de la lista
    const rejillaNosotros = document.querySelector("#fundadores ul");
    if (rejillaNosotros) {
      entradaGrupo(rejillaNosotros, Array.from(rejillaNosotros.children));
    }

    // Reconocimientos: los elementos de la lista
    const rejillaReconocimientos = document.querySelector("#reconocimientos ul");
    if (rejillaReconocimientos) {
      entradaGrupo(rejillaReconocimientos, Array.from(rejillaReconocimientos.children));
    }

    // Registro: el bloque completo como una sola pieza
    const bloqueRegistro = document.querySelector("#seccion-registro > div");
    if (bloqueRegistro) {
      entradaGrupo(bloqueRegistro, [bloqueRegistro]);
    }
  }
});
