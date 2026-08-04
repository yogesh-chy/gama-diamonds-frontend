"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
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
  label,
  height = "100%",
  minHeight,
}: {
  label: string;
  height?: string;
  minHeight?: string;
}) {
  return (
    <ImagePlaceholder
      height={height}
      label={label}
      style={{
        borderRadius: "0px",
        border: "none",
        minHeight: minHeight || height,
        height: "100%",
      }}
    />
  );
}

function CollageInset({
  label,
  light = true,
}: {
  label: string;
  light?: boolean;
}) {
  return (
    <div
      style={{
        background: light ? "#f2efe8" : "#141414",
        padding: light ? "8px" : "0",
        border: light ? "1px solid rgba(255,255,255,0.15)" : "none",
        height: "100%",
        width: "100%",
      }}
    >
      <ImagePlaceholder
        height="100%"
        label={label}
        style={{
          borderRadius: "0px",
          border: "none",
          backgroundColor: light ? "#ece8df" : "#141414",
          minHeight: "80px",
          color: light ? "#666" : undefined,
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
          <div className="bespoke-collage-top" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "36px" }}>
            <div style={{ position: "relative", minHeight: "320px" }}>
              <CollagePhoto label="Hand Wearing Ring" minHeight="320px" />
              <div
                style={{
                  position: "absolute",
                  left: "8%",
                  right: "8%",
                  bottom: "8%",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  height: "110px",
                }}
              >
                <CollageInset label="Ring Top View Sketch" />
                <CollageInset label="Ring Side Profile Sketch" />
              </div>
            </div>

            <div style={{ position: "relative", minHeight: "320px" }}>
              <CollagePhoto label="Hand Wearing Ring" minHeight="320px" />
              <div
                style={{
                  position: "absolute",
                  left: "6%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "120px",
                  height: "120px",
                }}
              >
                <CollageInset label="Gold Ring Render" />
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
            <ScriptTitle align="left">Fancy Coloured Diamonds</ScriptTitle>
          </motion.div>

          <div
            className="bespoke-collage-middle"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 1fr",
              gap: "12px",
              alignItems: "center",
              marginBottom: "36px",
            }}
          >
            <div style={{ minHeight: "280px" }}>
              <CollageInset label="Yellow Diamond CAD Blueprint" />
            </div>
            <div style={{ height: "140px" }}>
              <CollageInset label="Yellow Diamond Render" />
            </div>
            <div style={{ minHeight: "320px" }}>
              <CollagePhoto label="Hand Wearing Yellow Diamond Ring" minHeight="320px" />
            </div>
          </div>

          {/* Bottom collage row */}
          <div
            className="bespoke-collage-bottom"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              position: "relative",
            }}
          >
            <div style={{ position: "relative", minHeight: "360px" }}>
              <CollagePhoto label="Hand Holding Gold Ring" minHeight="360px" />
              <div
                style={{
                  position: "absolute",
                  right: "8%",
                  bottom: "8%",
                  width: "130px",
                  height: "130px",
                }}
              >
                <CollageInset label="Ring Design Render" />
              </div>
            </div>

            <div style={{ minHeight: "360px" }}>
              <CollagePhoto label="Hand Wearing Diamond Ring" minHeight="360px" />
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
