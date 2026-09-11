"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Truck,
  Award,
  RefreshCw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Play,
  Pause,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
  Maximize2,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CertificationBar from "@/components/landing/CertificationBar";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { productsApi } from "@/lib/api/products";
import { cartApi } from "@/lib/api/orders";
import { toast } from "sonner";

interface ProductDetailProps {
  productId: string;
}

// Fallback helper for dynamic products
function getDynamicProduct(id: string) {
  const normalized = id.toLowerCase();

  let category = "Engagement Ring";
  let defaultTitle = `MARGELLES 0.50 CARAT ROUND CUT NATURAL DIAMOND SOLITAIRE RING`;
  let defaultPrice = 1850;
  let metal = "18ct Yellow Gold";
  let carat = "0.50ct";
  let shape = "Round Cut";
  let clarity = "VS1";
  let color = "F";
  let certification = "GIA Certified";

  if (normalized.includes("er") || normalized.includes("earring")) {
    category = "Earrings";
    defaultTitle = "ROUND CUT SAPPHIRE & DIAMOND DROP EARRINGS";
    defaultPrice = 1850;
    metal = "18ct White Gold";
    carat = "1.50ct";
    shape = "Round Cut";
  } else if (normalized.includes("et") || normalized.includes("eternity")) {
    category = "Eternity Ring";
    defaultTitle = "ROUND BRILLIANT FULL ETERNITY DIAMOND RING";
    defaultPrice = 3450;
    metal = "18ct White Gold";
    carat = "2.00ct";
    shape = "Round Cut";
  } else if (normalized.includes("nk") || normalized.includes("necklace")) {
    category = "Necklace";
    defaultTitle = "ROUND BRILLIANT DIAMOND SOLITAIRE PENDANT";
    defaultPrice = 1650;
    metal = "18ct White Gold";
    carat = "0.75ct";
    shape = "Round Cut";
  } else if (normalized.includes("br") || normalized.includes("bracelet")) {
    category = "Bracelet";
    defaultTitle = "ROUND CUT DIAMOND TENNIS BRACELET";
    defaultPrice = 4850;
    metal = "18ct White Gold";
    carat = "4.00ct";
    shape = "Round Cut";
  }

  return {
    id,
    title: defaultTitle,
    category,
    price: defaultPrice,
    sku: `GD-${id.toUpperCase().replace(/[^A-Z0-9]/g, "")}`,
    metal,
    carat,
    shape,
    clarity,
    color,
    certification,
    badge: "HANDCRAFTED",
    video_url: null as string | null,
    description: "Meticulously crafted by master goldsmiths, featuring hand-selected certified diamonds handset into solid precious metal. Designed for everlasting brilliance.",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&h=800&fit=crop",
    ],
  };
}

export default function ProductDetailContent({ productId }: ProductDetailProps) {
  const initialFallback = getDynamicProduct(productId);
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(initialFallback);
  const [numericId, setNumericId] = useState<number | null>(
    !isNaN(Number(productId)) ? Number(productId) : null
  );

  // Component States
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedMetal, setSelectedMetal] = useState(initialFallback.metal);
  const [quantity, setQuantity] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "spec" | "shipping">("details");

  // Fetch real backend product data if available
  useEffect(() => {
    let cancelled = false;
    productsApi
      .getProduct(productId)
      .then((res) => {
        if (cancelled || !res.data) return;
        const p = res.data;
        setNumericId(p.id);
        const imagesList = p.images?.map((img) => img.url) || [];

        const pVars = (p.variants || []) as any[];
        setVariants(pVars);
        const initialVar = pVars.find((v: any) => v.is_default || v.isDefault) || pVars[0] || null;
        setSelectedVariant(initialVar);

        if (initialVar) {
          const mType = initialVar.metal_type || initialVar.metalType;
          if (mType) {
            setSelectedMetal(mType.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()));
          }
          const sVal = initialVar.size || initialVar.length || initialVar.bangle_size || initialVar.bangleSize;
          if (sVal) setSelectedSize(sVal);
        }

        setProduct((prev) => ({
          ...prev,
          id: String(p.id),
          title: p.name,
          category: p.category || "Jewellery",
          price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
          sku: initialVar?.sku || p.sku || `GD-${p.id}`,
          metal: p.metal_type
            ? p.metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
            : initialFallback.metal,
          carat: p.diamond_spec?.total_carat_weight
            ? `${p.diamond_spec.total_carat_weight}ct`
            : p.diamond_spec?.carat_weight
            ? `${p.diamond_spec.carat_weight}ct`
            : initialFallback.carat,
          shape: p.diamond_cut || p.diamond_spec?.diamond_shape || initialFallback.shape,
          clarity: String(p.diamond_spec?.clarity_grade || p.diamond_spec?.clarityGrade || "VS1"),
          color: String(p.diamond_spec?.colour_grade || p.diamond_spec?.colourGrade || "F"),
          certification: String(p.diamond_spec?.certification_lab || p.diamond_spec?.certificationLab || "GIA Certified"),
          badge: p.is_featured ? "FEATURED" : "SIGNATURE",
          description: p.description || prev.description,
          video_url: p.video_url || p.videoUrl || null,
          images: imagesList.length > 0 ? imagesList : initialFallback.images,
        }));

        if (p.metal_type && !initialVar) setSelectedMetal(p.metal_type);

        // Track in Recently Viewed
        try {
          const primaryImg = imagesList[0] || initialFallback.images[0];
          const itemToStore = {
            title: p.name,
            rawPrice: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
            hasPrefix: false,
            href: `/product/${p.id || p.slug || productId}`,
            badge: p.is_featured ? "FEATURED" : null,
            image: primaryImg,
          };
          const existing = JSON.parse(localStorage.getItem("gama_recently_viewed") || "[]");
          const filtered = Array.isArray(existing) ? existing.filter((item: any) => item.href !== itemToStore.href) : [];
          filtered.unshift(itemToStore);
          localStorage.setItem("gama_recently_viewed", JSON.stringify(filtered.slice(0, 8)));
        } catch {}
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Handle manual variant selection
  const handleSelectVariant = (varId: number) => {
    const found = variants.find((v) => v.id === varId);
    if (found) {
      setSelectedVariant(found);
      const mType = found.metal_type || found.metalType;
      if (mType) {
        setSelectedMetal(mType.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase()));
      }
      const sVal = found.size || found.length || found.bangle_size || found.bangleSize;
      if (sVal) setSelectedSize(sVal);

      setIsAutoplayPaused(true);
      setSlideDirection(1);
      setSelectedSlide(0);
    }
  };

  const selectedVariantPrice = selectedVariant
    ? typeof selectedVariant.price === "number"
      ? selectedVariant.price
      : parseFloat(String(selectedVariant.price || 0))
    : null;

  const dynamicPrice = selectedVariantPrice ?? product.price;

  const handleAddToCart = async () => {
    try {
      const variantId = selectedVariant?.id;
      if (isAuthenticated && numericId) {
        await cartApi.addItem(numericId, selectedSize, quantity, variantId);
      }

      const existingCart = JSON.parse(localStorage.getItem("gama_cart") || "[]");
      existingCart.push({
        id: numericId || product.id,
        variant_id: variantId,
        title: `${product.title} (${selectedMetal}${selectedVariant?.metal_karat ? " " + selectedVariant.metal_karat : ""})`,
        price: dynamicPrice,
        metal: selectedMetal,
        size: selectedSize,
        quantity,
      });
      localStorage.setItem("gama_cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.title} added to bag!`);
    } catch {
      toast.error("Failed to add to bag");
    }
  };

  // Slider items
  const variantImgUrl = selectedVariant?.images?.find((i: any) => i.isPrimary || i.is_primary)?.url || selectedVariant?.images?.[0]?.url;
  const rawImageList = product.images || [];
  const galleryImages = variantImgUrl
    ? [variantImgUrl, ...rawImageList.filter((url) => url !== variantImgUrl)]
    : rawImageList;

  const mediaItems: { type: "image" | "video"; src: string; alt: string }[] = [
    ...galleryImages.map((img, i) => ({
      type: "image" as const,
      src: img,
      alt: `${product.title} view ${i + 1}`,
    })),
    {
      type: "video" as const,
      src: product.video_url || product.images[1] || product.images[0],
      alt: "360° Showcase",
    },
  ];

  const totalSlides = mediaItems.length;

  const goToSlide = useCallback(
    (index: number, dir?: number) => {
      setSlideDirection(dir !== undefined ? dir : index > selectedSlide ? 1 : -1);
      setSelectedSlide(index);
      if (index !== totalSlides - 1) setIsPlayingVideo(false);
    },
    [selectedSlide, totalSlides]
  );

  const nextSlide = useCallback(() => {
    goToSlide((selectedSlide + 1) % totalSlides, 1);
  }, [selectedSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((selectedSlide - 1 + totalSlides) % totalSlides, -1);
  }, [selectedSlide, totalSlides, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto-play
  useEffect(() => {
    if (isHovering || isPlayingVideo || isFullscreen || isAutoplayPaused) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }
    autoPlayTimer.current = setInterval(() => {
      setSlideDirection(1);
      setSelectedSlide((prev) => (prev + 1) % totalSlides);
    }, 4000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovering, isPlayingVideo, isFullscreen, isAutoplayPaused, totalSlides]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const isRing = !product.category.toLowerCase().includes("earring") &&
                 !product.category.toLowerCase().includes("necklace") &&
                 !product.category.toLowerCase().includes("bracelet");

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Main Container */}
      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "32px 24px 80px" }}>
        {/* Clean Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#777777", marginBottom: "32px" }}>
          <Link href="/" style={{ color: "#777777", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-gold">
            Home
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <Link href={`/${product.category.toLowerCase().replace(/\s+/g, "-")}`} style={{ color: "#777777", textDecoration: "none", transition: "color 0.2s" }} className="hover:text-gold">
            {product.category}
          </Link>
          <span style={{ opacity: 0.4 }}>/</span>
          <span style={{ color: "#c6a45f" }}>{product.title}</span>
        </nav>

        {/* 2-Column Luxury Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "48px", alignItems: "start" }}>
          
          {/* ── LEFT: MEDIA SHOWCASE ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Main Image Slider Viewport */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                backgroundColor: "#080808",
                border: "1px solid rgba(198, 164, 95, 0.2)",
                overflow: "hidden",
                borderRadius: "2px",
              }}
            >
              {/* Badge */}
              {product.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    zIndex: 10,
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

              {/* Slide Counter */}
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  zIndex: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(8px)",
                  padding: "4px 10px",
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: "#aaaaaa",
                }}
              >
                {selectedSlide + 1} / {totalSlides}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "16px",
                  zIndex: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  width: "36px",
                  height: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                aria-label="View fullscreen"
              >
                <Maximize2 size={14} />
              </button>

              {/* Nav Arrows */}
              <button
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                aria-label="Previous"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "40px",
                  height: "40px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  transition: "all 0.2s ease",
                }}
                aria-label="Next"
              >
                <ChevronRight size={18} />
              </button>

              {/* Animated Slides */}
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={`${selectedSlide}-${variantImgUrl || 'default'}`}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
                >
                  {mediaItems[selectedSlide].type === "image" ? (
                    <img
                      src={mediaItems[selectedSlide].src}
                      alt={mediaItems[selectedSlide].alt}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      draggable={false}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${mediaItems[selectedSlide].src})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "blur(3px)",
                        }}
                      />
                      {!isPlayingVideo ? (
                        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                          <motion.button
                            onClick={() => setIsPlayingVideo(true)}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              width: "70px",
                              height: "70px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #c6a45f 0%, #e8d5a3 50%, #c6a45f 100%)",
                              color: "#000000",
                              border: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 0 30px rgba(198, 164, 95, 0.4)",
                              marginBottom: "16px",
                            }}
                          >
                            <Play size={28} fill="#000000" style={{ marginLeft: "3px" }} />
                          </motion.button>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "16px", letterSpacing: "2px", color: "#ffffff", textTransform: "uppercase" }}>
                            360° Video Preview
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                          <Sparkles size={40} color="#c6a45f" style={{ margin: "0 auto 12px" }} />
                          <p style={{ fontSize: "13px", color: "#ffffff", marginBottom: "14px" }}>
                            Interactive 360° View Active
                          </p>
                          <button
                            onClick={() => setIsPlayingVideo(false)}
                            style={{
                              background: "none",
                              border: "1px solid rgba(198, 164, 95, 0.5)",
                              color: "#c6a45f",
                              padding: "6px 16px",
                              fontSize: "10px",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                            }}
                          >
                            <Pause size={10} style={{ display: "inline", marginRight: "4px" }} /> Pause
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip */}
            <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  style={{
                    flexShrink: 0,
                    width: "64px",
                    height: "64px",
                    border: selectedSlide === idx ? "2px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "#0d0d0d",
                    cursor: "pointer",
                    overflow: "hidden",
                    opacity: selectedSlide === idx ? 1 : 0.5,
                    transition: "all 0.2s ease",
                    padding: 0,
                    position: "relative",
                  }}
                >
                  <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {item.type === "video" && (
                    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Play size={12} fill="#c6a45f" color="#c6a45f" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── RIGHT: PRODUCT DETAILS & PURCHASING ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* Title & SKU */}
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#c6a45f", textTransform: "uppercase", marginBottom: "8px" }}>
                {product.category}
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "600",
                  letterSpacing: "0.5px",
                  color: "#ffffff",
                  lineHeight: "1.35",
                  marginBottom: "10px",
                }}
              >
                {product.title}
              </h1>
              <div style={{ fontSize: "11px", letterSpacing: "1px", color: "#666666" }}>
                SKU: {selectedVariant?.sku || product.sku}
              </div>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "16px", paddingBottom: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "30px",
                  fontWeight: "700",
                  color: "#c6a45f",
                  letterSpacing: "0.5px",
                }}
              >
                {formatPrice(dynamicPrice)}
              </span>
              <span style={{ fontSize: "11px", color: "#888888", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={13} color="#c6a45f" /> Fully Insured Express Delivery Included
              </span>
            </div>

            {/* Variants / Metal Selection */}
            {variants.length > 0 ? (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>
                  Selected Specification
                </label>
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => handleSelectVariant(Number(e.target.value))}
                  style={{
                    width: "100%",
                    height: "46px",
                    backgroundColor: "#0d0d0d",
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    color: "#ffffff",
                    fontSize: "12px",
                    padding: "0 16px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {variants.map((v) => {
                    const metalLabel = (v.metal_type || v.metalType || "").replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
                    const karatLabel = v.metal_karat || v.metalKarat || "";
                    const dimLabel = v.size ? `Size ${v.size}` : v.length ? v.length : v.bangle_size || v.bangleSize || "";
                    const vPrice = typeof v.price === "number" ? v.price : parseFloat(String(v.price || 0));
                    const detailsStr = [metalLabel, karatLabel, dimLabel].filter(Boolean).join(" · ");
                    return (
                      <option key={v.id} value={v.id} style={{ background: "#0c0c0c" }}>
                        {detailsStr || v.sku} — {formatPrice(vPrice)}
                      </option>
                    );
                  })}
                </select>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>
                  Precious Metal: <span style={{ color: "#ffffff" }}>{selectedMetal}</span>
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["18ct Yellow Gold", "18ct White Gold", "18ct Rose Gold", "Platinum"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMetal(m)}
                      style={{
                        padding: "10px 16px",
                        fontSize: "11px",
                        letterSpacing: "1px",
                        backgroundColor: selectedMetal === m ? "#141414" : "#080808",
                        color: selectedMetal === m ? "#c6a45f" : "#888888",
                        border: selectedMetal === m ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.1)",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector (If ring or applicable) */}
            {isRing && (
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "10px" }}>
                  Ring Size
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  style={{
                    width: "100%",
                    height: "46px",
                    backgroundColor: "#0d0d0d",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#ffffff",
                    fontSize: "12px",
                    padding: "0 16px",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((size) => (
                    <option key={size} value={size} style={{ background: "#0c0c0c" }}>
                      UK Size {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Bag CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  height: "54px",
                  backgroundColor: "#c6a45f",
                  color: "#000000",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2.5px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 20px rgba(198, 164, 95, 0.25)",
                  transition: "all 0.2s ease",
                }}
              >
                <ShoppingBag size={17} /> ADD TO SHOPPING BAG • {formatPrice(dynamicPrice)}
              </button>

              <Link
                href="/bespoke"
                style={{
                  display: "block",
                  textAlign: "center",
                  border: "1px solid rgba(198, 164, 95, 0.35)",
                  color: "#c6a45f",
                  padding: "12px",
                  fontSize: "10.5px",
                  fontWeight: "600",
                  letterSpacing: "1.5px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                Request Custom Diamond or Metal
              </Link>
            </div>

            {/* Trust Badges */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", padding: "18px 0", borderTop: "1px solid rgba(255, 255, 255, 0.08)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#aaaaaa" }}>
                <Shield size={15} color="#c6a45f" /> 1 Year Free Warranty
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#aaaaaa" }}>
                <Truck size={15} color="#c6a45f" /> Insured Delivery
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#aaaaaa" }}>
                <Award size={15} color="#c6a45f" /> Certified Diamonds
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", color: "#aaaaaa" }}>
                <RefreshCw size={15} color="#c6a45f" /> 30-Day Exchange
              </div>
            </div>

            {/* Tabbed Clean Information */}
            <div>
              {/* Tab Navigation */}
              <div style={{ display: "flex", gap: "24px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "18px" }}>
                {(["details", "spec", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === tab ? "2px solid #c6a45f" : "2px solid transparent",
                      color: activeTab === tab ? "#c6a45f" : "#777777",
                      paddingBottom: "10px",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "1.5px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab === "details" ? "Overview" : tab === "spec" ? "Specifications" : "Delivery & Care"}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === "details" && (
                <div style={{ fontSize: "12px", lineHeight: "1.7", color: "#b0b0b0" }}>
                  <p style={{ marginBottom: "12px" }}>
                    {product.description || "Each piece is meticulously crafted with the finest attention to detail, balancing timeless elegance with modern luxury craftsmanship."}
                  </p>
                  <ul style={{ paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "6px", color: "#999999" }}>
                    <li>Handset diamond settings for maximum light dispersion</li>
                    <li>Solid hallmarked precious metal composition</li>
                    <li>Includes signature presentation box and diamond certificate</li>
                  </ul>
                </div>
              )}

              {activeTab === "spec" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11px", color: "#aaaaaa" }}>
                  <div><strong style={{ color: "#dddddd" }}>Precious Metal:</strong> {selectedMetal}</div>
                  <div><strong style={{ color: "#dddddd" }}>Diamond Shape:</strong> {product.shape}</div>
                  <div><strong style={{ color: "#dddddd" }}>Diamond Carat:</strong> {product.carat}</div>
                  <div><strong style={{ color: "#dddddd" }}>Clarity Grade:</strong> {product.clarity}</div>
                  <div><strong style={{ color: "#dddddd" }}>Colour Grade:</strong> {product.color}</div>
                  <div><strong style={{ color: "#dddddd" }}>Certification:</strong> {product.certification}</div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div style={{ fontSize: "12px", lineHeight: "1.7", color: "#b0b0b0" }}>
                  <p style={{ marginBottom: "8px" }}>
                    <strong style={{ color: "#ffffff" }}>Complimentary Insured Shipping:</strong> Delivered in discreet, high-security packaging with full transit insurance.
                  </p>
                  <p>
                    <strong style={{ color: "#ffffff" }}>Complimentary Resizing:</strong> We offer one free ring resize within 30 days of receiving your order.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setIsFullscreen(false)}
          >
            <button
              onClick={() => setIsFullscreen(false)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "none",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={18} />
            </button>
            <img
              src={mediaItems[selectedSlide].src}
              alt={mediaItems[selectedSlide].alt}
              style={{ maxWidth: "85vw", maxHeight: "85vh", objectFit: "contain" }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recently Viewed */}
      <RingsRecentlyViewed category={product.category} shape={product.shape} />

      {/* Certification Strip */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}

