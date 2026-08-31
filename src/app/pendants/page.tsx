import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Pendants | Gama Jewels – Fine Diamond Pendants",
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

export default function PendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
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
