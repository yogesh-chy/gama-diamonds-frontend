"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { heroBackgroundImages } from "@/lib/constants";

export default function HeroSection() {
  const [heroBgIndex, setHeroBgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroBgIndex((prev) => (prev === 0 ? 1 : 0));
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "calc(100vh - 160px)",
        minHeight: "400px",
        maxHeight: "700px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#080808",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
      }}
    >
      {/* Underlayer Base Image (prevents dark gap or flickering during fade) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <img
          src={heroBackgroundImages[1 - heroBgIndex]}
          alt="Hero Background Base"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Top Active Image (Framer Motion smooth crossfade) */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2 }}>
        <motion.img
          key={heroBgIndex}
          src={heroBackgroundImages[heroBgIndex]}
          alt={`Gama Diamond Banner ${heroBgIndex + 1}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 2 }}
          transition={{ duration: 1.8, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>

      {/* Dark Vignette Overlay over Background Images */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Static Hero Overlay Content (Text and Buttons) */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          maxWidth: "800px",
          padding: "0 20px",
          margin: "8px 0",
        }}
      >
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)",
            fontWeight: "700",
            color: "#ffffff",
            lineHeight: "1.25",
            marginBottom: "10px",
            textShadow: "0 4px 20px rgba(0,0,0,0.85)",
          }}
        >
          Bespoke Diamond Jewellery{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "400",
              color: "#c6a45f",
            }}
          >
            & Fine Crafts
          </span>
        </motion.h1>

        {/* Subtitle / Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12.5px",
            color: "#d0d0d0",
            maxWidth: "600px",
            margin: "0 auto 18px",
            lineHeight: "1.65",
            letterSpacing: "0.2px",
            textShadow: "0 2px 10px rgba(0,0,0,0.9)",
          }}
        >
          Explore custom engagement rings, certified natural and lab-grown
          diamonds, handcrafted by master goldsmiths in the heart of London.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "14px",
          }}
        >
          <Link
            href="/rings"
            className="btn-gold"
            style={{
              borderRadius: "0px",
              padding: "12px 28px",
              fontSize: "10.5px",
              letterSpacing: "1.5px",
            }}
          >
            Explore Collection
          </Link>
          <Link
            href="/bespoke"
            className="btn-outline-gold"
            style={{
              borderRadius: "0px",
              padding: "12px 28px",
              fontSize: "10.5px",
              letterSpacing: "1.5px",
            }}
          >
            Book Appointment
          </Link>
        </motion.div>
      </div>

      {/* Carousel Indicator Dots */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 15,
          display: "flex",
          gap: "8px",
          alignItems: "center",
        }}
      >
        {heroBackgroundImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setHeroBgIndex(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              border: "none",
              padding: 0,
              height: "4px",
              width: heroBgIndex === idx ? "36px" : "12px",
              backgroundColor:
                heroBgIndex === idx ? "#c6a45f" : "rgba(255, 255, 255, 0.4)",
              boxShadow:
                heroBgIndex === idx
                  ? "0 0 12px rgba(198, 164, 95, 0.6)"
                  : "none",
              transition: "all 0.4s ease",
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </section>
  );
}
