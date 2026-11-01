import type { CategorySlug } from "../apps/website/src/data/categories.ts";

const TO_CATEGORY: Record<string, CategorySlug> = {};

function add(category: CategorySlug, ids: string[]) {
  for (const id of ids) {
    TO_CATEGORY[id] = category;
  }
}

add("travel", [
  "agoda",
  "airbnb",
  "airtrip",
  "club-tourism",
  "expedia",
  "his",
  "hoshino-resorts",
  "hotels-com",
  "ikkyu",
  "jtb",
  "kayak",
  "rurubu-travel",
  "skyscanner",
  "skyticket",
  "trip-com",
  "tripadvisor",
  "willer",
  "yuko-yuko",
  "apa-hotel",
  "route-inn",
  "super-hotel",
  "toyoko-inn",
  "ooedo-onsen",
  "hankyu-travel",
  "hh-cross-id",
]);

add("aviation", [
  "airdo",
  "ana-mileage-club",
  "jetstar",
  "jal-mileage-bank",
  "peach",
  "skymark",
  "solaseed",
  "spring-japan",
  "starflyer",
  "flying-blue",
  "lufthansa",
  "fda",
]);

add("rail", [
  "ekinet",
  "jr-kyushu",
  "jre-id",
  "wester-id",
  "keio",
  "odakyu",
  "meitetsu",
  "kintetsu",
  "hankyu",
  "keihan",
]);

add("bus", ["bus-catch", "kosoku-bus"]);

add("mobility", ["uber", "lyft", "times-carshare"]);

add("car-rental", ["nippon-rentacar", "orix-rentacar"]);

add("automotive", ["bmw", "ford", "mercedes-benz", "my-toyota", "nissan", "tesla", "rivian"]);

add("logistics", ["sagawa", "kuroneko-members"]);

/** 道路・航路・ナビなど */
add("transport", ["etc-meisai", "ferry-sunflower", "navitime", "flightradar24"]);

export function categoriesForTransportEntry(entryId: string): CategorySlug[] | null {
  const mapped = TO_CATEGORY[entryId];
  if (mapped) {
    return [mapped];
  }
  return null;
}

export { TO_CATEGORY as TRANSPORT_RECATEGORY_MAP };
