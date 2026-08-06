"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RingsCraftsmanship() {
  const [activeTab, setActiveTab] = useState<"lab" | "natural">("lab");

  return (
    <section
      style={{
        padding: "60px 0 80px",
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        {/* Tabs Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          <button
            onClick={() => setActiveTab("lab")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: activeTab === "lab" ? "#ffffff" : "#666666",
              cursor: "pointer",
              paddingBottom: "8px",
              borderBottom: activeTab === "lab" ? "2px solid #c6a45f" : "2px solid transparent",
              transition: "all 0.3s ease",
            }}
          >
            Lab Diamonds
          </button>

          <button
            onClick={() => setActiveTab("natural")}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: activeTab === "natural" ? "#ffffff" : "#666666",
              cursor: "pointer",
              paddingBottom: "8px",
              borderBottom: activeTab === "natural" ? "2px solid #c6a45f" : "2px solid transparent",
              transition: "all 0.3s ease",
            }}
          >
            Natural Diamonds
          </button>
        </div>

        {/* Tab Content Split Layout */}
        <AnimatePresence mode="wait">
          {activeTab === "lab" ? (
            <motion.div
              key="lab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "center",
              }}
              className="er-craft-grid"
            >
              {/* Left Side Diamond Image */}
              <div style={{ position: "relative", width: "100%", height: "420px" }}>
                <Image
                  src="/oval_cut_solitier.png"
                  alt="Jeweler Inspecting Lab Diamond with Loupe & Tweezers"
                  fill
                  style={{ objectFit: "cover", borderRadius: "0px" }}
                />
              </div>

              {/* Right Side Text */}
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.75rem",
                    fontWeight: "600",
                    color: "#ffffff",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                  }}
                >
                  LAB DIAMONDS
                </h3>

                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12.5px",
                    color: "#a0a0a0",
                    lineHeight: "1.85",
                    marginBottom: "16px",
                  }}
                >
                  Lab-grown diamonds are created in high-tech laboratories. Despite their lab origin, these diamonds are chemically, physically, and optically identical to natural diamonds. They share the same crystal structure and hardness as mined diamonds. When it comes to sparkle, both lab-grown and mined diamonds are visually indistinguishable to the naked eye, displaying a full range of quality characteristics. Advantages of lab-grown diamonds include being environmentally sustainable, reduced impact on human labor, and affordability, making them an excellent choice for conscious consumers.
                </p>

                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12.5px",
                    color: "#a0a0a0",
                    lineHeight: "1.85",
                  }}
                >
                  Without GIA certification it&apos;s challenging to differentiate between lab-grown and natural diamonds. Both are real diamonds, but their origins and creation methods set them apart.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="natural"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "48px",
                alignItems: "center",
              }}
              className="er-craft-grid"
            >
              {/* Left Side Diamond Image */}
              <div style={{ position: "relative", width: "100%", height: "420px" }}>
                <Image
                  src="/1hero.png"
                  alt="Earth-Mined Natural Diamond Inspection & Rough Gemstone"
                  fill
                  style={{ objectFit: "cover", borderRadius: "0px" }}
                />
              </div>

              {/* Right Side Text */}
              <div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.75rem",
                    fontWeight: "600",
                    color: "#ffffff",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    marginBottom: "20px",
                  }}
                >
                  NATURAL DIAMONDS
                </h3>

                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12.5px",
                    color: "#a0a0a0",
                    lineHeight: "1.85",
                    marginBottom: "16px",
                  }}
                >
                  Natural diamonds were formed deep within the Earth billions of years ago under intense heat and pressure. Each natural diamond is a rare remnant of Earth&apos;s ancient geological history, possessing a singular uniqueness that cannot be replicated.
                </p>

                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12.5px",
                    color: "#a0a0a0",
                    lineHeight: "1.85",
                  }}
                >
                  All our natural diamonds are ethically sourced in compliance with the Kimberley Process, ensuring complete peace of mind and certified by GIA &amp; AnchorCert.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
