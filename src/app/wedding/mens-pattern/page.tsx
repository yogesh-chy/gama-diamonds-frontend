import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Men's Patterned Wedding Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our collection of men's patterned & textured wedding rings handcrafted by master goldsmiths in Hatton Garden, London.",
};

const MENS_PATTERN_PRODUCTS: ProductItem[] = [
  {
    id: "mpat-01",
    title: "6mm Two-Tone Diamond Cut Pattern Ring in 18K Yellow & White",
    metal: "18K Yellow & White",
    price: 1150,
    badge: "BESTSELLER",
    inStock: true,
    style: "Two-Tone Pattern",
  },
  {
    id: "mpat-02",
    title: "5mm Satin Finish Centre Groove Wedding Band in Platinum",
    metal: "Platinum",
    price: 1350,
    badge: "POPULAR",
    inStock: true,
    style: "Satin Centre",
  },
  {
    id: "mpat-03",
    title: "6mm Hammered Finish Edge Band in 14K Rose & White",
    metal: "14K Rose & White",
    price: 890,
    badge: "NEXT DAY",
    inStock: true,
    style: "Hammered",
  },
  {
    id: "mpat-04",
    title: "5.5mm Brushed Diagonal Cut Pattern Ring in 10K White Gold",
    metal: "10K White Gold",
    price: 580,
    inStock: true,
    style: "Diagonal Cut",
  },
  {
    id: "mpat-05",
    title: "6mm Milgrain Edge Patterned Wedding Band in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 490,
    inStock: true,
    style: "Milgrain Edge",
  },
  {
    id: "mpat-06",
    title: "5mm Celtic Laser Engraved Band in 18K Rose & White",
    metal: "18K Rose & White",
    price: 1280,
    badge: "EXCLUSIVE",
    inStock: true,
    style: "Celtic Engraved",
  },
  {
    id: "mpat-07",
    title: "6mm Bark Texture Finish Ring in 14K Yellow & White",
    metal: "14K Yellow & White",
    price: 920,
    inStock: true,
    style: "Bark Texture",
  },
  {
    id: "mpat-08",
    title: "5mm Dual Grooved Matt & Polished Band in 9K Rose & White",
    metal: "9K Rose & White",
    price: 520,
    inStock: true,
    style: "Dual Groove",
  },
  {
    id: "mpat-09",
    title: "6mm Roman Numeral Patterned Band in 10K Yellow & White",
    metal: "10K Yellow & White",
    price: 640,
    inStock: true,
    style: "Engraved",
  },
  {
    id: "mpat-10",
    title: "5.5mm Heavy Diamond Cut Lattice Band in Platinum",
    metal: "Platinum",
    price: 1950,
    badge: "BESTSELLER",
    inStock: true,
    style: "Diamond Cut",
  },
];

const MENS_PATTERN_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "10K White Gold",
  "10K Yellow Gold",
  "10K Rose Gold",
  "14K White Gold",
  "14K Yellow Gold",
  "14K Rose Gold",
  "18K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "Platinum",
  "10K Rose & White",
  "10K Yellow & White",
  "14K Rose & White",
  "14K Yellow & White",
  "18K Rose & White",
  "18K Yellow & White",
  "9K Rose & White",
  "9K Yellow & White",
];

export default function MensPatternPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={MENS_PATTERN_PRODUCTS}
        categoryTitle="Men's Patterned Wedding Rings"
        customMetals={MENS_PATTERN_METALS}
        defaultMinPrice={490}
        defaultMaxPrice={1950}
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
