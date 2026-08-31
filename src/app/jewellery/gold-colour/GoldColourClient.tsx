"use client";

import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

const GOLD_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18k Yellow Gold",
  "18ct Rose Gold",
  "18K Rose Gold",
  "18k Rose Gold",
  "Platinum",
];

const GOLD_CARATS = [
  "0.20ct",
  "0.25ct",
  "0.30ct",
  "0.40ct",
  "0.50ct",
  "0.70ct",
  "0.90ct",
  "1.00ct",
  "1.20ct",
];

export default function GoldColourClient() {
  return (
    <>
      <CategoryListing
        products={[]}
        categoryTitle="Gold Colour Jewellery"
        customMetals={GOLD_METALS}
        customCarats={GOLD_CARATS}
        defaultMinPrice={290}
        defaultMaxPrice={8700}
        hideDiamondType={false}
        hideCarat={false}
        hideColor={true}
        hideStyle={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
    </>
  );
}
