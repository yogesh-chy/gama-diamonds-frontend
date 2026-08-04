"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { diamondShapes, fadeInUp } from "@/lib/constants";

export default function DiamondShapes() {
  return (
    <section
      style={{
        padding: "48px 0",
        background: "#000000",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          style={{ textAlign: "center", marginBottom: "28px" }}
        >
          <div className="section-label">PRECISION CUTS</div>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.85rem",
              color: "#ffffff",
              marginTop: "6px",
            }}
          >
            Shop By Diamond Shape
          </h2>
          <div className="section-divider" style={{ marginTop: "12px" }}></div>
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
            spaceBetween={16}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="shapes-swiper"
            style={{ paddingBottom: "36px" }}
          >
            {diamondShapes.map((item, idx) => (
              <SwiperSlide key={idx}>
                <Link
                  href={item.href}
                  className="shape-card"
                  style={{
                    padding: "0",
                    overflow: "hidden",
                    borderRadius: "0px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "stretch",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        borderRadius: "0px",
                        border: "none",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder
                      label={`${item.name}`}
                      style={{
                        aspectRatio: "1 / 1",
                        height: "auto",
                        borderRadius: "0px",
                        border: "none",
                      }}
                    />
                  )}
                  <div
                    style={{
                      padding: "10px 6px",
                      background: "#0d0d0d",
                      width: "100%",
                      textAlign: "center",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <span className="shape-name">{item.name}</span>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
