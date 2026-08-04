"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
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
          {/* Left Store Front Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <ImagePlaceholder
              height="380px"
              label="Hatton Garden Store Exterior Image Placeholder"
              style={{ borderRadius: "0px" }}
            />
          </motion.div>

          {/* Right Store Info */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="section-label" style={{ marginBottom: "12px" }}>
              VISIT US IN LONDON
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "2rem",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              Gama Boutique & Consultation Studio
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
              Our London showroom offers a relaxed and private environment to
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
                  alignItems: "center",
                  gap: "12px",
                  color: "#d0d0d0",
                  fontSize: "13px",
                }}
              >
                <MapPin size={18} style={{ color: "#c6a45f" }} />
                <span>******, London</span>
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
                <span>+44 ******* / +44 ******* </span>
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
                <span>Mon - Sat: 10:00 AM - 6:00 PM</span>
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
