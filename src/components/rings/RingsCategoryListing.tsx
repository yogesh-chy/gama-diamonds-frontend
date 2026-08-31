"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, RotateCcw, ChevronDown } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";

interface Product {
  id: string;
  title: string;
  metal: string;
  price: number;
  badge?: string;
  inStock: boolean;
  image?: string;
}

const METALS_LIST = [
  "18ct White Gold",
  "18ct Yellow Gold",
  "18ct Rose Gold",
  "9ct White Gold",
  "9ct Yellow Gold",
  "9ct Rose Gold",
  "Platinum",
];

interface RingsCategoryListingProps {
  shapeSlug?: string;
}

export default function RingsCategoryListing({ shapeSlug = "round-brilliant" }: RingsCategoryListingProps) {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      setLoading(true);
      try {
        const res = await productsApi.getProducts({ diamond_cut: shapeSlug, status: "active" });
        let list = res.data?.data || [];
        if (list.length === 0) {
          const fallback = await productsApi.getProducts({ status: "active", limit: 12 });
          list = fallback.data?.data || [];
        }
        const mapped: Product[] = list.map((item: any) => {
          const rawPrice =
            typeof item.price === "object" && item.price?.min
              ? (typeof item.price.min === "number" ? item.price.min : parseFloat(String(item.price.min)))
              : (typeof item.base_price === "number" ? item.base_price : parseFloat(String(item.base_price || 0)));
          const validPrice = isNaN(rawPrice) || rawPrice === 0
            ? (item.variants?.[0]?.price ? parseFloat(String(item.variants[0].price)) : 0)
            : rawPrice;

          return {
            id: String(item.id || item.slug),
            title: item.name,
            metal: item.metal_type?.replace("-", " ") || "Fine Precious Metal",
            price: validPrice,
            badge: item.is_featured ? "FEATURED" : undefined,
            inStock: (item.total_stock || 0) > 0 || (item.variants?.some((v: any) => v.stock > 0)),
            image: item.thumbnail || item.images?.find((img: any) => img.isPrimary || img.is_primary)?.url || item.images?.[0]?.url || item.variants?.[0]?.images?.[0]?.url || item.image,
          };
        });
        setProducts(mapped);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategoryProducts();
  }, [shapeSlug]);

  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(40000);
  const [sortBy, setSortBy] = useState("featured");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ price: true });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleMetal = (metal: string) => {
    if (selectedMetals.includes(metal)) {
      setSelectedMetals(selectedMetals.filter((m) => m !== metal));
    } else {
      setSelectedMetals([...selectedMetals, metal]);
    }
  };

  const resetFilters = () => {
    setSelectedMetals([]);
    setInStockOnly(false);
    setOutOfStockOnly(false);
    setMinPrice(0);
    setMaxPrice(40000);
    setSortBy("featured");
  };

  const normalizeText = (value?: string | null) => {
    if (!value) return "";
    const aliasMap: Record<string, string> = {
      "18k white gold": "18ct white gold",
      "18 ct white gold": "18ct white gold",
      "18k yellow gold": "18ct yellow gold",
      "18 ct yellow gold": "18ct yellow gold",
      "18k rose gold": "18ct rose gold",
      "18 ct rose gold": "18ct rose gold",
      "950 platinum": "platinum",
      "platinum 950": "platinum",
    };

    const cleaned = String(value).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    return (aliasMap[cleaned] || cleaned).replace(/\s+/g, " ");
  };

  const matchesAnyNormalized = (value: string | undefined, selected: string[]) => {
    if (selected.length === 0) return true;
    const normalizedValue = normalizeText(value);
    if (!normalizedValue) return false;

    return selected.some((item) => {
      const normalizedItem = normalizeText(item);
      return (
        normalizedItem === normalizedValue ||
        normalizedValue.includes(normalizedItem) ||
        normalizedItem.includes(normalizedValue)
      );
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedMetals.length > 0 && !matchesAnyNormalized(p.metal, selectedMetals)) return false;
      if (inStockOnly && !p.inStock) return false;
      if (outOfStockOnly && p.inStock) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
  }, [products, selectedMetals, inStockOnly, outOfStockOnly, minPrice, maxPrice]);

  return (
    <section
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "64px 36px 80px",
        marginTop: "12px",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* ── 2-Column Layout: Left Filter Sidebar & Right Product Grid ── */}
        <div className="rings-category-layout-grid">
          {/* ── LEFT SIDEBAR FILTERS (COLLAPSIBLE DROPDOWNS & AUTO OFF) ── */}
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              paddingRight: "20px",
            }}
          >
            {/* Clear All Header */}
            {(selectedMetals.length > 0 || inStockOnly || outOfStockOnly || minPrice > 990 || maxPrice < 40000) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(198, 164, 95, 0.25)",
                  paddingBottom: "6px",
                  marginBottom: "2px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "10.5px",
                    color: "#c6a45f",
                    letterSpacing: "0.5px",
                  }}
                >
                  Active Filters
                </span>
                <button
                  onClick={resetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#c6a45f",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "9px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "3px",
                    textDecoration: "underline",
                  }}
                >
                  <RotateCcw size={8} /> Clear all
                </button>
              </div>
            )}

            {/* 1. Availability Dropdown */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("availability")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Availability
                  {(inStockOnly || outOfStockOnly) && (
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: "#c6a45f",
                      }}
                    />
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["availability"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["availability"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "500",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "0px",
                        border: inStockOnly
                          ? "1px solid #c6a45f"
                          : "1px solid rgba(198, 164, 95, 0.4)",
                        backgroundColor: inStockOnly ? "#c6a45f" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000000",
                      }}
                    >
                      {inStockOnly && <Check size={8} strokeWidth={3} />}
                    </div>
                    In stock (8)
                  </label>

                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                      fontWeight: "500",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => setOutOfStockOnly(!outOfStockOnly)}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "0px",
                        border: outOfStockOnly
                          ? "1px solid #c6a45f"
                          : "1px solid rgba(198, 164, 95, 0.4)",
                        backgroundColor: outOfStockOnly ? "#c6a45f" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000000",
                      }}
                    >
                      {outOfStockOnly && <Check size={8} strokeWidth={3} />}
                    </div>
                    Out of stock (0)
                  </label>
                </div>
              )}
            </div>

            {/* 2. Metal Dropdown */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("metal")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Metal
                  {selectedMetals.length > 0 && (
                    <span
                      style={{
                        fontSize: "8.5px",
                        backgroundColor: "#c6a45f",
                        color: "#000000",
                        borderRadius: "8px",
                        padding: "0px 4px",
                        fontWeight: "700",
                      }}
                    >
                      {selectedMetals.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["metal"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["metal"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {METALS_LIST.map((metal) => {
                    const isChecked = selectedMetals.includes(metal);
                    return (
                      <label
                        key={metal}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "10px",
                          fontWeight: "500",
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={() => toggleMetal(metal)}
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "0px",
                            border: isChecked
                              ? "1px solid #c6a45f"
                              : "1px solid rgba(198, 164, 95, 0.4)",
                            backgroundColor: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                          }}
                        >
                          {isChecked && <Check size={8} strokeWidth={3} />}
                        </div>
                        {metal}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Price Dropdown */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("price")}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "0",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "10.5px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                  }}
                >
                  Price
                  {(minPrice > 990 || maxPrice < 40000) && (
                    <span
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        backgroundColor: "#c6a45f",
                      }}
                    />
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["price"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["price"] && (
                <div style={{ marginTop: "8px" }}>
                  {/* Min / Max Input Box styled with Golden accent */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      style={{
                        width: "75px",
                        height: "28px",
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(198, 164, 95, 0.5)",
                        borderRadius: "0px",
                        padding: "0 6px",
                        color: "#c6a45f",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        outline: "none",
                      }}
                    />
                    <span style={{ color: "#c6a45f", fontSize: "10px" }}>-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{
                        width: "75px",
                        height: "28px",
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(198, 164, 95, 0.5)",
                        borderRadius: "0px",
                        padding: "0 6px",
                        color: "#c6a45f",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Range Slider in Gold */}
                  <input
                    type="range"
                    min={990}
                    max={40000}
                    step={500}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#c6a45f",
                      cursor: "pointer",
                      height: "3px",
                      backgroundColor: "rgba(198, 164, 95, 0.2)",
                      marginBottom: "4px",
                    }}
                  />

                  {/* Price bounds labels */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "9px",
                      color: "#999999",
                    }}
                  >
                    <span>{formatPrice(minPrice)}</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* ── RIGHT CONTENT AREA ── */}
          <div>
            {/* Top Toolbar: Count & Sorting */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "28px",
                paddingBottom: "14px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              {/* Product Count */}
              <span
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12.5px",
                  color: "#a0a0a0",
                  letterSpacing: "1px",
                }}
              >
                Showing <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> of {products.length} {products.length === 1 ? "product" : "products"}
              </span>

              {/* Sort Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Sort by:
                </span>
                <div style={{ position: "relative" }}>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(198, 164, 95, 0.35)",
                      borderRadius: "0px",
                      color: "#ffffff",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12px",
                      padding: "8px 32px 8px 14px",
                      appearance: "none",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="featured" style={{ background: "#0c0c0c" }}>
                      Featured
                    </option>
                    <option value="price-low" style={{ background: "#0c0c0c" }}>
                      Price: Low to High
                    </option>
                    <option value="price-high" style={{ background: "#0c0c0c" }}>
                      Price: High to Low
                    </option>
                    <option value="newest" style={{ background: "#0c0c0c" }}>
                      Newest
                    </option>
                  </select>
                  <ChevronDown
                    size={13}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#c6a45f",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ── 4-COLUMN PRODUCT GRID (EXACTLY 8 PRODUCT CARDS WITH NO IMAGES ONLY PLACEHOLDERS) ── */}
            <div className="rings-product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.015)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "border-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(198, 164, 95, 0.4)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)")}
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: "24px",
                          left: "24px",
                          zIndex: 2,
                          fontSize: "9px",
                          fontWeight: "700",
                          letterSpacing: "1.5px",
                          textTransform: "uppercase",
                          backgroundColor: "#c6a45f",
                          color: "#000000",
                          padding: "3px 8px",
                        }}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Product Image Box */}
                    <div style={{ width: "100%", height: "240px", marginBottom: "16px", overflow: "hidden", position: "relative" }}>
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <ImagePlaceholder height="100%" label="IMAGE PLACEHOLDER" />
                      )}
                    </div>

                    {/* Metal Subtitle */}
                    <div style={{ fontSize: "10px", color: "#c6a45f", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: "4px" }}>
                      {product.metal}
                    </div>

                    {/* Product Title */}
                    <h3
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        fontWeight: "500",
                        color: "#dddddd",
                        lineHeight: "1.5",
                        marginBottom: "10px",
                        height: "36px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.title}
                    </h3>

                    {/* Product Price */}
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "#c6a45f",
                        marginTop: "auto",
                      }}
                    >
                      {formatPrice(product.price)}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
