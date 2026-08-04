import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Statement Rings | Gama Diamond – Fine Jewellery",
  description:
    "Explore our collection of handcrafted statement rings featuring diamonds and precious gemstones in Hatton Garden, London.",
};

const STATEMENT_RINGS_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18ct White Gold",
  "18k White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18k Yellow Gold",
  "18ct Rose Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "Platinum",
  "Platinum 950",
  "18K Rose gold",
  "18K White gold",
  "18K Yellow gold",
  "9K Rose gold",
  "9K White gold",
  "9K Yellow gold",
  "Platinam",
];

const STATEMENT_RINGS_PRODUCTS: ProductItem[] = [
  {
    id: "sr-01",
    title: "Round Cut Diamond Cluster Statement Ring in 18ct White Gold",
    metal: "18ct White Gold",
    price: 2450,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Natural Diamond",
  },
  {
    id: "sr-02",
    title: "Emerald Cut Sapphire & Diamond Statement Band in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 3200,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
  },
  {
    id: "sr-03",
    title: "Oval Cut Ruby & Diamond Cocktail Ring in 18ct Rose Gold",
    metal: "18ct Rose Gold",
    price: 2890,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
  },
  {
    id: "sr-04",
    title: "Pear Cut Diamond Halo Statement Ring in Platinum 950",
    metal: "Platinum 950",
    price: 4100,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
  },
  {
    id: "sr-05",
    title: "Marquise Cut Emerald & Diamond Ring in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 1150,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Lab Grown Diamond",
  },
  {
    id: "sr-06",
    title: "Cushion Cut Aquamarine Statement Ring in 18K White Gold",
    metal: "18K White Gold",
    price: 1980,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
  },
];

export default function JewelleryPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={STATEMENT_RINGS_PRODUCTS}
        categoryTitle="Statement Rings"
        customMetals={STATEMENT_RINGS_METALS}
        hideDiamondType={false}
        hideCarat={true}
        hideStyle={true}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
