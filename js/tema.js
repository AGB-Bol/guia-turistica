/**
 * Tema visual - Guía Internacional de Turismo
 * Paleta cálida (terracota + neutros piedra) y tipografía de títulos.
 * Incluir justo después del script de Tailwind CDN:
 *   <script src="js/tema.js"></script>
 * Sobrescribe las escalas "red" y "slate" de Tailwind: así todas las
 * clases red-* y slate-* del proyecto usan esta paleta sin tocarlas.
 */
(function () {
  if (typeof tailwind === "undefined") return;

  tailwind.config = {
    theme: {
      extend: {
        colors: {
          // Terracota (acento principal)
          red: {
            50: "#FBF2EC", 100: "#F6E0D3", 200: "#EDC1A8", 300: "#E19C78", 400: "#D4764D",
            500: "#C2582F", 600: "#AE4824", 700: "#92391B", 800: "#742D17", 900: "#5A2414", 950: "#3A160B"
          },
          // Neutros cálidos (piedra)
          slate: {
            50: "#FAFAF9", 100: "#F5F5F4", 200: "#E7E5E4", 300: "#D6D3D1", 400: "#A8A29E",
            500: "#78716C", 600: "#57534E", 700: "#44403C", 800: "#292524", 900: "#1C1917", 950: "#0C0A09"
          }
        },
        fontFamily: {
          display: ["Fraunces", "Georgia", "serif"]
        }
      }
    }
  };

  var estilo = document.createElement("style");
  estilo.id = "tema-tipografia";
  estilo.textContent =
    "h1,h2{font-family:'Fraunces',Georgia,serif;letter-spacing:-0.01em}";
  document.head.appendChild(estilo);
})();
