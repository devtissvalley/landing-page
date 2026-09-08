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

export const villas = [
  {
    name: "Terrace Villa",
    caption: "Steps into the terracing, first light at the door.",
    src: "/assets/villa-terrace.webp",
    span: "md:row-span-2",
  },
  {
    name: "Garden Villa",
    caption: "Ground level, surrounded by planting on every side.",
    src: "/assets/villa-garden.webp",
    span: "",
  },
  {
    name: "End Villa",
    caption: "Furthest from the gate, closest to the treeline.",
    src: "/assets/villa-end.webp",
    span: "",
  },
  {
    name: "Stone Villa",
    caption: "Volcanic stone walls, open-air soaking tub.",
    src: "/assets/villa-stone.webp",
    span: "",
  },
  {
    name: "Canopy Villa",
    caption: "Raised deck, dining in the open air.",
    src: "/assets/villa-canopy.webp",
    span: "",
  },
  {
    name: "Spring Villa",
    caption: "Nearest the spring-fed pool at the valley floor.",
    src: "/assets/villa-spring.webp",
    span: "",
  },
];

// Fitur list untuk section THE VILLAS
export const villaFeatures = [
  {
    icon: "/icons/oat/TISS_ICON_OAT_POOL.png",
    text: "Private plunge pool in every villa",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_MOUNTAIN VIEW.png",
    text: "Uninterrupted valley view",
  },
  {
    icon: "/icons/oat/TISS_ICON_OAT_BEDROOM.png",
    text: "One bedroom, individually set",
  },
];

export const wellnessFeatures = [
  {
    icon: "/icons/green/TISS_ICON_GREEN_WELLNESS.png",
    title: "In-villa spa treatments",
    desc: "Balinese massage and body treatments brought to your terrace, fresh around you.",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_SUN DECK.png",
    title: "Morning yoga on the deck",
    desc: "Private or small-group sessions facing the terraces, at first light.",
  },
  {
    icon: "/icons/green/TISS_ICON_GREEN_DINING AREA.png",
    title: "Plant-based dining at Rassa",
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
