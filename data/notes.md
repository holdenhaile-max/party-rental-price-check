# Party Rental Price Check notes

Checked dates: 2026-11-19 for the original collection. On 2026-11-20 these published prices were read again and were unchanged, so only `checked_date` was set to 2026-11-20:

- Mission Inflatables: Chairs ($2.50), TENT 10 x 10 ($225), 20x40 Tent ($650), 6' Tables ($14), 8' Table ($16)
- Koozie's Premier Party Rentals: Canopy ($50)
- Jump Around BCS: 6ft Tables ($12), Chairs ($2)
- The Backyard Jump: Marble Rush Bounce House ($150)
- Aggieland Bounce Houses & Beyond: The Bouncer XL ($165 for 1-4 hours, $215 for 5-16 hours)

On 2026-11-21 these published prices were read again and were unchanged, so only `checked_date` was set to 2026-11-21:

- The Backyard Jump, 16 rows: Emerald Bounce House ($175), Pink Castle ($175), Lucky Bounce House ($175), Princess Combo ($350), Mega Block Duel W/D Combo ($350), Dino Land Duel W/D Combo ($375), 15 FT Blue Crush ($300), 15 FT Purple Crush ($300), 15 FT Tropical Inferno ($300), 15ft Bot ($300), 15FT Megablock Slide ($300), 15ft Tidal Wave Dual Lane ($400), 18 FT Desert Oasis ($375), 18 FT Tropical Lava Rush ($375), Blue Lagoon ($500), Danger Zone ($500). Lucky Bounce House and 15 FT Purple Crush product URLs still returned 404. The bounce-house listing still showed from $175.00, and the all-inventory listing still showed from $300.00. Those listing prices were rechecked 2026-11-21.
- Mission Inflatables: TENT 10 x 10 ($225) and 20x40 Tent ($650). Both pages show the same amount from 1 hour through per day.
- Koozie's Premier Party Rentals: Canopy ($50). The page shows Rental $50.

19 rows were reread. No prices changed.

Other rows stay on 2026-11-19, including Bounce House Rentals BCS LLC tables and chairs. Prices come only from each company's own public website. Third-party aggregator prices were not used. No prices were estimated. When a page showed only a starting-at or "from" figure, that is what was recorded, with the wording preserved in the rental window or notes column.

CSV path: `data/prices-2026-11-19.csv`. The filename stays the original snapshot name. It is not renamed when a later check updates a row date.

The CSV has one row per published price window. Some companies list several durations for the same unit, so row counts can be higher than unique item counts.

## The Backyard Jump (thebackyardjumpllc.com)

Readable: full public inventory with "from" prices on category pages. Sampled product pages (Marble Rush, Emerald, Princess Combo, 15 FT Blue Crush, Blue Lagoon) show the same dollar amount from 1 hour through per day, then a same-amount additional-day rate.

Booking platform: InflatableOffice (online cart, date/time, delivery-fee calculator at checkout).

Delivery / fees: service to College Station, Bryan, Brenham, Caldwell, Navasota, and surrounding areas. Delivery fees are calculated at checkout. Rain reschedule is free with 24-hour notice. Blower, cord, and stakes included.

Lucky Bounce House appears on the bounce-house category page at $175 (15x15x14) but the individual product URL returned 404. That listing price is still in the CSV, with a note. On 2026-11-21 the product URL still returned 404, and the bounce-house category page still showed from $175.00. 15 FT Purple Crush product URL also returned 404 on 2026-11-21. The all-inventory listing still showed from $300.00. Those listing prices were rechecked 2026-11-21.

## Aggieland Bounce Houses & Beyond (aggielandbouncers.com)

Readable: bounce houses, water rides, slides and combos, and staffing. Product pages publish duration tiers (not a single flat daily rate). Example: The Bouncer XL is $165 for 1-4 hours and $215 for 5-16 hours / per day. The Drop Top lists $145 (1-4 hr), $195 (5-8 hr), and $275 per day.

Booking platform: InflatableOffice.

Delivery / fees: free delivery in Bryan/College Station; a delivery fee is charged more than 15 miles outside BCS. Pages also say delivery fees are calculated at checkout. Units include a tarp, blower, cord, and stakes.

Mega Block Bounce House Combo is priced $350 with size 26'L x 13'W x 14'H on the Slides & Combos listing, but the product URL returned 404, so duration tiers could not be confirmed.

## Koozie's Premier Party Rentals (kooziepartyrentals.com)

Readable: All Rentals catalog and individual product pages with "Starting at" / "Rental $X" prices. A company article on this same site (April 11, 2025) says dry units start at $200 and wet units at $250, and that most rentals are a full-day rate. Item-level prices on the official catalog are more specific (some bounce houses are below those starting figures) and were used instead of the article averages.

Booking platform: WordPress / WooCommerce-style product pages with an instant-quote / cart flow. The all-rentals page says the team follows up within 24 hours to confirm booking and price.

Delivery / fees: delivery, setup, and takedown included. Site says no mileage fees to Waco, College Station, Bremond, Franklin, and the surrounding area. Homepage also lists Bryan. Rates may change seasonally. Military, first responder, and educator discounts are mentioned. Sales tax was not stated on the product pages reviewed.

The King Bounce House Combo product page prints "Rental $275 flat rate Dry / 250 Wet." Both figures are in the CSV as printed, even though the wet figure is lower than the dry figure.

## Jump Around BCS (collegestationbouncehouserentals.com)

Readable: Event Rental Systems catalog with public prices on category and item pages. FAQ states the standard rental time is 4 hours, that setup happens before that window, that prices include setup and delivery (extra fees may apply farther out), that prices do not include sales tax, and that a $50 credit card deposit is required (refundable if canceled at least 8 days prior).

Booking platform: Event Rental Systems (order-by-date / cart). Item image paths and inventory IDs on this site are labeled `bcsbounce`, which is the same catalog identifier used by Bounce House Rentals BCS LLC. The two sites list overlapping unit names but different prices, so they were recorded as separate public price lists.

Service area: College Station, Bryan, Navasota, Caldwell, Iola, Bedias, Hearne, Rockdale, and beyond.

Blocked / unpriced: Toddler Play Zone Dry had no price on the category page; the item page loaded with $0.00 and no header, so it is unverified. A 16ft Unicorn Water Slide, Slip and slide, and 22ft Tropical slide with slip and slide were priced on item pages even when they were missing from (or incomplete on) a category grid.

## Freedom Fun USA, College Station / Brenham (freedomfunusa.com)

Official local site: https://www.freedomfunusa.com/location/college-station-brenham-texas. Inventory and prices were taken from College Station / Brenham category pages, not from other city sites.

Readable: Webflow category cards with Drop-Off, DIY, and Concierge price pins. Drop-Off copy says they deliver, set up, and pick up the next day; mileage fees may apply; a final quote is provided before booking. Optional hosts are $100/hour. Rescheduling is free, including weather. Some packages are "starting at" only and were labeled that way.

Booking platform: custom Freedom Fun quote / concierge form (not a self-serve InflatableOffice or Event Rental Systems cart).

Service area: Bryan, College Station, Brenham, Navasota, Caldwell, Hearne, and nearby Brazos Valley communities. Local phone (254) 428-3386; listed address 220 E Main Street, Troy, TX 76579 (shared with the Waco / Temple / Killeen team).

Unpriced: Large Event Foam Experiences is described as a custom large-event offering with no public price.

A screen-size calculator for outdoor movies appears on some non-movie pages. Movie-screen prices were taken only from the College Station outdoor-movie category page.

## Mission Inflatables (missioninflatablesllc.com)

Official site for the Iola-based company that serves Bryan and College Station. All Inventory listing shows "from" prices. Sampled product pages (castle, Aggieland Jump, tents, tables, chairs, several water slides) show that same amount from 1 hour through per day, with a separate additional-day rate. FAQ says the standard rental is usually for the day, with overnight or multi-day available for an extra charge if the unit is secure.

Booking platform: InflatableOffice (calendar with Single Day / Overnight / Multi-Day, cart, contract, deposit at booking).

Delivery / fees: professional delivery to College Station and surrounding areas; delivery fees calculated at checkout. Service area described as the greater Brazos Valley (Franklin, Iola, Bryan, College Station, Navasota, Caldwell, Brenham, Hearne, Huntsville, and nearby towns).

A few listing names do not match the URL slug (for example, 15ft Island Falls uses the slug 15-ft-sunset-falls). The visible listing name was used, and the mismatch is noted in the CSV.

High Density Fog exists as a product page but all duration prices display as $0.00, so it is unverified.

## Jumpin' Jehoshaphat Inflatables (jjinflatables.wixsite.com/jjinflatables)

Additional local company with a public price list on its own Wix homepage. Four bounce houses, two water slides, and three wet/dry combos each have four time tiers (up to 4 hours, 4-6, 6-8, and 8-12 hours). Combos have separate wet and dry schedules.

Booking: no self-serve cart; contact is by call/text (979-450-8356), email, or a form. The homepage does not state delivery fees, setup charges, deposit, or tax. The family says they serve Bryan, College Station, and surrounding areas. Item sizes were not listed on the homepage.

## Bounce House Rentals BCS LLC (bcsbounce.com)

Additional local company with a public Event Rental Systems catalog. Item pages show prices and, in many cases, actual size / setup area. The FAQ page on 2026-11-19 had no questions or answers (no rental window, deposit, or tax details). The homepage says they deliver and set up in College Station and surrounding areas; Bryan is not named on the pages reviewed.

Inventory names overlap Jump Around BCS, but listed prices differ (classic bounce houses are $85 here vs $95 at Jump Around BCS). Train pricing on the item page is $300 for the first hour and $200 each additional hour.

## Other companies checked, not used as priced catalogs

- Bounce-A-Lot BCS (bouncealotbcs.com): official Wix site for Bryan / College Station, but no public item prices. Not used for priced rows.
- Modern Bouncee Party Rentals (modernbounceerentals.com): official-site requests failed with HTTP 500 or an SSL error, so prices could not be verified from the live site on 2026-11-19.
- Kids Play BCS (kidsplaybcs.com / www.kidsplaybcs.com): requests returned 404 or 500.
- Hullabaloos Bounce (hullabaloosbounce.com): requests failed with HTTP 500 or an SSL error. No official public catalog was captured.

## How to read the comparison

"Standard bounce house" in the launch summary means a classic moonwalk / castle without an attached slide. Combo units, water slides, and packages were excluded from that cheapest / priciest pair. Because rental windows are not identical across companies, the CSV keeps the window next to every price.
