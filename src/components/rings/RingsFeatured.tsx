"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const recentDesigns = [
  {
    title: "Yellow Gold Pendant Necklace",
    category: "NECKLACES",
    href: "/necklace",
  },
  {
    title: "Solitaire Oval Cut Engagement Ring",
    category: "ENGAGEMENT RINGS",
    href: "/rings?shape=oval",
  },
  {
    title: "Diamond Eternity Band",
    category: "ETERNITY RINGS",
    href: "/eternity",
  },
  {
    title: "Bespoke Velvet Ring Box & Packaging",
    category: "BESPOKE ACCESSORIES",
    href: "/bespoke",
  },
];

export default function RingsFeatured() {
  return (
    <section
      style={{
        padding: "60px 0 80px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Section Title */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "10px",
              fontWeight: "600",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#c6a45f",
              marginBottom: "8px",
            }}
          >
            RECENT DESIGNS &amp; CREATIONS
          </div>
          <div className="section-divider" />
        </div>

        {/* 4 Card Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "20px",
          }}
          className="er-featured-grid"
        >
          {recentDesigns.map((item, idx) => (
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
                className="er-featured-card cat-card-hover-box"
              >
                <div
                  style={{
                    background: "#090909",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0px",
                    overflow: "hidden",
                    transition:
                      "border-color 0.3s, transform 0.3s, box-shadow 0.3s",
                  }}
                >
                  <ImagePlaceholder
                    height="240px"
                    label={item.title}
                    style={{ borderRadius: "0px", border: "none" }}
                  />

                  <div
                    style={{
                      padding: "16px 12px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "9px",
                        fontWeight: "600",
                        color: "#c6a45f",
                        letterSpacing: "1.8px",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {item.category}
                    </div>
                    <h4
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#ffffff",
                        lineHeight: "1.4",
                      }}
                    >
                      {item.title}
                    </h4>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
