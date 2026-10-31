"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Sparkles,
  Send,
  MessageSquare,
  Crown,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LuxurySelect from "@/components/ui/LuxurySelect";
import { contactApi } from "@/lib/api/contact";
import { toast } from "sonner";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const inquiryOptions = [
  { value: "Thought / Suggestion", label: "Share a Thought or Suggestion" },
  { value: "General Question / Reach Out", label: "General Reach Out / Question" },
  { value: "Private Consultation", label: "Book a Private Consultation" },
  { value: "Custom Jewellery Inquiry", label: "Custom Jewellery / Ring Inquiry" },
  { value: "Diamond Sourcing Request", label: "Diamond Sourcing Request" },
  { value: "Order & Shipment Inquiry", label: "Order & Shipment Assistance" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Thought / Suggestion",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let inquiryType: any = "reach_out";
      if (formData.subject.includes("Suggestion") || formData.subject.includes("Thought")) {
        inquiryType = "suggestion";
      } else if (formData.subject.includes("Consultation")) {
        inquiryType = "consultation";
      } else if (formData.subject.includes("Custom")) {
        inquiryType = "custom_jewellery";
      } else if (formData.subject.includes("Sourcing")) {
        inquiryType = "diamond_sourcing";
      }

      await contactApi.submitInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject,
        inquiry_type: inquiryType,
        message: formData.message.trim(),
      });

      setSubmitted(true);
      toast.success("Thank you! Your message and thoughts have been sent to our atelier.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Thought / Suggestion",
        message: "",
      });
    } catch (err: any) {
      const errDetail =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Could not send your message. Please try again or reach out on WhatsApp.";
      toast.error(errDetail);
    } finally {
      setLoading(false);
    }
  };

  const mapAddressQuery = encodeURIComponent(
    "Shop No. 08, Top Cool Services, Marol, Andheri East, Mumbai 400059"
  );
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapAddressQuery}`;
  const embedMapUrl = `https://maps.google.com/maps?q=${mapAddressQuery}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

  return (
    <div style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <Header />

      {/* Hero Header */}
      <section
        style={{
          position: "relative",
          padding: "120px 24px 60px",
          textAlign: "center",
          borderBottom: "1px solid rgba(198,164,95,0.15)",
          background: "radial-gradient(ellipse at top, #14110b 0%, #000000 70%)",
        }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          style={{ maxWidth: "760px", margin: "0 auto" }}
        >
          <motion.div
            variants={fadeInUp}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "rgba(198,164,95,0.08)",
              border: "1px solid rgba(198,164,95,0.25)",
              borderRadius: "20px",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c6a45f",
              marginBottom: "18px",
            }}
          >
            <Crown size={13} />
            <span>CONNECT WITH GAMA JEWELS</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 4vw, 3.2rem)",
              fontWeight: 500,
              letterSpacing: "1px",
              margin: "0 0 16px",
              color: "#ffffff",
            }}
          >
            We Are Here To Assist You
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "14px",
              lineHeight: "1.8",
              color: "#888888",
              margin: "0 auto",
              maxWidth: "600px",
            }}
          >
            Have a thought, design idea, or suggestion? Want to book a private consultation or reach out with a question?
            Send us a message below and our team will receive an immediate alert.
          </motion.p>
        </motion.div>
      </section>

      {/* Main Grid: Direct Channels + Form */}
      <section style={{ padding: "60px 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
          
          {/* Left Column: Direct Concierge & Flagship Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div
              style={{
                background: "#080808",
                border: "1px solid rgba(255,255,255,0.08)",
                padding: "28px",
                borderRadius: "4px",
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
                <Sparkles size={18} color="#c6a45f" />
                Direct Concierge
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <a
                  href="tel:+919869800084"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    textDecoration: "none",
                    color: "#ffffff",
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Phone size={18} color="#c6a45f" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888" }}>
                      Phone &amp; WhatsApp
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginTop: "2px" }}>
                      +91 9869800084
                    </div>
                  </div>
                </a>

                <a
                  href="mailto:info@gamajewels.com"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    textDecoration: "none",
                    color: "#ffffff",
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Mail size={18} color="#c6a45f" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888" }}>
                      Official Inquiries
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff", marginTop: "2px" }}>
                      info@gamajewels.com
                    </div>
                  </div>
                </a>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Clock size={18} color="#c6a45f" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888" }}>
                      Consultation Hours
                    </div>
                    <div style={{ fontSize: "13px", color: "#cccccc", marginTop: "2px" }}>
                      Monday – Saturday: 10:30 AM – 7:30 PM IST<br />
                      Sunday: By Private Appointment
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "14px",
                    padding: "12px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <MapPin size={18} color="#c6a45f" style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#888888" }}>
                      Flagship Boutique
                    </div>
                    <div style={{ fontSize: "13px", color: "#cccccc", marginTop: "2px", lineHeight: "1.6" }}>
                      SHOP NO. 08, TOP COOL SERVICES,<br />
                      MAROL, ANDHERI (EAST), MUMBAI 400059,<br />
                      MAHARASHTRA, INDIA
                    </div>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: "#c6a45f",
                        textDecoration: "none",
                        marginTop: "8px",
                        fontWeight: 600,
                      }}
                    >
                      Open in Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div
              style={{
                borderRadius: "4px",
                overflow: "hidden",
                border: "1px solid rgba(198,164,95,0.2)",
                height: "220px",
                background: "#0d0d0d",
              }}
            >
              <iframe
                src={embedMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(1.1)" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gama Jewels Flagship Location"
              />
            </div>
          </div>

          {/* Right Column: Contact & Suggestion Form */}
          <div
            style={{
              background: "#080808",
              border: "1px solid rgba(198,164,95,0.3)",
              padding: "36px 30px",
              borderRadius: "4px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#c6a45f", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, marginBottom: "8px" }}>
              <MessageSquare size={14} /> Send a Message
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.8rem",
                color: "#ffffff",
                marginBottom: "20px",
              }}
            >
              Share Your Thoughts &amp; Requests
            </h2>

            {submitted ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <CheckCircle2 size={44} color="#c6a45f" style={{ margin: "0 auto 16px" }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#ffffff", marginBottom: "8px" }}>
                  Message Sent Successfully
                </h3>
                <p style={{ fontSize: "13px", color: "#888888", marginBottom: "24px", lineHeight: "1.6" }}>
                  Thank you for reaching out! Our team has received an email alert about your thoughts and will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  style={{
                    padding: "12px 28px",
                    background: "#c6a45f",
                    border: "none",
                    color: "#000000",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    style={{
                      width: "100%",
                      height: "46px",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "0 14px",
                      color: "#ffffff",
                      fontSize: "13px",
                      outline: "none",
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@domain.com"
                      style={{
                        width: "100%",
                        height: "46px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98XXX XXXXX"
                      style={{
                        width: "100%",
                        height: "46px",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        padding: "0 14px",
                        color: "#ffffff",
                        fontSize: "13px",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                    Inquiry / Message Type
                  </label>
                  <LuxurySelect
                    value={formData.subject}
                    options={inquiryOptions}
                    onChange={(val) => setFormData({ ...formData, subject: val })}
                    placeholder="Select Type"
                    buttonStyle={{
                      background: "rgba(255, 255, 255, 0.03)",
                      borderColor: "rgba(255, 255, 255, 0.12)",
                      height: "46px",
                      borderRadius: "0px",
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c6a45f", marginBottom: "6px", fontWeight: 600 }}>
                    Your Message / Thoughts / Requirements *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you have in mind — suggestions, ring preferences, diamond specifications, or general inquiries..."
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      padding: "12px 14px",
                      color: "#ffffff",
                      fontSize: "13px",
                      outline: "none",
                      lineHeight: "1.6",
                      resize: "vertical",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "16px 32px",
                    background: loading ? "#666666" : "linear-gradient(135deg, #c6a45f, #a88738)",
                    color: "#000000",
                    border: "none",
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending Alert...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

