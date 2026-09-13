"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
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
  Video,
  FileCheck,
  Percent,
  Gem,
  Coins,
  Sparkles,
  Phone,
  Mail,
  Scale,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

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

const returnSteps = [
  {
    step: "01",
    icon: Mail,
    title: "Initiate Request",
    desc: "Email Support@gamajewels.com with your Order Number and details of any manufacturing defect within 14 days of delivery.",
  },
  {
    step: "02",
    icon: Package,
    title: "Return Packaging Kit",
    desc: "Gama Jewels dispatches a tamper-evident Return Packaging Kit directly to your address for safe, secure transit.",
  },
  {
    step: "03",
    icon: Video,
    title: "WhatsApp Video Packing",
    desc: "Record a continuous video while packing the item into the kit. Send via WhatsApp with your Order ID to 09869-800-084 within 2 days.",
  },
  {
    step: "04",
    icon: Truck,
    title: "Insured Pickup & QC",
    desc: "We arrange backward courier pickup (7–10 working days). Upon receipt, our expert quality department performs thorough QC.",
  },
  {
    step: "05",
    icon: RotateCcw,
    title: "Refund in 10 Days",
    desc: "Upon QC approval, full refund is credited to your original payment account within 10 business days. (No cash refunds).",
  },
];

const eligibleConditions = [
  "Return requested strictly within 14 days from the date of delivery.",
  "Product returned in unworn, brand-new original condition.",
  "Accompanied by all original packaging, invoices, and insurance / diamond certificates.",
  "Applicable solely to purchases made on the official website www.gamajewels.com.",
  "Covers items with verified manufacturing defects.",
];

const nonEligibleConditions = [
  "Orders valued at ₹2,00,000 (₹2 Lakhs) and above.",
  "Nose Pins, Gold Coins, Silver Coins, and Silver Articles.",
  "Gold Rakhi, Watches, and promotional / discounted purchases.",
  "Smart Buy (Make-to-Order), bespoke customizations, engravings, and personalized items.",
  "Gift cards and promotional vouchers.",
  "Jewellery damaged due to mishandling, wear, or negligence (eligible for repair only).",
];

const exchangeRatesAfter14Days = [
  {
    category: "Gold Jewellery",
    rate: "100% of Benchmark Gold Rate",
    details: "Valued against the prevailing city-wise intra-day gold benchmark.",
  },
  {
    category: "Diamond Jewellery",
    rate: "100% Gold Rate + 100% Diamond Carat Rate",
    details: "100% gold rate + 100% prevailing diamond rate (minus purchase discount).",
  },
  {
    category: "Era / Uncut Jewellery",
    rate: "100% Gold Rate + 100% Uncut Diamond Value",
    details: "100% gold rate + 100% invoice bill value of uncut diamond (minus discount).",
  },
  {
    category: "Precia / Precious Gemstones",
    rate: "100% Gold Rate + 75% Stone Invoice Value",
    details: "Applies to Rubies, Emeralds, and Sapphires (minus purchase discount).",
  },
  {
    category: "Solitaire Loose Diamonds",
    rate: "100% Prevailing Diamond Carat Rate",
    details: "Calculated at prevailing carat benchmark of the day (minus discount).",
  },
  {
    category: "Solitaire Studded Jewellery",
    rate: "100% Gold Rate + 100% Solitaire Carat Rate",
    details: "100% gold benchmark + 100% prevailing solitaire rate (minus discount).",
  },
  {
    category: "Platinum Jewellery",
    rate: "100% Platinum Rate + 100% Diamond Value",
    details: "100% of benchmark platinum rate + 100% of prevailing diamond value.",
  },
  {
    category: "Gold Coins",
    rate: "100% of Benchmark Gold Rate",
    details: "100% of prevailing gold bullion benchmark rate of the day.",
  },
];

export default function ReturnPolicyPage() {
  const [activeTab, setActiveTab] = useState<"return" | "exchange">("return");

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
            <RotateCcw size={14} />
            <span>ASSURANCE & TRANSPARENCY</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Return & Exchange Policy
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            14-Day Return Guarantee, seamless video verification, and transparent exchange valuation at prevailing market rates.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Tab Switcher ── */}
      <section style={{ borderBottom: "1px solid rgba(198, 164, 95, 0.2)", background: "#050505", position: "sticky", top: "72px", zIndex: 10 }}>
        <div className="policy-inner" style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "14px 24px" }}>
          <button
            onClick={() => setActiveTab("return")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: activeTab === "return" ? "rgba(198, 164, 95, 0.15)" : "transparent",
              border: activeTab === "return" ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.1)",
              color: activeTab === "return" ? "#c6a45f" : "#888888",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <RotateCcw size={16} />
            14-Day Return & Refund Policy
          </button>

          <button
            onClick={() => setActiveTab("exchange")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: activeTab === "exchange" ? "rgba(198, 164, 95, 0.15)" : "transparent",
              border: activeTab === "exchange" ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.1)",
              color: activeTab === "exchange" ? "#c6a45f" : "#888888",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <RefreshCw size={16} />
            Exchange & Buyback Valuation
          </button>
        </div>
      </section>

      {/* ── Main Tab Content ── */}
      <div className="policy-inner" style={{ padding: "48px 24px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "return" ? (
            <motion.div
              key="return"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Introduction Callout */}
              <div
                style={{
                  background: "linear-gradient(145deg, #100e0b, #080808)",
                  border: "1px solid rgba(198, 164, 95, 0.25)",
                  padding: "28px 32px",
                  marginBottom: "40px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c6a45f", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
                  <Sparkles size={14} /> Official Website Policy
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "8px" }}>
                  14-Day Return & Manufacturing Defect Guarantee
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#aaaaaa", margin: 0 }}>
                  At Gama Jewels, we strive to ensure absolute satisfaction with our jewellery. If you find any manufacturing defect in your purchase made on <strong style={{ color: "#ffffff" }}>www.gamajewels.com</strong>, customers are entitled to initiate a return within <strong>14 days</strong> from the date of delivery. During this period, you may choose to retain the item, exchange it for an alternative, or request a full refund.
                  <br />
                  <em style={{ color: "#777777", fontSize: "12px", display: "inline-block", marginTop: "6px" }}>
                    * Please note: This refund policy applies exclusively to purchases on www.gamajewels.com and is not applicable to physical retail stores or third-party marketplaces.
                  </em>
                </p>
              </div>

              {/* 5-Step Return Process */}
              <div style={{ marginBottom: "48px" }}>
                <h2 className="policy-section-title" style={{ textAlign: "left", marginBottom: "24px" }}>
                  Step-by-Step Return Process
                </h2>

                <div className="return-steps-5grid">
                  {returnSteps.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div
                        key={i}
                        style={{
                          background: "linear-gradient(145deg, #0e0e0e, #070707)",
                          border: "1px solid rgba(255, 255, 255, 0.07)",
                          padding: "24px 18px",
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontFamily: "'Playfair Display', serif",
                              fontSize: "1.6rem",
                              color: "rgba(198, 164, 95, 0.25)",
                              display: "block",
                              marginBottom: "8px",
                            }}
                          >
                            {s.step}
                          </span>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "50%",
                              background: "rgba(198, 164, 95, 0.08)",
                              border: "1px solid rgba(198, 164, 95, 0.2)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#c6a45f",
                              marginBottom: "12px",
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <h4
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "13px",
                              fontWeight: 600,
                              color: "#ffffff",
                              marginBottom: "8px",
                            }}
                          >
                            {s.title}
                          </h4>
                          <p
                            style={{
                              fontFamily: "'Poppins', sans-serif",
                              fontSize: "11.5px",
                              lineHeight: "1.6",
                              color: "#888888",
                              margin: 0,
                            }}
                          >
                            {s.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Video Packing Requirement Box */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(198,164,95,0.08) 0%, rgba(10,10,10,0.95) 100%)",
                  border: "1px solid rgba(198, 164, 95, 0.35)",
                  padding: "30px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  marginBottom: "44px",
                }}
              >
                <div
                  style={{
                    background: "rgba(198, 164, 95, 0.15)",
                    padding: "12px",
                    borderRadius: "50%",
                    color: "#c6a45f",
                    flexShrink: 0,
                  }}
                >
                  <Video size={24} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.2rem",
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    Mandatory WhatsApp Video Requirement
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      lineHeight: "1.75",
                      color: "#cccccc",
                      marginBottom: "10px",
                    }}
                  >
                    Upon contacting support, Gama Jewels dispatches a complimentary <strong>"Return Packaging Kit"</strong>. Customers are requested to record a continuous unedited video of the jewellery being securely packed into this kit and send it via WhatsApp with their Order ID to <strong style={{ color: "#c6a45f" }}>09869-800-084</strong> within <strong>2 days</strong> of receiving the kit.
                  </p>
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11.5px",
                      color: "#888888",
                      margin: 0,
                    }}
                  >
                    * This video serves as verifiable mutual confirmation of the product's intact condition prior to transit handover.
                  </p>
                </div>
              </div>

              {/* Eligibility & Exclusions Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "28px",
                  marginBottom: "48px",
                }}
              >
                {/* Eligible */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(80, 200, 120, 0.25)",
                    padding: "30px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#50c878", marginBottom: "18px" }}>
                    <CheckCircle2 size={20} />
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14.5px", fontWeight: 600, margin: 0 }}>
                      Eligible for Return & Refund
                    </h3>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {eligibleConditions.map((item, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#bbbbbb", lineHeight: "1.6" }}>
                        <CheckCircle2 size={14} style={{ color: "#50c878", marginTop: "3px", flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not Eligible */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 80, 80, 0.2)",
                    padding: "30px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#ff5050", marginBottom: "18px" }}>
                    <XCircle size={20} />
                    <h3 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "14.5px", fontWeight: 600, margin: 0 }}>
                      Non-Refundable Categories & Exclusions
                    </h3>
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {nonEligibleConditions.map((item, idx) => (
                      <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "12.5px", color: "#bbbbbb", lineHeight: "1.6" }}>
                        <XCircle size={14} style={{ color: "#ff5050", marginTop: "3px", flexShrink: 0 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Refund Processing Terms */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #080808)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "32px",
                  marginBottom: "40px",
                }}
              >
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", color: "#ffffff", marginBottom: "16px" }}>
                  Refund Processing & Payment Terms
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", padding: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h5 style={{ color: "#c6a45f", fontSize: "13px", marginBottom: "6px" }}>10 Business Days Timeline</h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      Refunds are initiated within 10 business days from the date of receiving and verifying the returned product at our inspection atelier.
                    </p>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", padding: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h5 style={{ color: "#c6a45f", fontSize: "13px", marginBottom: "6px" }}>Original Payment Mode Only</h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      Refunds are credited exclusively to the original payment source. <strong>No Cash refund is admissible</strong>, and amounts cannot be transferred to third-party bank accounts.
                    </p>
                  </div>

                  <div style={{ background: "rgba(255,255,255,0.02)", padding: "18px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <h5 style={{ color: "#c6a45f", fontSize: "13px", marginBottom: "6px" }}>Mishandling & Stone Care</h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      No guarantee is provided for breakage, falling of stones, or chipping of enamel caused by mishandling. Customised jewellery cannot be replaced and is eligible for repair only.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="exchange"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* 14-Day Full Value Exchange Banner */}
              <div
                style={{
                  background: "linear-gradient(145deg, #100e0b, #080808)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  padding: "32px",
                  marginBottom: "40px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c6a45f", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
                  <Gem size={14} /> Within 14 Days of Delivery
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#ffffff", marginBottom: "12px" }}>
                  100% Full Value Exchange (No Making Charge Deductions)
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#b0b0b0", marginBottom: "18px" }}>
                  Customers can exchange any Gold Jewellery, Diamond, or precious gemstone jewellery purchased from <strong style={{ color: "#ffffff" }}>www.gamajewels.com</strong> at <strong>100% full value without deduction of making charges</strong> within 14 days of delivery, provided the jewellery is in its original, unused condition.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                    gap: "14px",
                  }}
                >
                  <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderLeft: "3px solid #c6a45f" }}>
                    <span style={{ fontSize: "12px", color: "#c6a45f", fontWeight: 600 }}>QC Inspection Period:</span>
                    <p style={{ fontSize: "11.5px", color: "#888888", margin: "4px 0 0" }}>Takes up to 4 working days post product receipt by our certified laboratory.</p>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderLeft: "3px solid #c6a45f" }}>
                    <span style={{ fontSize: "12px", color: "#c6a45f", fontWeight: 600 }}>Invoice & Certificates:</span>
                    <p style={{ fontSize: "11.5px", color: "#888888", margin: "4px 0 0" }}>Must be accompanied by original tax invoice and accompanying diamond certification.</p>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.5)", padding: "14px 18px", borderLeft: "3px solid #c6a45f" }}>
                    <span style={{ fontSize: "12px", color: "#c6a45f", fontWeight: 600 }}>Single Exchange Policy:</span>
                    <p style={{ fontSize: "11.5px", color: "#888888", margin: "4px 0 0" }}>Only one such exchange is permitted per invoice. Ornaments cannot be exchanged in part.</p>
                  </div>
                </div>
              </div>

              {/* Exchange After 14 Days (Prevailing Rate Matrix Table) */}
              <div style={{ marginBottom: "48px" }}>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.35rem",
                    color: "#ffffff",
                    marginBottom: "8px",
                  }}
                >
                  Exchange After 14 Days of Purchase
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: "#888888", marginBottom: "24px" }}>
                  For exchanges requested after 14 days from the original purchase date, the exchange value is calculated transparently based on prevailing benchmark intra-day rates on <strong>www.gamajewels.com</strong>:
                </p>

                <div
                  style={{
                    border: "1px solid rgba(198, 164, 95, 0.2)",
                    background: "linear-gradient(145deg, #0e0e0e, #070707)",
                    overflowX: "auto",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
                    <thead>
                      <tr style={{ background: "rgba(198, 164, 95, 0.1)", borderBottom: "1px solid rgba(198, 164, 95, 0.2)" }}>
                        <th style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.1em" }}>Jewellery Category</th>
                        <th style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.1em" }}>Valuation Rate Benchmark</th>
                        <th style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#c6a45f", textTransform: "uppercase", letterSpacing: "0.1em" }}>Calculation Basis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exchangeRatesAfter14Days.map((row, idx) => (
                        <tr
                          key={idx}
                          style={{
                            borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                            background: idx % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.015)",
                          }}
                        >
                          <td style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>
                            {row.category}
                          </td>
                          <td style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 500, color: "#c6a45f" }}>
                            {row.rate}
                          </td>
                          <td style={{ padding: "16px 20px", fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#888888" }}>
                            {row.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Deductions & Specific Terms */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #080808)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "32px",
                  marginBottom: "40px",
                }}
              >
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "#ffffff", marginBottom: "16px" }}>
                  Important Exchange Terms & Deductions
                </h4>
                <ul style={{ paddingLeft: "20px", margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.8", color: "#aaaaaa" }}>
                  <li>An <strong>original invoice and authentic diamond certificate</strong> are mandatorily required for all exchanges.</li>
                  <li><strong>Making charges, statutory taxes, and non-precious stone weight</strong> (synthetic/semi-precious colour stones, beads, pearls & zircon) are completely deducted from exchange valuation.</li>
                  <li>Exchange of any category ornaments to Gold / Silver Coins, Bars, or Silver Articles will <strong>not</strong> be permitted.</li>
                  <li>If Era ornaments contain precious gems (Ruby, Emerald, Sapphire), buyback is calculated under the Precia policy: <strong>75% for Exchange and 70% for Cash</strong>.</li>
                  <li><strong>No buyback</strong> is offered for pearls and synthetic stones.</li>
                  <li>All exchanges/buybacks are subject to laboratory QC (up to 3 working days from receipt).</li>
                  <li>Any price difference between the original exchange value and the new jewellery selection must be settled prior to dispatch.</li>
                </ul>
              </div>

              {/* Discretion of Rights & Legal Jurisdiction */}
              <div
                style={{
                  background: "rgba(198, 164, 95, 0.05)",
                  border: "1px solid rgba(198, 164, 95, 0.2)",
                  padding: "24px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <Scale size={24} style={{ color: "#c6a45f", flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#cccccc", margin: 0 }}>
                  <strong>Discretion of Rights & Jurisdiction:</strong> The company reserves the sole right to exercise discretion in permitting all exchanges and buybacks, and to update these terms without prior notice. All disputes are subject to the jurisdiction of the courts at <strong>Calicut / Mumbai</strong>.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Client Support Strip ── */}
        <div
          style={{
            marginTop: "64px",
            background: "linear-gradient(145deg, #12100d, #090909)",
            border: "1px solid rgba(198, 164, 95, 0.25)",
            padding: "36px 24px",
            textAlign: "center",
          }}
        >
          <HelpCircle size={28} style={{ color: "#c6a45f", margin: "0 auto 12px" }} />
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#ffffff", marginBottom: "8px" }}>
            Questions About Returns or Exchanges?
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: "#888888", marginBottom: "20px" }}>
            Our client care specialists are ready to guide you through return kit dispatches, packing videos, and exchange valuations.
          </p>
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "24px", fontSize: "12.5px" }}>
            <a
              href="tel:+919869800084"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#c6a45f", textDecoration: "none" }}
            >
              <Phone size={15} /> +91 9869800084 / 09869-800-084
            </a>
            <a
              href="mailto:Support@gamajewels.com"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#c6a45f", textDecoration: "none" }}
            >
              <Mail size={15} /> Support@gamajewels.com
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
