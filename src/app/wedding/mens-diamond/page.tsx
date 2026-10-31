import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Men's Diamond Wedding Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our collection of men's diamond wedding rings handcrafted by master goldsmiths in our Mumbai atelier.",
};

const MENS_DIAMOND_METALS = [
  "9KT White Gold",
  "9KT Yellow Gold",
  "9KT Rose Gold",
  "10KT White Gold",
  "10KT Yellow Gold",
  "10KT Rose Gold",
  "14KT White Gold",
  "14KT Yellow Gold",
  "14KT Rose Gold",
  "18KT White Gold",
  "18KT Yellow Gold",
  "18KT Rose Gold",
  "Platinum",
];

export default function MensDiamondPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Men's Diamond Wedding Rings"
        customMetals={MENS_DIAMOND_METALS}
        defaultMinPrice={0}
        defaultMaxPrice={50000}
        hideDiamondType={false}
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
