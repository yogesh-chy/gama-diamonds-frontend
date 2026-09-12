import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Necklaces & Pendants | Cross, Heart & Solitaire Designs",
  description:
    "Explore handcrafted diamond necklaces & pendants — cross, heart & solitaire designs in 18ct gold & platinum. GIA certified diamonds, master goldsmith craftsmanship. Free insured delivery worldwide.",
  alternates: {
    canonical: "https://www.gamajewels.com/necklace",
  },
  openGraph: {
    title: "Diamond Necklaces & Pendants | Gama Jewels",
    description:
      "Handcrafted diamond necklaces & pendants in 18ct gold & platinum. Cross, heart & solitaire designs.",
    url: "https://www.gamajewels.com/necklace",
    images: [{ url: "/shopbycategory/necklace.png", width: 800, height: 600, alt: "Diamond Necklaces & Pendants Collection" }],
  },
};

const NECKLACE_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18k Yellow Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "18ct Rose Gold",
  "Platinum",
];

const NECKLACE_CARATS = ["1.00ct", "1.20ct"];

const NECKLACE_STYLES = ["Cross Pendant", "Heart Pendant", "Pendant"];

export default function NecklacePage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Necklace"
        customMetals={NECKLACE_METALS}
        customCarats={NECKLACE_CARATS}
        customStyles={NECKLACE_STYLES}
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
