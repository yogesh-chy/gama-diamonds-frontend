"use client";

import { motion, type Variants } from "framer-motion";
import {
  RotateCcw,
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const returnSteps = [
  {
    icon: Package,
    title: "Initiate Return",
    desc: "Contact us within 7 days of delivery with your order number and reason for return.",
  },
  {
    icon: CheckCircle2,
    title: "Approval",
    desc: "Our team reviews your request and provides a return shipping label within 24 hours.",
  },
  {
    icon: Truck,
    title: "Ship It Back",
    desc: "Pack the item securely in its original packaging and ship using the provided label.",
  },
  {
    icon: RotateCcw,
    title: "Refund Processed",
    desc: "Once inspected, your refund is processed within 5-7 business days to the original payment method.",
  },
];

const eligibleItems = [
  "Unworn jewellery in original condition with all tags attached",
  "Items returned within 7 days of delivery",
  "Products with original certification and packaging",
  "Items purchased at full price (sale items eligible for exchange only)",
];

const nonEligibleItems = [
  "Custom or bespoke-made jewellery (made-to-order pieces)",
  "Engraved or personalised items",
  "Items showing signs of wear, damage, or alteration",
  "Items returned after the 7-day return window",
  "Gift cards and vouchers",
];

export default function ReturnPolicyPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <Header />

      {/* ── Hero ── */}
      <section className="policy-hero">
        <div className="policy-hero-overlay" />
        <motion.div
          className="policy-hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="policy-hero-badge">
            <RotateCcw size={14} />
            <span>RETURN & REFUND</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Return & Refund Policy
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Your satisfaction is our priority. We make returns simple and hassle-free.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Return Process ── */}
      <section className="policy-section">
        <div className="policy-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="policy-section-title">
              How Returns Work
            </motion.h2>
            <motion.div variants={fadeInUp} className="policy-steps-grid">
              {returnSteps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="policy-step-card">
                    <div className="policy-step-number">{String(i + 1).padStart(2, "0")}</div>
                    <div className="policy-step-icon-wrap">
                      <Icon size={22} />
                    </div>
                    <h3 className="policy-step-title">{step.title}</h3>
                    <p className="policy-step-desc">{step.desc}</p>
                    {i < returnSteps.length - 1 && (
                      <div className="policy-step-arrow">
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Eligibility ── */}
      <section className="policy-section policy-section-alt">
        <div className="policy-inner">
          <motion.div
            className="policy-eligibility-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {/* Eligible */}
            <motion.div variants={fadeInUp} className="policy-eligibility-card policy-eligible">
              <div className="policy-eligibility-header">
                <CheckCircle2 size={20} />
                <h3>Eligible for Return</h3>
              </div>
              <ul className="policy-eligibility-list">
                {eligibleItems.map((item, i) => (
                  <li key={i}>
                    <CheckCircle2 size={14} className="policy-list-icon-ok" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Not Eligible */}
            <motion.div variants={fadeInUp} className="policy-eligibility-card policy-not-eligible">
              <div className="policy-eligibility-header">
                <XCircle size={20} />
                <h3>Not Eligible</h3>
              </div>
              <ul className="policy-eligibility-list">
                {nonEligibleItems.map((item, i) => (
                  <li key={i}>
                    <XCircle size={14} className="policy-list-icon-no" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Refund Details ── */}
      <section className="policy-section">
        <div className="policy-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="policy-refund-content"
          >
            <motion.h2 variants={fadeInUp} className="policy-section-title">
              Refund Information
            </motion.h2>

            <motion.div variants={fadeInUp} className="policy-info-cards">
              <div className="policy-info-card">
                <Clock size={20} className="policy-info-icon" />
                <h4>Processing Time</h4>
                <p>Refunds are processed within 5–7 business days after we receive and inspect your return.</p>
              </div>
              <div className="policy-info-card">
                <ShieldCheck size={20} className="policy-info-icon" />
                <h4>Refund Method</h4>
                <p>Refunds are credited to the original payment method. Bank processing may take an additional 3–5 days.</p>
              </div>
              <div className="policy-info-card">
                <AlertTriangle size={20} className="policy-info-icon" />
                <h4>Partial Refunds</h4>
                <p>Items returned with signs of wear or missing packaging may be subject to a restocking fee of up to 15%.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp} className="policy-note">
              <ShieldCheck size={16} />
              <span>
                For any questions about returns, contact us at{" "}
                <a href="mailto:gama.diamond10@gmail.com" className="policy-link">
                  gama.diamond10@gmail.com
                </a>{" "}
                or call{" "}
                <a href="tel:+919869800084" className="policy-link">
                  +91 9869800084
                </a>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
