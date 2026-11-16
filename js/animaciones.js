/**
 * ====================================================================
 * Configuración de Animaciones GSAP para Guía Turística (index.html)
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Respetar accesibilidad: Si el usuario prefiere movimiento reducido, no animar
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    console.log("Animaciones desactivadas por preferencia de accesibilidad (prefers-reduced-motion).");
    return;
  }

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
    if (heroBgImage && typeof ScrollTrigger !== "undefined") {
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
          y: 25,
          duration: 0.8,
        }
      );
    }

    if (heroSubtitle) {
      heroTimeline.from(
        heroSubtitle,
        {
          opacity: 0,
          y: 15,
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
          y: 20,
          scale: 0.98,
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
          y: 10,
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
          y: -10,
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
    const mapaCard = seccionMapa.querySelector(".rounded-3xl");
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
        y: 25,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "transform,opacity"
      });
    }
  }
});
