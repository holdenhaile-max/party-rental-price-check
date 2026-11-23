import { checkedSpan, money } from "./format.ts";
import { filterPrices } from "./filter.mjs";
import { sortByPrice } from "./sort-keys.mjs";

/** Standard bounce houses are the priced "bounce house" rows. Combos and slides stay out. */
export const cheapestBounceQuery = {
  categories: ["bounce house"],
  status: "priced",
};

/**
 * @param {Array<Record<string, any>>} prices
 * @param {Array<{ name: string, serves?: string[] }>} companies
 */
export function standardBounceHouses(prices, companies) {
  return sortByPrice(filterPrices(prices, companies, cheapestBounceQuery));
}

/** Distinct prices, lowest first. Companies stay in first-seen order within a price. */
export function priceTiers(rows) {
  /** @type {Array<{ price: number, companies: string[] }>} */
  const tiers = [];
  for (const row of rows) {
    let tier = tiers.find((item) => item.price === row.price);
    if (!tier) {
      tier = { price: row.price, companies: [] };
      tiers.push(tier);
    }
    if (!tier.companies.includes(row.company)) tier.companies.push(row.company);
  }
  return tiers;
}

/** @param {string[]} names */
export function nameList(names) {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/** @param {Array<{ price: number, companies: string[] }>} tiers */
export function tierPhrase(tiers) {
  return nameList(tiers.map((tier) => `${money(tier.price)} from ${nameList(tier.companies)}`));
}

/**
 * Companies on these rows whose recorded service area does not include the city.
 * @param {Array<{ company: string }>} rows
 * @param {Array<{ name: string, serves?: string[] }>} companies
 * @param {string} city
 */
export function companiesMissingCity(rows, companies, city) {
  /** @type {string[]} */
  const names = [];
  for (const row of rows) {
    if (!names.includes(row.company)) names.push(row.company);
  }
  return names.filter((name) => {
    const company = companies.find((entry) => entry.name === name);
    return !company?.serves?.includes(city);
  });
}

/**
 * Page copy is built from the catalog so a later price edit updates the sentences.
 * @param {{ prices: Array<Record<string, any>>, companies: Array<{ name: string, serves?: string[] }> }} catalog
 */
export function buildCheapestBouncePage(catalog) {
  const rows = standardBounceHouses(catalog.prices, catalog.companies);
  const top = priceTiers(rows).slice(0, 3);
  if (top.length === 0) {
    throw new Error("No priced bounce houses to build the cheapest page.");
  }
  const span = checkedSpan(rows.map((row) => row.checkedDate));
  const missingBryan = companiesMissingCity(rows, catalog.companies, "bryan");
  const bryanSentence = missingBryan.length
    ? `${nameList(missingBryan)} ${missingBryan.length === 1 ? "does" : "do"} not name Bryan in the service area recorded here. The other companies in this table name both Bryan and College Station.`
    : "Every company in this table names both Bryan and College Station.";
  const lowestAnswer =
    top.length > 1
      ? `The lowest published price is ${tierPhrase(top.slice(0, 1))}. Next ${top.length > 2 ? "are" : "is"} ${tierPhrase(top.slice(1))}.`
      : `The lowest published price is ${tierPhrase(top)}.`;

  return {
    slug: "cheapest-backyard-birthday-bounce-house",
    kind: "prices",
    nav: "Cheapest bounce house",
    title: "Cheapest backyard birthday bounce house",
    description: `Standard bounce house prices for a backyard birthday in College Station and Bryan, sorted with the lowest price first. Delivery fees and tax are extra where stated. Checked ${span}.`,
    eyebrow: "College Station and Bryan",
    h1: "Cheapest backyard birthday bounce house",
    lede: `Classic bounce houses for a backyard birthday in College Station and Bryan, with no slide attached. The lowest published prices are ${tierPhrase(top)}.`,
    tableCaption: "Cheapest standard bounce house prices",
    categories: cheapestBounceQuery.categories,
    status: cheapestBounceQuery.status,
    after: `Delivery fees and tax are extra where a company states them. The delivery column is that company's own note. This page does not add a fee or a tax the company page did not list. ${bryanSentence} Confirm delivery before you book.`,
    faqs: [
      {
        question: "What is the lowest price?",
        answer: lowestAnswer,
      },
      {
        question: "Are delivery fees and tax included?",
        answer:
          "Delivery fees and tax are extra where a company states them. Read the delivery column on the row. If the company page does not state a fee or a tax, this page does not fill one in.",
      },
      {
        question: "Are bounce houses with a slide included?",
        answer:
          "No. This page is standard bounce houses only, with no slide attached. Combos and water slides are not in this table.",
        href: "/water-slides",
        linkLabel: "Water slide and wet inflatable prices",
      },
      {
        question: "Why does one bounce house have more than one row?",
        answer:
          "The company listed more than one rental length. Each length has its own price. Read the rental window before you compare two rows.",
      },
      {
        question: "Do all of these companies deliver in Bryan?",
        answer: `${bryanSentence} Confirm the city and any delivery fee with the company before you book.`,
        href: "/bounce-houses-bryan",
        linkLabel: "Bounce house prices in Bryan",
      },
    ],
  };
}
