import { compareSortValues } from "../lib/sort-keys.mjs";

function readValue(row, key) {
  const missing = row.getAttribute(`data-${key}-missing`) === "true";
  if (missing) return { missing: true, value: null };
  const raw = row.getAttribute(`data-${key}`);
  if (raw == null || raw === "") return { missing: true, value: null };
  if (row.getAttribute(`data-${key}-type`) === "number") {
    const value = Number(raw);
    if (Number.isNaN(value)) return { missing: true, value: null };
    return { missing: false, value };
  }
  return { missing: false, value: raw };
}

function nextDirection(current) {
  return current === "ascending" ? "descending" : "ascending";
}

function buttonLabel(name, direction) {
  if (direction === "ascending") return `${name}, sorted lowest first. Activate to reverse.`;
  if (direction === "descending") return `${name}, sorted highest first. Activate to reverse.`;
  return `Sort by ${name}`;
}

export function initSortableTables(root = document) {
  root.querySelectorAll("table[data-sortable]").forEach((table) => {
    if (table.dataset.sortReady === "true") return;
    table.dataset.sortReady = "true";
    const tbody = table.tBodies[0];
    if (!tbody) return;

    table.querySelectorAll("button[data-sort]").forEach((button) => {
      const name = button.dataset.sortName || button.textContent.trim();
      if (!button.getAttribute("aria-label")) {
        const th = button.closest("th");
        const current = th?.getAttribute("aria-sort") || "none";
        button.setAttribute("aria-label", buttonLabel(name, current));
      }
      button.addEventListener("click", () => {
        const key = button.dataset.sort;
        const th = button.closest("th");
        if (!key || !th) return;
        const directionName = nextDirection(th.getAttribute("aria-sort"));
        table.querySelectorAll("thead th[aria-sort]").forEach((cell) => {
          cell.setAttribute("aria-sort", "none");
          const other = cell.querySelector("button[data-sort]");
          if (other && other !== button) {
            other.setAttribute(
              "aria-label",
              buttonLabel(other.dataset.sortName || other.textContent.trim(), "none"),
            );
          }
        });
        th.setAttribute("aria-sort", directionName);
        button.setAttribute("aria-label", buttonLabel(name, directionName));
        const direction = directionName === "ascending" ? "asc" : "desc";
        const keyed = [...tbody.rows].map((row, index) => ({
          row,
          index: Number(row.dataset.original ?? index),
          value: readValue(row, key),
        }));
        keyed.sort((a, b) => {
          const cmp = compareSortValues(a.value, b.value, direction);
          return cmp !== 0 ? cmp : a.index - b.index;
        });
        keyed.forEach((item) => tbody.appendChild(item.row));
      });
    });
  });
}
