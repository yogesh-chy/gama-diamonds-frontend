"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/constants";

export default function RingsDescription() {
  return (
    <section
      style={{
        padding: "60px 0 80px",
        background: "#000000",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {/* Sub-header with pipes */}
          <div
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "10px",
              fontWeight: "500",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#c6a45f",
              marginBottom: "12px",
            }}
          >
            CARAT WEIGHT &nbsp;|&nbsp; COLOR GRADE &nbsp;|&nbsp; CLARITY GRADE &nbsp;|&nbsp; CUT GRADE
          </div>

          {/* Main Title */}
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              fontWeight: "600",
              color: "#ffffff",
              marginBottom: "32px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            THE 4 C&apos;S OF DIAMOND JEWELLERY
          </h2>

          {/* 4 Informational Paragraphs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }} suppressHydrationWarning>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12.5px",
                color: "#a0a0a0",
                lineHeight: "1.85",
              }}
            >
              <strong style={{ color: "#ffffff", fontWeight: "600" }}>Carat</strong>
              {" refers to the diamond's weight. It's often expressed as a number (e.g., 1 carat, 2 carats). While carat weight can be important to some, it's more critical that your diamond is well-cut. A diamond of any carat weight can be extraordinary if it's well-cut."}
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12.5px",
                color: "#a0a0a0",
                lineHeight: "1.85",
              }}
            >
              <strong style={{ color: "#ffffff", fontWeight: "600" }}>Color</strong>
              {" ranges from D (colorless) to Z (light yellow or brown). However, there's no need to overpay for a D color diamond. An H or I color diamond, depending on the setting, will look just as clear and white as a colorless grade diamond."}
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12.5px",
                color: "#a0a0a0",
                lineHeight: "1.85",
              }}
            >
              {"Almost all diamonds have imperfections. "}
              <strong style={{ color: "#ffffff", fontWeight: "600" }}>Clarity</strong>
              {" refers to how many blemishes and inclusions the diamond has, along with how noticeable they are. Opt for a diamond that is eye-clean, meaning you can't see imperfections unless you put it under magnification."}
            </p>

            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12.5px",
                color: "#a0a0a0",
                lineHeight: "1.85",
              }}
            >
              <strong style={{ color: "#ffffff", fontWeight: "600" }}>Cut</strong>
              {" is the biggest factor that plays into how brilliant and beautiful a diamond is. It refers to how well a diamond is cut and polished. Finding the perfect harmony between the 4 Cs will help you balance beauty and value when looking for a diamond."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
