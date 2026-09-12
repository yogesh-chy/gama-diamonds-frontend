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
  title: "Bespoke Engagement Rings | Custom Diamond Ring Design Service",
  description:
    "Create your dream engagement ring with Gama Jewels. Bespoke diamond ring designs crafted by master goldsmiths in Mumbai — from 3D CAD concept to GIA certification. Free consultation & worldwide delivery.",
  alternates: {
    canonical: "https://www.gamajewels.com/bespoke",
  },
  openGraph: {
    title: "Bespoke Engagement Rings | Custom Design Service | Gama Jewels",
    description:
      "Create your dream diamond engagement ring. Custom bespoke designs from concept to certification by master goldsmiths.",
    url: "https://www.gamajewels.com/bespoke",
    images: [{ url: "/shopbycategory/bespoke_design.png", width: 800, height: 600, alt: "Bespoke Diamond Ring Design" }],
  },
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
