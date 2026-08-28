import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
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

const SHOP_BY_STYLE_PRODUCTS: ProductItem[] = [
  // Traditional Court products
  {
    id: "tc-01",
    title: "2mm Band Classic Traditional Court Ring in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 350,
    badge: "BESTSELLER",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "tc-02",
    title: "2.5mm Heavy Traditional Court Band in Platinum 950",
    metal: "PLATINUM 950",
    price: 650,
    badge: "POPULAR",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "tc-03",
    title: "4mm Classic Traditional Court Ring in 9K White Gold",
    metal: "9K White Gold",
    price: 490,
    badge: "NEXT DAY",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "tc-04",
    title: "5mm Heavy Traditional Court Ring in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 890,
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "tc-05",
    title: "3mm Traditional Court Wedding Band in Palladium 950",
    metal: "PALLADIUM 950",
    price: 580,
    inStock: true,
    style: "Traditional Court",
  },

  // Flat Court products
  {
    id: "fc-01",
    title: "2mm Band Flat Court Wedding Ring in Platinum",
    metal: "Platinum",
    price: 360,
    badge: "BESTSELLER",
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "fc-02",
    title: "3mm Flat Court Wedding Band in 18K White Gold",
    metal: "18K White Gold",
    price: 440,
    badge: "POPULAR",
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "fc-03",
    title: "4mm Matte Finish Flat Court Ring in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 380,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "fc-04",
    title: "5mm Heavy Flat Court Wedding Ring in Palladium 500",
    metal: "PALLADIUM 500",
    price: 720,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "fc-05",
    title: "6mm Polished Flat Court Band in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 950,
    badge: "EXCLUSIVE",
    inStock: true,
    style: "Flat Court",
  },

  // Soft Court products
  {
    id: "sc-01",
    title: "2mm Band Classic Soft Court Ring in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 370,
    badge: "BESTSELLER",
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "sc-02",
    title: "2.5mm Soft Court Ring in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 310,
    badge: "NEXT DAY",
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "sc-03",
    title: "3mm Classic Soft Court Ring in Platinum 950",
    metal: "PLATINUM 950",
    price: 520,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "sc-04",
    title: "4mm Heavy Soft Court Wedding Band in 18K White Gold",
    metal: "18K White Gold",
    price: 780,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "sc-05",
    title: "5mm Comfort Soft Court Ring in Palladium 950",
    metal: "PALLADIUM 950",
    price: 840,
    inStock: true,
    style: "Soft Court",
  },
];

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
    description: `Explore our collection of handcrafted ${config.title.toLowerCase()} made by master goldsmiths in Hatton Garden, London.`,
  };
}

export default async function WeddingStylePage({ params }: PageProps) {
  const { style } = await params;
  const config = STYLE_TITLE_MAP[style] || {
    title: "Wedding Rings by Style",
    filterStyle: "",
  };

  // Filter products by style
  const pageProducts = config.filterStyle
    ? SHOP_BY_STYLE_PRODUCTS.filter((p) => p.style === config.filterStyle)
    : SHOP_BY_STYLE_PRODUCTS;

  const minPrice = pageProducts.length > 0 ? Math.min(...pageProducts.map((p) => p.price)) : 310;
  const maxPrice = pageProducts.length > 0 ? Math.max(...pageProducts.map((p) => p.price)) : 950;

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={pageProducts}
        categoryTitle={config.title}
        customMetals={STYLE_METALS}
        defaultMinPrice={minPrice}
        defaultMaxPrice={maxPrice}
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
