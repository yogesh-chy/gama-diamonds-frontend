import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us & Contact | Master Goldsmiths & Diamond Experts",
  description:
    "Learn about Gama Jewels — over 30 years of artisanal diamond craftsmanship based in Mumbai. GIA certified natural and lab-grown diamonds, bespoke commissions, and showroom consultations.",
  alternates: {
    canonical: "https://www.gamajewels.com/about",
  },
  openGraph: {
    title: "About Gama Jewels | Master Goldsmiths & Fine Diamond Jewellery",
    description:
      "Over 30 years of heritage in fine diamond jewellery and bespoke commissions. Visit our Mumbai showroom or contact our gemmological team.",
    url: "https://www.gamajewels.com/about",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
