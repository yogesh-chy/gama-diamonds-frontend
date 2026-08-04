import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Pendants | Gama Diamond – Fine Diamond Pendants",
  description:
    "Discover our collection of handcrafted diamond pendants including Cross Pendants, Heart Pendants, and Solitaire Pendants in 18K gold.",
};

const PENDANT_METALS = [
  "18K White Gold",
  "18K Yellow Gold",
];

const PENDANT_STYLES = [
  "Cross Pendant",
  "Heart Pendant",
  "Pendant",
];

const PENDANT_PRODUCTS: ProductItem[] = [
  {
    id: "pd-01",
    title: "Round Diamond Solitaire Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 1650,
    badge: "BESTSELLER",
    inStock: true,
    style: "Pendant",
  },
  {
    id: "pd-02",
    title: "Classic Diamond Cross Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2450,
    badge: "POPULAR",
    inStock: true,
    style: "Cross Pendant",
  },
  {
    id: "pd-03",
    title: "Heart Shaped Diamond Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 1980,
    badge: "EXCLUSIVE",
    inStock: true,
    style: "Heart Pendant",
  },
  {
    id: "pd-04",
    title: "Vintage Cross Diamond Pendant in 18K White Gold",
    metal: "18K White Gold",
    price: 2150,
    badge: "NEW",
    inStock: true,
    style: "Cross Pendant",
  },
  {
    id: "pd-05",
    title: "Elegant Solitaire Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1450,
    badge: "NEXT DAY",
    inStock: true,
    style: "Pendant",
  },
  {
    id: "pd-06",
    title: "Romantic Heart Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1890,
    badge: "POPULAR",
    inStock: true,
    style: "Heart Pendant",
  },
];

export default function PendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={PENDANT_PRODUCTS}
        categoryTitle="Pendants"
        customMetals={PENDANT_METALS}
        customStyles={PENDANT_STYLES}
        hideDiamondType={true}
        hideCarat={true}
        hideStyle={false}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
