export function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function checkedPhrase(iso: string): string {
  return `Checked ${formatDate(iso)}`;
}

function monthDay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** One checked day, or the first and last day when rows were read on different dates. */
export function checkedSpan(dates: Array<string | null | undefined>): string {
  const unique = [...new Set(dates.map((date) => (date ?? "").trim()).filter(Boolean))].sort();
  if (unique.length === 0) return "Not listed";
  if (unique.length === 1) return formatDate(unique[0]);
  const firstYear = unique[0].slice(0, 4);
  const lastYear = unique[unique.length - 1].slice(0, 4);
  if (firstYear === lastYear) {
    return `${monthDay(unique[0])} to ${formatDate(unique[unique.length - 1])}`;
  }
  return `${formatDate(unique[0])} to ${formatDate(unique[unique.length - 1])}`;
}

export function money(amount: number): string {
  const cents = Math.round(amount * 100) % 100;
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
}

/** Blank collected fields render as Not listed. Never substitute a guess. */
export function listed(value: string | null | undefined): string {
  const text = (value ?? "").trim();
  return text ? text : "Not listed";
}

export function servesLabel(serves: string[] | null | undefined): string {
  const list = serves ?? [];
  const collegeStation = list.includes("college-station");
  const bryan = list.includes("bryan");
  if (collegeStation && bryan) return "College Station and Bryan";
  if (collegeStation) return "College Station";
  if (bryan) return "Bryan";
  return "Not listed";
}
