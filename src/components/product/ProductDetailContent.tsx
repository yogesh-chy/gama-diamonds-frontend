"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Shield,
  Truck,
  Award,
  RefreshCw,
  MessageSquare,
  Mail,
  Calendar,
  ChevronDown,
  ShoppingBag,
  Play,
  Heart,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CertificationBar from "@/components/landing/CertificationBar";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";

interface ProductDetailProps {
  productId: string;
}

// Helper to generate dynamic product data based on productId / slug
function getDynamicProduct(id: string) {
  const normalized = id.toLowerCase();
  
  let category = "Engagement Ring";
  let defaultTitle = `"MARGELLES" 0.50 CARAT ROUND CUT NATURAL DIAMOND SOLITAIRE ENGAGEMENT RING`;
  let defaultPrice = 1850;
  let metal = "18ct Yellow Gold";
  let carat = "0.50ct";
  let shape = "Round Cut";
  let clarity = "VS1";
  let color = "F Color";
  let certification = "GIA Certified";

  if (normalized.includes("er") || normalized.includes("earring")) {
    category = "Earrings";
    defaultTitle = "ROUND CUT SAPPHIRE & DIAMOND DROP EARRINGS IN 18CT WHITE GOLD";
    defaultPrice = 1850;
    metal = "18ct White Gold";
    carat = "1.50ct";
    shape = "Round Cut";
  } else if (normalized.includes("et") || normalized.includes("eternity")) {
    category = "Eternity Ring";
    defaultTitle = "ROUND BRILLIANT FULL ETERNITY DIAMOND RING IN 18CT WHITE GOLD";
    defaultPrice = 3450;
    metal = "18ct White Gold";
    carat = "2.00ct";
    shape = "Round Cut";
  } else if (normalized.includes("nk") || normalized.includes("necklace")) {
    category = "Necklace";
    defaultTitle = "ROUND BRILLIANT DIAMOND SOLITAIRE PENDANT IN 18CT WHITE GOLD";
    defaultPrice = 1650;
    metal = "18ct White Gold";
    carat = "0.75ct";
    shape = "Round Cut";
  } else if (normalized.includes("br") || normalized.includes("bracelet")) {
    category = "Bracelet";
    defaultTitle = "ROUND CUT DIAMOND TENNIS BRACELET IN 18CT WHITE GOLD";
    defaultPrice = 4850;
    metal = "18ct White Gold";
    carat = "4.00ct";
    shape = "Round Cut";
  }

  // Clean title display
  const title = defaultTitle;

  return {
    id,
    title,
    category,
    price: defaultPrice,
    sku: `AD${id.toUpperCase().replace(/[^A-Z0-9]/g, "")}3275`,
    metal,
    carat,
    shape,
    clarity,
    color,
    certification,
    badge: "NEXT DAY DELIVERY",
    rating: 5.0,
    reviewCount: 1240,
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&h=800&fit=crop",
    ],
  };
}

export default function ProductDetailContent({ productId }: ProductDetailProps) {
  const product = getDynamicProduct(productId);
  const { formatPrice } = useCurrency();

  // Component States
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedMetal, setSelectedMetal] = useState(product.metal);
  const [selectedDeposit, setSelectedDeposit] = useState("Full Payment");
  const [quantity, setQuantity] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeTab, setActiveTab] = useState<"spec" | "shipping" | "warranty">("spec");
  const [specOpen, setSpecOpen] = useState(true);

  const handleAddToCart = () => {
    try {
      const existingCart = JSON.parse(localStorage.getItem("gama_cart") || "[]");
      existingCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        metal: selectedMetal,
        size: selectedSize,
        quantity,
      });
      localStorage.setItem("gama_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.title} added to cart!`);
    } catch {
      toast.error("Failed to add product to cart");
    }
  };

  const relatedProducts = [
    {
      id: "rel-1",
      title: 'ROUND CUT SOLITAIRE ENGAGEMENT RING IN 18CT WHITE GOLD',
      price: 1650,
      badge: "NEXT DAY",
    },
    {
      id: "rel-2",
      title: 'OVAL CUT HALO DIAMOND RING IN 18CT YELLOW GOLD',
      price: 2450,
      badge: "BESTSELLER",
    },
    {
      id: "rel-3",
      title: 'CUSHION CUT TRILOGY THREE STONE RING IN PLATINUM',
      price: 3200,
      badge: "POPULAR",
    },
    {
      id: "rel-4",
      title: 'PEAR CUT VINTAGE DIAMOND RING IN 18CT ROSE GOLD',
      price: 2150,
      badge: "NEW",
    },
  ];

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Main Product Details Section */}
      <section style={{ maxWidth: "1400px", margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Breadcrumb */}
        <nav style={{ display: "flex", gap: "8px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888", marginBottom: "28px" }}>
          <Link href="/" style={{ color: "#888888" }}>Home</Link>
          <span>/</span>
          <Link href={`/${product.category.toLowerCase().replace(" ", "s")}`} style={{ color: "#888888" }}>
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: "#c6a45f" }}>{product.title}</span>
        </nav>

        {/* 2-Column Main Layout: Left Media Gallery & Right Product Panel */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 520px",
            gap: "48px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT SIDE: MEDIA GALLERY ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* ROW 1: 2 Images Side-by-Side (2 Columns Grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Image 1 with Badge */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  backgroundColor: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                {product.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      zIndex: 3,
                      backgroundColor: "#c6a45f",
                      color: "#000000",
                      fontSize: "9px",
                      fontWeight: "700",
                      letterSpacing: "1.5px",
                      padding: "4px 10px",
                      textTransform: "uppercase",
                    }}
                  >
                    {product.badge}
                  </span>
                )}
                <img
                  src={product.images[0]}
                  alt={`${product.title} view 1`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Image 2 */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  backgroundColor: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.images[1]}
                  alt={`${product.title} view 2`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>

            {/* ROW 2: VIDEO PLACEHOLDER (Spanning Full Width in Row 2) */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "380px",
                backgroundColor: "#0d0d0d",
                border: "1px solid rgba(198, 164, 95, 0.4)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                padding: "24px",
              }}
            >
              {!isPlayingVideo ? (
                <>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${product.images[2]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(2px)",
                      opacity: 0.6,
                    }}
                  />
                  <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <button
                      onClick={() => setIsPlayingVideo(true)}
                      style={{
                        width: "68px",
                        height: "68px",
                        borderRadius: "50%",
                        backgroundColor: "#c6a45f",
                        color: "#000000",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        boxShadow: "0 0 30px rgba(198, 164, 95, 0.6)",
                        marginBottom: "16px",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <Play size={28} fill="#000000" style={{ marginLeft: "4px" }} />
                    </button>
                    <span
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "16px",
                        fontWeight: "700",
                        letterSpacing: "2px",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        marginBottom: "6px",
                      }}
                    >
                      360° HD Video Showcase
                    </span>
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        letterSpacing: "1px",
                        color: "#c6a45f",
                        textTransform: "uppercase",
                      }}
                    >
                      Click to inspect diamond brilliance & setting details
                    </span>
                  </div>
                </>
              ) : (
                <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                  <Sparkles size={40} color="#c6a45f" style={{ marginBottom: "12px", animation: "spin 10s linear infinite" }} />
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#ffffff" }}>
                    Playing 360° Interactive Video Stream...
                  </p>
                  <button
                    onClick={() => setIsPlayingVideo(false)}
                    style={{
                      marginTop: "16px",
                      background: "none",
                      border: "1px solid #c6a45f",
                      color: "#c6a45f",
                      padding: "6px 16px",
                      fontSize: "10px",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    Close Video
                  </button>
                </div>
              )}
            </div>

            {/* ROW 3: Additional Detail Images (2-Column Grid) */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  backgroundColor: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.images[2]}
                  alt={`${product.title} detail view 3`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  position: "relative",
                  aspectRatio: "1/1",
                  backgroundColor: "#141414",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.images[3]}
                  alt={`${product.title} detail view 4`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDE: PRODUCT SPECS & PURCHASE PANEL ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Trustpilot / Google Reviews Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", fontWeight: "700", color: "#ffffff" }}>
                Excellent
              </span>
              <div style={{ display: "flex", gap: "2px", color: "#c6a45f" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#c6a45f" stroke="none" />
                ))}
              </div>
              <span style={{ fontSize: "11px", color: "#888888" }}>
                5.0 out of 5 based on <strong>{product.reviewCount}</strong> reviews
              </span>
            </div>

            {/* Product Title & SKU */}
            <div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  color: "#ffffff",
                  lineHeight: "1.4",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                }}
              >
                {product.title}
              </h1>
              <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#888888" }}>
                SKU: {product.sku}
              </div>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "#c6a45f",
                  letterSpacing: "1px",
                }}
              >
                {formatPrice(product.price)}
              </span>
              <span style={{ fontSize: "11px", color: "#888888" }}>
                (Includes UK VAT & Fully Insured Express Shipping)
              </span>
            </div>

            {/* Selector 1: Size */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#c6a45f",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Select Size:
              </label>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  backgroundColor: "#0d0d0d",
                  border: "1px solid rgba(198, 164, 95, 0.4)",
                  color: "#ffffff",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  padding: "0 16px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S"].map((size) => (
                  <option key={size} value={size} style={{ background: "#0c0c0c" }}>
                    UK Ring Size {size} (Standard Delivery)
                  </option>
                ))}
              </select>
            </div>

            {/* Selector 2: Deposit / Payment Option */}
            <div>
              <label
                style={{
                  display: "block",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11px",
                  fontWeight: "600",
                  color: "#c6a45f",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Deposit / Metal Choice:
              </label>
              <select
                value={selectedDeposit}
                onChange={(e) => setSelectedDeposit(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  backgroundColor: "#0d0d0d",
                  border: "1px solid rgba(198, 164, 95, 0.4)",
                  color: "#ffffff",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  padding: "0 16px",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="Full Payment" style={{ background: "#0c0c0c" }}>
                  Full Payment – {formatPrice(product.price)}
                </option>
                <option value="25% Deposit" style={{ background: "#0c0c0c" }}>
                  25% Deposit – {formatPrice(product.price * 0.25)}
                </option>
                <option value="50% Deposit" style={{ background: "#0c0c0c" }}>
                  50% Deposit – {formatPrice(product.price * 0.5)}
                </option>
              </select>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                height: "52px",
                backgroundColor: "#c6a45f",
                color: "#000000",
                border: "none",
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                boxShadow: "0 0 25px rgba(198, 164, 95, 0.3)",
                transition: "all 0.3s ease",
              }}
            >
              <ShoppingBag size={18} /> ADD TO CART • {formatPrice(product.price)}
            </button>

            {/* Urgent Assistance Callout Bar */}
            <div
              style={{
                backgroundColor: "#080808",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "16px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12px",
                  color: "#d0d0d0",
                  marginBottom: "12px",
                }}
              >
                Need your ring urgently? Get in touch 👇
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <a
                  href="#book-view"
                  style={{
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    color: "#c6a45f",
                    padding: "8px 14px",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={12} /> Book View
                </a>
                <a
                  href="mailto:customerservice@gamadiamond.net"
                  style={{
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    color: "#c6a45f",
                    padding: "8px 14px",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Mail size={12} /> Email
                </a>
                <a
                  href="https://wa.me/447981839498"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    color: "#c6a45f",
                    padding: "8px 14px",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <MessageSquare size={12} /> +44 *******
                </a>
              </div>
            </div>

            {/* Trust Benefits 2x2 Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#a0a0a0" }}>
                <Shield size={16} color="#c6a45f" /> 1 Year Free Warranty
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#a0a0a0" }}>
                <Truck size={16} color="#c6a45f" /> Insured Delivery
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#a0a0a0" }}>
                <Award size={16} color="#c6a45f" /> Diamond Certificate
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#a0a0a0" }}>
                <RefreshCw size={16} color="#c6a45f" /> 30 Day Exchange Policy
              </div>
            </div>

            {/* Product Specification Collapsible Accordion */}
            <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }}>
              <button
                onClick={() => setSpecOpen(!specOpen)}
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  padding: "8px 0",
                  cursor: "pointer",
                  color: "#c6a45f",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "14px",
                  fontWeight: "700",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                PRODUCT SPECIFICATION
                <ChevronDown size={16} style={{ transform: specOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
              </button>

              {specOpen && (
                <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "#a0a0a0" }}>
                  <div><strong>Precious Metal:</strong> {selectedMetal}</div>
                  <div><strong>Diamond Carat:</strong> {product.carat}</div>
                  <div><strong>Diamond Shape:</strong> {product.shape}</div>
                  <div><strong>Diamond Cut:</strong> Excellent Cut</div>
                  <div><strong>Clarity:</strong> {product.clarity}</div>
                  <div><strong>Color:</strong> {product.color}</div>
                  <div><strong>Certificate:</strong> {product.certification}</div>
                  <div><strong>Origin:</strong> Gama Diamonds, London</div>
                </div>
              )}
            </div>

            {/* Bespoke Callout Button */}
            <Link
              href="/bespoke"
              style={{
                display: "block",
                textAlign: "center",
                border: "1px solid #c6a45f",
                color: "#c6a45f",
                padding: "14px",
                fontSize: "11px",
                fontWeight: "600",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Not Quite? Create Your Own Design
            </Link>

            {/* Klarna Financing Box */}
            <div
              style={{
                backgroundColor: "#0d0d0d",
                border: "1px solid rgba(198, 164, 95, 0.2)",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: "11px", fontWeight: "600", color: "#ffffff" }}>
                  Pay in 30 days with Klarna
                </div>
                <div style={{ fontSize: "10px", color: "#888888" }}>
                  0% APR Interest Free. T&Cs apply.
                </div>
              </div>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#FFB3C7" }}>
                Klarna.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: LUXURY WITH CONFIDENCE ── */}
      <section
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "#050505",
          padding: "60px 0",
        }}
      >
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "3px",
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: "40px",
            }}
          >
            LUXURY WITH CONFIDENCE
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", border: "1px solid rgba(198,164,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c6a45f", marginBottom: "14px" }}>
                <RefreshCw size={22} />
              </div>
              <h4 style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ffffff", marginBottom: "4px" }}>
                30 Day Exchange
              </h4>
              <p style={{ fontSize: "11px", color: "#888888" }}>Hassle-free exchange policy</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", border: "1px solid rgba(198,164,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c6a45f", marginBottom: "14px" }}>
                <Sparkles size={22} />
              </div>
              <h4 style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ffffff", marginBottom: "4px" }}>
                Luxury Packaging
              </h4>
              <p style={{ fontSize: "11px", color: "#888888" }}>Signature velvet presentation box</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", border: "1px solid rgba(198,164,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c6a45f", marginBottom: "14px" }}>
                <Shield size={22} />
              </div>
              <h4 style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ffffff", marginBottom: "4px" }}>
                1 Year Warranty
              </h4>
              <p style={{ fontSize: "11px", color: "#888888" }}>Complimentary annual inspection</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "54px", height: "54px", borderRadius: "50%", border: "1px solid rgba(198,164,95,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#c6a45f", marginBottom: "14px" }}>
                <Award size={22} />
              </div>
              <h4 style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#ffffff", marginBottom: "4px" }}>
                Bespoke Design
              </h4>
              <p style={{ fontSize: "11px", color: "#888888" }}>Hatton Garden 3D CAD workshop</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: CUSTOMER REVIEWS ── */}
      <section style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "60px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px",
              fontWeight: "700",
              letterSpacing: "3px",
              color: "#ffffff",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Customer Reviews
          </h2>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "24px", marginBottom: "32px" }}>
            <div>
              <div style={{ display: "flex", gap: "4px", justifyContent: "center", color: "#c6a45f", marginBottom: "4px" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="#c6a45f" stroke="none" />
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "#888888" }}>Based on {product.reviewCount} reviews</div>
            </div>

            <button className="btn-gold" style={{ padding: "12px 24px", fontSize: "10px" }}>
              Write a Review
            </button>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: YOU MAY ALSO LIKE ── */}
      <section style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", padding: "60px 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "22px",
              fontWeight: "700",
              letterSpacing: "2px",
              color: "#ffffff",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            YOU MAY ALSO LIKE
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.015)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  textDecoration: "none",
                }}
              >
                {item.badge && (
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
                    {item.badge}
                  </span>
                )}

                <div style={{ width: "100%", height: "240px", marginBottom: "16px" }}>
                  <ImagePlaceholder height="100%" label="IMAGE PLACEHOLDER" />
                </div>

                <h3
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                    fontWeight: "500",
                    color: "#dddddd",
                    lineHeight: "1.5",
                    marginBottom: "10px",
                    height: "33px",
                    overflow: "hidden",
                  }}
                >
                  {item.title}
                </h3>

                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#c6a45f",
                    marginTop: "auto",
                  }}
                >
                  {formatPrice(item.price)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed Carousel */}
      <RingsRecentlyViewed />

      {/* Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
