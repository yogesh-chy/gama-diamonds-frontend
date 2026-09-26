"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Search, RotateCcw, ChevronDown, SlidersHorizontal } from "lucide-react";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import LuxurySelect from "@/components/ui/LuxurySelect";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";
import { applyProductFilters } from "@/lib/productFilters";

interface SearchProduct {
  id: string;
  title: string;
  diamondType?: string;
  category?: string;
  style?: string;
  metal?: string;
  price: number;
  badge?: string;
  inStock: boolean;
  image?: string | null;
}

const ALL_SEARCH_METALS = [
  "18ct White Gold",
  "18ct Yellow Gold",
  "18ct Rose Gold",
  "9ct White Gold",
  "9ct Yellow Gold",
  "9ct Rose Gold",
  "Platinum",
  "Silver",
];

const ALL_SEARCH_CATEGORIES = [
  { value: "engagement-rings", label: "Engagement Rings" },
  { value: "wedding-bands", label: "Wedding Bands" },
  { value: "eternity-bands", label: "Eternity Bands" },
  { value: "earrings", label: "Earrings" },
  { value: "necklaces", label: "Necklaces & Pendants" },
  { value: "bracelets", label: "Bracelets & Bangles" },
  { value: "other", label: "Other Jewellery" },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const { formatPrice } = useCurrency();

  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync state if URL query changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchTerm(q);
    setActiveQuery(q);
  }, [searchParams]);

  // Fetch products from backend matching search term
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    async function loadSearch() {
      try {
        const queryParams: Record<string, any> = {
          status: "active",
          limit: 100,
        };
        if (activeQuery.trim()) {
          queryParams.search = activeQuery.trim();
        }

        const res = await productsApi.getProducts(queryParams);
        const apiData = res.data?.data || [];

        if (cancelled) return;

        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped: SearchProduct[] = apiData.map((p: any) => {
            const rawPrice =
              typeof p.price === "object" && p.price?.min
                ? typeof p.price.min === "number"
                  ? p.price.min
                  : parseFloat(String(p.price.min))
                : typeof p.base_price === "number"
                ? p.base_price
                : parseFloat(String(p.base_price || 0));

            const validPrice =
              isNaN(rawPrice) || rawPrice === 0
                ? p.variants?.[0]?.price
                  ? parseFloat(String(p.variants[0].price))
                  : 0
                : rawPrice;

            const metalClean = p.metal_type
              ? p.metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
              : p.variants?.[0]?.metal_type
              ? p.variants[0].metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
              : "Fine Metal";

            const karat = p.metal_karat || p.variants?.[0]?.metal_karat || "";
            const metalFull = karat ? `${karat} ${metalClean}` : metalClean;

            return {
              id: String(p.id || p.slug),
              title: p.name,
              diamondType:
                p.diamond_spec?.diamond_origin === "natural"
                  ? "Natural Diamond"
                  : "Lab Grown Diamond",
              category: p.category || "",
              style: p.subcategory || p.ring_type || p.ring_style || p.earring_type || p.necklace_style || p.bracelet_type || "",
              metal: metalFull,
              price: validPrice,
              badge: p.is_featured ? "FEATURED" : undefined,
              inStock:
                (p.total_stock || 0) > 0 ||
                Boolean(p.variants?.some((v: any) => Number(v.stock || 0) > 0)),
              image:
                p.thumbnail ||
                p.images?.find((img: any) => img.isPrimary || img.is_primary)?.url ||
                p.images?.[0]?.url ||
                p.variants?.[0]?.images?.[0]?.url ||
                p.image,
            };
          });
          setProducts(mapped);
        } else {
          setProducts([]);
        }
      } catch {
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSearch();

    return () => {
      cancelled = true;
    };
  }, [activeQuery]);

  // Filter States
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedDiamondTypes, setSelectedDiamondTypes] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000);
  const [sortBy, setSortBy] = useState("featured");

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    availability: true,
    diamondType: true,
    metal: true,
    category: true,
    price: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const resetFilters = () => {
    setInStockOnly(false);
    setSelectedDiamondTypes([]);
    setSelectedMetals([]);
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(50000);
    setSortBy("featured");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== activeQuery.trim()) {
      setActiveQuery(searchTerm.trim());
      // Update URL without full page reload
      window.history.replaceState(null, "", `/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  // Filter and Sort Applied Products
  const filteredProducts = useMemo(() => {
    let result = applyProductFilters(products, {
      inStockOnly,
      selectedDiamondTypes,
      selectedMetals,
      minPrice,
      maxPrice,
    });

    if (selectedCategories.length > 0) {
      result = result.filter((p) => {
        const pCat = String(p.category || "").toLowerCase();
        return selectedCategories.some((sc) => sc.toLowerCase() === pCat || pCat.includes(sc.toLowerCase()));
      });
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, inStockOnly, selectedDiamondTypes, selectedMetals, selectedCategories, minPrice, maxPrice, sortBy]);

  const activeFiltersCount =
    (inStockOnly ? 1 : 0) +
    selectedDiamondTypes.length +
    selectedMetals.length +
    selectedCategories.length +
    (minPrice > 0 || maxPrice < 50000 ? 1 : 0);

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px 80px" }}>
      {/* ── SEARCH HEADER BAR ── */}
      <div style={{ marginBottom: "36px", textAlign: "center" }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
            color: "#ffffff",
            fontWeight: "500",
            marginBottom: "12px",
            letterSpacing: "1px",
          }}
        >
          {activeQuery ? `Search Results for "${activeQuery}"` : "Search Our Luxury Collection"}
        </h1>
        <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#888888", maxWidth: "500px", margin: "0 auto 24px" }}>
          Explore handcrafted diamond rings, wedding bands, earrings, pendants, and bespoke fine jewellery.
        </p>

        {/* Search Input Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#0a0a0a",
            border: "none",
            borderRadius: "0px",
            padding: "4px 6px 4px 16px",
            boxShadow: "none",
          }}
        >
          <Search size={16} color="#c6a45f" style={{ flexShrink: 0, marginRight: "10px" }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ring style, metal, shape, diamond type, SKU..."
            style={{
              flex: 1,
              backgroundColor: "transparent",
              border: "none",
              outline: "none",
              color: "#ffffff",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "13px",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#c6a45f",
              color: "#000000",
              border: "none",
              padding: "10px 24px",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Search
          </button>
        </form>
      </div>

      {/* ── MAIN 2-COLUMN LAYOUT ── */}
      <div className="rings-category-layout-grid">
        {/* ── LEFT FILTERS SIDEBAR ── */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            borderRight: "1px solid rgba(255, 255, 255, 0.08)",
            paddingRight: "20px",
          }}
        >
          {/* Active Filters / Reset Header */}
          {activeFiltersCount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid rgba(198, 164, 95, 0.3)",
                paddingBottom: "8px",
                marginBottom: "4px",
              }}
            >
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "11px", color: "#c6a45f" }}>
                Active Filters ({activeFiltersCount})
              </span>
              <button
                onClick={resetFilters}
                style={{
                  background: "none",
                  border: "none",
                  color: "#c6a45f",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "9.5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  textDecoration: "underline",
                }}
              >
                <RotateCcw size={9} /> Reset All
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
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: "600", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Availability
              </span>
              <ChevronDown
                size={12}
                style={{ color: "#c6a45f", transform: openSections["availability"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>
            {openSections["availability"] && (
              <div style={{ marginTop: "8px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                  <div
                    onClick={() => setInStockOnly(!inStockOnly)}
                    style={{
                      width: "14px",
                      height: "14px",
                      border: inStockOnly ? "1px solid #c6a45f" : "1px solid rgba(198, 164, 95, 0.4)",
                      backgroundColor: inStockOnly ? "#c6a45f" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#000000",
                    }}
                  >
                    {inStockOnly && <Check size={9} strokeWidth={3} />}
                  </div>
                  In Stock Only
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
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: "600", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Diamond Type
              </span>
              <ChevronDown
                size={12}
                style={{ color: "#c6a45f", transform: openSections["diamondType"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>
            {openSections["diamondType"] && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {["Natural Diamond", "Lab Grown Diamond"].map((dt) => {
                  const isChecked = selectedDiamondTypes.includes(dt);
                  return (
                    <label key={dt} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                      <div
                        onClick={() => toggleFilter(selectedDiamondTypes, setSelectedDiamondTypes, dt)}
                        style={{
                          width: "14px",
                          height: "14px",
                          border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(198, 164, 95, 0.4)",
                          backgroundColor: isChecked ? "#c6a45f" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000000",
                        }}
                      >
                        {isChecked && <Check size={9} strokeWidth={3} />}
                      </div>
                      {dt}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 3. Category Filter */}
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)", paddingBottom: "10px" }}>
            <button
              onClick={() => toggleSection("category")}
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
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: "600", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Category
              </span>
              <ChevronDown
                size={12}
                style={{ color: "#c6a45f", transform: openSections["category"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>
            {openSections["category"] && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {ALL_SEARCH_CATEGORIES.map((cat) => {
                  const isChecked = selectedCategories.includes(cat.value);
                  return (
                    <label key={cat.value} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                      <div
                        onClick={() => toggleFilter(selectedCategories, setSelectedCategories, cat.value)}
                        style={{
                          width: "14px",
                          height: "14px",
                          border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(198, 164, 95, 0.4)",
                          backgroundColor: isChecked ? "#c6a45f" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000000",
                        }}
                      >
                        {isChecked && <Check size={9} strokeWidth={3} />}
                      </div>
                      {cat.label}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 4. Metal Filter */}
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
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: "600", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Precious Metal
              </span>
              <ChevronDown
                size={12}
                style={{ color: "#c6a45f", transform: openSections["metal"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>
            {openSections["metal"] && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "8px" }}>
                {ALL_SEARCH_METALS.map((metal) => {
                  const isChecked = selectedMetals.includes(metal);
                  return (
                    <label key={metal} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#dddddd", cursor: "pointer" }}>
                      <div
                        onClick={() => toggleFilter(selectedMetals, setSelectedMetals, metal)}
                        style={{
                          width: "14px",
                          height: "14px",
                          border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(198, 164, 95, 0.4)",
                          backgroundColor: isChecked ? "#c6a45f" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#000000",
                        }}
                      >
                        {isChecked && <Check size={9} strokeWidth={3} />}
                      </div>
                      {metal}
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* 5. Price Range */}
          <div style={{ paddingBottom: "10px" }}>
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
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", fontWeight: "600", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.8px" }}>
                Price Range
              </span>
              <ChevronDown
                size={12}
                style={{ color: "#c6a45f", transform: openSections["price"] ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
              />
            </button>
            {openSections["price"] && (
              <div style={{ marginTop: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    style={{
                      width: "75px",
                      height: "28px",
                      backgroundColor: "#0a0a0a",
                      border: "1px solid rgba(198, 164, 95, 0.5)",
                      padding: "0 6px",
                      color: "#c6a45f",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                    }}
                  />
                  <span style={{ color: "#c6a45f" }}>-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    style={{
                      width: "75px",
                      height: "28px",
                      backgroundColor: "#0a0a0a",
                      border: "1px solid rgba(198, 164, 95, 0.5)",
                      padding: "0 6px",
                      color: "#c6a45f",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "10px",
                    }}
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={200}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#c6a45f" }}
                />
              </div>
            )}
          </div>
        </aside>

        {/* ── RIGHT PRODUCT GRID ── */}
        <div>
          {/* Toolbar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "24px",
              paddingBottom: "12px",
              borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#cccccc" }}>
              {loading ? (
                "Searching..."
              ) : (
                <>
                  Found <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "product" : "products"}
                </>
              )}
            </span>

            {/* Sort Dropdown */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Sort:
              </span>
              <LuxurySelect
                value={sortBy}
                onChange={(val) => setSortBy(val)}
                size="sm"
                style={{ minWidth: "160px" }}
                options={[
                  { value: "featured", label: "Featured" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "newest", label: "Newest Arrivals" },
                ]}
              />
            </div>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "#c6a45f" }}>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14px" }}>Loading luxury pieces...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 24px",
                backgroundColor: "rgba(255, 255, 255, 0.015)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "18px", color: "#ffffff", marginBottom: "8px" }}>
                No matching pieces found
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#888888", marginBottom: "20px" }}>
                Try adjusting your search terms or clearing selected filters.
              </p>
              <button
                onClick={resetFilters}
                style={{
                  backgroundColor: "#c6a45f",
                  color: "#000000",
                  border: "none",
                  padding: "10px 24px",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Reset All Filters
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
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="product-card"
                    style={{
                      backgroundColor: "#090909",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
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
                        <ImagePlaceholder height="100%" label={product.title} />
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
  );
}

export default function SearchPageClient() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", background: "#000" }} />}>
      <SearchContent />
    </Suspense>
  );
}
