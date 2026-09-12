import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fine Diamond Jewellery | Handcrafted Luxury Collection",
  description:
    "Explore Gama Jewels' fine diamond jewellery collection — diamond pendant necklaces, solitaire studs, tennis bracelets, eternity bands & hoop earrings in 18ct gold and platinum.",
  alternates: {
    canonical: "https://www.gamajewels.com/jewellery",
  },
  openGraph: {
    title: "Fine Diamond Jewellery | Gama Jewels",
    description:
      "Explore Gama Jewels' fine diamond jewellery collection — diamond necklaces, earrings, bracelets, and bespoke creations handcrafted in Mumbai.",
    url: "https://www.gamajewels.com/jewellery",
    type: "website",
  },
};

export default function JewelleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
