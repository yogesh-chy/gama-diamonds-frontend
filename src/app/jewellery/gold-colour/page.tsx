import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GoldColourClient from "./GoldColourClient";

export const metadata = {
  title: "Gold Colour Jewellery | Gama Jewels – Fine Yellow Gold Jewellery",
  description:
    "Discover our exquisite Gold Colour jewellery collection — earrings, necklaces, bracelets, and rings crafted in warm yellow, white and rose gold tones.",
};

export default function GoldColourPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <GoldColourClient />
      <Footer />
    </div>
  );
}
