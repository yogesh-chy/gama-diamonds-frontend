import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Cross Pendants | Gama Jewels – Fine Diamond Cross Pendants",
  description:
    "Discover our collection of handcrafted diamond cross pendants in 18K white gold and 18K yellow gold across multiple carat sizes.",
};

const CROSS_PENDANT_METALS = [
  "18K White Gold",
  "18K Yellow Gold",
];

const CROSS_PENDANT_SIZES = [
  "0.11ct",
  "0.25ct",
  "0.50ct",
  "1.00ct",
  "1.10ct",
  "1.50ct",
  "2.00ct",
  "3.00ct",
];

const CROSS_PENDANT_PRODUCTS: ProductItem[] = [
  {
    id: "cp-01",
    title: "Classic Diamond Cross Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 1250,
    badge: "BESTSELLER",
    inStock: true,
    carat: "0.50ct",
  },
  {
    id: "cp-02",
    title: "Vintage Diamond Cross Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1850,
    badge: "POPULAR",
    inStock: true,
    carat: "1.00ct",
  },
  {
    id: "cp-03",
    title: "Petite Diamond Cross Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 650,
    badge: "NEXT DAY",
    inStock: true,
    carat: "0.25ct",
  },
  {
    id: "cp-04",
    title: "Large Statement Diamond Cross Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 3450,
    badge: "EXCLUSIVE",
    inStock: true,
    carat: "2.00ct",
  },
  {
    id: "cp-05",
    title: "Micro-Pave Diamond Cross Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 490,
    badge: "NEW",
    inStock: true,
    carat: "0.11ct",
  },
  {
    id: "cp-06",
    title: "Grand Diamond Cross Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 4850,
    badge: "EXCLUSIVE",
    inStock: true,
    carat: "3.00ct",
  },
];

export default function CrossPendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={CROSS_PENDANT_PRODUCTS}
        categoryTitle="Cross Pendants"
        customMetals={CROSS_PENDANT_METALS}
        customCarats={CROSS_PENDANT_SIZES}
        hideDiamondType={true}
        hideCarat={false}
        hideStyle={true}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
