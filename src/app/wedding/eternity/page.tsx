import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Eternity Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone eternity rings. Crafted by master goldsmiths in Hatton Garden, London.",
};

const WEDDING_ETERNITY_METALS = [
  "18K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "9K Rose Gold",
  "9K White Gold",
  "9K Yellow Gold",
  "Platinum",
];

const WEDDING_ETERNITY_STYLES = [
  "Pave Set",
  "Scallop Set",
  "Grain Set",
  "Channel Set",
  "Shaped Eternity Ring",
  "Bespoke Eternity Ring",
];

const WEDDING_ETERNITY_COLORS = [
  "Aquamarine",
  "Blue Sapphire",
  "Emerald Green",
  "Fancy Yellow",
  "Multi Coloured",
  "Pink",
  "Ruby",
  "Sapphire",
  "Tanzanite",
  "yellow",
];

export default function WeddingEternityPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Eternity Rings"
        customMetals={WEDDING_ETERNITY_METALS}
        customStyles={WEDDING_ETERNITY_STYLES}
        customColors={WEDDING_ETERNITY_COLORS}
        defaultMinPrice={290}
        defaultMaxPrice={8700}
        hideDiamondType={false}
        hideCarat={true}
        hideColor={false}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
