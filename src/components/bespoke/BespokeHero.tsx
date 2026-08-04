"use client";

import { motion } from "framer-motion";

export default function BespokeHero() {
  return (
    <section
      className="bespoke-hero"
      style={{
        position: "relative",
        width: "100%",
        height: "clamp(420px, 55vh, 620px)",
        overflow: "hidden",
        borderBottom: "1px solid rgba(198, 164, 95, 0.15)",
      }}
    >
      <img
        src="/bespoke-banner.png"
        alt="Bespoke Engagement Rings"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.75) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "900px" }}>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              fontWeight: "500",
              color: "#ffffff",
              lineHeight: 1.15,
              marginBottom: "12px",
              textShadow: "0 4px 24px rgba(0,0,0,0.8)",
              letterSpacing: "0.5px",
            }}
          >
            Bespoke Engagement Rings
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.25rem, 3vw, 2rem)",
              fontStyle: "italic",
              fontWeight: "400",
              color: "#c6a45f",
              textShadow: "0 2px 16px rgba(0,0,0,0.9)",
              letterSpacing: "0.5px",
            }}
          >
            Designed Just For You
          </motion.p>
        </div>
      </div>
    </section>
  );
}
