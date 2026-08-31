"use client";

import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

const SILVER_METALS = [
  "9K White Gold",
  "18K White Gold",
  "18ct White Gold",
  "18ct White gold",
  "18k White Gold",
  "Platinum",
];

const SILVER_CARATS = [
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

export default function SilverColourClient() {
  return (
    <>
      <CategoryListing
        products={[]}
        categoryTitle="Silver Colour Jewellery"
        customMetals={SILVER_METALS}
        customCarats={SILVER_CARATS}
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
