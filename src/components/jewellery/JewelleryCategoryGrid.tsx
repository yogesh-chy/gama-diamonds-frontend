"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export interface CategoryCard {
  id: string;
  title: string;
  image: string;
  href: string;
}

const JEWELLERY_CATEGORIES: CategoryCard[] = [
  {
    id: "cat-1",
    title: "PENDANT NECKLACES",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&fit=crop",
    href: "/necklace",
  },
  {
    id: "cat-2",
    title: "SOLITAIRE STUDS",
    image: "/loose_fancy_diamonds.png",
    href: "/solitaire-studs",
  },
  {
    id: "cat-3",
    title: "TENNIS BRACELETS",
    image: "https://images.unsplash.com/photo-1611591475285-a36ad5e14391?q=80&w=600&fit=crop",
    href: "/bracelets",
  },
  {
    id: "cat-4",
    title: "FINE RINGS",
    image: "/oval_cut_solitier.png",
    href: "/rings",
  },
  {
    id: "cat-5",
    title: "CROSS PENDANTS",
    image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&fit=crop",
    href: "/cross-pendants",
  },
  {
    id: "cat-6",
    title: "HOOP EARRINGS",
    image: "/shopbycategory/earings.png",
    href: "/hoop-earrings",
  },
];

export default function JewelleryCategoryGrid() {
  return (
    <section
      id="jewellery-grid"
      style={{ padding: "60px 0 80px", background: "#000000" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "28px",
          }}
        >
          {JEWELLERY_CATEGORIES.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                href={cat.href}
                style={{
                  position: "relative",
                  display: "block",
                  height: "440px",
                  overflow: "hidden",
                  border: "1px solid rgba(198, 164, 95, 0.25)",
                  background: "#080808",
                  textDecoration: "none",
                }}
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />

                {/* Bottom Center Button Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "28px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    zIndex: 10,
                  }}
                >
                  <span
                    style={{
                      display: "inline-block",
                      padding: "12px 24px",
                      backgroundColor: "#000000",
                      color: "#ffffff",
                      border: "1px solid rgba(255, 255, 255, 0.9)",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      letterSpacing: "2.5px",
                      textTransform: "uppercase",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#c6a45f";
                      e.currentTarget.style.borderColor = "#c6a45f";
                      e.currentTarget.style.color = "#000000";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#000000";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.9)";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                  >
                    {cat.title}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
