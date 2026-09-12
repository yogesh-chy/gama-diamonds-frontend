"use client";

import { motion, type Variants } from "framer-motion";
import {
  ScrollText,
  ShieldCheck,
  AlertTriangle,
  Scale,
  CreditCard,
  Lock,
  Globe,
  Gavel,
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
  visible: { transition: { staggerChildren: 0.1 } },
};

const sections = [
  {
    icon: Scale,
    title: "General Terms",
    content: [
      "By accessing and using the Gama Jewels website (gamajewels.net), you agree to be bound by these Terms & Conditions.",
      "These terms apply to all visitors, users, and customers of the website.",
      "We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance of the revised terms.",
      "You must be at least 18 years of age to make a purchase on this website.",
    ],
  },
  {
    icon: CreditCard,
    title: "Orders & Payment",
    content: [
      "All prices are listed in INR (₹) and are inclusive of applicable taxes unless stated otherwise.",
      "We accept payments via Visa, Mastercard, UPI, American Express, and bank transfers.",
      "An order is confirmed only after successful payment processing and receipt of a confirmation email.",
      "We reserve the right to cancel or refuse any order at our discretion, with a full refund in such cases.",
      "Custom and bespoke orders require a 50% advance payment, with the balance due before shipping.",
    ],
  },
  {
    icon: Globe,
    title: "Product Information",
    content: [
      "We strive to display products as accurately as possible. However, slight variations in colour, size, and appearance may occur due to screen settings.",
      "All diamonds are accompanied by GIA or equivalent certification.",
      "Product availability is subject to change without prior notice.",
      "Weights and measurements listed are approximate and may vary slightly from the actual product.",
    ],
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    content: [
      "Your personal information is collected solely for order processing, delivery, and improving your experience.",
      "We do not sell, trade, or share your personal data with third parties except as necessary for order fulfilment.",
      "All payment transactions are encrypted and processed through secure payment gateways.",
      "You may request deletion of your account data by contacting us at gama.diamond10@gmail.com.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Guarantee",
    content: [
      "All jewellery comes with a lifetime warranty covering manufacturing defects.",
      "The warranty does not cover damage caused by misuse, negligence, or unauthorised modifications.",
      "Complimentary cleaning and maintenance services are offered for all Gama Jewels products.",
      "Certificate authenticity can be verified through the respective certification body's website.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      "Gama Jewels shall not be liable for any indirect, incidental, or consequential damages arising from use of this website.",
      "Our total liability for any claim shall not exceed the purchase price of the product in question.",
      "We are not responsible for delays or failures caused by circumstances beyond our reasonable control.",
    ],
  },
  {
    icon: Gavel,
    title: "Governing Law",
    content: [
      "These terms are governed by the laws of India.",
      "Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.",
      "If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force.",
    ],
  },
];

export default function TermsPage() {
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
            <ScrollText size={14} />
            <span>LEGAL</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Terms & Conditions
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Please read these terms carefully before using our services.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <section className="policy-section">
        <div className="policy-inner" style={{ maxWidth: "900px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={stagger}
            className="terms-content"
          >
            <motion.p variants={fadeInUp} className="terms-effective">
              Effective Date: January 1, 2025 &nbsp;·&nbsp; Last Updated: September 2025
            </motion.p>

            {sections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div key={i} variants={fadeInUp} className="terms-section-block">
                  <div className="terms-section-header">
                    <div className="terms-section-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <h2 className="terms-section-heading">
                      <span className="terms-section-number">{String(i + 1).padStart(2, "0")}.</span>
                      {section.title}
                    </h2>
                  </div>
                  <ul className="terms-section-list">
                    {section.content.map((point, j) => (
                      <li key={j} className="terms-section-item">
                        <span className="terms-bullet" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}

            <motion.div variants={fadeInUp} className="policy-note" style={{ marginTop: "48px" }}>
              <ShieldCheck size={16} />
              <span>
                For questions about these terms, contact us at{" "}
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
