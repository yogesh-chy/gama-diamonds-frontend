"use client";

import { useState, useCallback, useRef, useEffect as useEffectReact } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { productsApi, type ProductItem } from "@/lib/api/products";
import { cartApi } from "@/lib/api/orders";
import { toast } from "sonner";
import { useEffect } from "react";

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
  const initialFallback = getDynamicProduct(productId);
  const { formatPrice } = useCurrency();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(initialFallback);
  const [numericId, setNumericId] = useState<number | null>(
    !isNaN(Number(productId)) ? Number(productId) : null
  );

  // Component States
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedMetal, setSelectedMetal] = useState(initialFallback.metal);
  const [selectedCarat, setSelectedCarat] = useState("0.50ct");
  const [selectedDeposit, setSelectedDeposit] = useState("Full Payment");
  const [quantity, setQuantity] = useState(1);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const autoPlayTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeTab, setActiveTab] = useState<"spec" | "shipping" | "warranty">("spec");
  const [specOpen, setSpecOpen] = useState(true);

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
        setProduct({
          id: String(p.id),
          title: p.name,
          category: p.category || "Jewellery",
          price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
          sku: p.sku || `AD${p.id}3275`,
          metal: p.metal_type || initialFallback.metal,
          carat: String(p.diamond_spec?.carat_weight || p.diamond_spec?.caratWeight || initialFallback.carat),
          shape: p.diamond_cut || initialFallback.shape,
          clarity: String(p.diamond_spec?.clarity_grade || p.diamond_spec?.clarityGrade || "VS1"),
          color: String(p.diamond_spec?.colour_grade || p.diamond_spec?.colourGrade || "F Color"),
          certification: String(p.diamond_spec?.certification_lab || p.diamond_spec?.certificationLab || "GIA Certified"),
          badge: p.is_featured ? "FEATURED" : "NEXT DAY DELIVERY",
          rating: 5.0,
          reviewCount: 1240,
          images: imagesList.length > 0 ? imagesList : initialFallback.images,
        });
        if (p.metal_type) setSelectedMetal(p.metal_type);

        // Track in Recently Viewed
        try {
          const primaryImg = imagesList[0] || initialFallback.images[0];
          const itemToStore = {
            title: p.name,
            rawPrice: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
            hasPrefix: true,
            href: `/product/${p.id || p.slug || productId}`,
            badge: p.is_featured ? "FEATURED" : null,
            image: primaryImg,
          };
          const existing = JSON.parse(localStorage.getItem("gama_recently_viewed") || "[]");
          const filtered = Array.isArray(existing) ? existing.filter((item: any) => item.href !== itemToStore.href) : [];
          filtered.unshift(itemToStore);
          localStorage.setItem("gama_recently_viewed", JSON.stringify(filtered.slice(0, 10)));
        } catch (e) {}
      })
      .catch(() => {
        // Fall back gracefully to initial dynamic product
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  // Dynamic Variant Price Calculation
  const metalPriceAddon = selectedMetal.includes("Platinum") ? 350 : selectedMetal.includes("White") ? 50 : selectedMetal.includes("Rose") ? 50 : 0;
  const caratPriceAddon = selectedCarat === "0.75ct" ? 450 : selectedCarat === "1.00ct" ? 1100 : selectedCarat === "1.50ct" ? 2200 : 0;
  const dynamicPrice = product.price + metalPriceAddon + caratPriceAddon;

  const handleAddToCart = async () => {
    try {
      // 1. If authenticated and numericId exists, send to backend API
      if (isAuthenticated && numericId) {
        let variantId: number | undefined;
        try {
          const resolved = await productsApi.resolveVariant(productId, {
            metal_type: selectedMetal,
            size: selectedSize,
          });
          if (resolved.data && (resolved.data.variant_id || resolved.data.id)) {
            variantId = resolved.data.variant_id || resolved.data.id;
          }
        } catch {
          // ignore resolution fallback
        }
        await cartApi.addItem(numericId, selectedSize, quantity, variantId);
      }

      // 2. Also persist to local cart & notify UI
      const existingCart = JSON.parse(localStorage.getItem("gama_cart") || "[]");
      existingCart.push({
        id: numericId || product.id,
        title: `${product.title} (${selectedMetal}, ${selectedCarat})`,
        price: dynamicPrice,
        metal: selectedMetal,
        carat: selectedCarat,
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

  // ── Slider / Carousel Media Items ──
  // Combine images and a video entry into one unified media array
  const mediaItems: { type: "image" | "video"; src: string; alt: string }[] = [
    ...product.images.map((img, i) => ({
      type: "image" as const,
      src: img,
      alt: `${product.title} view ${i + 1}`,
    })),
    {
      type: "video" as const,
      src: product.images[2] || product.images[0], // Thumbnail for video
      alt: "360° HD Video Showcase",
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
  useEffectReact(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Auto-play: advance every 1 second, pause on hover or video play
  useEffectReact(() => {
    if (isHovering || isPlayingVideo || isFullscreen) {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
        autoPlayTimer.current = null;
      }
      return;
    }
    autoPlayTimer.current = setInterval(() => {
      setSlideDirection(1);
      setSelectedSlide((prev) => (prev + 1) % totalSlides);
    }, 3000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isHovering, isPlayingVideo, isFullscreen, totalSlides]);

  // Slide animation variants
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

  const [relatedProducts, setRelatedProducts] = useState<{id: string; title: string; price: number; badge?: string; image?: string}[]>([]);

  useEffectReact(() => {
    productsApi
      .getProducts({ category: product.category?.toLowerCase().replace(" ", "-"), limit: 4 })
      .then((res) => {
        const list = res.data?.data || [];
        const mapped = list
          .filter((p: any) => String(p.id) !== String(product.id))
          .slice(0, 4)
          .map((p: any) => ({
            id: String(p.id || p.slug),
            title: p.name,
            price: typeof p.base_price === "number" ? p.base_price : parseFloat(p.base_price || "0") || 0,
            badge: p.is_featured ? "FEATURED" : undefined,
            image: p.images?.[0]?.url,
          }));
        setRelatedProducts(mapped);
      })
      .catch(() => {});
  }, [product.id, product.category]);

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
        <div className="product-detail-main-grid">
          {/* ── LEFT SIDE: SINGLE IMAGE SLIDER WITH MEDIA GALLERY ── */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* ── Main Slider Container ── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1/1",
                maxHeight: "540px",
                backgroundColor: "#111111",
                border: "1px solid rgba(198, 164, 95, 0.25)",
                overflow: "hidden",
                borderRadius: "4px",
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Badge Overlay */}
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
                    padding: "5px 12px",
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
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  padding: "4px 12px",
                  fontSize: "11px",
                  fontFamily: "'Poppins', sans-serif",
                  color: "#ffffff",
                  letterSpacing: "1px",
                }}
              >
                {selectedSlide + 1} / {totalSlides}
              </div>

              {/* Fullscreen Toggle */}
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
                  transition: "all 0.3s ease",
                }}
                aria-label="View fullscreen"
              >
                <Maximize2 size={14} />
              </button>

              {/* Heart / Wishlist Button */}
              <button
                style={{
                  position: "absolute",
                  bottom: "16px",
                  right: "60px",
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
                  transition: "all 0.3s ease",
                }}
                aria-label="Add to wishlist"
              >
                <Heart size={14} />
              </button>

              {/* Previous Arrow */}
              <button
                onClick={prevSlide}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "44px",
                  height: "44px",
                  backgroundColor: "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Arrow */}
              <button
                onClick={nextSlide}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  width: "44px",
                  height: "44px",
                  backgroundColor: "rgba(0, 0, 0, 0.45)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#ffffff",
                  transition: "all 0.3s ease",
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Animated Slide Content */}
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={selectedSlide}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {mediaItems[selectedSlide].type === "image" ? (
                    <img
                      src={mediaItems[selectedSlide].src}
                      alt={mediaItems[selectedSlide].alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        userSelect: "none",
                        pointerEvents: "none",
                      }}
                      draggable={false}
                    />
                  ) : (
                    /* Video Slide */
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
                          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.75)), url(${mediaItems[selectedSlide].src})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "blur(3px)",
                        }}
                      />
                      {!isPlayingVideo ? (
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <motion.button
                            onClick={() => setIsPlayingVideo(true)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              width: "80px",
                              height: "80px",
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #c6a45f 0%, #e8d5a3 50%, #c6a45f 100%)",
                              color: "#000000",
                              border: "none",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              boxShadow: "0 0 40px rgba(198, 164, 95, 0.5), 0 0 80px rgba(198, 164, 95, 0.2)",
                              marginBottom: "20px",
                            }}
                          >
                            <Play size={32} fill="#000000" style={{ marginLeft: "4px" }} />
                          </motion.button>
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "18px",
                              fontWeight: "700",
                              letterSpacing: "3px",
                              color: "#ffffff",
                              textTransform: "uppercase",
                              marginBottom: "8px",
                            }}
                          >
                            360° HD Video
                          </span>
                          <span
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "11px",
                              letterSpacing: "1.5px",
                              color: "#c6a45f",
                              textTransform: "uppercase",
                            }}
                          >
                            Inspect diamond brilliance & setting details
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            position: "relative",
                            zIndex: 2,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles size={48} color="#c6a45f" />
                          </motion.div>
                          <p
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "14px",
                              color: "#ffffff",
                              marginTop: "16px",
                              marginBottom: "4px",
                            }}
                          >
                            Playing 360° Interactive Video...
                          </p>
                          <motion.button
                            onClick={() => setIsPlayingVideo(false)}
                            whileHover={{ scale: 1.05 }}
                            style={{
                              marginTop: "16px",
                              background: "none",
                              border: "1px solid rgba(198, 164, 95, 0.5)",
                              color: "#c6a45f",
                              padding: "8px 20px",
                              fontSize: "10px",
                              cursor: "pointer",
                              textTransform: "uppercase",
                              letterSpacing: "1.5px",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            <Pause size={12} /> Pause Video
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Dot Indicators */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  zIndex: 10,
                  display: "flex",
                  gap: "8px",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  backdropFilter: "blur(8px)",
                  padding: "6px 12px",
                  borderRadius: "20px",
                }}
              >
                {mediaItems.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToSlide(idx)}
                    style={{
                      width: selectedSlide === idx ? "24px" : "8px",
                      height: "8px",
                      borderRadius: "4px",
                      border: "none",
                      backgroundColor: selectedSlide === idx ? "#c6a45f" : "rgba(255, 255, 255, 0.35)",
                      cursor: "pointer",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      padding: 0,
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* ── Thumbnail Strip ── */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "12px",
                overflowX: "auto",
                paddingBottom: "4px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(198,164,95,0.3) transparent",
              }}
            >
              {mediaItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => goToSlide(idx)}
                  style={{
                    flexShrink: 0,
                    width: "72px",
                    height: "72px",
                    border: selectedSlide === idx
                      ? "2px solid #c6a45f"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: "#0d0d0d",
                    cursor: "pointer",
                    overflow: "hidden",
                    opacity: selectedSlide === idx ? 1 : 0.6,
                    transition: "all 0.3s ease",
                    padding: 0,
                    position: "relative",
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  {item.type === "video" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Play size={16} fill="#c6a45f" color="#c6a45f" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Fullscreen Lightbox ── */}
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
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
                {/* Close Button */}
                <button
                  onClick={() => setIsFullscreen(false)}
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    zIndex: 10001,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                >
                  <X size={20} />
                </button>

                {/* Fullscreen Prev */}
                <button
                  onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                  style={{
                    position: "absolute",
                    left: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10001,
                    width: "52px",
                    height: "52px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                >
                  <ChevronLeft size={24} />
                </button>

                {/* Fullscreen Next */}
                <button
                  onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10001,
                    width: "52px",
                    height: "52px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    border: "1px solid rgba(198, 164, 95, 0.4)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#ffffff",
                  }}
                >
                  <ChevronRight size={24} />
                </button>

                {/* Fullscreen Counter */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "24px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10001,
                    fontSize: "13px",
                    fontFamily: "'Poppins', sans-serif",
                    color: "#ffffff",
                    letterSpacing: "2px",
                  }}
                >
                  {selectedSlide + 1} / {totalSlides}
                </div>

                {/* Fullscreen Image */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    maxWidth: "85vw",
                    maxHeight: "85vh",
                    position: "relative",
                  }}
                >
                  <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                    <motion.img
                      key={`fs-${selectedSlide}`}
                      custom={slideDirection}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      src={mediaItems[selectedSlide].src}
                      alt={mediaItems[selectedSlide].alt}
                      style={{
                        maxWidth: "85vw",
                        maxHeight: "85vh",
                        objectFit: "contain",
                      }}
                      draggable={false}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
                {formatPrice(dynamicPrice)}
              </span>
              <span style={{ fontSize: "11px", color: "#888888" }}>
                (Includes UK VAT & Fully Insured Express Shipping)
              </span>
            </div>

            {/* Selector 1: Precious Metal */}
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
                Precious Metal:
              </label>
              <select
                value={selectedMetal}
                onChange={(e) => setSelectedMetal(e.target.value)}
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
                <option value="18ct Yellow Gold" style={{ background: "#0c0c0c" }}>
                  18ct Yellow Gold (Base)
                </option>
                <option value="18ct White Gold" style={{ background: "#0c0c0c" }}>
                  18ct White Gold (+{formatPrice(50)})
                </option>
                <option value="18ct Rose Gold" style={{ background: "#0c0c0c" }}>
                  18ct Rose Gold (+{formatPrice(50)})
                </option>
                <option value="Platinum 950" style={{ background: "#0c0c0c" }}>
                  Platinum 950 (+{formatPrice(350)})
                </option>
              </select>
            </div>

            {/* Selector 2: Diamond Carat Weight */}
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
                Diamond Carat:
              </label>
              <select
                value={selectedCarat}
                onChange={(e) => setSelectedCarat(e.target.value)}
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
                <option value="0.50ct" style={{ background: "#0c0c0c" }}>
                  0.50 Carat (Base)
                </option>
                <option value="0.75ct" style={{ background: "#0c0c0c" }}>
                  0.75 Carat (+{formatPrice(450)})
                </option>
                <option value="1.00ct" style={{ background: "#0c0c0c" }}>
                  1.00 Carat (+{formatPrice(1100)})
                </option>
                <option value="1.50ct" style={{ background: "#0c0c0c" }}>
                  1.50 Carat (+{formatPrice(2200)})
                </option>
              </select>
            </div>

            {/* Selector 3: Ring Size */}
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
                {["H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"].map((size) => (
                  <option key={size} value={size} style={{ background: "#0c0c0c" }}>
                    UK Ring Size {size} (Standard Delivery)
                  </option>
                ))}
              </select>
            </div>

            {/* Selector 4: Deposit / Payment Option */}
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
                Payment Option:
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
                  Full Payment – {formatPrice(dynamicPrice)}
                </option>
                <option value="25% Deposit" style={{ background: "#0c0c0c" }}>
                  25% Deposit – {formatPrice(dynamicPrice * 0.25)}
                </option>
                <option value="50% Deposit" style={{ background: "#0c0c0c" }}>
                  50% Deposit – {formatPrice(dynamicPrice * 0.5)}
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
              <ShoppingBag size={18} /> ADD TO CART • {formatPrice(selectedDeposit === "25% Deposit" ? dynamicPrice * 0.25 : selectedDeposit === "50% Deposit" ? dynamicPrice * 0.5 : dynamicPrice)}
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
                  href="mailto:customerservice@gamajewels.net"
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
                  <div><strong>Diamond Carat:</strong> {selectedCarat}</div>
                  <div><strong>Diamond Shape:</strong> {product.shape}</div>
                  <div><strong>Diamond Cut:</strong> Excellent Cut</div>
                  <div><strong>Clarity:</strong> {product.clarity}</div>
                  <div><strong>Color:</strong> {product.color}</div>
                  <div><strong>Certificate:</strong> {product.certification}</div>
                  <div><strong>Origin:</strong> Gama Jewels, Mumbai</div>
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

          <div className="product-trust-grid">
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

          <div className="product-related-grid">
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
      <RingsRecentlyViewed category={product.category} shape={product.shape} />

      {/* Certification Bar */}
      <CertificationBar />

      {/* Footer */}
      <Footer />
    </div>
  );
}
