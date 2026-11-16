# 005 — Fundido cruzado real en el fondo del hero

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: MEDIUM
- **Category**: Interrumpibilidad / evitar cambios bruscos
- **Estimated scope**: 1 archivo (`index.html`), 2 ediciones
- **Skills recomendadas**: `animate`, `animation-performance`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

El fondo del hero cambia de foto cada 5 s. El elemento tiene una transición de opacidad de 1000 ms, pero el código cambia la imagen a los 300 ms, cuando el fundido va por un tercio. Resultado: la foto salta a la vista a media opacidad, y si la nueva imagen aún no se descargó, aparece a trozos.

```html
<!-- index.html:146-150 — actual -->
<div 
  id="hero-bg-image" 
  class="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 transform scale-105" 
  style="background-image: url('https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=2000&q=85');"
></div>
```

```js
// index.html:1044-1067 — actual
function iniciarHeroAutomatico() {
  const bgImage = document.getElementById("hero-bg-image");
  const dots = document.querySelectorAll(".hero-dot");
  if (!bgImage) return;

  setInterval(() => {
    currentHeroIndex = (currentHeroIndex + 1) % heroImages.length;
    bgImage.style.opacity = "0.3";
    setTimeout(() => {
      bgImage.style.backgroundImage = `url('${heroImages[currentHeroIndex]}')`;
      bgImage.style.opacity = "1";
    }, 300);

    dots.forEach((dot, idx) => {
      if (idx === currentHeroIndex) {
        dot.classList.remove("bg-white/40");
        dot.classList.add("bg-red-600");
      } else {
        dot.classList.remove("bg-red-600");
        dot.classList.add("bg-white/40");
      }
    });
  }, 5000);
}
```

`js/animaciones.js` aplica el parallax (`y` y `scale`) al elemento `#hero-bg-image`, así que ese id debe seguir existiendo y contener todo el fondo.

## Target

Dos capas apiladas dentro de `#hero-bg-image`. La imagen siguiente se precarga; cuando está lista se pone en la capa oculta y se intercambian las opacidades. La transición CSS de 1000 ms hace el fundido cruzado completo.

```html
<!-- target -->
<div id="hero-bg-image" class="absolute inset-0 transform scale-105">
  <div
    class="hero-bg-capa absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
    style="opacity: 1; background-image: url('https://images.unsplash.com/photo-1589556264800-08ae9e129a8c?auto=format&fit=crop&w=2000&q=85');"
  ></div>
  <div
    class="hero-bg-capa absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
    style="opacity: 0;"
  ></div>
</div>
```

```js
// target
function iniciarHeroAutomatico() {
  const capas = document.querySelectorAll("#hero-bg-image .hero-bg-capa");
  const dots = document.querySelectorAll(".hero-dot");
  if (capas.length < 2) return;

  let capaVisible = 0;

  setInterval(() => {
    const siguiente = (currentHeroIndex + 1) % heroImages.length;
    const url = heroImages[siguiente];

    // Precargar: solo se cambia cuando la imagen ya está descargada
    const precarga = new Image();
    precarga.onload = () => {
      currentHeroIndex = siguiente;
      const entra = capas[1 - capaVisible];
      const sale = capas[capaVisible];
      entra.style.backgroundImage = `url('${url}')`;
      entra.style.opacity = "1";
      sale.style.opacity = "0";
      capaVisible = 1 - capaVisible;

      dots.forEach((dot, idx) => {
        if (idx === currentHeroIndex) {
          dot.classList.remove("bg-white/40");
          dot.classList.add("bg-red-600");
        } else {
          dot.classList.remove("bg-red-600");
          dot.classList.add("bg-white/40");
        }
      });
    };
    precarga.src = url;
  }, 5000);
}
```

## Repo conventions to follow

- El script del hero es JavaScript en línea dentro del `<script>` principal de `index.html`, con funciones en español y `document.addEventListener("DOMContentLoaded", …)`. Mantén ese estilo.
- Las transiciones simples se hacen con utilidades de Tailwind (`transition-opacity duration-1000`).

## Steps

1. `index.html`: sustituye el `<div id="hero-bg-image" …></div>` por el marcado del Target. Conserva el comentario `<!-- Fondo automático (Cross-fade / Ken Burns) -->` de encima.
2. `index.html`: sustituye la función `iniciarHeroAutomatico` completa por la del Target. No toques el array `heroImages`, la variable `currentHeroIndex` ni la línea `document.addEventListener("DOMContentLoaded", iniciarHeroAutomatico);`.

## Boundaries

- NO cambies el id `hero-bg-image` ni lo quites: el parallax de `js/animaciones.js` depende de él.
- NO cambies las URL de las imágenes, el intervalo de 5000 ms ni las capas de degradado que van después.
- NO toques `js/animaciones.js`.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**: abre `index.html` y revisa que la consola no muestra errores. `grep -c "hero-bg-capa" index.html` → `3` (dos capas y el selector).
- **Feel check**: quédate en el hero 15 segundos y confirma:
  - Cada cambio de foto es un fundido continuo de 1 segundo; en ningún momento la foto salta de golpe.
  - Los puntos indicadores cambian a la vez que empieza el fundido.
  - En DevTools → Network, limita a "Slow 3G" y recarga: la foto anterior se queda hasta que la nueva está lista; nunca se ve una imagen cargándose a trozos.
  - Haz scroll: el parallax del fondo sigue funcionando.
  - A mitad de fundido puede notarse un instante algo más oscuro (las dos capas a media opacidad sobre el fondo). Si molesta, informa; no lo corrijas por tu cuenta.
- **Done when**: tres cambios de foto seguidos se ven como fundidos limpios y el parallax sigue activo.
