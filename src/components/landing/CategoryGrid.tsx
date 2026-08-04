"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { categoryGridItems, fadeInUp } from "@/lib/constants";

export default function CategoryGrid() {
  return (
    <section style={{ padding: "60px 0", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: "center", marginBottom: "36px" }}
        >
          <div className="section-label">OUR COLLECTIONS</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              color: "#ffffff",
              marginTop: "8px",
            }}
          >
            Shop By Category
          </h2>
          <div className="section-divider" style={{ marginTop: "14px" }}></div>
        </motion.div>

        {/* 4x2 Category Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {categoryGridItems.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.5 }}
            >
              <Link
                href={cat.href}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    borderRadius: "0px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    transition: "all 0.3s ease",
                    background: "#0c0c0c",
                  }}
                  className="cat-card-hover-box"
                >
                  {cat.image ? (
                    <div style={{ height: "190px", overflow: "hidden", position: "relative" }}>
                      <img
                        src={cat.image}
                        alt={cat.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.5s ease",
                        }}
                        className="hover:scale-105"
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      height="190px"
                      label={cat.name}
                      style={{ borderRadius: "0px" }}
                    />
                  )}
                  <div
                    style={{
                      padding: "14px 16px",
                      textAlign: "center",
                      background: "#0a0a0a",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "15px",
                        color: "#ffffff",
                        fontWeight: "600",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {cat.name}
                    </div>
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
