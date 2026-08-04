"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import {
  BASE_NAV,
  FALLBACK_RINGS_MENU,
  FALLBACK_WEDDING_MENU,
  FALLBACK_JEWELLERY_MENU,
} from "@/lib/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { POPULAR_CURRENCIES } from "@/lib/currencyConfig";
import type { MegaMenuData, MegaMenuSection, MegaMenuImage, NavItem } from "@/types";

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { freeDeliveryThreshold, isLoaded } = useCurrency();
  const { isAuthenticated } = useAuth();
  const accountHref = isAuthenticated ? "/account" : "/login";

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/rings?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

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
    `✦  Free Delivery on Orders Over ${isLoaded ? freeDeliveryThreshold : "₹40,000"}`,
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
            {/* Left – Currency Selector Dropdown */}
            <CurrencySelector />

            {/* Mobile hamburger */}
            <button
              className="mobile-toggle-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Center – Logo */}
            <Link href="/" className="logo-link">
              <span className="logo-tagline">✦ GAMA ✦</span>
              <span className="logo-name">DIAMOND</span>
              <div className="logo-underline"></div>
            </Link>

            {/* Right – Icons */}
            <div className="header-icons">
              {/* Search Container with Slide-Left Input */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <AnimatePresence>
                  {searchOpen && (
                    <motion.form
                      initial={{ width: 0, opacity: 0, scaleX: 0.9 }}
                      animate={{ width: "260px", opacity: 1, scaleX: 1 }}
                      exit={{ width: 0, opacity: 0, scaleX: 0.9 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      onSubmit={handleSearchSubmit}
                      style={{
                        position: "absolute",
                        right: "0",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "rgba(10, 10, 10, 0.98)",
                        border: "1px solid #c6a45f",
                        borderRadius: "0px",
                        padding: "6px 12px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.6)",
                        transformOrigin: "right center",
                        whiteSpace: "nowrap",
                        zIndex: 20,
                        overflow: "hidden",
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
                    </motion.form>
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
                <Fragment key={idx}>
                  {item.key === "creator" && (
                    <li className="nav-break" aria-hidden="true" />
                  )}
                  <li
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
                </Fragment>
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

              <div className="mobile-logo">✦ GAMA DIAMOND ✦</div>

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
