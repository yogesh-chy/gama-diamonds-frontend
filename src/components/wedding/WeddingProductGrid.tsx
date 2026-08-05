"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";

export interface WeddingProduct {
  id: string;
  title: string;
  category: "women" | "men";
  metal: string;
  price: number; // in GBP
  image: string;
  badge?: "BESTSELLER" | "POPULAR" | "NEW" | "CUSTOMISABLE" | "EXCLUSIVE";
  href: string;
}

const INITIAL_WEDDING_PRODUCTS: WeddingProduct[] = [
  // ETERNITY RINGS (WOMEN) - 8 PRODUCTS (4x2 GRID)
  {
    id: "wed-01",
    title: "Women's Classic Micro-Pave Diamond Wedding Band",
    category: "women",
    metal: "18K Yellow Gold",
    price: 1250,
    image: "/women_wedding_ring.png",
    badge: "BESTSELLER",
    href: "/wedding/womens-plain",
  },
  {
    id: "wed-02",
    title: "Women's Full Eternity Diamond Band in 18ct White Gold",
    category: "women",
    metal: "18ct White Gold",
    price: 2150,
    image: "/women_wedding_ring.png",
    badge: "POPULAR",
    href: "/wedding/eternity",
  },
  {
    id: "wed-03",
    title: "Women's Delicate Claw-Set Diamond Wedding Ring",
    category: "women",
    metal: "Platinum 950",
    price: 1480,
    image: "/women_wedding_ring.png",
    badge: "NEW",
    href: "/wedding/womens-plain",
  },
  {
    id: "wed-04",
    title: "Women's Scalloped Pave Diamond Band",
    category: "women",
    metal: "18ct Rose Gold",
    price: 1890,
    image: "/women_wedding_ring.png",
    badge: "CUSTOMISABLE",
    href: "/wedding/womens-plain",
  },
  {
    id: "wed-09",
    title: "Women's Round Diamond Seven Stone Wedding Band",
    category: "women",
    metal: "18ct Yellow Gold",
    price: 1650,
    image: "/women_wedding_ring.png",
    badge: "BESTSELLER",
    href: "/wedding/womens-plain",
  },
  {
    id: "wed-10",
    title: "Women's Princess Cut Channel Set Eternity Band",
    category: "women",
    metal: "Platinum 950",
    price: 2400,
    image: "/women_wedding_ring.png",
    badge: "EXCLUSIVE",
    href: "/wedding/eternity",
  },
  {
    id: "wed-11",
    title: "Women's Emerald Cut Half Eternity Diamond Ring",
    category: "women",
    metal: "18ct White Gold",
    price: 2890,
    image: "/women_wedding_ring.png",
    badge: "POPULAR",
    href: "/wedding/eternity",
  },
  {
    id: "wed-12",
    title: "Women's Oval Diamond Claw Set Eternity Band",
    category: "women",
    metal: "18ct Yellow Gold",
    price: 3200,
    image: "/women_wedding_ring.png",
    badge: "NEW",
    href: "/wedding/eternity",
  },

  // MEN'S WEDDING RINGS - 8 PRODUCTS (4x2 GRID)
  {
    id: "wed-05",
    title: "Men's Heavy Court Satin Finish Wedding Band",
    category: "men",
    metal: "Platinum 950",
    price: 980,
    image: "/men_wedding_ring.png",
    badge: "BESTSELLER",
    href: "/wedding/mens-plain",
  },
  {
    id: "wed-06",
    title: "Men's Chamfered Edge Polished Wedding Ring",
    category: "men",
    metal: "18K Yellow Gold",
    price: 890,
    image: "/men_wedding_ring.png",
    badge: "POPULAR",
    href: "/wedding/mens-plain",
  },
  {
    id: "wed-07",
    title: "Men's Brushed & Polished Dual Tone Wedding Ring",
    category: "men",
    metal: "18ct White & Yellow Gold",
    price: 1150,
    image: "/men_wedding_ring.png",
    badge: "CUSTOMISABLE",
    href: "/wedding/mens-diamond",
  },
  {
    id: "wed-08",
    title: "Men's Classic Traditional Court Wedding Band",
    category: "men",
    metal: "9K Yellow Gold",
    price: 620,
    image: "/men_wedding_ring.png",
    badge: "EXCLUSIVE",
    href: "/wedding/mens-plain",
  },
  {
    id: "wed-13",
    title: "Men's Flat Court Matte Finish Band in Platinum 950",
    category: "men",
    metal: "Platinum 950",
    price: 1250,
    image: "/men_wedding_ring.png",
    badge: "BESTSELLER",
    href: "/wedding/mens-plain",
  },
  {
    id: "wed-14",
    title: "Men's Soft Court Wedding Band in 18K White Gold",
    category: "men",
    metal: "18K White Gold",
    price: 980,
    image: "/men_wedding_ring.png",
    badge: "POPULAR",
    href: "/wedding/mens-plain",
  },
  {
    id: "wed-15",
    title: "Men's Beaded Edge Polished Wedding Ring",
    category: "men",
    metal: "18K Yellow Gold",
    price: 1050,
    image: "/men_wedding_ring.png",
    badge: "NEW",
    href: "/wedding/mens-pattern",
  },
  {
    id: "wed-16",
    title: "Men's Heavy Flat Court Ring in 18ct Rose Gold",
    category: "men",
    metal: "18ct Rose Gold",
    price: 1420,
    image: "/men_wedding_ring.png",
    badge: "EXCLUSIVE",
    href: "/wedding/mens-plain",
  },
];

interface WeddingProductGridProps {
  selectedCategory?: "all" | "women" | "men";
  onCategoryChange?: (cat: "all" | "women" | "men") => void;
}

export default function WeddingProductGrid({
  selectedCategory = "all",
  onCategoryChange,
}: WeddingProductGridProps) {
  const [internalCategory, setInternalCategory] = useState<"all" | "women" | "men">(
    selectedCategory
  );
  const { formatPrice } = useCurrency();

  const activeCategory = onCategoryChange ? selectedCategory : internalCategory;

  const handleTabClick = (cat: "all" | "women" | "men") => {
    if (onCategoryChange) {
      onCategoryChange(cat);
    } else {
      setInternalCategory(cat);
    }
  };

  const filteredProducts =
    activeCategory === "men"
      ? INITIAL_WEDDING_PRODUCTS.filter((p) => p.category === "men")
      : INITIAL_WEDDING_PRODUCTS.filter((p) => p.category === "women");

  return (
    <section
      id="wedding-products-section"
      style={{ padding: "60px 0 80px", background: "#000000" }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        {/* Filter Header Controls */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#c6a45f",
              marginBottom: "16px",
            }}
          >
            BROWSE OUR COLLECTION
          </span>

          {/* Filter Category Tabs */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => handleTabClick("women")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: activeCategory === "women" || activeCategory === "all" ? "#c6a45f" : "#a0a0a0",
                cursor: "pointer",
                padding: "8px 16px",
                borderBottom:
                  activeCategory === "women" || activeCategory === "all"
                    ? "2px solid #c6a45f"
                    : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              ETERNITY RINGS
            </button>

            <button
              onClick={() => handleTabClick("men")}
              style={{
                background: "none",
                border: "none",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: activeCategory === "men" ? "#c6a45f" : "#a0a0a0",
                cursor: "pointer",
                padding: "8px 16px",
                borderBottom:
                  activeCategory === "men"
                    ? "2px solid #c6a45f"
                    : "2px solid transparent",
                transition: "all 0.3s ease",
              }}
            >
              MEN&apos;S WEDDING RINGS
            </button>
          </div>
        </div>

        {/* 4 Cards Per Row Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "24px",
              marginBottom: "50px",
            }}
          >
            {filteredProducts.map((prod) => (
              <Link
                key={prod.id}
                href={prod.href}
                style={{
                  display: "block",
                  textDecoration: "none",
                  background: "#080808",
                  border: "1px solid rgba(255, 255, 255, 0.07)",
                  overflow: "hidden",
                  transition: "all 0.4s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(198, 164, 95, 0.5)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Badge Tag */}
                {prod.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 10,
                      backgroundColor: "#000000",
                      color: "#c6a45f",
                      border: "1px solid #c6a45f",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "9px",
                      fontWeight: 600,
                      letterSpacing: "1.5px",
                      padding: "4px 8px",
                      textTransform: "uppercase",
                    }}
                  >
                    {prod.badge}
                  </span>
                )}

                {/* Product Image Container */}
                <div
                  style={{
                    position: "relative",
                    height: "260px",
                    width: "100%",
                    overflow: "hidden",
                    backgroundColor: "#0a0a0a",
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      transition: "transform 0.6s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.08)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </div>

                {/* Product Meta & Information */}
                <div
                  style={{
                    padding: "20px 16px",
                    textAlign: "center",
                  }}
                >
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#ffffff",
                      marginBottom: "8px",
                      lineHeight: "1.4",
                      minHeight: "40px",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {prod.title}
                  </h4>

                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10.5px",
                      color: "#a0a0a0",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "10px",
                    }}
                  >
                    {prod.metal}
                  </div>

                  <div
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#c6a45f",
                      letterSpacing: "0.5px",
                    }}
                  >
                    From {formatPrice(prod.price)}
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Centered View All Button */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/wedding/womens-plain"
            style={{
              display: "inline-block",
              padding: "16px 44px",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "1px solid #ffffff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "3px",
              textTransform: "uppercase",
              textDecoration: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#c6a45f";
              e.currentTarget.style.borderColor = "#c6a45f";
              e.currentTarget.style.color = "#000000";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#000000";
              e.currentTarget.style.borderColor = "#ffffff";
              e.currentTarget.style.color = "#ffffff";
            }}
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
}
