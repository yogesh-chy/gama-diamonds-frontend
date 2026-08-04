"use client";

import { motion } from "framer-motion";
import ImagePlaceholder from "@/components/ui/ImagePlaceholder";
import { bespokeLoveStories } from "@/lib/bespokeContent";
import { fadeInUp } from "@/lib/constants";

function StoryCaption({ text }: { text: string }) {
  return (
    <span
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "11px",
        fontWeight: "600",
        letterSpacing: "2px",
        textTransform: "uppercase",
        color: "#ffffff",
        display: "block",
        textAlign: "center",
        lineHeight: 1.4,
      }}
    >
      {text}
    </span>
  );
}

export default function BespokeLoveStories() {
  return (
    <section
      style={{
        padding: "72px 0 64px",
        background: "#000000",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
          fontWeight: "600",
          color: "#ffffff",
          textAlign: "center",
          marginBottom: "40px",
          padding: "0 24px",
        }}
      >
        Love Stories We&apos;ve Been Part Of
      </motion.h2>

      <div
        className="bespoke-love-stories-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
          alignItems: "end",
          padding: "0 24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {bespokeLoveStories.map((story, idx) => (
          <motion.div
            key={story.caption}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            transition={{ delay: idx * 0.06 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%",
              minWidth: 0,
            }}
          >
            {story.captionPosition === "top" && (
              <StoryCaption text={story.caption} />
            )}

            <ImagePlaceholder
              height="420px"
              label={story.imageLabel}
              style={{ borderRadius: "0px", width: "100%", minHeight: "420px" }}
            />

            {story.captionPosition === "bottom" && (
              <StoryCaption text={story.caption} />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
