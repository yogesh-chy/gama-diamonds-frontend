"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function WeddingMatchingBanner() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#000000",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
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
              FIND MY MATCHING WEDDING RING
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
              Try our matching service to find your perfect wedding band designed
              to fit seamlessly with your engagement ring shape, width, and setting.
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
              Try Today &rarr;
            </Link>
          </motion.div>

          {/* Right Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "540px",
                margin: "0 auto",
                overflow: "hidden",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=900&fit=crop"
                alt="Matching Wedding Band & Engagement Ring Set"
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "18px",
                fontStyle: "italic",
                color: "#c6a45f",
                marginTop: "16px",
                letterSpacing: "2px",
              }}
            >
              Perfect
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
