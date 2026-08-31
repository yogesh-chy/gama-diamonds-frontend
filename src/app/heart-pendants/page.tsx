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

export default function HeartPendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
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
