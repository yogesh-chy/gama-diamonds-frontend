"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";

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
  const [products, setProducts] = useState<WeddingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeddingBands() {
      setLoading(true);
      try {
        const res = await productsApi.getProducts({ category: "wedding-bands" });
        const list = res.data?.data || [];
        const mapped: WeddingProduct[] = list.map((item: any) => ({
          id: String(item.id || item.slug),
          title: item.name,
          category: item.gender === "men" ? "men" : "women",
          metal: item.metal_type?.replace("-", " ") || "18K Gold",
          price: typeof item.base_price === "number" ? item.base_price : parseFloat(item.base_price || "0") || 0,
          image: item.images?.[0]?.url || "/women_wedding_ring.png",
          badge: item.is_featured ? "BESTSELLER" : undefined,
          href: `/product/${item.id || item.slug}`,
        }));
        setProducts(mapped);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchWeddingBands();
  }, []);

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
      ? products.filter((p) => p.category === "men")
      : activeCategory === "women"
      ? products.filter((p) => p.category === "women")
      : products;

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
