import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diamond Wedding Rings & Bands | Men's & Women's",
  description:
    "Explore handcrafted diamond wedding rings and bands for men and women. Plain gold, micro-set diamonds, and bespoke matching bands in 18ct gold & platinum. Crafted by master goldsmiths in Mumbai.",
  alternates: {
    canonical: "https://www.gamajewels.com/wedding",
  },
  openGraph: {
    title: "Diamond Wedding Rings & Bands | Gama Jewels",
    description:
      "Handcrafted wedding rings and bands for men and women in 18ct gold and 950 platinum. Discover matching sets and bespoke services.",
    url: "https://www.gamajewels.com/wedding",
    type: "website",
  },
};

export default function WeddingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
