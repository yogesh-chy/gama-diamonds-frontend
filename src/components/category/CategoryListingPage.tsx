"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, RotateCcw, ChevronDown, SlidersHorizontal, Grid, LayoutGrid, Eye, ShoppingBag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CertificationBar from "@/components/landing/CertificationBar";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { productsApi } from "@/lib/api/products";
import { cartApi } from "@/lib/api/orders";
import { toast } from "sonner";

export interface CategoryProduct {
  id: string;
  title: string;
  category: string;
  style: string;
  metal: string;
  gemstone: string;
  price: number; // in GBP
  image?: string;
  badge?: "NEXT DAY" | "BESTSELLER" | "POPULAR" | "NEW" | "EXCLUSIVE";
  inStock: boolean;
  carat?: string;
}

interface CategoryListingPageProps {
  categoryTitle: string;
  categoryKey: string; // e.g. "eternity", "earrings", "necklace", "bracelets"
  description: string;
  breadcrumbs: { label: string; href: string }[];
  styleOptions: string[];
  products: CategoryProduct[];
  heroImage?: string;
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

const GEMSTONES_LIST = [
  "White Diamond",
  "Sapphire Blue",
  "Emerald Green",
  "Ruby Red",
  "Aquamarine",
  "Amethyst",
];

export default function CategoryListingPage({
  categoryTitle,
  categoryKey,
  description,
  breadcrumbs,
  styleOptions,
  products: initialProducts,
  heroImage,
}: CategoryListingPageProps) {
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();

  const [productList, setProductList] = useState<CategoryProduct[]>(initialProducts);

  // Fetch real products from backend for this category
  useEffect(() => {
    let cancelled = false;
    productsApi
      .getProducts({ category: categoryKey, status: "active" })
      .then((res) => {
        if (cancelled || !res.data?.data) return;
        const apiData = res.data.data;
        if (Array.isArray(apiData) && apiData.length > 0) {
          const mapped: CategoryProduct[] = apiData.map((p) => ({
            id: String(p.id),
            title: p.name,
            category: p.category || categoryTitle,
            style: p.diamond_cut || p.earring_type || p.necklace_style || p.bracelet_type || "Classic",
            metal: p.metal_type || "18ct White Gold",
            gemstone: "White Diamond",
            price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
            image: p.images && p.images.length > 0 ? p.images[0].url : undefined,
            badge: p.is_featured ? "EXCLUSIVE" : "NEXT DAY",
            inStock: p.total_stock > 0 || (p.totalStock ?? 0) > 0,
            carat: String(p.diamond_spec?.carat_weight || p.diamond_spec?.caratWeight || ""),
          }));
          setProductList(mapped);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [categoryKey, categoryTitle]);

  // Filter States
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [selectedGemstones, setSelectedGemstones] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  // Toggle Handlers
  const toggleMetal = (m: string) => {
    setSelectedMetals((prev) =>
      prev.includes(m) ? prev.filter((item) => item !== m) : [...prev, m]
    );
  };

  const toggleGemstone = (g: string) => {
    setSelectedGemstones((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const toggleStyle = (s: string) => {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const resetFilters = () => {
    setSelectedMetals([]);
    setSelectedGemstones([]);
    setSelectedStyles([]);
    setInStockOnly(false);
    setPriceRange("all");
    setSortBy("featured");
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    if (selectedMetals.length > 0) {
      result = result.filter((p) => selectedMetals.includes(p.metal));
    }

    if (selectedGemstones.length > 0) {
      result = result.filter((p) =>
        selectedGemstones.some((g) => p.gemstone.toLowerCase().includes(g.toLowerCase()))
      );
    }

    if (selectedStyles.length > 0) {
      result = result.filter((p) =>
        selectedStyles.some((s) => p.style.toLowerCase() === s.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    if (priceRange === "under-1500") {
      result = result.filter((p) => p.price < 1500);
    } else if (priceRange === "1500-3000") {
      result = result.filter((p) => p.price >= 1500 && p.price <= 3000);
    } else if (priceRange === "3000-5000") {
      result = result.filter((p) => p.price > 3000 && p.price <= 5000);
    } else if (priceRange === "above-5000") {
      result = result.filter((p) => p.price > 5000);
    }

    // Sort Logic
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [productList, selectedMetals, selectedGemstones, selectedStyles, inStockOnly, priceRange, sortBy]);

  const activeFiltersCount =
    selectedMetals.length +
    selectedGemstones.length +
    selectedStyles.length +
    (inStockOnly ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0);

  const handleAddToCart = async (product: CategoryProduct) => {
    try {
      const numericId = !isNaN(Number(product.id)) ? Number(product.id) : null;
      if (isAuthenticated && numericId) {
        let variantId: number | undefined;
        try {
          const resolved = await productsApi.resolveVariant(String(numericId), {});
          variantId = resolved.data.variant_id || resolved.data.id;
        } catch {
          // Products without variants use the product-level cart path.
        }
        await cartApi.addItem(numericId, "", 1, variantId);
      }
      const existingCart = JSON.parse(localStorage.getItem("gama_cart") || "[]");
      existingCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        metal: product.metal,
        quantity: 1,
      });
      localStorage.setItem("gama_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.title} added to cart`);
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Hero / Header Section */}
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "40px 0 32px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", gap: "8px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888", marginBottom: "16px" }}>
            {breadcrumbs.map((b, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Link href={b.href} style={{ color: i === breadcrumbs.length - 1 ? "#c6a45f" : "#888888" }}>
                  {b.label}
                </Link>
                {i < breadcrumbs.length - 1 && <span>/</span>}
              </span>
            ))}
          </nav>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "24px" }}>
            <div>
              <span className="section-label">✦ Fine Jewellery Collection</span>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "36px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  color: "#ffffff",
                  marginTop: "6px",
                  textTransform: "uppercase",
                }}
              >
                {categoryTitle}
              </h1>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  color: "#a0a0a0",
                  maxWidth: "720px",
                  marginTop: "8px",
                  lineHeight: "1.6",
                }}
              >
                {description}
              </p>
            </div>

            {/* Quick Badge / Info pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                background: "rgba(198,164,95,0.06)",
                border: "1px solid rgba(198,164,95,0.25)",
                padding: "12px 20px",
                borderRadius: "4px",
              }}
            >
              <div style={{ color: "#c6a45f", fontFamily: "'Playfair Display', serif", fontSize: "20px", fontWeight: "700" }}>
                {filteredProducts.length}
              </div>
              <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#d0d0d0" }}>
                Exclusive Designs Available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Top Control Bar */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            paddingBottom: "24px",
            marginBottom: "32px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Left: Mobile Filter Toggle & Count */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#111111",
                border: "1px solid rgba(198,164,95,0.3)",
                color: "#c6a45f",
                padding: "10px 18px",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={14} />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            <span style={{ fontSize: "12px", color: "#888888" }}>
              Showing <strong style={{ color: "#ffffff" }}>{filteredProducts.length}</strong> of {productList.length} Products
            </span>
          </div>

          {/* Right: Grid Layout Toggle & Sort */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Column Selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "#111111", padding: "4px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <button
                onClick={() => setGridCols(3)}
                style={{
                  background: gridCols === 3 ? "#c6a45f" : "transparent",
                  color: gridCols === 3 ? "#000000" : "#888888",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                }}
                title="3 Columns"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setGridCols(4)}
                style={{
                  background: gridCols === 4 ? "#c6a45f" : "transparent",
                  color: gridCols === 4 ? "#000000" : "#888888",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                }}
                title="4 Columns"
              >
                <LayoutGrid size={16} />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888" }}>Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: "#111111",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "8px 14px",
                  fontSize: "11px",
                  letterSpacing: "1px",
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <option value="featured">Featured Collection</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="title">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Layout Grid: Left Sidebar + Product Grid */}
        <div style={{ display: "grid", gridTemplateColumns: showMobileFilters ? "1fr" : "280px 1fr", gap: "40px" }}>
          {/* Left Sidebar Filters */}
          <aside
            style={{
              display: showMobileFilters ? "block" : "block",
              background: "#080808",
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "24px",
              height: "fit-content",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(198,164,95,0.2)" }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", fontWeight: "700", letterSpacing: "1.5px", color: "#c6a45f", textTransform: "uppercase" }}>
                Refine Selection
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#888888",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <RotateCcw size={10} /> Reset
                </button>
              )}
            </div>

            {/* Filter Section: Styles */}
            {styleOptions.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h4 style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff", marginBottom: "14px", fontWeight: "600" }}>
                  Style / Subcategory
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {styleOptions.map((style) => {
                    const isChecked = selectedStyles.includes(style);
                    return (
                      <label
                        key={style}
                        onClick={() => toggleStyle(style)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          fontSize: "12px",
                          color: isChecked ? "#c6a45f" : "#b0b0b0",
                          cursor: "pointer",
                          transition: "color 0.2s",
                        }}
                      >
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.2)",
                            background: isChecked ? "#c6a45f" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "2px",
                          }}
                        >
                          {isChecked && <Check size={12} color="#000000" strokeWidth={3} />}
                        </div>
                        {style}
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Filter Section: Metal */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff", marginBottom: "14px", fontWeight: "600" }}>
                Precious Metal
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {METALS_LIST.map((metal) => {
                  const isChecked = selectedMetals.includes(metal);
                  return (
                    <label
                      key={metal}
                      onClick={() => toggleMetal(metal)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "12px",
                        color: isChecked ? "#c6a45f" : "#b0b0b0",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.2)",
                          background: isChecked ? "#c6a45f" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "2px",
                        }}
                      >
                        {isChecked && <Check size={12} color="#000000" strokeWidth={3} />}
                      </div>
                      {metal}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Section: Gemstone */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff", marginBottom: "14px", fontWeight: "600" }}>
                Gemstone / Color
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {GEMSTONES_LIST.map((gem) => {
                  const isChecked = selectedGemstones.includes(gem);
                  return (
                    <label
                      key={gem}
                      onClick={() => toggleGemstone(gem)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "12px",
                        color: isChecked ? "#c6a45f" : "#b0b0b0",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          border: isChecked ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.2)",
                          background: isChecked ? "#c6a45f" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "2px",
                        }}
                      >
                        {isChecked && <Check size={12} color="#000000" strokeWidth={3} />}
                      </div>
                      {gem}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filter Section: Price Range */}
            <div style={{ marginBottom: "28px" }}>
              <h4 style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#ffffff", marginBottom: "14px", fontWeight: "600" }}>
                Price Range
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { id: "all", label: "All Prices" },
                  { id: "under-1500", label: `Under ${formatPrice(1500)}` },
                  { id: "1500-3000", label: `${formatPrice(1500)} – ${formatPrice(3000)}` },
                  { id: "3000-5000", label: `${formatPrice(3000)} – ${formatPrice(5000)}` },
                  { id: "above-5000", label: `Over ${formatPrice(5000)}` },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    onClick={() => setPriceRange(opt.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "12px",
                      color: priceRange === opt.id ? "#c6a45f" : "#b0b0b0",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        border: priceRange === opt.id ? "2px solid #c6a45f" : "1px solid rgba(255,255,255,0.3)",
                        background: priceRange === opt.id ? "#c6a45f" : "transparent",
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Section: Stock status */}
            <div>
              <label
                onClick={() => setInStockOnly(!inStockOnly)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "12px",
                  color: inStockOnly ? "#c6a45f" : "#b0b0b0",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: inStockOnly ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.2)",
                    background: inStockOnly ? "#c6a45f" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "2px",
                  }}
                >
                  {inStockOnly && <Check size={12} color="#000000" strokeWidth={3} />}
                </div>
                In Stock / Ready to Ship
              </label>
            </div>
          </aside>

          {/* Product Grid Container */}
          <div>
            {filteredProducts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 24px",
                  background: "#080808",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "22px", color: "#c6a45f", marginBottom: "12px" }}>
                  No Products Match Your Filter
                </h3>
                <p style={{ fontSize: "13px", color: "#a0a0a0", marginBottom: "24px" }}>
                  Try resetting your search filters or browse our complete collection.
                </p>
                <button onClick={resetFilters} className="btn-gold" style={{ padding: "12px 28px", fontSize: "11px" }}>
                  Reset Filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                  gap: "24px",
                }}
              >
                {filteredProducts.map((product) => {
                  const isHovered = hoveredProductId === product.id;
                  return (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onMouseEnter={() => setHoveredProductId(product.id)}
                        onMouseLeave={() => setHoveredProductId(null)}
                        style={{
                          background: "#0a0a0a",
                          border: isHovered ? "1px solid rgba(198,164,95,0.5)" : "1px solid rgba(255,255,255,0.07)",
                          boxShadow: isHovered ? "0 12px 30px rgba(0,0,0,0.8)" : "none",
                          transition: "all 0.3s ease",
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {/* Image container */}
                        <div
                          style={{
                            position: "relative",
                            aspectRatio: "1/1",
                            width: "100%",
                            background: "#141414",
                            overflow: "hidden",
                          }}
                        >
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.title}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform 0.5s ease",
                                transform: isHovered ? "scale(1.08)" : "scale(1)",
                              }}
                            />
                          ) : (
                            <ImagePlaceholder label={product.category} height="100%" />
                          )}

                          {/* Badge */}
                          {product.badge && (
                            <span
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                background: "#c6a45f",
                                color: "#000000",
                                fontSize: "9px",
                                fontWeight: "700",
                                letterSpacing: "1.5px",
                                padding: "4px 8px",
                                textTransform: "uppercase",
                                borderRadius: "2px",
                                zIndex: 2,
                              }}
                            >
                              {product.badge}
                            </span>
                          )}

                          {/* Quick action overlay */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                  position: "absolute",
                                  bottom: "12px",
                                  left: "12px",
                                  right: "12px",
                                  display: "flex",
                                  gap: "8px",
                                  zIndex: 3,
                                }}
                              >
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleAddToCart(product);
                                  }}
                                  style={{
                                    flex: 1,
                                    background: "#c6a45f",
                                    color: "#000000",
                                    border: "none",
                                    padding: "10px",
                                    fontSize: "10px",
                                    fontWeight: "700",
                                    letterSpacing: "1.5px",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "6px",
                                  }}
                                >
                                  <ShoppingBag size={12} /> Add to Cart
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Product details */}
                        <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                          <div>
                            <div
                              style={{
                                fontSize: "9px",
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                color: "#c6a45f",
                                marginBottom: "6px",
                                fontWeight: "600",
                              }}
                            >
                              {product.metal} {product.carat ? `• ${product.carat}` : ""}
                            </div>

                            <h3
                              style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#ffffff",
                                lineHeight: "1.5",
                                marginBottom: "12px",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                height: "36px",
                              }}
                            >
                              {product.title}
                            </h3>
                          </div>

                          <div>
                            <div
                              style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: "17px",
                                fontWeight: "700",
                                color: "#c6a45f",
                                letterSpacing: "0.5px",
                              }}
                            >
                              {formatPrice(product.price)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hatton Garden Craftsmanship Callout */}
      <section
        style={{
          background: "linear-gradient(180deg, #050505 0%, #0c0b08 100%)",
          borderTop: "1px solid rgba(198,164,95,0.2)",
          padding: "64px 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <span className="section-label">✦ Master Goldsmiths</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "28px", color: "#ffffff", margin: "8px 0 16px", textTransform: "uppercase" }}>
            Master Craftsmanship & Ethics
          </h2>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#a0a0a0", maxWidth: "800px", margin: "0 auto 32px", lineHeight: "1.8" }}>
            Every piece in our {categoryTitle.toLowerCase()} collection is meticulously designed and set by master craftspeople in Mumbai. We select only ethically sourced natural diamonds and certified lab-grown diamonds of exceptional cut and clarity.
          </p>
          <div className="section-divider" />
        </div>
      </section>

      <CertificationBar />
      <Footer />
    </div>
  );
}
