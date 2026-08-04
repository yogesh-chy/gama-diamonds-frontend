"use client";

import { bespokeFeatures } from "@/lib/bespokeContent";

export default function BespokeFeatureBar() {
  return (
    <section
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "28px 0",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "24px",
        }}
      >
        {bespokeFeatures.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "10px",
              }}
            >
              <Icon
                size={28}
                strokeWidth={1.25}
                style={{ color: "#c6a45f" }}
              />
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  color: "#ffffff",
                }}
              >
                {feature.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
