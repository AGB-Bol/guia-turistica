# 009 — Menú móvil: abrir y cerrar con transición

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: LOW
- **Category**: Oportunidad (evitar un cambio brusco)
- **Estimated scope**: 1 archivo (`js/header.js`), marcado del menú y su listener
- **Skills recomendadas**: `animate`, `mobile-native`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

En móvil, el menú de la hamburguesa aparece de golpe y empuja toda la página hacia abajo en un solo fotograma. El botón tampoco informa de su estado a lectores de pantalla.

```html
<!-- js/header.js:95-105 — actual -->
<!-- Botón Hamburguesa Móvil -->
<button 
  id="mobile-menu-btn" 
  type="button" 
  class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
  aria-label="Abrir menú"
>
```

```html
<!-- js/header.js:110-111 — actual: apertura del contenedor -->
<!-- Menú Desplegable Móvil -->
<div id="mobile-menu" class="hidden md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
  …enlaces…
</div>
```

```js
// js/header.js:169-173 — actual
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}
```

## Target

El menú se despliega en 200 ms con la curva `cubic-bezier(0.23, 1, 0.32, 1)`, animando la altura con la técnica de rejilla (`grid-template-rows: 0fr → 1fr`) más opacidad. La altura es la excepción documentada a "solo transform y opacity" para acordeones. Al ser una transición CSS, si se pulsa otra vez a mitad de camino, invierte desde donde está.

Cerrado, el menú lleva el atributo `inert` para que sus enlaces no reciban foco ni clics.

```html
<!-- target: botón -->
<button 
  id="mobile-menu-btn" 
  type="button" 
  class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
  aria-label="Abrir menú"
  aria-expanded="false"
  aria-controls="mobile-menu"
>
```

```html
<!-- target: contenedor -->
<!-- Menú Desplegable Móvil -->
<div id="mobile-menu" class="md:hidden grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none" inert>
  <div class="overflow-hidden min-h-0">
    <div class="border-t border-slate-200 bg-white px-4 py-4 space-y-3">
      …los mismos enlaces de antes, sin cambios…
    </div>
  </div>
</div>
```

```js
// target
if (mobileBtn && mobileMenu) {
  mobileBtn.addEventListener("click", () => {
    const abierto = !mobileMenu.classList.contains("grid-rows-[1fr]");
    mobileMenu.classList.toggle("grid-rows-[1fr]", abierto);
    mobileMenu.classList.toggle("grid-rows-[0fr]", !abierto);
    mobileMenu.classList.toggle("opacity-100", abierto);
    mobileMenu.classList.toggle("opacity-0", !abierto);
    mobileMenu.toggleAttribute("inert", !abierto);
    mobileBtn.setAttribute("aria-expanded", String(abierto));
    mobileBtn.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
}
```

## Repo conventions to follow

- La cabecera es una plantilla de texto en `js/header.js`; los estilos son utilidades de Tailwind en la etiqueta.
- Tailwind por CDN genera en caliente las clases que el JS añade después (`grid-rows-[1fr]`, `opacity-100`), así que no hace falta declararlas antes.

## Steps

1. `js/header.js`: añade `aria-expanded="false"` y `aria-controls="mobile-menu"` al botón `#mobile-menu-btn`.
2. `js/header.js`: cambia la etiqueta de apertura de `#mobile-menu` por la del Target y envuelve **todo su contenido actual** en los dos `<div>` nuevos (`overflow-hidden min-h-0` y, dentro, el que lleva `border-t border-slate-200 bg-white px-4 py-4 space-y-3`). Cierra los dos `<div>` nuevos justo antes del `</div>` que cerraba `#mobile-menu`.
3. `js/header.js`: sustituye el listener del botón por el del Target.

## Boundaries

- NO cambies los enlaces del menú móvil, su orden ni sus clases.
- NO toques la navegación de escritorio ni el dropdown "Rubros" (plan 008).
- NO uses GSAP aquí: `js/header.js` se carga antes que GSAP y la transición CSS basta.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**: `node --check js/header.js` → sin errores. `grep -c 'classList.toggle("hidden")' js/header.js` → `0`.
- **Feel check**: abre `index.html` con ancho de móvil (375 px) y confirma:
  - Al pulsar la hamburguesa el menú se despliega hacia abajo y funde; al pulsar otra vez se recoge.
  - Pulsa dos veces muy rápido: el menú invierte a mitad de camino, sin saltar ni reiniciar.
  - Cerrado, tabular con el teclado no entra en los enlaces del menú.
  - En ancho de escritorio (≥ 768 px) el menú móvil no aparece.
  - Con `prefers-reduced-motion: reduce` el menú abre y cierra al instante.
  - Prueba en un teléfono real: comprueba que el contenido de debajo baja de forma continua, sin tirones.
  - Repite en `agencias.html`.
- **Done when**: el menú abre y cierra con transición interrumpible y el botón refleja su estado en `aria-expanded`.
