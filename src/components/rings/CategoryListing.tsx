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
  image?: string;
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
  defaultMinPrice = 0,
  defaultMaxPrice = 47800.9,
  hideDiamondType = false,
  hideCarat = false,
  hideColor = true,
  hideStyle = false,
  hideMetal = false,
}: CategoryListingProps) {
  const { formatPrice } = useCurrency();
  const [productList, setProductList] = useState<ProductItem[]>(initialProducts);

  const safeNumber = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string") {
      const cleaned = Number(value.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(cleaned) ? cleaned : 0;
    }
    if (value && typeof value === "object") {
      const maybe = value as { min?: number | string; max?: number | string; price?: number | string; value?: number | string };
      const direct = maybe.min ?? maybe.max ?? maybe.price ?? maybe.value;
      if (direct !== undefined && direct !== null) return safeNumber(direct);
    }
    return 0;
  };

  // Sync backend live products for this category (NO MOCKUPS)
  useEffect(() => {
    let cancelled = false;
    const titleLower = categoryTitle.toLowerCase().trim();
    const derivedSlug = titleLower.replace(/\s+rings?$/, "").replace(/\s+jewellery$/, "");

    const SLUG_CANDIDATES_MAP: Record<string, string[]> = {
      "eternity rings": ["eternity-bands", "eternity", "eternity-rings", "eternity-ring"],
      "eternity ring": ["eternity-bands", "eternity", "eternity-rings", "eternity-ring"],
      "eternity": ["eternity-bands", "eternity", "eternity-rings", "eternity-ring"],
      "engagement rings": ["engagement-rings", "engagement", "rings"],
      "engagement ring": ["engagement-rings", "engagement", "rings"],
      "wedding bands": ["wedding-bands", "wedding", "wedding-rings"],
      "wedding rings": ["wedding-bands", "wedding", "wedding-rings"],
      "men's wedding rings": ["wedding-bands"],
      "men's plain wedding rings": ["wedding-bands"],
      "men's plain": ["wedding-bands"],
      "women's wedding rings": ["wedding-bands"],
      "women's plain wedding rings": ["wedding-bands"],
      "women's plain": ["wedding-bands"],
      "bracelets & bangles": ["bracelets", "bangles", "bracelet", "bangle", "tennis-bracelets"],
      "tennis bracelets": ["tennis-bracelets", "bracelets", "bracelet"],
      "pendants": ["pendants", "pendant", "cross-pendants", "heart-pendants", "necklaces"],
      "cross pendants": ["cross-pendants", "pendants", "pendant", "necklaces"],
      "heart pendants": ["heart-pendants", "pendants", "pendant", "necklaces"],
      "necklace": ["necklaces", "necklace", "pendants", "pendant"],
      "necklaces & pendants": ["necklaces", "necklace", "pendants", "pendant"],
      "earrings": ["earrings", "earring", "hoop-earrings", "solitaire-studs"],
      "hoop earrings": ["hoop-earrings", "earrings", "earring"],
      "solitaire studs": ["solitaire-studs", "earrings", "earring"],
      "hot diamonds": ["hot-diamonds", "other", "jewellery"],
      "gold colour jewellery": ["jewellery", "other"],
      "rose gold jewellery": ["jewellery", "other"],
      "silver colour jewellery": ["jewellery", "other"],
    };

    const candidates = SLUG_CANDIDATES_MAP[titleLower] || [derivedSlug];

    async function loadCategoryProducts() {
      try {
        let apiData: any[] = [];

        // Try candidate category slugs
        for (const candidate of candidates) {
          const res = await productsApi.getProducts({ category: candidate, status: "active", limit: 100 });
          const items = res.data?.data || [];
          if (Array.isArray(items) && items.length > 0) {
            apiData = items;
            break;
          }
        }

        // Fallback: If still empty, fetch recent active products and filter by candidate category match
        if (apiData.length === 0) {
          const allRes = await productsApi.getProducts({ status: "active", limit: 100 });
          const allItems = allRes.data?.data || [];
          if (Array.isArray(allItems) && allItems.length > 0) {
            const matched = allItems.filter((p: any) => {
              const pCat = String(p.category || "").toLowerCase();
              const pName = String(p.name || "").toLowerCase();
              const pGender = String(p.gender || "").toLowerCase();
              const titleWords = titleLower.split(/\s+/);

              const categoryMatch = candidates.some((cand) => pCat.includes(cand) || cand.includes(pCat));
              const titleGenderMatch =
                (titleLower.includes("men") && pGender === "men") ||
                (titleLower.includes("women") && pGender === "women");
              const plainWeddingMatch =
                (titleLower.includes("wedding") || titleLower.includes("band")) &&
                (pName.includes("wedding") || pName.includes("band")) &&
                (titleLower.includes("plain") ? pName.includes("plain") || pName.includes("court") : true);

              return categoryMatch || titleGenderMatch || plainWeddingMatch;
            });
            if (matched.length > 0) {
              apiData = matched;
            }
          }
        }

        if (cancelled) return;

        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped: ProductItem[] = apiData.map((p: any) => {
            const firstVar = p.variants?.[0];
            let formattedMetal = "18K Gold";
            if (firstVar?.metal_karat && firstVar?.metal_type) {
              const typeClean = firstVar.metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
              formattedMetal = `${firstVar.metal_karat} ${typeClean}`;
            } else if (p.metal_type) {
              const mClean = p.metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
              formattedMetal = p.metal_karat ? `${p.metal_karat} ${mClean}` : `18K ${mClean}`;
            }

            const rawCarat = p.diamond_spec?.total_carat_weight || p.diamond_spec?.carat_weight || p.diamond_spec?.caratWeight || "1.00";
            const formattedCarat = String(rawCarat).includes("ct") ? String(rawCarat) : `${rawCarat}ct`;

            const rawOrigin = p.diamond_spec?.diamond_origin || "lab_grown";
            const formattedOrigin = rawOrigin === "natural" ? "Natural Diamond" : "Lab Grown Diamond";

            let rawStyle = p.earring_style || p.earring_type || p.diamond_cut || p.necklace_style || p.bracelet_type || "Classic";
            const styleLower = String(rawStyle).toLowerCase();
            if (styleLower.includes("hoop")) rawStyle = "Hoop Earrings";
            else if (styleLower.includes("stud")) rawStyle = "Stud Earrings";
            else if (styleLower.includes("drop")) rawStyle = "Drop Earrings";

            const mainImage =
              p.thumbnail ||
              p.images?.find((img: any) => img.isPrimary || img.is_primary)?.url ||
              p.images?.[0]?.url ||
              p.variants?.[0]?.images?.[0]?.url ||
              p.image ||
              "/shopbycategory/earings.png";

            const mappedPrice =
              safeNumber(p.base_price) ||
              safeNumber(p.discount_price) ||
              safeNumber(p.pricing?.basePrice) ||
              safeNumber(p.pricing?.discountPrice) ||
              safeNumber(p.variants?.[0]?.price) ||
              safeNumber(p.price) ||
              0;

            return {
              id: String(p.id),
              title: p.name,
              metal: formattedMetal,
              price: mappedPrice,
              badge: p.is_featured ? "EXCLUSIVE" : "NEXT DAY",
              inStock: p.total_stock > 0 || (p.totalStock ?? 0) > 0,
              diamondType: formattedOrigin as "Lab Grown Diamond" | "Natural Diamond",
              carat: formattedCarat,
              style: rawStyle,
              image: mainImage,
            };
          });

          setProductList(mapped);
        } else {
          // No live products found - display empty list (NO MOCKUPS!)
          setProductList([]);
        }
      } catch (err) {
        if (!cancelled) setProductList([]);
      }
    }

    loadCategoryProducts();

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

  const normalizeText = (value?: string | null) => {
    if (!value) return "";
    const aliasMap: Record<string, string> = {
      "18k white gold": "18ct white gold",
      "18 ct white gold": "18ct white gold",
      "18k yellow gold": "18ct yellow gold",
      "18 ct yellow gold": "18ct yellow gold",
      "18k rose gold": "18ct rose gold",
      "18 ct rose gold": "18ct rose gold",
      "14k white gold": "14k white gold",
      "9k white gold": "9k white gold",
      "9k yellow gold": "9k yellow gold",
      "9k rose gold": "9k rose gold",
      "950 platinum": "platinum",
      "platinum 950": "platinum",
      "studs": "stud earrings",
      "stud": "stud earrings",
      "hoops": "hoop earrings",
      "hoop": "hoop earrings",
      "drops": "drop earrings",
      "drop": "drop earrings",
      "earrings": "earrings",
      "solitaire": "solitaire",
      "halo": "halo",
      "under halo": "under halo",
      "three stone": "three stone",
      "trilogy": "three stone",
      "diamond shoulder": "diamond shoulder",
      "diamond shoulders": "diamond shoulder",
    };

    const step1 = String(value).toLowerCase().replace(/&/g, " and ");
    const step2 = step1.replace(/[^a-z0-9]+/g, " ").trim();
    const direct = aliasMap[step2] || step2;
    return direct.replace(/\s+/g, " ");
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
        (!p.diamondType || !matchesAnyNormalized(p.diamondType, selectedDiamondTypes))
      )
        return false;
      if (selectedMetals.length > 0 && !matchesAnyNormalized(p.metal, selectedMetals)) return false;
      if (selectedCarats.length > 0 && !matchesAnyNormalized(p.carat, selectedCarats))
        return false;
      if (selectedStyles.length > 0 && !matchesAnyNormalized(p.style, selectedStyles))
        return false;
      if (selectedColors.length > 0 && !matchesAnyNormalized(p.color, selectedColors))
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
                      transition={{ duration: 0.2 }}
                      className="product-card"
                      style={{
                        backgroundColor: "#090909",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        transition: "border-color 0.3s ease, transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(198, 164, 95, 0.4)";
                        e.currentTarget.style.transform = "translateY(-3px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {product.badge && (
                        <span className="product-badge">{product.badge}</span>
                      )}

                      <div className="product-image-block">
                        {product.image ? (
                          <img src={product.image} alt={product.title} />
                        ) : (
                          <ImagePlaceholder height="100%" label="IMAGE PLACEHOLDER" />
                        )}
                      </div>

                      <div className="product-card-body">
                        <div className="product-card-subtitle">{product.diamondType || product.metal}</div>
                        <h3 className="product-card-title">{product.title}</h3>
                        <div className="product-card-price">{formatPrice(product.price || 0)}</div>
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
