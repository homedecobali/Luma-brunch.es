/* LUMA Kassa – instellingen en dummydata.
   ALLES HIERIN IS VOORLOPIG: medewerkers, pincodes, tafels en bedrijfsgegevens zijn voorbeelden.
   Later komen deze uit de database (beheerd door de eigenaar). */
window.LK = window.LK || {};

LK.CONFIG = {
  /* Gegevens die op de factura simplificada moeten staan (art. 7 RD 1619/2012). Invullen door Rick. */
  business: {
    name: "LUMA Brunch",
    legalName: "[Razón social pendiente]",
    nif: "B00000000",                       // DUMMY – echte NIF/CIF invullen
    address: "C. Aneto, Local 13",
    city: "03178 Benijófar (Alicante)",
    country: "ES"
  },
  /* Nummering: één doorlopende reeks per jaar, bijv. T2026-000123. Rectificaties (creditbonnen) eigen reeks. */
  series: { ticket: "T", rectificativa: "R" },
  /* IVA. Aanname: alles 10 % (horeca: eten en alcoholvrije dranken, ter plaatse en afhaal).
     Per categorie of product te overschrijven, bijv. alcohol 21 %. */
  vat: { default: 10, byCategory: {}, byItem: {} },
  currency: "EUR",
  /* Verifactu: voorbereid, nog niets verzonden. "pruebas" = testomgeving AEAT. */
  verifactu: {
    enabled: false,
    env: "pruebas",
    qrBase: {
      pruebas: "https://prewww2.aeat.es/wlpl/TIKE-CONT/ValidarQR",
      produccion: "https://www2.agenciatributaria.gob.es/wlpl/TIKE-CONT/ValidarQR"
    },
    software: { name: "LUMA Kassa", id: "LK", version: "0.1.0-demo" }
  },
  openingFloat: 150,           // wisselgeld in de la bij opening (aanname)
  longTableMinutes: 75,        // tafel kleurt goud als hij langer open staat

  /* Medewerkers (DUMMY). Rollen: owner = eigenaar, manager = encargado/a, staff = personeel.
     Pincodes staan hier alleen voor de demo; in de echte versie gehasht in de database. */
  staff: [
    { id: "owner",  name: "Dueño",  role: "owner",   pin: "0000", color: "#0b4425" },
    { id: "ana",    name: "Ana",    role: "manager", pin: "1111", color: "#b5722b" },
    { id: "carlos", name: "Carlos", role: "staff",   pin: "2222", color: "#2d6a8f" },
    { id: "lucia",  name: "Lucía",  role: "staff",   pin: "3333", color: "#8e4a7c" },
    { id: "marta",  name: "Marta",  role: "staff",   pin: "4444", color: "#3f7d4e" },
    { id: "javi",   name: "Javi",   role: "staff",   pin: "5555", color: "#a4492f" },
    { id: "sofia",  name: "Sofía",  role: "staff",   pin: "6666", color: "#5b5aa0" }
  ],

  /* Rechten per rol */
  can: {
    owner:   { week: true,  layout: true,  close: true,  rectify: true },
    manager: { week: true,  layout: true,  close: true,  rectify: true },
    staff:   { week: false, layout: false, close: false, rectify: false }
  },

  /* Demo-data: verhoog dit getal om de voorbeelddata op alle toestellen opnieuw te laten aanmaken. */
  demoDataVersion: 2,

  /* Plattegrond (indeling van Rick, 23-11-2026; de eigenaar kan hem in de kassa zelf aanpassen). x/y in % van het vlak. */
  zones: [
    { id: "in",  t: ["Interior", "Inside", "Binnen"],
      fixtures: [ { label: ["Barra", "Counter", "Bar"], x: 3, y: 74, w: 55, h: 18 },
                  { label: ["Entrada", "Entrance", "Ingang"], x: 82, y: 86, w: 15, h: 10 } ] },
    { id: "out", t: ["Terraza", "Terrace", "Terras"],
      fixtures: [ { label: ["Calle", "Street", "Straat"], x: 2, y: 88, w: 96, h: 9 } ] }
  ],
  tables: [
    /* Binnen: 6 tafels van 4 en 1 grote tafel van 8 */
    { id: "1",  zone: "in",  x: 14, y: 22, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "2",  zone: "in",  x: 36, y: 22, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "3",  zone: "in",  x: 58, y: 22, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "4",  zone: "in",  x: 14, y: 52, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "5",  zone: "in",  x: 36, y: 52, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "6",  zone: "in",  x: 58, y: 52, w: 140, h: 104, seats: 4, shape: "sq" },
    { id: "7",  zone: "in",  x: 85, y: 40, w: 128, h: 250, seats: 8, shape: "sq" },
    /* Terras: 10 tafeltjes van 2 */
    { id: "T1",  zone: "out", x: 12, y: 26, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T2",  zone: "out", x: 31, y: 26, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T3",  zone: "out", x: 50, y: 26, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T4",  zone: "out", x: 69, y: 26, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T5",  zone: "out", x: 88, y: 26, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T6",  zone: "out", x: 12, y: 60, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T7",  zone: "out", x: 31, y: 60, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T8",  zone: "out", x: 50, y: 60, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T9",  zone: "out", x: 69, y: 60, w: 100, h: 88, seats: 2, shape: "sq" },
    { id: "T10", zone: "out", x: 88, y: 60, w: 100, h: 88, seats: 2, shape: "sq" }
  ],

  /* Extra's per categorie (uit de kaartnotities). Prijs in euro. */
  extras: {
    coffee: [
      { id: "oat",   t: ["Bebida de avena", "Oat milk", "Havermelk"], p: 0.30 },
      { id: "alm",   t: ["Bebida de almendras", "Almond milk", "Amandelmelk"], p: 0.30 },
      { id: "lf",    t: ["Leche sin lactosa", "Lactose-free milk", "Lactosevrije melk"], p: 0.30 },
      { id: "shot",  t: ["Espresso extra", "Extra shot", "Extra espresso"], p: 1.00 },
      { id: "cream", t: ["Nata montada", "Whipped cream", "Slagroom"], p: 0.50 },
      { id: "syrup", t: ["Sirope (caramelo/vainilla)", "Syrup (caramel/vanilla)", "Siroop (karamel/vanille)"], p: 1.00 }
    ],
    food: [
      { id: "egg",   t: ["Huevo extra", "Extra egg", "Extra ei"], p: 1.00 },
      { id: "avo",   t: ["Aguacate extra", "Extra avocado", "Extra avocado"], p: 1.50 },
      { id: "gf",    t: ["Pan sin gluten", "Gluten-free bread", "Glutenvrij brood"], p: 1.00 }
    ]
  },
  extrasForCat: { cafes: "coffee", iced: "coffee", matcha: "coffee", tes: "coffee",
    "tostadas-especiales": "food", tostadas: "food", sandwiches: "food", croissants: "food",
    bagels: "food", brunch: "food", desayuno: "food", ensaladas: "food" },

  /* Foto's uit de site (eigen foto's van Luma). */
  itemPhotos: {
    "cafes:Chocolate caliente": "chocolate-navidad", "cafes:Latte": "cinnamon-latte",
    "iced:Iced latte": "latte-otono", "iced:Iced matcha latte": "matcha-neon",
    "matcha:Matcha latte": "matcha-ube", "matcha:Iced matcha latte": "matcha-neon",
    "smoothies:Pink Dragon": "pink-dragon", "bowls:Pink Dragon": "pink-dragon-bowl",
    "bowls:Açaí Bowl": "acai-bowl", "tostadas-especiales:Feta": "tostada-feta",
    "tostadas-especiales:Nordic Dream": "nordic-dream", "croissants:Huevos revueltos": "croissant-huevo",
    "sopas:Sopa de pollo": "sopa-pollo", "brunch:Shakshuka": "shakshuka",
    "brunch:Avocado “Croast”": "avocado-croast", "brunch:Flatbread Luma’s Chicken": "flatbread-pollo",
    "dulce:Tortitas": "tortitas-manzana", "dulce:Rollo de canela": "cinnamon-roll"
  },
  catPhotos: { cafes: "cinnamon-latte", iced: "latte-otono", matcha: "matcha-ube", smoothies: "smoothie-fresa",
    bowls: "acai-local", zumos: "pink-dragon-sip", desayuno: "croissants", "tostadas-especiales": "avocado-croast",
    tostadas: "tostada-jamon", croissants: "croissants", sopas: "sopa", brunch: "baguette-atun", dulce: "cinnamon-corte",
    sandwiches: "baguette-atun", bagels: "wrap", ensaladas: "wrap", peques: "gofre", tes: "matcha-neon" }
};
