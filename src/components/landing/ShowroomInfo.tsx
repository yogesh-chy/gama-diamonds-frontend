"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

export default function ShowroomInfo() {
  return (
    <section
      style={{
        padding: "60px 0",
        background: "#050505",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <div className="section-label" style={{ marginBottom: "8px" }}>
            OUR SHOWROOM
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.875rem",
              color: "#ffffff",
              marginBottom: "16px",
            }}
          >
            Where Romantic Visions Become Heirloom Reality
          </h2>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
              color: "#a0a0a0",
              lineHeight: "1.8",
            }}
          >
            Located at *******, London EC1N 8NX. We welcome private
            appointments and walk-in consultations. Call our dedicated diamond
            specialists on{" "}
            <span style={{ color: "#c6a45f" }}>+44 ********</span> or send
            a custom query online.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
