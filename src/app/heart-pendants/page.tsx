import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Heart Pendants | Gama Jewels – Fine Diamond Pendants",
  description:
    "Explore our romantic collection of diamond heart pendants in 18ct white gold, yellow gold, and rose gold.",
};

const HEART_PENDANT_METALS = [
  "18ct White Gold",
  "18ct Yellow Gold",
  "18ct Rose Gold",
];

const HEART_PENDANT_CARATS = ["0.55ct"];

const HEART_PENDANT_PRODUCTS: ProductItem[] = [
  {
    id: "hp-01",
    title: "Heart Diamond Solitaire Pendant in 18ct White Gold",
    metal: "18ct White Gold",
    price: 580,
    badge: "BESTSELLER",
    inStock: true,
    carat: "0.55ct",
  },
  {
    id: "hp-02",
    title: "Classic Heart Diamond Pendant in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 650,
    badge: "POPULAR",
    inStock: true,
    carat: "0.55ct",
  },
  {
    id: "hp-03",
    title: "Romantic Heart Diamond Halo Pendant in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 720,
    badge: "EXCLUSIVE",
    inStock: true,
    carat: "0.55ct",
  },
  {
    id: "hp-04",
    title: "Vintage Heart Cut Diamond Pendant in 18ct White Gold",
    metal: "18ct White Gold",
    price: 540,
    badge: "NEXT DAY",
    inStock: true,
    carat: "0.55ct",
  },
  {
    id: "hp-05",
    title: "Pave Heart Diamond Pendant in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 690,
    badge: "NEW",
    inStock: true,
    carat: "0.55ct",
  },
  {
    id: "hp-06",
    title: "Fine Heart Solitaire Diamond Pendant in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 760,
    badge: "POPULAR",
    inStock: true,
    carat: "0.55ct",
  },
];

export default function HeartPendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={HEART_PENDANT_PRODUCTS}
        categoryTitle="Heart Pendants"
        customMetals={HEART_PENDANT_METALS}
        customCarats={HEART_PENDANT_CARATS}
        defaultMinPrice={510}
        defaultMaxPrice={780}
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
