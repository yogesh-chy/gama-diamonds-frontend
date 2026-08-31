import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Solitaire Studs | Gama Jewels – Fine Diamond Earrings",
  description:
    "Discover our collection of timeless solitaire diamond stud earrings in white gold, yellow gold, rose gold, and platinum.",
};

const SOLITAIRE_STUDS_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const SOLITAIRE_STUDS_STYLES = [
  "Earring",
  "STYLE: STUDS",
  "Stud Earrings",
];

export default function SolitaireStudsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Earrings"
        customMetals={SOLITAIRE_STUDS_METALS}
        customStyles={SOLITAIRE_STUDS_STYLES}
        hideDiamondType={false}
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
