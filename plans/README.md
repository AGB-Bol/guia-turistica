# Planes de animación — Guía Internacional de Turismo

Planes generados a partir de una auditoría de las animaciones del proyecto (GSAP 3.12.5 + ScrollTrigger, Tailwind por CDN, HTML/CSS/JS sin build). Cada plan es autocontenido: incluye el código actual, el código final, los pasos y cómo verificarlo.

- **Commit de referencia**: `fef93a2` (rama `correcciones`)
- **Estado de la auditoría**: hecha leyendo el código; no se probó en el navegador. La sensación de cada animación se comprueba en el "Feel check" de cada plan.

## Planes

| # | Plan | Severidad | Fase | Estado | Skills |
| --- | --- | --- | --- | --- | --- |
| 001 | [Eliminar las animaciones de scroll huérfanas](001-eliminar-animaciones-huerfanas.md) | Alta | 0. Limpieza | TODO | `remove-animations` |
| 002 | [Reducir los bucles infinitos](002-reducir-bucles-infinitos.md) | Media | 0. Limpieza | TODO | `remove-animations` |
| 003 | [Crear `js/motion.js` y unificar los 4 modales](003-motion-compartido-y-modales.md) | Alta | 1. Base | TODO | `animate`, `emil-design-eng`, `apple-design` |
| 004 | [Respetar `prefers-reduced-motion`](004-respetar-reduced-motion.md) | Media | 2. Correcciones | TODO | `apple-design`, `animation-performance` |
| 005 | [Fundido cruzado real en el fondo del hero](005-fundido-fondo-hero.md) | Media | 2. Correcciones | TODO | `animate`, `animation-performance` |
| 006 | [Reemplazar `transition-all`](006-reemplazar-transition-all.md) | Media | 2. Correcciones | TODO | `animation-performance` |
| 007 | [Flip card: hover solo con ratón](007-flip-card-hover-tactil.md) | Media | 2. Correcciones | TODO | `mobile-native`, `emil-design-eng` |
| 008 | [Dropdown "Rubros" con transición](008-dropdown-rubros.md) | Baja | 3. Añadir | TODO | `animate`, `emil-design-eng` |
| 009 | [Menú móvil con transición](009-menu-movil.md) | Baja | 3. Añadir | TODO | `animate`, `mobile-native` |
| 010 | [Respuesta al pulsar en botones](010-feedback-de-pulsacion.md) | Baja | 3. Añadir | TODO | `emil-design-eng`, `apple-design`, `mobile-native` |
| 011 | [Entradas de sección](011-entradas-de-seccion.md) | Baja | 3. Añadir | TODO | `choreograph`, `animate` |

## Orden recomendado

Ejecutar en orden numérico. Es el orden más seguro porque varios planes editan los mismos archivos.

## Dependencias

| Plan | Necesita antes | Motivo |
| --- | --- | --- |
| 004 | 001, 003 | Edita lo que queda de `js/animaciones.js` y usa `Motion.reducido()` |
| 006 | 003 | El 003 ya quita `transition-all` de los modales |
| 010 | 006 | Parte de botones que ya tienen `transition-colors` o `transition` |
| 011 | 001, 004 | Añade bloques a `js/animaciones.js` y usa la función `mov()` |

Independientes entre sí (pueden ir en cualquier orden o en paralelo): 002, 005, 007, 008, 009. Los planes 008 y 009 editan ambos `js/header.js`, en zonas distintas; si se hacen en paralelo, hay que fusionar con cuidado.

## Valores de movimiento del proyecto

Definidos en `js/motion.js` (lo crea el plan 003). Todo plan posterior usa estos valores y no inventa otros.

| Uso | CSS | GSAP |
| --- | --- | --- |
| Entradas y salidas | `cubic-bezier(0.23, 1, 0.32, 1)` | `power4.out` |
| Movimiento dentro de la pantalla | `cubic-bezier(0.77, 0, 0.175, 1)` | `power3.inOut` |

| Elemento | Duración |
| --- | --- |
| Respuesta al pulsar | 150–160 ms |
| Dropdown | 150 ms |
| Cierre de modal | 180 ms |
| Menú móvil | 200 ms |
| Apertura de modal | 250 ms |
| Entrada de sección | 500 ms, escalonado 60 ms |

Reglas: sin rebote (`back.out`) y sin `ease-in` (`power*.in`) en la interfaz; el cierre es más rápido que la apertura; con `prefers-reduced-motion` se conserva la opacidad y se quita el desplazamiento.

## Fase 4 — Validación (después de los 11 planes)

No son planes de código, sino pasadas de revisión:

1. **`break-ui`**: probar tarjetas de catálogo y modales con datos extremos (nombres muy largos, campos vacíos, cero resultados).
2. **`mobile-native`**: revisar en un teléfono real el hero (`min-h-[calc(100vh-4rem)]`), el menú móvil, el carrusel de destinos y los toques.
3. **`/review-animations`**: revisión estricta final. Esta skill es manual: hay que escribir el comando.

Opcionales: `gestures` si el carrusel de destinos va a tener arrastre con el dedo más allá del scroll nativo; `/prototype` para comparar variantes de la entrada del hero; `/learn-taste` para guardar las correcciones de diseño como reglas en un `DESIGN.md`.

## Descartado a propósito

- **Marquee de empresas**: movimiento constante lineal que se pausa al pasar el ratón; es correcto. Solo se le añade la regla de movimiento reducido (plan 004).
- **`flyTo` del mapa** (1.4–1.6 s): lo inicia el usuario y es navegación del mapa, no interfaz.
- **Restaurar el kiosko con scroll fijado**: ocultaba el texto "¿Qué somos?" hasta bien avanzado un tramo de scroll fijado del 220 %, y mantenía dos bucles de dibujo activos toda la vida de la página.

## Encontrado fuera de alcance

No son problemas de animación; quedan anotados para decidir aparte:

- `js/footer.js:184` enlaza a `#seccion-proposito`, una sección que ya no existe en `index.html`: el enlace "¿Qué somos?" del pie no lleva a ningún sitio.
- Las flip cards de fundadores son `div` con `onclick`: no se pueden activar con teclado. Con ratón, un clic las deja giradas aunque el cursor salga.
- Las subpáginas (`agencias.html`, etc.) se revisaron solo a través del JS compartido (`header.js`, `footer.js`, `catalogo-seccion.js`).

## Cómo ejecutar un plan

Dale el archivo del plan a cualquier agente con la instrucción "ejecuta este plan tal cual". Al terminar, cambia su **Status** a `DONE` aquí y en el propio plan. Si el código ya no coincide con los extractos del plan, el agente debe parar e informar, no improvisar.
