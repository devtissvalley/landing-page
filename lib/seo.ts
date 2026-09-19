// lib/seo.ts
//
// Single source of truth for the facts search engines and AI answer engines
// read about the property. Everything here is already stated somewhere on the
// site (footer NAP, the distances table, the location map marker, the villa
// and amenity lists) — nothing is invented. If a fact changes, change it here
// and in lib/data.tsx together.

export const SITE_URL = "https://tissvalley.com";

export const BUSINESS = {
  name: "TISS Valley",
  legalName: "TISS Valley",
  // Footer, components/Footer.tsx
  streetAddress: "Jl. Sebatu",
  locality: "Sebatu",
  region: "Bali",
  // Sebatu sits in the Tegallalang district of Gianyar Regency
  district: "Tegallalang",
  county: "Gianyar",
  country: "ID",
  telephone: "+62 811 3980 8151",
  whatsapp: "https://wa.me/6281139808151",
  // Map marker used by the embed on /location
  latitude: -8.368862,
  longitude: 115.306984,
  villaCount: 6,
} as const;

export const DEFAULT_OG_IMAGE = {
  url: "/og/tiss-valley-pool-villas-sebatu-bali.jpg",
  width: 1200,
  height: 630,
  alt: "Pool villas set into the highland rice terraces above Sebatu, Bali",
};

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

/**
 * Amenities the site actually lists (lib/data.tsx `experienceData` and
 * `villaFeatures`). Kept as a flat list so the schema stays in step with the
 * on-page copy.
 */
const AMENITIES = [
  "Private plunge pool in every villa",
  "Valley view",
  "Wi-Fi throughout",
  "In-villa spa treatments",
  "Yoga deck",
  "Plant-based dining at Rassa",
  "Concierge service",
  "Air conditioning",
] as const;

/** Nearby points of interest, with the drive times shown on the page. */
export const NEARBY = [
  { name: "Tegallalang Rice Terraces", time: "8 min" },
  { name: "Tirta Empul Temple", time: "15 min" },
  { name: "Ubud Centre", time: "25 min" },
  { name: "Ngurah Rai International Airport (DPS)", time: "1 hr 40 min" },
] as const;

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
export const LODGING_ID = `${SITE_URL}/#lodging`;

const postalAddress = {
  "@type": "PostalAddress",
  streetAddress: BUSINESS.streetAddress,
  addressLocality: BUSINESS.locality,
  addressRegion: BUSINESS.region,
  addressCountry: BUSINESS.country,
};

/**
 * The property itself. Typed as a Resort (a subtype of LodgingBusiness) —
 * six villas plus wellness and dining on site, which is what the page
 * describes. No rating, price or review is asserted because the site states
 * none.
 */
export const lodgingSchema = {
  "@type": "Resort",
  "@id": LODGING_ID,
  name: BUSINESS.name,
  description:
    "Six one-bedroom pool villas set into the highland rice terraces of Sebatu, above Tegallalang in Gianyar, Bali — roughly 25 minutes north of central Ubud.",
  url: SITE_URL,
  telephone: BUSINESS.telephone,
  image: absoluteUrl(DEFAULT_OG_IMAGE.url),
  logo: absoluteUrl("/logo/tiss-valley.png"),
  address: postalAddress,
  geo: {
    "@type": "GeoCoordinates",
    latitude: BUSINESS.latitude,
    longitude: BUSINESS.longitude,
  },
  numberOfRooms: {
    "@type": "QuantitativeValue",
    value: BUSINESS.villaCount,
    unitText: "villa",
  },
  amenityFeature: AMENITIES.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  })),
  containedInPlace: {
    "@type": "Place",
    name: "Sebatu, Tegallalang, Gianyar, Bali",
  },
  parentOrganization: { "@id": ORGANIZATION_ID },
  sameAs: [BUSINESS.whatsapp],
};

export const organizationSchema = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: BUSINESS.name,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: absoluteUrl("/logo/tiss-valley.png"),
    width: 2084,
    height: 2084,
  },
  address: postalAddress,
  telephone: BUSINESS.telephone,
  sameAs: [BUSINESS.whatsapp],
};

export const websiteSchema = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: BUSINESS.name,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

/** Breadcrumb trail for a detail page. */
export const breadcrumbSchema = (
  trail: { name: string; path: string }[],
) => ({
  "@type": "BreadcrumbList",
  itemListElement: [
    { name: "Home", path: "/" },
    ...trail,
  ].map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.path),
  })),
});

export const webPageSchema = ({
  path,
  name,
  description,
}: {
  path: string;
  name: string;
  description: string;
}) => ({
  "@type": "WebPage",
  "@id": `${absoluteUrl(path)}#webpage`,
  url: absoluteUrl(path),
  name,
  description,
  inLanguage: "en",
  isPartOf: { "@id": WEBSITE_ID },
  about: { "@id": LODGING_ID },
});

/**
 * Wraps nodes in a single @graph so every entity can cross-reference the
 * others by @id instead of repeating itself.
 */
export const jsonLdGraph = (...nodes: object[]) =>
  JSON.stringify(
    { "@context": "https://schema.org", "@graph": nodes },
    // Drop keys we deliberately left undefined rather than emit nulls.
    (_key, value) => (value === undefined ? undefined : value),
  );

/**
 * Traveller questions answered with facts already published on the site
 * (drive times from `distances`, villa specs from the villas page, contact
 * details from the footer). These render as a visible section on the landing
 * page — the schema below only mirrors what a visitor can read.
 */
export const FAQS = [
  {
    question: "Where is TISS Valley?",
    answer:
      "TISS Valley is in Sebatu, a highland village above the Tegallalang rice terraces in Gianyar Regency, Bali. It sits about 25 minutes' drive north of central Ubud.",
  },
  {
    question: "Is TISS Valley in Ubud?",
    answer:
      "Not in Ubud itself. The villas are in Sebatu, in the highland north of Ubud — close enough for a morning in town, far enough that the noise stays behind you. Central Ubud is roughly a 25-minute drive.",
  },
  {
    question: "How far is TISS Valley from the Tegallalang Rice Terraces?",
    answer:
      "About 8 minutes by car. Tirta Empul Temple is around 15 minutes away, central Ubud about 25 minutes, and Ngurah Rai International Airport (DPS) roughly 1 hour 40 minutes.",
  },
  {
    question: "How many villas are there, and does each one have a pool?",
    answer:
      "Six one-bedroom villas, each with its own private plunge pool and an uninterrupted valley view. Every villa is set individually into the terracing, and each suits two adults.",
  },
  {
    question: "What is included at the villas?",
    answer:
      "A private plunge pool, a valley view, air conditioning and Wi-Fi throughout, plus in-villa spa treatments, morning yoga on the deck, plant-based dining and concierge care on the property.",
  },
  {
    question: "What is there to do nearby?",
    answer:
      "The Tegallalang Rice Terraces are about 8 minutes away and the spring-fed temple at Tirta Empul about 15. On the property there are in-villa Balinese spa treatments, morning yoga facing the terraces, and Rassa, the plant-based restaurant at the entrance.",
  },
  {
    question: "Is there a restaurant on site?",
    answer:
      "Rassa, a plant-based restaurant at the front of the property, is opening soon. It will be open to villa guests and to visitors arriving from the road.",
  },
  {
    question: "How do I book a villa at TISS Valley?",
    answer:
      `Send an enquiry through the reservation form on this site, or contact the property directly by phone or WhatsApp on ${BUSINESS.telephone}. Availability is limited to six villas, so dates are confirmed directly.`,
  },
] as const;

export const faqSchema = () => ({
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
});
