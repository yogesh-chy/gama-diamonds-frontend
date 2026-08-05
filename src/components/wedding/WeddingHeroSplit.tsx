"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface WeddingHeroSplitProps {
  onSelectCategory?: (category: "all" | "women" | "men") => void;
}

export default function WeddingHeroSplit({ onSelectCategory }: WeddingHeroSplitProps) {
  const handleWomenClick = (e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory("women");
      const el = document.getElementById("wedding-products-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleMenClick = (e: React.MouseEvent) => {
    if (onSelectCategory) {
      e.preventDefault();
      onSelectCategory("men");
      const el = document.getElementById("wedding-products-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section style={{ padding: "40px 0 20px", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Left Card: Women's Wedding Rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: "relative",
              height: "440px",
              overflow: "hidden",
              border: "1px solid rgba(198, 164, 95, 0.25)",
              background: "#080808",
            }}
          >
            <img
              src="/women_wedding_ring.png"
              alt="Shop Women's Wedding Rings"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Bottom Centered Button Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              <Link
                href="/wedding/womens-plain"
                onClick={handleWomenClick}
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "#000000",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.3s ease",
                  border: "1px solid #ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c6a45f";
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.borderColor = "#c6a45f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
              >
                SHOP WOMEN&apos;S WEDDING RINGS
              </Link>
            </div>
          </motion.div>

          {/* Right Card: Men's Wedding Rings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              position: "relative",
              height: "440px",
              overflow: "hidden",
              border: "1px solid rgba(198, 164, 95, 0.25)",
              background: "#080808",
            }}
          >
            <img
              src="/men_wedding_ring.png"
              alt="Shop Men's Wedding Rings"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />

            {/* Bottom Centered Button Overlay */}
            <div
              style={{
                position: "absolute",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "auto",
                whiteSpace: "nowrap",
                zIndex: 10,
              }}
            >
              <Link
                href="/wedding/mens-plain"
                onClick={handleMenClick}
                style={{
                  display: "inline-block",
                  padding: "14px 28px",
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  color: "#000000",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
                  transition: "all 0.3s ease",
                  border: "1px solid #ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c6a45f";
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.borderColor = "#c6a45f";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
                  e.currentTarget.style.color = "#000000";
                  e.currentTarget.style.borderColor = "#ffffff";
                }}
              >
                SHOP MEN&apos;S WEDDING RINGS
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
