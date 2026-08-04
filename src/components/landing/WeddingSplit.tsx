"use client";

import Link from "next/link";

export default function WeddingSplit() {
  return (
    <section style={{ padding: "60px 0", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Men's Collection */}
          <Link
            href="/wedding?collection=men"
            style={{
              position: "relative",
              height: "340px",
              borderRadius: "0px",
              overflow: "hidden",
              border: "1px solid rgba(198,164,95,0.2)",
              display: "block",
            }}
          >
            <img
              src="/men_wedding_ring.png"
              alt="Men's Wedding Rings"
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "32px",
              }}
            >
              <div className="section-label" style={{ fontSize: "9px" }}>
                CLASSIC & MODERN BANDS
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: "#ffffff",
                  margin: "4px 0 12px",
                }}
              >
                Men&apos;s Wedding Rings
              </h3>
              <span
                className="btn-gold"
                style={{
                  fontSize: "10px",
                  padding: "10px 24px",
                  alignSelf: "flex-start",
                  borderRadius: "0px",
                }}
              >
                Explore Collection
              </span>
            </div>
          </Link>

          {/* Women's Collection */}
          <Link
            href="/wedding?collection=women"
            style={{
              position: "relative",
              height: "340px",
              borderRadius: "0px",
              overflow: "hidden",
              border: "1px solid rgba(198,164,95,0.2)",
              display: "block",
            }}
          >
            <img
              src="/women_wedding_ring.png"
              alt="Women's Wedding Rings"
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
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "32px",
              }}
            >
              <div className="section-label" style={{ fontSize: "9px" }}>
                DIAMOND BANDS & ETERNITY
              </div>
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.6rem",
                  color: "#ffffff",
                  margin: "4px 0 12px",
                }}
              >
                Women&apos;s Wedding Rings
              </h3>
              <span
                className="btn-gold"
                style={{
                  fontSize: "10px",
                  padding: "10px 24px",
                  alignSelf: "flex-start",
                  borderRadius: "0px",
                }}
              >
                Explore Collection
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
