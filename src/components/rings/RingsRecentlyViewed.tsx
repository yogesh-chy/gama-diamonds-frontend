"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

interface RecentlyViewedItem {
  title: string;
  rawPrice: number;
  hasPrefix: boolean;
  href: string;
  badge: string | null;
  image?: string;
}

interface RingsRecentlyViewedProps {
  category?: string;
  shape?: string;
  style?: string;
  currentProductId?: string | number;
}

export default function RingsRecentlyViewed({
  currentProductId,
}: RingsRecentlyViewedProps = {}) {
  const { formatPrice } = useCurrency();
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem("gama_recently_viewed");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Keep ONLY genuine products that the user has actually visited
          const realVisitedProducts: RecentlyViewedItem[] = parsed
            .filter(
              (x) =>
                x &&
                typeof x.title === "string" &&
                typeof x.href === "string" &&
                x.href.startsWith("/product/") &&
                !x.isAppointment &&
                (!currentProductId || !x.href.endsWith(`/${currentProductId}`))
            )
            .map((x) => ({
              title: x.title,
              rawPrice:
                typeof x.rawPrice === "number"
                  ? x.rawPrice
                  : parseFloat(x.rawPrice || "0") || 0,
              hasPrefix: Boolean(x.hasPrefix),
              href: x.href,
              badge: x.badge || null,
              image: x.image || undefined,
            }))
            .slice(0, 4);

          setItems(realVisitedProducts);
        }
      }
    } catch {
      setItems([]);
    }
  }, [currentProductId]);

  // If the user hasn't browsed/viewed any products yet, do NOT render the section
  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        padding: "50px 0 70px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
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

        {/* Real Visited Products Grid (1 to 4 cards) */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                items.length === 1
                  ? "minmax(260px, 320px)"
                  : items.length === 2
                  ? "repeat(2, minmax(260px, 320px))"
                  : items.length === 3
                  ? "repeat(3, minmax(240px, 1fr))"
                  : "repeat(4, 1fr)",
              justifyContent: "center",
              gap: "20px",
            }}
            className="er-featured-grid"
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.href || idx}
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
                      transition: "border-color 0.3s ease, transform 0.3s ease",
                    }}
                  >
                    {/* Badge */}
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
                    <div
                      style={{
                        width: "100%",
                        height: "260px",
                        overflow: "hidden",
                        position: "relative",
                        background: "#0a0a0a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "16px",
                      }}
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#555555",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            letterSpacing: "1.5px",
                            textTransform: "uppercase",
                          }}
                        >
                          Gama Jewels
                        </div>
                      )}
                    </div>

                    {/* Product Details Text */}
                    <div
                      style={{
                        padding: "16px 14px 20px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between",
                        minHeight: "92px",
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "9.5px",
                          fontWeight: "500",
                          letterSpacing: "1.2px",
                          textTransform: "uppercase",
                          color: "#c0c0c0",
                          lineHeight: "1.6",
                          marginBottom: "8px",
                          maxHeight: "3.2em",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
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
                        {item.rawPrice > 0
                          ? item.hasPrefix
                            ? `FROM ${formatPrice(item.rawPrice)}`
                            : formatPrice(item.rawPrice)
                          : "PRICE ON REQUEST"}
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
