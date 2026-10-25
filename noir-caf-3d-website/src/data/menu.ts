import { IMG } from "../lib/site";

/**
 * SAMPLE MENU — all items and INR prices are editable demonstration content.
 * Replace with the café's real menu and pricing before launch.
 */

export type MenuCategory = "espresso" | "signature" | "cold" | "tea" | "bakery" | "desserts";

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number; // INR
  tags: string[];
  image?: string;
  alt?: string;
}

export const CATEGORIES: { id: MenuCategory; label: string }[] = [
  { id: "espresso", label: "Espresso" },
  { id: "signature", label: "Signature Coffee" },
  { id: "cold", label: "Cold Coffee" },
  { id: "tea", label: "Tea" },
  { id: "bakery", label: "Bakery" },
  { id: "desserts", label: "Desserts" },
];

export const MENU: Record<MenuCategory, MenuItem[]> = {
  espresso: [
    {
      id: "noir-espresso",
      name: "Noir Espresso",
      desc: "Our house double shot — dark chocolate, burnt sugar, a whisper of orange peel.",
      price: 180,
      tags: ["Double shot", "House blend"],
      image: IMG.coffeeDark.espressoSaucer,
      alt: "Minimalist espresso shot in a white cup on a dark saucer",
    },
    {
      id: "doppio-ristretto",
      name: "Doppio Ristretto",
      desc: "A shorter, denser pull. Syrupy body, intense crema, low bitterness.",
      price: 220,
      tags: ["Double shot", "Intense"],
      image: IMG.coffeeDark.pourSteam,
      alt: "Dark coffee being poured into a black cup with steam rising",
    },
    {
      id: "cortado",
      name: "Cortado",
      desc: "Equal parts espresso and steamed milk, served small and warm in glass.",
      price: 210,
      tags: ["Small serve", "Milk"],
      image: IMG.coffeeDark.rusticMug,
      alt: "Black coffee in a ceramic mug styled in moody rustic light",
    },
    {
      id: "affogato-noir",
      name: "Affogato Noir",
      desc: "Vanilla bean gelato drowned in a fresh double espresso. Dessert and coffee at once.",
      price: 280,
      tags: ["Dessert coffee", "Cold & hot"],
      image: IMG.dessert.marbleTable,
      alt: "Café table with coffee and desserts on a marble surface",
    },
  ],
  signature: [
    {
      id: "caramel-latte",
      name: "Caramel Latte",
      desc: "Slow-cooked caramel folded into steamed milk over a double shot. Salted rim optional.",
      price: 280,
      tags: ["Bestseller", "Milk"],
      image: IMG.barista.pourWide,
      alt: "Barista pouring latte art into a ceramic cup",
    },
    {
      id: "spanish-latte",
      name: "Spanish Latte",
      desc: "Espresso layered with condensed milk and silky microfoam — sweet, plush, dangerous.",
      price: 300,
      tags: ["Sweet", "Layered"],
      image: IMG.barista.latteCup,
      alt: "Latte with rosetta art in a white ceramic cup",
    },
    {
      id: "mocha-noir",
      name: "Mocha Noir",
      desc: "70% dark chocolate melted into espresso, finished with cream and cocoa dust.",
      price: 290,
      tags: ["Chocolate", "Rich"],
      image: IMG.coffeeDark.cappuccinoBeans,
      alt: "Cappuccino dusted with spice surrounded by coffee beans",
    },
    {
      id: "cappuccino-classico",
      name: "Cappuccino Classico",
      desc: "The classic thirds — espresso, steamed milk, deep foam. Dusted with single-origin cocoa.",
      price: 240,
      tags: ["Classic", "Foam"],
      image: IMG.matcha.heartFoam,
      alt: "Cappuccino with heart-shaped foam art in a white cup",
    },
  ],
  cold: [
    {
      id: "vanilla-cold-brew",
      name: "Vanilla Cold Brew",
      desc: "18-hour steep, Madagascan vanilla, served over a single clear cube.",
      price: 260,
      tags: ["18-hr steep", "Iced"],
      image: IMG.cold.beansColdBrew,
      alt: "Cold brew coffee poured into a glass surrounded by coffee beans",
    },
    {
      id: "shakerato",
      name: "Iced Shakerato",
      desc: "Espresso shaken hard with demerara until frothy — Sicily in a glass.",
      price: 290,
      tags: ["Shaken", "Foamy"],
      image: IMG.cold.counterIced,
      alt: "Chilled iced coffee in a tall glass on a café counter",
    },
    {
      id: "cold-brew-tonic",
      name: "Cold Brew Tonic",
      desc: "Bright cold brew over artisan tonic with burnt orange and juniper.",
      price: 300,
      tags: ["Citrus", "Sparkling"],
      image: IMG.cold.coasterIced,
      alt: "Glass of iced coffee on a wooden coaster with dramatic light",
    },
    {
      id: "iced-mocha",
      name: "Iced Mocha",
      desc: "Cold milk, dark chocolate, double shot, crushed ice. The summer noir.",
      price: 280,
      tags: ["Chocolate", "Iced"],
      image: IMG.cold.outdoorIced,
      alt: "Glass of iced coffee with ice cubes on a rustic wooden table",
    },
  ],
  tea: [
    {
      id: "masala-chai",
      name: "Slow Masala Chai",
      desc: "Assam leaves simmered with cracked cardamom, ginger and black pepper.",
      price: 160,
      tags: ["Spiced", "House recipe"],
      image: IMG.dessert.teaCamera,
      alt: "Turkish tea served alongside dessert and cameras on a table",
    },
    {
      id: "matcha-latte",
      name: "Matcha Latte",
      desc: "Ceremonial-grade matcha whisked to order — grassy, creamy, calm.",
      price: 300,
      tags: ["Ceremonial grade", "Whisked"],
      image: IMG.matcha.rusticMatcha,
      alt: "Matcha latte with latte art on a rustic wooden table",
    },
    {
      id: "earl-grey",
      name: "Smoked Earl Grey",
      desc: "Bergamot black tea with a hint of lapsang smoke. Served with orange coin.",
      price: 180,
      tags: ["Smoked", "Citrus"],
      image: IMG.dessert.feast,
      alt: "Warm table setting with tea, coffee and desserts",
    },
    {
      id: "hibiscus-cooler",
      name: "Hibiscus Cooler",
      desc: "Ruby hibiscus steeped cold, honeyed and poured over ice with mint.",
      price: 200,
      tags: ["Caffeine-free", "Iced"],
      image: IMG.cold.strawIced,
      alt: "Close-up of an iced drink with ice cubes and a straw",
    },
  ],
  bakery: [
    {
      id: "butter-croissant",
      name: "Butter Croissant",
      desc: "Laminated over three days with cultured butter. Shattering layers, soft heart.",
      price: 180,
      tags: ["Baked daily", "Vegetarian"],
      image: IMG.bakery.flourCroissants,
      alt: "Freshly baked croissants dusted with flour",
    },
    {
      id: "pain-au-chocolat",
      name: "Pain au Chocolat",
      desc: "Dark Ecuadorian chocolate batons wrapped in our croissant dough.",
      price: 220,
      tags: ["Chocolate", "Baked daily"],
      image: IMG.bakery.chocoCroissant,
      alt: "Chocolate-filled croissants on a wooden board",
    },
    {
      id: "almond-croissant",
      name: "Almond Croissant",
      desc: "Twice-baked with frangipane and toasted almond flakes. Contains nuts.",
      price: 240,
      tags: ["Contains nuts", "Twice-baked"],
      image: IMG.bakery.boardCroissants,
      alt: "Golden croissants with coffee on a wooden board",
    },
    {
      id: "sourdough-toast",
      name: "Sourdough & Whipped Honey Butter",
      desc: "Thick-cut sourdough, charred on the plancha, whipped honey butter, flaky salt.",
      price: 200,
      tags: ["Vegetarian", "Toasted"],
      image: IMG.bakery.honeyBoard,
      alt: "Croissants and honey arranged on a wooden board",
    },
  ],
  desserts: [
    {
      id: "chocolate-brownie",
      name: "Sea-Salt Chocolate Brownie",
      desc: "Fudgy centre, crackled top, smoked sea salt. Warm on request.",
      price: 240,
      tags: ["Warm serve", "Cocoa"],
      image: IMG.dessert.cupcakes,
      alt: "Decadent chocolate dessert with rich cream and chocolate chunks",
    },
    {
      id: "basque-cheesecake",
      name: "Basque Cheesecake",
      desc: "Burnt-top, custard-hearted cheesecake baked fierce and fast.",
      price: 320,
      tags: ["Signature", "Slice"],
      image: IMG.dessert.chocoSlice,
      alt: "Slice of chocolate cheesecake on a textured plate",
    },
    {
      id: "tiramisu-noir",
      name: "Tiramisu Noir",
      desc: "Espresso-soaked savoiardi, mascarpone cloud, cocoa soil.",
      price: 340,
      tags: ["Espresso-soaked", "Chilled"],
      image: IMG.dessert.cheesecakeBerry,
      alt: "Cheesecake and chocolate mousse desserts on parchment",
    },
    {
      id: "banana-bread",
      name: "Toasted Walnut Banana Bread",
      desc: "Griddled banana loaf, espresso butter. Contains nuts.",
      price: 220,
      tags: ["Contains nuts", "Griddled"],
      image: IMG.people.pastryFriends,
      alt: "Friends sharing pastry and coffee at a café table",
    },
  ],
};

export const MENU_NOTE =
  "Sample menu — all items, descriptions and INR prices are editable demonstration content.";
