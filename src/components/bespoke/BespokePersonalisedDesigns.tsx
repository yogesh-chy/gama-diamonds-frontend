"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

function ScriptTitle({ children, align = "center" }: { children: ReactNode; align?: "left" | "center" | "right" }) {
  return (
    <h3
      className="bespoke-script-title"
      style={{
        fontFamily: "'Playfair Display', serif",
        fontStyle: "italic",
        fontWeight: "400",
        fontSize: "clamp(1.75rem, 4vw, 3rem)",
        color: "#ffffff",
        textAlign: align,
        lineHeight: 1.2,
        letterSpacing: "0.5px",
      }}
    >
      {children}
    </h3>
  );
}

function CollagePhoto({
  src,
  alt,
  height = "100%",
  minHeight,
}: {
  src: string;
  alt: string;
  height?: string;
  minHeight?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        height: height,
        minHeight: minHeight || height,
        borderRadius: "3px",
        overflow: "hidden",
        border: "1px solid rgba(198, 164, 95, 0.25)",
        backgroundColor: "#0d0d0d",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.5s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)",
          display: "flex",
          alignItems: "flex-end",
          padding: "12px 16px",
        }}
      >
        <span style={{ fontSize: "11px", color: "#e0e0e0", fontFamily: "'Poppins', sans-serif", letterSpacing: "0.5px" }}>
          {alt}
        </span>
      </div>
    </div>
  );
}

function CollageInset({
  src,
  alt,
  light = false,
}: {
  src: string;
  alt: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        background: light ? "#f2efe8" : "#141414",
        padding: "4px",
        border: "1px solid rgba(198, 164, 95, 0.35)",
        borderRadius: "3px",
        height: "100%",
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0,0,0,0.8)",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "2px",
        }}
      />
    </div>
  );
}

export default function BespokePersonalisedDesigns() {
  return (
    <section
      className="bespoke-collage-section"
      style={{
        background: "linear-gradient(180deg, #0e0a07 0%, #120d09 50%, #0a0806 100%)",
        padding: "56px 16px 64px",
        borderBottom: "1px solid rgba(198, 164, 95, 0.12)",
      }}
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ marginBottom: "36px" }}
        >
          <ScriptTitle>Create Your Own Bespoke Engagement Ring</ScriptTitle>
        </motion.div>

        {/* Top collage row */}
        <div className="bespoke-collage-top" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "36px" }}>
          <div style={{ position: "relative", minHeight: "340px" }}>
            <CollagePhoto src="/oval_cut_solitier.png" alt="Bespoke Oval Solitaire Diamond Ring" minHeight="340px" />
            <div
              style={{
                position: "absolute",
                left: "6%",
                right: "6%",
                bottom: "6%",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                height: "100px",
              }}
            >
              <CollageInset src="/bespoke/bespoke_step1.png" alt="3D CAD Blueprint Render" />
              <CollageInset src="/bespoke/bespoke_step2.png" alt="Precision Wax Prototyping" />
            </div>
          </div>

          <div style={{ position: "relative", minHeight: "340px" }}>
            <CollagePhoto src="/bespoke_pear_solitaire.png" alt="Handcrafted Pear Shaped Halo Setting" minHeight="340px" />
            <div
              style={{
                position: "absolute",
                right: "6%",
                top: "50%",
                transform: "translateY(-50%)",
                width: "110px",
                height: "110px",
              }}
            >
              <CollageInset src="/bespoke/bespoke_step3.png" alt="Master Goldsmith Hand Setting" />
            </div>
          </div>
        </div>

        {/* Fancy coloured diamonds */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ marginBottom: "20px" }}
        >
          <ScriptTitle align="left">Fancy Coloured Diamonds & Rare Gems</ScriptTitle>
        </motion.div>

        <div
          className="bespoke-collage-middle"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 140px 1fr",
            gap: "16px",
            alignItems: "center",
            marginBottom: "36px",
          }}
        >
          <div style={{ height: "260px" }}>
            <CollagePhoto src="/loose_fancy_diamonds.png" alt="Ethically Sourced Loose Yellow & Pink Diamonds" height="260px" />
          </div>
          <div style={{ height: "140px" }}>
            <CollageInset src="/bespoke/bespoke_step4.png" alt="Diamond Selection Under Magnification" />
          </div>
          <div style={{ height: "260px" }}>
            <CollagePhoto src="/women_wedding_ring.png" alt="Custom Gold Micro-Pavé Band" height="260px" />
          </div>
        </div>

        {/* Bottom collage row */}
        <div
          className="bespoke-collage-bottom"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            position: "relative",
          }}
        >
          <div style={{ position: "relative", minHeight: "340px" }}>
            <CollagePhoto src="/men_wedding_ring.png" alt="Platinum Brushed Wedding Band" minHeight="340px" />
            <div
              style={{
                position: "absolute",
                right: "6%",
                bottom: "6%",
                width: "110px",
                height: "110px",
              }}
            >
              <CollageInset src="/shopbycategory/bespoke_design.png" alt="Custom Atelier Sketch" />
            </div>
          </div>

          <div style={{ minHeight: "340px" }}>
            <CollagePhoto src="/bespoke/bespoke_step5.png" alt="Hallmarked UK Masterpiece in Presentation Box" minHeight="340px" />
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ marginTop: "28px", textAlign: "right" }}
        >
          <ScriptTitle align="right">Personalised for you</ScriptTitle>
        </motion.div>
      </div>
    </section>
  );
}
