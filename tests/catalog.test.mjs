import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseCsv } from "../src/lib/csv.mjs";
import { filterPrices, unverifiedPrices } from "../src/lib/filter.mjs";
import { pageHref } from "../src/lib/trailing-slash.mjs";
import { comingSoon, pages } from "../src/data/pages.mjs";

const catalog = JSON.parse(readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"));
const csv = parseCsv(readFileSync(new URL("../data/prices-2026-11-19.csv", import.meta.url), "utf8"));

test("catalog prices match the collected CSV", () => {
  assert.equal(catalog.prices.length, 294);
  assert.equal(csv.length, 294);
  catalog.prices.forEach((row, index) => {
    const source = csv[index];
    assert.equal(row.company, source.company);
    assert.equal(row.item, source.item_name);
    assert.equal(row.category, source.category);
    assert.equal(row.size, source.size.trim());
    assert.equal(row.rentalWindow, source.rental_window.trim());
    assert.equal(row.feeNotes, source.fee_notes.trim());
    assert.equal(row.sourceUrl, source.source_url.trim());
    assert.equal(row.checkedDate, source.checked_date.trim());
    assert.equal(row.status, source.status);
    if (source.status === "unverified") {
      assert.equal(row.price, null);
      assert.equal(source.price.trim(), "");
    } else {
      assert.equal(row.price, Number(source.price));
      assert.ok(row.price > 0);
    }
  });
});

test("launch pages keep the collected row counts", () => {
  const counts = Object.fromEntries(
    pages
      .filter((page) => page.kind === "prices")
      .map((page) => [
        page.slug,
        filterPrices(catalog.prices, catalog.companies, {
          categories: page.categories,
          city: page.city,
          companies: page.companies,
        }).length,
      ]),
  );
  assert.deepEqual(counts, {
    "bounce-houses-college-station": 48,
    "bounce-houses-bryan": 42,
    "water-slides": 51,
    "graduation-party-rentals": 8,
  });
});

test("Bryan bounce houses leave off the company that does not name Bryan", () => {
  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: ["bounce house"],
    city: "bryan",
  });
  assert.equal(rows.some((row) => row.company === "Bounce House Rentals BCS LLC"), false);
  const collegeStation = filterPrices(catalog.prices, catalog.companies, {
    categories: ["bounce house"],
    city: "college-station",
  });
  assert.equal(collegeStation.some((row) => row.company === "Bounce House Rentals BCS LLC"), true);
});

test("unverified rows are the three item pages with no price", () => {
  const rows = unverifiedPrices(catalog.prices);
  assert.deepEqual(
    rows.map((row) => row.item).sort(),
    ["High Density Fog", "Large Event Foam Experiences", "Toddler Play Zone Dry"],
  );
});

const recheckedRows = [
  { company: "Mission Inflatables", item: "Chairs", price: 2.5, rentalWindow: "all day (listing 'from' price; sampled product pages show the same amount from 1 hour through per day)" },
  { company: "Mission Inflatables", item: "TENT 10 x 10", price: 225 },
  { company: "Mission Inflatables", item: "20x40 Tent", price: 650 },
  { company: "Mission Inflatables", item: "6' Tables", price: 14 },
  { company: "Mission Inflatables", item: "8' Table", price: 16 },
  { company: "Koozie's Premier Party Rentals", item: "Canopy", price: 50 },
  { company: "Jump Around BCS", item: "6ft Tables", price: 12 },
  { company: "Jump Around BCS", item: "Chairs", price: 2 },
  { company: "The Backyard Jump", item: "Marble Rush Bounce House", price: 150 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Bouncer XL", price: 165, rentalWindow: "1-4 hr" },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Bouncer XL", price: 215, rentalWindow: "5-16 hr / per day" },
];

function samePrice(row, expected) {
  return (
    row.company === expected.company &&
    row.item === expected.item &&
    row.price === expected.price &&
    (expected.rentalWindow == null || row.rentalWindow === expected.rentalWindow)
  );
}

test("rechecked rows keep their prices and use 2026-11-20", () => {
  assert.equal(recheckedRows.length, 11);
  for (const expected of recheckedRows) {
    const catalogMatches = catalog.prices.filter((row) => samePrice(row, expected));
    assert.equal(catalogMatches.length, 1, `${expected.company} ${expected.item} ${expected.price}`);
    assert.equal(catalogMatches[0].checkedDate, "2026-11-20");
    const csvMatches = csv.filter((row) => {
      const price = row.status === "unverified" || row.price.trim() === "" ? null : Number(row.price);
      return samePrice(
        {
          company: row.company,
          item: row.item_name,
          price,
          rentalWindow: row.rental_window.trim(),
        },
        expected,
      );
    });
    assert.equal(csvMatches.length, 1, `csv ${expected.company} ${expected.item}`);
    assert.equal(csvMatches[0].checked_date.trim(), "2026-11-20");
  }

  const touched = catalog.prices.filter((row) =>
    recheckedRows.some((expected) => samePrice(row, expected)),
  );
  assert.equal(touched.length, 11);
  const others = catalog.prices.filter((row) => !touched.includes(row));
  assert.equal(others.length, 283);
  assert.ok(others.every((row) => row.checkedDate === "2026-11-19"));
});

test("company filter drops Bounce House Rentals BCS LLC from tent, table, and chair rows", () => {
  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: ["tent", "table", "chair"],
    companies: ["Mission Inflatables", "Koozie's Premier Party Rentals", "Jump Around BCS"],
  });
  assert.deepEqual(
    [...new Set(rows.map((row) => row.company))].sort(),
    ["Jump Around BCS", "Koozie's Premier Party Rentals", "Mission Inflatables"],
  );
  assert.equal(rows.length, 8);
  assert.equal(rows.every((row) => row.checkedDate === "2026-11-20"), true);
  assert.equal(rows.every((row) => row.sourceUrl.startsWith("https://")), true);
});

test("graduation page lists published tent, table, and chair prices", () => {
  const page = pages.find((entry) => entry.slug === "graduation-party-rentals");
  assert.ok(page);
  assert.equal(page.kind, "prices");
  assert.equal(page.nav, "Graduation");
  assert.equal(page.title, "Graduation party rental prices");
  assert.equal(page.h1, "Graduation party rental prices");
  assert.ok(page.description);
  assert.ok(page.lede);
  assert.ok(page.after);
  assert.ok(Array.isArray(page.faqs) && page.faqs.length >= 3);
  assert.deepEqual(page.categories, ["tent", "table", "chair"]);
  assert.deepEqual(page.companies, [
    "Mission Inflatables",
    "Koozie's Premier Party Rentals",
    "Jump Around BCS",
  ]);
  assert.equal(page.city, undefined);

  const blob = [
    page.description,
    page.lede,
    page.after,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
  for (const phrase of [
    "10x10 tent at $225 per day",
    "20x40 tent at $650 per day",
    "6' table at $14 per day",
    "8' table at $16 per day",
    "chair at $2.50 per day",
    "10x10 canopy at $50",
    "rental window is not stated",
    "6ft table at $12",
    "chair at $2 for the standard 4 hour rental",
    "sales tax",
    "$50 deposit",
    "calculated at checkout",
    "not computed or estimated",
    "Nov 20, 2026",
    "anchoring",
  ]) {
    assert.equal(blob.includes(phrase), true, phrase);
  }
  assert.equal(blob.includes("\u2014"), false);
  assert.equal(blob.includes("\u2013"), false);
  assert.equal(/Aggie/i.test(blob), false);
  assert.equal(comingSoon.includes("Graduation party rental prices"), false);

  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: page.categories,
    companies: page.companies,
  });
  assert.equal(rows.length, 8);
  assert.deepEqual(
    rows.map((row) => [row.company, row.item, row.price]).sort(),
    [
      ["Jump Around BCS", "6ft Tables", 12],
      ["Jump Around BCS", "Chairs", 2],
      ["Koozie's Premier Party Rentals", "Canopy", 50],
      ["Mission Inflatables", "20x40 Tent", 650],
      ["Mission Inflatables", "6' Tables", 14],
      ["Mission Inflatables", "8' Table", 16],
      ["Mission Inflatables", "Chairs", 2.5],
      ["Mission Inflatables", "TENT 10 x 10", 225],
    ].sort(),
  );
});

test("price page descriptions match the checked dates on their rows", () => {
  for (const page of pages.filter((entry) => entry.kind === "prices")) {
    const rows = filterPrices(catalog.prices, catalog.companies, {
      categories: page.categories,
      city: page.city,
      companies: page.companies,
    });
    const dates = [...new Set(rows.map((row) => row.checkedDate))].sort();
    if (dates.length === 1) {
      const label = dates[0] === "2026-11-20" ? "Nov 20, 2026" : "Nov 19, 2026";
      assert.equal(page.description.includes(label), true, page.slug);
      assert.equal(page.description.includes("Nov 19 to Nov 20"), false, page.slug);
    } else {
      assert.equal(page.description.includes("Nov 19 to Nov 20, 2026"), true, page.slug);
    }
  }
});

test("site copy does not claim every price was read only on Nov 19", () => {
  const home = readFileSync(new URL("../src/pages/index.astro", import.meta.url), "utf8");
  const about = readFileSync(new URL("../src/pages/about.astro", import.meta.url), "utf8");
  const readme = readFileSync(new URL("../README.md", import.meta.url), "utf8");
  const notes = readFileSync(new URL("../data/notes.md", import.meta.url), "utf8");
  for (const [name, text] of [
    ["home", home],
    ["about", about],
    ["readme", readme],
    ["notes", notes],
  ]) {
    assert.equal(text.includes("read on Nov 19, 2026"), false, name);
    assert.equal(text.includes("\u2014"), false, name);
    assert.equal(text.includes("\u2013"), false, name);
  }
  assert.equal(home.includes("Nov 19 to Nov 20, 2026"), true);
  assert.equal(about.includes("Nov 19 to Nov 20, 2026"), true);
  assert.equal(readme.includes("Nov 19 to Nov 20, 2026"), true);
  assert.equal(readme.includes("Graduation party rental prices"), true);
  assert.equal(/Coming soon[\s\S]*graduation party rentals/i.test(readme), false);
  assert.equal(notes.includes("2026-11-20"), true);
  assert.equal(notes.includes("prices-2026-11-19.csv"), true);
  assert.equal(home.includes("Graduation party rentals, tents"), false);
});

test("internal links keep the GitHub Pages base path", () => {
  const base = "/party-rental-price-check";
  assert.equal(pageHref("/", base), "/party-rental-price-check/");
  assert.equal(pageHref("/about", base), "/party-rental-price-check/about/");
  assert.equal(
    pageHref("/whats-included/#the-backyard-jump", base),
    "/party-rental-price-check/whats-included/#the-backyard-jump",
  );
  assert.equal(pageHref("/logo.svg", base), "/party-rental-price-check/logo.svg");
  assert.equal(pageHref("https://example.com/price", base), "https://example.com/price");
});
