/**
 * ============================================================================
 * GUÍA INTERNACIONAL DE TURISMO - DATOS DEL MAPA INTERACTIVO
 * ============================================================================
 * Este archivo contiene:
 * 1. MAPA_PAISES: países del mapa. estado "activo" = tiene servicios en el mapa
 *    (hoy solo Bolivia); "proximamente" = se muestra con la insignia
 *    "Próximamente". Para habilitar otro país basta con cambiar su estado a
 *    "activo" y agregar sus lugares en MARCADORES_TURISMO con pais: "<slug>".
 * 2. MAPA_BANDERAS: banderas dibujadas en SVG (viewBox 0 0 30 20).
 * 3. MARCADORES_TURISMO: servicios/alojamientos con coordenadas (lat, lng).
 *    Las coordenadas se proyectan sobre el mapa SVG (la posición es aproximada).
 *    "etiqueta" (opcional): lado del rótulo del punto: abajo | arriba | izq | der.
 * La geometría de los países está en data/mapa-geo.js.
 */

window.MAPA_PAISES = [
  {
    id: "bo",
    slug: "bolivia",
    nombre: "Bolivia",
    oficial: "Estado Plurinacional de Bolivia",
    estado: "activo",
    lab: {
      dy: -9,
      tam: 15
    },
    destinos: [
      "Salar de Uyuni",
      "Copacabana y Lago Titicaca",
      "Parque Nacional Madidi"
    ]
  },
  {
    id: "pe",
    slug: "peru",
    nombre: "Perú",
    oficial: "República del Perú",
    estado: "proximamente",
    lab: {},
    destinos: [
      "Machu Picchu",
      "Líneas de Nazca",
      "Cusco y Valle Sagrado"
    ]
  },
  {
    id: "br",
    slug: "brasil",
    nombre: "Brasil",
    oficial: "República Federativa del Brasil",
    estado: "proximamente",
    lab: {
      dx: 10,
      dy: -10,
      tam: 16
    },
    destinos: [
      "Río de Janeiro",
      "Cataratas del Iguazú",
      "El Amazonas"
    ]
  },
  {
    id: "cl",
    slug: "chile",
    nombre: "Chile",
    oficial: "República de Chile",
    estado: "proximamente",
    lab: {
      vertical: true,
      tam: 10
    },
    destinos: [
      "Desierto de Atacama",
      "Torres del Paine",
      "Isla de Pascua"
    ]
  },
  {
    id: "ar",
    slug: "argentina",
    nombre: "Argentina",
    oficial: "República Argentina",
    estado: "proximamente",
    lab: {
      dx: 6,
      dy: -20,
      tam: 14
    },
    destinos: [
      "Buenos Aires",
      "Glaciar Perito Moreno",
      "Mendoza: Ruta del Vino"
    ]
  },
  {
    id: "py",
    slug: "paraguay",
    nombre: "Paraguay",
    oficial: "República del Paraguay",
    estado: "proximamente",
    lab: {
      tam: 9
    },
    destinos: [
      "Ruinas Jesuíticas",
      "Asunción histórica",
      "Salto Cristal"
    ]
  },
  {
    id: "uy",
    slug: "uruguay",
    nombre: "Uruguay",
    oficial: "República Oriental del Uruguay",
    estado: "proximamente",
    lab: {
      dx: 36,
      dy: 14,
      tam: 10
    },
    destinos: [
      "Colonia del Sacramento",
      "Punta del Este",
      "Montevideo"
    ]
  },
  {
    id: "co",
    slug: "colombia",
    nombre: "Colombia",
    oficial: "República de Colombia",
    estado: "proximamente",
    lab: {},
    destinos: [
      "Cartagena de Indias",
      "Valle de Cocora",
      "Medellín"
    ]
  },
  {
    id: "ec",
    slug: "ecuador",
    nombre: "Ecuador",
    oficial: "República del Ecuador",
    estado: "proximamente",
    lab: {
      dx: -36,
      dy: -2,
      tam: 10
    },
    destinos: [
      "Islas Galápagos",
      "Quito histórico",
      "Baños"
    ]
  },
  {
    id: "mx",
    slug: "mexico",
    nombre: "México",
    oficial: "Estados Unidos Mexicanos",
    estado: "proximamente",
    lab: {
      dx: 46,
      dy: 34,
      tam: 15
    },
    destinos: [
      "Chichén Itzá",
      "Cancún y Riviera Maya",
      "Ciudad de México"
    ]
  },
  {
    id: "cu",
    slug: "cuba",
    nombre: "Cuba",
    oficial: "República de Cuba",
    estado: "proximamente",
    lab: {
      dy: -13,
      tam: 10
    },
    destinos: [
      "La Habana Vieja",
      "Valle de Viñales",
      "Varadero"
    ]
  },
  {
    id: "cr",
    slug: "costa-rica",
    nombre: "Costa Rica",
    oficial: "República de Costa Rica",
    estado: "proximamente",
    lab: {
      dx: -38,
      dy: 12,
      tam: 10
    },
    destinos: [
      "Volcán Arenal",
      "Monteverde",
      "Manuel Antonio"
    ]
  }
];

window.MAPA_BANDERAS = {
  "bo": "<rect width=\"30\" height=\"7\" fill=\"#D52B1E\"/><rect y=\"7\" width=\"30\" height=\"6\" fill=\"#F9E300\"/><rect y=\"13\" width=\"30\" height=\"7\" fill=\"#007934\"/>",
  "pe": "<rect width=\"30\" height=\"20\" fill=\"#fff\"/><rect width=\"8\" height=\"20\" fill=\"#D91023\"/><rect x=\"22\" width=\"8\" height=\"20\" fill=\"#D91023\"/>",
  "br": "<rect width=\"30\" height=\"20\" fill=\"#009C3B\"/><polygon points=\"15,2 28,10 15,18 2,10\" fill=\"#FFDF00\"/><circle cx=\"15\" cy=\"10\" r=\"4.5\" fill=\"#002776\"/>",
  "cl": "<rect width=\"30\" height=\"10\" fill=\"#fff\"/><rect y=\"10\" width=\"30\" height=\"10\" fill=\"#D52B1E\"/><rect width=\"10\" height=\"10\" fill=\"#0039A6\"/><circle cx=\"5\" cy=\"5\" r=\"1.7\" fill=\"#fff\"/>",
  "ar": "<rect width=\"30\" height=\"20\" fill=\"#74ACDF\"/><rect y=\"7\" width=\"30\" height=\"6\" fill=\"#fff\"/><circle cx=\"15\" cy=\"10\" r=\"2\" fill=\"#F6B40E\"/>",
  "py": "<rect width=\"30\" height=\"7\" fill=\"#D52B1E\"/><rect y=\"7\" width=\"30\" height=\"6\" fill=\"#fff\"/><rect y=\"13\" width=\"30\" height=\"7\" fill=\"#0038A8\"/>",
  "uy": "<rect width=\"30\" height=\"20\" fill=\"#fff\"/><rect x=\"10\" y=\"2\" width=\"20\" height=\"2.2\" fill=\"#0038A8\"/><rect x=\"10\" y=\"6.4\" width=\"20\" height=\"2.2\" fill=\"#0038A8\"/><rect x=\"10\" y=\"10.8\" width=\"20\" height=\"2.2\" fill=\"#0038A8\"/><rect x=\"10\" y=\"15.2\" width=\"20\" height=\"2.2\" fill=\"#0038A8\"/><circle cx=\"5\" cy=\"5\" r=\"2.4\" fill=\"#FCD116\"/>",
  "co": "<rect width=\"30\" height=\"10\" fill=\"#FCD116\"/><rect y=\"10\" width=\"30\" height=\"5\" fill=\"#003893\"/><rect y=\"15\" width=\"30\" height=\"5\" fill=\"#CE1126\"/>",
  "ec": "<rect width=\"30\" height=\"10\" fill=\"#FFDD00\"/><rect y=\"10\" width=\"30\" height=\"5\" fill=\"#034EA2\"/><rect y=\"15\" width=\"30\" height=\"5\" fill=\"#ED1C24\"/><circle cx=\"15\" cy=\"10\" r=\"2.4\" fill=\"#8a6a2a\"/>",
  "mx": "<rect width=\"10\" height=\"20\" fill=\"#006847\"/><rect x=\"10\" width=\"10\" height=\"20\" fill=\"#fff\"/><rect x=\"20\" width=\"10\" height=\"20\" fill=\"#CE1126\"/><circle cx=\"15\" cy=\"10\" r=\"2.6\" fill=\"#8a6a2a\"/>",
  "cu": "<rect width=\"30\" height=\"20\" fill=\"#fff\"/><rect width=\"30\" height=\"4\" fill=\"#002A8F\"/><rect y=\"8\" width=\"30\" height=\"4\" fill=\"#002A8F\"/><rect y=\"16\" width=\"30\" height=\"4\" fill=\"#002A8F\"/><polygon points=\"0,0 13,10 0,20\" fill=\"#CF142B\"/><circle cx=\"4\" cy=\"10\" r=\"2\" fill=\"#fff\"/>",
  "cr": "<rect width=\"30\" height=\"20\" fill=\"#002B7F\"/><rect y=\"3\" width=\"30\" height=\"14\" fill=\"#fff\"/><rect y=\"6.5\" width=\"30\" height=\"7\" fill=\"#CE1126\"/>"
};

window.MARCADORES_TURISMO = [
  {
    id: "hotel-palacio-sal",
    etiqueta: "izq",
    pais: "bolivia",
    departamento: "Potosí",
    nombre: "Hotel Palacio de Sal",
    categoria: "Hotel de Sal & Spa",
    tipoIcono: "hotel",
    lat: -20.3341,
    lng: -66.9936,
    estrellas: 5,
    resumen: "El primer hotel de sal del planeta. Emplazado al borde del imponente Salar de Uyuni, construido 100% con bloques de sal y comodidades de lujo.",
    imagen: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Mirador de Estrellas", "Restaurante Gourmet", "Spa de Sal y Sauna", "Excursiones 4x4"],
    precioReferencial: "$180 USD / noche",
    contacto: "+591 71812345",
    enlace: "hoteles.html"
  },
  {
    id: "ecolodge-copacabana",
    etiqueta: "izq",
    pais: "bolivia",
    departamento: "La Paz",
    nombre: "Ecolodge Isla del Sol",
    categoria: "Ecolodge Panorámico",
    tipoIcono: "ecoturismo",
    lat: -16.0350,
    lng: -69.1764,
    estrellas: 4,
    resumen: "Ubicado en la parte sur de la Isla del Sol, sobre el Lago Titicaca. Senderos ancestrales incaicos, descanso absoluto y atardeceres dorados.",
    imagen: "https://images.unsplash.com/photo-1589802829985-817e51171b92?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Vista 360° al Lago", "Cocina Andina Orgánica", "Paseos en Bote Tradicional", "Calefacción"],
    precioReferencial: "$95 USD / noche",
    contacto: "+591 72098765",
    enlace: "hoteles.html"
  },
  {
    id: "chalalan-albergue",
    etiqueta: "der",
    pais: "bolivia",
    departamento: "Beni / La Paz",
    nombre: "Chalalán Albergue Ecológico",
    categoria: "Reserva de Selva & Biodiversidad",
    tipoIcono: "selva",
    lat: -14.4258,
    lng: -67.9250,
    estrellas: 5,
    resumen: "Pionero del turismo comunitario en el Parque Nacional Madidi. Guiado por pobladores indígenas de San José de Uchupiamonas en la selva virgen.",
    imagen: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Canoa en Laguna Chalalán", "Guías Nativos Bilingües", "Senderos de Fauna Exótica", "Pensión Completa"],
    precioReferencial: "$140 USD / noche",
    contacto: "+591 73044556",
    enlace: "hoteles.html"
  },
  {
    id: "chiquitania-resort",
    etiqueta: "abajo",
    pais: "bolivia",
    departamento: "Santa Cruz",
    nombre: "Hotel Misiones Colonial",
    categoria: "Patrimonio & Cultura Chiquitana",
    tipoIcono: "patrimonio",
    lat: -16.1308,
    lng: -62.0294,
    estrellas: 4,
    resumen: "Elegante casona rústica en Concepción, corazón de las Misiones Jesuíticas. Tallados en madera barroca mestiza y frondosos jardines tropicales.",
    imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Piscina al Aire Libre", "Rutas de Iglesias Barrocas", "Gastronomía Tradicional", "Jardines Tropicales"],
    precioReferencial: "$85 USD / noche",
    contacto: "+591 76011223",
    enlace: "hoteles.html"
  },
  {
    id: "parador-santa-maria",
    etiqueta: "der",
    pais: "bolivia",
    departamento: "Chuquisaca",
    nombre: "Parador Santa María La Real",
    categoria: "Hotel Boutique Histórico",
    tipoIcono: "boutique",
    lat: -19.0431,
    lng: -65.2592,
    estrellas: 5,
    resumen: "Mansión virreinal del siglo XVIII restaurada en el casco histórico de Sucre. Galerías coloniales, antigüedades originales y confort moderno.",
    imagen: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Museo Colonial Privado", "Cava de Vinos Subterránea", "Restaurante de Época", "WiFi de Alta Velocidad"],
    precioReferencial: "$120 USD / noche",
    contacto: "+591 74077889",
    enlace: "hoteles.html"
  },
  {
    id: "torotoro-eco-cabañas",
    etiqueta: "der",
    pais: "bolivia",
    departamento: "Potosí / Cochabamba",
    nombre: "Cabañas Cañón de Torotoro",
    categoria: "Aventura & Geoturismo",
    tipoIcono: "aventura",
    lat: -18.1342,
    lng: -65.7633,
    estrellas: 4,
    resumen: "Emplazadas a minutos del Parque Nacional Torotoro. Acceso directo a huellas de dinosaurios, cavernas profundas y el impresionante Cañón de Torotoro.",
    imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    logo: "img/logo-placeholder.svg",
    servicios: ["Guías Geológicos", "Fogatas Nocturnas", "Comida Casera Típica", "Trekking al Vergel"],
    precioReferencial: "$65 USD / noche",
    contacto: "+591 75033441",
    enlace: "hoteles.html"
  }
];
