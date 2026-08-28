"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import {
  BASE_NAV,
  FALLBACK_RINGS_MENU,
  FALLBACK_WEDDING_MENU,
  FALLBACK_JEWELLERY_MENU,
} from "@/lib/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { POPULAR_CURRENCIES } from "@/lib/currencyConfig";
import { adminApi, type AdminProduct } from "@/lib/api/admin";
import type { MegaMenuData, MegaMenuSection, MegaMenuImage, NavItem } from "@/types";

interface SearchSuggestionProduct {
  id: string | number;
  name: string;
  category?: string;
  price: number;
  href: string;
}

const PRODUCT_TYPES_NAV = [
  { keywords: ["ring", "engagement", "solitaire", "trilogy", "halo"], label: "Engagement Rings", href: "/rings" },
  { keywords: ["wedding", "band", "women", "men", "eternity"], label: "Wedding Rings & Bands", href: "/wedding/womens-plain" },
  { keywords: ["earring", "stud", "hoop", "drop", "pear"], label: "Diamond Earrings", href: "/earrings" },
  { keywords: ["necklace", "pendant", "chain", "loop"], label: "Necklaces & Pendants", href: "/necklaces" },
  { keywords: ["bracelet", "tennis", "bangle"], label: "Diamond Bracelets", href: "/bracelets" },
  { keywords: ["bespoke", "custom", "design"], label: "Bespoke Custom Jewellery", href: "/bespoke" },
];

const SAMPLE_SEARCH_CATALOG: SearchSuggestionProduct[] = [
  { id: "1", name: "Novaryn Yellow Cushion Cut Diamond Ring", category: "Trilogy Ring", price: 3045, href: "/product/1" },
  { id: "2", name: "Pear Shape Solitaire Stud Earrings", category: "Diamond Earrings", price: 370, href: "/product/2" },
  { id: "3", name: "Round Cut Four Claw Loop Pendant", category: "Diamond Pendant", price: 1020, href: "/product/3" },
  { id: "4", name: "Victoria 2.03ct Marquise Diamond Ring", category: "Engagement Ring", price: 2400, href: "/product/4" },
  { id: "5", name: "Emerald Cut Platinum Eternity Band", category: "Eternity Band", price: 1850, href: "/product/5" },
  { id: "wed-01", name: "Women's Classic Micro-Pave Diamond Wedding Band", category: "Wedding Band", price: 1250, href: "/wedding/womens-plain" },
  { id: "wed-05", name: "Men's Heavy Court Satin Finish Wedding Band", category: "Men's Wedding Ring", price: 980, href: "/wedding/mens-plain" },
  { id: "sample-1", name: "Bespoke Pear Cut Solitaire Ring in 18ct White Gold", category: "Bespoke Ring", price: 3450, href: "/product/sample-1" },
];

function CurrencySelector() {
  const { currency, symbol, flag, setCurrency, isLoaded } = useCurrency();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={wrapRef} className="currency-selector-wrap">
      <button className="currency-btn" onClick={() => setOpen((o) => !o)}>
        <span className="currency-option-flag">{isLoaded ? flag : "🇬🇧"}</span>
        <span style={{ marginLeft: 4 }}>
          {isLoaded ? `${currency} ${symbol}` : "GBP £"}
        </span>
        <ChevronDown size={10} style={{ marginLeft: 3, opacity: 0.6 }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="currency-dropdown"
          >
            {POPULAR_CURRENCIES.map((c) => (
              <button
                key={c.code}
                className={`currency-option${currency === c.code ? " active" : ""}`}
                onClick={() => {
                  setCurrency(c.code);
                  setOpen(false);
                }}
              >
                <span className="currency-option-flag">{c.flag}</span>
                <span className="currency-option-name">{c.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [visibleNav] = useState<NavItem[]>(BASE_NAV);
  
  // Search states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [backendSuggestions, setBackendSuggestions] = useState<SearchSuggestionProduct[]>([]);
  const [isSearchingBackend, setIsSearchingBackend] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { freeDeliveryThreshold, isLoaded, formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();
  const accountHref = isAuthenticated ? "/account" : "/login";

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  // Click outside search wrap to close suggestions & bar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch product suggestions from Django backend search endpoint
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setBackendSuggestions([]);
      return;
    }

    let cancelled = false;
    setIsSearchingBackend(true);

    const timer = setTimeout(() => {
      adminApi.getProducts({ search: query, limit: 5, status: "active" })
        .then((res) => {
          if (cancelled) return;

          const payload = res?.data as unknown;
          const productList = Array.isArray(payload)
            ? (payload as AdminProduct[])
            : ((payload as { results?: AdminProduct[]; data?: AdminProduct[] } | null)?.results ??
               (payload as { results?: AdminProduct[]; data?: AdminProduct[] } | null)?.data ??
               []);

          if (Array.isArray(productList) && productList.length > 0) {
            const mapped: SearchSuggestionProduct[] = productList.map((p: AdminProduct) => ({
              id: p.id,
              name: p.name,
              category: p.category || "Jewellery",
              price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
              href: `/product/${p.id}`,
            }));
            setBackendSuggestions(mapped);
          } else {
            setBackendSuggestions([]);
          }
        })
        .catch(() => {
          if (!cancelled) setBackendSuggestions([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearchingBackend(false);
        });
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rings?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Compute matching product types / category shortcuts
  const matchingTypes = searchQuery.trim()
    ? PRODUCT_TYPES_NAV.filter((type) =>
        type.keywords.some((kw) => kw.toLowerCase().includes(searchQuery.trim().toLowerCase())) ||
        type.label.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  // Combine backend results with static catalog fallback matching
  const matchingSampleProducts = searchQuery.trim()
    ? SAMPLE_SEARCH_CATALOG.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
          item.category?.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const displayedProducts =
    backendSuggestions.length > 0 ? backendSuggestions : matchingSampleProducts;

  const subcategories: Record<string, MegaMenuData> = {
    rings: FALLBACK_RINGS_MENU,
    wedding: FALLBACK_WEDDING_MENU,
    jewellery: FALLBACK_JEWELLERY_MENU,
  };

  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("gama_cart") || "[]");
        setCartCount(
          cart.reduce((sum: number, item: { quantity?: number }) => sum + (item.quantity || 1), 0)
        );
      } catch {
        setCartCount(0);
      }
    };
    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("cartUpdated", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  const handleMouseEnter = (idx: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(idx);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  };

  const annItems = [
    `✦  Free Delivery on Orders Over ${freeDeliveryThreshold}`,
    "✦  1 Year Warranty on All Pieces",
    "✦  0% APR Finance Available",
    "✦  30 Day Exchange Policy",
    "✦  Ethically Sourced Diamonds",
    "✦  Crafted with Precision & Love",
  ];
  const marqueeItems = [...annItems, ...annItems];
  const activeNavItem = activeMenu !== null ? visibleNav[activeMenu] : null;
  const activeSubs = activeNavItem ? subcategories[activeNavItem.key] : null;
  const isWeddingMenu = activeNavItem?.key === "wedding";

  const activeSubsSections: MegaMenuSection[] = activeSubs?.sections || [];
  const activeSubsImages: MegaMenuImage[] = activeSubs?.images || [];
  const hasMegaMenuContent =
    activeSubsSections.length > 0 || activeSubsImages.length > 0;

  return (
    <>
      {/* Announcement Bar */}
      <div className="ann-bar">
        <div className="ann-bar-track">
          <div className="ann-bar-inner animate-marquee">
            {marqueeItems.map((item, i) => (
              <span key={i} className="ann-bar-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`header-wrap${scrolled ? " scrolled" : ""}`}>
        <div className="header-container">
          <div className="header-inner">
            {/* Mobile hamburger menu button on far left */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Left – Currency Selector Dropdown */}
            <CurrencySelector />

            {/* Center – Logo */}
            <Link href="/" className="logo-link">
              <span className="logo-tagline">✦ GAMA ✦</span>
              <span className="logo-name">JEWELS</span>
              <div className="logo-underline"></div>
            </Link>

            {/* Right – Icons */}
            <div className="header-icons">
              {/* Search Container with Interactive Dropdown Suggestions */}
              <div
                ref={searchWrapRef}
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0, scaleX: 0.9 }}
                      animate={{ width: "min(360px, calc(100vw - 32px))", opacity: 1, scaleX: 1 }}
                      exit={{ width: 0, opacity: 0, scaleX: 0.9 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "-20px",
                        transformOrigin: "right center",
                        zIndex: 30,
                      }}
                    >
                      <form
                        onSubmit={handleSearchSubmit}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "rgba(10, 10, 10, 0.98)",
                          border: "1px solid #c6a45f",
                          borderRadius: "0px",
                          padding: "8px 12px",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.8)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Search size={16} style={{ color: "#c6a45f", flexShrink: 0 }} />
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search engagement rings, diamonds..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          style={{
                            width: "100%",
                            background: "transparent",
                            border: "none",
                            outline: "none",
                            color: "#ffffff",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "12px",
                          }}
                        />
                        {isSearchingBackend && (
                          <Loader2 size={14} className="animate-spin" style={{ color: "#c6a45f" }} />
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#8a8a8a",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            padding: "2px",
                            transition: "color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#c6a45f")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#8a8a8a")}
                        >
                          <X size={16} />
                        </button>
                      </form>

                      {/* Live Suggestions Dropdown Box right below Search Bar */}
                      {searchQuery.trim().length >= 1 && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18 }}
                          style={{
                            position: "absolute",
                            top: "42px",
                            right: 0,
                            width: "min(360px, calc(100vw - 32px))",
                            background: "rgba(12, 12, 12, 0.98)",
                            border: "1px solid rgba(198, 164, 95, 0.4)",
                            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.9)",
                            zIndex: 40,
                            padding: "14px",
                            backdropFilter: "blur(12px)",
                          }}
                        >
                          {/* Suggested Category / Type Links */}
                          {matchingTypes.length > 0 && (
                            <div style={{ marginBottom: "14px" }}>
                              <div
                                style={{
                                  fontSize: "9.5px",
                                  fontWeight: "700",
                                  color: "#c6a45f",
                                  letterSpacing: "1.5px",
                                  textTransform: "uppercase",
                                  marginBottom: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px",
                                }}
                              >
                                <Sparkles size={11} /> Suggested Categories
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                {matchingTypes.map((type, idx) => (
                                  <Link
                                    key={idx}
                                    href={type.href}
                                    onClick={() => {
                                      setSearchOpen(false);
                                      setSearchQuery("");
                                    }}
                                    style={{
                                      fontSize: "11px",
                                      color: "#ffffff",
                                      background: "rgba(198, 164, 95, 0.12)",
                                      border: "1px solid rgba(198, 164, 95, 0.3)",
                                      padding: "4px 10px",
                                      textDecoration: "none",
                                      fontFamily: "'Poppins', sans-serif",
                                      transition: "all 0.2s",
                                    }}
                                  >
                                    {type.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Matching Products Suggestions */}
                          <div>
                            <div
                              style={{
                                fontSize: "9.5px",
                                fontWeight: "700",
                                color: "#8a8a8a",
                                letterSpacing: "1.5px",
                                textTransform: "uppercase",
                                marginBottom: "8px",
                              }}
                            >
                              Matching Products ({displayedProducts.length})
                            </div>

                            {displayedProducts.length === 0 ? (
                              <div style={{ fontSize: "11px", color: "#777777", padding: "8px 0" }}>
                                No direct product matches for &quot;{searchQuery}&quot;. Press Enter to view all listings.
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {displayedProducts.slice(0, 4).map((product) => (
                                  <Link
                                    key={product.id}
                                    href={product.href}
                                    onClick={() => {
                                      setSearchOpen(false);
                                      setSearchQuery("");
                                    }}
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      padding: "6px 8px",
                                      background: "rgba(255, 255, 255, 0.03)",
                                      border: "1px solid rgba(255, 255, 255, 0.06)",
                                      textDecoration: "none",
                                      transition: "background 0.2s",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(198, 164, 95, 0.15)")}
                                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)")}
                                  >
                                    <div>
                                      <div
                                        style={{
                                          fontFamily: "'Playfair Display', serif",
                                          fontSize: "12px",
                                          color: "#ffffff",
                                          lineHeight: "1.3",
                                          maxHeight: "2.6em",
                                          overflow: "hidden",
                                        }}
                                      >
                                        {product.name}
                                      </div>
                                      {product.category && (
                                        <div style={{ fontSize: "10px", color: "#8a8a8a", marginTop: "2px" }}>
                                          {product.category}
                                        </div>
                                      )}
                                    </div>
                                    <div
                                      style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        color: "#c6a45f",
                                        marginLeft: "12px",
                                        flexShrink: 0,
                                      }}
                                    >
                                      {formatPrice(product.price)}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Submit / View All Button */}
                          <button
                            onClick={handleSearchSubmit}
                            style={{
                              width: "100%",
                              marginTop: "12px",
                              padding: "8px",
                              background: "#c6a45f",
                              color: "#000000",
                              border: "none",
                              fontFamily: "'Poppins', sans-serif",
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
                            View All Search Results <ArrowRight size={12} />
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  className="header-icon-btn hide-mobile"
                  aria-label="Search"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>
              </div>

              <Link
                href={accountHref}
                className="header-icon-btn hide-mobile"
                aria-label={isAuthenticated ? "Account" : "Sign in"}
              >
                <User size={18} strokeWidth={1.5} />
              </Link>
              <Link href="/cart" className="header-icon-btn" aria-label="Cart">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="nav-desktop">
          <div style={{ width: "100%" }}>
            <ul className="nav-list">
              {visibleNav.map((item, idx) => (
                <li
                  key={idx}
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={handleMouseLeave}
                  className="nav-item"
                >
                    <Link
                      href={item.href}
                      className={`nav-link nav-item-link${
                        activeMenu === idx ? " active" : ""
                      }`}
                    >
                      {item.title}
                    </Link>

                  </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Mega / Dropdown Menu */}
        <AnimatePresence>
          {activeMenu !== null &&
            activeNavItem &&
            ["rings", "wedding", "jewellery"].includes(activeNavItem.key) &&
            hasMegaMenuContent && (
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                }}
                onMouseLeave={handleMouseLeave}
                className={`mega-menu${isWeddingMenu ? " mega-menu-wedding" : ""}`}
              >
                <div className="mega-inner">
                  {activeSubsImages.length > 0 && isWeddingMenu ? (
                    <div className="mega-grid mega-wedding-rings">
                      <div className="mega-sections-wrapper">
                        {activeSubsSections.map((section, sectionIdx) => (
                          <div key={sectionIdx} className="mega-section">
                            <h4 className="mega-section-heading mega-section-heading-wedding">
                              {section.heading}
                            </h4>
                            <ul className="mega-links">
                              {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setActiveMenu(null)}
                                    className="mega-link-item mega-link-item-wedding"
                                  >
                                    <span className="mega-link-line"></span>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mega-images-wedding">
                        {activeSubsImages.map((img, idx) => (
                          <Link
                            key={idx}
                            href={img.href || activeNavItem.href}
                            onClick={() => setActiveMenu(null)}
                            className="mega-img-link mega-img-link-wedding"
                          >
                            <div className="mega-img-wrap mega-img-wrap-wedding">
                              <img src={img.src} alt={img.caption} />
                            </div>
                            <div className="mega-img-caption mega-img-caption-wedding">
                              {img.caption}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : activeSubsImages.length > 0 ? (
                    <div className="mega-grid mega-engagement-rings">
                      <div className="mega-sections-wrapper">
                        {activeSubsSections.map((section, sectionIdx) => (
                          <div key={sectionIdx} className="mega-section">
                            <h4 className="mega-section-heading">
                              {section.heading}
                            </h4>
                            <ul className="mega-links">
                              {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <Link
                                    href={item.href}
                                    onClick={() => setActiveMenu(null)}
                                    className="mega-link-item"
                                  >
                                    <span className="mega-link-line"></span>
                                    {item.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mega-images-engagement">
                        {activeSubsImages.map((img, idx) => (
                          <div key={idx} className="mega-img-link">
                            <div className="mega-img-wrap">
                              <img src={img.src} alt={img.caption} />
                              <div className="mega-img-overlay" />
                              <div className="mega-img-caption">
                                {img.caption}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mobile-menu"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="mobile-close-btn"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>

              <div className="mobile-logo">✦ GAMA JEWELS ✦</div>

              <div className="mobile-nav">
                {visibleNav.map((item, idx) => {
                  const rawSubs = subcategories[item.key];
                  const mobileLinks = rawSubs
                    ? rawSubs.sections.flatMap((sec) => sec.items)
                    : [];
                  const hasMobileSubs = mobileLinks.length > 0;

                  return (
                    <div key={idx} className="mobile-nav-item">
                      <button
                        onClick={() =>
                          setMobileExpanded(mobileExpanded === idx ? null : idx)
                        }
                        className="mobile-nav-btn"
                      >
                        {item.title}
                        {hasMobileSubs && (
                          <ChevronDown
                            size={14}
                            className={`mobile-nav-chevron${
                              mobileExpanded === idx ? " open" : ""
                            }`}
                          />
                        )}
                      </button>
                      <AnimatePresence>
                        {mobileExpanded === idx && hasMobileSubs && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="mobile-sub"
                          >
                            <div className="mobile-sub-inner">
                              <div>
                                <div className="mobile-sub-heading">
                                  Shop by Style
                                </div>
                                <Link
                                  href={item.href}
                                  onClick={() => setMobileOpen(false)}
                                  className="mobile-sub-link"
                                >
                                  All {item.title}
                                </Link>
                                {mobileLinks.map((sub, i) => (
                                  <Link
                                    key={i}
                                    href={sub.href || "#"}
                                    onClick={() => setMobileOpen(false)}
                                    className="mobile-sub-link"
                                  >
                                    {sub.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              <div className="mobile-bottom">
                <Link
                  href={accountHref}
                  onClick={() => setMobileOpen(false)}
                  className="mobile-bottom-link"
                >
                  <User size={16} /> {isAuthenticated ? "My Account" : "Customer Account"}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="mobile-bottom-link"
                >
                  <ShoppingBag size={16} /> Cart{" "}
                  {cartCount > 0 && (
                    <span style={{ color: "#c6a45f" }}>({cartCount})</span>
                  )}
                </Link>
                <div
                  className="mobile-bottom-link"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                >
                  <Search size={16} /> Search
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {mobileOpen && (
          <div
            onClick={() => setMobileOpen(false)}
            className="mobile-backdrop"
          />
        )}
      </header>
    </>
  );
}
