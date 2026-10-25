/**
 * NOIR CAFÉ — central editable site configuration.
 * Everything here is demonstration content; replace with the café's real
 * details before launch. No real address, phone number or social account
 * is attached to this demo.
 */

export const SITE = {
  name: "NOIR CAFÉ",
  tagline: "Coffee, beyond the ordinary.",
  // Demo domain used for canonical / OG / sitemap. Replace before launch.
  domain: "https://www.noircafe.com",
  // Sample contact details (editable placeholder content — not a real business)
  email: "hello@noircafe.example",
  addressLines: ["No. 12, Roastworks Lane", "Replace with your street, city", "PIN 000000"],
  hours: [
    { days: "Monday — Friday", time: "07:30 — 22:00" },
    { days: "Saturday — Sunday", time: "08:00 — 23:00" },
    { days: "Public holidays", time: "09:00 — 21:00" },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/" },
    { label: "Facebook", href: "https://www.facebook.com/" },
    { label: "Spotify", href: "https://www.spotify.com/" },
  ],
};

/** Photography registry — demo imagery, replaceable with client photographs. */
export const IMG = {
  coffeeDark: {
    pourSteam:
      "https://images.pexels.com/photos/1235706/pexels-photo-1235706.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    rusticMug:
      "https://images.pexels.com/photos/33889175/pexels-photo-33889175.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    mokaPour:
      "https://images.pexels.com/photos/40175055/pexels-photo-40175055.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    cappuccinoBeans:
      "https://images.pexels.com/photos/5112642/pexels-photo-5112642.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    espressoMaker:
      "https://images.pexels.com/photos/40175058/pexels-photo-40175058.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    blackCupSteam:
      "https://images.pexels.com/photos/40175047/pexels-photo-40175047.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    espressoSaucer:
      "https://images.pexels.com/photos/27469108/pexels-photo-27469108.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    grinderCup:
      "https://images.pexels.com/photos/9980073/pexels-photo-9980073.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  interior: {
    wovenChairs:
      "https://images.pexels.com/photos/40404581/pexels-photo-40404581.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    chairShadow:
      "https://images.pexels.com/photos/9419359/pexels-photo-9419359.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    industrialWide:
      "https://images.pexels.com/photos/30405795/pexels-photo-30405795.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    colourfulChairs:
      "https://images.pexels.com/photos/38062747/pexels-photo-38062747.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    counterBarista:
      "https://images.pexels.com/photos/11439363/pexels-photo-11439363.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    rusticTable:
      "https://images.pexels.com/photos/37655741/pexels-photo-37655741.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    barCounter:
      "https://images.pexels.com/photos/5491052/pexels-photo-5491052.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    cafeTableCard:
      "https://images.pexels.com/photos/36964525/pexels-photo-36964525.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  barista: {
    pourWide:
      "https://images.pexels.com/photos/4927237/pexels-photo-4927237.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    milkHands:
      "https://images.pexels.com/photos/16541078/pexels-photo-16541078.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    latteClose:
      "https://images.pexels.com/photos/302891/pexels-photo-302891.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    streamPitcher:
      "https://images.pexels.com/photos/32590864/pexels-photo-32590864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    crafting:
      "https://images.pexels.com/photos/35667656/pexels-photo-35667656.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    latteCup:
      "https://images.pexels.com/photos/769275/pexels-photo-769275.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  bakery: {
    boardCroissants:
      "https://images.pexels.com/photos/32413997/pexels-photo-32413997.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    flourCroissants:
      "https://images.pexels.com/photos/7440422/pexels-photo-7440422.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    clothCroissants:
      "https://images.pexels.com/photos/3850376/pexels-photo-3850376.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    rawDough:
      "https://images.pexels.com/photos/38594735/pexels-photo-38594735.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    honeyBoard:
      "https://images.pexels.com/photos/14622254/pexels-photo-14622254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    chocoCroissant:
      "https://images.pexels.com/photos/8023959/pexels-photo-8023959.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  cold: {
    outdoorIced:
      "https://images.pexels.com/photos/37043176/pexels-photo-37043176.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    counterIced:
      "https://images.pexels.com/photos/28901490/pexels-photo-28901490.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    plantIced:
      "https://images.pexels.com/photos/27584867/pexels-photo-27584867.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    coasterIced:
      "https://images.pexels.com/photos/17298820/pexels-photo-17298820.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    beansColdBrew:
      "https://images.pexels.com/photos/33241858/pexels-photo-33241858.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    strawIced:
      "https://images.pexels.com/photos/38719182/pexels-photo-38719182.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  beans: {
    counterBeans:
      "https://images.pexels.com/photos/16682442/pexels-photo-16682442.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    darkBeans:
      "https://images.pexels.com/photos/19162213/pexels-photo-19162213.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    focusBeans:
      "https://images.pexels.com/photos/30444143/pexels-photo-30444143.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    monoBeans:
      "https://images.pexels.com/photos/6800766/pexels-photo-6800766.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    macroBeans:
      "https://images.pexels.com/photos/34258683/pexels-photo-34258683.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  dessert: {
    teaCamera:
      "https://images.pexels.com/photos/15028373/pexels-photo-15028373.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    chocoSlice:
      "https://images.pexels.com/photos/15911843/pexels-photo-15911843.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    marbleTable:
      "https://images.pexels.com/photos/15028377/pexels-photo-15028377.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    cheesecakeBerry:
      "https://images.pexels.com/photos/34664648/pexels-photo-34664648.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    feast:
      "https://images.pexels.com/photos/15028374/pexels-photo-15028374.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    cupcakes:
      "https://images.pexels.com/photos/1028714/pexels-photo-1028714.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  matcha: {
    rusticMatcha:
      "https://images.pexels.com/photos/911810/pexels-photo-911810.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    blueCup:
      "https://images.pexels.com/photos/38737533/pexels-photo-38737533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    handMatcha:
      "https://images.pexels.com/photos/8004603/pexels-photo-8004603.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    heartFoam:
      "https://images.pexels.com/photos/17366787/pexels-photo-17366787.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  people: {
    icedChat:
      "https://images.pexels.com/photos/9789454/pexels-photo-9789454.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    colleagues:
      "https://images.pexels.com/photos/4921085/pexels-photo-4921085.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    laughter:
      "https://images.pexels.com/photos/5047021/pexels-photo-5047021.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    pastryFriends:
      "https://images.pexels.com/photos/2040740/pexels-photo-2040740.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
};

export const ROUTES = [
  { path: "/", label: "Home" },
  { path: "/menu", label: "Menu" },
  { path: "/coffee-lab", label: "Coffee Lab" },
  { path: "/our-story", label: "Our Story" },
  { path: "/experience", label: "Experience" },
  { path: "/visit", label: "Visit" },
];
