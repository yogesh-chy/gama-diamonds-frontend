import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

interface PageProps {
  params: Promise<{ style: string }>;
}

const STYLE_TITLE_MAP: Record<string, { title: string; filterStyle: string }> = {
  "traditional-court": {
    title: "Traditional Court Wedding Rings",
    filterStyle: "Traditional Court",
  },
  "flat-court": {
    title: "Flat Court Wedding Rings",
    filterStyle: "Flat Court",
  },
  "soft-court": {
    title: "Soft Court Wedding Rings",
    filterStyle: "Soft Court",
  },
};

const STYLE_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K YELLOW GOLD",
  "9K Rose Gold",
  "9K ROSE GOLD",
  "18K White Gold",
  "9K WHITE GOLD",
  "18K WHITE GOLD",
  "18K Yellow Gold",
  "18K YELLOW GOLD",
  "18K ROSE GOLD",
  "18K Rose Gold",
  "PALLADIUM 500",
  "PALLADIUM 950",
  "PLATINUM 950",
  "Platinum",
];

export async function generateMetadata({ params }: PageProps) {
  const { style } = await params;
  const config = STYLE_TITLE_MAP[style] || {
    title: "Wedding Rings by Style",
    filterStyle: "",
  };
  return {
    title: `${config.title} | Gama Jewels – Fine Jewellery`,
    description: `Explore our collection of handcrafted ${config.title.toLowerCase()} made by master goldsmiths in our Mumbai atelier.`,
  };
}

export default async function WeddingStylePage({ params }: PageProps) {
  const { style } = await params;
  const config = STYLE_TITLE_MAP[style] || {
    title: "Wedding Rings by Style",
    filterStyle: "",
  };

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle={config.title}
        customMetals={STYLE_METALS}
        defaultMinPrice={0}
        defaultMaxPrice={50000}
        hideDiamondType={true}
        hideCarat={true}
        hideColor={true}
        customStyles={[]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
