"use client";

import { motion, type Variants } from "framer-motion";
import {
  ScrollText,
  ShieldCheck,
  Building2,
  TrendingUp,
  Gem,
  FileCheck,
  UserCheck,
  Ban,
  Scale,
  Phone,
  Mail,
  MapPin,
  FileText,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const termsSections = [
  {
    icon: Building2,
    number: "01",
    title: "Corporate Identity & Acceptance of Terms",
    content: [
      "This website (www.gamajewels.com) is owned and operated by Gama Jewels, having its registered office at SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI (E.) MUMBAI 400059, Maharashtra, India.",
      "Please read these Terms and Conditions carefully before accessing or using the services provided by this Website. In accessing and using this Website, you signify your consent and explicit agreement to be bound by these Terms and Conditions.",
      "Gama Jewels reserves the right to revise, update, or replace these Terms and Conditions from time to time without any obligation to provide prior direct notice. It remains your responsibility to check this page periodically for updates.",
      "Any updates to these Terms and Conditions take effect immediately upon the date of posting, and continued access constitutes acceptance of the revised terms.",
    ],
  },
  {
    icon: TrendingUp,
    number: "02",
    title: "Prevailing Rates & Valuation",
    content: [
      "Any reference to prevailing rates in physical or electronic publications refers to the city-wise prevailing rate of precious metals (Gold, Platinum) or precious stones (Diamonds, Rubies, Emeralds, Sapphires) applicable at the precise time of the transaction.",
      "Such prevailing rates are intra-day Company benchmark rates that are determined by multiple dynamic economic factors, including but not limited to global spot rates, bullion market movements, freight, vaulting/storage costs, rentals, and atelier overheads.",
      "Gama Jewels applies these prevailing rates in all valuations, order pricings, exchanges, and buyback transactions by default unless any alternative rate is specifically agreed upon in writing.",
    ],
  },
  {
    icon: Gem,
    number: "03",
    title: "Sustainable & Ethical Sourcing Practice",
    content: [
      "Gama Jewels endeavours and undertakes all reasonable efforts, skill, care, and due diligence in sourcing precious metals and gemstones solely from legitimate, conflict-free origins.",
      "We strictly follow the Kimberley Process and do not entertain the purchase, manufacturing, or distribution of any metals or stones suspected to originate from conflict zones (including conflict diamonds).",
      "Every certified solitaire diamond sold on www.gamajewels.com is accompanied by an authentic grading report from globally recognized laboratories such as GIA or AnchorCert.",
    ],
  },
  {
    icon: FileCheck,
    number: "04",
    title: "Statutory Requirement of PAN Card",
    content: [
      "As mandated under the provisions of the Income Tax Act, 1961 and Rules framed thereunder (India), for any single purchase or cumulative order exceeding INR 2,00,000 (Indian Rupees Two Lakhs), the purchaser must provide their valid Permanent Account Number (PAN) Card at the time of transaction.",
      "The customer must input their PAN number and complete digital PAN verification prior to reaching the payment gateway.",
      "The Billing Name on the order must match the name registered on the PAN Card exactly. Mismatches will cause verification failure, preventing completion of the order.",
      "Failure or refusal to provide genuine PAN credentials shall result in automatic and mandatory cancellation of the order.",
    ],
  },
  {
    icon: UserCheck,
    number: "05",
    title: "KYC & Background Verification",
    content: [
      "Gama Jewels reserves the right to request original KYC documents—including government-issued photo identification (Aadhaar, Passport, Voter ID) and proof of residential address.",
      "You may also be required to submit certified, attested, or notarised physical or digital copies of documents for transactions including purchases, returns, refunds, exchanges, and buybacks.",
      "Gama Jewels reserves the right to conduct comprehensive background checks, directly or through accredited third-party verification agencies, to confirm the bona fides of the customer or authenticate goods presented under return, exchange, or buyback.",
    ],
  },
  {
    icon: Ban,
    number: "06",
    title: "Purchase Restrictions & Discretion of Sale",
    content: [
      "Gama Jewels reserves the right, at its sole discretion, to limit the quantity or total financial value of items purchased per person, per household, or per order.",
      "These restrictions may encompass orders placed using the same client account, identical credit/debit cards, identical PAN cards, or matching billing and shipping addresses.",
      "Gama Jewels will provide timely notification to the customer should such purchase limitations or security holds be applied.",
      "Gama Jewels reserves the absolute right at its sole discretion to decline, withhold, or cancel any sale for any reason without liability.",
    ],
  },
  {
    icon: Scale,
    number: "07",
    title: "Governing Law & Legal Jurisdiction",
    content: [
      "These Terms and Conditions shall be governed by and construed in accordance with the substantive laws of the Republic of India.",
      "The company reserves the right to exercise sole discretion in permitting all exchanges, returns, and buybacks.",
      "Subject to applicable statutory requirements, all disputes, claims, or proceedings arising out of or in connection with transactions on www.gamajewels.com shall be subject to the exclusive jurisdiction of the competent courts at Mumbai, Maharashtra / Calicut, Kerala.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
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
            <span>LEGAL & COMPLIANCE</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Terms & Conditions
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Please read these terms and conditions carefully before accessing our atelier services or making a purchase on www.gamajewels.com.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Content ── */}
      <section className="policy-section">
        <div className="policy-inner" style={{ maxWidth: "960px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={stagger}
            className="terms-content"
          >
            {/* Registered Entity Header Card */}
            <motion.div
              variants={fadeInUp}
              style={{
                background: "linear-gradient(145deg, #100e0b, #080808)",
                border: "1px solid rgba(198, 164, 95, 0.25)",
                padding: "28px 32px",
                marginBottom: "36px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c6a45f", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
                <Building2 size={15} /> Registered Corporate Entity
              </div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", margin: 0 }}>
                Gama Jewels
              </h3>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#aaaaaa", margin: 0 }}>
                Registered Office: <strong style={{ color: "#ffffff" }}>SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI (E.) MUMBAI 400059, Maharashtra</strong><br />
                GSTIN: <strong style={{ color: "#c6a45f" }}>27ASQPD0518A1Z8</strong> &nbsp;|&nbsp; PAN: <strong style={{ color: "#c6a45f" }}>ASQPD0518A</strong>
              </p>
            </motion.div>

            <motion.p variants={fadeInUp} className="terms-effective">
              Official Terms for <strong style={{ color: "#c6a45f" }}>www.gamajewels.com</strong> &nbsp;·&nbsp; Effective Upon Access
            </motion.p>

            {/* Sections */}
            {termsSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div key={i} variants={fadeInUp} className="terms-section-block">
                  <div className="terms-section-header">
                    <div className="terms-section-icon-wrap">
                      <Icon size={18} />
                    </div>
                    <h2 className="terms-section-heading">
                      <span className="terms-section-number">{section.number}.</span>
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

            {/* Inquiries Banner */}
            <motion.div
              variants={fadeInUp}
              style={{
                marginTop: "48px",
                background: "linear-gradient(145deg, #12100d, #090909)",
                border: "1px solid rgba(198, 164, 95, 0.25)",
                padding: "32px 24px",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "20px",
              }}
            >
              <div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#ffffff", marginBottom: "4px" }}>
                  Questions Regarding Our Terms?
                </h4>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#888888", margin: 0 }}>
                  Contact our compliance and client care team for any clarifications.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", fontSize: "12.5px" }}>
                <a href="tel:+919869800084" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#c6a45f", textDecoration: "none" }}>
                  <Phone size={14} /> +91 9869800084
                </a>
                <a href="mailto:Support@gamajewels.com" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#c6a45f", textDecoration: "none" }}>
                  <Mail size={14} /> Support@gamajewels.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
