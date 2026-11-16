/**
 * Motion compartido - Guía Internacional de Turismo
 * Único lugar donde viven las curvas, duraciones y helpers de animación.
 * Incluir antes de js/footer.js:
 *   <script src="js/motion.js"></script>
 */
(function () {
  var consultaReducida = window.matchMedia("(prefers-reduced-motion: reduce)");

  var Motion = {
    ease: { out: "power4.out", inOut: "power3.inOut" },
    dur: { press: 0.16, salida: 0.18, fondo: 0.2, entrada: 0.25, seccion: 0.5 },

    // true si el usuario pidió menos movimiento
    reducido: function () {
      return consultaReducida.matches;
    },

    // Entrada de una caja (modal, tarjeta): escala + fundido
    entrar: function (caja) {
      if (!caja) return;
      if (typeof gsap === "undefined") {
        caja.style.opacity = "1";
        caja.style.transform = "none";
        return;
      }
      var r = Motion.reducido();
      // Solo fijar el estado inicial si no está a mitad de otra animación
      if (!gsap.isTweening(caja)) {
        gsap.set(caja, { opacity: 0, scale: r ? 1 : 0.96, y: r ? 0 : 8 });
      }
      gsap.killTweensOf(caja);
      gsap.to(caja, { opacity: 1, scale: 1, y: 0, duration: Motion.dur.entrada, ease: Motion.ease.out });
    },

    // Salida de una caja; alTerminar se llama al acabar
    salir: function (caja, alTerminar) {
      if (!caja || typeof gsap === "undefined") {
        if (alTerminar) alTerminar();
        return;
      }
      var r = Motion.reducido();
      gsap.killTweensOf(caja);
      gsap.to(caja, {
        opacity: 0,
        scale: r ? 1 : 0.96,
        y: 0,
        duration: Motion.dur.salida,
        ease: Motion.ease.out,
        onComplete: alTerminar
      });
    },

    // Fundido del fondo oscuro; valor = 1 (mostrar) o 0 (ocultar)
    fundir: function (fondo, valor, alTerminar) {
      if (!fondo) return;
      if (typeof gsap === "undefined") {
        fondo.style.opacity = String(valor);
        if (alTerminar) alTerminar();
        return;
      }
      if (valor === 1 && !gsap.isTweening(fondo)) gsap.set(fondo, { opacity: 0 });
      gsap.killTweensOf(fondo);
      gsap.to(fondo, {
        opacity: valor,
        duration: valor === 1 ? Motion.dur.fondo : Motion.dur.salida,
        ease: Motion.ease.out,
        onComplete: alTerminar
      });
    },

    // Modal completo: fondo + caja. El llamador ya quitó la clase "hidden".
    abrirModal: function (fondo, caja) {
      Motion.fundir(fondo, 1);
      Motion.entrar(caja);
    },

    cerrarModal: function (fondo, caja, alTerminar) {
      Motion.salir(caja);
      Motion.fundir(fondo, 0, alTerminar);
    }
  };

  // Tokens CSS disponibles en todas las páginas
  var estilo = document.createElement("style");
  estilo.id = "motion-tokens";
  estilo.textContent =
    ":root{--ease-out:cubic-bezier(0.23,1,0.32,1);--ease-in-out:cubic-bezier(0.77,0,0.175,1);}";
  document.head.appendChild(estilo);

  window.Motion = Motion;
})();
