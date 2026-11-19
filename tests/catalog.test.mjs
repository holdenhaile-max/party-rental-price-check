import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseCsv } from "../src/lib/csv.mjs";
import { filterPrices, unverifiedPrices } from "../src/lib/filter.mjs";
import { pageHref } from "../src/lib/trailing-slash.mjs";
import { pages } from "../src/data/pages.mjs";

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
    assert.equal(row.checkedDate, "2026-11-19");
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
        }).length,
      ]),
  );
  assert.deepEqual(counts, {
    "bounce-houses-college-station": 48,
    "bounce-houses-bryan": 42,
    "water-slides": 51,
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
