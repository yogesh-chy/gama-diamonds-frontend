"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { fadeInUp } from "@/lib/constants";
import { useCurrency } from "@/context/CurrencyContext";
import { productsApi } from "@/lib/api/products";
import type { Product } from "@/types";

export default function FeaturedProducts() {
  const { formatPrice } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

  useEffect(() => {
    productsApi
      .getProducts({ featured: true, status: "active", limit: 8 })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: Product[] = res.data.data.map((p: any) => {
            const imgUrl =
              p.thumbnail ||
              p.images?.find((i: any) => i.isPrimary || i.is_primary)?.url ||
              p.images?.[0]?.url ||
              p.variants?.[0]?.images?.[0]?.url;
            return {
              id: p.id,
              name: p.name,
              subcategory: p.category || "Fine Jewellery",
              price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
              images: imgUrl ? [imgUrl] : [],
            };
          });
          setFeaturedProducts(mapped);
        } else {
          // Fallback to general product listing if no items explicitly marked as featured
          productsApi.getProducts({ limit: 8 }).then((allRes) => {
            if (allRes.data?.data && Array.isArray(allRes.data.data)) {
              const mapped: Product[] = allRes.data.data.map((p: any) => {
                const imgUrl =
                  p.thumbnail ||
                  p.images?.find((i: any) => i.isPrimary || i.is_primary)?.url ||
                  p.images?.[0]?.url ||
                  p.variants?.[0]?.images?.[0]?.url;
                return {
                  id: p.id,
                  name: p.name,
                  subcategory: p.category || "Fine Jewellery",
                  price: typeof p.base_price === "number" ? p.base_price : parseFloat(String(p.base_price || 0)),
                  images: imgUrl ? [imgUrl] : [],
                };
              });
              setFeaturedProducts(mapped);
            }
          });
        }
      })
      .catch(() => {});
  }, []);

  const productsToDisplay = featuredProducts;

  return (
    <section style={{ padding: "80px 0", background: "#000000" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          <div className="section-label">YOU MAY ALSO LIKE</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              color: "#ffffff",
              marginTop: "8px",
            }}
          >
            Featured Recommendations
          </h2>
          <div className="section-divider" style={{ marginTop: "14px" }}></div>
        </motion.div>

        <div
          style={{
            position: "relative",
            width: "100%",
            overflow: "hidden",
            clear: "both",
            marginTop: "10px",
          }}
        >
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="recommendations-swiper"
          >
            {productsToDisplay.map((product, idx) => {
              const isHovered = hoveredId === (product.id || idx);
              return (
                <SwiperSlide key={product.id || idx} style={{ height: "auto", paddingTop: "8px", paddingBottom: "12px" }}>
                  <Link
                    href={`/product/${product.id}`}
                    style={{ display: "block", textDecoration: "none", color: "inherit", height: "100%" }}
                    onMouseEnter={() => setHoveredId(product.id || idx)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="product-card"
                      style={{
                        background: "#090909",
                        border: isHovered
                          ? "1px solid rgba(198, 164, 95, 0.55)"
                          : "1px solid rgba(255, 255, 255, 0.08)",
                        boxShadow: isHovered
                          ? "0 16px 36px rgba(0, 0, 0, 0.85), 0 0 24px rgba(198, 164, 95, 0.14)"
                          : "none",
                        borderRadius: "0px",
                        overflow: "hidden",
                        paddingBottom: "16px",
                        cursor: "pointer",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
                      }}
                    >
                      {/* Product Image Box */}
                      <div
                        style={{
                          width: "100%",
                          height: "280px",
                          overflow: "hidden",
                          position: "relative",
                          backgroundColor: "#111111",
                        }}
                      >
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                              transform: isHovered ? "scale(1.08)" : "scale(1)",
                            }}
                          />
                        ) : (
                          <ImagePlaceholder
                            height="280px"
                            label={product.name}
                            style={{ borderRadius: "0px" }}
                          />
                        )}

                        {/* Quick action button overlay */}
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.22 }}
                              style={{
                                position: "absolute",
                                bottom: "12px",
                                left: "12px",
                                right: "12px",
                                display: "flex",
                                zIndex: 4,
                              }}
                            >
                              <div
                                style={{
                                  width: "100%",
                                  background: "#c6a45f",
                                  color: "#000000",
                                  padding: "9px 12px",
                                  fontSize: "9.5px",
                                  fontWeight: "700",
                                  letterSpacing: "1.5px",
                                  textTransform: "uppercase",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "6px",
                                  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.6)",
                                }}
                              >
                                <ShoppingBag size={12} />
                                <span>View Piece</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Product Info */}
                      <div style={{ padding: "16px 16px 0", textAlign: "center" }}>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#c6a45f",
                            letterSpacing: "1.2px",
                            textTransform: "uppercase",
                            marginBottom: "5px",
                            fontWeight: "600",
                          }}
                        >
                          {product.subcategory || "Fine Jewellery"}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "14px",
                            color: isHovered ? "#c6a45f" : "#ffffff",
                            fontWeight: "600",
                            marginBottom: "8px",
                            height: "40px",
                            overflow: "hidden",
                            transition: "color 0.3s ease",
                            lineHeight: "1.4",
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          style={{
                            color: "#c6a45f",
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: "700",
                            fontSize: "15px",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {formatPrice(product.price || 1200)}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
