"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export default function RingsHero() {
  return (
    <section
      style={{
        width: "100%",
        background: "#000000",
        padding: "40px 0 60px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "stretch",
            minHeight: "520px",
          }}
          className="er-hero-grid"
        >
          {/* Left Column Text Box */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "60px 48px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            {/* Tagline */}
            <div
              className="section-label"
              style={{
                marginBottom: "16px",
                fontSize: "11px",
                letterSpacing: "3px",
              }}
            >
              GAMA DIAMONDS, LONDON
            </div>

            {/* Main Title */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: "600",
                color: "#ffffff",
                lineHeight: "1.2",
                marginBottom: "20px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              A Promise of Forever
            </h1>

            {/* Paragraph */}
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#b0b0b0",
                lineHeight: "1.8",
                marginBottom: "32px",
                maxWidth: "480px",
              }}
            >
              Our timeless eternity rings symbolize everlasting love, while our
              elegant wedding bands celebrate the union of hearts. Discover the
              perfect pieces to cherish for a lifetime in our collection of
              diamond engagement rings, eternity rings and wedding bands.
            </p>

            {/* CTA Link */}
            <div>
              <Link
                href="/rings"
                className="btn-outline-gold"
                style={{
                  fontSize: "10.5px",
                  padding: "14px 32px",
                  borderRadius: "0px",
                  letterSpacing: "2px",
                }}
              >
                SHOP ALL ENGAGEMENT RINGS
              </Link>
            </div>
          </motion.div>

          {/* Right Column Large Ring Tray Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            style={{ height: "100%", minHeight: "420px" }}
          >
            <ImagePlaceholder
              height="100%"
              label="Engagement Ring Tray — Multi-Shape Ring Display Box"
              style={{ borderRadius: "0px", height: "100%" }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
