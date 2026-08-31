import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoseGoldClient from "./RoseGoldClient";

export const metadata = {
  title: "Rose Gold Jewellery | Gama Jewels – Fine Rose Gold Jewellery",
  description:
    "Shop our romantic Rose Gold jewellery collection — blush-toned earrings, pendants, bracelets, and rings crafted in 9K and 18K rose gold.",
};

export default function RoseGoldPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <RoseGoldClient />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────
   ARCHIVED MOCK DATA (NO LONGER USED)
   ───────────────────────────────────────── */

const ROSE_GOLD_METALS = [
  "9K Rose Gold",
  "18ct Rose Gold",
  "18K Rose Gold",
  "18k Rose Gold",
];

const ROSE_GOLD_CARATS = [
  "0.20ct",
  "0.25ct",
  "0.30ct",
  "0.40ct",
  "0.50ct",
  "0.70ct",
  "0.90ct",
  "1.00ct",
  "1.20ct",
];

const ROSE_GOLD_PRODUCTS = [
  {
    id: "rg-01",
    title: "Round Brilliant Diamond Halo Ring in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 2450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.70ct",
    style: "Halo Ring",
  },
  {
    id: "rg-02",
    title: "Heart Diamond Solitaire Pendant in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 1100,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.30ct",
    style: "Heart Pendant",
  },
  {
    id: "rg-03",
    title: "Round Cut Diamond Stud Earrings in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 890,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.25ct",
    style: "Stud Earrings",
  },
  {
    id: "rg-04",
    title: "Emerald Cut Morganite & Diamond Ring in 18k Rose Gold",
    metal: "18k Rose Gold",
    price: 1980,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.50ct",
    style: "Gemstone Ring",
  },
  {
    id: "rg-05",
    title: "Round Diamond Pave Tennis Bracelet in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 3850,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "Tennis Bracelet",
  },
  {
    id: "rg-06",
    title: "Princess Cut Diamond Drop Earrings in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 1450,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.40ct",
    style: "Drop Earrings",
  },
  {
    id: "rg-07",
    title: "Oval Diamond Bangle in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 760,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.20ct",
    style: "Diamond Bangle",
  },
  {
    id: "rg-08",
    title: "Cushion Cut Pink Sapphire & Diamond Necklace in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 2890,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.90ct",
    style: "Gemstone Necklace",
  },
  {
    id: "rg-09",
    title: "Round Brilliant Diamond Full Eternity Band in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 4200,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Eternity Band",
  },
  {
    id: "rg-10",
    title: "Diamond Halo Stud Earrings in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 1350,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.50ct",
    style: "Halo Stud Earrings",
  },
  {
    id: "rg-11",
    title: "Oval Morganite Solitaire Ring in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 590,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.30ct",
    style: "Solitaire Ring",
  },
  {
    id: "rg-12",
    title: "Round Diamond Cluster Pendant in 18k Rose Gold",
    metal: "18k Rose Gold",
    price: 1680,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.70ct",
    style: "Cluster Pendant",
  },
];
