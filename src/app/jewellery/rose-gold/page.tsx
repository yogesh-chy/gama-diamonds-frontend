import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RoseGoldClient from "./RoseGoldClient";

export const metadata = {
  title: "Rose Gold Jewellery | Gama Jewels – Fine Rose Gold Jewellery",
  description:
    "Shop our romantic Rose Gold jewellery collection — blush-toned earrings, pendants, bracelets, and rings crafted in 9K and 18K rose gold.",
};

export default function RoseGoldPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <RoseGoldClient />
      <Footer />
    </div>
  );
}
