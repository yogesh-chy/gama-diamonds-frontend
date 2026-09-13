"use client";

import { motion, type Variants } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  CreditCard,
  Smartphone,
  Globe,
  Database,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  RefreshCw,
  BellRing,
  ExternalLink,
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

const piiCategories = [
  {
    icon: UserCheck,
    title: "Identity Data",
    desc: "Includes first name, maiden name, last name, username or similar identifier, marital status, title, birthday, anniversary, gender, and PAN card number.",
  },
  {
    icon: Smartphone,
    title: "Contact Data",
    desc: "Includes billing address, delivery and shipping address, email address, telephone/mobile numbers, and address proof documentation.",
  },
  {
    icon: CreditCard,
    title: "Financial & Transaction Data",
    desc: "Includes bank account details, payment instrument details, payment records to/from you, and details of products and services purchased.",
  },
  {
    icon: Globe,
    title: "Technical & Device Data",
    desc: "Includes IP address, login credentials, browser type/version, time zone setting, location, device OS, and technical diagnostic telemetry.",
  },
  {
    icon: Eye,
    title: "Profile & Usage Data",
    desc: "Includes username, encrypted password, purchase history, bespoke design interests, preferences, survey responses, and website browsing patterns.",
  },
  {
    icon: BellRing,
    title: "Marketing & Communications Data",
    desc: "Includes your preferences in receiving curated marketing releases, private preview invitations, and preferred channels of communication.",
  },
];

const purposeList = [
  "Account creation, profile maintenance, and identity verification.",
  "Processing, fabricating, and delivering your bespoke fine jewellery orders.",
  "Fulfilling statutory obligations such as PAN verification for transactions exceeding ₹2 Lakhs.",
  "Communicating order updates, courier tracking numbers, and client care inquiries.",
  "Delivering personalized diamond recommendations, private circle previews, and promotional offers.",
  "Preventing fraudulent transactions and ensuring high-security cryptographic checkout integrity.",
  "Administering customer feedback surveys, questionnaires, and satisfaction reviews.",
];

export default function PrivacyPolicyPage() {
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
            <Shield size={14} />
            <span>DATA PROTECTION & PRIVACY</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Privacy Policy
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Your trust is our most cherished asset. Learn how Gama Jewels collects, safeguards, and processes your personal data.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Main Content Container ── */}
      <section className="policy-section">
        <div className="policy-inner" style={{ maxWidth: "960px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={stagger}
          >
            {/* Effective Notice */}
            <motion.p variants={fadeInUp} className="terms-effective">
              Official Policy for <strong style={{ color: "#c6a45f" }}>www.gamajewels.com</strong> &nbsp;·&nbsp; Last Updated: 2026
            </motion.p>

            {/* Introduction Card */}
            <motion.div
              variants={fadeInUp}
              style={{
                background: "linear-gradient(145deg, #0f0f0f, #070707)",
                border: "1px solid rgba(198, 164, 95, 0.2)",
                padding: "36px",
                marginBottom: "40px",
              }}
            >
              <h2
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
                <Lock size={20} style={{ color: "#c6a45f" }} />
                1. Introduction & Scope
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#bbbbbb", marginBottom: "14px" }}>
                Your privacy is paramount at <strong>Gama Jewels</strong>. We are committed to protecting your personal data and have adopted this Privacy Policy to outline how we collect, store, use, disclose, and process your Personally Identifiable Information (&quot;PII&quot;) through our website, <strong style={{ color: "#c6a45f" }}>www.gamajewels.com</strong>.
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#bbbbbb", marginBottom: "14px" }}>
                You must also review and accept our Website <Link href="/terms" style={{ color: "#c6a45f", textDecoration: "underline" }}>Terms and Conditions</Link>, as the same govern your interaction with our services. While <strong>we do not sell or trade PII</strong>, we may share it with verified partners and logistics vendors who assist in order fulfillment, strictly limited to the purposes described herein.
              </p>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.7", color: "#888888", margin: 0 }}>
                This Privacy Policy does not apply to third-party websites accessible via hyperlinks from our platform. Please inspect the respective privacy policies of any third-party services you engage with.
              </p>
            </motion.div>

            {/* PII Data We Collect */}
            <motion.div variants={fadeInUp} style={{ marginBottom: "48px" }}>
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Database size={20} style={{ color: "#c6a45f" }} />
                2. What Data We Collect About You
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#888888", marginBottom: "24px" }}>
                We collect various types of Personally Identifiable Information (&quot;PII&quot;) to ensure smooth bespoke craftsmanship, compliant billing, and secure courier delivery:
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "20px",
                }}
              >
                {piiCategories.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      style={{
                        background: "linear-gradient(145deg, #0e0e0e, #080808)",
                        border: "1px solid rgba(255, 255, 255, 0.07)",
                        padding: "24px",
                        position: "relative",
                      }}
                    >
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
                        <Icon size={18} />
                      </div>
                      <h4
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color: "#ffffff",
                          marginBottom: "8px",
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
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 18px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "11.5px",
                  color: "#777777",
                }}
              >
                * Note: Aggregated statistical or demographic data that cannot be linked to your individual identity does not constitute PII under applicable law.
              </div>
            </motion.div>

            {/* Why & How We Collect Your Data */}
            <motion.div
              variants={fadeInUp}
              style={{
                background: "linear-gradient(145deg, #0e0e0e, #080808)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "36px",
                marginBottom: "40px",
              }}
            >
              <h2
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
                <FileText size={20} style={{ color: "#c6a45f" }} />
                3. Why & How We Collect Your Data
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#bbbbbb", marginBottom: "20px" }}>
                In general, you may browse our digital atelier without revealing your identity. However, creating an account, consulting on a bespoke ring, or completing an order requires submitting relevant PII. We collect information through account sign-up, inquiry forms, cookies, referral schemes, and regulatory compliance checks.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {purposeList.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={15} style={{ color: "#c6a45f", marginTop: "3px", flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", color: "#aaaaaa", lineHeight: "1.6" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "rgba(198, 164, 95, 0.05)",
                  border: "1px solid rgba(198, 164, 95, 0.15)",
                  padding: "18px 22px",
                }}
              >
                <h5 style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", fontWeight: 600, color: "#c6a45f", marginBottom: "6px" }}>
                  Cookies & Tracking Technologies
                </h5>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12px", color: "#888888", lineHeight: "1.65", margin: 0 }}>
                  We utilize session and analytical cookies to remember your bag selections, currency preferences, and improve navigational performance. You can manage or disable cookies via your browser settings, though certain interactive features of our website may become limited.
                </p>
              </div>
            </motion.div>

            {/* Data Security & Contact Consent */}
            <motion.div
              variants={fadeInUp}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "24px",
                marginBottom: "40px",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #080808)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "30px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    color: "#ffffff",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Lock size={18} style={{ color: "#c6a45f" }} />
                  4. Data Security
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.75", color: "#888888", marginBottom: "14px" }}>
                  We implement robust enterprise security measures and encryption to safeguard your data. Users are responsible for maintaining the confidentiality of their password credentials. Credentials are strictly personal and non-transferable.
                </p>
                <div
                  style={{
                    background: "rgba(198, 164, 95, 0.06)",
                    border: "1px solid rgba(198, 164, 95, 0.15)",
                    padding: "12px 14px",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11.5px",
                    color: "#c6a45f",
                    lineHeight: "1.6",
                  }}
                >
                  ✦ Express Consent: By using our platform, you agree to be contacted by Gama Jewels regarding your inquiries and orders via <strong>Phone Call, SMS, WhatsApp, or Email</strong>.
                </div>
              </div>

              <div
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #080808)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "30px",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.25rem",
                    color: "#ffffff",
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <RefreshCw size={18} style={{ color: "#c6a45f" }} />
                  5. Data Retention
                </h3>
                <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "12.5px", lineHeight: "1.75", color: "#888888", margin: 0 }}>
                  Personal information is retained only as long as necessary to fulfill order fabrication, lifetime warranty servicing, tax compliance (such as GST & PAN audits), dispute resolution, and statutory reporting obligations under Indian law. When determining retention duration, we evaluate sensitivity, legal requirements, and potential risk.
                </p>
              </div>
            </motion.div>

            {/* How to Update Your Information & Unsubscribe */}
            <motion.div
              variants={fadeInUp}
              style={{
                background: "linear-gradient(145deg, #12100d, #080808)",
                border: "1px solid rgba(198, 164, 95, 0.3)",
                padding: "36px",
                marginBottom: "32px",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.35rem",
                  color: "#ffffff",
                  marginBottom: "14px",
                }}
              >
                6. How to Update Your Information & Unsubscribe
              </h2>
              <p style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", lineHeight: "1.8", color: "#bbbbbb", marginBottom: "20px" }}>
                It is vital that the personal data we hold about you is accurate and current. Whenever your details change, please update them via your online account dashboard or write to our privacy officer. If you wish to unsubscribe from our newsletter, private circle previews, or promotional messages, you can do so at any time.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px",
                }}
              >
                <div style={{ background: "rgba(0,0,0,0.5)", padding: "18px", border: "1px solid rgba(198,164,95,0.15)" }}>
                  <span style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Client Support</span>
                  <div style={{ marginTop: "6px" }}>
                    <a href="mailto:Support@gamajewels.com" style={{ color: "#c6a45f", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                      Support@gamajewels.com
                    </a>
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.5)", padding: "18px", border: "1px solid rgba(198,164,95,0.15)" }}>
                  <span style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Unsubscribe / Data Requests</span>
                  <div style={{ marginTop: "6px" }}>
                    <a href="mailto:info@gamajewels.com" style={{ color: "#c6a45f", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                      info@gamajewels.com
                    </a>
                  </div>
                </div>

                <div style={{ background: "rgba(0,0,0,0.5)", padding: "18px", border: "1px solid rgba(198,164,95,0.15)" }}>
                  <span style={{ fontSize: "11px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.1em" }}>Direct Helpline</span>
                  <div style={{ marginTop: "6px" }}>
                    <a href="tel:+919869800084" style={{ color: "#c6a45f", textDecoration: "none", fontSize: "13px", fontWeight: 500 }}>
                      +91 9869800084 / 09869-800-084
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
