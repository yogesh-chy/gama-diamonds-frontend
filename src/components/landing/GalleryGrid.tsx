"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const galleryItems = [
  {
    title: "Solitaire Engagement Rings",
    category: "Engagement",
    href: "/rings",
    src: "/shopbycategory/engement_ring.png",
  },
  {
    title: "Full Eternity Diamond Bands",
    category: "Wedding & Eternity",
    href: "/eternity",
    src: "/shopbycategory/eternity_ring.png",
  },
  {
    title: "Brilliant Cut Diamond Earrings",
    category: "Fine Earrings",
    href: "/earrings",
    src: "/shopbycategory/earings.png",
  },
  {
    title: "Signature Diamond Pendants",
    category: "Necklaces",
    href: "/necklace",
    src: "/shopbycategory/necklace.png",
  },
  {
    title: "Classic Tennis Bracelets",
    category: "Fine Jewellery",
    href: "/bracelets",
    src: "/shopbycategory/bracelet.png",
  },
  {
    title: "Custom Atelier Commissions",
    category: "Bespoke Design",
    href: "/bespoke",
    src: "/shopbycategory/bespoke_design.png",
  },
];

export default function GalleryGrid() {
  return (
    <section style={{ padding: "60px 0 80px", background: "#050505", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div className="section-label">FOLLOW @GAMAJEWELS</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.85rem",
              color: "#ffffff",
              marginTop: "6px",
            }}
          >
            Handcrafted Brilliance in Motion
          </h2>
          <div className="section-divider" style={{ marginTop: "12px" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "16px",
          }}
        >
          {galleryItems.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href={item.href}
                style={{
                  display: "block",
                  position: "relative",
                  height: "240px",
                  overflow: "hidden",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backgroundColor: "#0a0a0a",
                  textDecoration: "none",
                }}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "14px",
                  }}
                >
                  <span style={{ fontSize: "9px", color: "#c6a45f", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 600 }}>
                    {item.category}
                  </span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", color: "#ffffff", fontWeight: 600, marginTop: "2px" }}>
                    {item.title}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
