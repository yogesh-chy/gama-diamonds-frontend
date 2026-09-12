import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Hot Diamonds Collection | Signature Diamond & Silver Jewellery",
  description:
    "Explore the exclusive Hot Diamonds collection featuring signature sterling silver and real diamond jewellery at Gama Jewels.",
  alternates: {
    canonical: "https://www.gamajewels.com/hot-diamonds",
  },
  openGraph: {
    title: "Hot Diamonds Collection | Gama Jewels",
    description:
      "Signature silver and real diamond jewellery designs.",
    url: "https://www.gamajewels.com/hot-diamonds",
    type: "website",
  },
};


export default function HotDiamondsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
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
