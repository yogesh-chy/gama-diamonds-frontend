"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function RingsJewelCheck() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#050505",
        padding: "40px 0 60px",
      }}
    >
      <div
        style={{
          position: "relative",
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ position: "relative", overflow: "hidden" }}>
          <div style={{ position: "relative", width: "100%", height: "360px" }}>
            <Image
              src="/1hero.png"
              alt="Satin Fabric Background — Three Gold Diamond Engagement Rings"
              fill
              style={{ objectFit: "cover", borderRadius: "0px" }}
              priority
            />
          </div>

          {/* Centered White Card Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: "#ffffff",
                color: "#000000",
                maxWidth: "460px",
                width: "100%",
                padding: "36px 32px",
                textAlign: "center",
                boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "600",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  color: "#000000",
                  marginBottom: "14px",
                }}
              >
                COMPLIMENTARY JEWEL CHECK
              </h3>

              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11.5px",
                  color: "#444444",
                  lineHeight: "1.75",
                }}
              >
                We advise having your jewellery inspected annually to ensure the
                security of all gemstones and diamonds. At Gama Jewels, our Jewel
                Check service offers complimentary prong inspections once a year
                with every purchase.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
