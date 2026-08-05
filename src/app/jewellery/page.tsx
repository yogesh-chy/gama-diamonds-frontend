"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import JewelleryHeroSplit from "@/components/jewellery/JewelleryHeroSplit";
import JewelleryCategoryGrid from "@/components/jewellery/JewelleryCategoryGrid";
import JewelleryTennisBanner from "@/components/jewellery/JewelleryTennisBanner";
import JewelleryBespokeSketchBanner from "@/components/jewellery/JewelleryBespokeSketchBanner";
import JewelleryBrillianceSection from "@/components/jewellery/JewelleryBrillianceSection";
import JewelleryShowroomSection from "@/components/jewellery/JewelleryShowroomSection";
import CertificationBar from "@/components/landing/CertificationBar";

export default function JewelleryPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Section 1: Hero Split (Precious Jewellery) */}
        <JewelleryHeroSplit />

        {/* Section 2: 6-Card Category Grid (Pendant Necklaces, Solitaire Studs, Tennis Bracelets, Fine Rings, Cross Pendants, Hoop Earrings) */}
        <JewelleryCategoryGrid />

        {/* Section 3: Wide Model Hero Banner (Tennis Necklaces) */}
        <JewelleryTennisBanner />

        {/* Section 4: Bespoke Jewellery Sketch Banner */}
        <JewelleryBespokeSketchBanner />

        {/* Section 5: Brand Brilliance Text Banner */}
        <JewelleryBrillianceSection />

        {/* Section 6: Hatton Garden Showroom Store Banner */}
        <JewelleryShowroomSection />

        {/* Section 7: Trust Badges & Certification Bar */}
        <CertificationBar />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
