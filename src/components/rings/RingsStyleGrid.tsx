"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

const styles = [
  {
    name: "Solitaire Engagement Ring Box",
    href: "/rings?style=solitaire",
    label: "SHOP SOLITAIRE RINGS",
  },
  {
    name: "Trilogy Three Stone Ring Box",
    href: "/rings?style=three-stone",
    label: "SHOP TRILOGY THREE STONE RINGS",
  },
  {
    name: "Under Halo Ring Box",
    href: "/rings?style=under-halo",
    label: "SHOP UNDER HALO RINGS",
  },
  {
    name: "Halo Engagement Ring Box",
    href: "/rings?style=halo",
    label: "SHOP HALO RINGS",
  },
  {
    name: "Diamond Shoulder Ring Box",
    href: "/rings?style=diamond-shoulder",
    label: "SHOP DIAMOND SHOULDER RINGS",
  },
  {
    name: "Eternity Ring Box",
    href: "/eternity",
    label: "SHOP ETERNITY RINGS",
  },
];

export default function RingsStyleGrid() {
  return (
    <section
      style={{
        padding: "20px 0 60px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* 3x2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
          className="er-style-grid"
        >
          {styles.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06, duration: 0.45 }}
            >
              <Link
                href={item.href}
                style={{
                  display: "block",
                  position: "relative",
                  overflow: "hidden",
                  textDecoration: "none",
                }}
                className="er-style-card"
              >
                {/* Velvet box image placeholder */}
                <ImagePlaceholder
                  height="340px"
                  label={item.name}
                  style={{ borderRadius: "0px" }}
                />

                {/* Golden pill button (flat, no glow) floating at bottom center */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "82%",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#c6a45f",
                      color: "#000000",
                      padding: "12px 16px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "9.5px",
                      fontWeight: "600",
                      letterSpacing: "1.8px",
                      textTransform: "uppercase",
                      boxShadow: "none",
                      border: "none",
                      transition: "all 0.3s ease",
                    }}
                    className="er-pill-btn"
                  >
                    {item.label}
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
