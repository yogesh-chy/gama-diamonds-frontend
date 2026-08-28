import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RingsOtherCutsListing from "@/components/rings/RingsOtherCutsListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

type PageProps = {
  params: Promise<{ shape: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { shape } = await params;
  const formatted = shape
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formatted} Engagement Rings | Gama Jewels`,
    description: `Explore our handcrafted ${formatted} engagement rings. Handcrafted by master goldsmiths in Hatton Garden, London.`,
  };
}

export default async function DynamicOtherShapeRingsPage({ params }: PageProps) {
  const { shape } = await params;

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* Header */}
      <Header />

      {/* Dynamic Category Listing for Other Shape Cuts (Filter Sidebar with Carat, Metal, Availability + 8 Image Placeholders) */}
      <RingsOtherCutsListing shapeSlug={shape} />

      {/* Recently Viewed Carousel */}
      <RingsRecentlyViewed />

      {/* Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
