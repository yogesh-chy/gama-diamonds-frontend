import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

export const metadata = {
  title: "Diamond Earrings | Studs, Hoops, Drop & Halo Designs",
  description:
    "Shop exquisite diamond earrings — stud, hoop, drop & halo designs in 18ct gold & platinum. GIA certified natural & lab-grown diamonds, handcrafted by master goldsmiths. Free insured delivery.",
  alternates: {
    canonical: "https://www.gamajewels.com/earrings",
  },
  openGraph: {
    title: "Diamond Earrings | Gama Jewels",
    description:
      "Handcrafted diamond earrings in 18ct gold & platinum. Studs, hoops & drop designs with GIA certified diamonds.",
    url: "https://www.gamajewels.com/earrings",
    images: [{ url: "/shopbycategory/earings.png", width: 800, height: 600, alt: "Diamond Earrings Collection" }],
  },
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
