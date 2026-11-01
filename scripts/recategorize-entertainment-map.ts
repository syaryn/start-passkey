import type { CategorySlug } from "../apps/website/src/data/categories.ts";

const TO_CATEGORY: Record<string, CategorySlug> = {};

function add(category: CategorySlug, ids: string[]) {
  for (const id of ids) {
    TO_CATEGORY[id] = category;
  }
}

add("streaming", [
  "netflix",
  "hulu",
  "unext",
  "dazn",
  "fod",
  "wowow",
  "nhk-plus",
  "tver",
  "paramount-plus",
  "peacock",
  "abema",
  "danime-store",
  "bilibili",
  "twitch",
  "niconico",
  "vimeo",
  "filmarks",
  "letterboxd",
]);

add("music", [
  "spotify",
  "awa",
  "soundcloud",
  "recochoku",
  "bandcamp",
  "radiko",
  "joysound",
  "club-dam",
]);

add("cinema", [
  "109cinemas",
  "aeon-cinema",
  "smt-cinema",
  "tjoy",
  "toho-cinemas",
  "united-cinemas",
]);

add("tickets", [
  "eplus",
  "lawson-ticket",
  "ticket-pia",
  "livepocket",
  "ticket-board",
  "tixplus",
  "stubhub",
  "eventbrite",
  "jleague-ticket",
  "cn-playguide",
  "ticketjam",
]);

add("media", ["asahi", "mainichi", "sankei", "yomiuri", "nikkei", "chunichi"]);

add("gambling", ["jra", "boat-race", "takarakuji", "k-dreams"]);

add("travel", ["asoview", "tokyo-disney-resort", "ozmall"]);

add("hobby", [
  "discogs",
  "dlsite",
  "geo-id",
  "hmv",
  "goodreads",
  "booklive",
  "honto",
  "piccoma",
  "webtoon",
  "syosetu",
  "renta",
  "mechacomic",
  "comic-festa",
  "comic-cmoa",
  "ibispaint",
  "takakore",
]);

add("gaming", ["dmm"]);

add("education", ["scratch"]);

add("social", [
  "twitcasting",
  "showroom",
  "medium",
  "substack",
  "patreon",
  "myfans",
  "fantia",
  "ci-en",
]);

add("points", ["anycolor-id", "family-club", "vivion-id"]);

add("lifestyle", ["kaikatsu-club", "yelp", "lawson-web-member", "hawks-member"]);

add("fitness", ["alltrails"]);

export function categoriesForEntertainmentEntry(entryId: string): CategorySlug[] | null {
  const mapped = TO_CATEGORY[entryId];
  if (mapped) {
    return [mapped];
  }
  return null;
}

export { TO_CATEGORY as ENTERTAINMENT_RECATEGORY_MAP };
