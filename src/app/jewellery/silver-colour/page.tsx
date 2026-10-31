import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SilverColourClient from "./SilverColourClient";

export const metadata = {
  title: "Silver Colour Jewellery | Gama Jewels – Fine White Gold & Platinum Jewellery",
  description:
    "Explore our Silver Colour jewellery collection — timeless pieces crafted in sterling silver, white gold, and platinum tones.",
};

export default function SilverColourPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <SilverColourClient />
      <Footer />
    </div>
  );
}
