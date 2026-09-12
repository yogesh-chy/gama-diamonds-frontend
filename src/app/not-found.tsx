"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Diamond, Home, Search, ArrowLeft } from "lucide-react";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const sparkle = (delay: number): Variants => ({
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: [0, 1, 0],
    scale: [0, 1, 0],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay },
  },
});

export default function NotFound() {
  return (
    <div className="notfound-page">
      {/* Decorative sparkles */}
      <div className="notfound-sparkles">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="notfound-sparkle"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 0.4}s`,
            }}
            initial="hidden"
            animate="visible"
            variants={sparkle(i * 0.3)}
          >
            ✦
          </motion.div>
        ))}
      </div>

      <motion.div
        className="notfound-content"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Diamond Icon */}
        <motion.div variants={fadeInUp} className="notfound-icon-wrap">
          <Diamond size={40} strokeWidth={1} />
        </motion.div>

        {/* 404 Number */}
        <motion.h1 variants={fadeInUp} className="notfound-number">
          404
        </motion.h1>

        {/* Title */}
        <motion.h2 variants={fadeInUp} className="notfound-title">
          This Gem Couldn&apos;t Be Found
        </motion.h2>

        {/* Subtitle */}
        <motion.p variants={fadeInUp} className="notfound-subtitle">
          The page you&apos;re looking for may have been moved,
          removed, or is waiting to be discovered.
        </motion.p>

        {/* Divider */}
        <motion.div variants={fadeInUp} className="notfound-divider">
          <span className="notfound-divider-line" />
          <Diamond size={12} className="notfound-divider-diamond" />
          <span className="notfound-divider-line" />
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={fadeInUp} className="notfound-actions">
          <Link href="/" className="notfound-btn-primary">
            <Home size={16} />
            <span>Return Home</span>
          </Link>
          <Link href="/jewellery" className="notfound-btn-secondary">
            <Search size={16} />
            <span>Browse Collections</span>
          </Link>
        </motion.div>

        {/* Back Link */}
        <motion.div variants={fadeInUp}>
          <button
            onClick={() => window.history.back()}
            className="notfound-back-link"
          >
            <ArrowLeft size={14} />
            <span>Go Back</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
