"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelleryHeroSplit() {
  return (
    <section
      style={{
        padding: "60px 0 40px",
        background: "#000000",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Text Block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#c6a45f",
                display: "block",
                marginBottom: "12px",
              }}
            >
              FINE JEWELLERY
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "20px",
                lineHeight: "1.2",
              }}
            >
              PRECIOUS JEWELLERY
            </h1>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                color: "#bfbfbf",
                lineHeight: "1.8",
                marginBottom: "32px",
                maxWidth: "500px",
              }}
            >
              Discover our handcrafted fine diamond jewellery collection. From elegant
              pendants and classic tennis bracelets to solitaire diamond studs and
              statement hoops, crafted in Mumbai with precision and care.
            </p>

            <Link
              href="#jewellery-grid"
              style={{
                display: "inline-block",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#c6a45f",
                textDecoration: "none",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#e5c97a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c6a45f")}
            >
              Explore Collection &gt;
            </Link>
          </motion.div>

          {/* Right Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "380px",
                overflow: "hidden",
                border: "1px solid rgba(198, 164, 95, 0.25)",
                background: "#080808",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&fit=crop"
                alt="Precious Fine Diamond Jewellery Collection"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  transition: "transform 0.7s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
