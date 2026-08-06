"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RingsBanner() {
  return (
    <section
      style={{
        padding: "0 0 60px",
        background: "#000000",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Full-width wide banner with bottom-centered gold button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "relative", width: "100%", height: "360px" }}>
            <Image
              src="/2hero.png"
              alt="Wide Banner — Two Diamond Engagement Rings on Satin Fabric"
              fill
              style={{ objectFit: "cover", borderRadius: "0px" }}
              priority
            />
          </div>

          {/* Floating gold button at bottom center (flat, no glow) */}
          <div
            style={{
              position: "absolute",
              bottom: "28px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Link
              href="/rings"
              style={{
                display: "inline-block",
                background: "#c6a45f",
                color: "#000000",
                padding: "14px 36px",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "10px",
                fontWeight: "600",
                letterSpacing: "2.2px",
                textTransform: "uppercase",
                textDecoration: "none",
                boxShadow: "none",
                border: "none",
                transition: "all 0.3s ease",
              }}
              className="er-pill-btn"
            >
              SHOP ALL ENGAGEMENT RINGS
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
