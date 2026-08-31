"use client";

import CategoryListing from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";

const ROSE_GOLD_METALS = [
  "9K Rose Gold",
  "18ct Rose Gold",
  "18K Rose Gold",
  "18k Rose Gold",
];

const ROSE_GOLD_CARATS = [
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

export default function RoseGoldClient() {
  return (
    <>
      <CategoryListing
        products={[]}
        categoryTitle="Rose Gold Jewellery"
        customMetals={ROSE_GOLD_METALS}
        customCarats={ROSE_GOLD_CARATS}
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
