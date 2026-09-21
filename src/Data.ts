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

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Ankara Bomber Jacket",
    category: "Fashion",
    price: 38500,
    blurb: "Hand-cut Ankara panels on a lined, lightweight bomber.",
    icon: Shirt,
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
