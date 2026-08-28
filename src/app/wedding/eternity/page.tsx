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

const WEDDING_ETERNITY_PRODUCTS: ProductItem[] = [
  {
    id: "we-01",
    title: "Round Brilliant Micro-Pave Eternity Band in 18K White Gold",
    metal: "18K White Gold",
    price: 1450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Pave Set",
    color: "Multi Coloured",
  },
  {
    id: "we-02",
    title: "Emerald Cut Channel Set Eternity Ring in Platinum",
    metal: "Platinum",
    price: 2890,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Channel Set",
    color: "Blue Sapphire",
  },
  {
    id: "we-03",
    title: "Round Diamond Scallop Set Eternity Band in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1980,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Scallop Set",
    color: "Fancy Yellow",
  },
  {
    id: "we-04",
    title: "Grain Set Diamond Eternity Ring in 9K White Gold",
    metal: "9K White Gold",
    price: 490,
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Grain Set",
    color: "Sapphire",
  },
  {
    id: "we-05",
    title: "Ruby Red & Diamond Grain Set Eternity Band in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 2150,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Grain Set",
    color: "Ruby",
  },
  {
    id: "we-06",
    title: "Emerald Green Gemstone Scallop Set Eternity Ring in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 590,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Scallop Set",
    color: "Emerald Green",
  },
  {
    id: "we-07",
    title: "Aquamarine Contour Shaped Eternity Band in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 290,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Shaped Eternity Ring",
    color: "Aquamarine",
  },
  {
    id: "we-08",
    title: "Bespoke Handcrafted Diamond Eternity Ring in Platinum",
    metal: "Platinum",
    price: 8700,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Bespoke Eternity Ring",
    color: "Multi Coloured",
  },
  {
    id: "we-09",
    title: "Pink Sapphire Pave Set Eternity Ring in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 1650,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Pave Set",
    color: "Pink",
  },
  {
    id: "we-10",
    title: "Tanzanite & Diamond Channel Set Band in 18K White Gold",
    metal: "18K White Gold",
    price: 3450,
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Channel Set",
    color: "Tanzanite",
  },
  {
    id: "we-11",
    title: "Fancy Yellow Diamond Pave Band in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 4200,
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Pave Set",
    color: "yellow",
  },
  {
    id: "we-12",
    title: "Shaped V-Curve Eternity Ring in Platinum",
    metal: "Platinum",
    price: 1850,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Shaped Eternity Ring",
    color: "Multi Coloured",
  },
];

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
        products={WEDDING_ETERNITY_PRODUCTS}
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
