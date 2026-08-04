"use client";

import { serviceFeatures } from "@/lib/constants";

export default function ServiceFeatures() {
  return (
    <section
      style={{
        padding: "60px 0",
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "24px",
          }}
        >
          {serviceFeatures.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <div
                key={idx}
                style={{
                  background: "#090909",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "0px",
                  padding: "24px 20px",
                  textAlign: "center",
                }}
              >
                <IconComp
                  size={32}
                  style={{ color: "#c6a45f", margin: "0 auto 12px" }}
                  strokeWidth={1.5}
                />
                <h4
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    color: "#ffffff",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  {feat.title}
                </h4>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                    color: "#888888",
                  }}
                >
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
