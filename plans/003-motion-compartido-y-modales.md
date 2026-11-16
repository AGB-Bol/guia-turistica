# 003 — Crear `js/motion.js` y unificar los 4 modales

- **Status**: TODO
- **Commit**: fef93a2
- **Severity**: HIGH
- **Category**: Easing y duración / Cohesión y tokens / Interrumpibilidad
- **Estimated scope**: 1 archivo nuevo, 4 archivos JS/HTML editados, 8 HTML con una etiqueta `<script>` nueva
- **Skills recomendadas**: `animate`, `emil-design-eng`, `apple-design`

> Los números de línea corresponden al commit `fef93a2`. Localiza cada punto por el extracto de código.

## Problem

Hay cuatro modales con la misma animación copiada a mano, con cuatro problemas:

1. **Cierran con `power2.in`** (ease-in). Arranca lento justo cuando el usuario espera respuesta; hace que la interfaz se sienta perezosa.
2. **Tres abren con `back.out(1.15)`** (rebote). El rebote solo tiene sentido cuando hay inercia de un gesto; en un modal que aparece con un clic se siente fuera de lugar.
3. **Valores casi iguales pero distintos**: escala inicial 0.94, 0.93 y 0.92; desplazamientos 16, 15, 12 y 10 px.
4. **CSS y GSAP pelean**: las cajas llevan `transition-all duration-200` de Tailwind mientras GSAP anima `transform` y `opacity` fotograma a fotograma, lo que produce doble suavizado.
5. **Bloqueo durante el cierre**: variables `modal…Animando` impiden reabrir el modal mientras se cierra.

```js
// index.html:1289-1296 — actual (apertura, modal de búsqueda)
modal.classList.remove('hidden');
if (typeof gsap !== 'undefined') {
  gsap.killTweensOf([modal, modalCaja]);
  gsap.set(modal, { opacity: 0 });
  gsap.set(modalCaja, { scale: 0.94, opacity: 0, y: 16 });
  gsap.to(modal, { opacity: 1, duration: 0.28, ease: 'power2.out' });
  gsap.to(modalCaja, { scale: 1, opacity: 1, y: 0, duration: 0.32, ease: 'back.out(1.15)' });
} else {
  setTimeout(() => {
    modalCaja.classList.remove('scale-95', 'opacity-0');
    modalCaja.classList.add('scale-100', 'opacity-100');
  }, 10);
}
```

```js
// index.html:1304-1327 — actual (cierre, modal de búsqueda)
let modalBusquedaAnimando = false;
function cerrarModal() {
  const modal = document.getElementById('modal-busqueda');
  const modalCaja = document.getElementById('modal-caja');
  if (!modal || !modalCaja || modal.classList.contains('hidden') || modalBusquedaAnimando) return;

  if (typeof gsap !== 'undefined') {
    modalBusquedaAnimando = true;
    gsap.killTweensOf([modal, modalCaja]);
    gsap.to(modalCaja, { scale: 0.95, opacity: 0, y: 12, duration: 0.22, ease: 'power2.in' });
    gsap.to(modal, {
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        modal.classList.add('hidden');
        modalBusquedaAnimando = false;
      }
    });
  } else {
    modalCaja.classList.remove('scale-100', 'opacity-100');
    modalCaja.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); }, 200);
  }
}
```

El mismo patrón se repite en:

- `js/footer.js:381-394` (apertura) y `397-423` (cierre) — modal legal, variable `modalLegalAnimando`.
- `js/mapa-interactivo.js:319-342` (apertura) y `345-373` (cierre) — modal de lugar, variable `modalLugarAnimando`, caja `.modal-card-anim`.
- `js/catalogo-seccion.js:425-437` (apertura) y `449-473` (cierre) — modal de catálogo; aquí el overlay se muestra con clases `opacity-0` / `pointer-events-none`, no con `hidden`.

Marcado con transiciones CSS que estorban:

```html
<!-- index.html:912 -->
<div id="modal-caja" class="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 transform scale-95 opacity-0 transition-all duration-200 flex flex-col max-h-[90vh]">
<!-- index.html:686 -->
<div id="modal-lugar-mapa" class="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden transition-all select-none">
<!-- js/footer.js:236 -->
<div id="modal-legal-footer" class="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md hidden transition-all select-none">
<!-- js/footer.js:237 -->
<div id="modal-legal-caja" class="relative w-full max-w-2xl bg-[#0F1422] border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[85vh] transform scale-95 opacity-0 transition-all duration-200">
<!-- js/catalogo-seccion.js:298 -->
'  <div id="modal-catalogo-card" class="bg-white border border-slate-200 rounded-2xl max-w-xl w-full shadow-2xl p-6 sm:p-7 transform scale-95 transition-all duration-300 max-h-[90vh] overflow-y-auto">',
```

## Target

### Valores únicos de movimiento

| Token | CSS | GSAP equivalente | Uso |
| --- | --- | --- | --- |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | `power4.out` | Entradas y salidas |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | `power3.inOut` | Movimiento dentro de la pantalla |

Modal: abre en 0.25 s desde `scale: 0.96`, `y: 8`, `opacity: 0`; el fondo funde en 0.2 s. Cierra en 0.18 s (el cierre es más rápido que la apertura). Siempre `power4.out`. Sin rebote. Con `prefers-reduced-motion`, solo opacidad.

### Archivo nuevo `js/motion.js` (contenido completo)

```js
/**
 * Motion compartido - Guía Internacional de Turismo
 * Único lugar donde viven las curvas, duraciones y helpers de animación.
 * Incluir antes de js/footer.js:
 *   <script src="js/motion.js"></script>
 */
(function () {
  var consultaReducida = window.matchMedia("(prefers-reduced-motion: reduce)");

  var Motion = {
    ease: { out: "power4.out", inOut: "power3.inOut" },
    dur: { press: 0.16, salida: 0.18, fondo: 0.2, entrada: 0.25, seccion: 0.5 },

    // true si el usuario pidió menos movimiento
    reducido: function () {
      return consultaReducida.matches;
    },

    // Entrada de una caja (modal, tarjeta): escala + fundido
    entrar: function (caja) {
      if (!caja) return;
      if (typeof gsap === "undefined") {
        caja.style.opacity = "1";
        caja.style.transform = "none";
        return;
      }
      var r = Motion.reducido();
      // Solo fijar el estado inicial si no está a mitad de otra animación
      if (!gsap.isTweening(caja)) {
        gsap.set(caja, { opacity: 0, scale: r ? 1 : 0.96, y: r ? 0 : 8 });
      }
      gsap.killTweensOf(caja);
      gsap.to(caja, { opacity: 1, scale: 1, y: 0, duration: Motion.dur.entrada, ease: Motion.ease.out });
    },

    // Salida de una caja; alTerminar se llama al acabar
    salir: function (caja, alTerminar) {
      if (!caja || typeof gsap === "undefined") {
        if (alTerminar) alTerminar();
        return;
      }
      var r = Motion.reducido();
      gsap.killTweensOf(caja);
      gsap.to(caja, {
        opacity: 0,
        scale: r ? 1 : 0.96,
        y: 0,
        duration: Motion.dur.salida,
        ease: Motion.ease.out,
        onComplete: alTerminar
      });
    },

    // Fundido del fondo oscuro; valor = 1 (mostrar) o 0 (ocultar)
    fundir: function (fondo, valor, alTerminar) {
      if (!fondo) return;
      if (typeof gsap === "undefined") {
        fondo.style.opacity = String(valor);
        if (alTerminar) alTerminar();
        return;
      }
      if (valor === 1 && !gsap.isTweening(fondo)) gsap.set(fondo, { opacity: 0 });
      gsap.killTweensOf(fondo);
      gsap.to(fondo, {
        opacity: valor,
        duration: valor === 1 ? Motion.dur.fondo : Motion.dur.salida,
        ease: Motion.ease.out,
        onComplete: alTerminar
      });
    },

    // Modal completo: fondo + caja. El llamador ya quitó la clase "hidden".
    abrirModal: function (fondo, caja) {
      Motion.fundir(fondo, 1);
      Motion.entrar(caja);
    },

    cerrarModal: function (fondo, caja, alTerminar) {
      Motion.salir(caja);
      Motion.fundir(fondo, 0, alTerminar);
    }
  };

  // Tokens CSS disponibles en todas las páginas
  var estilo = document.createElement("style");
  estilo.id = "motion-tokens";
  estilo.textContent =
    ":root{--ease-out:cubic-bezier(0.23,1,0.32,1);--ease-in-out:cubic-bezier(0.77,0,0.175,1);}";
  document.head.appendChild(estilo);

  window.Motion = Motion;
})();
```

### Modal de búsqueda (`index.html`) — target

```js
      modal.classList.remove('hidden');
      Motion.abrirModal(modal, modalCaja);
    }

    function cerrarModal() {
      const modal = document.getElementById('modal-busqueda');
      const modalCaja = document.getElementById('modal-caja');
      if (!modal || !modalCaja || modal.classList.contains('hidden')) return;
      Motion.cerrarModal(modal, modalCaja, () => { modal.classList.add('hidden'); });
    }
```

### Modal legal (`js/footer.js`) — target

```js
    modal.classList.remove("hidden");
    Motion.abrirModal(modal, caja);
  };

  window.cerrarModalLegal = function () {
    const modal = document.getElementById("modal-legal-footer");
    const caja = document.getElementById("modal-legal-caja");
    if (!modal || !caja || modal.classList.contains("hidden")) return;
    Motion.cerrarModal(modal, caja, () => { modal.classList.add("hidden"); });
  };
```

### Modal de lugar (`js/mapa-interactivo.js`) — target

```js
    modal.classList.remove("hidden");
    const dialog = modal.querySelector(".modal-card-anim");
    Motion.abrirModal(modal, dialog);
  };

  window.ocultarModalLugar = function () {
    const modal = document.getElementById("modal-lugar-mapa");
    if (!modal || modal.classList.contains("hidden")) return;
    const dialog = modal.querySelector(".modal-card-anim");
    Motion.cerrarModal(modal, dialog, () => { modal.classList.add("hidden"); });
  };
```

### Modal de catálogo (`js/catalogo-seccion.js`) — target

El overlay conserva su lógica de clases (`opacity-0` / `pointer-events-none`); solo cambia la animación de la tarjeta.

```js
      // apertura: sustituye el bloque if (window.gsap) {...} else {...}
      window.Motion.entrar(card);
```

```js
    cerrarModal: function () {
      var overlay = document.getElementById('modal-catalogo-overlay');
      var card = document.getElementById('modal-catalogo-card');
      if (!overlay || !card) return;

      var self = this;
      window.Motion.salir(card, function () {
        overlay.classList.add('opacity-0');
        overlay.classList.add('pointer-events-none');
        overlay.classList.remove('opacity-100');
        self.modalActivo = false;
        document.body.style.overflow = '';
      });
    }
```

### Marcado — target

- `index.html` `#modal-caja`: quita `transform scale-95 opacity-0 transition-all duration-200`.
- `index.html` `#modal-lugar-mapa`: quita `transition-all`.
- `js/footer.js` `#modal-legal-footer`: quita `transition-all`.
- `js/footer.js` `#modal-legal-caja`: quita `transform scale-95 opacity-0 transition-all duration-200`.
- `js/catalogo-seccion.js` `#modal-catalogo-card`: quita `transform scale-95 transition-all duration-300`.
- `index.html` `#modal-busqueda` (línea 911): quita `transition-opacity duration-200` (GSAP anima su opacidad).
- `js/catalogo-seccion.js` `#modal-catalogo-overlay`: cambia `transition-opacity duration-300` por `transition-opacity duration-200` (lo anima CSS, no GSAP; se deja).

## Repo conventions to follow

- Los JS compartidos son IIFE que exponen un objeto en `window` y llevan un comentario de cabecera con cómo incluirlos. Ejemplar: `js/header.js:1-8` y `js/catalogo-seccion.js` (`window.CatalogoSeccion = CatalogoSeccion;`).
- GSAP se carga desde cdnjs al final del `<body>`; los modales se abren por clic, así que GSAP ya está disponible cuando se llama a `Motion`.

## Steps

1. Crea `js/motion.js` con el contenido completo del Target.
2. En los 8 HTML (`index.html`, `agencias.html`, `embajadas.html`, `hoteles.html`, `instituciones.html`, `operadores.html`, `servicios-especiales.html`, `transporte.html`), añade `<script src="js/motion.js"></script>` en la línea inmediatamente anterior a `<script src="js/footer.js"></script>`.
3. `index.html`: sustituye el bloque de apertura y la función `cerrarModal` del modal de búsqueda por el Target. Borra la declaración `let modalBusquedaAnimando = false;`.
4. `js/footer.js`: sustituye el final de `window.abrirModalLegal` y toda `window.cerrarModalLegal` por el Target. Borra `let modalLegalAnimando = false;`.
5. `js/mapa-interactivo.js`: sustituye el final de la función que abre el modal de lugar y toda `window.ocultarModalLugar` por el Target. Borra `let modalLugarAnimando = false;`.
6. `js/catalogo-seccion.js`: aplica el Target en apertura y en `cerrarModal`.
7. Aplica los cambios de marcado del apartado "Marcado — target".

## Boundaries

- NO cambies el contenido, la estructura ni los estilos visuales de los modales; solo la animación y las clases indicadas.
- NO toques la lógica que rellena los modales (títulos, listas, enlaces).
- NO añadas dependencias ni plugins de GSAP.
- NO toques `js/animaciones.js` (planes 001, 004 y 011).
- Si un paso no coincide con el código que encuentras, PARA e informa.

## Verification

- **Mechanical**:
  - `node --check js/motion.js js/footer.js js/mapa-interactivo.js js/catalogo-seccion.js` (un comando por archivo) → sin errores.
  - `grep -c -E "power2\.in|back\.out" index.html js/footer.js js/mapa-interactivo.js js/catalogo-seccion.js` → `0` en todos.
  - `grep -c -E "modal(Busqueda|Legal|Lugar)Animando" index.html js/footer.js js/mapa-interactivo.js` → `0` en todos.
  - `grep -c 'js/motion.js' *.html` → `1` en cada uno de los 8 archivos.
- **Feel check**: abre `index.html` y, en una subpágina, `agencias.html`. Para cada modal (búsqueda, lugar del mapa, legal del pie, ficha de catálogo):
  - Abre y cierra: la caja no rebota ni se pasa de tamaño; el cierre se siente más rápido que la apertura.
  - Cierra y vuelve a abrir enseguida (antes de que termine el cierre): el modal responde y queda abierto, sin quedarse oculto ni saltar.
  - Pulsa Escape y haz clic en el fondo: ambos cierran.
  - En DevTools → Animations, pon la velocidad al 10 % y confirma que la caja no tiene dos movimientos superpuestos.
  - En DevTools → Rendering, activa `prefers-reduced-motion: reduce`: el modal solo funde, sin escala ni desplazamiento.
- **Done when**: los cuatro modales usan `Motion`, no queda `power2.in` ni `back.out`, y reabrir durante el cierre funciona.
