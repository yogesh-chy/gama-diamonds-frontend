import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Eternity Rings | Full, Half & Micro-Pave Bands",
  description:
    "Discover handcrafted diamond eternity rings — full eternity, half eternity & micro-pave bands in 18ct gold & platinum. GIA certified natural & lab-grown diamonds. Free insured delivery.",
  alternates: {
    canonical: "https://www.gamajewels.com/eternity",
  },
  openGraph: {
    title: "Diamond Eternity Rings | Gama Jewels",
    description:
      "Handcrafted diamond eternity rings in 18ct gold & platinum. Full, half eternity & micro-pave designs.",
    url: "https://www.gamajewels.com/eternity",
    images: [{ url: "/shopbycategory/eternity_ring.png", width: 800, height: 600, alt: "Diamond Eternity Rings Collection" }],
  },
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
