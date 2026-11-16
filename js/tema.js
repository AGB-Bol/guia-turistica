/**
 * Tema visual - Guía Internacional de Turismo
 * Colores de la bandera de Bolivia (rojo, amarillo, verde) y tipografía con carácter.
 * Incluir justo después del script de Tailwind CDN:
 *   <script src="js/tema.js"></script>
 * Sobrescribe las escalas "red", "amber" y "emerald" de Tailwind: todas las
 * clases red-*, amber-* y emerald-* del proyecto usan esta paleta.
 */
(function () {
  if (typeof tailwind === "undefined") return;

  tailwind.config = {
    theme: {
      extend: {
        colors: {
          // Rojo
          red: {
            50: "#FFF0EE", 100: "#FFDAD5", 200: "#FFB5AB", 300: "#FF8777", 400: "#F45B48",
            500: "#E8402C", 600: "#D52B1E", 700: "#B71F14", 800: "#921A12", 900: "#70170F", 950: "#3F0B07"
          },
          // Amarillo
          amber: {
            50: "#FFFBEB", 100: "#FFF3C4", 200: "#FFE58A", 300: "#FFD54D", 400: "#FFC21A",
            500: "#F5A800", 600: "#D98A00", 700: "#B36A00", 800: "#8F5200", 900: "#6B3E00", 950: "#3D2200"
          },
          // Verde
          emerald: {
            50: "#ECFDF3", 100: "#D1FADF", 200: "#A6F4C5", 300: "#6CE9A6", 400: "#32D583",
            500: "#14A44D", 600: "#0B8A3E", 700: "#086F33", 800: "#07582B", 900: "#064824", 950: "#022B15"
          }
        },
        fontFamily: {
          display: ["Bricolage Grotesque", "system-ui", "sans-serif"]
        }
      }
    }
  };

  var estilo = document.createElement("style");
  estilo.id = "tema-tipografia";
  estilo.textContent =
    "body{font-family:'Nunito',system-ui,sans-serif}" +
    "h1,h2,h3{font-family:'Bricolage Grotesque',system-ui,sans-serif;letter-spacing:-0.015em}";
  document.head.appendChild(estilo);
})();
