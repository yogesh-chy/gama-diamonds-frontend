import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Necklaces & Pendants | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone necklaces and pendants. Crafted by master goldsmiths in Hatton Garden, London.",
};

const NECKLACE_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18k Yellow Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "18ct Rose Gold",
  "Platinum",
];

const NECKLACE_CARATS = ["1.00ct", "1.20ct"];

const NECKLACE_STYLES = ["Cross Pendant", "Heart Pendant", "Pendant"];

const NECKLACE_PRODUCTS: ProductItem[] = [
  {
    id: "nk-01",
    title: "Round Brilliant Diamond Solitaire Pendant in 18ct White Gold",
    metal: "18ct White Gold",
    price: 1650,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "Pendant",
  },
  {
    id: "nk-02",
    title: "Vintage Diamond Cross Pendant in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 2450,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "1.20ct",
    style: "Cross Pendant",
  },
  {
    id: "nk-03",
    title: "Heart Diamond Solitaire Pendant in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 1980,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.00ct",
    style: "Heart Pendant",
  },
  {
    id: "nk-04",
    title: "Classic Diamond Cross Pendant in 9K White Gold",
    metal: "9K White Gold",
    price: 1250,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "1.00ct",
    style: "Cross Pendant",
  },
  {
    id: "nk-05",
    title: "Romantic Heart Diamond Pendant in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 2890,
    badge: "NEW",
    inStock: false,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Heart Pendant",
  },
  {
    id: "nk-06",
    title: "Solitaire Diamond Pendant in Platinum",
    metal: "Platinum",
    price: 3450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Pendant",
  },
  {
    id: "nk-07",
    title: "Emerald Cut Diamond Pendant in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 990,
    badge: "POPULAR",
    inStock: false,
    diamondType: "Lab Grown Diamond",
    carat: "1.00ct",
    style: "Pendant",
  },
  {
    id: "nk-08",
    title: "Diamond Cross Pendant in 18ct White Gold",
    metal: "18ct White Gold",
    price: 2150,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "1.20ct",
    style: "Cross Pendant",
  },
];

export default function NecklacePage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={NECKLACE_PRODUCTS}
        categoryTitle="Necklace"
        customMetals={NECKLACE_METALS}
        customCarats={NECKLACE_CARATS}
        customStyles={NECKLACE_STYLES}
        hideDiamondType={false}
        hideCarat={false}
        hideStyle={false}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
