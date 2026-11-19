import assert from "node:assert/strict";
import test from "node:test";
import { compareSortValues, priceSortValue, sortByPrice } from "../src/lib/sort-keys.mjs";

test("missing prices sort after real prices", () => {
  const rows = sortByPrice([
    { price: 200, status: "priced", item: "b" },
    { price: null, status: "unverified", item: "c" },
    { price: 100, status: "priced", item: "a" },
  ]);
  assert.deepEqual(
    rows.map((row) => row.item),
    ["a", "b", "c"],
  );
});

test("equal prices keep their original order", () => {
  const rows = sortByPrice([
    { price: 175, status: "priced", item: "first" },
    { price: 175, status: "priced", item: "second" },
  ]);
  assert.deepEqual(
    rows.map((row) => row.item),
    ["first", "second"],
  );
});

test("unverified status hides a stray number from the sort key", () => {
  const value = priceSortValue(150, "unverified");
  assert.equal(value.missing, true);
});

test("descending numeric compare flips order and keeps missing last", () => {
  const low = priceSortValue(80, "priced");
  const high = priceSortValue(200, "priced");
  const missing = priceSortValue(null, "unverified");
  assert.equal(compareSortValues(low, high, "desc") > 0, true);
  assert.equal(compareSortValues(missing, low, "asc") > 0, true);
  assert.equal(compareSortValues(low, missing, "desc") < 0, true);
});
