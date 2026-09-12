import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Tennis Bracelets | Handcrafted Luxury Diamond Bracelets",
  description:
    "Explore our collection of diamond tennis bracelets in 18ct white, yellow, rose gold, and platinum. GIA certified natural & lab-grown diamonds handcrafted in Mumbai.",
  alternates: {
    canonical: "https://www.gamajewels.com/tennis-bracelets",
  },
  openGraph: {
    title: "Diamond Tennis Bracelets | Gama Jewels",
    description:
      "Handcrafted diamond tennis bracelets in 18ct gold and platinum. Exceptional sparkle, bespoke carat options.",
    url: "https://www.gamajewels.com/tennis-bracelets",
    type: "website",
  },
};


const TENNIS_BRACELET_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const TENNIS_BRACELET_STYLES = [
  "All Bracelets",
  "Bracelet & Bangle",
  "Only Bracelets",
  "Tennis Bracelet",
];

export default function TennisBraceletsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Tennis Bracelets"
        customMetals={TENNIS_BRACELET_METALS}
        customStyles={TENNIS_BRACELET_STYLES}
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
