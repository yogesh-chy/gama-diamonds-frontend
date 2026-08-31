import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Hoop Earrings | Gama Jewels – Fine Diamond Hoop Earrings",
  description:
    "Shop our luxurious collection of diamond hoop & drop earrings crafted in 9K, 18K white gold, yellow gold, rose gold, and platinum.",
};

const HOOP_EARRINGS_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const HOOP_EARRINGS_STYLES = [
  "Drop Earrings",
  "Earring",
  "Hoop Earrings",
  "STYLE: HOOPS",
  "Stud Earrings",
];

export default function HoopEarringsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Earrings"
        customMetals={HOOP_EARRINGS_METALS}
        customStyles={HOOP_EARRINGS_STYLES}
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
