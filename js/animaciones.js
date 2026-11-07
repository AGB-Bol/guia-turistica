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
    // 1. Partículas ambientales y constelaciones en Canvas
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

      const particulas = Array.from({ length: 42 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        opacity: Math.random() * 0.55 + 0.25,
        color: Math.random() > 0.6 ? "245, 158, 11" : (Math.random() > 0.5 ? "239, 68, 68" : "96, 165, 250")
      }));

      function animarCanvas() {
        ctx.clearRect(0, 0, width, height);

        // Constelación de líneas tenues entre partículas cercanas
        for (let i = 0; i < particulas.length; i++) {
          for (let j = i + 1; j < particulas.length; j++) {
            const dx = particulas[i].x - particulas[j].x;
            const dy = particulas[i].y - particulas[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 85) {
              ctx.beginPath();
              ctx.moveTo(particulas[i].x, particulas[i].y);
              ctx.lineTo(particulas[j].x, particulas[j].y);
              ctx.strokeStyle = `rgba(245, 158, 11, ${(1 - dist / 85) * 0.12})`;
              ctx.lineWidth = 0.7;
              ctx.stroke();
            }
          }
        }

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

    // 2. Elementos del Kiosko, Carril Vertical y Simulación de Gases
    const kioskoSvg = document.getElementById("kiosko-svg");
    const gasElements = document.querySelectorAll(".k-gas");
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
    const railThumb = document.getElementById("kiosko-rail-thumb");
    const railFill = document.getElementById("kiosko-rail-fill");

    // Factor de caos/gas dinámico (1.0 = máxima oscilación/choques libres, 0.0 = calma absoluta)
    let chaosFactor = 1.0;
    let gasClock = 0;

    // Loop autónomo continuo para simular partículas de gas saltando y chocando
    gsap.ticker.add((time, deltaTime) => {
      if (!propositoSection) return;
      gasClock += deltaTime * 0.001;

      if (chaosFactor <= 0.002) {
        // En calma completa, limpiar transforms internos para alineación perfecta
        gasElements.forEach(g => g.removeAttribute("transform"));
        return;
      }

      gasElements.forEach((g, i) => {
        const s = 1.0 + (i % 5) * 0.35;
        // Movimiento oscilatorio multidireccional que simula choque/rebote de gases
        const dx = (Math.sin(gasClock * 2.5 * s + i * 1.6) * 14 + Math.cos(gasClock * 4.4 * s) * 6) * chaosFactor;
        const dy = (Math.cos(gasClock * 2.1 * s + i * 2.2) * 16 + Math.sin(gasClock * 3.6 * s) * 7) * chaosFactor;
        const drot = (Math.sin(gasClock * 2.3 * s + i * 2.8) * 7.5) * chaosFactor;
        g.setAttribute("transform", `translate(${dx.toFixed(2)}, ${dy.toFixed(2)}) rotate(${drot.toFixed(2)})`);
      });
    });

    // 3. Timeline vinculado al scroll con FIJADO (PIN) y efecto armar/desarmar (SCRUB)
    // Se extiende el recorrido de deslizamiento a +=220% para disfrutar la fase de gases y ensamble
    const tlKiosko = gsap.timeline({
      scrollTrigger: {
        trigger: propositoSection,
        start: () => "top " + (document.querySelector("header")?.offsetHeight || 64),
        end: "+=220%", // Mayor tiempo de deslizamiento solicitado
        pin: true,
        scrub: 0.8, // Inercia suave para responder al scroll
        anticipatePin: 1,
        onUpdate: (self) => {
          const prog = self.progress; // 0.0 a 1.0

          // FASE 1: de 0% a 25% las piezas están en caos total de gas (flotando, chocando, difusas)
          // FASE 2: a partir del 25% empiezan a acomodarse y dejan de ser difusas
          if (prog <= 0.25) {
            chaosFactor = 1.0;
            if (kioskoSvg) kioskoSvg.style.filter = "blur(1.6px)";
          } else if (prog < 0.70) {
            const dampProg = (prog - 0.25) / 0.45; // 0.0 a 1.0
            chaosFactor = Math.max(0, 1.0 - dampProg);
            const blurVal = Math.max(0, (1.0 - dampProg) * 1.6);
            if (kioskoSvg) kioskoSvg.style.filter = blurVal > 0.1 ? `blur(${blurVal.toFixed(2)}px)` : "none";
          } else {
            chaosFactor = 0;
            if (kioskoSvg) kioskoSvg.style.filter = "none";
          }

          // Movimiento del círculo deslizante en el carril vertical lateral (sin texto)
          if (railThumb) {
            railThumb.style.top = (prog * 100) + "%";
            if (prog >= 0.75) {
              railThumb.className = "absolute -left-[7px] w-4 h-4 rounded-full border-2 border-emerald-400 bg-[#080B12] shadow-[0_0_12px_rgba(52,211,153,0.9)] flex items-center justify-center transition-colors duration-150";
            } else {
              railThumb.className = "absolute -left-[7px] w-4 h-4 rounded-full border-2 border-amber-400 bg-[#080B12] shadow-[0_0_12px_rgba(245,158,11,0.9)] flex items-center justify-center transition-colors duration-150";
            }
          }
          if (railFill) {
            railFill.style.height = (prog * 100) + "%";
          }
        }
      }
    });

    // FASE DE ENSAMBLADO (del 25% al 68% del scroll):
    // Las piezas parten 100% OPACAS y dispersas; al pasar el 25% convergen y se fijan
    if (kSombra) {
      tlKiosko.from(kSombra, { scaleX: 0.3, scaleY: 0.3, opacity: 0.2, ease: "power2.out", transformOrigin: "center center" }, 0.25);
    }

    if (kBase) {
      tlKiosko.from(kBase, { y: 130, rotation: 4, scale: 0.85, ease: "power2.out" }, 0.27);
    }

    if (kInterior) {
      tlKiosko.from(kInterior, { y: -90, x: 25, rotation: -6, scale: 0.82, ease: "power2.out", transformOrigin: "center center" }, 0.30);
    }

    if (kPostes) {
      tlKiosko.from(kPostes, { y: -150, x: -35, rotation: -18, ease: "power2.out", transformOrigin: "center bottom" }, 0.33);
    }

    if (kMostrador) {
      tlKiosko.from(kMostrador, { x: -130, y: 80, rotation: 18, scale: 0.85, ease: "power2.out", transformOrigin: "center center" }, 0.36);
    }

    if (kToldo) {
      tlKiosko.from(kToldo, { y: -170, x: 30, rotation: -16, scale: 0.85, ease: "power2.out", transformOrigin: "center top" }, 0.40);
    }

    if (kBanderines) {
      tlKiosko.from(kBanderines, { y: -40, x: -20, rotation: 8, scaleY: 0.5, ease: "power1.out", transformOrigin: "center top" }, 0.46);
    }

    if (kFarol) {
      tlKiosko.from(kFarol, { x: 75, y: -65, rotation: 36, ease: "power2.out", transformOrigin: "top left" }, 0.49);
    }

    if (kDetalles) {
      tlKiosko.from(kDetalles, { x: -85, y: 45, rotation: -12, scale: 0.78, ease: "power2.out" }, 0.52);
    }

    if (kDestellos) {
      tlKiosko.from(kDestellos.children, { x: "random(-45, 45)", y: "random(-45, 45)", scale: 0.4, stagger: 0.02, ease: "power1.out", transformOrigin: "center center" }, 0.38);
    }

    // FASE FINAL: El texto "¿Qué somos?" recién aparece en la transición casi final (de 0.68 a 0.85)
    // cuando el kiosko ya está ensamblado, emergiendo suavemente con fade y deslizamiento
    if (propositoTexto) {
      tlKiosko.fromTo(propositoTexto,
        { opacity: 0, y: 45, pointerEvents: "none" },
        { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.17, ease: "power2.out" },
        0.68
      );
    }

    // FASE DE REPOSO Y CONTEMPLACIÓN (de 0.85 a 1.0 del scroll):
    // El stand y el texto quedan completamente estables para ser leídos con calma
    tlKiosko.to(kFarol, { opacity: 1, duration: 0.15 }, 0.85);
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
