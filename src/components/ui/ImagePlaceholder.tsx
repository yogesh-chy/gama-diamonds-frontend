import React, { CSSProperties } from "react";
import { Gem } from "lucide-react";

interface ImagePlaceholderProps {
  width?: string;
  height?: string;
  label?: string;
  aspectRatio?: string;
  className?: string;
  style?: CSSProperties;
}

export default function ImagePlaceholder({
  width = "100%",
  height = "100%",
  label = "Gama Fine Jewels",
  aspectRatio,
  className = "",
  style = {},
}: ImagePlaceholderProps) {
  // Never show raw dummy "placeholder" words to the user
  const displayLabel =
    !label || /placeholder/i.test(label) ? "Gama Jewels" : label;

  return (
    <div
      className={`img-placeholder-box ${className}`}
      style={{
        width: width,
        height: height,
        aspectRatio: aspectRatio,
        backgroundColor: "#0d0d0d",
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(198, 164, 95, 0.06) 0%, rgba(0, 0, 0, 0.95) 75%)",
        border: "1px solid rgba(198, 164, 95, 0.15)",
        borderRadius: "0px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#c6a45f",
        position: "relative",
        overflow: "hidden",
        padding: "16px",
        textAlign: "center",
        ...style,
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "rgba(198, 164, 95, 0.08)",
          border: "1px solid rgba(198, 164, 95, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "10px",
        }}
      >
        <Gem
          size={22}
          strokeWidth={1.2}
          style={{ color: "#c6a45f", opacity: 0.85 }}
        />
      </div>
      <span
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "11px",
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#dddddd",
          maxWidth: "85%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {displayLabel}
      </span>
      <span
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: "8.5px",
          letterSpacing: "1.8px",
          textTransform: "uppercase",
          color: "rgba(198, 164, 95, 0.7)",
          marginTop: "4px",
        }}
      >
        Atelier Masterpiece
      </span>
    </div>
  );
}
