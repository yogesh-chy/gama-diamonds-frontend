"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

  useEffect(() => {
    productsApi
      .getProducts({ featured: true, status: "active", limit: 8 })
      .then((res) => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const mapped: Product[] = res.data.data.map((p: any) => {
            const imgUrl = p.thumbnail || p.images?.find((i: any) => i.isPrimary || i.is_primary)?.url || p.images?.[0]?.url || p.variants?.[0]?.images?.[0]?.url;
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
                const imgUrl = p.thumbnail || p.images?.find((i: any) => i.isPrimary || i.is_primary)?.url || p.images?.[0]?.url || p.variants?.[0]?.images?.[0]?.url;
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
            {productsToDisplay.map((product, idx) => (
              <SwiperSlide key={product.id || idx}>
                <div
                  style={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "0px",
                    overflow: "hidden",
                    paddingBottom: "16px",
                  }}
                >
                  {product.images && product.images.length > 0 && product.images[0] ? (
                    <div style={{ width: "100%", height: "280px", overflow: "hidden", position: "relative" }}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                  ) : (
                    <ImagePlaceholder
                      height="280px"
                      label={product.name}
                      style={{ borderRadius: "0px" }}
                    />
                  )}
                  <div
                    style={{ padding: "16px 16px 0", textAlign: "center" }}
                  >
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#c6a45f",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {product.subcategory || "Fine Jewellery"}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "14px",
                        color: "#ffffff",
                        fontWeight: "600",
                        marginBottom: "8px",
                        height: "40px",
                        overflow: "hidden",
                      }}
                    >
                      {product.name}
                    </div>
                    <div
                      style={{
                        color: "#c6a45f",
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {formatPrice(product.price || 1200)}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
