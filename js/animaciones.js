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
  // ANIMACIÓN 1: Hero y Buscador Principal (Entrada al cargar la página)
  // ==================================================================
  const heroSection = document.querySelector("section.py-14");
  if (heroSection) {
    const heroTitle = heroSection.querySelector("h1");
    const heroSubtitle = heroSection.querySelector("p");
    const heroForm = heroSection.querySelector("form");

    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroTitle) {
      heroTimeline.from(heroTitle, {
        opacity: 0,
        y: 25,
        duration: 0.8,
      });
    }

    if (heroSubtitle) {
      heroTimeline.from(
        heroSubtitle,
        {
          opacity: 0,
          y: 15,
          duration: 0.6,
        },
        "-=0.5" // Comienza antes de que termine el título
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
  }

  // ==================================================================
  // ANIMACIÓN 2: Categorías de Servicio (Efecto Cascada / Stagger con Scroll)
  // ==================================================================
  const categoryCards = document.querySelectorAll(".grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3 > a");
  if (categoryCards.length > 0 && typeof ScrollTrigger !== "undefined") {
    gsap.from(categoryCards, {
      scrollTrigger: {
        trigger: categoryCards[0].parentElement,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      stagger: 0.08,
      duration: 0.6,
      ease: "power2.out",
    });
  }

  // ==================================================================
  // ANIMACIÓN 3: Filtro por Departamento (Los 9 departamentos)
  // ==================================================================
  const deptSection = document.getElementById("departamentos");
  if (deptSection && typeof ScrollTrigger !== "undefined") {
    const deptBadges = deptSection.querySelectorAll(".grid > a");
    if (deptBadges.length > 0) {
      gsap.from(deptBadges, {
        scrollTrigger: {
          trigger: deptSection,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 15,
        stagger: 0.04,
        duration: 0.4,
        ease: "power1.out",
      });
    }
  }

  // ==================================================================
  // ANIMACIÓN 4: Destinos Principales
  // ==================================================================
  const destinosSection = document.getElementById("destinos");
  if (destinosSection && typeof ScrollTrigger !== "undefined") {
    const destinoCards = destinosSection.querySelectorAll(".grid > a");
    if (destinoCards.length > 0) {
      gsap.from(destinoCards, {
        scrollTrigger: {
          trigger: destinosSection,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 35,
        stagger: 0.12,
        duration: 0.7,
        ease: "power2.out",
      });
    }
  }

  // ==================================================================
  // ANIMACIÓN 5: Empresas Registradas
  // ==================================================================
  const empresasSection = document.getElementById("empresas");
  if (empresasSection && typeof ScrollTrigger !== "undefined") {
    const empresaCards = empresasSection.querySelectorAll(".grid > div");
    if (empresaCards.length > 0) {
      gsap.from(empresaCards, {
        scrollTrigger: {
          trigger: empresasSection,
          start: "top 85%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 25,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }

  // ==================================================================
  // ANIMACIÓN 6: Socios y Aliados
  // ==================================================================
  const sociosSection = document.getElementById("socios");
  if (sociosSection && typeof ScrollTrigger !== "undefined") {
    const socioItems = sociosSection.querySelectorAll(".grid > div");
    if (socioItems.length > 0) {
      gsap.from(socioItems, {
        scrollTrigger: {
          trigger: sociosSection,
          start: "top 90%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        scale: 0.95,
        stagger: 0.08,
        duration: 0.5,
        ease: "power1.out",
      });
    }
  }
});
