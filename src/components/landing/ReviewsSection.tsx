"use client";

import { Star } from "lucide-react";
import { googleReviews } from "@/lib/constants";

export default function ReviewsSection() {
  return (
    <section
      style={{
        padding: "70px 0",
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "4px",
              color: "#c6a45f",
              marginBottom: "8px",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} fill="#c6a45f" />
            ))}
          </div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.875rem",
              color: "#ffffff",
            }}
          >
            5.0 Star Rated Customer Reviews
          </h2>
          <div className="section-divider" style={{ marginTop: "12px" }}></div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {googleReviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                background: "#090909",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "0px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "2px", color: "#c6a45f" }}
                  >
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="#c6a45f" />
                    ))}
                  </div>
                  <span style={{ fontSize: "10px", color: "#666666" }}>
                    {rev.date}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    color: "#c0c0c0",
                    lineHeight: "1.7",
                    marginBottom: "16px",
                  }}
                >
                  &quot;{rev.text}&quot;
                </p>
              </div>
              <div
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#ffffff",
                }}
              >
                {rev.author}{" "}
                <span style={{ color: "#c6a45f", fontWeight: "400" }}>
                  ✓ Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
