# 001 — Eliminar las animaciones de scroll huérfanas

- **Status**: DONE
- **Commit**: fef93a2
- **Severity**: HIGH
- **Category**: Cohesión / código muerto
- **Estimated scope**: 1 archivo (`js/animaciones.js`), se borran unas 310 líneas
- **Skill recomendada**: `remove-animations`

> Los números de línea corresponden al commit `fef93a2`. Si no coinciden, localiza cada bloque por su comentario de cabecera.

## Problem

Tras el reordenamiento de secciones de `index.html`, la mayoría de los bloques de `js/animaciones.js` buscan elementos que ya no existen. No fallan (cada bloque comprueba si el elemento existe), pero son código muerto que confunde y, en el caso del kiosko, es lo más pesado del archivo.

Comprobado con `grep` sobre `index.html`:

| Bloque en `js/animaciones.js` | Selector | ¿Existe en `index.html`? |
| --- | --- | --- |
| `ANIMACIÓN 1.5` (líneas 115–324) | `#seccion-proposito`, `#canvas-particulas`, `#kiosko-svg`, `.k-gas` | No |
| `ANIMACIÓN 2` (351–368) | `.grid-cols-1.sm\:grid-cols-2.lg\:grid-cols-3 > a` | La rejilla existe (reconocimientos, `index.html:808`) pero sus hijos son `div`, no `a`: 0 coincidencias |
| `ANIMACIÓN 3` (370–390) | `#departamentos` | No |
| `ANIMACIÓN 4` (392–412) | `#destinos .grid > a` | `#destinos` existe pero ahora es un carrusel (`#carrusel-destinos`), sin `.grid > a` |
| `ANIMACIÓN 5` (414–434) | `#empresas .grid > div` | `#empresas` existe pero ahora es un marquee, sin `.grid` |
| `ANIMACIÓN 6` (436–456) | `#socios` | No |

Siguen vivos y **no se tocan**: `ANIMACIÓN 1` (hero, líneas 25–113) y `ANIMACIÓN ENTRADA: Sección Mapa Interactivo 2D` (líneas 326–349).

## Target

`js/animaciones.js` contiene únicamente:

1. La cabecera y las comprobaciones iniciales (líneas 1–23).
2. `ANIMACIÓN 1: Hero Fullscreen y Buscador Principal` (25–113), sin cambios.
3. `ANIMACIÓN ENTRADA: Sección Mapa Interactivo 2D` (326–349), sin cambios.
4. El cierre `});` del `DOMContentLoaded`.

## Repo conventions to follow

- Cada bloque empieza con un comentario de tres líneas `// ====` / `// ANIMACIÓN N: …` / `// ====`. Borra el bloque entero, incluido su comentario.

## Steps

1. Antes de borrar, confirma que nada cambió: ejecuta
   `grep -c -E 'id="(seccion-proposito|departamentos|socios|canvas-particulas|kiosko-svg)"' index.html`
   Debe devolver `0`. Si devuelve otra cosa, PARA e informa.
2. En `js/animaciones.js`, borra el bloque `ANIMACIÓN 1.5: Sección Propósito - Kiosko Gráfico…` completo: desde su comentario de cabecera hasta la llave `}` que cierra `if (propositoSection && typeof ScrollTrigger !== "undefined") {` (la línea siguiente a `tlKiosko.to(kFarol, { opacity: 1, duration: 0.15 }, 0.85);`).
3. Borra los bloques `ANIMACIÓN 2`, `ANIMACIÓN 3`, `ANIMACIÓN 4`, `ANIMACIÓN 5` y `ANIMACIÓN 6` completos (desde el comentario de `ANIMACIÓN 2: Categorías de Servicio` hasta la llave que cierra el `if (sociosSection …)`).
4. Deja intacto el `});` final.

## Boundaries

- NO toques los bloques del hero ni del mapa.
- NO toques `index.html` ni ningún otro archivo.
- NO añadas animaciones nuevas para las secciones actuales: eso es el plan 011.
- Si un paso no coincide con el código que encuentras, PARA e informa en vez de improvisar.

## Verification

- **Mechanical**:
  - `node --check js/animaciones.js` → sin errores.
  - `grep -c -E "kiosko|particulas|deptSection|sociosSection|empresasSection|destinosSection|categoryCards" js/animaciones.js` → `0`.
- **Feel check**: abre `index.html`, recarga y confirma:
  - La entrada del hero (título, subtítulo, buscador, píldoras) sigue animando igual que antes.
  - Al hacer scroll hasta el mapa, la tarjeta del mapa sigue entrando con fundido.
  - La consola no muestra errores.
- **Done when**: el archivo pasa `node --check`, solo quedan los bloques del hero y del mapa, y la página se comporta igual que antes.
