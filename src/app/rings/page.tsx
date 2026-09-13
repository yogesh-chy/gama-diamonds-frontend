import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RingsHero from "@/components/rings/RingsHero";
import RingsStyleGrid from "@/components/rings/RingsStyleGrid";
import RingsBanner from "@/components/rings/RingsBanner";
import RingsDescription from "@/components/rings/RingsDescription";
import RingsCraftsmanship from "@/components/rings/RingsCraftsmanship";
import RingsJewelCheck from "@/components/rings/RingsJewelCheck";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Engagement Rings | Solitaire, Halo & Bespoke Designs",
  description:
    "Discover our exquisite collection of diamond engagement rings — solitaire, halo, trilogy & under-halo styles. GIA certified natural & lab-grown diamonds, handcrafted by master goldsmiths. Free UK delivery.",
  alternates: {
    canonical: "https://www.gamajewels.com/rings",
  },
  openGraph: {
    title: "Diamond Engagement Rings | Gama Jewels",
    description:
      "Handcrafted diamond engagement rings in 18ct gold & platinum. Solitaire, halo & bespoke designs with GIA certified diamonds.",
    url: "https://www.gamajewels.com/rings",
    images: [{ url: "/shopbycategory/engement_ring.png", width: 800, height: 600, alt: "Diamond Engagement Rings Collection" }],
  },
};

export default function EngagementRingsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Header */}
      <Header />

      {/* Section 1: 2-Column Split Hero (Mumbai Atelier / A Promise of Forever) */}
      <RingsHero />

      {/* Section 2: 3x2 Category Grid (Solitaire, Trilogy, Under Halo, Halo, Diamond Shoulder, Eternity) */}
      <RingsStyleGrid />

      {/* Section 3: Full Width Wide Ring Banner (Shop All Engagement Rings) */}
      <RingsBanner />

      {/* Section 4: The 4 C's of Diamond Jewellery */}
      <RingsDescription />

      {/* Section 5: Tabbed Lab Diamonds vs Natural Diamonds Split */}
      <RingsCraftsmanship />

      {/* Section 6: Complimentary Jewel Check Satin Banner with Centered White Card */}
      <RingsJewelCheck />

      {/* Section 7: Recently Viewed 4-Card Carousel with Prices & Badges */}
      <RingsRecentlyViewed />

      {/* Section 8: NAJ, Goldsmiths, GIA, IGI, Stop Blood Diamonds Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
