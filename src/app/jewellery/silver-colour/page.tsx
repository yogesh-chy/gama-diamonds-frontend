import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Silver Colour Jewellery | Gama Jewels – Fine White Gold & Platinum Jewellery",
  description:
    "Explore our Silver Colour jewellery collection — timeless pieces crafted in sterling silver, white gold, and platinum tones.",
};

const SILVER_METALS = [
  "9K White Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "Platinum",
];

const SILVER_CARATS = [
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

const SILVER_COLOUR_PRODUCTS: ProductItem[] = [
  {
    id: "sc-01",
    title: "Round Brilliant Diamond Tennis Necklace in Platinum",
    metal: "Platinum",
    price: 5850,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Tennis Necklace",
  },
  {
    id: "sc-02",
    title: "Princess Cut Diamond Stud Earrings in 18ct White Gold",
    metal: "18ct White Gold",
    price: 980,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.40ct",
    style: "Stud Earrings",
  },
  {
    id: "sc-03",
    title: "Round Diamond Halo Ring in 18K White Gold",
    metal: "18K White Gold",
    price: 2450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.70ct",
    style: "Halo Ring",
  },
  {
    id: "sc-04",
    title: "Emerald Cut Diamond Drop Earrings in Platinum",
    metal: "Platinum",
    price: 3250,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.90ct",
    style: "Drop Earrings",
  },
  {
    id: "sc-05",
    title: "Round Diamond Pave Bracelet in 18ct White Gold",
    metal: "18ct White Gold",
    price: 1980,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.50ct",
    style: "Pave Bracelet",
  },
  {
    id: "sc-06",
    title: "Oval Cut Aquamarine & Diamond Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 1650,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.30ct",
    style: "Gemstone Pendant",
  },
  {
    id: "sc-07",
    title: "Round Brilliant Diamond Bangle in Platinum",
    metal: "Platinum",
    price: 7200,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "Diamond Bangle",
  },
  {
    id: "sc-08",
    title: "Cushion Cut Diamond Solitaire Pendant in 18ct White Gold",
    metal: "18ct White Gold",
    price: 1450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.50ct",
    style: "Solitaire Pendant",
  },
  {
    id: "sc-09",
    title: "Diamond Huggies Hoop Earrings in 18K White Gold",
    metal: "18K White Gold",
    price: 890,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.25ct",
    style: "Hoop Earrings",
  },
  {
    id: "sc-10",
    title: "Round Cut Sapphire & Diamond Cluster Ring in 9K White Gold",
    metal: "9K White Gold",
    price: 660,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "0.20ct",
    style: "Cluster Ring",
  },
  {
    id: "sc-11",
    title: "Brilliant Cut Full Eternity Band in Platinum",
    metal: "Platinum",
    price: 4100,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Eternity Band",
  },
  {
    id: "sc-12",
    title: "Marquise Cut Diamond Line Bracelet in 18ct White Gold",
    metal: "18ct White Gold",
    price: 2890,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.90ct",
    style: "Line Bracelet",
  },
];

export default function SilverColourPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={SILVER_COLOUR_PRODUCTS}
        categoryTitle="Silver Colour Jewellery"
        customMetals={SILVER_METALS}
        customCarats={SILVER_CARATS}
        defaultMinPrice={290}
        defaultMaxPrice={8700}
        hideDiamondType={false}
        hideCarat={false}
        hideColor={true}
        hideStyle={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
