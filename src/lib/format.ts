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
