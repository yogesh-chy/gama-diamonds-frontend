"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";

interface RecentlyViewedItem {
  title: string;
  rawPrice: number;
  hasPrefix: boolean;
  href: string;
  badge: string | null;
  isAppointment?: boolean;
  image?: string;
}

interface RingsRecentlyViewedProps {
  category?: string;
  shape?: string;
  style?: string;
}

export default function RingsRecentlyViewed({ category, shape, style }: RingsRecentlyViewedProps = {}) {
  const { formatPrice } = useCurrency();
  const [recentlyViewedItems, setRecentlyViewedItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    async function fetchRecentProducts() {
      try {
        let storedItems: RecentlyViewedItem[] = [];
        try {
          const raw = localStorage.getItem("gama_recently_viewed");
          if (raw) {
            storedItems = JSON.parse(raw);
          }
        } catch (e) {}

        const params: any = { limit: 6 };
        if (category) params.category = category;
        if (shape) params.diamond_cut = shape;
        if (style) params.style = style;

        const res = await productsApi.getProducts(params);
        const list = res.data?.data || [];
        const mappedApi: RecentlyViewedItem[] = list.map((item: any) => ({
          title: item.name || "Product",
          rawPrice: typeof item.base_price === "number" ? item.base_price : parseFloat(item.base_price || "0") || 0,
          hasPrefix: true,
          href: `/product/${item.id || item.slug}`,
          badge: item.is_featured ? "FEATURED" : null,
          image: item.thumbnail || item.images?.find((img: any) => img.isPrimary || img.is_primary)?.url || item.images?.[0]?.url || item.variants?.[0]?.images?.[0]?.url || item.image,
        }));

        // Merge stored local items + API items up to 3 products
        const combined: RecentlyViewedItem[] = [];
        for (const item of storedItems) {
          if (combined.length >= 3) break;
          combined.push(item);
        }
        for (const apiItem of mappedApi) {
          if (combined.length >= 3) break;
          if (!combined.some((x) => x.href === apiItem.href)) {
            combined.push(apiItem);
          }
        }

        // Add appointment card at end
        combined.push({
          title: "APPOINTMENT PAGE | SCHEDULE YOUR CONSULTATION",
          rawPrice: 0,
          hasPrefix: false,
          href: "/bespoke",
          badge: null,
          isAppointment: true,
        });

        setRecentlyViewedItems(combined.slice(0, 4));
      } catch (err) {
        setRecentlyViewedItems([
          {
            title: "APPOINTMENT PAGE | SCHEDULE YOUR CONSULTATION",
            rawPrice: 0,
            hasPrefix: false,
            href: "/bespoke",
            badge: null,
            isAppointment: true,
          },
        ]);
      }
    }
    fetchRecentProducts();
  }, [category, shape, style]);

  return (
    <section
      style={{
        padding: "50px 0 70px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "3.5px",
              textTransform: "uppercase",
              color: "#c6a45f",
            }}
          >
            RECENTLY VIEWED
          </h2>
        </div>

        {/* Product Cards Grid */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
            className="er-featured-grid"
          >
            {recentlyViewedItems.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.45 }}
              >
                <Link
                  href={item.href}
                  style={{ textDecoration: "none", display: "block" }}
                  className="cat-card-hover-box"
                >
                  <div
                    style={{
                      background: "#080808",
                      border: "1px solid rgba(255,255,255,0.06)",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Top-Left Badge */}
                    {item.badge && (
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          left: "10px",
                          zIndex: 5,
                          background: "#c6a45f",
                          color: "#000000",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "7.5px",
                          fontWeight: "700",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          padding: "4px 8px",
                          border: "none",
                        }}
                      >
                        {item.badge}
                      </div>
                    )}

                    {/* Product Image */}
                    {item.image ? (
                      <div style={{ width: "100%", height: "240px", overflow: "hidden", position: "relative" }}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <ImagePlaceholder
                        height="240px"
                        label={
                          item.isAppointment
                            ? "BOOK APPOINTMENT BANNER"
                            : `Product ${idx + 1} Image`
                        }
                        style={{ borderRadius: "0px", border: "none" }}
                      />
                    )}

                    {/* Product Details Text */}
                    <div
                      style={{
                        padding: "16px 12px 20px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minHeight: "90px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "9.5px",
                          fontWeight: "500",
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                          color: "#b0b0b0",
                          lineHeight: "1.6",
                          marginBottom: "8px",
                          maxHeight: "3.2em",
                          overflow: "hidden",
                        }}
                      >
                        {item.title}
                      </p>

                      <span
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          fontWeight: "600",
                          color: "#c6a45f",
                          letterSpacing: "1px",
                        }}
                      >
                        {item.hasPrefix ? `FROM ${formatPrice(item.rawPrice)}` : formatPrice(item.rawPrice)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
