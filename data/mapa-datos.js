/**
 * ============================================================================
 * GUÍA TURÍSTICA DE BOLIVIA - CONFIGURACIÓN Y MOCK DATA DEL MAPA INTERACTIVO
 * ============================================================================
 * Este archivo contiene:
 * 1. Configuración de vistas (Mundo y Bolivia).
 * 2. GeoJSON oficial y preciso de las fronteras de Bolivia (Natural Earth).
 * 3. Marcadores de destinos y alojamientos con coordenadas reales (lat, lng).
 */

window.MAPA_CONFIG = {
  // Vista inicial: Mapa Mundial (Fijo, centrado)
  mundoCenter: [15, -25],
  mundoZoom: 2,
  minZoom: 2,
  maxZoom: 14,
  
  // Vista enfocada: Bolivia
  boliviaCenter: [-16.5, -64.5],
  boliviaZoom: 6
};

// Contorno geográfico vectorial OFICIAL y de alta fidelidad de Bolivia (Natural Earth)
window.BOLIVIA_GEOJSON = {
  "type": "Feature",
  "properties": {
    "name": "Bolivia",
    "descripcion": "Corazón de Sudamérica. 9 departamentos con alta diversidad biológica y cultural."
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[
      [-62.846468, -22.034985],
      [-63.986838, -21.993644],
      [-64.377021, -22.798091],
      [-64.964892, -22.075862],
      [-66.273339, -21.83231],
      [-67.106674, -22.735925],
      [-67.82818,  -22.872919],
      [-68.219913, -21.494347],
      [-68.757167, -20.372658],
      [-68.442225, -19.405068],
      [-68.966818, -18.981683],
      [-69.100247, -18.260125],
      [-69.590424, -17.580012],
      [-68.959635, -16.500698],
      [-69.389764, -15.660129],
      [-69.160347, -15.323974],
      [-69.339535, -14.953195],
      [-68.948887, -14.453639],
      [-68.929224, -13.602684],
      [-68.88008,  -12.899729],
      [-68.66508,  -12.5613],
      [-69.529678, -10.951734],
      [-68.786158, -11.03638],
      [-68.271254, -11.014521],
      [-68.048192, -10.712059],
      [-67.173801, -10.306812],
      [-66.646908, -9.931331],
      [-65.338435, -9.761988],
      [-65.444837, -10.511451],
      [-65.321899, -10.895872],
      [-65.402281, -11.56627],
      [-64.316353, -12.461978],
      [-63.196499, -12.627033],
      [-62.80306,  -13.000653],
      [-62.127081, -13.198781],
      [-61.713204, -13.489202],
      [-61.084121, -13.479384],
      [-60.503304, -13.775955],
      [-60.459198, -14.354007],
      [-60.264326, -14.645979],
      [-60.251149, -15.077219],
      [-60.542966, -15.09391],
      [-60.15839,  -16.258284],
      [-58.24122,  -16.299573],
      [-58.388058, -16.877109],
      [-58.280804, -17.27171],
      [-57.734558, -17.552468],
      [-57.498371, -18.174188],
      [-57.676009, -18.96184],
      [-57.949997, -19.400004],
      [-57.853802, -19.969995],
      [-58.166392, -20.176701],
      [-58.183471, -19.868399],
      [-59.115042, -19.356906],
      [-60.043565, -19.342747],
      [-61.786326, -19.633737],
      [-62.265961, -20.513735],
      [-62.291179, -21.051635],
      [-62.685057, -22.249029],
      [-62.846468, -22.034985]
    ]]
  }
};

window.MARCADORES_TURISMO = [
  {
    id: "hotel-palacio-sal",
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
