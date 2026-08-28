import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Women's Plain Wedding Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our collection of women's plain wedding rings handcrafted by master goldsmiths in Hatton Garden, London.",
};

const WOMENS_PLAIN_PRODUCTS: ProductItem[] = [
  {
    id: "wp-01",
    title: "2mm Band Classic Traditional Court Wedding Ring",
    metal: "18K White Gold",
    price: 350,
    badge: "BESTSELLER",
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "wp-02",
    title: "2mm Band Classic Soft Court Wedding Ring",
    metal: "18K Yellow Gold",
    price: 370,
    badge: "POPULAR",
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "wp-03",
    title: "2mm Band Flat Court Wedding Ring",
    metal: "Platinum",
    price: 360,
    badge: "NEXT DAY",
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "wp-04",
    title: "2.5mm Band Classic Traditional Court Wedding Ring",
    metal: "9K Yellow Gold",
    price: 330,
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "wp-05",
    title: "3mm Band Flat Court Wedding Ring in 9K White Gold",
    metal: "9K White Gold",
    price: 380,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "wp-06",
    title: "2mm Band Soft Court Wedding Ring in 9K Rose Gold",
    metal: "9K Rose Gold",
    price: 310,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "wp-07",
    title: "2.5mm Band Traditional Court Wedding Ring in 18K Rose Gold",
    metal: "18K Rose Gold",
    price: 490,
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "wp-08",
    title: "3mm Diamond Eternity Ring in Platinum",
    metal: "Platinum",
    price: 1250,
    badge: "EXCLUSIVE",
    inStock: true,
    style: "Eternity Rings",
  },
  {
    id: "wp-09",
    title: "2.5mm Band Soft Court Wedding Ring in Platinum",
    metal: "Platinum",
    price: 520,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "wp-10",
    title: "3mm Classic Traditional Court Wedding Ring in 18K Yellow Gold",
    metal: "18K Yellow Gold",
    price: 610,
    inStock: true,
    style: "Traditional Court",
  },
  {
    id: "wp-11",
    title: "2mm Flat Court Wedding Ring in 18K White Gold",
    metal: "18K White Gold",
    price: 440,
    inStock: true,
    style: "Flat Court",
  },
  {
    id: "wp-12",
    title: "2.5mm Full Eternity Band in 18K White Gold",
    metal: "18K White Gold",
    price: 1450,
    badge: "BESTSELLER",
    inStock: true,
    style: "Eternity Rings",
  },
  {
    id: "wp-13",
    title: "3mm Soft Court Wedding Ring in 9K Yellow Gold",
    metal: "9K Yellow Gold",
    price: 390,
    inStock: true,
    style: "Soft Court",
  },
  {
    id: "wp-14",
    title: "4mm Traditional Court Wedding Ring in Platinum",
    metal: "Platinum",
    price: 2710,
    inStock: true,
    style: "Traditional Court",
  },
];

const WOMENS_PLAIN_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const WOMENS_PLAIN_STYLES = [
  "Flat Court",
  "Soft Court",
  "Traditional Court",
  "Eternity Rings",
];

export default function WomensPlainPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={WOMENS_PLAIN_PRODUCTS}
        categoryTitle="Women's Plain Wedding Rings"
        customStyles={WOMENS_PLAIN_STYLES}
        customMetals={WOMENS_PLAIN_METALS}
        defaultMinPrice={310}
        defaultMaxPrice={2710}
        hideDiamondType={true}
        hideCarat={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
