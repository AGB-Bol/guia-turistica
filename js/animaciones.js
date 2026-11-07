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
  // ANIMACIÓN 1.5: Sección Propósito - Kiosko Gráfico que se Ensambla (Partículas a Stand)
  // ==================================================================
  const propositoSection = document.getElementById("seccion-proposito");
  if (propositoSection && typeof ScrollTrigger !== "undefined") {
    // 1. Partículas ambientales en Canvas
    const canvas = document.getElementById("canvas-particulas");
    if (canvas) {
      const ctx = canvas.getContext("2d");
      let width = canvas.width = canvas.offsetWidth || window.innerWidth;
      let height = canvas.height = canvas.offsetHeight || 600;

      const actualizarTamano = () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth || window.innerWidth;
        height = canvas.height = canvas.offsetHeight || 600;
      };
      window.addEventListener("resize", actualizarTamano);

      const particulas = Array.from({ length: 35 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? "239, 68, 68" : "245, 158, 11"
      }));

      function animarCanvas() {
        ctx.clearRect(0, 0, width, height);
        particulas.forEach(p => {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
          ctx.fill();
        });
        requestAnimationFrame(animarCanvas);
      }
      animarCanvas();
    }

    // 2. Piezas gráficas del Kiosko
    const kSombra = document.getElementById("k-sombra");
    const kBase = document.getElementById("k-base");
    const kInterior = document.getElementById("k-interior");
    const kPostes = document.getElementById("k-postes");
    const kMostrador = document.getElementById("k-mostrador");
    const kDetalles = document.getElementById("k-detalles");
    const kToldo = document.getElementById("k-toldo");
    const kBanderines = document.getElementById("k-banderines");
    const kFarol = document.getElementById("k-farol");
    const kDestellos = document.getElementById("k-destellos");

    const propositoTexto = document.getElementById("proposito-texto");

    // 3. Timeline vinculado al scroll con FIJADO (PIN) y efecto armar/desarmar (SCRUB)
    // Se fija cuando ocupa la pantalla bajo el header y se arma/desarma con el scroll
    const tlKiosko = gsap.timeline({
      scrollTrigger: {
        trigger: propositoSection,
        start: () => "top " + (document.querySelector("header")?.offsetHeight || 64),
        end: "+=110%", // Distancia de fijado para permitir armar y contemplar
        pin: true,
        scrub: 0.8, // Inercia suave para responder a la rueda del ratón
        anticipatePin: 1
      }
    });

    // FASE DE ENSAMBLADO (de 0.0 a 0.55 del scroll):
    // Las piezas parten dispersas como partículas y convergen para armar el kiosko
    if (kSombra) {
      tlKiosko.from(kSombra, { scaleX: 0.1, scaleY: 0.1, opacity: 0, ease: "power1.out", transformOrigin: "center center" }, 0);
    }

    if (kBase) {
      tlKiosko.from(kBase, { y: 160, opacity: 0, scale: 0.4, ease: "power2.out" }, 0.03);
    }

    if (kInterior) {
      tlKiosko.from(kInterior, { opacity: 0, scale: 0.25, y: -60, ease: "power2.out", transformOrigin: "center center" }, 0.08);
    }

    if (kPostes) {
      tlKiosko.from(kPostes, { y: -220, opacity: 0, rotation: -16, ease: "power2.out", transformOrigin: "center bottom" }, 0.12);
    }

    if (kMostrador) {
      tlKiosko.from(kMostrador, { x: -200, y: 90, rotation: 22, scale: 0.35, opacity: 0, ease: "power2.out", transformOrigin: "center center" }, 0.15);
    }

    if (kToldo) {
      tlKiosko.from(kToldo, { y: -280, scale: 0.25, rotation: -18, opacity: 0, ease: "power2.out", transformOrigin: "center top" }, 0.22);
    }

    if (kBanderines) {
      tlKiosko.from(kBanderines, { y: -35, scaleY: 0, opacity: 0, ease: "power1.out", transformOrigin: "center top" }, 0.3);
    }

    if (kFarol) {
      tlKiosko.from(kFarol, { x: 75, y: -65, rotation: 38, opacity: 0, ease: "power2.out", transformOrigin: "top left" }, 0.34);
    }

    if (kDetalles) {
      tlKiosko.from(kDetalles, { x: -70, y: 50, scale: 0.2, opacity: 0, ease: "power2.out" }, 0.36);
    }

    if (kDestellos) {
      tlKiosko.from(kDestellos.children, { scale: 0, opacity: 0, stagger: 0.02, ease: "power1.out", transformOrigin: "center center" }, 0.38);
    }

    // El texto "¿Qué somos?" entra en paralelo mientras el stand toma forma
    if (propositoTexto) {
      tlKiosko.from(propositoTexto.children, {
        x: 45,
        opacity: 0,
        stagger: 0.05,
        ease: "power2.out"
      }, 0.18);
    }

    // FASE DE REPOSO Y CONTEMPLACIÓN (de 0.55 a 1.0 del scroll):
    // El stand queda 100% ensamblado y estable ("fijar un momento para que se arme y así no sea raro")
    // Se añade un tiempo de permanencia antes de liberar el pin para avanzar a la siguiente sección
    tlKiosko.to(kFarol, { opacity: 1, duration: 0.45 }, 0.55);
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
