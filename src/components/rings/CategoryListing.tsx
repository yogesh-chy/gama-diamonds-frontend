"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, RotateCcw, ChevronDown } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";

export interface ProductItem {
  id: string;
  title: string;
  metal: string;
  price: number;
  badge?: string;
  inStock: boolean;
  diamondType?: "Lab Grown Diamond" | "Natural Diamond";
  carat?: string;
  style?: string;
  color?: string;
}

const ALL_METALS = [
  "9K White Gold",
  "9K Yellow Gold",
  "9K Rose Gold",
  "14K White Gold",
  "18ct White Gold",
  "18K White Gold",
  "18K Yellow Gold",
  "18ct Yellow Gold",
  "18ct Rose Gold",
  "Platinum",
];

const ALL_DIAMOND_TYPES = ["Lab Grown Diamond", "Natural Diamond"];

const ALL_CARATS = [
  "0.50ct",
  "0.75ct",
  "1.00ct",
  "1.20ct",
  "1.50ct",
  "1.80ct",
  "2.00ct",
  "2.15ct",
  "2.20ct",
  "2.40ct",
  "2.80ct",
  "3.00ct",
  "4.30ct",
];

interface CategoryListingProps {
  products: ProductItem[];
  categoryTitle?: string;
  customStyles?: string[];
  customMetals?: string[];
  customColors?: string[];
  customCarats?: string[];
  defaultMinPrice?: number;
  defaultMaxPrice?: number;
  hideDiamondType?: boolean;
  hideCarat?: boolean;
  hideColor?: boolean;
  hideStyle?: boolean;
  hideMetal?: boolean;
}

export default function CategoryListing({
  products: initialProducts,
  categoryTitle = "Collection",
  customStyles = [],
  customMetals,
  customColors,
  customCarats,
  defaultMinPrice = 39,
  defaultMaxPrice = 47800.9,
  hideDiamondType = false,
  hideCarat = false,
  hideColor = true,
  hideStyle = false,
  hideMetal = false,
}: CategoryListingProps) {
  const { formatPrice } = useCurrency();
  const [productList, setProductList] = useState<ProductItem[]>(initialProducts);

  // Sync backend live products for this category
  useEffect(() => {
    let cancelled = false;
    const catSlug = categoryTitle.toLowerCase().replace(/\s+rings?$/, "").replace(/\s+jewellery$/, "");
    productsApi
      .getProducts({ category: catSlug, status: "active" })
      .then((res) => {
        if (cancelled || !res.data?.data) return;
        const apiData = res.data.data;
        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped: ProductItem[] = apiData.map((p) => ({
            id: String(p.id),
            title: p.name,
            metal: p.metal_type || "18ct White Gold",
            price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
            badge: p.is_featured ? "EXCLUSIVE" : "NEXT DAY",
            inStock: p.total_stock > 0 || (p.totalStock ?? 0) > 0,
            diamondType: "Natural Diamond",
            carat: String(p.diamond_spec?.carat_weight || p.diamond_spec?.caratWeight || "1.00ct"),
            style: p.diamond_cut || p.earring_type || p.necklace_style || p.bracelet_type || "Classic",
          }));
          setProductList(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [categoryTitle]);

  // Filter States
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedDiamondTypes, setSelectedDiamondTypes] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedCarats, setSelectedCarats] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(defaultMinPrice);
  const [maxPrice, setMaxPrice] = useState<number>(defaultMaxPrice);
  const [sortBy, setSortBy] = useState("featured");

  const metalOptions = customMetals || ALL_METALS;
  const caratOptions = customCarats || ALL_CARATS;
  const colorOptions = customColors || [
    "Aquamarine",
    "Blue Sapphire",
    "Emerald Green",
    "Fancy Yellow",
    "Multi Coloured",
    "Pink",
    "Ruby",
    "Sapphire",
    "Tanzanite",
    "yellow",
  ];

  // Accordion Expand/Collapse States (all default closed except price)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    availability: false,
    diamondType: false,
    metal: false,
    carat: false,
    style: false,
    color: false,
    price: true,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleFilter = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const resetFilters = () => {
    setInStockOnly(false);
    setSelectedDiamondTypes([]);
    setSelectedMetals([]);
    setSelectedCarats([]);
    setSelectedStyles([]);
    setSelectedColors([]);
    setMinPrice(defaultMinPrice);
    setMaxPrice(defaultMaxPrice);
    setSortBy("featured");
  };

  // Compute available styles dynamically if not provided
  const availableStyles = useMemo(() => {
    if (customStyles.length > 0) return customStyles;
    const extracted = Array.from(new Set(productList.map((p) => p.style).filter(Boolean))) as string[];
    return extracted.length > 0 ? extracted : ["Drop Earrings", "Earring", "Hoop Earrings", "STYLE: DROP EARRINGS", "STYLE: DROPS", "STYLE: HALO EARRINGS", "STYLE: HOOPS", "STYLE: STUDS", "Stud Earrings"];
  }, [customStyles, productList]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = productList.filter((p) => {
      if (inStockOnly && !p.inStock) return false;
      if (
        selectedDiamondTypes.length > 0 &&
        (!p.diamondType || !selectedDiamondTypes.includes(p.diamondType))
      )
        return false;
      if (selectedMetals.length > 0 && !selectedMetals.includes(p.metal)) return false;
      if (selectedCarats.length > 0 && (!p.carat || !selectedCarats.includes(p.carat)))
        return false;
      if (selectedStyles.length > 0 && (!p.style || !selectedStyles.includes(p.style)))
        return false;
      if (selectedColors.length > 0 && (!p.color || !selectedColors.includes(p.color)))
        return false;
      if (p.price < minPrice || p.price > maxPrice) return false;
      return true;
    });

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [
    productList,
    inStockOnly,
    selectedDiamondTypes,
    selectedMetals,
    selectedCarats,
    selectedStyles,
    selectedColors,
    minPrice,
    maxPrice,
    sortBy,
  ]);

  const activeFiltersCount =
    (inStockOnly ? 1 : 0) +
    selectedDiamondTypes.length +
    selectedMetals.length +
    selectedCarats.length +
    selectedStyles.length +
    selectedColors.length +
    (minPrice > defaultMinPrice || maxPrice < defaultMaxPrice ? 1 : 0);

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
          {/* ── LEFT SIDEBAR FILTERS ── */}
          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              borderRight: "1px solid rgba(255, 255, 255, 0.08)",
              paddingRight: "22px",
            }}
          >
            {/* Active Filters / Reset Header */}
            {activeFiltersCount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(198, 164, 95, 0.25)",
                  paddingBottom: "8px",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "11px",
                    color: "#c6a45f",
                    letterSpacing: "0.5px",
                  }}
                >
                  Active Filters ({activeFiltersCount})
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
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                <div style={{ marginTop: "10px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11px",
                      fontWeight: "500",
                      color: inStockOnly ? "#c6a45f" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      style={{
                        width: "14px",
                        height: "14px",
                        border: inStockOnly
                          ? "1px solid #c6a45f"
                          : "1px solid rgba(255, 255, 255, 0.3)",
                        backgroundColor: inStockOnly ? "#c6a45f" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#000000",
                        borderRadius: "1px",
                      }}
                    >
                      {inStockOnly && <Check size={10} strokeWidth={3} />}
                    </div>
                    In Stock
                  </label>
                </div>
              )}
            </div>

            {/* 2. Diamond Type */}
            {!hideDiamondType && (
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Diamond Type
                  {selectedDiamondTypes.length > 0 && (
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
                      {selectedDiamondTypes.length}
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
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "10px" }}>
                  {ALL_DIAMOND_TYPES.map((type) => {
                    const isChecked = selectedDiamondTypes.includes(type);
                    return (
                      <label
                        key={type}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: isChecked ? "#c6a45f" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={() => toggleFilter(selectedDiamondTypes, setSelectedDiamondTypes, type)}
                          style={{
                            width: "14px",
                            height: "14px",
                            border: isChecked
                              ? "1px solid #c6a45f"
                              : "1px solid rgba(255, 255, 255, 0.3)",
                            backgroundColor: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                            borderRadius: "1px",
                          }}
                        >
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        {type}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            )}

            {/* 3. Metal */}
            {!hideMetal && (
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {metalOptions.map((metal) => {
                    const isChecked = selectedMetals.includes(metal);
                    return (
                      <label
                        key={metal}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: isChecked ? "#c6a45f" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={() => toggleFilter(selectedMetals, setSelectedMetals, metal)}
                          style={{
                            width: "14px",
                            height: "14px",
                            border: isChecked
                              ? "1px solid #c6a45f"
                              : "1px solid rgba(255, 255, 255, 0.3)",
                            backgroundColor: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                            borderRadius: "1px",
                          }}
                        >
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        {metal}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            )}

            {/* 4. Carat */}
            {!hideCarat && (
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
              <button
                onClick={() => toggleSection("carat")}
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Carat
                  {selectedCarats.length > 0 && (
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
                      {selectedCarats.length}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    color: "#c6a45f",
                    transform: openSections["carat"] ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.2s ease",
                  }}
                />
              </button>

              {openSections["carat"] && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                    maxHeight: "180px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {caratOptions.map((carat) => {
                    const isChecked = selectedCarats.includes(carat);
                    return (
                      <label
                        key={carat}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: isChecked ? "#c6a45f" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={() => toggleFilter(selectedCarats, setSelectedCarats, carat)}
                          style={{
                            width: "14px",
                            height: "14px",
                            border: isChecked
                              ? "1px solid #c6a45f"
                              : "1px solid rgba(255, 255, 255, 0.3)",
                            backgroundColor: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                            borderRadius: "1px",
                          }}
                        >
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        {carat}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
            )}

            {/* 5. Style */}
            {!hideStyle && (<div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "10px",
                    maxHeight: "200px",
                    overflowY: "auto",
                    paddingRight: "4px",
                  }}
                >
                  {availableStyles.map((style) => {
                    const isChecked = selectedStyles.includes(style);
                    return (
                      <label
                        key={style}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "11px",
                          fontWeight: "500",
                          color: isChecked ? "#c6a45f" : "#ffffff",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          onClick={() => toggleFilter(selectedStyles, setSelectedStyles, style)}
                          style={{
                            width: "14px",
                            height: "14px",
                            border: isChecked
                              ? "1px solid #c6a45f"
                              : "1px solid rgba(255, 255, 255, 0.3)",
                            backgroundColor: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#000000",
                            borderRadius: "1px",
                          }}
                        >
                          {isChecked && <Check size={10} strokeWidth={3} />}
                        </div>
                        {style}
                      </label>
                    );
                  })}
                </div>
              )}
            </div>)}

            {/* 6. Color */}
            {!hideColor && (
              <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#c6a45f",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
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
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      marginTop: "10px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      paddingRight: "4px",
                    }}
                  >
                    {colorOptions.map((color) => {
                      const isChecked = selectedColors.includes(color);
                      return (
                        <label
                          key={color}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "11px",
                            fontWeight: "500",
                            color: isChecked ? "#c6a45f" : "#ffffff",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            onClick={() => toggleFilter(selectedColors, setSelectedColors, color)}
                            style={{
                              width: "14px",
                              height: "14px",
                              border: isChecked
                                ? "1px solid #c6a45f"
                                : "1px solid rgba(255, 255, 255, 0.3)",
                              backgroundColor: isChecked ? "#c6a45f" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#000000",
                              borderRadius: "1px",
                            }}
                          >
                            {isChecked && <Check size={10} strokeWidth={3} />}
                          </div>
                          {color}
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* 7. Price */}
            <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "12px" }}>
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
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  Price
                  {(minPrice > defaultMinPrice || maxPrice < defaultMaxPrice) && (
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
                <div style={{ marginTop: "10px" }}>
                  {/* Min / Max Input Box */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "12px",
                    }}
                  >
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(Number(e.target.value))}
                      style={{
                        width: "80px",
                        height: "30px",
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(198, 164, 95, 0.5)",
                        borderRadius: "0px",
                        padding: "0 8px",
                        color: "#c6a45f",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        outline: "none",
                      }}
                    />
                    <span style={{ color: "#c6a45f", fontSize: "12px" }}>-</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      style={{
                        width: "85px",
                        height: "30px",
                        backgroundColor: "rgba(10, 10, 10, 0.9)",
                        border: "1px solid rgba(198, 164, 95, 0.5)",
                        borderRadius: "0px",
                        padding: "0 8px",
                        color: "#c6a45f",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        outline: "none",
                      }}
                    />
                  </div>

                  {/* Range Slider in Gold */}
                  <input
                    type="range"
                    min={defaultMinPrice}
                    max={defaultMaxPrice}
                    step={10}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{
                      width: "100%",
                      accentColor: "#c6a45f",
                      cursor: "pointer",
                      height: "3px",
                      backgroundColor: "rgba(198, 164, 95, 0.2)",
                      marginBottom: "6px",
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
                    <span>{formatPrice(defaultMinPrice)}</span>
                    <span>{formatPrice(defaultMaxPrice)}</span>
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
                Showing <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> of {productList.length} products
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

            {/* ── 4-COLUMN PRODUCT GRID ── */}
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.015)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px", color: "#888888" }}>
                  No products found matching the selected filters.
                </p>
                <button
                  onClick={resetFilters}
                  style={{
                    marginTop: "16px",
                    backgroundColor: "#c6a45f",
                    color: "#000000",
                    border: "none",
                    padding: "8px 20px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="rings-product-grid">
                {filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <motion.div
                      whileHover={{ y: -4 }}
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

                      {/* Product Image Placeholder Box */}
                      <div style={{ width: "100%", height: "240px", marginBottom: "16px" }}>
                        <ImagePlaceholder height="100%" label="IMAGE PLACEHOLDER" />
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
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
