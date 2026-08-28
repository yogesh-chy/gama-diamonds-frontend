"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

export default function StorySection() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#060606",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Left Text Box */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>
              HERITAGE & CRAFTSMANSHIP
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2.25rem",
                color: "#ffffff",
                lineHeight: "1.25",
                marginBottom: "20px",
              }}
            >
              Solitaire, Vintage & Bespoke Jewellery
            </h2>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#b0b0b0",
                lineHeight: "1.8",
                marginBottom: "20px",
              }}
            >
              At{" "}
              <span style={{ color: "#c6a45f", fontWeight: "600" }}>
                Gama Jewels
              </span>
              , we craft extraordinary engagement rings and fine jewellery
              tailored to your exact romantic vision. Located in London&apos;s
              famous diamond district of{" "}
              <span style={{ color: "#c6a45f" }}>Hatton Garden</span>, our
              master goldsmiths combine traditional hand-setting techniques
              with state-of-the-art 3D CAD precision.
            </p>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#909090",
                lineHeight: "1.8",
                marginBottom: "28px",
              }}
            >
              Whether choosing ethically sourced natural stones or sustainable
              lab-grown diamonds, every piece is accompanied by full GIA
              certification and a lifetime warranty.
            </p>

            <Link
              href="/bespoke"
              className="btn-gold"
              style={{
                fontSize: "11px",
                padding: "14px 32px",
                borderRadius: "0px",
              }}
            >
              Shop Our Collection Online Here
            </Link>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              position: "relative",
              width: "100%",
              height: "420px",
              overflow: "hidden",
              border: "1px solid rgba(198, 164, 95, 0.25)",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
            }}
          >
            <img
              src="/heritage.png"
              alt="Master Artisan Workshop - Gama Jewels"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
