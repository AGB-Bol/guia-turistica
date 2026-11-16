# 008 — Dropdown "Rubros": transición desde su botón y flecha que gira

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: LOW
- **Category**: Fisicalidad y origen / oportunidad
- **Estimated scope**: 1 archivo (`js/header.js`), 3 líneas de clases
- **Skills recomendadas**: `animate`, `emil-design-eng`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

El menú "Rubros" de la barra de navegación aparece y desaparece de golpe (`display: none` ↔ `display: block`), sin relación visual con el botón que lo abre. Además, la flecha tiene una clase `group-hover:rotate-180` que nunca se activa porque ningún antecesor tiene la clase `group`.

```html
<!-- js/header.js:58-67 — actual -->
<!-- Dropdown Rubros -->
<div class="relative dropdown py-3">
  <button type="button" class="flex items-center gap-1 ${isRubroActive ? 'text-red-700 font-bold' : 'text-slate-700 hover:text-slate-900'} py-1 transition-colors">
    <span>Rubros</span>
    <svg class="w-3.5 h-3.5 text-slate-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>

  <div class="dropdown-menu hidden absolute left-0 top-full w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50">
```

```css
/* index.html:20-23 y los otros 7 HTML — actual (no se toca) */
.dropdown:hover .dropdown-menu,
.dropdown:focus-within .dropdown-menu {
  display: block;
}
```

## Target

El menú está siempre en el DOM como bloque, pero invisible; al pasar el ratón o al enfocar con teclado funde y escala desde `0.97` con origen en la esquina superior izquierda (donde está el botón). 150 ms, curva `cubic-bezier(0.23, 1, 0.32, 1)`. La flecha gira 180° a la vez. Con movimiento reducido, solo opacidad.

```html
<!-- target -->
<!-- Dropdown Rubros -->
<div class="relative dropdown group py-3">
  <button type="button" class="flex items-center gap-1 ${isRubroActive ? 'text-red-700 font-bold' : 'text-slate-700 hover:text-slate-900'} py-1 transition-colors">
    <span>Rubros</span>
    <svg class="w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:rotate-180 group-focus-within:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
    </svg>
  </button>

  <div class="dropdown-menu invisible opacity-0 scale-[0.97] origin-top-left transition-[opacity,transform,visibility] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 motion-reduce:scale-100 absolute left-0 top-full w-56 bg-white rounded-xl shadow-lg border border-slate-200 p-1.5 z-50">
```

Por qué `visibility` en la lista de transición: al cerrar, `visibility` cambia al final de los 150 ms, así el menú termina de fundirse antes de dejar de ser interactivo; al abrir, cambia al instante.

La regla CSS `.dropdown:hover .dropdown-menu { display: block; }` de los 8 HTML queda sin efecto (el menú ya no tiene `hidden`) y no hace daño; no la toques.

## Repo conventions to follow

- La cabecera se genera en `js/header.js` como plantilla de texto con clases de Tailwind; todos los estilos van como utilidades en la propia etiqueta.
- Tailwind por CDN admite valores arbitrarios (`ease-[cubic-bezier(...)]`, `scale-[0.97]`, `transition-[opacity,transform,visibility]`) y las variantes `group-hover:`, `group-focus-within:` y `motion-reduce:`.

## Steps

1. `js/header.js`: en el `<div class="relative dropdown py-3">`, añade la clase `group` → `relative dropdown group py-3`.
2. `js/header.js`: sustituye las clases del `<svg>` de la flecha por las del Target.
3. `js/header.js`: sustituye las clases del `<div class="dropdown-menu hidden …">` por las del Target. Fíjate en que se elimina `hidden`.

## Boundaries

- NO cambies los enlaces del menú (`rubrosLinks`), ni su orden, ni sus estilos.
- NO toques el menú móvil (plan 009).
- NO edites la regla `.dropdown:hover .dropdown-menu` en los HTML.
- NO añadas JavaScript: la apertura sigue siendo por hover y por foco, solo con CSS.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**: `node --check js/header.js` → sin errores. `grep -c "dropdown-menu hidden" js/header.js` → `0`.
- **Feel check**: abre `index.html` en ancho de escritorio y confirma:
  - Al pasar por "Rubros" el menú crece ligeramente desde la esquina del botón y funde; la flecha gira.
  - Al salir, se cierra con la misma rapidez y la flecha vuelve.
  - Mueve el ratón del botón al menú: no se cierra por el camino.
  - Entra y sale rápido varias veces: nunca parpadea ni reinicia desde cero.
  - Con el tabulador, al enfocar "Rubros" el menú se abre y se puede seguir tabulando por sus enlaces; al salir del último, se cierra.
  - Con el menú cerrado, sus enlaces no reciben clics ni foco.
  - En DevTools → Animations al 10 %: la escala parte de la esquina superior izquierda, no del centro.
  - Repite en `agencias.html`.
- **Done when**: el menú tiene transición de entrada y salida anclada al botón y la flecha gira.
