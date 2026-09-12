"use client";

import { motion, type Variants } from "framer-motion";
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
  ArrowRight,
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

const highlights = [
  {
    icon: ShieldCheck,
    title: "100% Fully Insured",
    desc: "Every shipment is insured for its full value from our Mumbai atelier until it safely reaches your hands.",
  },
  {
    icon: Lock,
    title: "Discreet Packaging",
    desc: "Delivered in unmarked, tamper-evident outer boxes to guarantee total privacy, surprise, and security.",
  },
  {
    icon: Truck,
    title: "Complimentary Delivery",
    desc: "Enjoy free insured express courier shipping on all domestic orders across India.",
  },
  {
    icon: CheckCircle2,
    title: "Signature Required",
    desc: "For your protection, all shipments require direct adult signature and OTP verification upon handover.",
  },
];

const timelines = [
  {
    category: "In-Stock Ready Jewellery",
    time: "2 – 4 Business Days",
    tag: "Express Dispatch",
    desc: "Pre-crafted solitaire studs, classic pendants, and select diamond rings ready for immediate dispatch.",
  },
  {
    category: "Made-to-Order & Custom Sizing",
    time: "7 – 10 Business Days",
    tag: "Atelier Crafted",
    desc: "Pieces sized to your exact ring measurement, set in 18K gold or platinum, and quality inspected.",
  },
  {
    category: "Bespoke & Custom Design",
    time: "2 – 3 Weeks",
    tag: "Master Goldsmithing",
    desc: "Complete custom design journey including 3D CAD modeling, stone casting, and hand-setting.",
  },
  {
    category: "Next Day Dispatch Items",
    time: "24 – 48 Hours",
    tag: "Priority Service",
    desc: "Selected ready-to-ship jewellery dispatched next business day via priority air courier.",
  },
];

const steps = [
  {
    step: "01",
    title: "Atelier Quality Inspection",
    desc: "Master jewellers inspect stone settings and package original GIA / AnchorCert certificates.",
  },
  {
    step: "02",
    title: "Tamper-Proof Packaging",
    desc: "Enclosed in Gama Jewels velvet presentation cases within unmarked, security-sealed outer cartons.",
  },
  {
    step: "03",
    title: "Insured Express Dispatch",
    desc: "Dispatched via leading armored logistics partners with real-time tracking shared via SMS and email.",
  },
  {
    step: "04",
    title: "Secure Signature Handover",
    desc: "Hand-delivered directly to your address with OTP verification and recipient signature.",
  },
];

export default function ShippingPage() {
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
            <Truck size={14} />
            <span>INSURED LOGISTICS</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="policy-hero-title">
            Shipping & Delivery
          </motion.h1>
          <motion.p variants={fadeInUp} className="policy-hero-subtitle">
            Complimentary, fully insured, and discreet courier delivery direct from our atelier to your hands.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Highlights ── */}
      <section className="policy-section">
        <div className="policy-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="policy-section-title">
              Our Delivery Promise
            </motion.h2>

            <motion.div variants={fadeInUp} className="about-values-grid">
              {highlights.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="about-value-card">
                    <div className="about-value-icon-wrap">
                      <Icon size={22} />
                    </div>
                    <h3 className="about-value-title">{item.title}</h3>
                    <p className="about-value-desc">{item.desc}</p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Delivery Timelines ── */}
      <section className="policy-section policy-section-alt">
        <div className="policy-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="policy-section-title">
              Estimated Delivery Timelines
            </motion.h2>

            <motion.div
              variants={fadeInUp}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {timelines.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: "linear-gradient(145deg, #0e0e0e, #080808)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    padding: "28px 24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "10px",
                        fontWeight: 600,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        color: "#c6a45f",
                        marginBottom: "10px",
                      }}
                    >
                      {t.tag}
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "1.15rem",
                        color: "#ffffff",
                        marginBottom: "8px",
                      }}
                    >
                      {t.category}
                    </h3>
                    <p
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "12px",
                        fontWeight: 300,
                        lineHeight: "1.6",
                        color: "#888888",
                        marginBottom: "20px",
                      }}
                    >
                      {t.desc}
                    </p>
                  </div>
                  <div
                    style={{
                      borderTop: "1px solid rgba(198, 164, 95, 0.15)",
                      paddingTop: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Clock size={15} style={{ color: "#c6a45f" }} />
                    <span
                      style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "#c6a45f",
                      }}
                    >
                      {t.time}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4-Step Process ── */}
      <section className="policy-section">
        <div className="policy-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="policy-section-title">
              How Your Order Travels Safely
            </motion.h2>

            <motion.div variants={fadeInUp} className="policy-steps-grid">
              {steps.map((s, i) => (
                <div key={i} className="policy-step-card">
                  <div className="policy-step-number">{s.step}</div>
                  <div className="policy-step-icon-wrap">
                    {i === 0 && <Sparkles size={20} />}
                    {i === 1 && <Package size={20} />}
                    {i === 2 && <Truck size={20} />}
                    {i === 3 && <CheckCircle2 size={20} />}
                  </div>
                  <h3 className="policy-step-title">{s.title}</h3>
                  <p className="policy-step-desc">{s.desc}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── International & Support ── */}
      <section className="policy-section policy-section-alt">
        <div className="policy-inner" style={{ maxWidth: "900px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            style={{
              background: "linear-gradient(145deg, #111111, #0a0a0a)",
              border: "1px solid rgba(198, 164, 95, 0.2)",
              padding: "36px",
              textAlign: "center",
            }}
          >
            <motion.div variants={fadeInUp}>
              <Globe size={28} style={{ color: "#c6a45f", margin: "0 auto 16px" }} />
              <h3
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "1.4rem",
                  color: "#ffffff",
                  marginBottom: "12px",
                }}
              >
                Worldwide & International Shipping
              </h3>
              <p
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "13px",
                  fontWeight: 300,
                  lineHeight: "1.7",
                  color: "#999999",
                  maxWidth: "600px",
                  margin: "0 auto 24px",
                }}
              >
                We provide fully insured global shipping via DHL Express and FedEx International.
                Customs duties and local import taxes may apply depending on your destination country.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexWrap: "wrap",
                  gap: "24px",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "12.5px",
                  color: "#cccccc",
                }}
              >
                <span>
                  📞 Helpline:{" "}
                  <a href="tel:+919869800084" style={{ color: "#c6a45f", textDecoration: "none" }}>
                    +91 9869800084
                  </a>
                </span>
                <span>
                  ✉️ Tracking Inquiries:{" "}
                  <a href="mailto:gama.diamond10@gmail.com" style={{ color: "#c6a45f", textDecoration: "none" }}>
                    gama.diamond10@gmail.com
                  </a>
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
