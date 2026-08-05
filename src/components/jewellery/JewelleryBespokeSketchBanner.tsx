"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelleryBespokeSketchBanner() {
  return (
    <section style={{ padding: "0 0 80px", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            width: "100%",
            height: "480px",
            overflow: "hidden",
            border: "1px solid rgba(198, 164, 95, 0.25)",
            background: "#050505",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Background Image: Jewelers Desk Sketches & Diamonds */}
          <img
            src="/bespoke-banner.png"
            alt="Bespoke Jewellery Sketches and Diamonds"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              filter: "brightness(0.85)",
            }}
          />

          {/* Centered Overlay Card */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              maxWidth: "480px",
              padding: "40px 36px",
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              color: "#000000",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
              margin: "0 20px",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.8rem",
                fontWeight: 600,
                color: "#000000",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              BESPOKE JEWELLERY
            </h2>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: 400,
                color: "#444444",
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              As custom jewellery specialists, we handcraft bespoke pieces to celebrate
              life&apos;s most precious milestones. Collaborate directly with our Hatton
              Garden craftsmen to design your dream piece.
            </p>

            <Link
              href="/bespoke"
              style={{
                display: "inline-block",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#c6a45f",
                textDecoration: "none",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#9e7d3b")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#c6a45f")}
            >
              Create a Custom Design &gt;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
