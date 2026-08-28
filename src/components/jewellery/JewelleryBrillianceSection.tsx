"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelleryBrillianceSection() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#000000",
        textAlign: "center",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
              fontWeight: 400,
              color: "#ffffff",
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              marginBottom: "20px",
              lineHeight: "1.3",
            }}
          >
            DISCOVER FINE BRILLIANCE AT
            <br />
            GAMA JEWELS LONDON
          </h2>

          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              fontWeight: 300,
              color: "#a0a0a0",
              lineHeight: "1.8",
              marginBottom: "36px",
              maxWidth: "680px",
              marginInline: "auto",
            }}
          >
            Visit our Hatton Garden showroom or explore our online collection to discover
            exquisite diamond jewellery handcrafted to perfection by London master jewellers.
          </p>

          <Link
            href="/bespoke"
            style={{
              display: "inline-block",
              padding: "16px 40px",
              backgroundColor: "transparent",
              color: "#c6a45f",
              border: "1px solid #c6a45f",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c6a45f";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#c6a45f";
            }}
          >
            APPOINTMENTS &amp; CONTACT
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
