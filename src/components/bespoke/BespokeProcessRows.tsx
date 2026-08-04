"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { bespokeIntro, bespokeProcessRows } from "@/lib/bespokeContent";
import { fadeInUp } from "@/lib/constants";

function BespokeIntroBlock() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInUp}
      style={{
        textAlign: "center",
        maxWidth: "680px",
        margin: "0 auto 64px",
      }}
    >

      <h2
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.5rem, 2.5vw, 2rem)",
          fontWeight: "500",
          color: "#ffffff",
          marginBottom: "16px",
          lineHeight: 1.3,
        }}
      >
        {bespokeIntro.title}
      </h2>

      <p
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "13px",
          color: "#b0b0b0",
          lineHeight: 1.85,
        }}
      >
        {bespokeIntro.description}
      </p>
    </motion.div>
  );
}

export default function BespokeProcessRows() {
  return (
    <section
      style={{
        background: "#070707",
        padding: "72px 0 80px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
        <BespokeIntroBlock />

        <div style={{ display: "flex", flexDirection: "column", gap: "64px" }}>
          {bespokeProcessRows.map((row, idx) => {
            const imageFirst = idx % 2 === 0;

            return (
              <div
                key={row.title}
                className="bespoke-process-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "48px",
                  alignItems: "center",
                }}
              >
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUp}
                  className="bespoke-process-image"
                  style={{ order: imageFirst ? 1 : 2 }}
                >
                  <ImagePlaceholder
                    height="340px"
                    label={row.imageLabel}
                    style={{ borderRadius: "0px" }}
                  />
                </motion.div>

                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={fadeInUp}
                  className="bespoke-process-text"
                  style={{ order: imageFirst ? 2 : 1 }}
                >
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                      fontWeight: "500",
                      color: "#ffffff",
                      marginBottom: "14px",
                      lineHeight: 1.25,
                    }}
                  >
                    {row.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "13px",
                      color: "#b0b0b0",
                      lineHeight: 1.85,
                      marginBottom: "18px",
                    }}
                  >
                    {row.description}
                  </p>
                  <Link
                    href={row.linkHref}
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12px",
                      color: "#c6a45f",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                    }}
                  >
                    {row.linkLabel}
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
