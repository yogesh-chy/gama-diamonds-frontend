"use client";

import ImagePlaceholder from "@/components/ui/ImagePlaceholder";

export default function GalleryGrid() {
  return (
    <section style={{ padding: "40px 0 60px", background: "#050505" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
          }}
        >
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <ImagePlaceholder
              key={item}
              height="220px"
              label={`Gallery Slot ${item}`}
              style={{ borderRadius: "0px" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
