"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function JewelleryShowroomSection() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#050505",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "60px",
            alignItems: "center",
          }}
        >
          {/* Left Column: Storefront Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "380px",
                overflow: "hidden",
                border: "1px solid rgba(198, 164, 95, 0.2)",
              }}
            >
              <img
                src="/heritage.png"
                alt="Gama Fine Jewellery Mumbai Showroom"
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

          {/* Right Column: Showroom Text & Links */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#c6a45f",
                display: "block",
                marginBottom: "12px",
              }}
            >
              HATTON GARDEN SHOWROOM
            </span>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 400,
                color: "#ffffff",
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "20px",
                lineHeight: "1.25",
              }}
            >
              GAMA FINE JEWELLERY
            </h3>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: 300,
                color: "#bfbfbf",
                lineHeight: "1.8",
                marginBottom: "28px",
                maxWidth: "500px",
              }}
            >
              Visit our flagship showroom located in the heart of Mumbai&apos;s
              Marol, Andheri. Experience our bespoke consultation and
              view our fine collection in person.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Link
                href="/bespoke"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#c6a45f",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e5c97a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#c6a45f")}
              >
                Book an Appointment &gt;
              </Link>

              <a
                href="https://maps.google.com/?q=Marol+Andheri+East+Mumbai"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#a0a0a0",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#a0a0a0")}
              >
                Get Directions &gt;
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
