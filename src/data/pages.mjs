/** @typedef {{ question: string, answer: string, href?: string, linkLabel?: string }} Faq */

/**
 * Add a page by appending an object here.
 * `kind: "prices"` needs `categories` and an optional `city` (`college-station` or `bryan`).
 * Optional `companies` is a list of company names. When it is set, other companies are left off.
 * `kind: "companies"` renders the delivery and fees table.
 * Set `nav` to show the page in the header. Home cards use every entry in this list.
 */

export const comingSoon = [
  "Tent rental prices",
  "Table and chair rental comparison",
  "Cheapest backyard birthday bounce house",
];

/** @type {Array<Record<string, any>>} */
export const pages = [
  {
    slug: "bounce-houses-college-station",
    kind: "prices",
    nav: "College Station",
    title: "Bounce house prices in College Station",
    description:
      "Bounce house rental prices in College Station, TX from each company's own website. Size, rental window, delivery, and price. Checked Nov 19 to Nov 20, 2026.",
    eyebrow: "College Station",
    h1: "Bounce house prices in College Station",
    lede:
      "Classic bounce houses only, with no attached slide. Each row is one published price and one rental window.",
    tableCaption: "Bounce house prices in College Station",
    categories: ["bounce house"],
    city: "college-station",
    after:
      "A combo is a bounce house with a slide attached. Combos are not in this table. Water slides and wet inflatables have their own page.",
    faqs: [
      {
        question: "Do these prices include delivery?",
        answer:
          "Some do, and some do not. The delivery column uses the company's own words. Open the source page before you pay a deposit.",
      },
      {
        question: "Why is one bounce house on several rows?",
        answer:
          "That company listed more than one length of time. Each length has its own price. Sort by price, then read the rental window before you compare two rows.",
      },
      {
        question: "Are slide combos in this list?",
        answer:
          "No. This page is bounce houses only. Water slides and wet inflatables are on their own page.",
        href: "/water-slides",
        linkLabel: "Water slide and wet inflatable prices",
      },
      {
        question: "What does Unverified mean?",
        answer:
          "The company page did not show a price on Nov 19, 2026. The row says Unverified and no number is filled in.",
      },
    ],
  },
  {
    slug: "bounce-houses-bryan",
    kind: "prices",
    nav: "Bryan",
    title: "Bounce house prices in Bryan",
    description:
      "Bounce house rental prices for companies that serve Bryan, TX. Size, rental window, delivery, and price from each company's own site. Checked Nov 19 to Nov 20, 2026.",
    eyebrow: "Bryan",
    h1: "Bounce house prices in Bryan",
    lede:
      "Classic bounce houses from companies that name Bryan in their service area. Each row is one published price and one rental window.",
    tableCaption: "Bounce house prices in Bryan",
    categories: ["bounce house"],
    city: "bryan",
    after:
      "Bounce House Rentals BCS LLC describes College Station and surrounding areas. Bryan is not named on the pages reviewed, so that company is on the College Station page only.",
    faqs: [
      {
        question: "Which companies are left off this page?",
        answer:
          "Bounce House Rentals BCS LLC. Their site says they deliver and set up in College Station and surrounding areas, and it does not name Bryan. Their bounce houses are listed on the College Station page.",
        href: "/bounce-houses-college-station",
        linkLabel: "College Station bounce house prices",
      },
      {
        question: "Does every other company deliver in Bryan?",
        answer:
          "Each company in this table names Bryan on its own site. The delivery rules are not the same. Read the delivery column and the source page.",
      },
      {
        question: "Why is one bounce house on several rows?",
        answer:
          "That company listed more than one length of time. Each length is its own row so you can sort by price without mixing a 4 hour rate and an all day rate.",
      },
    ],
  },
  {
    slug: "water-slides",
    kind: "prices",
    nav: "Water slides",
    title: "Water slide and wet inflatable prices",
    description:
      "Water slide and wet inflatable rental prices for College Station and Bryan from each company's own website. Checked Nov 19, 2026.",
    eyebrow: "Water slides",
    h1: "Water slide and wet inflatable prices",
    lede:
      "Water slides and wet inflatables with a public price. A dry bounce house is on the city pages. A bounce house with an attached slide is a combo and is not in this table.",
    tableCaption: "Water slide and wet inflatable prices",
    categories: ["water slide", "wet inflatable"],
    after:
      "Most companies in this table name both College Station and Bryan. Bounce House Rentals BCS LLC names College Station and surrounding areas and does not name Bryan. Their delivery note is on the row.",
    faqs: [
      {
        question: "Are combo units in this table?",
        answer:
          "No. Combos (a bounce house with a slide, including wet or dry combos) are a different category. This page is water slides and wet inflatables only.",
      },
      {
        question: "Can I get these in Bryan and in College Station?",
        answer:
          "Read the delivery note on the row. It is the company's own service area wording. One company does not name Bryan.",
      },
      {
        question: "Why does the same slide appear more than once?",
        answer:
          "Some companies publish a price for each length of time. Each length is its own row. Sort by price, then check the rental window.",
      },
    ],
  },
  {
    slug: "graduation-party-rentals",
    kind: "prices",
    nav: "Graduation",
    title: "Graduation party rental prices",
    description:
      "Tent, table, and chair rental prices for a graduation party in College Station and Bryan from Mission Inflatables, Koozie's Premier Party Rentals, and Jump Around BCS. Checked Nov 20, 2026.",
    eyebrow: "Graduation",
    h1: "Graduation party rental prices",
    lede:
      "Tents, tables, and chairs with a published price from Mission Inflatables, Koozie's Premier Party Rentals, and Jump Around BCS. Each row is one item and one rental window. This page does not add the rows into a party total.",
    tableCaption: "Graduation party rental prices",
    categories: ["tent", "table", "chair"],
    companies: [
      "Mission Inflatables",
      "Koozie's Premier Party Rentals",
      "Jump Around BCS",
    ],
    after:
      "A graduation party total is not computed or estimated. No package price is invented. Mission Inflatables lists a 10x10 tent at $225 per day, a 20x40 tent at $650 per day, a 6' table at $14 per day, an 8' table at $16 per day, and a chair at $2.50 per day. Those Mission pages list the same amount from 1 hour through per day. Delivery fees for Mission are calculated at checkout and are separate from the item price. Tent anchoring and setup are not stated on the Mission pages in this table. Koozie's Premier Party Rentals lists a 10x10 canopy at $50. The rental window is not stated on that product page. The company site says delivery, setup, and takedown are included. Anchoring is not stated. Jump Around BCS lists a 6ft table at $12 and a chair at $2 for the standard 4 hour rental. Those prices exclude sales tax, and the FAQ states a $50 deposit. The listed price includes setup and delivery. Anchoring is not stated. Each row was checked on Nov 20, 2026 and links to the company page. Bounce House Rentals BCS LLC table and chair prices are not in this table.",
    faqs: [
      {
        question: "Is a graduation party total listed?",
        answer:
          "No. A graduation party total is not computed or estimated. No package price is invented. The table lists separate tent, table, and chair prices.",
      },
      {
        question: "What does Mission Inflatables list for a tent, table, or chair?",
        answer:
          "A 10x10 tent at $225 per day, a 20x40 tent at $650 per day, a 6' table at $14 per day, an 8' table at $16 per day, and a chair at $2.50 per day. Those pages list the same amount from 1 hour through per day. Delivery fees are calculated at checkout and are separate. Tent anchoring and setup are not stated.",
      },
      {
        question: "What does Koozie's Premier Party Rentals list for a canopy?",
        answer:
          "A 10x10 canopy at $50. The rental window is not stated on that product page. The company site says delivery, setup, and takedown are included. Anchoring is not stated.",
      },
      {
        question: "What does Jump Around BCS list for a table or chair?",
        answer:
          "A 6ft table at $12 and a chair at $2 for the standard 4 hour rental. Those prices exclude sales tax, and the FAQ states a $50 deposit. The listed price includes setup and delivery. Anchoring is not stated.",
      },
      {
        question: "When were these prices checked?",
        answer:
          "Each row on this page was checked on Nov 20, 2026. The source link on the row is the company page.",
      },
      {
        question: "Why are some table and chair prices missing from this page?",
        answer:
          "Bounce House Rentals BCS LLC publishes a table price and a chair price. Those rows are not on this page. A company with no public price is not given a guessed number.",
      },
    ],
  },
  {
    slug: "whats-included",
    kind: "companies",
    nav: "What's included",
    title: "What's included: delivery, setup, and fees",
    description:
      "Delivery, setup, rental time, and fees by party rental company in College Station and Bryan. Taken from each company's own site on Nov 19, 2026.",
    eyebrow: "Delivery and fees",
    h1: "What's included: delivery, setup, time window, and fees",
    lede:
      "What each company says is included, and what the page does not say. If a fee is not on the company site, the cell says Not listed.",
    faqs: [
      {
        question: "Is delivery free?",
        answer:
          "Only when the company says so. Aggieland Bounce Houses & Beyond states free delivery in Bryan and College Station, and a fee more than 15 miles outside that area. Other companies include delivery, calculate a fee at checkout, or do not state a fee.",
      },
      {
        question: "Is sales tax included?",
        answer:
          "Jump Around BCS states that prices do not include sales tax. On the other product pages reviewed, sales tax was not stated. That is not the same as tax-free.",
      },
      {
        question: "Why do two sites list the same unit at different prices?",
        answer:
          "Jump Around BCS and Bounce House Rentals BCS LLC list some of the same unit names. The prices on the two sites were different on Nov 19, 2026, so both lists are shown.",
      },
      {
        question: "Can I book on this site?",
        answer:
          "No. Open the company page, then call to confirm the price, the date, and the delivery fee.",
      },
    ],
  },
];
