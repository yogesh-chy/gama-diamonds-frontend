"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, RotateCcw, ChevronDown } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";

interface Product {
  id: string;
  title: string;
  diamondType: "Lab Grown Diamond" | "Natural Diamond";
  style: string;
  shape: string;
  metal: string;
  color?: string;
  price: number;
  badge?: string;
  inStock: boolean;
}

const STYLE_NAMES: Record<string, string> = {
  solitaire: "Solitaire",
  halo: "Halo",
  "under-halo": "Under Halo",
  "diamond-shoulder": "Diamond Shoulder",
  "three-stone": "Trilogy Three Stone",
  "matching-set": "Matching Set",
  eternity: "Eternity",
};

const STYLE_TITLES: Record<string, string> = {
  solitaire: "Solitaire Engagement Rings",
  halo: "Halo Engagement Rings",
  "under-halo": "Under Halo Engagement Rings",
  "diamond-shoulder": "Diamond Shoulder Engagement Rings",
  "three-stone": "Trilogy Three Stone Engagement Rings",
  "matching-set": "Matching Set Engagement Rings",
  eternity: "Eternity Rings Collection",
};

function formatStyleTitle(slug: string): { name: string; title: string } {
  const normalized = slug.toLowerCase();
  const name = STYLE_NAMES[normalized] || slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  const title = STYLE_TITLES[normalized] || `${name} Engagement Rings`;
  return { name, title };
}

interface RingsStyleListingProps {
  styleSlug: string;
}

export default function RingsStyleListing({ styleSlug }: RingsStyleListingProps) {
  const { formatPrice } = useCurrency();
  const { name: styleName, title: pageTitle } = useMemo(() => formatStyleTitle(styleSlug), [styleSlug]);

  // 8 Dynamic sample products matching this style layout
  const products: Product[] = useMemo(
    () => [
      {
        id: `${styleSlug}-01`,
        title: `Round Brilliant ${styleName} Diamond Engagement Ring in 18ct White Gold`,
        diamondType: "Lab Grown Diamond",
        style: styleName,
        shape: "Round Brilliant",
        metal: "18ct White Gold",
        price: 1850,
        badge: "NEXT DAY",
        inStock: true,
      },
      {
        id: `${styleSlug}-02`,
        title: `Oval Cut ${styleName} Diamond Ring in 18ct Yellow Gold`,
        diamondType: "Natural Diamond",
        style: styleName,
        shape: "Oval Cut",
        metal: "18ct Yellow Gold",
        price: 2450,
        badge: "BESTSELLER",
        inStock: true,
      },
      {
        id: `${styleSlug}-03`,
        title: `Cushion Cut ${styleName} Engagement Ring in Platinum`,
        diamondType: "Lab Grown Diamond",
        style: styleName,
        shape: "Cushion Cut",
        metal: "Platinum",
        price: 3200,
        badge: "POPULAR",
        inStock: true,
      },
      {
        id: `${styleSlug}-04`,
        title: `Pear Cut ${styleName} Vintage Ring in 18ct Rose Gold`,
        diamondType: "Natural Diamond",
        style: styleName,
        shape: "Pear Cut",
        metal: "18ct Rose Gold",
        price: 2150,
        badge: "NEW",
        inStock: true,
      },
      {
        id: `${styleSlug}-05`,
        title: `Emerald Cut ${styleName} Lab Grown Diamond Ring in 9ct White Gold`,
        diamondType: "Lab Grown Diamond",
        style: styleName,
        shape: "Emerald Cut",
        metal: "9ct White Gold",
        price: 1450,
        badge: "NEXT DAY",
        inStock: true,
      },
      {
        id: `${styleSlug}-06`,
        title: `Princess Cut ${styleName} Emerald Green Accent Ring in 18ct Yellow Gold`,
        diamondType: "Natural Diamond",
        style: styleName,
        shape: "Princess Cut",
        metal: "18ct Yellow Gold",
        color: "Emerald Green",
        price: 4980,
        inStock: true,
      },
      {
        id: `${styleSlug}-07`,
        title: `Radiant Cut ${styleName} Amethyst Gemstone & Diamond Ring in Platinum`,
        diamondType: "Lab Grown Diamond",
        style: styleName,
        shape: "Radiant Cut",
        metal: "Platinum",
        color: "Amethyst",
        price: 3890,
        badge: "EXCLUSIVE",
        inStock: true,
      },
      {
        id: `${styleSlug}-08`,
        title: `Marquise Cut ${styleName} Diamond Ring in 18ct White Gold`,
        diamondType: "Natural Diamond",
        style: styleName,
        shape: "Marquise Cut",
        metal: "18ct White Gold",
        price: 15400,
        badge: "BESTSELLER",
        inStock: true,
      },
    ],
    [styleSlug, styleName]
  );

  // Filter selections
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([styleName]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(990);
  const [maxPrice, setMaxPrice] = useState<number>(20000);
  const [sortBy, setSortBy] = useState("featured");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const toggleShape = (shape: string) => {
    if (selectedShapes.includes(shape)) {
      setSelectedShapes(selectedShapes.filter((s) => s !== shape));
    } else {
      setSelectedShapes([...selectedShapes, shape]);
    }
  };

  const toggleStyle = (st: string) => {
    if (selectedStyles.includes(st)) {
      setSelectedStyles(selectedStyles.filter((s) => s !== st));
    } else {
      setSelectedStyles([...selectedStyles, st]);
    }
  };

  const toggleColor = (colorName: string) => {
    if (selectedColors.includes(colorName)) {
      setSelectedColors(selectedColors.filter((c) => c !== colorName));
    } else {
      setSelectedColors([...selectedColors, colorName]);
    }
  };

  const resetFilters = () => {
    setInStockOnly(false);
    setSelectedTypes([]);
    setSelectedShapes([]);
    setSelectedStyles([]);
    setSelectedColors([]);
    setMinPrice(990);
    setMaxPrice(20000);
    setSortBy("featured");
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.diamondType)) return false;
      if (selectedShapes.length > 0 && !selectedShapes.includes(p.shape)) return false;
      if (selectedStyles.length > 0 && !selectedStyles.includes(p.style)) return false;
      if (selectedColors.length > 0 && p.color && !selectedColors.includes(p.color)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
  }, [products, inStockOnly, selectedTypes, selectedShapes, selectedStyles, selectedColors, minPrice, maxPrice]);

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: "32px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT SIDEBAR FILTERS (NARROW 200px, SMALL FONTS & AUTO OFF DROPDOWNS) ── */}
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
            {(inStockOnly ||
              selectedTypes.length > 0 ||
              selectedShapes.length > 0 ||
              selectedStyles.length > 0 ||
              selectedColors.length > 0 ||
              minPrice > 990 ||
              maxPrice < 20000) && (
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

            {/* 1. Availability */}
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
                  {inStockOnly && (
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
                    In Stock
                  </label>
                </div>
              )}
            </div>

            {/* 2. Diamond Type */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("diamondType")}
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
                  Diamond Type
                  {selectedTypes.length > 0 && (
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
                      {selectedTypes.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["diamondType"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["diamondType"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {["Lab Grown Diamond", "Natural Diamond"].map((type) => {
                    const isChecked = selectedTypes.includes(type);
                    return (
                      <label
                        key={type}
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
                          onClick={() => toggleType(type)}
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
                        {type}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Shape */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("shape")}
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
                  Shape
                  {selectedShapes.length > 0 && (
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
                      {selectedShapes.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["shape"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["shape"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {[
                    "Round Brilliant",
                    "Oval Cut",
                    "Cushion Cut",
                    "Princess Cut",
                    "Emerald Cut",
                    "Pear Cut",
                    "Marquise Cut",
                    "Radiant Cut",
                  ].map((sh) => {
                    const isChecked = selectedShapes.includes(sh);
                    return (
                      <label
                        key={sh}
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
                          onClick={() => toggleShape(sh)}
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
                        {sh}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Style */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("style")}
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
                  Style
                  {selectedStyles.length > 0 && (
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
                      {selectedStyles.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["style"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["style"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {["Solitaire", "Halo", "Under Halo", "Trilogy Three Stone", "Diamond Shoulder"].map(
                    (stName) => {
                      const isChecked = selectedStyles.includes(stName);
                      return (
                        <label
                          key={stName}
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
                            onClick={() => toggleStyle(stName)}
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
                          {stName}
                        </label>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* 5. Color */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
              <button
                onClick={() => toggleSection("color")}
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
                  Color
                  {selectedColors.length > 0 && (
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
                      {selectedColors.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["color"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["color"] && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                  {["Amethyst", "Emerald Green", "Green", "Pink", "Purple"].map((colorName) => {
                    const isChecked = selectedColors.includes(colorName);
                    return (
                      <label
                        key={colorName}
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
                          onClick={() => toggleColor(colorName)}
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
                        {colorName}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 6. Price */}
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
                  {(minPrice > 990 || maxPrice < 20000) && (
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

                  <input
                    type="range"
                    min={990}
                    max={20000}
                    step={100}
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

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "9px",
                      color: "#999999",
                    }}
                  >
                    <span>{formatPrice(990)}</span>
                    <span>{formatPrice(20000)}</span>
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
                  fontSize: "14px",
                  color: "#cccccc",
                }}
              >
                Showing <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> of {products.length} products
              </span>

              {/* Sort Dropdown */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Sort by:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    backgroundColor: "rgba(10, 10, 10, 0.9)",
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    color: "#ffffff",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    padding: "6px 12px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="featured" style={{ backgroundColor: "#000000" }}>Featured</option>
                  <option value="price-low" style={{ backgroundColor: "#000000" }}>Price: Low to High</option>
                  <option value="price-high" style={{ backgroundColor: "#000000" }}>Price: High to Low</option>
                  <option value="newest" style={{ backgroundColor: "#000000" }}>Newest Arrival</option>
                </select>
              </div>
            </div>

            {/* 8 Product Grid Cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "24px",
              }}
            >
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "0px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "all 0.3s ease",
                    }}
                    className="product-card"
                  >
                    {/* Badge */}
                    {product.badge && (
                      <span
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "#c6a45f",
                          color: "#000000",
                          fontSize: "9px",
                          fontWeight: "700",
                          padding: "3px 8px",
                          letterSpacing: "1px",
                          zIndex: 2,
                        }}
                      >
                        {product.badge}
                      </span>
                    )}

                    {/* Diamond Ring Image Preview Placeholder */}
                    <div style={{ position: "relative", width: "100%", paddingTop: "100%" }}>
                      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
                        <ImagePlaceholder
                          width="100%"
                          height="100%"
                          label={product.title}
                          aspectRatio="1/1"
                        />
                      </div>
                    </div>

                    {/* Product Details */}
                    <div
                      style={{
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        flexGrow: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#c6a45f",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontFamily: "'Poppins', sans-serif",
                            display: "block",
                            marginBottom: "4px",
                          }}
                        >
                          {product.diamondType}
                        </span>
                        <h3
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "14px",
                            fontWeight: "400",
                            color: "#ffffff",
                            lineHeight: "1.4",
                            marginBottom: "12px",
                          }}
                        >
                          {product.title}
                        </h3>
                      </div>

                      <div>
                        <div
                          style={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#c6a45f",
                            marginBottom: "12px",
                          }}
                        >
                          {formatPrice(product.price)}
                        </div>

                        <button
                          style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "transparent",
                            border: "1px solid #c6a45f",
                            color: "#c6a45f",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            fontWeight: "600",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                        >
                          View Details
                        </button>
                      </div>
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
