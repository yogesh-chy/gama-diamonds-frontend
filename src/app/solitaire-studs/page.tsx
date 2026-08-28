import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Solitaire Studs | Gama Jewels – Fine Diamond Earrings",
  description:
    "Discover our collection of timeless solitaire diamond stud earrings in white gold, yellow gold, rose gold, and platinum.",
};

const SOLITAIRE_STUDS_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const SOLITAIRE_STUDS_STYLES = [
  "Earring",
  "STYLE: STUDS",
  "Stud Earrings",
];

const SOLITAIRE_STUDS_PRODUCTS: ProductItem[] = [
  {
    id: "ss-01",
    title: "Round Brilliant Diamond Solitaire Stud Earrings in 18K White Gold",
    metal: "18K White Gold",
    price: 980,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Stud Earrings",
  },
  {
    id: "ss-02",
    title: "Princess Cut Diamond Stud Earrings in Platinum",
    metal: "Platinum",
    price: 1450,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "STYLE: STUDS",
  },
  {
    id: "ss-03",
    title: "Round Diamond Solitaire Studs in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 890,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Stud Earrings",
  },
  {
    id: "ss-04",
    title: "Classic Diamond Stud Earrings in 9K White Gold",
    metal: "9K White Gold",
    price: 490,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Earring",
  },
  {
    id: "ss-05",
    title: "Rose Gold Diamond Solitaire Studs in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 920,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Stud Earrings",
  },
  {
    id: "ss-06",
    title: "Cushion Cut Diamond Stud Earrings in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 650,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "STYLE: STUDS",
  },
];

export default function SolitaireStudsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={SOLITAIRE_STUDS_PRODUCTS}
        categoryTitle="Solitaire Studs"
        customMetals={SOLITAIRE_STUDS_METALS}
        customStyles={SOLITAIRE_STUDS_STYLES}
        hideDiamondType={false}
        hideCarat={true}
        hideStyle={false}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
