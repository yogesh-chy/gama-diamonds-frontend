import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Men's Plain Wedding Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our collection of men's plain wedding rings handcrafted by master goldsmiths in Hatton Garden, London.",
};

const MENS_PLAIN_PRODUCTS: ProductItem[] = [
  {
    id: "mp-01",
    title: "4mm Classic Heavy Court Men's Wedding Ring in 18K Yellow Gold",
    metal: "18K YELLOW GOLD",
    price: 890,
    badge: "BESTSELLER",
    inStock: true,
    style: "Heavy Court",
  },
  {
    id: "mp-02",
    title: "5mm Flat Court Matte Finish Men's Wedding Band in Platinum 950",
    metal: "PLATINUM 950",
    price: 1250,
    badge: "POPULAR",
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "mp-03",
    title: "4mm Traditional Court Wedding Band in 9K White Gold",
    metal: "9K WHITE GOLD",
    price: 590,
    badge: "NEXT DAY",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "mp-04",
    title: "6mm Heavy Flat Court Wedding Ring in Palladium 950",
    metal: "PALLADIUM 950",
    price: 1100,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "mp-05",
    title: "5mm Classic Traditional Court Ring in 18K White Gold",
    metal: "18K WHITE GOLD",
    price: 980,
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "mp-06",
    title: "4mm Soft Court Wedding Band in 9K Rose Gold",
    metal: "9K ROSE GOLD",
    price: 640,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "mp-07",
    title: "5mm Chamfered Edge Wedding Ring in Palladium 500",
    metal: "PALLADIUM 500",
    price: 780,
    inStock: true,
    style: "Chamfered Edge",
  },
  {
    id: "mp-08",
    title: "6mm Heavy Traditional Court Ring in 18K Rose Gold",
    metal: "18K ROSE GOLD",
    price: 1420,
    badge: "EXCLUSIVE",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "mp-09",
    title: "4.5mm Flat Court Wedding Band in 9K Yellow Gold",
    metal: "9K YELLOW GOLD",
    price: 610,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "mp-10",
    title: "6mm Classic Soft Court Band in Platinum 950",
    metal: "PLATINUM 950",
    price: 1850,
    badge: "BESTSELLER",
    inStock: true,
    style: "Soft Court",
  },
];

const MENS_PLAIN_METALS = [
  "9K WHITE GOLD",
  "9K YELLOW GOLD",
  "9K ROSE GOLD",
  "18K WHITE GOLD",
  "18K YELLOW GOLD",
  "18K ROSE GOLD",
  "PALLADIUM 500",
  "PALLADIUM 950",
  "PLATINUM 950",
];

export default function MensPlainPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={MENS_PLAIN_PRODUCTS}
        categoryTitle="Men's Plain Wedding Rings"
        customMetals={MENS_PLAIN_METALS}
        defaultMinPrice={590}
        defaultMaxPrice={1850}
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
