import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RingsStyleListing from "@/components/rings/RingsStyleListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

type PageProps = {
  params: Promise<{ style: string }>;
};

const STYLE_META_TITLES: Record<string, string> = {
  solitaire: "Solitaire Engagement Rings",
  halo: "Halo Engagement Rings",
  "under-halo": "Under Halo Engagement Rings",
  "diamond-shoulder": "Diamond Shoulder Engagement Rings",
  "three-stone": "Trilogy Three Stone Engagement Rings",
  "matching-set": "Matching Set Engagement Rings",
};

export async function generateMetadata({ params }: PageProps) {
  const { style } = await params;
  const formatted = style
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const title = STYLE_META_TITLES[style.toLowerCase()] || `${formatted} Engagement Rings`;

  return {
    title: `${title} | Gama Jewels`,
    description: `Explore our handcrafted ${title.toLowerCase()}. Handcrafted by master goldsmiths in Mumbai.`,
  };
}

export default async function DynamicRingsStylePage({ params }: PageProps) {
  const { style } = await params;

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Header Navigation */}
      <Header />

      {/* Dynamic Style Category Listing Component */}
      <RingsStyleListing styleSlug={style} />

      {/* Recently Viewed Carousel */}
      <RingsRecentlyViewed />

      {/* Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
