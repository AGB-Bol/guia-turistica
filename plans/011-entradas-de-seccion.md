# 011 — Entradas de sección para las secciones actuales

- **Status**: DONE
- **Commit**: fef93a2
- **Severity**: LOW
- **Category**: Oportunidad (entradas de grupo)
- **Estimated scope**: 1 archivo (`js/animaciones.js`), un bloque nuevo de unas 40 líneas
- **Depende de**: 001 (borra los bloques viejos), 004 (define `reducido` y `mov`)
- **Skills recomendadas**: `choreograph`, `animate`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

Tras el plan 001, solo el hero y la tarjeta del mapa tienen entrada. El resto de la página aparece estático mientras se hace scroll, lo que contrasta con el hero y hace que la página se sienta a medio terminar. Las secciones actuales son:

```html
<!-- index.html:394 — carrusel de destinos -->
<div id="carrusel-destinos" class="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-2">
  <div class="destino-card snap-start shrink-0 …">
```

```html
<!-- index.html:748 y 759 — Sobre Nosotros -->
<section id="nosotros" class="max-w-6xl mx-auto px-4 py-16 sm:py-24 scroll-mt-20">
  …
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="bg-white border border-slate-200/90 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
```

```html
<!-- index.html:796 y 808 — Reconocimientos -->
<section id="reconocimientos" class="bg-slate-50 border-t border-slate-200 py-16 sm:py-24 scroll-mt-20">
  …
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex items-start gap-4">
```

```html
<!-- index.html:843-844 — Registro -->
<section id="seccion-registro" class="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 scroll-mt-20">
  <div class="bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 rounded-3xl text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-700">
```

El bloque del mapa que ya existe es el modelo a seguir:

```js
// js/animaciones.js:333-347 — existente
gsap.from(mapaCard, {
  scrollTrigger: {
    trigger: seccionMapa,
    start: "top 85%",
    toggleActions: "play none none none",
    …
  },
  opacity: 0,
  y: 25,
  duration: 0.6,
  ease: "power2.out",
  clearProps: "transform,opacity"
});
```

## Target

Una sola entrada por contenedor, una sola vez, al llegar con el scroll. Fundido más un desplazamiento corto de 16 px, 0.5 s, `power4.out` (equivalente GSAP de `cubic-bezier(0.23, 1, 0.32, 1)`). Los elementos de un grupo entran escalonados 60 ms. Es decoración: nunca bloquea la interacción, y al terminar se limpian los estilos en línea.

Bloque nuevo, a insertar en `js/animaciones.js` justo antes del `});` final:

```js
  // ==================================================================
  // ENTRADAS DE SECCIÓN: una entrada por contenedor, una sola vez
  // ==================================================================
  if (typeof ScrollTrigger !== "undefined") {
    const entradaGrupo = (disparador, elementos) => {
      if (!disparador || !elementos || elementos.length === 0) return;
      gsap.from(elementos, {
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

    // Destinos: solo las tres primeras tarjetas (las visibles en escritorio)
    const carruselDestinos = document.getElementById("carrusel-destinos");
    if (carruselDestinos) {
      entradaGrupo(carruselDestinos, Array.from(carruselDestinos.querySelectorAll(".destino-card")).slice(0, 3));
    }

    // Sobre Nosotros: las tarjetas de la primera rejilla
    const rejillaNosotros = document.querySelector("#nosotros .grid");
    if (rejillaNosotros) {
      entradaGrupo(rejillaNosotros, Array.from(rejillaNosotros.children));
    }

    // Reconocimientos: las tarjetas de la rejilla
    const rejillaReconocimientos = document.querySelector("#reconocimientos .grid");
    if (rejillaReconocimientos) {
      entradaGrupo(rejillaReconocimientos, Array.from(rejillaReconocimientos.children));
    }

    // Registro: el bloque completo como una sola pieza
    const bloqueRegistro = document.querySelector("#seccion-registro > div");
    if (bloqueRegistro) {
      entradaGrupo(bloqueRegistro, [bloqueRegistro]);
    }
  }
```

Además, la tarjeta del mapa se alinea con los mismos valores:

```js
// js/animaciones.js, bloque del mapa — target
opacity: 0,
y: mov(16),
duration: 0.5,
ease: "power4.out",
clearProps: "transform,opacity"
```

## Repo conventions to follow

- Cada bloque de `js/animaciones.js` empieza con un comentario de tres líneas `// ====` / título / `// ====` y comprueba que el elemento existe antes de animar.
- Las animaciones de scroll usan `gsap.from` con `scrollTrigger` y `clearProps`. Ejemplar: el bloque `ANIMACIÓN ENTRADA: Sección Mapa Interactivo 2D`.
- `mov(valor)` devuelve `0` con movimiento reducido (lo define el plan 004); úsalo en todo desplazamiento.

## Steps

1. Comprueba que `js/animaciones.js` define `const mov =` cerca del principio. Si no, el plan 004 no está aplicado: PARA e informa.
2. Inserta el bloque `ENTRADAS DE SECCIÓN` del Target justo antes del `});` final del archivo.
3. En el bloque del mapa, cambia `y`, `duration` y `ease` a los valores del Target. No toques su `scrollTrigger` ni su `onEnter`.

## Boundaries

- NO animes los títulos de sección, el marquee de empresas, las flip cards de fundadores ni el pie.
- NO añadas `pin`, `scrub` ni parallax nuevos.
- NO cambies la timeline del hero.
- NO toques `index.html`.
- NO subas el `stagger` por encima de `0.08` ni la duración por encima de `0.5`.
- Si un selector no encuentra elementos, PARA e informa en vez de cambiarlo.

## Verification

- **Mechanical**:
  - `node --check js/animaciones.js` → sin errores.
  - En la consola del navegador, con `index.html` abierto: `document.querySelectorAll("#carrusel-destinos .destino-card").length` ≥ 3; `document.querySelector("#nosotros .grid").children.length` ≥ 1; `document.querySelector("#reconocimientos .grid").children.length` ≥ 1.
- **Feel check**: recarga `index.html` y baja despacio:
  - Cada grupo entra una sola vez al asomar por abajo, con un fundido corto y un leve ascenso; las tarjetas de un grupo llegan una tras otra muy seguidas, no todas a la vez ni en fila lenta.
  - Sube y vuelve a bajar: no se repite.
  - Baja muy rápido hasta el final: ninguna sección se queda invisible ni a medio aparecer.
  - Durante la entrada, las tarjetas se pueden pulsar y el carrusel se puede desplazar.
  - Tras la entrada, el hover de las tarjetas (sombra) sigue funcionando.
  - Con `prefers-reduced-motion: reduce`: los grupos funden sin desplazarse.
  - Si el escalonado se nota "mecánico" o lento, prueba `stagger: 0.04` e informa de cuál dejaste.
- **Done when**: destinos, nosotros, reconocimientos y registro tienen una entrada única y discreta, y el mapa usa los mismos valores.
