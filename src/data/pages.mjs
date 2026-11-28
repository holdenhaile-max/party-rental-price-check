/** @typedef {{ question: string, answer: string, href?: string, linkLabel?: string }} Faq */

import catalog from "./catalog.json" with { type: "json" };
import { buildCheapestBouncePage } from "../lib/cheapest-bounce.mjs";

/**
 * Add a page by appending an object here.
 * `kind: "prices"` needs `categories` and an optional `city` (`college-station` or `bryan`).
 * Optional `companies` is a list of company names. When it is set, other companies are left off.
 * Optional `status` (for example `"priced"`) keeps other statuses off the table.
 * `kind: "companies"` renders the delivery and fees table.
 * Set `nav` to show the page in the header. Home cards use every entry in this list.
 */

export const comingSoon = [];

/** @type {Array<Record<string, any>>} */
export const pages = [
  {
    slug: "bounce-houses-college-station",
    kind: "prices",
    nav: "College Station",
    title: "Bounce house prices in College Station",
    description:
      "Bounce house rental prices in College Station, TX from each company's own website. Size, rental window, delivery, and price. Checked Nov 19 to Nov 24, 2026.",
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
      "Bounce house rental prices for companies that serve Bryan, TX. Size, rental window, delivery, and price from each company's own site. Checked Nov 19 to Nov 24, 2026.",
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
  buildCheapestBouncePage(catalog),
  {
    slug: "water-slides",
    kind: "prices",
    nav: "Water slides",
    title: "Water slide and wet inflatable prices",
    description:
      "Water slide and wet inflatable rental prices for College Station and Bryan from each company's own website. Checked Nov 19 to Nov 28, 2026.",
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
      "Tent, table, and chair rental prices for a graduation party in College Station and Bryan from Mission Inflatables, Koozie's Premier Party Rentals, and Jump Around BCS. Checked Nov 21 to Nov 22, 2026.",
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
      "A graduation party total is not computed or estimated. No package price is invented. Mission Inflatables lists a 10x10 tent at $225 per day, a 20x40 tent at $650 per day, a 6' table at $14 per day, an 8' table at $16 per day, and a chair at $2.50 per day. Those Mission pages list the same amount from 1 hour through per day. Delivery fees for Mission are calculated at checkout and are separate from the item price. Tent anchoring and setup are not stated on the Mission pages in this table. Koozie's Premier Party Rentals lists a 10x10 canopy at $50. The rental window is not stated on that product page. The company site says delivery, setup, and takedown are included. Anchoring is not stated. Jump Around BCS lists a 6ft table at $12 and a chair at $2 for the standard 4 hour rental. Those prices exclude sales tax, and the FAQ states a $50 deposit. The listed price includes setup and delivery. Anchoring is not stated. Tent and canopy rows were checked on Nov 21, 2026. Table and chair rows were checked on Nov 22, 2026. Each row links to the company page. Bounce House Rentals BCS LLC table and chair prices are not in this table.",
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
          "Tent and canopy rows were checked on Nov 21, 2026. Table and chair rows were checked on Nov 22, 2026. The source link on the row is the company page.",
      },
      {
        question: "Why are some table and chair prices missing from this page?",
        answer:
          "Bounce House Rentals BCS LLC publishes a table price and a chair price. Those rows are not on this page. A company with no public price is not given a guessed number. The table and chair comparison lists the other table and chair rows.",
        href: "/table-and-chair-rental-comparison",
        linkLabel: "Table and chair rental comparison",
      },
    ],
  },
  {
    slug: "tent-rentals",
    kind: "prices",
    nav: "Tents",
    title: "Tent rental prices",
    description:
      "Tent rental prices from Mission Inflatables and Koozie's Premier Party Rentals. Only two of the companies we checked publish tent prices. Checked Nov 21, 2026.",
    eyebrow: "Tents",
    h1: "Tent rental prices",
    lede:
      "Three published tent prices from two companies. Each row is one item. This page does not add the rows into a total.",
    tableCaption: "Tent rental prices",
    categories: ["tent"],
    companies: ["Mission Inflatables", "Koozie's Premier Party Rentals"],
    after:
      "Only two of the companies we checked publish tent prices. Mission Inflatables lists a 10x10 tent at $225 and a 20x40 tent at $650. Those pages list the same amount from 1 hour through per day. The delivery fee is calculated at checkout. Tent anchoring and setup are not stated on those pages. Koozie's Premier Party Rentals lists a 10x10 canopy at $50. The rental window is not stated on that product page. The company site says delivery, setup, and takedown are included. Jump Around BCS mentions tent rentals on its site but shows no public tent price, so no number is given. No total is computed or estimated.",
    faqs: [
      {
        question: "Why do only two companies appear?",
        answer:
          "Only two of the companies we checked publish tent prices. Mission Inflatables and Koozie's Premier Party Rentals list a dollar amount. Jump Around BCS mentions tent rentals on its site but shows no public tent price, so no number is given.",
      },
      {
        question: "What is a canopy vs a tent?",
        answer:
          "Koozie's Premier Party Rentals lists a 10x10 canopy at $50. The row note describes it as a 10x10 Crown Shades pop-up canopy. Mission Inflatables lists a 10x10 tent at $225 and a 20x40 tent at $650. Those pages do not define how a canopy differs from a tent.",
      },
      {
        question: "Are delivery and anchoring included?",
        answer:
          "Mission Inflatables calculates the delivery fee at checkout. Tent anchoring and setup are not stated on those pages. Koozie's Premier Party Rentals says delivery, setup, and takedown are included. Anchoring is not stated on the canopy page.",
      },
      {
        question: "When were these prices checked?",
        answer:
          "Each row on this page was checked on Nov 21, 2026. The source link on the row is the company page. The prices were unchanged from the earlier check.",
      },
    ],
  },
  {
    slug: "table-and-chair-rental-comparison",
    kind: "prices",
    nav: "Tables and chairs",
    title: "Table and chair rental comparison",
    description:
      "Table and chair rental prices in College Station and Bryan from each company's own website. Checked Nov 22, 2026.",
    eyebrow: "Tables and chairs",
    h1: "Table and chair rental comparison",
    lede:
      "Published table and chair prices for a party. Each row is one item from the company's own page. This page does not add the rows into a total.",
    tableCaption: "Table and chair rental prices",
    categories: ["table", "chair"],
    after:
      "Koozie's Premier Party Rentals lists no tables or chairs on its site. It lists a 10x10 canopy at $50, and that row stays on the tent page. The Backyard Jump and Freedom Fun USA do not list table or chair prices. Another inflatable company that was checked lists bounce houses only. Mission Inflatables also lists a 10x10 tent at $225 and a 20x40 tent at $650. Those stay on the tent page. Mission lists the same table and chair amount from 1 hour through per day. Delivery is calculated at checkout and is separate. Jump Around BCS uses a 4 hour standard rental. Those prices exclude sales tax, and the FAQ states a $50 deposit. The listed price includes setup and delivery. Bounce House Rentals BCS LLC does not state a rental window on the table or chair pages. For College Station Tent and Event Rentals, the rental window is not stated on the product page. The homepage says professional delivery, setup, and teardown are included. A delivery fee, tax, and deposit are not stated. BCS Party Rentals is unverified. The tables and chairs page would not load on Nov 22, 2026, so no price is filled in. A party total is not computed or estimated.",
    faqs: [
      {
        question: "Do prices include delivery and setup?",
        answer:
          "It depends on the company. Jump Around BCS says the listed price includes setup and delivery. Mission Inflatables calculates delivery at checkout, separate from the item price. College Station Tent and Event Rentals says professional delivery, setup, and teardown are included. A delivery fee was not stated on those pages. Bounce House Rentals BCS LLC says they deliver and set up. A delivery fee was not stated on the item pages. Read the delivery column before you compare two prices.",
      },
      {
        question: "What is the rental window?",
        answer:
          "Mission Inflatables lists the same price from 1 hour through per day. Jump Around BCS uses a 4 hour standard rental. College Station Tent and Event Rentals does not state a rental window on the product page. Bounce House Rentals BCS LLC does not state one on the table or chair pages. The window is on each row.",
      },
      {
        question: "Is tax included?",
        answer:
          "Jump Around BCS states that prices do not include sales tax. On the other product pages in this table, sales tax was not stated. That is not the same as tax-free.",
      },
      {
        question: "Why are some rows unverified?",
        answer:
          "BCS Party Rentals has two rows with no price. The tables and chairs page would not load on Nov 22, 2026, so the price was not confirmed. Those rows say Unverified and the price is blank.",
      },
      {
        question: "Where does each price come from?",
        answer:
          "Each price comes from that company's own public page. The source link is on the row. These rows were checked on Nov 22, 2026. Nothing on this page was estimated.",
      },
    ],
  },
  {
    slug: "whats-included",
    kind: "companies",
    nav: "What's included",
    title: "What's included: delivery, setup, and fees",
    description:
      "Delivery, setup, rental time, and fees by party rental company in College Station and Bryan. Taken from each company's own site. Checked Nov 19 to Nov 28, 2026.",
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
