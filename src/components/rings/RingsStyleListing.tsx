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
  diamondType: "Lab Grown Diamond" | "Natural Diamond";
  style: string;
  shape: string;
  metal: string;
  color?: string;
  price: number;
  badge?: string;
  inStock: boolean;
  image?: string | null;
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

  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function loadStyleData() {
      try {
        const res = await productsApi.getProducts({ style: styleSlug, status: "active" });
        let apiData = res.data?.data || [];
        if (apiData.length === 0) {
          const fallback = await productsApi.getProducts({ status: "active", limit: 12 });
          apiData = fallback.data?.data || [];
        }
        if (cancelled) return;
        if (Array.isArray(apiData)) {
          const mapped: Product[] = apiData.map((p) => {
            const rawPrice = typeof p.price === "object" && p.price?.min ? (typeof p.price.min === "number" ? p.price.min : parseFloat(String(p.price.min))) : (typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)));
            const minPrice = isNaN(rawPrice) || rawPrice === 0 ? (p.variants?.[0]?.price ? parseFloat(String(p.variants[0].price)) : 0) : rawPrice;
            return {
              id: String(p.id),
              title: p.name,
              diamondType: p.diamond_spec?.diamond_origin === "natural" ? "Natural Diamond" : "Lab Grown Diamond",
              style: styleName,
              shape: p.diamond_cut || "Round Brilliant",
              metal: p.metal_type || "Fine Precious Metal",
              price: minPrice,
              badge: p.is_featured ? "FEATURED" : undefined,
              inStock: (p.total_stock || 0) > 0,
              image: p.thumbnail || p.images?.find((img: any) => img.isPrimary || img.is_primary)?.url || p.images?.[0]?.url || p.variants?.[0]?.images?.[0]?.url || p.image,
            };
          });
          setProductList(mapped);
        } else {
          setProductList([]);
        }
      } catch (err) {
        if (!cancelled) setProductList([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadStyleData();

    return () => {
      cancelled = true;
    };
  }, [styleSlug, styleName]);

  // Filter selections
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
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
    setMinPrice(0);
    setMaxPrice(50000);
    setSortBy("featured");
  };

  const normalizeText = (value?: string | null) => {
    if (!value) return "";
    const aliasMap: Record<string, string> = {
      "lab grown diamond": "lab grown diamond",
      "natural diamond": "natural diamond",
      "solitaire": "solitaire",
      "halo": "halo",
      "under halo": "under halo",
      "three stone": "three stone",
      "trilogy": "three stone",
      "diamond shoulder": "diamond shoulder",
      "diamond shoulders": "diamond shoulder",
      "round brilliant": "round brilliant",
      "oval": "oval",
      "princess": "princess",
      "emerald": "emerald",
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
    return productList.filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (selectedTypes.length > 0 && !matchesAnyNormalized(p.diamondType, selectedTypes)) return false;
      if (selectedShapes.length > 0 && !matchesAnyNormalized(p.shape, selectedShapes)) return false;
      if (selectedStyles.length > 0 && !matchesAnyNormalized(p.style, selectedStyles)) return false;
      if (selectedColors.length > 0 && p.color && !matchesAnyNormalized(p.color, selectedColors)) return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });
  }, [productList, inStockOnly, selectedTypes, selectedShapes, selectedStyles, selectedColors, minPrice, maxPrice]);

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
                  {(minPrice > 0 || maxPrice < 50000) && (
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
                    min={0}
                    max={50000}
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
                Showing <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> of {productList.length} {productList.length === 1 ? "product" : "products"}
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
            <div className="rings-product-grid">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="product-card"
                    style={{
                      backgroundColor: "#090909",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "0px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      position: "relative",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {product.badge && <span className="product-badge">{product.badge}</span>}

                    <div className="product-image-block">
                      {product.image ? (
                        <img src={product.image} alt={product.title} />
                      ) : (
                        <ImagePlaceholder
                          width="100%"
                          height="100%"
                          label={product.title}
                          aspectRatio="1/1"
                        />
                      )}
                    </div>

                    <div className="product-card-body">
                      <div className="product-card-subtitle">{product.diamondType}</div>
                      <h3 className="product-card-title">{product.title}</h3>
                      <div className="product-card-price">{formatPrice(product.price || 0)}</div>
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
