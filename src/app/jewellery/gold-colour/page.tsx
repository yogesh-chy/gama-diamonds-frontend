import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoldColourClient from "./GoldColourClient";

export const metadata = {
  title: "Gold Colour Jewellery | Gama Jewels – Fine Yellow Gold Jewellery",
  description:
    "Discover our exquisite Gold Colour jewellery collection — earrings, necklaces, bracelets, and rings crafted in warm yellow, white and rose gold tones.",
};

export default function GoldColourPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <GoldColourClient />
      <Footer />
    </div>
  );
}

/* ─────────────────────────────────────────
   ARCHIVED MOCK DATA (NO LONGER USED)
   ───────────────────────────────────────── */

const GOLD_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18k Yellow Gold",
  "18ct Rose Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "Platinum",
];

const GOLD_CARATS = [
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

const GOLD_COLOUR_PRODUCTS = [
  {
    id: "gc-01",
    title: "Round Brilliant Diamond Solitaire Pendant in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 1650,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.50ct",
    style: "Solitaire Pendant",
  },
  {
    id: "gc-02",
    title: "Princess Cut Diamond Stud Earrings in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 980,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.40ct",
    style: "Stud Earrings",
  },
  {
    id: "gc-03",
    title: "Round Diamond Tennis Bracelet in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 4850,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "Tennis Bracelet",
  },
  {
    id: "gc-04",
    title: "Oval Cut Sapphire & Diamond Ring in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2450,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.70ct",
    style: "Statement Ring",
  },
  {
    id: "gc-05",
    title: "Emerald Cut Diamond Halo Pendant in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 890,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.30ct",
    style: "Halo Pendant",
  },
  {
    id: "gc-06",
    title: "Round Brilliant Diamond Hoop Earrings in 18K White Gold",
    metal: "18K White Gold",
    price: 1250,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.25ct",
    style: "Hoop Earrings",
  },
  {
    id: "gc-07",
    title: "Cushion Cut Diamond Solitaire Ring in 18ct White Gold",
    metal: "18ct White Gold",
    price: 3250,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Solitaire Ring",
  },
  {
    id: "gc-08",
    title: "Princess Cut Diamond Eternity Band in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1980,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.90ct",
    style: "Eternity Band",
  },
  {
    id: "gc-09",
    title: "Round Cut Diamond Drop Earrings in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 1450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.40ct",
    style: "Drop Earrings",
  },
  {
    id: "gc-10",
    title: "Oval Diamond Bangle in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2890,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.70ct",
    style: "Bangle",
  },
  {
    id: "gc-11",
    title: "Brilliant Cut Diamond Pave Necklace in 9K White Gold",
    metal: "9K White Gold",
    price: 760,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.20ct",
    style: "Pave Necklace",
  },
  {
    id: "gc-12",
    title: "Heart Diamond Pendant in 18k Rose Gold",
    metal: "18k Rose Gold",
    price: 1100,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.30ct",
    style: "Heart Pendant",
  },
];
