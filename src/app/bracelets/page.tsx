import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Bracelets & Bangles | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone bracelets and bangles. Crafted by master goldsmiths in Mumbai.",
};

const BRACELET_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18k White Gold",
  "18k Yellow Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "Platinum",
  "18K 3 Tone",
];

const BRACELET_CARATS = ["12.30ct", "12.50ct"];

const BRACELET_STYLES = [
  "All Bracelets",
  "Bracelet & Bangle",
  "Only Bracelets",
  "Tennis Bracelet",
];

export default function BraceletsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Bracelets & Bangles"
        customMetals={BRACELET_METALS}
        customCarats={BRACELET_CARATS}
        customStyles={BRACELET_STYLES}
        hideDiamondType={false}
        hideCarat={false}
        hideStyle={false}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
