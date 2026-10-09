// lib/data.tsx
import CountUp from "@/components/CountUp";

export const navLinks = ["THE VALLEY", "VILLAS", "WELLNESS"];

export const statsData = [
  {
    icon: "/icons/oat/TISS_ICON_OAT_POOL.png",
    value: <CountUp to={6} />,
    subtitle: "PRIVATE POOL VILLAS",
    desc: "Thoughtfully designed for privacy and ultimate relaxation.",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_SUNSET VIEW.png",
    value: "Valley Views",
    subtitle: "OVERLOOKING NATURE",
    desc: "Enjoy sweeping views of lush valleys and tropical greenery.",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_AROMATHERAPY.png",
    value: <CountUp to={1} />,
    subtitle: "PLANT-BASED RESTAURANT",
    desc: "RASSA - wholesome, conscious dining in harmony with nature.",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_BREEZE.png",
    value: "Sebatu",
    subtitle: "ABOVE THE TEGALLALANG TERRACES",
    desc: "A peaceful highland retreat just minutes from Ubud.",
  },
];

export const brandEssences = [
  {
    title: "Stillness over spectacle",
    desc: "We protect quiet, we don’t fill it.",
  },
  {
    title: "Privacy is the luxury",
    desc: "Six villas, not sixty. Room to disappear.",
  },
  {
    title: "Of the valley",
    desc: "Local materials, produce grown for a light footprint.",
  },
  { title: "Care without fuss", desc: "Warm, unhurried, never performed." },
];

// Beds24 property id for Tiss Valley (live availability on /reserve).
export const BEDS24_PROPERTY_ID = 355365;

// Online payment on /reserve (Midtrans). `percent` is the share of the stay
// price charged at booking: 100 = pay in full, e.g. 30 = 30% deposit.
// `expiryMinutes` is how long the guest has to pay before the held booking
// is released. Both are placeholders until the client confirms them.
export const PAYMENT = {
  percent: 100,
  expiryMinutes: 60,
};

// Villa types — the same list on the home page, /villas and /reserve.
// Mirrored from Beds24 property 355365: `roomId` is the Beds24 room type id;
// `units` and `maxGuests` copy its qty and maxPeople there, so update both
// places together. Photos are placeholders until each type has its own shot.
export const villas = [
  {
    roomId: 732360, // Beds24: "King Room with Pool View"
    name: "Pool View Villa",
    caption: "Looking out over its own plunge pool, set into the terracing.",
    view: "Pool View",
    src: "/assets/villa/upper-suite.webp",
    units: 3,
    maxGuests: 2,
  },
  {
    roomId: 732361, // Beds24: "King Room with Mountain View"
    name: "Mountain View Villa",
    caption: "Facing the highland ridgeline above Sebatu, first light at the door.",
    view: "Mountain View",
    src: "/assets/villa/lower-suite.webp",
    units: 2,
    maxGuests: 2,
  },
  {
    roomId: 732362, // Beds24: "King Room with Garden View"
    name: "Garden View Villa",
    caption: "Ground level, surrounded by planting on every side.",
    view: "Garden View",
    src: "/assets/villa/garden-villa.webp",
    units: 1,
    maxGuests: 2,
  },
];

// Fitur list untuk section THE VILLAS
export const villaFeatures = [
  {
    icon: "/icons/green/TISS_ICON_GREEN_POOL.png",
    text: "Private plunge pool in every villa",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_MOUNTAIN VIEW.png",
    text: "Uninterrupted valley view",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_BEDROOM.png",
    text: "One bedroom, individually set",
  },
];

export const wellnessFeatures = [
  {
    icon: "/icons/green/TISS_ICON_GREEN_WELLNESS.png",
    title: "In-villa spa treatments",
    src: "/assets/spaa.webp",
    desc: "Balinese massage and body treatments brought to your terrace, fresh around you.",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_SUN DECK.png",
    title: "Morning yoga on the deck",
    src: "/assets/morning-yoga.webp",
    desc: "Private or small-group sessions facing the terraces, at first light.",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_DINING AREA.png",
    title: "Plant-based dining at Rassa",
    src: "/assets/rassa.webp",
    desc: "Our front-of-property restaurant, built around what is grown, seasonal ingredients.",
  },
];

export const experienceData = [
  { icon: "/icons/green/TISS_ICON_GREEN_WI FI.png", label: "Wi-Fi throughout" },
  { icon: "/icons/green/TISS_ICON_GREEN_POOL.png", label: "Private pool" },
  {
    icon: "/icons/green/TISS_ICON_GREEN_WELLNESS.png",
    label: "Spa treatments",
  },
  { icon: "/icons/green/TISS_ICON_GREEN_SUN DECK.png", label: "Yoga deck" },
  {
    icon: "/icons/green/TISS_ICON_GREEN_DINING AREA.png",
    label: "Plant-based dining",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_CONCIERGE.png",
    label: "Concierge care",
  },
];

export const distances = [
  { place: "Tegallalang Rice Terraces", time: "8 min" },
  { place: "Ubud Centre", time: "25 min" },
  { place: "Tirta Empul Temple", time: "15 min" },
  { place: "Ngurah Rai Airport (DPS)", time: "1 hr 40 min" },
];

// --- LOCATION DETAIL PAGE ---

export const locationFacts = [
  { label: "SETTING", value: "Sebatu, above Tegallalang" },
  { label: "CLIMATE", value: "Highland, cool mornings" },
  { label: "AIRPORT", value: "1 hr 40 min (DPS)" },
];

// --- RASSA DETAIL PAGE ---

export const rassaIdeas = [
  {
    icon: "/icons/oat/TISS_ICON_OAT_SUSTAINABLE.png",
    title: "Plant-based, always",
    desc: "No animal on the core menu — vegetables, grains and fruit from the valley, treated as the main event.",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_WELCOME.png",
    title: "Open to everyone",
    desc: "A public restaurant at the entrance — villa guests walk in from their stay, visitors arrive from the road.",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_DINING AREA.png",
    title: "Restrained, not loud",
    desc: "Same restraint as the villas — quality over spectacle, and a room that stays as quiet as the terraces outside.",
  },
];

export const rassaFacts = [
  { label: "LOCATION", value: "Front of TISS Valley" },
  { label: "ACCESS", value: "Guests & public" },
  { label: "STATUS", value: "Opening soon" },
];
