# 002 — Reducir los bucles de animación infinitos

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: MEDIUM
- **Category**: Propósito y frecuencia
- **Estimated scope**: 3 archivos, 4 ediciones pequeñas
- **Skill recomendada**: `remove-animations`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

Hay cinco animaciones que se repiten para siempre. Movimiento perpetuo en elementos que están siempre en pantalla distrae y deja de comunicar nada. La peor es la del botón de WhatsApp, visible en todas las páginas todo el tiempo.

```html
<!-- js/footer.js:317 — actual: ping infinito sobre el botón de WhatsApp -->
<span class="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"></span>
```

```js
// js/footer.js:491-499 — actual: rebote infinito del botón "subir" al llegar al fondo
const distanciaAlFondo = docH - (scrollY + windowH);
if (distanciaAlFondo <= 350) {
  btn.classList.add("animate-bounce", "bg-red-600", "ring-4", "ring-red-500/35");
  btn.classList.remove("bg-slate-900/95");
} else {
  btn.classList.remove("animate-bounce", "bg-red-600", "ring-4", "ring-red-500/35");
  btn.classList.add("bg-slate-900/95");
}
```

```html
<!-- index.html:674 — actual: segunda flecha de scroll rebotando (sección mapa) -->
<svg class="w-4 h-4 animate-bounce text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
```

```html
<!-- js/mapa-interactivo.js:243 — actual: un ping infinito por cada marcador del mapa -->
<div class="w-8 h-8 rounded-full bg-amber-400/35 animate-ping absolute top-0 left-0"></div>
```

Se conserva a propósito: la flecha de scroll del hero (`index.html:234`, `animate-bounce`), porque es la primera pantalla y la única pista de que hay más contenido. El punto rojo `animate-pulse` de `index.html:645` también se conserva (solo cambia opacidad, es pequeño).

## Target

- Botón de WhatsApp: sin ping. El `<span>` del ping se elimina.
- Botón "subir": al llegar al fondo cambia a rojo con anillo (indicación de estado), pero **no rebota**.
- Flecha de scroll de la sección mapa: estática.
- Marcadores del mapa: sin ping; conservan el `group-hover:scale-125` del pin.

```js
// js/footer.js — target
const distanciaAlFondo = docH - (scrollY + windowH);
if (distanciaAlFondo <= 350) {
  btn.classList.add("bg-red-600", "ring-4", "ring-red-500/35");
  btn.classList.remove("bg-slate-900/95");
} else {
  btn.classList.remove("bg-red-600", "ring-4", "ring-red-500/35");
  btn.classList.add("bg-slate-900/95");
}
```

```html
<!-- index.html:674 — target -->
<svg class="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
```

## Repo conventions to follow

- Las animaciones en bucle se aplican con utilidades de Tailwind (`animate-ping`, `animate-bounce`, `animate-pulse`); quitarlas es quitar la clase.

## Steps

1. `js/footer.js`: borra la línea completa del `<span … animate-ping …></span>` dentro del enlace de WhatsApp (`aria-label="WhatsApp directo"`).
2. `js/footer.js`, función `actualizarBotonFlotanteSubir`: quita `"animate-bounce", ` de las dos llamadas (`classList.add` y `classList.remove`), dejando el código del Target. Actualiza el comentario de encima a: `// Al llegar al final, resaltar el botón en rojo (sin rebote)`.
3. `index.html`, sección `#seccion-mapa`: en el `<svg>` de la flecha inferior (el que tiene `text-slate-300`), quita la clase `animate-bounce`. NO toques el `<svg … animate-bounce text-white …>` del hero.
4. `js/mapa-interactivo.js`: borra el comentario `<!-- Radar ping exterior -->` y la línea del `<div … animate-ping …></div>` que le sigue.

## Boundaries

- NO quites el `animate-bounce` de la flecha del hero (`index.html`, dentro de `#hero-scroll`).
- NO quites el `animate-pulse` del punto rojo.
- NO toques el marquee de empresas (`.animate-marquee`): es movimiento constante lineal y es correcto.
- NO cambies colores, tamaños ni estructura fuera de lo indicado.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**:
  - `node --check js/footer.js` y `node --check js/mapa-interactivo.js` → sin errores.
  - `grep -c "animate-ping" js/footer.js js/mapa-interactivo.js` → `0` en ambos.
  - `grep -c "animate-bounce" js/footer.js` → `0`; `grep -c "animate-bounce" index.html` → `1`.
- **Feel check**: abre `index.html` y confirma:
  - El botón de WhatsApp está quieto; sigue creciendo al pasar el ratón.
  - Al bajar hasta el final, el botón "subir" se pone rojo con anillo y no salta.
  - Los marcadores del mapa no parpadean; al pasar el ratón el pin sigue creciendo.
- **Done when**: en toda la página solo queda un elemento con rebote infinito (la flecha del hero).
