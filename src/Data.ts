import {
  Backpack,
  Coffee,
  Footprints,
  Glasses,
  Headphones,
  Lamp,
  Shirt,
  Smartphone,
  Sofa,
  Sparkles,
  Speaker,
  Watch,
  type LucideIcon,
} from "lucide-react";

export type Category = "Fashion" | "Tech" | "Home" | "Beauty";

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number; // in naira
  blurb: string;
  icon: LucideIcon; // placeholder art. Set `image` to a real photo URL to replace it.
  image?: string;
  rating: number;
  reviews: number;
  tag?: string;
}

export const CATEGORIES: Array<"All" | Category> = [
  "All",
  "Fashion",
  "Tech",
  "Home",
  "Beauty",
];

/** Stable, real stock photo from Lorem Picsum — same seed always returns the same image. */
//const photo = (seed: string, w = 600, h = 750) =>
//  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ankara Bomber Jacket",
    category: "Fashion",
    price: 38500,
    blurb: "Hand-cut Ankara panels on a lined, lightweight bomber.",
    icon: Shirt,
    image:
      " https://images.unsplash.com/photo-1663044022726-889ee51a682e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 126,
    tag: "New",
  },
  {
    id: 2,
    name: "Leather Weekender Bag",
    category: "Fashion",
    price: 27000,
    blurb: "Full-grain leather with a padded laptop sleeve.",
    icon: Backpack,
    image:
      "https://plus.unsplash.com/premium_photo-1678739395192-bfdd13322d34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TGVhdGhlciUyMFdlZWtlbmRlciUyMEJhZ3xlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.6,
    reviews: 84,
  },
  {
    id: 3,
    name: "Everyday Court Sneakers",
    category: "Fashion",
    price: 32000,
    blurb: "Cushioned insole, easy-clean upper, goes with everything.",
    icon: Footprints,
    image:
      "https://images.unsplash.com/photo-1629097499121-290fd9a95dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fEV2ZXJ5ZGF5JTIwQ291cnQlMjBTbmVha2Vyc3xlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.7,
    reviews: 212,
  },
  {
    id: 4,
    name: "Tinted Sunglasses",
    category: "Fashion",
    price: 9500,
    blurb: "UV400 lenses in a light acetate frame.",
    icon: Glasses,
    image:
      "https://images.unsplash.com/photo-1590564310418-66304f55a2c2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fFRpbnRlZCUyMFN1bmdsYXNzZXN8ZW58MHx8MHx8fDA%3D",
    rating: 4.4,
    reviews: 57,
  },
  {
    id: 5,
    name: "Noise-Cancelling Headphones",
    category: "Tech",
    price: 85000,
    blurb: "40-hour battery, foldable, works with any phone.",
    icon: Headphones,
    image:
      "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fE5vaXNlLUNhbmNlbGxpbmclMjBIZWFkcGhvbmVzfGVufDB8fDB8fHww",
    rating: 4.9,
    reviews: 341,
    tag: "Best seller",
  },
  {
    id: 6,
    name: "Smartwatch Series K",
    category: "Tech",
    price: 62000,
    blurb: "Heart-rate, sleep tracking and 7-day battery.",
    icon: Watch,
    image:
      "https://images.unsplash.com/photo-1617043983671-adaadcaa2460?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fFNtYXJ0d2F0Y2h8ZW58MHx8MHx8fDA%3D",
    rating: 4.5,
    reviews: 98,
  },
  {
    id: 7,
    name: "Portable Bluetooth Speaker",
    category: "Tech",
    price: 24500,
    blurb: "Splash-proof, 12 hours of loud, clear sound.",
    icon: Speaker,
    image:
      "https://images.unsplash.com/photo-1588131153911-a4ea5189fe19?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8UG9ydGFibGUlMjBCbHVldG9vdGglMjBTcGVha2VyfGVufDB8fDB8fHww",
    rating: 4.6,
    reviews: 173,
  },
  {
    id: 8,
    name: "Android Phone 128GB",
    category: "Tech",
    price: 210000,
    blurb: "6.6-inch display, dual SIM, 50MP camera.",
    icon: Smartphone,
    image:
      "https://images.unsplash.com/photo-1612442443556-09b5b309e637?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QW5kcm9pZCUyMFBob25lJTIwMTI4R0J8ZW58MHx8MHx8fDA%3D",
    rating: 4.7,
    reviews: 265,
  },
  {
    id: 9,
    name: "Two-Seater Linen Sofa",
    category: "Home",
    price: 320000,
    blurb: "Solid-wood frame with removable, washable covers.",
    icon: Sofa,
    image:
      "https://images.unsplash.com/photo-1698936061086-2bf99c7b9fc5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8VHdvLVNlYXRlciUyMExpbmVuJTIwU29mYXxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.8,
    reviews: 41,
    tag: "Pay over time",
  },
  {
    id: 10,
    name: "Brass Reading Lamp",
    category: "Home",
    price: 18000,
    blurb: "Warm light, adjustable arm, weighted base.",
    icon: Lamp,
    image:
      "https://images.unsplash.com/photo-1773916398209-84b1a5d95763?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QnJhc3MlMjBSZWFkaW5nJTIwTGFtcHxlbnwwfHwwfHx8MA%3D%3D",
    rating: 4.5,
    reviews: 62,
  },
  {
    id: 11,
    name: "Stoneware Coffee Set",
    category: "Home",
    price: 14000,
    blurb: "Two mugs, two saucers, one small pour-over.",
    icon: Coffee,
    image:
      "https://images.unsplash.com/photo-1772485718316-8cd1d3838ffa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3RvbmV3YXJlJTIwQ29mZmVlJTIwU2V0fGVufDB8fDB8fHww",
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 12,
    name: "Shea & Aloe Glow Set",
    category: "Beauty",
    price: 11500,
    blurb: "Body butter, face cream and a lip balm, all fragrance-light.",
    icon: Sparkles,
    image:
      "https://images.unsplash.com/photo-1765794828819-83e10ceb321d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hlYSUyMCUyNiUyMEFsb2UlMjBHbG93JTIwU2V0fGVufDB8fDB8fHww",
    rating: 4.8,
    reviews: 154,
    tag: "New",
  },
];

// ---- Store rules -----------------------------------------------------------
export const DELIVERY_FEE = 2500;
export const FREE_DELIVERY_FROM = 50000;
export const MIN_PLAN_ORDER = 20000; // orders below this must be paid in full
export const PLAN_OPTIONS = [2, 3, 4] as const; // number of monthly payments
export type PlanMonths = 0 | (typeof PLAN_OPTIONS)[number]; // 0 = pay in full

// ---- Helpers ---------------------------------------------------------------
const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});
export const formatNaira = (n: number) => naira.format(n);

/** Each instalment, rounded up to the nearest ₦100 (matches the ₦100 Paystack base plan). */
export const installmentOf = (total: number, months: number) =>
  Math.ceil(total / months / 100) * 100;
