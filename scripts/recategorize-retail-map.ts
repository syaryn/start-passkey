import type { CategorySlug } from "../apps/website/src/data/categories.ts";

/** Primary category for entries currently listed under 通販 (retail). */
const TO_CATEGORY: Record<string, CategorySlug> = {};

function add(category: CategorySlug, ids: string[]) {
  for (const id of ids) {
    TO_CATEGORY[id] = category;
  }
}

add("marketplace", [
  "amazon",
  "ebay",
  "etsy",
  "aliexpress",
  "temu",
  "mercari",
  "minne",
  "creema",
  "buyma",
  "qoo10",
  "walmart",
  "target",
  "super-delivery",
  "snkrdunk",
  "cardrush",
  "digimart",
  "groupon",
]);

add("food", [
  "dominos",
  "kfc",
  "oisix",
  "coopdeli",
  "life",
  "maruetsu",
  "yaoko",
  "ok-store",
  "kaldi",
  "radish-boya",
  "costco",
  "aeon-shop",
  "iaeon",
  "ministop",
]);

add("points", ["kakakucom-id", "h2o-id", "ritto-id"]);

add("lifestyle", ["furunavi", "satofull"]);

add("developer", ["shopify", "amazon-seller-central"]);

add("fashion", [
  "adidas",
  "asos",
  "baycrews",
  "grl",
  "h-and-m",
  "jins",
  "magaseek",
  "nike",
  "pal-closet",
  "parco",
  "wear",
  "zara",
  "zoff",
  "zozo",
  "alpen-group",
  "onward-closet",
  "onward-members",
  "shimamura",
  "do-classe",
  "dot-st",
  "felissimo",
  "honeys",
  "beams",
  "belluna",
  "bellemaison",
  "locondo",
  "workman",
  "montbell",
  "united-arrows",
  "uniqlo",
  "wacoal",
  "world",
  "world-premium-club",
  "meganeichiba",
  "nissen",
]);

add("electronics", [
  "asus",
  "lenovo",
  "logitech",
  "msi",
  "club-panasonic",
  "canon",
  "ks-denki",
  "joshin",
  "edion",
  "pc-koubou",
  "mapcamera",
  "janpara",
  "hardoff",
  "dell",
  "biccamera",
  "yamada-denki",
  "japanet",
  "yodobashi",
]);

add("hobby", [
  "animate",
  "toranoana",
  "melonbooks",
  "mandarake",
  "premium-bandai",
  "pokemon-center",
  "chiikawa-market",
  "bookoff",
  "hareruya",
  "second-street",
  "sanrio",
  "sanrio-plus",
  "cotta",
  "tower-records",
]);

add("beauty", ["cosme", "dhc", "kose", "fancl", "orbis", "watashi-plus", "rohto"]);

add("home", ["ikea", "nitori", "muji", "cainz", "kohnan-eshop", "daiso", "dinos", "autobacs"]);

add("department", [
  "takashimaya",
  "mitsukoshi-isetan",
  "sogo-seibu",
  "daimaru-matsuzakaya",
  "kintetsu-dept",
  "mitsui-shopping-park",
  "marui",
  "famikura-store",
]);

/** Stays 通販 */
add("retail", [
  "askul",
  "monotaro",
  "qvc",
  "shopchannel",
  "matsukiyococokara",
  "nishimatsuya",
  "akachan-honpo",
  "stripe-club",
  "7id",
]);

/** Entertainment-primary (drop retail) */
export const RETAIL_TO_ENTERTAINMENT = ["discogs", "dlsite", "geo-id", "hmv"] as const;

export const RETAIL_TO_ELECTRONICS_ENTERTAINMENT = ["my-sony"] as const;

export function categoriesForRetailEntry(entryId: string): CategorySlug[] | null {
  if ((RETAIL_TO_ENTERTAINMENT as readonly string[]).includes(entryId)) {
    return ["entertainment"];
  }
  if ((RETAIL_TO_ELECTRONICS_ENTERTAINMENT as readonly string[]).includes(entryId)) {
    return ["electronics", "entertainment"];
  }
  const mapped = TO_CATEGORY[entryId];
  if (mapped) {
    return [mapped];
  }
  return null;
}

export { TO_CATEGORY as RETAIL_RECATEGORY_MAP };
