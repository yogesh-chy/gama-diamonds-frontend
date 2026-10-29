"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryListing, { ProductItem } from "@/components/rings/CategoryListing";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import CertificationBar from "@/components/landing/CertificationBar";
import { productsApi } from "@/lib/api/products";

const WOMENS_PLAIN_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18K Rose Gold",
  "Platinum",
];

const WOMENS_PLAIN_STYLES = [
  "Flat Court",
  "Soft Court",
  "Traditional Court",
  "Eternity Rings",
];

export default function WomensPlainWeddingPageClient() {
  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const settled = await Promise.allSettled([
          productsApi.getProducts({
            category: "wedding-rings",
            gender: "women",
            status: "active",
            limit: 100,
          }),
          productsApi.getProducts({
            category: "wedding-bands",
            gender: "women",
            status: "active",
            limit: 100,
          }),
          productsApi.getProducts({
            subcategory: "womens-plain",
            status: "active",
            limit: 100,
          }),
        ]);

        const itemMap = new Map<string | number, any>();
        for (const res of settled) {
          if (res.status === "fulfilled" && res.value?.data?.data) {
            const list = res.value.data.data;
            if (Array.isArray(list)) {
              for (const item of list) {
                if (item && item.id && item.is_active !== false) {
                  itemMap.set(item.id, item);
                }
              }
            }
          }
        }

        const mapped: ProductItem[] = Array.from(itemMap.values()).map((item: any) => ({
          id: String(item.id || item.slug),
          title: item.name,
          metal:
            item.metal_karat && item.metal_type
              ? `${item.metal_karat} ${item.metal_type.replace("-", " ")}`
              : "18K Gold",
          price: Number(item.base_price || 0),
          badge: item.is_featured ? "BESTSELLER" : undefined,
          inStock: Number(item.total_stock || 0) > 0,
          image: item.images?.[0]?.url || item.thumbnail || undefined,
          style: item.ring_style || item.band_style || "Plain",
        }));

        setProducts(mapped);
      } catch {
        setProducts([]);
      }
    }

    load();
  }, []);

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />
      <CategoryListing
        products={products}
        categoryTitle="Women's Plain Wedding Rings"
        customStyles={WOMENS_PLAIN_STYLES}
        customMetals={WOMENS_PLAIN_METALS}
        defaultMinPrice={0}
        defaultMaxPrice={30000}
        hideDiamondType={true}
        hideCarat={true}
        hideStyle={false}
        hideColor={true}
      />
      <RingsRecentlyViewed />
      <CertificationBar />
      <Footer />
    </div>
  );
}
