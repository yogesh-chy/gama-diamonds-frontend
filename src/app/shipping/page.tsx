"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Truck,
  ShieldCheck,
  Package,
  Clock,
  CheckCircle2,
  Lock,
  Globe,
  MapPin,
  Sparkles,
  CreditCard,
  FileCheck,
  AlertCircle,
  HelpCircle,
  Search,
  ChevronDown,
  Plane,
  Building2,
  BadgeAlert,
  ArrowRight,
  DollarSign,
  Phone,
  Mail,
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

const internationalCountries = [
  "Australia",
  "Bahrain",
  "Canada",
  "Germany",
  "Italy",
  "Kenya",
  "Kuwait",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Oman",
  "Portugal",
  "Qatar",
  "Romania",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "Spain",
  "United Arab Emirates",
  "United Kingdom",
  "United States of America",
];

const domesticHighlights = [
  {
    icon: Truck,
    title: "Zero Shipping Charges",
    desc: "100% complimentary delivery on all domestic orders across serviceable pincodes in India.",
  },
  {
    icon: Clock,
    title: "12 Working Days Delivery",
    desc: "Orders are processed promptly and delivered within 12 working days of placement.",
  },
  {
    icon: ShieldCheck,
    title: "Transit Loss Guarantee",
    desc: "15-day tracking window for any transit delay. If untraced, a 100% refund is processed immediately.",
  },
  {
    icon: FileCheck,
    title: "PAN Verification for ₹2L+",
    desc: "Statutory PAN verification required for orders above ₹2,00,000 with matching billing details.",
  },
];

const internationalHighlights = [
  {
    icon: Plane,
    title: "Global Partner: UPS",
    desc: "Fast, tracked, and secure courier handover handled globally by our logistics partner UPS.",
  },
  {
    icon: Globe,
    title: "21 Destinations Covered",
    desc: "Direct shipping to USA, UK, UAE, Canada, Australia, Singapore, Germany, and 14 other countries.",
  },
  {
    icon: DollarSign,
    title: "$70 Flat Jewellery Shipping",
    desc: "Delivered on a Delivery Duty Unpaid (DDU) basis. Cart values from $100 to $10,000+ USD.",
  },
  {
    icon: CreditCard,
    title: "Razorpay USD Checkout",
    desc: "Secure international payments via international credit/debit cards or Razorpay account.",
  },
];

const faqList = [
  {
    q: "How can I know my order status?",
    a: "All users can track orders by clicking on 'Track Order' and entering the email address used during checkout along with the order number. Registered users can also sign in to their account to view real-time status and tracking from their Order History page.",
  },
  {
    q: "What happens if my order is lost in transit?",
    a: "In the unlikely event that an order gets lost during transit, our dedicated logistics team monitors and tracks the shipment for up to 15 days. If the order is still untraceable after 15 days, we immediately process a 100% full refund through the original payment mode used at checkout.",
  },
  {
    q: "Where do you deliver within India?",
    a: "We currently deliver to selected cities and serviceable pincodes across India. You can easily check pincode eligibility on any product page, shopping cart, or checkout screen before completing your purchase.",
  },
  {
    q: "I live outside India. Can I order something to be delivered in India?",
    a: "Yes! You can place an order from abroad to be delivered anywhere within our serviceable pincodes in India, provided you provide a valid Indian shipping address at checkout.",
  },
  {
    q: "Do I need to show an ID proof upon delivery?",
    a: "Certain logistics partners may request a valid photo ID upon delivery. When the original recipient is unavailable or the shipment value is high, the delivery executive may request ID proof from whoever receives the parcel at the specified address to guarantee safe handover.",
  },
  {
    q: "Why is a PAN Card required for orders above ₹2 Lakhs?",
    a: "Under Government of India Income Tax regulations, any jewellery purchase exceeding INR 2,00,000 (₹2 Lakhs) requires mandatory PAN verification. Customers must enter their PAN Card number, and the billing name must match the name on the PAN Card to complete checkout.",
  },
  {
    q: "What payment methods are supported for international orders?",
    a: "International orders are processed in USD through Razorpay Payment Gateway using internationally issued credit/debit cards or a Razorpay account. Please note that cards issued within India cannot be accepted for international shipments.",
  },
  {
    q: "Are returns or exchanges accepted for international orders?",
    a: "Currently, we do not accept returns or exchanges for international shipments. Our team is actively working on expanding global reverse logistics, and updates will be reflected here once available.",
  },
];

export default function ShippingPage() {
  const [activeTab, setActiveTab] = useState<"domestic" | "international">("domestic");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* ── Hero Banner ── */}
      <section className="policy-hero">
        <div className="policy-hero-overlay" />
        <motion.div
          className="policy-hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="policy-hero-badge">
            <Truck size={14} />
            <span>ORDER DELIVERY & SHIPPING POLICY</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Order Delivery & Shipping
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Complimentary insured domestic delivery across India and reliable international courier shipping via UPS.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Navigation Tabs ── */}
      <section style={{ borderBottom: "1px solid rgba(198, 164, 95, 0.2)", background: "#050505", position: "sticky", top: "72px", zIndex: 10 }}>
        <div className="policy-inner" style={{ display: "flex", justifyContent: "center", gap: "12px", padding: "14px 24px" }}>
          <button
            onClick={() => setActiveTab("domestic")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: activeTab === "domestic" ? "rgba(198, 164, 95, 0.15)" : "transparent",
              border: activeTab === "domestic" ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.1)",
              color: activeTab === "domestic" ? "#c6a45f" : "#888888",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Building2 size={16} />
            Domestic Delivery (India)
          </button>

          <button
            onClick={() => setActiveTab("international")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 24px",
              background: activeTab === "international" ? "rgba(198, 164, 95, 0.15)" : "transparent",
              border: activeTab === "international" ? "1px solid #c6a45f" : "1px solid rgba(255,255,255,0.1)",
              color: activeTab === "international" ? "#c6a45f" : "#888888",
              fontFamily: "'Poppins', sans-serif",
              fontSize: "12.5px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <Plane size={16} />
            International Shipping (UPS)
          </button>
        </div>
      </section>

      {/* ── Tab Content ── */}
      <div className="policy-inner" style={{ padding: "48px 24px" }}>
        <AnimatePresence mode="wait">
          {activeTab === "domestic" ? (
            <motion.div
              key="domestic"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Domestic Highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                  marginBottom: "48px",
                }}
              >
                {domesticHighlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "linear-gradient(145deg, #0e0e0e, #070707)",
                        border: "1px solid rgba(198, 164, 95, 0.15)",
                        padding: "24px 20px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(198, 164, 95, 0.08)",
                          border: "1px solid rgba(198, 164, 95, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#c6a45f",
                          marginBottom: "14px",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#ffffff",
                          marginBottom: "6px",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "12px",
                          lineHeight: "1.65",
                          color: "#888888",
                          margin: 0,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Standard Delivery & Guidelines */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0f0f0f, #080808)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "36px",
                  marginBottom: "40px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.4rem",
                    color: "#ffffff",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Sparkles size={20} style={{ color: "#c6a45f" }} />
                  Domestic Standard Delivery Guidelines
                </h3>
                <p
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "13px",
                    lineHeight: "1.8",
                    color: "#b0b0b0",
                    marginBottom: "20px",
                  }}
                >
                  Our logistics team works closely with certified high-security delivery partners to ensure that your bespoke jewellery reaches you securely, discreetly, and promptly. Domestic orders are typically delivered within <strong>12 working days</strong> of placing the order.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "18px",
                  }}
                >
                  <div style={{ background: "rgba(0,0,0,0.4)", padding: "18px", borderLeft: "3px solid #c6a45f" }}>
                    <h5 style={{ fontSize: "13px", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                      Remote Locations & Weather Delays
                    </h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      If your location is in a remote area or unforeseen delays occur due to weather, strikes, or logistical constraints, the timeline may be extended by 1–2 days.
                    </p>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.4)", padding: "18px", borderLeft: "3px solid #c6a45f" }}>
                    <h5 style={{ fontSize: "13px", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                      Sundays & Public Holidays
                    </h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      Orders placed on Sundays or public holidays are queued and processed on the next working business day.
                    </p>
                  </div>

                  <div style={{ background: "rgba(0,0,0,0.4)", padding: "18px", borderLeft: "3px solid #c6a45f" }}>
                    <h5 style={{ fontSize: "13px", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                      Recipient ID Proof Verification
                    </h5>
                    <p style={{ fontSize: "12px", color: "#888888", lineHeight: "1.6", margin: 0 }}>
                      When high-value shipments are delivered or the original recipient is unavailable, courier personnel may request official ID proof from the collecting person.
                    </p>
                  </div>
                </div>
              </div>

              {/* PAN Card Regulatory Card */}
              <div
                style={{
                  background: "linear-gradient(135deg, rgba(198,164,95,0.08) 0%, rgba(10,10,10,0.9) 100%)",
                  border: "1px solid rgba(198, 164, 95, 0.3)",
                  padding: "32px",
                  display: "flex",
                  gap: "20px",
                  alignItems: "flex-start",
                  marginBottom: "40px",
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
                  <BadgeAlert size={26} />
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.25rem",
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    Mandatory PAN Card Verification (Orders &gt; ₹2,00,000)
                  </h4>
                  <p
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      lineHeight: "1.75",
                      color: "#cccccc",
                      marginBottom: "12px",
                    }}
                  >
                    As mandated by the Income Tax Department of India, for any purchase exceeding <strong>₹2 Lakhs (INR 2,00,000)</strong>, a valid PAN Card number must be provided upon placing the order.
                  </p>
                  <ul
                    style={{
                      paddingLeft: "18px",
                      margin: 0,
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12px",
                      lineHeight: "1.7",
                      color: "#999999",
                    }}
                  >
                    <li>You will be prompted to enter your PAN number and click <strong>"Verify PAN Card"</strong> on the checkout page.</li>
                    <li>The <strong>Billing Name must match the PAN Card name exactly</strong>. Mismatch in details prevents checkout progression.</li>
                    <li>Failure to provide verifiable PAN documentation will result in statutory cancellation of the order.</li>
                  </ul>
                </div>
              </div>

              {/* Order Tracking & Transit Loss */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                  gap: "24px",
                }}
              >
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "28px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <Search size={20} style={{ color: "#c6a45f" }} />
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ffffff", margin: 0 }}>
                      How to Track Your Order
                    </h4>
                  </div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#888888", marginBottom: "16px" }}>
                    All customers can track shipments using our online tracking tool. Enter the email address used during purchase and your unique Order Number.
                  </p>
                  <Link
                    href="/account"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      color: "#c6a45f",
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    View Order History in Account <ArrowRight size={14} />
                  </Link>
                </div>

                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "28px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <ShieldCheck size={20} style={{ color: "#c6a45f" }} />
                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ffffff", margin: 0 }}>
                      Lost in Transit Protection
                    </h4>
                  </div>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#888888", margin: 0 }}>
                    In the rare event that an order gets lost during transit, we wait for <strong>15 days</strong> to actively track and trace the consignment with our logistics carrier. If still unsuccessful, we initiate a 100% full refund through your original payment method.
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="international"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* International Highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "20px",
                  marginBottom: "48px",
                }}
              >
                {internationalHighlights.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "linear-gradient(145deg, #0e0e0e, #070707)",
                        border: "1px solid rgba(198, 164, 95, 0.15)",
                        padding: "24px 20px",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          background: "rgba(198, 164, 95, 0.08)",
                          border: "1px solid rgba(198, 164, 95, 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#c6a45f",
                          marginBottom: "14px",
                        }}
                      >
                        <Icon size={18} />
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "#ffffff",
                          marginBottom: "6px",
                        }}
                      >
                        {item.title}
                      </h4>
                      <p
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "12px",
                          lineHeight: "1.65",
                          color: "#888888",
                          margin: 0,
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* 21 Covered Countries Grid */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0f0f0f, #080808)",
                  border: "1px solid rgba(198, 164, 95, 0.2)",
                  padding: "36px",
                  marginBottom: "40px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <Globe size={22} style={{ color: "#c6a45f" }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.35rem", color: "#ffffff", margin: 0 }}>
                    International Shipping Destinations Covered
                  </h3>
                </div>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: "#888888", marginBottom: "24px" }}>
                  We proudly ship our handcrafted fine jewellery to clients across 21 key global destinations via our international logistics partner <strong>UPS</strong>:
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {internationalCountries.map((country, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 16px",
                        background: "rgba(198, 164, 95, 0.06)",
                        border: "1px solid rgba(198, 164, 95, 0.25)",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#e8d8b5",
                      }}
                    >
                      <MapPin size={12} style={{ color: "#c6a45f" }} />
                      {country}
                    </span>
                  ))}
                </div>
              </div>

              {/* International Logistics Details (Grid) */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "24px",
                  marginBottom: "40px",
                }}
              >
                {/* Cart Value & Fees */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "28px",
                  }}
                >
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ffffff", marginBottom: "12px" }}>
                    Cart Limits & Shipping Rates
                  </h4>
                  <ul style={{ paddingLeft: "18px", margin: 0, fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.8", color: "#aaaaaa" }}>
                    <li><strong>Minimum Cart Value:</strong> $100 USD</li>
                    <li><strong>Maximum Cart Value:</strong> $10,000++ USD</li>
                    <li><strong>Shipping Fee:</strong> Flat $70 USD per jewellery consignment</li>
                    <li><strong>Delivery Basis:</strong> Delivered on <em>Delivery Duty Unpaid (DDU)</em> basis</li>
                    <li><strong>Customs & Taxes:</strong> Any import duties or local taxes levied in the destination country are to be borne by the customer as per actuals.</li>
                  </ul>
                </div>

                {/* Payment Workflow */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "28px",
                  }}
                >
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ffffff", marginBottom: "12px" }}>
                    Payment Mode & Checkout Steps
                  </h4>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#888888", marginBottom: "14px", lineHeight: "1.6" }}>
                    Payments are accepted securely in USD via Razorpay Payment Gateway using international credit/debit cards or your Razorpay account. (Cards issued in India cannot be used for international orders).
                  </p>
                  <div
                    style={{
                      background: "rgba(198, 164, 95, 0.08)",
                      border: "1px solid rgba(198, 164, 95, 0.2)",
                      padding: "12px 16px",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "11.5px",
                      color: "#c6a45f",
                      fontWeight: 600,
                      lineHeight: "1.5",
                    }}
                  >
                    Checkout Workflow:<br />
                    Select Payment Method ➔ International Issued Cards ➔ PAY FOR YOUR ORDER
                  </div>
                </div>

                {/* Dispatch & Delivery Timeline */}
                <div
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    padding: "28px",
                  }}
                >
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", color: "#ffffff", marginBottom: "12px" }}>
                    Delivery Timeline (2–3 Weeks)
                  </h4>
                  <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#aaaaaa", margin: 0 }}>
                    International orders follow a <strong>T+15 days (2–3 weeks)</strong> timeline post confirmation. You will receive an official Gama Jewels dispatch email once shipped via <strong>UPS</strong>. Our courier partner will coordinate with you upon arrival at destination customs.
                  </p>
                </div>
              </div>

              {/* International Returns Notice */}
              <div
                style={{
                  background: "rgba(255, 80, 80, 0.05)",
                  border: "1px solid rgba(255, 80, 80, 0.2)",
                  padding: "24px 28px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <AlertCircle size={22} style={{ color: "#ff6b6b", flexShrink: 0 }} />
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#d0d0d0", margin: 0 }}>
                  <strong>International Returns Notice:</strong> Currently, we do not accept returns or exchanges for international orders. Gama Jewels is actively developing seamless international reverse logistics, and updates will be posted here as soon as they become active.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── FAQ Section ── */}
        <div style={{ marginTop: "64px" }}>
          <h2 className="policy-section-title">
            Frequently Asked Questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "850px", margin: "0 auto" }}>
            {faqList.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: isOpen ? "1px solid rgba(198, 164, 95, 0.4)" : "1px solid rgba(255, 255, 255, 0.06)",
                    transition: "border-color 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    style={{
                      width: "100%",
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "13.5px",
                        fontWeight: 500,
                        color: isOpen ? "#c6a45f" : "#ffffff",
                      }}
                    >
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={18}
                      style={{
                        color: isOpen ? "#c6a45f" : "#666666",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease, color 0.3s ease",
                        flexShrink: 0,
                        marginLeft: "16px",
                      }}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            padding: "0 24px 20px",
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: "12.5px",
                            lineHeight: "1.75",
                            color: "#888888",
                            borderTop: "1px solid rgba(255,255,255,0.04)",
                            paddingTop: "16px",
                          }}
                        >
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Direct Support Banner ── */}
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
            Need Assistance with Your Shipment?
          </h3>
          <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: "#888888", marginBottom: "20px" }}>
            Our client care specialists are on hand to assist with tracking updates, express dispatches, or international delivery queries.
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
