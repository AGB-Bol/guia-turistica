# 007 — Flip card: hover solo con ratón y giro más firme

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: MEDIUM
- **Category**: Accesibilidad / Easing y duración
- **Estimated scope**: 1 archivo (`index.html`), un bloque de CSS
- **Skills recomendadas**: `mobile-native`, `emil-design-eng`

> Los números de línea corresponden al commit `fef93a2`. Localiza el bloque por el comentario `/* Estilos 3D Flip Card para Fundadores */`.

## Problem

Las tarjetas de fundadores giran con `:hover` sin filtrar por tipo de dispositivo. En pantallas táctiles un toque dispara un hover falso que se queda pegado, y además cada tarjeta ya tiene `onclick="this.classList.toggle('flipped')"`: los dos mecanismos se pisan y la tarjeta puede quedarse girada o no responder al segundo toque.

La curva `cubic-bezier(0.4, 0, 0.2, 1)` es floja para un giro grande, y 650 ms es largo.

```css
/* index.html:77-92 — actual */
/* Estilos 3D Flip Card para Fundadores */
.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner,
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
```

```html
<!-- index.html:510 — marcado actual (no se cambia) -->
<div class="flip-card h-48 cursor-pointer select-none group" onclick="this.classList.toggle('flipped')">
```

## Target

- El hover solo gira en dispositivos con ratón (`hover: hover` y `pointer: fine`).
- En táctil gira únicamente con el toque (clase `flipped`).
- Curva de movimiento en pantalla `cubic-bezier(0.77, 0, 0.175, 1)`, 500 ms.

```css
/* target */
/* Estilos 3D Flip Card para Fundadores */
.flip-card {
  perspective: 1000px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  transform-style: preserve-3d;
}
.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}
/* El hover solo gira con ratón; en táctil se gira con el toque (.flipped) */
@media (hover: hover) and (pointer: fine) {
  .flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
  }
}
```

## Repo conventions to follow

- El CSS propio vive en el único bloque `<style>` del `<head>` de `index.html`, con comentarios en español.
- Es una transición CSS (no keyframes), así que si el usuario sale a mitad de giro, vuelve desde donde estaba. Mantenlo así.

## Steps

1. `index.html`: sustituye las reglas `.flip-card-inner { … }` y `.flip-card:hover .flip-card-inner, .flip-card.flipped .flip-card-inner { … }` por las del Target.
2. Si el plan 004 ya añadió `@media (prefers-reduced-motion: reduce) { … .flip-card-inner { transition: none; } }`, déjalo como está.

## Boundaries

- NO cambies el marcado de las tarjetas ni su `onclick`.
- NO toques `.flip-card-front`, `.flip-card-back` ni `.flip-card { perspective }`.
- NO conviertas la transición en `@keyframes`.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**: `grep -c "pointer: fine" index.html` → `1` o más. `grep -c "0.65s" index.html` → `0`.
- **Feel check**:
  - Con ratón: pasa por encima de una tarjeta; gira. Sal a mitad de giro; vuelve desde donde estaba, sin salto.
  - En DevTools, activa la emulación de dispositivo móvil (barra de dispositivos) y recarga: un toque gira la tarjeta, un segundo toque la devuelve. Tocar otra tarjeta no deja la primera en un estado raro.
  - El giro arranca y frena con decisión; no se siente blando ni largo.
  - Comprueba en un teléfono real si es posible: la emulación no reproduce del todo el hover táctil.
- **Done when**: en táctil el giro responde solo al toque, y con ratón al hover.

## Nota (fuera de alcance)

Con ratón, un clic deja la tarjeta con `flipped` y al salir sigue girada. Y las tarjetas no son accesibles con teclado (son `div` con `onclick`). Ambos puntos son decisiones de interacción, no de animación; no los cambies en este plan.
