# Party Rental Price Check

Party rental prices, checked.

A dated comparison of published party rental prices for College Station and Bryan, Texas. Every price comes from the company's own public page. Prices were checked Nov 19 to Nov 23, 2026. Each row keeps its own checked date. The site does not estimate a missing number.

Live site: https://holdenhaile-max.github.io/party-rental-price-check/

## Pages

- Home
- Bounce house prices in College Station
- Bounce house prices in Bryan
- Cheapest backyard birthday bounce house
- Water slide and wet inflatable prices
- Graduation party rental prices
- Tent rental prices
- Table and chair rental comparison
- What's included: delivery, setup, time window, and fees
- About

## Develop

```bash
npm install
npm test
npm run check:copy
npm run dev
```

The dev server uses the same base path as GitHub Pages: http://localhost:4321/party-rental-price-check/

```bash
npm run build
```

`astro.config.mjs` sets `site` to `https://holdenhaile-max.github.io` and `base` to `/party-rental-price-check`.

## Update a price

The site reads one file: `src/data/catalog.json`. The CSV snapshot lives at `data/prices-2026-11-19.csv`. Notes from the collection live in `data/notes.md`.

1. Open the company page and read the price. Do not estimate, and do not copy a third-party listing.
2. Edit that row in `data/prices-2026-11-19.csv`. Set `checked_date` to the day you read the page (`YYYY-MM-DD`).
3. If the page shows no price, leave `price` blank and set `status` to `unverified`.
4. If the same item has more than one rental length, keep one row per length.
5. Run `npm run sync:prices` to copy the CSV into `src/data/catalog.json`. Company profiles in the JSON are left as they are.
6. If delivery, setup, or fees changed, edit that company's object in `src/data/catalog.json`. Use `Not listed` when the page is silent. Do not invent a fee.
7. Run `npm test` and `npm run check:copy`.

## Add a page

1. Add an object to the `pages` array in `src/data/pages.mjs`.
2. Set `kind` to `prices` and list `categories` (for example `["bounce house"]`). Set `city` to `college-station` or `bryan` when the page is for one city. Leave `city` off to include every company that has those categories. Set `companies` to a list of company names when the page should include only those companies. Set `status` to `priced` when unverified rows should stay off the page.
3. Write a plain `title`, `description`, `h1`, `lede`, and `faqs`. Set `nav` to a short label if it should appear in the header.
4. The page is built from `src/pages/[slug].astro`. `PriceTable` renders the rows. You do not add a new table.
5. Remove that topic from `comingSoon` in the same file once the page is real.
6. Run `npm test` and `npm run build`.

To add a company, add an object to `companies` in `src/data/catalog.json` with the same `name` string used on the price rows. `serves` controls the Bryan and College Station filters: `"college-station"`, `"bryan"`, or both. A company with no public prices uses `"publicPrices": "none"` or `"unavailable"` and appears in the checked-but-unpriced table.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`, which builds the site and deploys to GitHub Pages. The Pages source is GitHub Actions. There is no custom domain.
