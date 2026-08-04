import React, { CSSProperties } from "react";
import { Gem } from "lucide-react";

interface ImagePlaceholderProps {
  height?: string;
  label?: string;
  className?: string;
  style?: CSSProperties;
}

export default function ImagePlaceholder({
  height = "100%",
  label = "Image Placeholder",
  className = "",
  style = {},
}: ImagePlaceholderProps) {
  return (
    <div
      className={`img-placeholder-box ${className}`}
      style={{
        width: "100%",
        height: height,
        backgroundColor: "#141414",
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#666666",
        position: "relative",
        overflow: "hidden",
        padding: "16px",
        textAlign: "center",
        ...style,
      }}
    >
      <Gem
        size={28}
        strokeWidth={1}
        style={{ color: "#c6a45f", opacity: 0.4, marginBottom: "8px" }}
      />
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "11px",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.35)",
        }}
      >
        {label}
      </span>
    </div>
  );
}
