import type { MenuItem } from "../lib/cart";

/** Local file in `public/menu/` — encodes spaces for URLs */
export function menuImage(filename: string) {
  return `/menu/${encodeURIComponent(filename)}`;
}

/** Phone-sized WebP. Wider screens keep the original image. */
export function menuImageMobile(src: string) {
  if (src.startsWith("/menu/")) {
    const filename = decodeURIComponent(src.slice("/menu/".length));
    const webpName = filename.replace(/\.[^.]+$/i, ".webp");
    return `/menu/sm/${encodeURIComponent(webpName)}`;
  }

  try {
    const url = new URL(src);
    if (url.hostname === "images.unsplash.com") {
      url.searchParams.set("fm", "webp");
      url.searchParams.set("w", "480");
      url.searchParams.set("q", "70");
      return url.toString();
    }
  } catch {
    return src;
  }

  return src;
}

export const menuItems: MenuItem[] = [
  { id: 1, name: "Boneless Brisket", category: "Beef", price: "R165", weight: "1kg", image: menuImage("Boneless Brisket.png") },
  { id: 2, name: "Flat Rib", category: "Beef", price: "R175", weight: "1kg", image: menuImage("Flat Rib.png") },
  { id: 3, name: "Rump", category: "Beef", price: "R255", weight: "1kg", image: menuImage("Tender Rump 1.png") },
  { id: 4, name: "Rump Marinated", category: "Beef", price: "R255", weight: "1kg", image: menuImage("Rump Marinated.png") },
  { id: 13, name: "Rump Roast", category: "Beef", price: "R255", weight: "1kg", image: menuImage("Whole Rump Roast 1.png") },
  { id: 5, name: "Rump Espetada", category: "Beef", price: "R255", weight: "1kg", image: menuImage("Striploin Espetada.png") },
  { id: 6, name: "Striploin", category: "Beef", price: "R275", weight: "1kg", image: menuImage("Striploin 3.png") },
  { id: 7, name: "Striploin Marinated", category: "Beef", price: "R275", weight: "1kg", image: menuImage("Striploin Marinated.png") },
  { id: 8, name: "Prego Steaks", category: "Beef", price: "R265", weight: "1kg", image: menuImage("Minute Rump Steaks 3.png") },
  { id: 9, name: "Prego Steaks Marinated", category: "Beef", price: "R265", weight: "1kg", image: menuImage("Minute Steaks Marinated.png") },
  { id: 12, name: "Tenderloin", category: "Beef", price: "R275", weight: "1kg", image: menuImage("Tenderloin Plankies 1.png") },
  { id: 15, name: "Goulash", category: "Beef", price: "R199", weight: "1kg", image: menuImage("Flavoursome Goulash 3.png") },
  { id: 16, name: "Oxtail", category: "Beef", price: "R175", weight: "1kg", image: menuImage("Oxtail 1.png") },
  { id: 17, name: "Beef Hamburger Patties", category: "Beef", price: "R105", weight: "560g", image: menuImage("Patties 1.png") },
  { id: 11, name: "Mince", category: "Beef", price: "R149", weight: "1kg", image: menuImage("Mince.png") },
  { id: 19, name: "Chicken Drums & Thighs", category: "Chicken", price: "R105", weight: "1kg", image: menuImage("Chicken Thighs and Drum Sticks 1.png") },
  { id: 20, name: "Chicken Wings", category: "Chicken", price: "R109", weight: "1kg", image: menuImage("Chicken Wings 1.png") },
  { id: 21, name: "Chicken Fillets", category: "Chicken", price: "R109", weight: "1kg", image: menuImage("Chicken Fillets 1.png") },
  { id: 22, name: "Deboned Chicken", category: "Chicken", price: "R109", weight: "1kg", image: menuImage("Deboned Chicken 1.png") },
  { id: 23, name: "Chicken Flatty", category: "Chicken", price: "R89", weight: "1kg", image: menuImage("Barbeque Flatty 1.png") },
  { id: 24, name: "Whole Chicken", category: "Chicken", price: "R69", weight: "1kg", image: menuImage("Whole Braai Chicken 1.png") },
  { id: 25, name: "Chicken Espetada", category: "Chicken", price: "R139", weight: "1kg", image: menuImage("Deboned Chicken Thigh Espetadas 1.png") },
  { id: 26, name: "Chicken Kebabs", category: "Chicken", price: "R109", weight: "1kg", image: menuImage("Marinated  Chicken Kebabs 1.png") },
  { id: 27, name: "Chicken Schnitzel", category: "Chicken", price: "R160", weight: "1kg", image: menuImage("Crumbed Chicken Schnitzel 1.png") },
  { id: 28, name: "Chicken Nuggets", category: "Chicken", price: "R83", weight: "500g", image: menuImage("Crumbed Chicken Nuggets 1.png") },
  { id: 29, name: "Chicken Patties", category: "Chicken", price: "R79", weight: "500g", image: menuImage("Crumbed Chicken Patties 1.png") },
  { id: 30, name: "Pork Pepper Pie (Frozen)", category: "Pork", price: "R160", weight: "800g", image: menuImage("Pork Pepper Pie 1.png") },
  { id: 31, name: "Smoked Pork Neck", category: "Pork", price: "R169", weight: "1kg", image: menuImage("Smoked Pork Neck 1.png") },
  { id: 32, name: "Pork Fillet Creamy Pepper", category: "Pork", price: "R169", weight: "1kg", image: menuImage("Creamy Pepper Pork Fillet 1.png") },
  { id: 33, name: "Pork Espetada", category: "Pork", price: "R170", weight: "1kg", image: menuImage("Pork Espetada 1.png") },
  { id: 34, name: "Pork Belly", category: "Pork", price: "R160", weight: "1kg", image: menuImage("Pork Belly Roast 1.png") },
  { id: 35, name: "Pork Loin Bone-in Roast", category: "Pork", price: "R149", weight: "1kg", image: menuImage("Pork Loin Bone-in 1.png") },
  { id: 36, name: "Pork Prego", category: "Pork", price: "R175", weight: "1kg", image: menuImage("Marinated Prok Prego Steaks 1.png") },
  { id: 37, name: "Pork T-bone", category: "Pork", price: "R146", weight: "750g", image: menuImage("MArinated Prok T-Bone Steak 1.png") },
  { id: 38, name: "Loin Ribs BBQ", category: "Pork", price: "R185", weight: "750g", image: menuImage("Marinated Pork Loin Ribs Pre-cooked 1.png") },
  { id: 39, name: "Rashers Honey / Prego", category: "Pork", price: "R250", weight: "1kg", image: menuImage("Honey-glazed Pork Rashers 1.png") },
  { id: 40, name: "Pork Strips", category: "Pork", price: "R95", weight: "500g", image: menuImage("Crumbed Pork Strips 1.png") },
  { id: 41, name: "Pork Fingers", category: "Pork", price: "R75", weight: "450g", image: menuImage("Crumbed Pork Strips 1.png") },
  { id: 42, name: "Cocktail Ribs", category: "Pork", price: "R165", weight: "1kg", image: menuImage("Pork Cocktail Ribs 1.png") },
  { id: 43, name: "Cheese Grillers", category: "Pork", price: "R77", weight: "400g", image: menuImage("Cocktail Cheese Grillers 1.png") },
  { id: 44, name: "Pork Meatballs", category: "Pork", price: "R79", weight: "500g", image: menuImage("Mini Prok Meatballs 1.png") },
  { id: 45, name: "Pork Schnitzel", category: "Pork", price: "R115", weight: "500g", image: menuImage("Crumbed Pork Schnitzel 1.png") },
  { id: 46, name: "Spek Wors", category: "Pork", price: "R149", weight: "1kg", image: menuImage("Spekwors 1.png") },
  { id: 47, name: "Cottage Pie", category: "Ready Meals & Prepared Food", price: "R210", weight: "1kg", image: menuImage("Cottage Pie.png") },
  { id: 48, name: "Chicken Lasagne", category: "Ready Meals & Prepared Food", price: "R210", weight: "1kg", image: menuImage("Chicken Lasagne.png") },
  { id: 49, name: "Beef Lasagne", category: "Ready Meals & Prepared Food", price: "R210", weight: "1kg", image: menuImage("Beef Lasagne.png") },
  { id: 50, name: "Mac & Cheese + Bacon", category: "Ready Meals & Prepared Food", price: "R199", weight: "1kg", image: menuImage("Mac and Cheese with Bacon.png") },
  { id: 51, name: "Buttermelt Pods", category: "Ready Meals & Prepared Food", price: "R35", weight: "120ml", image: menuImage("Betterment pods.png") },
  { id: 52, name: "Capsules", category: "Coffee Capsules & Beverages", price: "R480", weight: "1kg", image: menuImage("Tribecca Espresso Capsule.png") },
  { id: 53, name: "Freezo", category: "Coffee Capsules & Beverages", price: "R250", weight: "1kg", image: menuImage("Freezo.png") },
  { id: 54, name: "Hot Chocolate", category: "Coffee Capsules & Beverages", price: "R230", weight: "1kg", image: menuImage("Hot Chocolate.png") },
  { id: 59, name: "Bowery", category: "Coffee Capsules & Beverages", price: "R399", weight: "1kg", image: menuImage("Bowery.png") },
  { id: 56, name: "Impala", category: "Coffee Capsules & Beverages", price: "R395", weight: "1kg", image: menuImage("Impala.png") },
  { id: 57, name: "Decaf Colombian", category: "Coffee Capsules & Beverages", price: "R480", weight: "1kg", image: menuImage("Decaf-Columbian.png") },
  { id: 55, name: "Italian Espresso", category: "Coffee Capsules & Beverages", price: "R370", weight: "1kg", image: menuImage("Italian.png") },
  { id: 58, name: "Kilimanjaro", category: "Coffee Capsules & Beverages", price: "R390", weight: "1kg", image: menuImage("Kilimanjaro.png") },
  {
    id: 60,
    name: "Fruit Cake",
    category: "Cakes & Desserts",
    price: "R150",
    weight: "500g / 1kg / 1.5kg",
    image: menuImage("Fruit Cake.png"),
    weightOptions: [
      { weight: "500g", price: "R150" },
      { weight: "1kg", price: "R250" },
      { weight: "1.5kg", price: "R350" },
    ],
  },
];
