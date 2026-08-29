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
            Located at SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI(E.) MUMBAI 400059, Maharashtra (Code: 27). We welcome private
            appointments and walk-in consultations. Call our dedicated diamond
            specialists on{" "}
            <span style={{ color: "#c6a45f" }}>+91 9869800084</span> or email{" "}
            <span style={{ color: "#c6a45f" }}>gama.diamond10@gmail.com</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
