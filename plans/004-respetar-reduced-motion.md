# 004 — Respetar `prefers-reduced-motion` con una versión suave

- **Status**: DONE
- **Commit**: fef93a2
- **Severity**: MEDIUM
- **Category**: Accesibilidad
- **Estimated scope**: 3 archivos (`js/animaciones.js`, `index.html`, `js/footer.js`)
- **Depende de**: 001 (deja `animaciones.js` solo con hero y mapa), 003 (crea `window.Motion`)
- **Skills recomendadas**: `apple-design` (sección 14), `animation-performance`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

Movimiento reducido significa menos movimiento y más suave, no cero. Hoy pasa lo contrario en dos sentidos:

1. `js/animaciones.js` apaga todo, incluidos los fundidos que ayudan a entender la página:

```js
// js/animaciones.js:9-13 — actual
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  console.log("Animaciones desactivadas por preferencia de accesibilidad (prefers-reduced-motion).");
  return;
}
```

2. El CSS no hace caso a la preferencia: el marquee, la flecha que rebota y el giro 3D de las tarjetas siguen moviéndose.

```css
/* index.html:112-116 — actual */
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 35s linear infinite;
}
```

```css
/* index.html:81-88 — actual */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
```

```html
<!-- index.html:234 — actual -->
<svg class="w-4 h-4 animate-bounce text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
```

```html
<!-- js/footer.js:280 — actual -->
onclick="window.scrollTo({ top: 0, behavior: 'smooth' });"
```

(Los modales ya quedan cubiertos por el plan 003, que usa `Motion.reducido()`.)

## Target

### `js/animaciones.js`

Con movimiento reducido: se conservan los fundidos de opacidad, se elimina todo desplazamiento, escala y parallax.

```js
// target — sustituye las líneas 8-13
// 1. Accesibilidad: con movimiento reducido se conservan los fundidos, sin desplazamientos
const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mov = (valor) => (reducido ? 0 : valor);
```

- Parallax del fondo del hero: la condición pasa a `if (heroBgImage && typeof ScrollTrigger !== "undefined" && !reducido) {`.
- Timeline del hero: cada `y: N` pasa a `y: mov(N)` (título `mov(25)`, subtítulo `mov(15)`, formulario `mov(20)`, píldoras `mov(10)`, flecha `mov(-10)`). En el formulario, `scale: 0.98` pasa a `scale: reducido ? 1 : 0.98`.
- Tarjeta del mapa: `y: 25` pasa a `y: mov(25)`.

### `index.html`, dentro de `<style>`, justo después de la regla `.animate-marquee:hover { … }`

```css
/* Movimiento reducido: sin marquee ni giro 3D animado */
@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
  .flip-card-inner { transition: none; }
}
```

### `index.html`, flecha del hero

```html
<svg class="w-4 h-4 motion-safe:animate-bounce text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
```

### `js/footer.js`, botón "subir"

```html
onclick="window.scrollTo({ top: 0, behavior: (window.Motion && Motion.reducido()) ? 'auto' : 'smooth' });"
```

## Repo conventions to follow

- El CSS propio de `index.html` vive en el único bloque `<style>` del `<head>` (líneas 17–129), con un comentario en español sobre cada grupo de reglas.
- Tailwind se carga por CDN, así que las variantes `motion-safe:` y `motion-reduce:` funcionan sin configuración.

## Steps

1. `js/animaciones.js`: sustituye el bloque de las líneas 8–13 por el Target (constantes `reducido` y `mov`). Ya no hay `return` anticipado.
2. `js/animaciones.js`: añade `&& !reducido` a la condición del parallax del hero.
3. `js/animaciones.js`: envuelve con `mov(...)` cada `y` de la timeline del hero y de la tarjeta del mapa, y cambia el `scale` del formulario, según el Target.
4. `index.html`: añade el bloque `@media (prefers-reduced-motion: reduce)` del Target tras la regla `.animate-marquee:hover`.
5. `index.html`: en el `<svg>` de `#hero-scroll`, cambia `animate-bounce` por `motion-safe:animate-bounce`.
6. `js/footer.js`: cambia el `onclick` del botón `#btn-flotante-subir` por el del Target.

## Boundaries

- NO toques los modales (plan 003).
- NO cambies duraciones ni curvas de las animaciones normales; este plan solo añade la rama de movimiento reducido.
- NO elimines el `animate-pulse` del punto rojo: solo cambia opacidad.
- Si el plan 001 no está aplicado (el archivo aún contiene el bloque del kiosko), PARA e informa.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**:
  - `node --check js/animaciones.js` y `node --check js/footer.js` → sin errores.
  - `grep -c "prefers-reduced-motion" index.html` → `1` o más.
  - `grep -c "Animaciones desactivadas" js/animaciones.js` → `0`.
- **Feel check**: en DevTools → Rendering, activa `prefers-reduced-motion: reduce`, recarga `index.html` y confirma:
  - El hero aparece con fundido, sin deslizarse; el fondo no hace parallax al hacer scroll.
  - La flecha del hero no rebota.
  - La franja de empresas está quieta.
  - Las tarjetas de fundadores cambian de cara al instante, sin giro.
  - El botón "subir" salta arriba sin recorrido animado.
  - Desactiva la emulación y recarga: todo vuelve a animar como antes.
- **Done when**: con la preferencia activa no queda ningún desplazamiento, escala, giro ni bucle, pero los fundidos siguen ahí.
