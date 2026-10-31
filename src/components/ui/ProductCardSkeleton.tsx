"use client";

import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";

interface ProductCardSkeletonProps {
  count?: number;
  message?: string;
}

export function ProductCardSkeletonItem() {
  return (
    <div
      style={{
        backgroundColor: "#090909",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        borderRadius: "2px",
      }}
    >
      {/* Shimmer sweep overlay */}
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "linear",
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(198, 164, 95, 0.08) 50%, transparent 100%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Image Skeleton Box */}
      <div
        style={{
          width: "100%",
          paddingTop: "100%", // 1:1 Aspect Ratio
          position: "relative",
          backgroundColor: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <motion.div
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={22} color="#c6a45f" />
          </motion.div>
        </div>
      </div>

      {/* Card Body Skeleton */}
      <div
        style={{
          padding: "16px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "#090909",
        }}
      >
        {/* Subtitle / Metal Bar */}
        <div
          style={{
            height: "9px",
            width: "45%",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "2px",
          }}
        />

        {/* Title Bar 1 */}
        <div
          style={{
            height: "13px",
            width: "85%",
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            borderRadius: "2px",
          }}
        />

        {/* Title Bar 2 (shorter) */}
        <div
          style={{
            height: "13px",
            width: "60%",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "2px",
          }}
        />

        {/* Price Bar */}
        <div
          style={{
            height: "15px",
            width: "35%",
            backgroundColor: "rgba(198, 164, 95, 0.25)",
            borderRadius: "2px",
            marginTop: "6px",
          }}
        />
      </div>
    </div>
  );
}

export default function ProductGridSkeleton({
  count = 8,
  message = "Curating Fine Diamond Collection...",
}: ProductCardSkeletonProps) {
  const items = Array.from({ length: count });

  return (
    <div style={{ width: "100%" }}>
      {/* Elegant Loading Status Banner */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          padding: "18px 24px",
          marginBottom: "24px",
          backgroundColor: "rgba(198, 164, 95, 0.04)",
          border: "1px solid rgba(198, 164, 95, 0.15)",
          borderRadius: "2px",
        }}
      >
        <Loader2 size={16} className="animate-spin" color="#c6a45f" />
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "12px",
            fontWeight: 500,
            letterSpacing: "1.5px",
            color: "#c6a45f",
            textTransform: "uppercase",
          }}
        >
          {message}
        </span>
      </div>

      {/* Grid of Skeleton Cards */}
      <div className="rings-product-grid">
        {items.map((_, idx) => (
          <ProductCardSkeletonItem key={idx} />
        ))}
      </div>
    </div>
  );
}

