import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Eternity Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond eternity rings. Crafted by master goldsmiths in Mumbai.",
};

const ETERNITY_PRODUCTS: ProductItem[] = [
  {
    id: "et-01",
    title: "Round Brilliant Full Eternity Diamond Ring in 18ct White Gold",
    metal: "18ct White Gold",
    price: 3450,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "2.00ct",
    style: "Full Eternity",
  },
  {
    id: "et-02",
    title: "Emerald Cut Half Eternity Diamond Band in Platinum",
    metal: "Platinum",
    price: 2890,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.50ct",
    style: "Half Eternity",
  },
  {
    id: "et-03",
    title: "Princess Cut Channel Set Eternity Band in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2150,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "1.20ct",
    style: "Half Eternity",
  },
  {
    id: "et-04",
    title: "Cushion Cut Micro-Pave Full Eternity Ring in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 4200,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "2.50ct",
    style: "Full Eternity",
  },
  {
    id: "et-05",
    title: "Round Diamond & Blue Sapphire Half Eternity Band in 9K White Gold",
    metal: "9K White Gold",
    price: 1980,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "1.00ct",
    style: "Half Eternity",
  },
  {
    id: "et-06",
    title: "Baguette Cut & Round Diamond Alternating Full Eternity Ring in Platinum",
    metal: "Platinum",
    price: 5400,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "3.00ct",
    style: "Full Eternity",
  },
  {
    id: "et-07",
    title: "Seven Stone Round Brilliant Diamond Wedding Ring in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 1250,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.75ct",
    style: "Seven Stone",
  },
  {
    id: "et-08",
    title: "Oval Cut Diamond Claw Set Half Eternity Ring in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 3650,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.80ct",
    style: "Half Eternity",
  },
];

export default function EternityRingsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={ETERNITY_PRODUCTS}
        categoryTitle="Eternity Rings"
        customStyles={["Full Eternity", "Half Eternity", "Seven Stone", "Micro-Pave", "STYLE: FULL ETERNITY", "STYLE: HALF ETERNITY"]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
