import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Men's Diamond Wedding Rings | Gama Diamond – Fine Jewellery",
  description:
    "Explore our collection of men's diamond wedding rings handcrafted by master goldsmiths in Hatton Garden, London.",
};

const MENS_DIAMOND_PRODUCTS: ProductItem[] = [
  {
    id: "md-01",
    title: "5mm Channel Set Diamond Men's Wedding Band in 18KT White Gold",
    metal: "18KT White Gold",
    price: 1250,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Channel Set",
  },
  {
    id: "md-02",
    title: "6mm Single Solitaire Inset Diamond Men's Ring in Platinum",
    metal: "Platinum",
    price: 1650,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Solitaire Inset",
  },
  {
    id: "md-03",
    title: "5mm Three Stone Diagonal Diamond Band in 14KT Yellow Gold",
    metal: "14KT Yellow Gold",
    price: 980,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Three Stone",
  },
  {
    id: "md-04",
    title: "6mm Pave Set Diamond Groove Wedding Ring in 10KT White Gold",
    metal: "10KT White Gold",
    price: 750,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Pave Set",
  },
  {
    id: "md-05",
    title: "5.5mm Bezel Set Diamond Band in 9KT Yellow Gold",
    metal: "9KT Yellow Gold",
    price: 650,
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Bezel Set",
  },
  {
    id: "md-06",
    title: "6mm Black & White Diamond Band in 18KT Yellow Gold",
    metal: "18KT Yellow Gold",
    price: 1850,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Groove Set",
  },
  {
    id: "md-07",
    title: "5mm Flush Set Round Diamond Ring in 14KT Rose Gold",
    metal: "14KT Rose Gold",
    price: 1100,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Flush Set",
  },
  {
    id: "md-08",
    title: "6mm Princess Cut Diamond Channel Band in 10KT Rose Gold",
    metal: "10KT Rose Gold",
    price: 890,
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Channel Set",
  },
  {
    id: "md-09",
    title: "5mm Vintage Hand-Engraved Diamond Ring in 9KT White Gold",
    metal: "9KT White Gold",
    price: 690,
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Engraved",
  },
  {
    id: "md-10",
    title: "6mm Brushed Platinum Heavy Diamond Band",
    metal: "Platinum",
    price: 2450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Channel Set",
  },
];

const MENS_DIAMOND_METALS = [
  "9KT White Gold",
  "9KT Yellow Gold",
  "9KT Rose Gold",
  "10KT White Gold",
  "10KT Yellow Gold",
  "10KT Rose Gold",
  "14KT White Gold",
  "14KT Yellow Gold",
  "14KT Rose Gold",
  "18KT White Gold",
  "18KT Yellow Gold",
  "18KT Rose Gold",
  "Platinum",
];

export default function MensDiamondPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={MENS_DIAMOND_PRODUCTS}
        categoryTitle="Men's Diamond Wedding Rings"
        customMetals={MENS_DIAMOND_METALS}
        defaultMinPrice={650}
        defaultMaxPrice={2450}
        hideDiamondType={false}
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
