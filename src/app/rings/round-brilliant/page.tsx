import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RingsCategoryListing from "@/components/rings/RingsCategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Round Brilliant Engagement Rings | Gama Jewels",
  description:
    "Explore our handcrafted round brilliant diamond engagement rings. Crafted by master goldsmiths in Mumbai.",
};

export default function RoundBrilliantRingsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Header */}
      <Header />

      {/* Category Listing Layout (Filter Sidebar + 8 Product Cards with Image Placeholders) */}
      <RingsCategoryListing />

      {/* Recently Viewed Carousel */}
      <RingsRecentlyViewed />

      {/* Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
