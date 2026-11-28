import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { parseCsv } from "../src/lib/csv.mjs";
import { filterPrices, unverifiedPrices } from "../src/lib/filter.mjs";
import { pageHref } from "../src/lib/trailing-slash.mjs";
import { checkedSpan } from "../src/lib/format.ts";
import { comingSoon, pages } from "../src/data/pages.mjs";

const catalog = JSON.parse(readFileSync(new URL("../src/data/catalog.json", import.meta.url), "utf8"));
const csv = parseCsv(readFileSync(new URL("../data/prices-2026-11-19.csv", import.meta.url), "utf8"));

test("catalog prices match the collected CSV", () => {
  assert.equal(catalog.prices.length, 302);
  assert.equal(csv.length, 302);
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
    if (source.price.trim() === "") {
      assert.equal(row.price, null);
      assert.equal(source.status, "unverified");
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
          status: page.status,
        }).length,
      ]),
  );
  assert.deepEqual(counts, {
    "bounce-houses-college-station": 48,
    "bounce-houses-bryan": 42,
    "cheapest-backyard-birthday-bounce-house": 48,
    "water-slides": 51,
    "graduation-party-rentals": 8,
    "tent-rentals": 3,
    "table-and-chair-rental-comparison": 15,
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

test("unverified rows are the item pages that could not be confirmed", () => {
  const rows = unverifiedPrices(catalog.prices);
  assert.deepEqual(
    rows.map((row) => row.item).sort(),
    [
      "6' White Rectangular Table",
      "Beige Folding Chairs",
      "High Density Fog",
      "Large Event Foam Experiences",
      "Mega Block Bounce House Combo",
      "Toddler Play Zone Dry",
    ],
  );
  for (const item of ["6' White Rectangular Table", "Beige Folding Chairs", "High Density Fog", "Toddler Play Zone Dry"]) {
    const row = rows.find((entry) => entry.item === item);
    assert.equal(row.price, null);
    assert.equal(row.checkedDate, "2026-11-22");
  }
  const mega = rows.find((entry) => entry.item === "Mega Block Bounce House Combo");
  assert.equal(mega.company, "Aggieland Bounce Houses & Beyond");
  assert.equal(mega.price, 350);
  assert.equal(mega.status, "unverified");
  assert.equal(mega.checkedDate, "2026-11-24");
  assert.match(mega.notes, /Page not found on 2026-11-24/);
});

const nov20Rows = [
  { company: "The Backyard Jump", item: "Marble Rush Bounce House", price: 150 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Bouncer XL", price: 165, rentalWindow: "1-4 hr" },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Bouncer XL", price: 215, rentalWindow: "5-16 hr / per day" },
];

const nov22Rows = [
  { company: "Aggieland Bounce Houses & Beyond", item: "The Drop Top", price: 145, rentalWindow: "1-4 hr" },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Drop Top", price: 195, rentalWindow: "5-8 hr" },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Drop Top", price: 275, rentalWindow: "per day" },
  { company: "Mission Inflatables", item: "Castle Bounce House", price: 175 },
  { company: "Mission Inflatables", item: "Mickey Park Jump (large)", price: 175 },
  { company: "Mission Inflatables", item: "Palm Tree Bounce", price: 175 },
  { company: "Mission Inflatables", item: "Pretty Princess", price: 175 },
  { company: "Mission Inflatables", item: "Super castle", price: 175 },
  { company: "Mission Inflatables", item: "High Density Fog", price: null },
  { company: "Koozie's Premier Party Rentals", item: "Happy Birthday Bounce House", price: 135 },
  { company: "Koozie's Premier Party Rentals", item: "Lego Master Bounce House with Basketball Hoop", price: 150 },
  { company: "Koozie's Premier Party Rentals", item: "King Bounce House Combo (dry)", price: 275 },
  { company: "Koozie's Premier Party Rentals", item: "King Bounce House Combo (wet)", price: 250 },
  { company: "Jump Around BCS", item: "Lava Bounce House", price: 95 },
  { company: "Jump Around BCS", item: "Princess Castle 2", price: 95 },
  { company: "Jump Around BCS", item: "Princess Castle 3", price: 95 },
  { company: "Jump Around BCS", item: "All American Bounce House", price: 95 },
  { company: "Jump Around BCS", item: "Toddler Play Zone Dry", price: null },
  { company: "Bounce House Rentals BCS LLC", item: "All American Bounce House", price: 85 },
  { company: "Bounce House Rentals BCS LLC", item: "Bounce House 2", price: 85 },
  { company: "Bounce House Rentals BCS LLC", item: "Lava Bounce House", price: 85 },
  { company: "Bounce House Rentals BCS LLC", item: "Princess Castle 2", price: 85 },
  { company: "Mission Inflatables", item: "6' Tables", price: 14 },
  { company: "Mission Inflatables", item: "8' Table", price: 16 },
  { company: "Mission Inflatables", item: "Chairs", price: 2.5 },
  { company: "Jump Around BCS", item: "6ft Tables", price: 12 },
  { company: "Jump Around BCS", item: "Chairs", price: 2 },
  { company: "Bounce House Rentals BCS LLC", item: "6ft Tables", price: 10 },
  { company: "Bounce House Rentals BCS LLC", item: "Chairs", price: 1.5 },
];

const nov21Rows = [
  { company: "The Backyard Jump", item: "Emerald Bounce House", price: 175 },
  { company: "The Backyard Jump", item: "Pink Castle", price: 175 },
  { company: "The Backyard Jump", item: "Lucky Bounce House", price: 175 },
  { company: "The Backyard Jump", item: "Princess Combo", price: 350 },
  { company: "The Backyard Jump", item: "Mega Block Duel W/D Combo", price: 350 },
  { company: "The Backyard Jump", item: "Dino Land Duel W/D Combo", price: 375 },
  { company: "The Backyard Jump", item: "15 FT Blue Crush", price: 300 },
  { company: "The Backyard Jump", item: "15 FT Purple Crush", price: 300 },
  { company: "The Backyard Jump", item: "15 FT Tropical Inferno", price: 300 },
  { company: "The Backyard Jump", item: "15ft Bot", price: 300 },
  { company: "The Backyard Jump", item: "15FT Megablock Slide", price: 300 },
  { company: "The Backyard Jump", item: "15ft Tidal Wave Dual Lane", price: 400 },
  { company: "The Backyard Jump", item: "18 FT Desert Oasis", price: 375 },
  { company: "The Backyard Jump", item: "18 FT Tropical Lava Rush", price: 375 },
  { company: "The Backyard Jump", item: "Blue Lagoon", price: 500 },
  { company: "The Backyard Jump", item: "Danger Zone", price: 500 },
  { company: "Mission Inflatables", item: "TENT 10 x 10", price: 225 },
  { company: "Mission Inflatables", item: "20x40 Tent", price: 650 },
  { company: "Koozie's Premier Party Rentals", item: "Canopy", price: 50 },
];

const nov24Rows = [
  { company: "Aggieland Bounce Houses & Beyond", item: "The OG Castle", price: 145 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The OG Castle", price: 195 },
  { company: "Mission Inflatables", item: "Aggieland Jump", price: 199 },
  { company: "Mission Inflatables", item: "Bouncing Angels Wet or Dry Combo Slide", price: 350 },
  { company: "Mission Inflatables", item: "CASTLE COMBO W/ POOL", price: 350 },
  { company: "Koozie's Premier Party Rentals", item: "Princess Bounce House Combo", price: 275 },
  { company: "Koozie's Premier Party Rentals", item: "Palm Tree Paradise", price: 425 },
  { company: "Koozie's Premier Party Rentals", item: "22ft Big Blue Double Lane Waterslide", price: 600 },
  { company: "Jump Around BCS", item: "Halloween Bounce House", price: 145 },
  { company: "Jump Around BCS", item: "Dry Castle dual lane combo", price: 185 },
  { company: "Jump Around BCS", item: "Red Marble Combo Dry", price: 160 },
  { company: "Bounce House Rentals BCS LLC", item: "Dry Castle dual lane combo", price: 175 },
  { company: "Bounce House Rentals BCS LLC", item: "Full Throttle Combo Dry", price: 225 },
  { company: "Bounce House Rentals BCS LLC", item: "Red Marble Combo Dry", price: 150 },
];

const nov25Rows = [
  { company: "Aggieland Bounce Houses & Beyond", item: "The OG Combo", price: 350 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The OG Combo", price: 400 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Double Drop", price: 325 },
  { company: "Mission Inflatables", item: "Combo slide/castle", price: 350 },
  { company: "Mission Inflatables", item: "Hangout", price: 350 },
  { company: "Mission Inflatables", item: "Jungle Gym", price: 350 },
  { company: "Koozie's Premier Party Rentals", item: "The Starburst", price: 500 },
  { company: "Koozie's Premier Party Rentals", item: "21ft Wavebender Waterslide", price: 400 },
  { company: "Koozie's Premier Party Rentals", item: "The Superman", price: 700 },
  { company: "Jump Around BCS", item: "15ft Sunrise Dry Slide", price: 165 },
  { company: "Jump Around BCS", item: "16ft Unicorn Dry Slide", price: 200 },
  { company: "Jump Around BCS", item: "18ft Double Dry Purple Crush Slide", price: 275 },
  { company: "Bounce House Rentals BCS LLC", item: "15ft Sunrise Dry Slide", price: 165 },
  { company: "Bounce House Rentals BCS LLC", item: "16ft Double Volcano Dry Slide", price: 190 },
  { company: "Bounce House Rentals BCS LLC", item: "16ft Marble Dry Slide", price: 190 },
];

const nov26Rows = [
  { company: "Aggieland Bounce Houses & Beyond", item: "The Double Drop", price: 375 },
  { company: "Aggieland Bounce Houses & Beyond", item: "The Double Drop", price: 500 },
  { company: "Aggieland Bounce Houses & Beyond", item: "Monitor", price: 100 },
  { company: "Mission Inflatables", item: "Little Sunshine Combo", price: 350 },
  { company: "Mission Inflatables", item: "Marshal Mayhem (dry)", price: 445 },
  { company: "Mission Inflatables", item: "Super Combo Castle 5-n-1", price: 350 },
  { company: "Mission Inflatables", item: "15ft Flipper", price: 285 },
  { company: "Mission Inflatables", item: "15ft Fruit Roll up", price: 285 },
  { company: "Mission Inflatables", item: "15ft Island Falls", price: 285 },
  { company: "Mission Inflatables", item: "15ft Sunset Falls with pool", price: 285 },
  { company: "Mission Inflatables", item: "15ft Twin Island Falls", price: 425 },
  { company: "Mission Inflatables", item: "18ft Twin Blue Lagoon", price: 550 },
  { company: "Mission Inflatables", item: "20ft Lava Lane", price: 485 },
  { company: "Mission Inflatables", item: "20ft Palm Splash", price: 485 },
  { company: "Mission Inflatables", item: "22ft Island Falls", price: 525 },
];

const nov27Rows = [
  { company: "Mission Inflatables", item: "24ft Baja Falls with slip-n-slide", price: 750 },
  { company: "Mission Inflatables", item: "3500 generator", price: 125 },
  { company: "Mission Inflatables", item: "52ft Fun Run", price: 425 },
  { company: "Mission Inflatables", item: "65ft Fun Run", price: 475 },
  { company: "Mission Inflatables", item: "75ft Fun Run", price: 525 },
  { company: "Mission Inflatables", item: "ARENA", price: 425 },
  { company: "Mission Inflatables", item: "Basketball game", price: 185 },
  { company: "Mission Inflatables", item: "Battle Axe dual lane", price: 300 },
  { company: "Mission Inflatables", item: "Birthday Cotton Candy Maker", price: 179 },
  { company: "Mission Inflatables", item: "Bungee Run", price: 585 },
  { company: "Mission Inflatables", item: "Christmas Snow Globe", price: 400 },
  { company: "Mission Inflatables", item: "Cotton Candy Machine", price: 149 },
  { company: "Mission Inflatables", item: "Dunk Tank", price: 400 },
  { company: "Mission Inflatables", item: "Four in a row", price: 85 },
  { company: "Mission Inflatables", item: "Hosts", price: 80 },
];

const nov28Rows = [
  { company: "Mission Inflatables", item: "LARGE EVENT GENERATORS 10 RENTALS", price: 575 },
  { company: "Mission Inflatables", item: "M.I. Gaming Experience", price: 500 },
  { company: "Mission Inflatables", item: "NINJA RUN (Brazos Fun Run)", price: 425 },
  { company: "Mission Inflatables", item: "PATIO HEATER", price: 165 },
  { company: "Mission Inflatables", item: "Popcorn machine", price: 149 },
  { company: "Mission Inflatables", item: "Sno Cone", price: 149 },
  { company: "Mission Inflatables", item: "Snowball Toss dual lane", price: 300 },
  { company: "Mission Inflatables", item: "Speaker with microphone (Bluetooth)", price: 65 },
  { company: "Mission Inflatables", item: "Tailgate Challenge", price: 225 },
  { company: "Mission Inflatables", item: "VELCRO WALL", price: 485 },
  { company: "Mission Inflatables", item: "World of Sports", price: 550 },
  { company: "Mission Inflatables", item: "Football Toss", price: 285 },
  { company: "Koozie's Premier Party Rentals", item: "18ft Dolphin Waterslide Wet/Dry", price: 375 },
  { company: "Koozie's Premier Party Rentals", item: "18ft Lil Red Waterslide Wet/Dry", price: 375 },
  { company: "Koozie's Premier Party Rentals", item: "18ft Pirate Ship Waterslide Wet/Dry", price: 400 },
];

const nov23Rows = [
  { company: "Bounce House Rentals BCS LLC", item: "Princess Castle 3", price: 85 },
  { company: "Jumpin' Jehoshaphat Inflatables", item: "Jolly Jester's Castle", price: 100 },
  { company: "Jumpin' Jehoshaphat Inflatables", item: "Royal Bounce Palace", price: 100 },
  { company: "Jumpin' Jehoshaphat Inflatables", item: "Fairy Tale Castle", price: 100 },
  { company: "Jumpin' Jehoshaphat Inflatables", item: "Rocket Blast Bounce", price: 100 },
  { company: "Bounce House Rentals BCS LLC", item: "Halloween Bounce House", price: 125 },
  { company: "Jumpin' Jehoshaphat Inflatables", item: "Jolly Jester's Castle", price: 125 },
];

function samePrice(row, expected) {
  return (
    row.company === expected.company &&
    row.item === expected.item &&
    row.price === expected.price &&
    (expected.rentalWindow == null || row.rentalWindow === expected.rentalWindow)
  );
}

function assertChecked(expectedRows, date) {
  for (const expected of expectedRows) {
    const catalogMatches = catalog.prices.filter((row) => samePrice(row, expected));
    assert.equal(catalogMatches.length, 1, `${expected.company} ${expected.item} ${expected.price}`);
    assert.equal(catalogMatches[0].checkedDate, date);
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
    assert.equal(csvMatches[0].checked_date.trim(), date);
  }
}

test("rechecked rows keep their prices on 2026-11-20, 2026-11-21, 2026-11-22, 2026-11-23, 2026-11-24, 2026-11-25, 2026-11-26, 2026-11-27, and 2026-11-28", () => {
  assert.equal(nov20Rows.length, 3);
  assert.equal(nov21Rows.length, 19);
  assert.equal(nov22Rows.length, 29);
  assert.equal(nov23Rows.length, 7);
  assert.equal(nov24Rows.length, 14);
  assert.equal(nov25Rows.length, 15);
  assert.equal(nov26Rows.length, 15);
  assert.equal(nov27Rows.length, 15);
  assert.equal(nov28Rows.length, 15);
  assertChecked(nov20Rows, "2026-11-20");
  assertChecked(nov21Rows, "2026-11-21");
  assertChecked(nov22Rows, "2026-11-22");
  assertChecked(nov23Rows, "2026-11-23");
  assertChecked(nov24Rows, "2026-11-24");
  assertChecked(nov25Rows, "2026-11-25");
  assertChecked(nov26Rows, "2026-11-26");
  assertChecked(nov27Rows, "2026-11-27");
  assertChecked(nov28Rows, "2026-11-28");

  const touched = catalog.prices.filter((row) =>
    [...nov20Rows, ...nov21Rows, ...nov22Rows, ...nov23Rows, ...nov24Rows, ...nov25Rows, ...nov26Rows, ...nov27Rows, ...nov28Rows].some((expected) =>
      samePrice(row, expected),
    ),
  );
  assert.equal(touched.length, 132);
  const added = catalog.prices.filter(
    (row) => row.company === "College Station Tent and Event Rentals" || row.company === "BCS Party Rentals",
  );
  assert.equal(added.length, 8);
  assert.ok(added.every((row) => row.checkedDate === "2026-11-22"));
  const mega = catalog.prices.find(
    (row) => row.company === "Aggieland Bounce Houses & Beyond" && row.item === "Mega Block Bounce House Combo",
  );
  assert.equal(mega.price, 350);
  assert.equal(mega.status, "unverified");
  assert.equal(mega.checkedDate, "2026-11-24");
  assert.match(mega.notes, /Page not found on 2026-11-24/);
  const others = catalog.prices.filter((row) => !touched.includes(row) && !added.includes(row) && row !== mega);
  assert.equal(others.length, 161);
  assert.ok(others.every((row) => row.checkedDate === "2026-11-19"));

  const lucky = catalog.prices.find(
    (row) => row.company === "The Backyard Jump" && row.item === "Lucky Bounce House",
  );
  assert.match(lucky.notes, /product URL returned 404/);
  assert.match(lucky.notes, /Listing price was rechecked 2026-11-21/);
  assert.match(lucky.notes, /from \$175\.00/);

  const purple = catalog.prices.find(
    (row) => row.company === "The Backyard Jump" && row.item === "15 FT Purple Crush",
  );
  assert.match(purple.notes, /product URL returned 404/);
  assert.match(purple.notes, /Listing price was rechecked 2026-11-21/);
  assert.match(purple.notes, /from \$300\.00/);
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
  assert.equal(
    rows.every((row) => row.checkedDate === (row.category === "tent" ? "2026-11-21" : "2026-11-22")),
    true,
  );
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
    "Nov 22, 2026",
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

test("tent page lists the three published tent prices", () => {
  const page = pages.find((entry) => entry.slug === "tent-rentals");
  assert.ok(page);
  assert.equal(page.kind, "prices");
  assert.equal(page.nav, "Tents");
  assert.equal(page.title, "Tent rental prices");
  assert.equal(page.h1, "Tent rental prices");
  assert.equal(page.city, undefined);
  assert.deepEqual(page.categories, ["tent"]);
  assert.deepEqual(page.companies, ["Mission Inflatables", "Koozie's Premier Party Rentals"]);
  assert.ok(page.description.includes("Checked Nov 21, 2026"));
  assert.ok(page.lede);
  assert.ok(page.after);
  assert.ok(Array.isArray(page.faqs) && page.faqs.length >= 4);

  const blob = [
    page.description,
    page.lede,
    page.after,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
  for (const phrase of [
    "Only two of the companies we checked publish tent prices",
    "10x10 tent at $225",
    "20x40 tent at $650",
    "same amount from 1 hour through per day",
    "calculated at checkout",
    "anchoring and setup are not stated",
    "10x10 canopy at $50",
    "rental window is not stated",
    "delivery, setup, and takedown are included",
    "Jump Around BCS mentions tent rentals",
    "no public tent price",
    "no number is given",
    "Nov 21, 2026",
  ]) {
    assert.equal(blob.includes(phrase), true, phrase);
  }
  assert.equal(blob.includes("\u2014"), false);
  assert.equal(blob.includes("\u2013"), false);
  assert.equal(/Aggie/i.test(blob), false);
  assert.equal(comingSoon.includes("Tent rental prices"), false);

  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: page.categories,
    companies: page.companies,
  });
  assert.equal(rows.length, 3);
  assert.equal(rows.every((row) => row.checkedDate === "2026-11-21"), true);
  assert.equal(rows.every((row) => row.sourceUrl.startsWith("https://")), true);
  assert.deepEqual(
    rows.map((row) => [row.company, row.item, row.price]).sort(),
    [
      ["Koozie's Premier Party Rentals", "Canopy", 50],
      ["Mission Inflatables", "20x40 Tent", 650],
      ["Mission Inflatables", "TENT 10 x 10", 225],
    ].sort(),
  );
});

test("table and chair page lists published prices and blank unverified rows", () => {
  const page = pages.find((entry) => entry.slug === "table-and-chair-rental-comparison");
  assert.ok(page);
  assert.equal(page.kind, "prices");
  assert.equal(page.nav, "Tables and chairs");
  assert.equal(page.title, "Table and chair rental comparison");
  assert.equal(page.h1, "Table and chair rental comparison");
  assert.equal(page.city, undefined);
  assert.equal(page.companies, undefined);
  assert.deepEqual(page.categories, ["table", "chair"]);
  assert.ok(page.description.includes("Checked Nov 22, 2026"));
  assert.equal(page.description.includes(" to "), false);
  assert.ok(page.lede);
  assert.ok(page.tableCaption);
  assert.ok(page.after);
  assert.ok(Array.isArray(page.faqs) && page.faqs.length >= 4 && page.faqs.length <= 5);

  const blob = [
    page.title,
    page.description,
    page.h1,
    page.lede,
    page.tableCaption,
    page.after,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
  for (const phrase of [
    "Do prices include delivery and setup?",
    "What is the rental window?",
    "Is tax included?",
    "Why are some rows unverified?",
    "Where does each price come from?",
    "calculated at checkout",
    "4 hour standard rental",
    "sales tax",
    "$50 deposit",
    "not stated on the product page",
    "professional delivery, setup, and teardown are included",
    "would not load on Nov 22, 2026",
    "no price is filled in",
    "Koozie's Premier Party Rentals lists no tables or chairs",
    "10x10 canopy at $50",
    "20x40 tent at $650",
    "not computed or estimated",
    "Nov 22, 2026",
  ]) {
    assert.equal(blob.includes(phrase), true, phrase);
  }
  assert.equal(blob.includes("\u2014"), false);
  assert.equal(blob.includes("\u2013"), false);
  assert.equal(/Aggie/i.test(blob), false);
  assert.equal(comingSoon.includes("Table and chair rental comparison"), false);

  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: page.categories,
  });
  assert.equal(rows.length, 15);
  assert.equal(rows.every((row) => row.checkedDate === "2026-11-22"), true);
  assert.equal(rows.every((row) => row.sourceUrl.startsWith("https://")), true);
  assert.equal(rows.some((row) => row.company === "Koozie's Premier Party Rentals"), false);
  assert.deepEqual(
    rows.map((row) => [row.company, row.item, row.price, row.status]).sort(),
    [
      ["BCS Party Rentals", "6' White Rectangular Table", null, "unverified"],
      ["BCS Party Rentals", "Beige Folding Chairs", null, "unverified"],
      ["Bounce House Rentals BCS LLC", "6ft Tables", 10, "priced"],
      ["Bounce House Rentals BCS LLC", "Chairs", 1.5, "priced"],
      ["College Station Tent and Event Rentals", "30'' Cocktail Table", 12, "priced"],
      ["College Station Tent and Event Rentals", "5' Round Table", 12, "priced"],
      ["College Station Tent and Event Rentals", "6' Plastic Table", 12, "priced"],
      ["College Station Tent and Event Rentals", "8' Plastic Table", 12, "priced"],
      ["College Station Tent and Event Rentals", "White Metal Folding Chair", 2.25, "priced"],
      ["College Station Tent and Event Rentals", "White Resin Folding Chair", 3.5, "priced"],
      ["Jump Around BCS", "6ft Tables", 12, "priced"],
      ["Jump Around BCS", "Chairs", 2, "priced"],
      ["Mission Inflatables", "6' Tables", 14, "priced"],
      ["Mission Inflatables", "8' Table", 16, "priced"],
      ["Mission Inflatables", "Chairs", 2.5, "priced"],
    ].sort(),
  );
  const round = rows.find((row) => row.item === "5' Round Table");
  assert.equal(round.sourceUrl, "https://www.cstattent.com/rental-store/p/the-ember-vessel-ywbkw-skg45");
  const metal = rows.find((row) => row.item === "White Metal Folding Chair");
  assert.equal(metal.sourceUrl, "https://www.cstattent.com/rental-store");
  assert.equal(metal.rentalWindow, "not stated on the product page");
  const failed = rows.find((row) => row.item === "6' White Rectangular Table");
  assert.equal(failed.price, null);
  assert.equal(failed.notes, "Page would not load on 2026-11-22; price not confirmed");
  assert.equal(failed.sourceUrl, "https://www.bcspartyrental.com/category/tables_and_chairs/");
});

test("price page descriptions match the checked dates on their rows", () => {
  for (const page of pages.filter((entry) => entry.kind === "prices")) {
    const rows = filterPrices(catalog.prices, catalog.companies, {
      categories: page.categories,
      city: page.city,
      companies: page.companies,
    });
    const span = checkedSpan(rows.map((row) => row.checkedDate));
    assert.equal(page.description.includes(span), true, `${page.slug} expected ${span}`);
    const unique = new Set(rows.map((row) => row.checkedDate));
    if (unique.size === 1) {
      assert.equal(page.description.includes(" to "), false, page.slug);
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
  assert.equal(home.includes("Nov 19 to Nov 28, 2026"), true);
  assert.equal(about.includes("Nov 19 to Nov 28, 2026"), true);
  assert.equal(readme.includes("Nov 19 to Nov 28, 2026"), true);
  assert.equal(home.includes("Nov 19 to Nov 27, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 27, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 27, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 26, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 26, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 26, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 25, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 25, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 25, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 24, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 24, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 24, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 23, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 23, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 23, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 22, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 22, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 22, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 21, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 21, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 21, 2026"), false);
  assert.equal(home.includes("Nov 19 to Nov 20, 2026"), false);
  assert.equal(about.includes("Nov 19 to Nov 20, 2026"), false);
  assert.equal(readme.includes("Nov 19 to Nov 20, 2026"), false);
  assert.equal(readme.includes("Graduation party rental prices"), true);
  assert.equal(readme.includes("Tent rental prices"), true);
  assert.equal(readme.includes("Table and chair rental comparison"), true);
  assert.equal(readme.includes("Cheapest backyard birthday bounce house"), true);
  assert.equal(/Coming soon[\s\S]*graduation party rentals/i.test(readme), false);
  assert.equal(/Coming soon[\s\S]*tent rental prices/i.test(readme), false);
  assert.equal(/Coming soon[\s\S]*table and chair/i.test(readme), false);
  assert.equal(/Coming soon[\s\S]*cheapest backyard/i.test(readme), false);
  assert.equal(comingSoon.includes("Tent rental prices"), false);
  assert.equal(comingSoon.includes("Table and chair rental comparison"), false);
  assert.equal(comingSoon.includes("Cheapest backyard birthday bounce house"), false);
  assert.equal(notes.includes("2026-11-20"), true);
  assert.equal(notes.includes("2026-11-21"), true);
  assert.equal(notes.includes("2026-11-22"), true);
  assert.equal(notes.includes("2026-11-23"), true);
  assert.equal(notes.includes("2026-11-24"), true);
  assert.equal(notes.includes("2026-11-25"), true);
  assert.equal(notes.includes("2026-11-26"), true);
  assert.equal(notes.includes("2026-11-27"), true);
  assert.equal(notes.includes("2026-11-28"), true);
  assert.equal(notes.includes("Page not found on 2026-11-24"), true);
  assert.equal(notes.includes("would not load"), true);
  assert.equal(notes.includes("No prices changed"), true);
  assert.equal(notes.includes("prices-2026-11-19.csv"), true);
  assert.equal(home.includes("Graduation party rentals, tents"), false);
});

test("cheapest backyard bounce house page is derived from priced bounce houses", () => {
  const page = pages.find((entry) => entry.slug === "cheapest-backyard-birthday-bounce-house");
  assert.ok(page);
  assert.equal(page.kind, "prices");
  assert.equal(page.nav, "Cheapest bounce house");
  assert.equal(page.title, "Cheapest backyard birthday bounce house");
  assert.equal(page.h1, "Cheapest backyard birthday bounce house");
  assert.equal(page.city, undefined);
  assert.equal(page.companies, undefined);
  assert.deepEqual(page.categories, ["bounce house"]);
  assert.equal(page.status, "priced");
  assert.ok(page.lede);
  assert.ok(page.after);
  assert.ok(page.tableCaption);
  assert.ok(Array.isArray(page.faqs) && page.faqs.length >= 4 && page.faqs.length <= 5);

  const rows = filterPrices(catalog.prices, catalog.companies, {
    categories: page.categories,
    city: page.city,
    companies: page.companies,
    status: page.status,
  });
  assert.equal(rows.length, 48);
  assert.equal(rows.every((row) => row.category === "bounce house" && row.status === "priced" && row.price > 0), true);
  const span = checkedSpan(rows.map((row) => row.checkedDate));
  assert.equal(span, "Nov 19 to Nov 24, 2026");
  assert.equal(page.description.includes(span), true);
  assert.equal(page.description.includes("where stated"), true);

  const ordered = rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => a.row.price - b.row.price || a.index - b.index)
    .map((item) => item.row);
  const tiers = [];
  for (const row of ordered) {
    let tier = tiers.find((item) => item.price === row.price);
    if (!tier) {
      tier = { price: row.price, companies: [] };
      tiers.push(tier);
    }
    if (!tier.companies.includes(row.company)) tier.companies.push(row.company);
  }
  assert.deepEqual(
    tiers.slice(0, 3).map((tier) => [tier.price, tier.companies]),
    [
      [85, ["Bounce House Rentals BCS LLC"]],
      [95, ["Jump Around BCS"]],
      [100, ["Jumpin' Jehoshaphat Inflatables"]],
    ],
  );

  const blob = [
    page.title,
    page.description,
    page.h1,
    page.lede,
    page.tableCaption,
    page.after,
    ...page.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ].join("\n");
  for (const phrase of [
    "$85",
    "$95",
    "$100",
    "Bounce House Rentals BCS LLC",
    "Jump Around BCS",
    "Jumpin' Jehoshaphat Inflatables",
    "Delivery fees and tax are extra where a company states them",
    "no slide attached",
    "What is the lowest price?",
    "Are delivery fees and tax included?",
    "Are bounce houses with a slide included?",
    "Why does one bounce house have more than one row?",
    "Do all of these companies deliver in Bryan?",
  ]) {
    assert.equal(blob.includes(phrase), true, phrase);
  }
  assert.equal(blob.includes("\u2014"), false);
  assert.equal(blob.includes("\u2013"), false);
  assert.equal(/Aggie/i.test(blob), false);
  const amounts = [...blob.matchAll(/\$(\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));
  assert.ok(amounts.length >= 3);
  for (const amount of amounts) {
    assert.equal(rows.some((row) => row.price === amount), true, String(amount));
  }

  const pagesSource = readFileSync(new URL("../src/data/pages.mjs", import.meta.url), "utf8");
  const helperSource = readFileSync(new URL("../src/lib/cheapest-bounce.mjs", import.meta.url), "utf8");
  assert.equal(pagesSource.includes("$85"), false);
  assert.equal(helperSource.includes("$85"), false);
  assert.equal(pagesSource.includes("Jumpin' Jehoshaphat"), false);
});

test("Nov 23 recheck is the priced bounce houses still dated Nov 19 among the 15 cheapest", () => {
  const priced = catalog.prices
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => row.category === "bounce house" && row.status === "priced")
    .sort((a, b) => a.row.price - b.row.price || a.index - b.index)
    .slice(0, 15)
    .map((item) => item.row);
  assert.equal(priced.length, 15);
  const refreshed = priced.filter((row) => nov23Rows.some((expected) => samePrice(row, expected)));
  assert.equal(refreshed.length, 7);
  assert.equal(refreshed.every((row) => row.checkedDate === "2026-11-23"), true);
  const earlier = priced.filter((row) => !refreshed.includes(row));
  assert.equal(earlier.length, 8);
  assert.equal(earlier.every((row) => row.checkedDate === "2026-11-22"), true);
  for (const row of priced) {
    assert.equal(row.price === 85 || row.price === 95 || row.price === 100 || row.price === 125, true);
  }
  const span = checkedSpan(catalog.prices.map((row) => row.checkedDate));
  assert.equal(span, "Nov 19 to Nov 28, 2026");
  assert.equal(catalog.checkedDate, "2026-11-28");
  assert.equal(catalog.checkedLabel, `Checked ${span}`);
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
