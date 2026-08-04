"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const recentlyViewedItems = [
  {
    title:
      "ROUND CUT SOLITAIRE DIAMOND IN FOUR CLAW SETTING LOOP PENDANT WITH CHAIN PSR848M",
    price: "FROM £1,020.00",
    href: "/product/psr848m",
    badge: null,
  },
  {
    title:
      '"ADDISON" HIDDEN UNDER HALO 2.50 CARAT OVAL CUT DIAMOND YELLOW GOLD ENGAGEMENT RING UH006',
    price: "FROM £2,800.00",
    href: "/product/uh006",
    badge: null,
  },
  {
    title:
      '"CORVELLA" 0.35 CARAT ROUND CUT NATURAL DIAMOND HALF ETERNITY RING MDR4101',
    price: "£770.00",
    href: "/product/mdr4101",
    badge: "NEXT DAY DELIVERY",
  },
  {
    title: "APPOINTMENT PAGE | SCHEDULE YOUR CONSULTATION",
    price: "£0.00",
    href: "/bespoke",
    badge: null,
    isAppointment: true,
  },
];

export default function RingsRecentlyViewed() {
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

        {/* Product Cards Grid with Carousel Right Arrow */}
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

                    {/* Image Placeholder */}
                    <ImagePlaceholder
                      height="240px"
                      label={
                        item.isAppointment
                          ? "BOOK APPOINTMENT BANNER"
                          : `Product ${idx + 1} Image`
                      }
                      style={{ borderRadius: "0px", border: "none" }}
                    />

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
                        {item.price}
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
