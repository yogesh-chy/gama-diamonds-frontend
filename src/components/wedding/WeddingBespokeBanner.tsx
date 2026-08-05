"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WeddingBespokeBanner() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#050505",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* Left Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ paddingRight: "20px" }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "20px",
                lineHeight: "1.25",
              }}
            >
              WEDDING RING BESPOKE
            </h2>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                color: "#bfbfbf",
                lineHeight: "1.8",
                marginBottom: "32px",
                maxWidth: "520px",
              }}
            >
              Every relationship is unique, and your wedding rings should be too.
              Work with our master goldsmiths to craft personalized bespoke wedding
              bands tailored to your exact vision and style preferences.
            </p>

            <Link
              href="/bespoke"
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
              Create a Custom Design &gt;
            </Link>
          </motion.div>

          {/* Right Image Content - Master Jeweller / Craftsman */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxHeight: "440px",
                overflow: "hidden",
                border: "1px solid rgba(198, 164, 95, 0.2)",
              }}
            >
              <img
                src="/heritage.png"
                alt="Bespoke Master Goldsmith Craftsman"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
