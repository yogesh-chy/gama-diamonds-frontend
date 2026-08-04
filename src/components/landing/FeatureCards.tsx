"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { featureCards } from "@/lib/constants";

export default function FeatureCards() {
  return (
    <section style={{ padding: "60px 0", background: "#050505" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {featureCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
            >
              <Link
                href={card.href}
                style={{ display: "block", textDecoration: "none" }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "360px",
                    borderRadius: "0px",
                    overflow: "hidden",
                    border: "1px solid rgba(198,164,95,0.2)",
                  }}
                >
                  {card.image ? (
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        transition: "transform 0.5s ease",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder
                      height="100%"
                      label={card.title}
                      style={{ borderRadius: "0px" }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "24px",
                    }}
                  >
                    <div
                      className="section-label"
                      style={{ fontSize: "9px", marginBottom: "4px" }}
                    >
                      {card.subtitle}
                    </div>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.4rem",
                        color: "#ffffff",
                        marginBottom: "12px",
                      }}
                    >
                      {card.title}
                    </h3>
                    <div
                      style={{
                        color: "#c6a45f",
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Explore Now <ArrowRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
