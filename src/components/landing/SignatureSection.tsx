"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

const bespokeImages = [
  "/bespoke/bespoke_step1.png",
  "/bespoke/bespoke_step2.png",
  "/bespoke/bespoke_step3.png",
  "/bespoke/bespoke_step4.png",
  "/bespoke/bespoke_step5.png",
];

export default function SignatureSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bespokeImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        padding: "80px 0",
        background: "#080808",
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
          {/* Left Bespoke Image with Preloaded GPU-accelerated Cross-Fade */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "440px",
                overflow: "hidden",
                borderRadius: "4px",
                border: "1px solid rgba(198, 164, 95, 0.25)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.6)",
                background: "#121212",
              }}
            >
              {bespokeImages.map((src, index) => {
                const isActive = index === currentIndex;
                return (
                  <motion.img
                    key={src}
                    src={src}
                    alt={`Bespoke Cross & Pendant Collection ${index + 1}`}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{
                      duration: 1,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      willChange: "opacity",
                      pointerEvents: isActive ? "auto" : "none",
                    }}
                  />
                );
              })}
            </div>
          </motion.div>

          {/* Right Text */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>
              SIGNATURE DESIGN
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                color: "#ffffff",
                lineHeight: "1.3",
                marginBottom: "16px",
              }}
            >
              Bespoke Cross & Pendant Collection
            </h2>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#b0b0b0",
                lineHeight: "1.8",
                marginBottom: "24px",
              }}
            >
              Each bespoke pendant and cross is meticulously set with
              brilliant cut diamonds in platinum or 18k yellow gold. Created
              to celebrate life&apos;s most meaningful moments with timeless
              radiance.
            </p>

            <Link
              href="/necklace"
              className="btn-outline-gold"
              style={{
                fontSize: "11px",
                padding: "14px 32px",
                borderRadius: "0px",
              }}
            >
              View Signature Collection
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


