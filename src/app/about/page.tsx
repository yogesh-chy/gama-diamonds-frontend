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
  visible: { transition: { staggerChildren: 0.15 } },
};

const values = [
  {
    icon: Diamond,
    title: "Exceptional Quality",
    desc: "Every diamond is hand-selected and GIA certified, ensuring only the finest stones grace our collections.",
  },
  {
    icon: ShieldCheck,
    title: "Trust & Transparency",
    desc: "Complete certification, ethical sourcing, and fair pricing — because trust is the foundation of every relationship.",
  },
  {
    icon: Award,
    title: "Master Craftsmanship",
    desc: "Decades of artisanal expertise passed through generations of master goldsmiths in Mumbai's finest ateliers.",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Promise",
    desc: "From free cleaning and servicing to lifetime warranty — we stand behind every piece we create, forever.",
  },
];

const milestones = [
  { year: "Heritage", label: "Rooted in Mumbai's jewellery legacy" },
  { year: "10,000+", label: "Happy customers worldwide" },
  { year: "GIA", label: "Certified diamonds, always" },
  { year: "100%", label: "Conflict-free sourcing" },
];

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="page-bg" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
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
            <span>OUR STORY</span>
          </motion.div>
          <motion.h1 variants={fadeInUp} className="about-hero-title">
            The Art of
            <span className="about-hero-title-gold"> Fine Jewellery</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="about-hero-subtitle">
            Where passion meets precision — crafting timeless pieces that celebrate
            life&apos;s most precious moments.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Brand Story ── */}
      <section className="about-story-section">
        <div className="about-inner">
          <motion.div
            className="about-story-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="about-story-text">
              <div className="about-section-label">
                <Crown size={13} />
                <span>WHO WE ARE</span>
              </div>
              <h2 className="about-section-heading">
                Gama Jewels — Bespoke Fine Jewellery
              </h2>
              <p className="about-paragraph">
                Born from a deep-rooted passion for diamonds and fine craftsmanship,
                Gama Jewels is Mumbai&apos;s premier destination for bespoke engagement rings,
                wedding bands, and luxury diamond jewellery.
              </p>
              <p className="about-paragraph">
                Every piece in our collection tells a story — meticulously designed and
                handcrafted by master artisans who pour generations of expertise into each
                creation. We believe that jewellery isn&apos;t just an accessory; it&apos;s an heirloom,
                a symbol, a promise.
              </p>
              <p className="about-paragraph">
                From ethically sourced, GIA-certified diamonds to bespoke designs tailored
                to your vision — we blend tradition with contemporary elegance to create
                pieces that are as unique as the moments they celebrate.
              </p>
            </motion.div>

            <motion.div variants={fadeInUp} className="about-story-visual">
              <div className="about-story-card">
                <Gem size={32} className="about-story-icon" />
                <h3 className="about-story-card-title">Our Promise</h3>
                <p className="about-story-card-text">
                  Every diamond we offer is conflict-free, ethically sourced, and
                  accompanied by international certification. Your trust is our most
                  treasured asset.
                </p>
                <div className="about-story-divider" />
                <div className="about-milestones">
                  {milestones.map((m, i) => (
                    <div key={i} className="about-milestone">
                      <span className="about-milestone-value">{m.year}</span>
                      <span className="about-milestone-label">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
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
              <span>OUR VALUES</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="about-section-heading" style={{ textAlign: "center" }}>
              What Sets Us Apart
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

      {/* ── Contact Section ── */}
      <section className="about-contact-section">
        <div className="about-inner">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.div variants={fadeInUp} className="about-section-label" style={{ justifyContent: "center" }}>
              <Mail size={13} />
              <span>GET IN TOUCH</span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="about-section-heading" style={{ textAlign: "center" }}>
              Contact Us
            </motion.h2>
          </motion.div>

          <motion.div
            className="about-contact-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
          >
            {/* Contact Info */}
            <motion.div variants={fadeInUp} className="about-contact-info">
              <h3 className="about-contact-info-title">Visit Our Atelier</h3>
              <p className="about-contact-info-text">
                We&apos;d love to welcome you to our showroom. Schedule a private consultation
                to explore our collections.
              </p>
              <div className="about-contact-details">
                <div className="about-contact-detail">
                  <div className="about-contact-detail-icon"><MapPin size={16} /></div>
                  <div>
                    <div className="about-contact-detail-label">Address</div>
                    <div className="about-contact-detail-value">
                      Shop No. 08, Top Cool Services,<br />
                      Marol, Andheri (E.), Mumbai 400059
                    </div>
                  </div>
                </div>
                <div className="about-contact-detail">
                  <div className="about-contact-detail-icon"><Phone size={16} /></div>
                  <div>
                    <div className="about-contact-detail-label">Phone</div>
                    <a href="tel:+919869800084" className="about-contact-detail-value about-contact-link">
                      +91 9869800084
                    </a>
                  </div>
                </div>
                <div className="about-contact-detail">
                  <div className="about-contact-detail-icon"><Mail size={16} /></div>
                  <div>
                    <div className="about-contact-detail-label">Email</div>
                    <a href="mailto:gama.diamond10@gmail.com" className="about-contact-detail-value about-contact-link">
                      gama.diamond10@gmail.com
                    </a>
                  </div>
                </div>
                <div className="about-contact-detail">
                  <div className="about-contact-detail-icon"><Clock size={16} /></div>
                  <div>
                    <div className="about-contact-detail-label">Hours</div>
                    <div className="about-contact-detail-value">
                      Mon – Sat: 10:00 AM – 8:00 PM<br />
                      Sunday: By Appointment
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={fadeInUp} className="about-contact-form-wrap">
              {submitted ? (
                <div className="about-form-success">
                  <Sparkles size={28} className="about-form-success-icon" />
                  <h3 className="about-form-success-title">Message Sent</h3>
                  <p className="about-form-success-text">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="about-form-success-btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="about-contact-form">
                  <h3 className="about-contact-form-title">Send a Message</h3>
                  <div className="about-form-group">
                    <label className="about-form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="about-form-input"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="about-form-row">
                    <div className="about-form-group">
                      <label className="about-form-label">Email</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="about-form-input"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div className="about-form-group">
                      <label className="about-form-label">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="about-form-input"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>
                  <div className="about-form-group">
                    <label className="about-form-label">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="about-form-input about-form-textarea"
                      placeholder="Tell us about your dream piece or inquiry..."
                    />
                  </div>
                  <button type="submit" className="about-form-submit">
                    <Send size={15} />
                    <span>Send Message</span>
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
