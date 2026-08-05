"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WeddingHeroSplit from "@/components/wedding/WeddingHeroSplit";
import WeddingProductGrid from "@/components/wedding/WeddingProductGrid";
import WeddingMatchingBanner from "@/components/wedding/WeddingMatchingBanner";
import WeddingBespokeBanner from "@/components/wedding/WeddingBespokeBanner";
import CertificationBar from "@/components/landing/CertificationBar";

export default function WeddingPage() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "women" | "men">("all");

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Navbar */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Section 1: Hero Dual Split Cards (Shop Women's / Shop Men's) */}
        <WeddingHeroSplit onSelectCategory={(cat) => setSelectedCategory(cat)} />

        {/* Section 2: Filter Tabs & 4x2 Product Cards Grid */}
        <WeddingProductGrid
          selectedCategory={selectedCategory}
          onCategoryChange={(cat) => setSelectedCategory(cat)}
        />

        {/* Section 3: Feature Banner 1 - "FIND MY MATCHING WEDDING RING" */}
        <WeddingMatchingBanner />

        {/* Section 4: Feature Banner 2 - "WEDDING RING BESPOKE" */}
        <WeddingBespokeBanner />

        {/* Section 5: NAJ, Goldsmiths, GIA Certification Bar */}
        <CertificationBar />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
