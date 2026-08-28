import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Tennis Bracelets | Gama Jewels – Fine Diamond Bracelets",
  description:
    "Explore our luxurious collection of diamond tennis bracelets in 9K, 18K white, yellow, rose gold, and platinum.",
};

const TENNIS_BRACELET_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const TENNIS_BRACELET_STYLES = [
  "All Bracelets",
  "Bracelet & Bangle",
  "Only Bracelets",
  "Tennis Bracelet",
];

const TENNIS_BRACELET_PRODUCTS: ProductItem[] = [
  {
    id: "tb-01",
    title: "Round Brilliant Diamond Tennis Bracelet in 18K White Gold",
    metal: "18K White Gold",
    price: 4850,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Tennis Bracelet",
  },
  {
    id: "tb-02",
    title: "Classic Diamond Line Bracelet in Platinum",
    metal: "Platinum",
    price: 6900,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Tennis Bracelet",
  },
  {
    id: "tb-03",
    title: "Round Diamond Tennis Bracelet in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 4250,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Tennis Bracelet",
  },
  {
    id: "tb-04",
    title: "Delicate Diamond Line Bracelet in 9K White Gold",
    metal: "9K White Gold",
    price: 1950,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "All Bracelets",
  },
  {
    id: "tb-05",
    title: "Rose Gold Diamond Tennis Bracelet in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 3890,
    badge: "NEW",
    inStock: true,
    diamondType: "Natural Diamond",
    style: "Only Bracelets",
  },
  {
    id: "tb-06",
    title: "Square Cut Diamond Tennis Bracelet in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 2450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    style: "Bracelet & Bangle",
  },
];

export default function TennisBraceletsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={TENNIS_BRACELET_PRODUCTS}
        categoryTitle="Tennis Bracelets"
        customMetals={TENNIS_BRACELET_METALS}
        customStyles={TENNIS_BRACELET_STYLES}
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
