import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Hoop Earrings | Gama Jewels – Fine Diamond Hoop Earrings",
  description:
    "Shop our luxurious collection of diamond hoop & drop earrings crafted in 9K, 18K white gold, yellow gold, rose gold, and platinum.",
};

const HOOP_EARRINGS_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const HOOP_EARRINGS_STYLES = [
  "Drop Earrings",
  "Earring",
  "Hoop Earrings",
  "STYLE: HOOPS",
  "Stud Earrings",
];

const HOOP_EARRINGS_PRODUCTS: ProductItem[] = [
  {
    id: "he-01",
    title: "Round Brilliant Diamond Hoop Earrings in 18K White Gold",
    metal: "18K White Gold",
    price: 1250,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Hoop Earrings",
  },
  {
    id: "he-02",
    title: "Classic Diamond Huggie Hoops in Platinum",
    metal: "Platinum",
    price: 1850,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "STYLE: HOOPS",
  },
  {
    id: "he-03",
    title: "Round Diamond Drop Hoop Earrings in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 1450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Drop Earrings",
  },
  {
    id: "he-04",
    title: "Micro-Pave Diamond Hoop Earrings in 9K White Gold",
    metal: "9K White Gold",
    price: 650,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Earring",
  },
  {
    id: "he-05",
    title: "Rose Gold Diamond Huggies in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 1150,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Hoop Earrings",
  },
  {
    id: "he-06",
    title: "Small Solitaire Diamond Stud Earrings in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 490,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Stud Earrings",
  },
];

export default function HoopEarringsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={HOOP_EARRINGS_PRODUCTS}
        categoryTitle="Hoop Earrings"
        customMetals={HOOP_EARRINGS_METALS}
        customStyles={HOOP_EARRINGS_STYLES}
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
