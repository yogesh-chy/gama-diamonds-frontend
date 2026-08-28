import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BespokeHero from "@/components/bespoke/BespokeHero";
import BespokeFeatureBar from "@/components/bespoke/BespokeFeatureBar";
import BespokeInquiryForm from "@/components/bespoke/BespokeInquiryForm";
import BespokeProcessRows from "@/components/bespoke/BespokeProcessRows";
import BespokeLoveStories from "@/components/bespoke/BespokeLoveStories";
import BespokePersonalisedDesigns from "@/components/bespoke/BespokePersonalisedDesigns";
import BespokeReviews from "@/components/bespoke/BespokeReviews";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Bespoke Engagement Rings | Gama Jewels – Custom Fine Jewellery",
  description:
    "Create your dream engagement ring with Gama Jewels. Bespoke designs crafted by master goldsmiths in Hatton Garden, London — from concept to certification.",
};

export default function BespokePage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <BespokeHero />
      <BespokeFeatureBar />
      <BespokeInquiryForm />
      <BespokeProcessRows />
      <BespokeLoveStories />
      <BespokePersonalisedDesigns />
      <BespokeReviews />
      <CertificationBar />
      <Footer />
    </div>
  );
}
