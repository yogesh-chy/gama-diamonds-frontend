import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Eternity Rings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond eternity rings. Crafted by master goldsmiths in Mumbai.",
};

export default function EternityRingsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Eternity Rings"
        customStyles={["Full Eternity", "Half Eternity", "Seven Stone", "Micro-Pave", "STYLE: FULL ETERNITY", "STYLE: HALF ETERNITY"]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
