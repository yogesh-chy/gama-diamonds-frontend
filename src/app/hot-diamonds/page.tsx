import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Hot Diamonds | Gama Diamond – Brand Collection",
  description:
    "Explore the exclusive Hot Diamonds collection featuring signature silver and real diamond jewellery.",
};

const HOT_DIAMONDS_PRODUCTS: ProductItem[] = [
  {
    id: "hd-01",
    title: "Hot Diamonds Sterling Silver & Diamond Pendant",
    metal: "Sterling Silver",
    price: 120,
    badge: "BESTSELLER",
    inStock: true,
  },
  {
    id: "hd-02",
    title: "Hot Diamonds Paradise Open Heart Pendant",
    metal: "Sterling Silver",
    price: 95,
    badge: "POPULAR",
    inStock: true,
  },
  {
    id: "hd-03",
    title: "Hot Diamonds Diamond Accent Hoop Earrings",
    metal: "Sterling Silver",
    price: 150,
    badge: "EXCLUSIVE",
    inStock: true,
  },
  {
    id: "hd-04",
    title: "Hot Diamonds Eternal Wave Diamond Bracelet",
    metal: "Sterling Silver",
    price: 180,
    badge: "NEW",
    inStock: false,
  },
  {
    id: "hd-05",
    title: "Hot Diamonds Shooting Star Diamond Ring",
    metal: "Sterling Silver",
    price: 85,
    badge: "NEXT DAY",
    inStock: true,
  },
  {
    id: "hd-06",
    title: "Hot Diamonds Diamond Touch Bangle",
    metal: "Sterling Silver",
    price: 210,
    badge: "POPULAR",
    inStock: false,
  },
];

export default function HotDiamondsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={HOT_DIAMONDS_PRODUCTS}
        categoryTitle="Hot Diamonds"
        hideMetal={true}
        hideDiamondType={true}
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
