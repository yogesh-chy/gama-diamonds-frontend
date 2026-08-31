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

export default function CrossPendantsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
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
