import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Hoop Earrings & Huggies | Luxury Diamond Earrings",
  description:
    "Shop our luxurious collection of diamond hoop and huggie earrings crafted in 18ct white gold, yellow gold, rose gold, and platinum. GIA certified diamonds.",
  alternates: {
    canonical: "https://www.gamajewels.com/hoop-earrings",
  },
  openGraph: {
    title: "Diamond Hoop Earrings | Gama Jewels",
    description:
      "Handcrafted diamond hoop and huggie earrings in 18ct gold and platinum.",
    url: "https://www.gamajewels.com/hoop-earrings",
    type: "website",
  },
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
