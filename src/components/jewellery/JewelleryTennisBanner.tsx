"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelleryTennisBanner() {
  return (
    <section style={{ padding: "0 0 60px", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            width: "100%",
            height: "440px",
            overflow: "hidden",
            border: "1px solid rgba(198, 164, 95, 0.2)",
            background: "#050505",
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1400&fit=crop"
            alt="Tennis Necklaces Collection"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
              transition: "transform 0.7s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />

          {/* Bottom Left Button Overlay */}
          <div
            style={{
              position: "absolute",
              bottom: "36px",
              left: "36px",
              zIndex: 10,
            }}
          >
            <Link
              href="/necklace"
              style={{
                display: "inline-block",
                padding: "14px 28px",
                backgroundColor: "#000000",
                color: "#ffffff",
                border: "1px solid #ffffff",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#c6a45f";
                e.currentTarget.style.borderColor = "#c6a45f";
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#000000";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.color = "#ffffff";
              }}
            >
              TENNIS NECKLACES
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
