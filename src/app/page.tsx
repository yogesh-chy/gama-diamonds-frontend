import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import CategoryGrid from "@/components/landing/CategoryGrid";
import StorySection from "@/components/landing/StorySection";
import FeaturedProducts from "@/components/landing/FeaturedProducts";
import FeatureCards from "@/components/landing/FeatureCards";
import DiamondShapes from "@/components/landing/DiamondShapes";
import SignatureSection from "@/components/landing/SignatureSection";
import WeddingSplit from "@/components/landing/WeddingSplit";
import ShowroomInfo from "@/components/landing/ShowroomInfo";
import StoreSection from "@/components/landing/StoreSection";
import ServiceFeatures from "@/components/landing/ServiceFeatures";
import GalleryGrid from "@/components/landing/GalleryGrid";
import ReviewsSection from "@/components/landing/ReviewsSection";
import CertificationBar from "@/components/landing/CertificationBar";
import {
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  FAQJsonLd,
} from "@/components/seo/JsonLd";

export default function Home() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      {/* ─── SEO: Structured Data ─── */}
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <FAQJsonLd
        items={[
          {
            question: "What types of diamonds does Gama Jewels offer?",
            answer:
              "Gama Jewels offers both GIA certified natural diamonds and sustainable lab-grown diamonds. All diamonds come with full certification and a lifetime warranty.",
          },
          {
            question: "Can I create a custom engagement ring?",
            answer:
              "Yes! We specialise in bespoke engagement rings. Our master goldsmiths use 3D CAD design to create your dream ring from concept to completion, handcrafted in our Mumbai atelier.",
          },
          {
            question: "Do you offer free delivery?",
            answer:
              "Yes, we offer free insured delivery on all orders over £376. All shipments are fully insured and sent via discreet, secure courier service worldwide.",
          },
          {
            question: "What is your return policy?",
            answer:
              "We offer a 30-day exchange policy on all our jewellery pieces. Each piece also comes with a 1-year warranty and complimentary annual servicing.",
          },
          {
            question: "Where is Gama Jewels located?",
            answer:
              "Our showroom is located at SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI(E.) MUMBAI 400059, Maharashtra, India. We welcome private appointments and walk-in consultations.",
          },
        ]}
      />

      {/* ─── HEADER ─── */}
      <Header />

      {/* ─── SECTION 1: HERO SLIDER / BANNER ─── */}
      <HeroSection />

      {/* ─── SECTION 2: GRID OF 8 PRODUCT CATEGORY THUMBNAILS (4x2) ─── */}
      <CategoryGrid />

      {/* ─── SECTION 3: STORY / TEXT LEFT + IMAGE RIGHT ─── */}
      <StorySection />

      {/* ─── SECTION 4: FEATURED PRODUCT SLIDER / CAROUSEL ─── */}
      <FeaturedProducts />

      {/* ─── SECTION 5: 3 LARGE FEATURE CARDS / BANNERS (1x3) ─── */}
      <FeatureCards />

      {/* ─── SECTION 6: SHOP BY DIAMOND SHAPE ─── */}
      <DiamondShapes />

      {/* ─── SECTION 7: FEATURE HIGHLIGHT (IMAGE LEFT + TEXT RIGHT) ─── */}
      <SignatureSection />

      {/* ─── SECTION 8: DUAL SPLIT BANNER (MEN'S / WOMEN'S WEDDING RINGS) ─── */}
      <WeddingSplit />

      {/* ─── SECTION 9: TEXT INFO BLOCK ─── */}
      <ShowroomInfo />

      {/* ─── SECTION 10: STORE SHOWROOM FEATURE (IMAGE LEFT + INFO RIGHT) ─── */}
      <StoreSection />

      {/* ─── SECTION 11: FEATURE ICONS / ASSURANCE BAR (4 COLUMNS) ─── */}
      <ServiceFeatures />

      {/* ─── SECTION 12: GALLERY / SKELETON PLACEHOLDERS ─── */}
      <GalleryGrid />

      {/* ─── SECTION 13: CUSTOMER REVIEWS CAROUSEL ─── */}
      <ReviewsSection />

      {/* ─── SECTION 14: BRAND & CERTIFICATION LOGOS BAR ─── */}
      <CertificationBar />

      {/* ─── FOOTER ─── */}
      <Footer />
    </div>
  );
}

