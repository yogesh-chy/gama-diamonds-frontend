"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import { fadeInUp } from "@/lib/constants";

export default function StoreSection() {
  return (
    <section
      style={{
        padding: "80px 0",
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.06)",
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
          {/* Left Store Front Real Photography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              position: "relative",
              height: "380px",
              borderRadius: "4px",
              overflow: "hidden",
              border: "1px solid rgba(198, 164, 95, 0.3)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.8)",
            }}
          >
            <img
              src="/heritage.png"
              alt="Gama Jewels Atelier & Showroom"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "24px",
              }}
            >
              <span style={{ fontSize: "10px", color: "#c6a45f", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
                SHOWROOM & ATELIER
              </span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", color: "#ffffff", fontWeight: 600 }}>
                Gama Jewels · Mumbai
              </span>
            </div>
          </motion.div>

          {/* Right Store Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>
              VISIT OUR SHOWROOM
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              Gama Jewels
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
              Our Mumbai showroom offers a relaxed and private environment to
              inspect certified loose diamonds, try on engagement ring styles,
              and discuss bespoke CAD commissions directly with goldsmiths.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  color: "#d0d0d0",
                  fontSize: "13px",
                }}
              >
                <MapPin size={18} style={{ color: "#c6a45f", flexShrink: 0, marginTop: "3px" }} />
                <span>SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI(E.) MUMBAI 400059, Maharashtra (State Code: 27)</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#d0d0d0",
                  fontSize: "13px",
                }}
              >
                <Phone size={18} style={{ color: "#c6a45f" }} />
                <span>+91 9869800084 | gama.diamond10@gmail.com</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#d0d0d0",
                  fontSize: "13px",
                }}
              >
                <Clock size={18} style={{ color: "#c6a45f" }} />
                <span>GSTIN: 27ASQPD0518A1Z8 | PAN: ASQPD0518A</span>
              </div>
            </div>

            <Link
              href="/bespoke"
              className="btn-gold"
              style={{
                fontSize: "11px",
                padding: "14px 32px",
                borderRadius: "0px",
              }}
            >
              Book In-Store Consultation
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
