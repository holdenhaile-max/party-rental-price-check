import { readFileSync, writeFileSync } from "node:fs";
import { parseCsv } from "../src/lib/csv.mjs";

const csvPath = new URL("../data/prices-2026-11-19.csv", import.meta.url);
const catalogPath = new URL("../src/data/catalog.json", import.meta.url);
const rows = parseCsv(readFileSync(csvPath, "utf8"));
const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));

function priceValue(raw, status) {
  const text = (raw || "").trim();
  if (!text) return null;
  if (status !== "priced" && status !== "unverified") return null;
  const num = Number(text);
  if (Number.isNaN(num)) {
    throw new Error(`Price is not a number: ${raw}`);
  }
  return Number.isInteger(num) ? num : num;
}

catalog.prices = rows.map((row) => ({
  company: row.company,
  item: row.item_name,
  category: row.category,
  size: (row.size || "").trim(),
  price: priceValue(row.price, row.status),
  rentalWindow: (row.rental_window || "").trim(),
  feeNotes: (row.fee_notes || "").trim(),
  serviceArea: (row.service_area || "").trim(),
  sourceUrl: (row.source_url || "").trim(),
  checkedDate: (row.checked_date || "").trim(),
  status: (row.status || "").trim(),
  notes: (row.notes || "").trim(),
}));

const names = new Set(catalog.companies.map((company) => company.name));
const missing = [...new Set(catalog.prices.map((row) => row.company))].filter((name) => !names.has(name));
if (missing.length) {
  throw new Error(`Add company profiles before syncing: ${missing.join(", ")}`);
}

writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
console.log(`Synced ${catalog.prices.length} prices into src/data/catalog.json`);
