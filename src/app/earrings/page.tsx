import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Earrings | Gama Jewels – Fine Jewellery",
  description:
    "Explore our handcrafted diamond & gemstone earrings. Crafted by master goldsmiths in Mumbai.",
};

export default function EarringsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={[]}
        categoryTitle="Earrings"
        customStyles={[
          "Drop Earrings",
          "Earrings",
          "Hoop Earrings",
          "Stud Earrings",
          "Halo Earrings",
          "Chandelier Earrings",
        ]}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
