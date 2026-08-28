import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Bracelets & Bangles | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone bracelets and bangles. Crafted by master goldsmiths in Hatton Garden, London.",
};

const BRACELET_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18k White Gold",
  "18k Yellow Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "Platinum",
  "18K 3 Tone",
];

const BRACELET_CARATS = ["12.30ct", "12.50ct"];

const BRACELET_STYLES = [
  "All Bracelets",
  "Bracelet & Bangle",
  "Only Bracelets",
  "Tennis Bracelet",
];

const BRACELETS_PRODUCTS: ProductItem[] = [
  {
    id: "br-01",
    title: "Round Cut Diamond Tennis Bracelet in 18K White Gold",
    metal: "18K White Gold",
    price: 4850,
    badge: "NEXT DAY",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "12.30ct",
    style: "Tennis Bracelet",
  },
  {
    id: "br-02",
    title: "Classic Diamond Bangle in Platinum",
    metal: "Platinum",
    price: 6900,
    badge: "BESTSELLER",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "12.50ct",
    style: "Bracelet & Bangle",
  },
  {
    id: "br-03",
    title: "Solid Hinged Diamond Bangle in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 3250,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "12.30ct",
    style: "All Bracelets",
  },
  {
    id: "br-04",
    title: "Triple Tone Diamond Bracelet in 18K 3 Tone",
    metal: "18K 3 Tone",
    price: 5400,
    badge: "NEW",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "12.50ct",
    style: "Only Bracelets",
  },
  {
    id: "br-05",
    title: "Delicate Diamond Chain Bracelet in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 2250,
    badge: "POPULAR",
    inStock: true,
    diamondType: "Natural Diamond",
    carat: "12.30ct",
    style: "Only Bracelets",
  },
  {
    id: "br-06",
    title: "Diamond Tennis Line Bracelet in 9K White Gold",
    metal: "9K White Gold",
    price: 3800,
    badge: "EXCLUSIVE",
    inStock: true,
    diamondType: "Lab Grown Diamond",
    carat: "12.50ct",
    style: "Tennis Bracelet",
  },
];

export default function BraceletsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={BRACELETS_PRODUCTS}
        categoryTitle="Bracelets & Bangles"
        customMetals={BRACELET_METALS}
        customCarats={BRACELET_CARATS}
        customStyles={BRACELET_STYLES}
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
