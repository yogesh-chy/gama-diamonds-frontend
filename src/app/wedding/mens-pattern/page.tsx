import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Men's Patterned Wedding Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our collection of men's patterned & textured wedding rings handcrafted by master goldsmiths in our Mumbai atelier.",
};

const MENS_PATTERN_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "10K White Gold",
  "10K Yellow Gold",
  "10K Rose Gold",
  "14K White Gold",
  "14K Yellow Gold",
  "14K Rose Gold",
  "18K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "Platinum",
  "10K Rose & White",
  "10K Yellow & White",
  "14K Rose & White",
  "14K Yellow & White",
  "18K Rose & White",
  "18K Yellow & White",
  "9K Rose & White",
  "9K Yellow & White",
];

export default function MensPatternPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Men's Patterned Wedding Rings"
        customMetals={MENS_PATTERN_METALS}
        defaultMinPrice={0}
        defaultMaxPrice={50000}
        hideDiamondType={true}
        hideCarat={true}
        hideColor={true}
        customStyles={[]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
