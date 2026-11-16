# 010 — Respuesta al pulsar en botones y CTA

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: LOW
- **Category**: Oportunidad (feedback)
- **Estimated scope**: 4 archivos, una o dos clases por botón
- **Depende de**: 006 (deja cada botón con `transition-colors` o `transition`)
- **Skills recomendadas**: `emil-design-eng`, `apple-design` (sección 1), `mobile-native`

> Los números de línea corresponden al commit `fef93a2`. Localiza los botones con los `grep` de los pasos.

## Problem

Casi ningún botón responde al pulsarlo. En `index.html` solo uno tiene estado `active:`; en `js/footer.js`, cuatro (los del widget flotante). Sin esa respuesta, sobre todo en móvil, el usuario no sabe si el toque se registró hasta que cambia la página.

```html
<!-- js/header.js:91 — actual: CTA de cabecera, sin respuesta al pulsar -->
<a href="${targetCtaHref}" class="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-colors">
```

```html
<!-- index.html:385 — actual: flecha del carrusel, sin respuesta al pulsar -->
<button type="button" onclick="moverCarruselDestinos(-1)" class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all cursor-pointer" aria-label="…">
```

```html
<!-- index.html:211 — actual: único botón con respuesta, con otro valor -->
<button type="submit" class="w-full h-full min-h-[46px] bg-red-700 hover:bg-red-800 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-1.5 cursor-pointer">
```

## Target

Todo elemento con aspecto de botón encoge a `scale(0.97)` mientras está pulsado, con transición de 150 ms. La respuesta ocurre al pulsar, no al soltar.

Clases que debe tener cada botón:

- `active:scale-[0.97]`
- `transition` (sustituye a `transition-colors`, para que también anime el transform)
- `duration-150`

```html
<!-- target: CTA de cabecera -->
<a href="${targetCtaHref}" class="hidden sm:inline-flex bg-slate-900 hover:bg-slate-800 active:scale-[0.97] text-white font-bold text-xs px-3.5 py-2 rounded-lg transition duration-150">
```

```html
<!-- target: flecha del carrusel -->
<button type="button" onclick="moverCarruselDestinos(-1)" class="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-[0.97] border border-white/15 flex items-center justify-center transition duration-150 cursor-pointer" aria-label="…">
```

```html
<!-- target: botón de búsqueda del hero (unifica 0.98 → 0.97) -->
<button type="submit" class="w-full h-full min-h-[46px] bg-red-700 hover:bg-red-800 active:scale-[0.97] text-white font-bold text-xs sm:text-sm rounded-xl transition duration-150 shadow-lg shadow-red-900/30 flex items-center justify-center gap-1.5 cursor-pointer">
```

### Qué cuenta como botón (aplicar)

1. Toda etiqueta `<button>` visible con fondo o borde propio.
2. Todo `<a>` que tenga a la vez una clase de fondo (`bg-…`) y una de esquinas (`rounded-…`) y sirva como acción: CTA de cabecera, "Ver ficha", "Abrir directorio completo", botones de WhatsApp o llamada de las fichas, CTA de registro.

### Qué NO es botón (no tocar)

- Enlaces de texto de la navegación y del pie.
- Tarjetas enteras que son enlace (categorías, destinos, empresas).
- Las flip cards de fundadores.
- Los tres botones del widget flotante (`#widget-flotante-fijo`): ya tienen `hover:scale-110 active:scale-95`.
- Elementos `<select>`, `<input>` y `<option>`.
- Botones de cierre con solo un icono "×" de menos de 32 px: aplícales también el cambio si tienen fondo; si son solo un icono sin fondo, no.

## Repo conventions to follow

- Los estados se expresan con utilidades de Tailwind en la etiqueta. Ejemplar existente: `index.html:211` (`active:scale-[0.98]`), que este plan unifica a `0.97`.
- Tailwind por CDN admite `active:scale-[0.97]`.

## Steps

1. Lista candidatos: `grep -n "<button" index.html js/header.js js/footer.js js/catalogo-seccion.js js/mapa-interactivo.js` y `grep -n -E "<a [^>]*bg-[^>]*rounded-|<a [^>]*rounded-[^>]*bg-" index.html js/header.js js/footer.js js/catalogo-seccion.js js/mapa-interactivo.js`.
2. Para cada candidato, decide con las listas "Qué cuenta como botón" y "Qué NO es botón".
3. En cada botón aceptado: añade `active:scale-[0.97]`; cambia `transition-colors` por `transition` (si ya tiene `transition` o `transition-transform`, déjalo); añade `duration-150` si no tiene ya una clase `duration-*`.
4. En el botón de búsqueda del hero, cambia `active:scale-[0.98]` por `active:scale-[0.97]`.
5. Al terminar, escribe en tu informe la lista de elementos modificados (archivo y línea) y la de candidatos descartados con el motivo.

## Boundaries

- NO cambies colores, tamaños, textos ni estructura.
- NO añadas efectos de hover nuevos.
- NO toques el widget flotante.
- Si `transition-all` sigue presente en un botón, el plan 006 no está aplicado: PARA e informa.
- Si dudas de si algo es un botón, no lo toques y anótalo en el informe.

## Verification

- **Mechanical**:
  - `node --check` en cada archivo JS modificado → sin errores.
  - `grep -c "active:scale-\[0.98\]" index.html` → `0`.
  - `grep -c "active:scale-\[0.97\]" index.html js/header.js` → mayor que `0` en ambos.
- **Feel check**: abre `index.html` y confirma:
  - Mantén pulsado el botón de búsqueda, la CTA de cabecera y las flechas del carrusel: encogen levemente mientras están pulsados y vuelven al soltar.
  - El efecto es sutil; si un botón parece "hundirse" de forma evidente, el valor está mal.
  - En un teléfono real, el encogimiento aparece en cuanto el dedo toca, sin retraso.
  - Ninguna tarjeta ni enlace de texto encoge.
- **Done when**: todos los botones de la lista aceptada responden al pulsar con `scale(0.97)` y el informe enumera lo modificado y lo descartado.
