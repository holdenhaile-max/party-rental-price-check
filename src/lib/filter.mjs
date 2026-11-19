/**
 * @param {Array<{ category: string, company: string }>} prices
 * @param {Array<{ name: string, serves: string[] }>} companies
 * @param {{ categories?: string[], city?: string }} query
 */
export function filterPrices(prices, companies, query = {}) {
  const byName = new Map(companies.map((company) => [company.name, company]));
  return prices.filter((row) => {
    if (query.categories?.length && !query.categories.includes(row.category)) return false;
    if (query.city) {
      const company = byName.get(row.company);
      if (!company?.serves?.includes(query.city)) return false;
    }
    return true;
  });
}

/** @param {Array<{ status: string }>} prices */
export function unverifiedPrices(prices) {
  return prices.filter((row) => row.status === "unverified");
}
