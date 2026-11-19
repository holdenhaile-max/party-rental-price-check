export function priceSortValue(price, status) {
  if (status === "unverified" || price == null || Number.isNaN(Number(price))) {
    return { missing: true, value: null };
  }
  return { missing: false, value: Number(price) };
}

export function textSortValue(text) {
  const value = String(text ?? "").trim();
  if (!value || value.toLowerCase() === "not listed") return { missing: true, value: null };
  return { missing: false, value: value.toLowerCase() };
}

export function compareSortValues(a, b, direction = "asc") {
  if (!a || !b) return 0;
  if (a.missing && b.missing) return 0;
  if (a.missing) return 1;
  if (b.missing) return -1;
  let cmp = 0;
  if (typeof a.value === "number" && typeof b.value === "number") {
    cmp = a.value - b.value;
  } else {
    cmp = String(a.value).localeCompare(String(b.value), "en", {
      numeric: true,
      sensitivity: "base",
    });
  }
  if (cmp === 0) return 0;
  return direction === "desc" ? -cmp : cmp;
}

export function sortByPrice(rows) {
  return rows
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const cmp = compareSortValues(
        priceSortValue(a.row.price, a.row.status),
        priceSortValue(b.row.price, b.row.status),
        "asc",
      );
      return cmp !== 0 ? cmp : a.index - b.index;
    })
    .map((item) => item.row);
}
