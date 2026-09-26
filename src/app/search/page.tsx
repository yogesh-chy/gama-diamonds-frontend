import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchPageClient from "./SearchPageClient";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Search Our Luxury Jewellery Collection | Gama Jewels",
  description: "Search across certified diamond engagement rings, wedding bands, earrings, pendants, and bespoke fine jewellery.",
};

export default function SearchPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />
      <SearchPageClient />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
