"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Diamond,
  ShieldCheck,
  Award,
  HeartHandshake,
  Send,
  Sparkles,
  Gem,
  Crown,
  CheckCircle2,
  ExternalLink,
  Navigation,
  FileText,
  Calendar,
  Layers,
  Flame,
  Check,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import LuxurySelect from "@/components/ui/LuxurySelect";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const values = [
  {
    icon: Diamond,
    title: "100% Certified Diamonds",
    desc: "Every solitaire is hand-selected and certified by premier international laboratories (GIA / AnchorCert), guaranteeing 100% conflict-free authenticity.",
  },
  {
    icon: Award,
    title: "Artisanal Craftsmanship",
    desc: "Decades of master goldsmithing combined with precision 3D CAD modeling at our Mumbai atelier to craft exquisite fine jewellery.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Valuation",
    desc: "We follow ethical intra-day benchmark rates with no hidden markups, fostering lasting client trust across generations.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Atelier Care",
    desc: "Every creation includes lifetime warranty coverage, complimentary cleaning, annual inspection, and dedicated customer support.",
  },
];

const bespokeSteps = [
  {
    step: "01",
    title: "Private Consultation",
    desc: "Share your diamond preferences, silhouette, and metal choice with our specialist diamond consultant.",
  },
  {
    step: "02",
    title: "3D CAD Blueprint",
    desc: "Our CAD ateliers engineer photorealistic 3D renders with micro-millimeter precision for your approval.",
  },
  {
    step: "03",
    title: "Master Hand-Casting",
    desc: "Handcrafted in 18K solid gold or platinum, then hand-set with pavé diamonds by veteran artisans.",
  },
  {
    step: "04",
    title: "Certification & Handover",
    desc: "Accompanied by hallmarked certificates and discreetly hand-delivered in luxury velvet cases.",
  },
];

const milestones = [
  { value: "Heritage", label: "Mumbai Fine Jewellery Legacy" },
  { value: "GIA", label: "100% Certified Conflict-Free" },
  { value: "10,000+", label: "Cherished Clients Globally" },
  { value: "18K / 950", label: "Pure Hallmarked Gold & Platinum" },
];

const inquiryTypeOptions = [
  { value: "Private Consultation", label: "Private Atelier Consultation" },
  { value: "Bespoke Design Inquiry", label: "Bespoke Design Inquiry" },
  { value: "Diamond Sourcing Request", label: "Diamond Sourcing Request" },
  { value: "Order & Shipment Assistance", label: "Order & Shipment Assistance" },
];

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Private Consultation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "Private Consultation", message: "" });
  };

  const mapAddressQuery = encodeURIComponent(
    "Shop No. 08, Top Cool Services, Marol, Andheri East, Mumbai 400059"
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddressQuery}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapAddressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* ── Hero Section ── */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <motion.div
          className="about-hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div variants={fadeInUp} className="about-hero-badge">
            <Sparkles size={14} />
            <span>✦ THE HOUSE OF GAMA JEWELS ✦</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="about-hero-title">
            The Art of
            <span className="about-hero-title-gold"> Bespoke Fine Jewellery</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="about-hero-subtitle">
            Where generations of master goldsmithing meet modern haute joaillerie — handcrafted with passion in Mumbai.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Milestone Strip ── */}
      <section style={{ borderTop: "1px solid rgba(198,164,95,0.15)", borderBottom: "1px solid rgba(198,164,95,0.15)", background: "#060606" }}>
        <div className="about-inner">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              padding: "36px 0",
              textAlign: "center",
            }}
          >
            {milestones.map((m, i) => (
              <div key={i} style={{ borderRight: i < milestones.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", padding: "0 16px" }}>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.8rem",
                    fontWeight: 600,
                    color: "#c6a45f",
                    marginBottom: "4px",
                  }}
                >
                  {m.value}
                </div>
                <div
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#888888",
                  }}
                >
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story Section ── */}
      <section className="about-story-section">
        <div className="about-inner">
          <motion.div
            className="about-story-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            {/* Story Text */}
            <motion.div variants={fadeInUp} className="about-story-text">
              <div className="about-section-label">
                <Crown size={13} />
                <span>WHO WE ARE</span>
              </div>
              <h2 className="about-section-heading">
                A Legacy of Passion, Precision &amp; Brilliance
              </h2>
              <p className="about-paragraph">
                Born from an uncompromising dedication to rare gemstones and artisanal precision,
                <strong> Gama Jewels</strong> stands as Mumbai’s premier destination for bespoke engagement rings,
                solitaire jewellery, and certified diamond treasures.
              </p>
              <p className="about-paragraph">
                Every piece in our atelier begins with an obsession for detail. From hand-selecting conflict-free natural
                and lab-grown diamonds to casting in 18K solid gold and 950 platinum, our master artisans infuse each
                creation with enduring beauty and sentiment.
              </p>
              <p className="about-paragraph">
                We believe fine jewellery is far more than an ornament — it is a personal statement, a celebration of love,
                and an heirloom designed to be cherished for generations to come.
              </p>

              <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                <Link
                  href="/bespoke"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 26px",
                    background: "linear-gradient(135deg, #c6a45f, #a88738)",
                    color: "#000000",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  <Sparkles size={14} /> Explore Bespoke Studio
                </Link>

                <Link
                  href="/rings"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 26px",
                    border: "1px solid rgba(198,164,95,0.4)",
                    color: "#c6a45f",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  View Collections
                </Link>
              </div>
            </motion.div>

            {/* Story Visual Highlight Box */}
            <motion.div variants={fadeInUp} className="about-story-visual">
              <div
                className="about-story-card"
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #070707)",
                  border: "1px solid rgba(198, 164, 95, 0.25)",
                  padding: "36px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "rgba(198, 164, 95, 0.1)",
                    border: "1px solid rgba(198, 164, 95, 0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#c6a45f",
                    marginBottom: "18px",
                  }}
                >
                  <Gem size={24} />
                </div>
                <h3 className="about-story-card-title">Our Atelier Guarantee</h3>
                <p className="about-story-card-text">
                  Every diamond we offer is 100% ethically sourced, conflict-free, and graded with laser-inscribed
                  laboratory verification. We stand wholeheartedly behind the authenticity, clarity, and provenance of every single gem.
                </p>

                <div className="about-story-divider" style={{ margin: "24px 0" }} />

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#cccccc" }}>
                    <CheckCircle2 size={16} style={{ color: "#c6a45f", flexShrink: 0 }} />
                    <span>Intra-day benchmark transparent pricing</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#cccccc" }}>
                    <CheckCircle2 size={16} style={{ color: "#c6a45f", flexShrink: 0 }} />
                    <span>Complimentary annual inspection & cleaning</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12.5px", color: "#cccccc" }}>
                    <CheckCircle2 size={16} style={{ color: "#c6a45f", flexShrink: 0 }} />
                    <span>Insured express delivery across India & worldwide</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── 4 Bespoke Journey Steps ── */}
      <section style={{ padding: "80px 0", background: "#050505", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="about-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <div className="about-section-label" style={{ justifyContent: "center" }}>
              <Layers size={13} />
              <span>THE PROCESS</span>
            </div>
            <h2 className="about-section-heading" style={{ textAlign: "center", marginBottom: "48px" }}>
              The Bespoke Craftsmanship Journey
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px",
              }}
            >
              {bespokeSteps.map((b, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  style={{
                    background: "linear-gradient(145deg, #0d0d0d, #070707)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    padding: "28px 22px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "1.8rem",
                      color: "rgba(198, 164, 95, 0.2)",
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    {b.step}
                  </span>
                  <h4
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "#ffffff",
                      marginBottom: "8px",
                    }}
                  >
                    {b.title}
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
                    {b.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="about-values-section">
        <div className="about-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="about-values-header"
          >
            <motion.div variants={fadeInUp} className="about-section-label" style={{ justifyContent: "center" }}>
              <Diamond size={13} />
              <span>CORE VALUES</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="about-section-heading" style={{ textAlign: "center" }}>
              What Distinguishes Our House
            </motion.h2>
          </motion.div>

          <motion.div
            className="about-values-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={i} variants={fadeInUp} className="about-value-card">
                  <div className="about-value-icon-wrap">
                    <Icon size={22} />
                  </div>
                  <h3 className="about-value-title">{v.title}</h3>
                  <p className="about-value-desc">{v.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Atelier Location & Interactive Google Map ── */}
      <section style={{ padding: "80px 0", background: "#040404", borderTop: "1px solid rgba(198,164,95,0.2)" }}>
        <div className="about-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            <div className="about-section-label" style={{ justifyContent: "center" }}>
              <MapPin size={13} />
              <span>VISIT OUR ATELIER</span>
            </div>
            <h2 className="about-section-heading" style={{ textAlign: "center", marginBottom: "12px" }}>
              Our Mumbai Showroom &amp; Real Location
            </h2>
            <p
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "13px",
                color: "#888888",
                textAlign: "center",
                maxWidth: "600px",
                margin: "0 auto 44px",
              }}
            >
              Experience our curated diamond collections in person or book a private consultation with our master gemologists in Mumbai.
            </p>

            {/* Map and Info Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "28px",
                alignItems: "stretch",
              }}
            >
              {/* Left Column: Real Store Details */}
              <div
                style={{
                  background: "linear-gradient(145deg, #0e0e0e, #070707)",
                  border: "1px solid rgba(198, 164, 95, 0.25)",
                  padding: "36px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c6a45f", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600, marginBottom: "10px" }}>
                    <Sparkles size={14} /> Registered Flagship Store
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#ffffff", marginBottom: "16px" }}>
                    Gama Jewels Atelier
                  </h3>

                  <div className="about-contact-details" style={{ gap: "20px" }}>
                    {/* Address */}
                    <div className="about-contact-detail">
                      <div className="about-contact-detail-icon"><MapPin size={16} /></div>
                      <div>
                        <div className="about-contact-detail-label">Store Address</div>
                        <div className="about-contact-detail-value" style={{ color: "#ffffff", fontWeight: 400 }}>
                          Shop No. 08, Top Cool Services,<br />
                          Marol, Andheri (E.), Mumbai 400059, Maharashtra
                        </div>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="about-contact-detail">
                      <div className="about-contact-detail-icon"><Phone size={16} /></div>
                      <div>
                        <div className="about-contact-detail-label">Direct Helpline</div>
                        <a href="tel:+919869800084" className="about-contact-detail-value about-contact-link">
                          +91 9869800084 / 09869-800-084
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="about-contact-detail">
                      <div className="about-contact-detail-icon"><Mail size={16} /></div>
                      <div>
                        <div className="about-contact-detail-label">Client Support</div>
                        <a href="mailto:Support@gamajewels.com" className="about-contact-detail-value about-contact-link">
                          Support@gamajewels.com / gama.diamond10@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="about-contact-detail">
                      <div className="about-contact-detail-icon"><Clock size={16} /></div>
                      <div>
                        <div className="about-contact-detail-label">Atelier Timings</div>
                        <div className="about-contact-detail-value">
                          Monday – Saturday: 10:00 AM – 8:00 PM<br />
                          Sunday: By Appointment Only
                        </div>
                      </div>
                    </div>

                    {/* Official Registration */}
                    <div className="about-contact-detail" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px" }}>
                      <div className="about-contact-detail-icon"><FileText size={16} /></div>
                      <div>
                        <div className="about-contact-detail-label">Government Credentials</div>
                        <div style={{ fontSize: "11.5px", color: "#888888", lineHeight: "1.6" }}>
                          GSTIN: <strong style={{ color: "#ffffff" }}>27ASQPD0518A1Z8</strong><br />
                          PAN: <strong style={{ color: "#ffffff" }}>ASQPD0518A</strong> (State Code: 27)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div style={{ marginTop: "28px" }}>
                  <a
                    href="https://wa.me/919869800084?text=Hello%20Gama%20Jewels,%20I%20would%20like%20to%20schedule%20an%20atelier%20visit"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 24px",
                      background: "linear-gradient(135deg, #c6a45f, #a88738)",
                      color: "#000000",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      textDecoration: "none",
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    Schedule WhatsApp Appointment
                  </a>
                </div>
              </div>

              {/* Right Column: Google Maps Embed */}
              <div
                style={{
                  background: "#080808",
                  border: "1px solid rgba(198, 164, 95, 0.25)",
                  position: "relative",
                  minHeight: "420px",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Map Header Strip */}
                <div
                  style={{
                    padding: "12px 20px",
                    background: "rgba(10,10,10,0.9)",
                    borderBottom: "1px solid rgba(198,164,95,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    zIndex: 2,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#c6a45f", fontWeight: 500 }}>
                    <MapPin size={14} /> Marol, Andheri East, Mumbai 400059
                  </div>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: "11px",
                      color: "#888888",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      textDecoration: "none",
                    }}
                  >
                    Open Full Map <ExternalLink size={12} />
                  </a>
                </div>

                {/* Google Maps iFrame Container */}
                <div style={{ flex: 1, width: "100%", height: "100%", minHeight: "420px", position: "relative" }}>
                  <iframe
                    title="Gama Jewels Atelier Exact Store Location Map"
                    src={`https://maps.google.com/maps?q=Shop+No+08+Top+Cool+Services+Marol+Andheri+East+Mumbai+400059&t=m&z=17&ie=UTF8&iwloc=near&output=embed`}
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      width: "100%",
                      height: "100%",
                      minHeight: "420px",
                    }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />

                  {/* Floating Pinned Store Location Marker Badge */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "16px",
                      left: "16px",
                      right: "16px",
                      background: "rgba(10, 10, 10, 0.95)",
                      border: "1px solid rgba(198, 164, 95, 0.4)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.7)",
                      padding: "14px 18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: "12px",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          background: "rgba(198, 164, 95, 0.2)",
                          border: "1px solid #c6a45f",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#c6a45f",
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: "13px", fontWeight: 600, color: "#ffffff" }}>
                            Gama Jewels Flagship Atelier
                          </span>
                          <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: "#50c878" }} />
                        </div>
                        <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11px", color: "#aaaaaa" }}>
                          Shop No. 08, Top Cool Services, Marol, Andheri (E), Mumbai 400059
                        </div>
                      </div>
                    </div>

                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px",
                        background: "#c6a45f",
                        color: "#000000",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "11px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Navigation size={12} /> Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Contact / Inquiry Form Section ── */}
      <section className="about-contact-section">
        <div className="about-inner" style={{ maxWidth: "800px" }}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="about-section-label" style={{ justifyContent: "center" }}>
              <Mail size={13} />
              <span>PRIVATE INQUIRIES</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="about-section-heading" style={{ textAlign: "center", marginBottom: "36px" }}>
              Connect With Our Master Gemologists
            </motion.h2>

            <motion.div variants={fadeInUp} className="about-contact-form-wrap" style={{ border: "1px solid rgba(198,164,95,0.25)" }}>
              {submitted ? (
                <div className="about-form-success" style={{ padding: "40px 20px", textAlign: "center" }}>
                  <Sparkles size={36} className="about-form-success-icon" style={{ color: "#c6a45f", margin: "0 auto 16px" }} />
                  <h3 className="about-form-success-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", color: "#ffffff", marginBottom: "8px" }}>
                    Inquiry Received
                  </h3>
                  <p className="about-form-success-text" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "13px", color: "#888888", marginBottom: "20px" }}>
                    Thank you for contacting Gama Jewels. Our senior diamond consultant will be in touch with you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="about-form-success-btn"
                    style={{
                      padding: "10px 24px",
                      background: "#c6a45f",
                      border: "none",
                      color: "#000000",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="about-contact-form">
                  <div className="about-form-row">
                    <div className="about-form-group">
                      <label className="about-form-label">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="about-form-input"
                        placeholder="e.g. Rahul Sharma"
                      />
                    </div>

                    <div className="about-form-group">
                      <label className="about-form-label">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="about-form-input"
                        placeholder="you@domain.com"
                      />
                    </div>
                  </div>

                  <div className="about-form-row">
                    <div className="about-form-group">
                      <label className="about-form-label">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="about-form-input"
                        placeholder="+91 98XXX XXXXX"
                      />
                    </div>

                    <div className="about-form-group">
                      <label className="about-form-label">Inquiry Type</label>
                      <LuxurySelect
                        value={formData.subject}
                        options={inquiryTypeOptions}
                        onChange={(val) => setFormData({ ...formData, subject: val })}
                        placeholder="Select Inquiry Type"
                        buttonStyle={{
                          background: "rgba(255, 255, 255, 0.03)",
                          borderColor: "rgba(255, 255, 255, 0.1)",
                          height: "44px",
                          borderRadius: "0px",
                        }}
                      />
                    </div>
                  </div>

                  <div className="about-form-group">
                    <label className="about-form-label">Message / Piece Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="about-form-input about-form-textarea"
                      placeholder="Tell us about the diamond carat, metal preference, ring size, or any bespoke design ideas..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="about-form-submit"
                    style={{
                      padding: "14px 28px",
                      background: "linear-gradient(135deg, #c6a45f, #a88738)",
                      color: "#000000",
                      border: "none",
                      fontFamily: "'Poppins', sans-serif",
                      fontSize: "12.5px",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                    }}
                  >
                    <Send size={15} />
                    <span>Submit Consultation Request</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
