"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

export default function RingsTestimonial() {
  return (
    <section
      style={{
        padding: "60px 0",
        background: "#0a0a0a",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Centered card-like testimonial block matching inspiration */}
          <div
            style={{
              maxWidth: "780px",
              margin: "0 auto",
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "40px 36px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Decorative quote mark */}
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "56px",
                color: "#c6a45f",
                lineHeight: "0.5",
                marginBottom: "18px",
                opacity: 0.45,
              }}
            >
              &ldquo;
            </div>

            {/* Quote text */}
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(0.95rem, 2vw, 1.2rem)",
                fontStyle: "italic",
                color: "#e0e0e0",
                lineHeight: "1.75",
                marginBottom: "22px",
              }}
            >
              The moment I saw the ring, I knew it was perfect. The
              craftsmanship was extraordinary — every facet of the diamond
              catches the light beautifully. My fiancée was in tears of joy.
              Thank you, Gama Jewels, for making our engagement truly
              unforgettable.
            </p>

            {/* Author line */}
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#c6a45f",
                marginBottom: "4px",
              }}
            >
              James &amp; Victoria W.
            </div>
            <div
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "10px",
                color: "#666666",
                letterSpacing: "1.2px",
              }}
            >
              ✦ Verified Buyer — Round Brilliant Solitaire
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
