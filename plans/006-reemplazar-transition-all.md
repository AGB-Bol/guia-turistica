# 006 — Reemplazar `transition-all` por propiedades concretas

- **Status**: DONE
- **Commit**: fef93a2
- **Severity**: MEDIUM
- **Category**: Rendimiento
- **Estimated scope**: 3 archivos, unas 40 sustituciones de una clase
- **Depende de**: 003 (ya quita `transition-all` de los modales)
- **Skill recomendada**: `animation-performance`

> Los números de línea corresponden al commit `fef93a2` y se moverán tras aplicar otros planes. Usa `grep -n "transition-all"` para localizar las líneas actuales.

## Problem

`transition-all` anima cualquier propiedad que cambie, incluidas las de layout (ancho, alto, padding), que no pasan por la GPU. Además hace imprevisible qué se anima. En el commit `fef93a2` aparece 47 veces: `index.html` (34), `js/footer.js` (11), `js/catalogo-seccion.js` (2).

```html
<!-- index.html:223 — ejemplo actual: solo cambia el color de fondo -->
<button type="button" onclick="prepararBusqueda('Uyuni', 'agencias')" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all cursor-pointer …">
```

```html
<!-- index.html:512 — ejemplo actual: solo cambia la sombra -->
<div class="flip-card-front bg-white border border-slate-200/90 rounded-2xl p-5 flex items-center justify-center shadow-sm hover:shadow-md transition-all">
```

```html
<!-- js/footer.js:296 — ejemplo actual: cambia la escala -->
class="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 relative group"
```

Líneas afectadas al commit `fef93a2`:

- `index.html`: 159, 160, 161, 211, 223, 224, 225, 260, 275, 290, 305, 320, 335, 350, 385, 388, 512, 525, 538, 551, 564, 657, 734, 760, 770, 780, 865, 874, 933, 957, 1247. (686 y 912 las resuelve el plan 003.)
- `js/footer.js`: 63, 118, 122, 126, 130, 134, 281, 296, 313. (236 y 237 las resuelve el plan 003.)
- `js/catalogo-seccion.js`: 157. (298 la resuelve el plan 003.)

## Target

Ningún `transition-all` en el proyecto. Cada uno se sustituye según qué cambia en **ese mismo elemento** (mira sus clases `hover:`, `active:`, `focus:`, `group-hover:` y las clases que el JS le añade o quita):

| Qué cambia en el elemento | Clase que sustituye a `transition-all` |
| --- | --- |
| Solo colores: `hover:bg-*`, `hover:text-*`, `hover:border-*`, o cambio de `bg-*` por JS | `transition-colors` |
| Solo sombra: `hover:shadow-*` | `transition-shadow` |
| Solo transform: `hover:scale-*`, `active:scale-*`, `hover:-translate-y-*`, `hover:rotate-*` | `transition-transform` |
| Solo opacidad: `hover:opacity-*`, o `opacity-*` cambiada por JS | `transition-opacity` |
| Dos o más de los grupos anteriores | `transition` |
| Nada cambia (no hay ninguna clase de estado ni JS que lo modifique) | quitar la clase sin sustituirla |

`transition` (sin sufijo) es la utilidad de Tailwind que anima color, fondo, borde, opacidad, sombra, transform y filtro; no incluye propiedades de layout.

Ejemplos resueltos:

```html
<!-- index.html:223 — target -->
… bg-white/10 hover:bg-white/20 … transition-colors cursor-pointer …
<!-- index.html:512 — target -->
… shadow-sm hover:shadow-md transition-shadow">
<!-- js/footer.js:296 — target -->
… transition-transform hover:scale-110 active:scale-95 relative group"
<!-- index.html:211 — target (color + escala + sombra) -->
… bg-red-700 hover:bg-red-800 active:scale-[0.98] … transition shadow-lg …
<!-- js/footer.js:281 — target (opacidad + translate + escala + color, cambiados por hover y por JS) -->
… transition duration-300 hover:scale-110 active:scale-95 …
<!-- index.html:159-161 — target (puntos del hero: el JS cambia bg-red-600 / bg-white/40) -->
<span class="hero-dot w-2 h-2 rounded-full bg-red-600 transition-colors"></span>
```

## Repo conventions to follow

- El proyecto ya usa las utilidades específicas en muchos sitios. Ejemplar: `js/header.js:51` (`hover:text-slate-900 transition-colors`) y `js/header.js:41` (`transition-transform group-hover:scale-105`).
- Las clases `duration-*` existentes se conservan tal cual.

## Steps

1. Ejecuta `grep -n "transition-all" index.html js/footer.js js/catalogo-seccion.js` y anota la lista.
2. Para cada resultado, lee las clases del elemento, decide con la tabla del Target y sustituye solo la palabra `transition-all`.
3. Si un elemento cambia por JS (por ejemplo `#btn-flotante-subir`, los `.hero-dot`), cuenta también las clases que el JS añade o quita.
4. Repite el `grep` del paso 1 hasta que no devuelva nada.

## Boundaries

- Cambia únicamente la clase `transition-all`. NO toques ninguna otra clase, ni duraciones, ni el contenido.
- NO toques las líneas de los modales si el plan 003 aún no está aplicado: en ese caso PARA e informa.
- NO añadas clases nuevas de hover, escala o color.
- Si dudas entre dos opciones de la tabla, usa `transition`.
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**:
  - `grep -c "transition-all" index.html js/footer.js js/catalogo-seccion.js` → `0` en los tres.
  - `node --check js/footer.js` y `node --check js/catalogo-seccion.js` → sin errores.
- **Feel check**: abre `index.html` y pasa el ratón por: píldoras del hero, botón de búsqueda, tarjetas de categorías, botones del carrusel, tarjetas de "Sobre Nosotros", botones del widget flotante y enlaces del pie. Confirma:
  - Cada hover sigue teniendo transición suave (color, sombra o escala), ninguno cambia de golpe.
  - El botón "subir" sigue apareciendo con fundido al bajar 250 px.
  - Repite en `agencias.html` con las tarjetas del catálogo.
- **Done when**: no queda ningún `transition-all` y todos los hover conservan su transición.
