"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Truck,
  Award,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Play,
  Pause,
  Sparkles,
  CheckCircle2,
  X,
  Maximize2,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  HelpCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CertificationBar from "@/components/landing/CertificationBar";
import RingsRecentlyViewed from "@/components/rings/RingsRecentlyViewed";
import LuxurySelect from "@/components/ui/LuxurySelect";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { productsApi } from "@/lib/api/products";
import { cartApi } from "@/lib/api/orders";
import { toast } from "sonner";

interface ProductDetailProps {
  productId: string;
}

interface ProductData {
  id: string;
  title: string;
  category: string;
  price: number;
  sku: string;
  metal: string;
  carat: string;
  shape: string;
  clarity: string;
  color: string;
  certification: string;
  badge: string;
  video_url: string | null;
  description: string;
  images: string[];
}

const AVAILABLE_METALS = [
  "18ct Yellow Gold",
  "18ct White Gold",
  "18ct Rose Gold",
  "Platinum",
];

const UK_RING_SIZES = [
  "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

export default function ProductDetailContent({ productId }: ProductDetailProps) {
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [numericId, setNumericId] = useState<number | null>(
    !isNaN(Number(productId)) ? Number(productId) : null
  );

  // Component States
  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);

  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedMetal, setSelectedMetal] = useState("18ct Yellow Gold");
  const [quantity, setQuantity] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<"details" | "spec" | "shipping">("details");

  // Fetch real backend product data
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    setSelectedSlide(0);

    productsApi
      .getProduct(productId)
      .then((res) => {
        if (cancelled) return;
        if (!res.data) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        const p = res.data;
        setNumericId(p.id);
        const imagesList = (p.images?.map((img) => img.url) || []).filter(Boolean);

        const pVars = (p.variants || []) as any[];
        setVariants(pVars);
        const initialVar = pVars.find((v: any) => v.is_default || v.isDefault) || pVars[0] || null;
        setSelectedVariant(initialVar);

        let initialMetal = "18ct Yellow Gold";
        if (initialVar) {
          const mType = initialVar.metal_type || initialVar.metalType;
          if (mType) {
            initialMetal = mType.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
          }
          const sVal = initialVar.size || initialVar.length || initialVar.bangle_size || initialVar.bangleSize;
          if (sVal) setSelectedSize(sVal);
        } else if (p.metal_type) {
          initialMetal = p.metal_type.replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
        }
        setSelectedMetal(initialMetal);

        const loadedProduct: ProductData = {
          id: String(p.id),
          title: p.name,
          category: p.category || "Engagement Ring",
          price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
          sku: initialVar?.sku || p.sku || `GD-${p.id}`,
          metal: initialMetal,
          carat: p.diamond_spec?.total_carat_weight
            ? `${p.diamond_spec.total_carat_weight}ct`
            : p.diamond_spec?.carat_weight
            ? `${p.diamond_spec.carat_weight}ct`
            : "0.50ct",
          shape: p.diamond_cut || p.diamond_spec?.diamond_shape || "Round Cut",
          clarity: String(p.diamond_spec?.clarity_grade || p.diamond_spec?.clarityGrade || "VS1"),
          color: String(p.diamond_spec?.colour_grade || p.diamond_spec?.colourGrade || "F"),
          certification: String(p.diamond_spec?.certification_lab || p.diamond_spec?.certificationLab || "GIA Certified"),
          badge: p.is_featured ? "FEATURED" : "SIGNATURE",
          description: p.description || "Meticulously crafted by master goldsmiths, featuring hand-selected certified diamonds handset into solid precious metal. Designed for everlasting brilliance.",
          video_url: p.video_url || p.videoUrl || null,
          images: imagesList,
        };

        setProduct(loadedProduct);
        setLoading(false);

        // Track in Recently Viewed
        try {
          if (imagesList.length > 0) {
            const itemToStore = {
              title: p.name,
              rawPrice: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
              hasPrefix: false,
              href: `/product/${p.id || p.slug || productId}`,
              badge: p.is_featured ? "FEATURED" : null,
              image: imagesList[0],
            };
            const existing = JSON.parse(localStorage.getItem("gama_recently_viewed") || "[]");
            const filtered = Array.isArray(existing) ? existing.filter((item: any) => item.href !== itemToStore.href) : [];
            filtered.unshift(itemToStore);
            localStorage.setItem("gama_recently_viewed", JSON.stringify(filtered.slice(0, 8)));
          }
        } catch {}
      })
      .catch(() => {
        if (cancelled) return;
        setNotFound(true);
        setLoading(false);
      });

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

  const dynamicPrice = selectedVariantPrice ?? (product?.price || 0);

  const handleAddToCart = async () => {
    if (!product) return;
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

  // Build Media Items safely
  const variantImgUrl = selectedVariant?.images?.find((i: any) => i.isPrimary || i.is_primary)?.url || selectedVariant?.images?.[0]?.url;
  const rawImageList = product?.images || [];
  const galleryImages = variantImgUrl
    ? [variantImgUrl, ...rawImageList.filter((url) => url !== variantImgUrl)]
    : rawImageList;

  const mediaItems: { type: "image" | "video"; src?: string; alt: string; isFallback?: boolean }[] = [
    ...galleryImages.map((img, i) => ({
      type: "image" as const,
      src: img,
      alt: `${product?.title || "Product"} view ${i + 1}`,
    })),
  ];

  if (product?.video_url) {
    mediaItems.push({
      type: "video" as const,
      src: product.video_url,
      alt: "360° Showcase",
    });
  }

  // If no images exist, show a clean luxury placeholder slide
  if (mediaItems.length === 0) {
    mediaItems.push({
      type: "image" as const,
      alt: product?.title || "Product Image",
      isFallback: true,
    });
  }

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
    if (totalSlides <= 1) return;
    goToSlide((selectedSlide + 1) % totalSlides, 1);
  }, [selectedSlide, totalSlides, goToSlide]);

  const prevSlide = useCallback(() => {
    if (totalSlides <= 1) return;
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

  // Auto-play (only if more than 1 slide)
  useEffect(() => {
    if (totalSlides <= 1 || isHovering || isPlayingVideo || isFullscreen || isAutoplayPaused) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }
    autoPlayTimer.current = setInterval(() => {
      setSlideDirection(1);
      setSelectedSlide((prev) => (prev + 1) % totalSlides);
    }, 4500);
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

  const isRing = product?.category
    ? !product.category.toLowerCase().includes("earring") &&
      !product.category.toLowerCase().includes("necklace") &&
      !product.category.toLowerCase().includes("bracelet")
    : true;

  // ── 1. LOADING SKELETON ──
  if (loading) {
    return (
      <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
        <Header />
        <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "44px 28px 80px" }}>
          {/* Skeleton 2-Column */}
          <div style={{ display: "grid", gridTemplateColumns: "1.18fr 0.82fr", gap: "44px", alignItems: "start" }}>
            {/* Left Media Skeleton */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "440px",
                  maxHeight: "calc(100vh - 210px)",
                  backgroundColor: "#080808",
                  border: "1px solid rgba(198, 164, 95, 0.2)",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent, rgba(198, 164, 95, 0.06), transparent)",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                />
                <Sparkles size={34} color="rgba(198, 164, 95, 0.3)" />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#0d0d0d",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Details Skeleton */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ width: "90px", height: "12px", backgroundColor: "rgba(198,164,95,0.3)", borderRadius: "2px" }} />
              <div style={{ width: "85%", height: "28px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "2px" }} />
              <div style={{ width: "130px", height: "12px", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "2px" }} />
              <div style={{ width: "100%", height: "70px", backgroundColor: "#0a0a0a", border: "1px solid rgba(198,164,95,0.15)", borderRadius: "4px" }} />
              <div style={{ width: "100%", height: "44px", backgroundColor: "#0d0d0d", border: "1px solid rgba(198,164,95,0.2)", borderRadius: "4px" }} />
              <div style={{ width: "100%", height: "50px", backgroundColor: "rgba(198, 164, 95, 0.3)", borderRadius: "4px" }} />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── 2. NOT FOUND STATE ──
  if (notFound || !product) {
    return (
      <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
        <Header />
        <main style={{ maxWidth: "800px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <Sparkles size={48} color="#c6a45f" style={{ margin: "0 auto 20px" }} />
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "32px", marginBottom: "16px", color: "#ffffff" }}>
            Piece Not Found
          </h1>
          <p style={{ color: "#888888", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" }}>
            The fine jewellery piece you are looking for may have been archived or is temporarily unavailable in our vault.
          </p>
          <Link
            href="/engagement-rings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#c6a45f",
              color: "#000000",
              padding: "14px 28px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            <ArrowLeft size={16} /> Explore All Collections
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const currentMedia = mediaItems[selectedSlide] || mediaItems[0];

  // ── 3. LOADED PRODUCT STATE ──
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Main Container with Ample Breathing Room Below Navbar */}
      <main style={{ maxWidth: "1360px", margin: "0 auto", padding: "44px 28px 80px" }}>
        
        {/* 2-Column Luxury Layout: Responsive 1-col on mobile/tablet, 1.18fr / 0.82fr on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] gap-8 lg:gap-12 items-start">
          
          {/* ── LEFT: PROMINENT MEDIA SHOWCASE ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Main Image Slider Viewport */}
            <div
              className="relative w-full h-[320px] sm:h-[400px] lg:h-[450px] max-h-[calc(100vh-210px)] bg-[#060606] border border-[#c6a45f]/25 rounded-[4px] overflow-hidden flex items-center justify-center shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
            >
              {/* Badge */}
              {product.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: "14px",
                    left: "14px",
                    zIndex: 10,
                    backgroundColor: "#c6a45f",
                    color: "#000000",
                    fontSize: "8.5px",
                    fontWeight: "700",
                    letterSpacing: "1.2px",
                    padding: "3px 8px",
                    textTransform: "uppercase",
                    borderRadius: "2px",
                  }}
                >
                  {product.badge}
                </span>
              )}

              {/* Slide Counter */}
              {totalSlides > 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "14px",
                    right: "14px",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.65)",
                    backdropFilter: "blur(6px)",
                    padding: "3px 8px",
                    fontSize: "9.5px",
                    letterSpacing: "1px",
                    color: "#aaaaaa",
                    borderRadius: "2px",
                  }}
                >
                  {selectedSlide + 1} / {totalSlides}
                </div>
              )}

              {/* Fullscreen Button */}
              {currentMedia.src && (
                <button
                  onClick={() => setIsFullscreen(true)}
                  style={{
                    position: "absolute",
                    bottom: "14px",
                    right: "14px",
                    zIndex: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "2px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ffffff",
                    transition: "all 0.2s ease",
                  }}
                  aria-label="View fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              )}

              {/* Nav Arrows */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      width: "36px",
                      height: "36px",
                      backgroundColor: "rgba(0, 0, 0, 0.55)",
                      backdropFilter: "blur(6px)",
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
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={nextSlide}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 10,
                      width: "36px",
                      height: "36px",
                      backgroundColor: "rgba(0, 0, 0, 0.55)",
                      backdropFilter: "blur(6px)",
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
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Animated Slides */}
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={`${selectedSlide}-${variantImgUrl || 'default'}`}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {currentMedia.type === "image" ? (
                    currentMedia.isFallback ? (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "10px",
                          backgroundColor: "#080808",
                        }}
                      >
                        <ImageIcon size={40} color="rgba(198, 164, 95, 0.4)" />
                        <span style={{ fontSize: "11px", color: "#777777", letterSpacing: "1px", textTransform: "uppercase" }}>
                          Image Coming Soon
                        </span>
                      </div>
                    ) : (
                      <img
                        src={currentMedia.src}
                        alt={currentMedia.alt}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "8px" }}
                        draggable={false}
                      />
                    )
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
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${mediaItems[0]?.src || ""})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "blur(3px)",
                        }}
                      />
                      {!isPlayingVideo ? (
                        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                          <motion.button
                            onClick={() => setIsPlayingVideo(true)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              width: "58px",
                              height: "58px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #c6a45f 0%, #e8d5a3 50%, #c6a45f 100%)",
                              color: "#000000",
                              border: "none",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 0 24px rgba(198, 164, 95, 0.4)",
                              marginBottom: "10px",
                            }}
                          >
                            <Play size={24} fill="#000000" style={{ marginLeft: "2px" }} />
                          </motion.button>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px", letterSpacing: "1.5px", color: "#ffffff", textTransform: "uppercase" }}>
                            360° Video Showcase
                          </div>
                        </div>
                      ) : (
                        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
                          <Sparkles size={32} color="#c6a45f" style={{ margin: "0 auto 8px" }} />
                          <p style={{ fontSize: "12px", color: "#ffffff", marginBottom: "10px" }}>
                            Interactive 360° View Active
                          </p>
                          <button
                            onClick={() => setIsPlayingVideo(false)}
                            style={{
                              background: "none",
                              border: "1px solid rgba(198, 164, 95, 0.5)",
                              color: "#c6a45f",
                              padding: "4px 12px",
                              fontSize: "9.5px",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "1.2px",
                            }}
                          >
                            <Pause size={9} style={{ display: "inline", marginRight: "4px" }} /> Pause
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Strip: Compact, Clean Wrap, NO Scrollbar */}
            {totalSlides > 1 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", width: "100%", justifyContent: "flex-start", overflow: "hidden" }}>
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    style={{
                      flexShrink: 0,
                      width: "40px",
                      height: "40px",
                      border: selectedSlide === idx ? "2px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.12)",
                      backgroundColor: "#0d0d0d",
                      cursor: "pointer",
                      overflow: "hidden",
                      opacity: selectedSlide === idx ? 1 : 0.5,
                      transition: "all 0.2s ease",
                      padding: 0,
                      position: "relative",
                      borderRadius: "2px",
                    }}
                  >
                    {item.src ? (
                      <img src={item.src} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={14} color="#777777" />
                      </div>
                    )}
                    {item.type === "video" && (
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Play size={8} fill="#c6a45f" color="#c6a45f" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: INTACT, CLEAN & USER-FRIENDLY TEXT & PURCHASING SECTION ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* Header: Category & Title & SKU */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span style={{ fontSize: "10.5px", letterSpacing: "2px", color: "#c6a45f", textTransform: "uppercase", fontWeight: "700" }}>
                  {product.category}
                </span>
                <span style={{ fontSize: "10px", color: "#555555" }}>•</span>
                <span style={{ fontSize: "10px", color: "#888888", letterSpacing: "1px", textTransform: "uppercase" }}>
                  Certified Natural Diamond
                </span>
              </div>
              <h1
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "24px",
                  fontWeight: "600",
                  letterSpacing: "0.4px",
                  color: "#ffffff",
                  lineHeight: "1.3",
                  marginBottom: "8px",
                }}
              >
                {product.title}
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "11px", color: "#666666" }}>
                <span>SKU: <strong style={{ color: "#999999", fontWeight: "500" }}>{selectedVariant?.sku || product.sku}</strong></span>
                <span>•</span>
                <span style={{ color: "#888888" }}>Hallmarked in UK</span>
              </div>
            </div>

            {/* Luxury Pricing Card */}
            <div
              style={{
                backgroundColor: "#0a0a0a",
                border: "1px solid rgba(198, 164, 95, 0.2)",
                borderRadius: "4px",
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "9.5px", letterSpacing: "1px", color: "#888888", textTransform: "uppercase", marginBottom: "2px" }}>
                  Total Price (Inc. Taxes)
                </div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "#c6a45f",
                    letterSpacing: "0.5px",
                    lineHeight: "1.1",
                  }}
                >
                  {formatPrice(dynamicPrice)}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <span style={{ fontSize: "11px", color: "#e0e0e0", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={13} color="#c6a45f" /> Fully Insured Express Delivery
                </span>
                <span style={{ fontSize: "10px", color: "#777777" }}>Dispatched in discreet luxury packaging</span>
              </div>
            </div>

            {/* Variants / Metal Selection */}
            {variants.length > 0 ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                    Selected Specification
                  </label>
                  <span style={{ fontSize: "10px", color: "#c6a45f" }}>{variants.length} options available</span>
                </div>
                <LuxurySelect
                  value={selectedVariant?.id || ""}
                  onChange={(val) => handleSelectVariant(Number(val))}
                  options={variants.map((v) => {
                    const metalLabel = (v.metal_type || v.metalType || "").replace("-", " ").replace(/\b\w/g, (l: string) => l.toUpperCase());
                    const karatLabel = v.metal_karat || v.metalKarat || "";
                    const dimLabel = v.size ? `Size ${v.size}` : v.length ? v.length : v.bangle_size || v.bangleSize || "";
                    const vPrice = typeof v.price === "number" ? v.price : parseFloat(String(v.price || 0));
                    const detailsStr = [metalLabel, karatLabel, dimLabel].filter(Boolean).join(" · ");
                    return {
                      value: v.id,
                      label: `${detailsStr || v.sku} — ${formatPrice(vPrice)}`,
                    };
                  })}
                />
              </div>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                    Precious Metal: <span style={{ color: "#ffffff", fontWeight: "700" }}>{selectedMetal}</span>
                  </label>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {AVAILABLE_METALS.map((m) => {
                    const isSelected = selectedMetal === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setSelectedMetal(m)}
                        style={{
                          padding: "10px 12px",
                          fontSize: "11px",
                          letterSpacing: "0.5px",
                          backgroundColor: isSelected ? "#16140e" : "#0a0a0a",
                          color: isSelected ? "#c6a45f" : "#888888",
                          border: isSelected ? "1px solid #c6a45f" : "1px solid rgba(255, 255, 255, 0.08)",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <span>{m}</span>
                        {isSelected && <Check size={13} color="#c6a45f" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector (If ring or applicable) */}
            {isRing && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "11px", fontWeight: "600", color: "#aaaaaa", textTransform: "uppercase", letterSpacing: "1.2px" }}>
                    Ring Size
                  </label>
                  <span style={{ fontSize: "10.5px", color: "#888888", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <HelpCircle size={12} color="#c6a45f" /> Free 30-Day Resizing
                  </span>
                </div>
                <LuxurySelect
                  value={selectedSize}
                  onChange={(val) => setSelectedSize(String(val))}
                  options={UK_RING_SIZES.map((size) => ({
                    value: size,
                    label: `UK Size ${size}${size === "M" ? " (Standard Medium)" : ""}`,
                  }))}
                />
              </div>
            )}

            {/* Add to Bag CTA & Custom Design Link */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "2px" }}>
              <button
                onClick={handleAddToCart}
                style={{
                  width: "100%",
                  height: "50px",
                  backgroundColor: "#c6a45f",
                  color: "#000000",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  boxShadow: "0 4px 20px rgba(198, 164, 95, 0.3)",
                  transition: "all 0.2s ease",
                  borderRadius: "3px",
                }}
              >
                <ShoppingBag size={16} /> ADD TO SHOPPING BAG • {formatPrice(dynamicPrice)}
              </button>

              <Link
                href="/bespoke"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  border: "1px solid rgba(198, 164, 95, 0.35)",
                  color: "#c6a45f",
                  padding: "11px",
                  fontSize: "10.5px",
                  fontWeight: "600",
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  borderRadius: "3px",
                  backgroundColor: "#070707",
                }}
              >
                <Sparkles size={13} color="#c6a45f" /> Request Custom Diamond or Metal
              </Link>
            </div>

            {/* Trust Badges Enclosed Card */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
                padding: "14px 16px",
                backgroundColor: "#080808",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10.5px", color: "#999999" }}>
                <Shield size={14} color="#c6a45f" /> 1 Year Free Warranty
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10.5px", color: "#999999" }}>
                <Truck size={14} color="#c6a45f" /> Insured Delivery
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10.5px", color: "#999999" }}>
                <Award size={14} color="#c6a45f" /> Certified Diamonds
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10.5px", color: "#999999" }}>
                <RefreshCw size={14} color="#c6a45f" /> 30-Day Exchange
              </div>
            </div>

            {/* Tabbed Product Information */}
            <div style={{ marginTop: "4px" }}>
              {/* Tab Navigation */}
              <div style={{ display: "flex", gap: "20px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", marginBottom: "14px" }}>
                {(["details", "spec", "shipping"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: "none",
                      border: "none",
                      borderBottom: activeTab === tab ? "2px solid #c6a45f" : "2px solid transparent",
                      color: activeTab === tab ? "#c6a45f" : "#777777",
                      paddingBottom: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      letterSpacing: "1.2px",
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
                <div style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#a5a5a5" }}>
                  <p style={{ marginBottom: "10px" }}>
                    {product.description || "Each piece is meticulously crafted with the finest attention to detail, balancing timeless elegance with modern luxury craftsmanship."}
                  </p>
                  <ul style={{ paddingLeft: "14px", display: "flex", flexDirection: "column", gap: "4px", color: "#8e8e8e" }}>
                    <li>Handset certified natural diamonds for maximum brilliance</li>
                    <li>Solid hallmarked precious metal composition</li>
                    <li>Includes signature presentation box and certificate</li>
                  </ul>
                </div>
              )}

              {activeTab === "spec" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "11px", color: "#a5a5a5" }}>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Metal</span>
                    <strong style={{ color: "#ffffff" }}>{selectedMetal}</strong>
                  </div>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Diamond Cut</span>
                    <strong style={{ color: "#ffffff" }}>{product.shape}</strong>
                  </div>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Carat Weight</span>
                    <strong style={{ color: "#ffffff" }}>{product.carat}</strong>
                  </div>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Clarity</span>
                    <strong style={{ color: "#ffffff" }}>{product.clarity}</strong>
                  </div>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Colour Grade</span>
                    <strong style={{ color: "#ffffff" }}>{product.color}</strong>
                  </div>
                  <div style={{ padding: "6px 8px", backgroundColor: "#090909", borderRadius: "2px" }}>
                    <span style={{ color: "#777777", display: "block", fontSize: "9.5px", textTransform: "uppercase" }}>Certification</span>
                    <strong style={{ color: "#ffffff" }}>{product.certification}</strong>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div style={{ fontSize: "11.5px", lineHeight: "1.7", color: "#a5a5a5" }}>
                  <p style={{ marginBottom: "6px" }}>
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
        {isFullscreen && currentMedia.src && (
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
              src={currentMedia.src}
              alt={currentMedia.alt}
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
