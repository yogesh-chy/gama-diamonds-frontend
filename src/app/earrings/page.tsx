import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Earrings | Gama Diamond – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone earrings. Crafted by master goldsmiths in Hatton Garden, London.",
};

const EARRINGS_PRODUCTS: ProductItem[] = [
  {
    id: "er-01",
    title: "Round Cut Sapphire & Diamond Drop Earrings in 18ct White Gold",
    metal: "18ct White Gold",
    price: 1850,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.50ct",
    style: "STYLE: DROPS",
  },
  {
    id: "er-02",
    title: "Emerald Cut Emerald & Diamond Drop Earrings in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "1.80ct",
    style: "Drop Earrings",
  },
  {
    id: "er-03",
    title: "Round Cut Diamond Solitaire Stud Earrings in 18K White Gold",
    metal: "18K White Gold",
    price: 1450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "STYLE: STUDS",
  },
  {
    id: "er-04",
    title: "Pear Cut Aquamarine & Halo Diamond Drop Earrings in Platinum",
    metal: "Platinum",
    price: 2890,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "2.20ct",
    style: "STYLE: HALO EARRINGS",
  },
  {
    id: "er-05",
    title: "Oval Cut Ruby Red & Diamond Surround Earrings in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 3200,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.60ct",
    style: "STYLE: HALO EARRINGS",
  },
  {
    id: "er-06",
    title: "Round Diamond Pave Medium Hoop Earrings in 18ct Yellow Gold",
    metal: "18ct Yellow Gold",
    price: 1650,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "0.75ct",
    style: "STYLE: HOOPS",
  },
  {
    id: "er-07",
    title: "Cushion Cut Amethyst & Diamond Cluster Stud Earrings in Platinum",
    metal: "Platinum",
    price: 1250,
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.40ct",
    style: "Stud Earrings",
  },
  {
    id: "er-08",
    title: "Vintage Marquise Cut Diamond Chandelier Drop Earrings in 18ct White Gold",
    metal: "18ct White Gold",
    price: 4950,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "2.80ct",
    style: "STYLE: DROP EARRINGS",
  },
];

export default function EarringsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={EARRINGS_PRODUCTS}
        categoryTitle="Earrings"
        customStyles={[
          "Drop Earrings",
          "Earring",
          "Hoop Earrings",
          "STYLE: DROP EARRINGS",
          "STYLE: DROPS",
          "STYLE: HALO EARRINGS",
          "STYLE: HOOPS",
          "STYLE: STUDS",
          "Stud Earrings",
        ]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
