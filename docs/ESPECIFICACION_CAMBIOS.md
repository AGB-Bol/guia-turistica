# Especificación de Cambios — Guía Internacional de Turismo

Documento de requerimientos y guía de implementación por fases para la actualización de la página principal (`index.html`), navegación (`js/header.js`), footer (`js/footer.js`) y rubros del directorio.

> **Stack actual del proyecto:** HTML5 + Tailwind CSS (CDN) + JavaScript vanilla + GSAP (`js/animaciones.js`), sin bundler ni backend. Todos los datos se gestionan mediante archivos estáticos en `data/`.

---

## Resumen Ejecutivo

1. **Enfoque del proyecto:** Evolución de *Directorio Turístico de Bolivia* hacia **Guía Internacional de Turismo** (dejando atrás la limitación a "9 departamentos" y ampliando a destinos nacionales e internacionales).
2. **Navegación por secciones vs. páginas:**
   - Las secciones principales viven dentro de `index.html`, ocupan el alto completo de pantalla (`min-h-[calc(100vh-4rem)]` aprox.) y se navegan por **ancla / scroll suave (`#id`)**.
   - **Única excepción:** los ítems dentro de **Rubros** redirigen a sus páginas HTML independientes (evaluar apertura en misma pestaña o `_blank` según indicación final de producto).
3. **Trabajo dividido por fases:**
   - **Fase 1:** Elemento/anuncio flotante permanente (para 3 entidades/empresas) + Nuevo Navbar.
   - **Fase 2:** Reordenamiento de `index.html`, actualización de Hero automático, nuevas secciones (Rubros, Destinos, Reconocimientos), actualización de Fundadores (5 tarjetas), unificación de Empresas y Aliados en carrusel de logos, sección Nosotros y reubicación de Registro/QR.
   - **Fase 3:** Espacio reservado para Mapa externo + Rubro `Operadores` + actualización de enlaces en Footer y pruebas responsivas.

---

## FASE 1: Widget Flotante Permanente y Nuevo Navbar

### 1.1. Elemento / Anuncio Flotante Permanente (Prioridad Principal)

* **Objetivo:** Mostrar de forma **permanente** en pantalla (no temporal, sin cierre definitivo que lo oculte para siempre) un recuadro o widget interactivo con una animación llamativa donde al hacer clic se abra un **modal** con información completa de la entidad/empresa.
* **Ubicación sugerida:** Fijo en pantalla (`position: fixed`), ya sea en la **esquina inferior derecha** o en el **lateral izquierdo al centro** (tipo cubo/tarjeta flotante). Debe respetar `z-index` alto sin tapar modales activos ni romper la vista móvil.
* **Soporte de diseño / multimedia:**
  * El widget debe estar preparado para insertar piezas producidas por diseño: **animación de personaje/mascota** (ej. un perrito característico saludando, moviéndose o mostrando un código QR dentro de la misma animación).
  * Debe soportar fácilmente formatos como **GIF animado, video corto (`.mp4` / `.webm` con `autoplay loop muted playsinline`), Lottie o SVG animado**.
* **Soporte para 3 Empresas / Entidades (Arquitectura escalable):**
  * Aunque se inicia con una entidad (ej. **Policía**), el componente debe soportar **3 entidades/empresas configurables** desde el inicio (ej. **Policía**, **Alcaldía** y una **3ra entidad**).
  * Se sugiere estructurar un arreglo de datos (ej. `data/patrocinadores-flotantes.js` o dentro de un nuevo `js/widget-flotante.js`) con 3 objetos: `{ id, nombre, etiqueta, mediaUrl, mediaTipo, qrUrl, descripcion, telefono, whatsapp, web, detalles }`.
  * **Comportamiento visual para las 3 entidades:** Implementar un único cubo/widget flotante que **rote automáticamente** cada X segundos entre las 3 entidades (con indicadores pequeños o flechas manuales para cambiar), o bien permitir alternar entre las 3 dentro del widget/modal sin saturar la pantalla.
  * *(Nota de fase posterior: opcionalmente se contempló añadir un mini-banner en carrusel más acortado en la zona superior/header si se requiere en una etapa siguiente, pero en esta primera etapa la prioridad es el widget animado con modal).*
* **Modal al hacer clic:**
  * Al presionar el cubo/animación, abrir un modal centrado con:
    * Nombre y badge de la entidad/empresa.
    * Recurso visual o logo destacado + código QR escaneable o enlace directo.
    * Información detallada, horarios/servicios, botones de contacto y enlace externo.
    * Cierre con botón `X`, tecla `Esc` y clic fuera del cuadro.

---

### 1.2. Nuevo Navbar (`js/header.js`)

Actualizar `js/header.js` para simplificar la barra superior a los puntos acordados:

| Orden | Texto en Navbar | Tipo | Destino |
| :--- | :--- | :--- | :--- |
| 1 | **Inicio** | Ancla / Link | `#hero-section` (o `index.html`) |
| 2 | **Nosotros** | Ancla | `#nosotros` |
| 3 | **Rubros** | Menú desplegable (`dropdown` / `select`) | Enlaces a páginas HTML independientes (ver lista abajo) |
| 4 | **Destinos** | Ancla | `#destinos` |
| 5 | **Empresas** | Ancla | `#empresas` *(sección unificada de Empresas y Aliados)* |
| 6 | **Reconocimientos** | Ancla | `#reconocimientos` |
| CTA | **Registrar Empresa** | Botón | `#seccion-registro` *(se mantiene)* |

* **Opciones dentro del desplegable "Rubros" (antes "Servicios"):**
  1. **Operadores** → `operadores.html` *(ver nota en Fase 3; se contempla agregarlo aunque su contenido/preferencias aún están por definirse)*
  2. **Agencias de Viaje** → `agencias.html`
  3. **Hoteles** → `hoteles.html`
  4. **Transporte** → `transporte.html`
  5. **Embajadas y Consulados** → `embajadas.html`
  6. **Instituciones y Municipios** → `instituciones.html`
  7. **Otros Servicios** → `servicios-especiales.html`
* Asegurar que tanto el **menú de escritorio** como el **menú hamburguesa móvil** reflejen exactamente esta nueva estructura y mantengan el prefijo `index.html` cuando el usuario navega desde una subpágina (`!isHome`).

---

## FASE 2: Reordenamiento y Actualización de Secciones en `index.html`

> **Regla general de layout:** Cada sección debe abarcar la pantalla completa (`min-h-[calc(100vh-4rem)]` o equivalente) y tener su `scroll-mt-16` para que el navbar sticky no tape el encabezado al hacer scroll por ancla.

### Orden Final de Secciones en `index.html`

1. **`#hero-section` — La Guía / Hero Principal** *(Se mantiene y actualiza)*
   * **Cambio de título y enfoque principal (Rebranding):**
     * Reemplazar explícitamente el título principal `<h1>` que actualmente dice **"Directorio Turístico de Bolivia"** (`index.html`) por **"Guía Internacional de Turismo"**.
     * Actualizar también el `<title>` de `index.html` (actualmente *"Guía Turística - Directorio Turístico"*) a **Guía Internacional de Turismo**, y ajustar el subtítulo dejando atrás la limitación a *"9 departamentos"*.
   * **Fondo automático (sin control estático manual):** Actualmente tiene 3 botones (`Salar`, `Titicaca`, `Madidi`) con `cambiarFondoHero()`. Reemplazar ese comportamiento estático por una **transición automática continua** entre las 3 imágenes/elementos visuales (efecto *fade* cruzado y/o ligero paneo automático tipo *Ken Burns*). Los botones manuales pueden eliminarse o quedar solo como indicadores pasivos.
   * Mantener el buscador principal y actualizar opciones/placeholders al nuevo enfoque internacional.

2. **`#rubros` — Rubros** *(Nueva sección en `index.html`)*
   * Mostrar en formato de **cuadros / tarjetas** los **7 rubros** definidos (`Operadores`, `Agencias de Viaje`, `Hoteles`, `Transporte`, `Embajadas y Consulados`, `Instituciones y Municipios`, `Otros Servicios`).
   * Cada cuadro debe tener ícono/imagen representativa, título, breve descripción y enlace directo a su página correspondiente.

3. **`#destinos` — Destinos** *(Nueva sección — reemplaza el enfoque de "Departamentos")*
   * Mostrar destinos preferentes **nacionales e internacionales**.
   * Presentación en formato **carrusel moderno e innovador** (ej. tarjetas con profundidad/hover, slider fluido o carrusel interactivo con controles y autoplay).

4. **`#fundadores` — Fundadores** *(Evolución de la actual sección `#socios`)*
   * Renombrar la sección actual `"Socios y Aliados"` (`#socios`) a **Fundadores** (`#fundadores`).
   * Mantener el estilo de tarjetas (actualmente *3D Flip Cards*), ampliando de **4 a 5 fundadores**:
     1. `SCATUR`
     2. `AGB`
     3. `BLACKBULLS`
     4. `DOMOS`
     5. **`TIP`** *(nuevo cuadro/logo a agregar)*
   * Ajustar el grid responsivo para que **5 tarjetas** se vean equilibradas (ej. `lg:grid-cols-5` o layout centrado de 5 ítems).

5. **`#empresas` — Empresas y Aliados** *(Unificado en esta posición, debajo de Fundadores y antes del Mapa)*
   * **Nota:** Se unifican *Empresas* y *Aliados* en esta única sección para evitar doble repetición.
   * Capacidad para **50 a 60+ empresas/aliados**.
   * Para no saturar toda la pantalla, mostrar **únicamente los logos en un carrusel horizontal automático (marquee infinito)** moviéndose de izquierda a derecha o derecha a izquierda (con soporte de varias filas si es necesario y pausa opcional al pasar el mouse).

6. **`#seccion-mapa` — Espacio Reservado para Mapa** *(Placeholder)*
   * El mapa interactivo actual (`Leaflet`, `data/mapa-datos.js`, `js/mapa-interactivo.js`) **ya no estará bajo nuestra autoría**, pues será desarrollado por otro equipo/dev.
   * Dejar únicamente la **sección y el contenedor limpio (`placeholder` / wrapper con ID claro)** listo para acoplar el componente externo del otro desarrollador (remover o aislar las dependencias de Leaflet si ya no se usarán ahí, previa coordinación).

7. **`#nosotros` — Nosotros** *(Evolución de la actual `#seccion-proposito`)*
   * Reestructurar/actualizar la sección `"¿Qué somos?"` para que funcione como **Nosotros**.
   * Incluir bloques claros para **Misión**, **Visión**, propósito/valores y presentación institucional de la guía.

8. **`#reconocimientos` — Reconocimientos** *(Nueva sección)*
   * Sección en formato de cuadros/tarjetas o vitrina para mostrar los **premios, trofeos y reconocimientos** recibidos (ej. reconocimientos de la **TIB / TIP**, ferias de turismo, certificaciones).
   * Preparada con placeholders visuales limpios para ir cargando las fotos/insignias de cada premio.

9. **`#seccion-registro` — QR y Registro de Empresa** *(Se mantiene y reubica)*
   * Conservar el bloque existente en `index.html` (código QR, enlace directo y botón **Registrar Empresa**).
   * **Ubicación obligatoria:** Debe quedar **debajo de Reconocimientos y justo encima del Footer**.

10. **`#main-footer` — Footer** *(Se mantiene)*
    * Se conserva la estructura visual y funcional de `js/footer.js`.

---

## FASE 3: Ajustes en Subpáginas, Footer y QA

### 3.1. Rubro "Operadores" (`operadores.html`)
* Actualmente `agencias.html` lleva por título *"Agencias de Viaje y Operadores"* (`Categoría 1 de 6`).
* Contemplar la creación de **`operadores.html`** y **`data/operadores.js`** siguiendo exactamente el patrón reutilizable de `js/catalogo-seccion.js` (y actualizar los badges/títulos a `1 de 7`, etc.).
* *Estado:* Dejar la estructura lista y enlazada desde el Navbar (`Rubros`) y la sección `#rubros` del `index.html`; los datos reales/preferenciales se cargarán cuando el cliente los entregue.

### 3.2. Actualización de enlaces y textos en `js/footer.js` y subpáginas
Revisar y actualizar los anclas internos dentro de `js/footer.js` que hoy apuntan a IDs antiguos:
* `#seccion-proposito` → `#nosotros`
* `#socios` → `#fundadores` (y agregar enlace a `#empresas` / `#reconocimientos`)
* Enlaces de *"Destinos Clave"* (hoy apuntan a `#seccion-mapa`) → evaluar si apuntan a `#destinos` o `#seccion-mapa`.
* Agregar `operadores.html` en la columna de categorías/servicios del footer.
* Revisar y alinear textos de marca donde corresponda (ej. *"Directorio Turístico de Bolivia"* / *"Guía Turística de Bolivia"* en `js/footer.js`, `js/header.js` y `<title>` de las subpáginas) hacia **Guía Internacional de Turismo**.

### 3.3. Checklist de Validación (QA)
- [ ] El título principal (`<h1>`) y `<title>` de `index.html` muestran **Guía Internacional de Turismo** en lugar de *"Directorio Turístico de Bolivia"*.
- [ ] El widget flotante permanece visible al hacer scroll en toda la página, rota/soporta 3 entidades y abre correctamente su modal.
- [ ] El Hero cambia sus 3 fondos automáticamente con transición suave sin requerir clic.
- [ ] Todos los enlaces del Navbar (`Inicio`, `Nosotros`, `Destinos`, `Empresas`, `Reconocimientos`, `Registrar Empresa`) hacen scroll suave al `#id` correcto sin quedar tapados por el header sticky.
- [ ] El menú **Rubros** lista los 7 rubros y navega correctamente a cada página.
- [ ] Fundadores muestra 5 tarjetas (`SCATUR`, `AGB`, `BLACKBULLS`, `DOMOS`, `TIP`).
- [ ] Empresas y Aliados muestra los logos (50–60+) en carrusel fluido sin desbordes horizontales (`overflow-x`).
- [ ] Registro de Empresa + QR queda ubicado entre Reconocimientos y el Footer.
- [ ] Verificación completa en vista móvil, tablet y escritorio.
