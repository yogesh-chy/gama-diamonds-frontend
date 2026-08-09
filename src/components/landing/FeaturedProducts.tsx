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
import type { Product } from "@/types";

export default function FeaturedProducts() {
  const { formatPrice } = useCurrency();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/admin/products?featured=true&status=active&limit=8")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setFeaturedProducts(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const fallbackProducts: Product[] = [
    {
      id: 1,
      name: "Novaryn Yellow Cushion Cut Diamond Ring",
      subcategory: "Trilogy Ring",
      price: 3045,
    },
    {
      id: 2,
      name: "Pear Shape Solitaire Stud Earrings",
      subcategory: "Diamond Earrings",
      price: 370,
    },
    {
      id: 3,
      name: "Round Cut Four Claw Loop Pendant",
      subcategory: "Diamond Pendant",
      price: 1020,
    },
    {
      id: 4,
      name: "Victoria 2.03ct Marquise Diamond Ring",
      subcategory: "Engagement Ring",
      price: 2400,
    },
    {
      id: 5,
      name: "Emerald Cut Platinum Eternity Band",
      subcategory: "Eternity Band",
      price: 1850,
    },
  ];

  const productsToDisplay =
    featuredProducts.length > 0 ? featuredProducts : fallbackProducts;

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
                  <ImagePlaceholder
                    height="280px"
                    label={product.name}
                    style={{ borderRadius: "0px" }}
                  />
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
