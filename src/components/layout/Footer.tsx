"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Award,
  Truck,
  HeartHandshake,
  ArrowUp,
  ChevronRight,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { footerLinks } from "@/lib/constants";

function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function TwitterXIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function RazorpayBadge() {
  return (
    <svg width="86" height="25" viewBox="0 0 86 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="Secured by Razorpay">
      <title>Secured by Razorpay</title>
      <rect width="86" height="25" rx="3.5" fill="#0C2340" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <g transform="translate(7, 4.5)">
        <path d="M5.5 1.5L0.5 15H4.2L5.8 11.2L9.2 11.2C11.3 11.2 12.6 10 13.1 8.2C13.6 6.3 12.7 5 10.5 5L6.3 5L5.5 1.5ZM7.3 6.8L9.3 6.8C10.1 6.8 10.6 7.2 10.4 7.9C10.2 8.6 9.6 9 8.8 9L6.4 9L7.3 6.8Z" fill="#3395FF"/>
      </g>
      <text x="26" y="16" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="'Poppins', sans-serif" letterSpacing="0.2">Razorpay</text>
    </svg>
  );
}

function VisaBadge() {
  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="Visa">
      <title>Visa</title>
      <rect width="40" height="25" rx="3.5" fill="#1A1F71" />
      <text x="20" y="16" fill="#FFFFFF" fontSize="11" fontWeight="900" fontStyle="italic" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">VISA</text>
    </svg>
  );
}

function MastercardBadge() {
  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="Mastercard">
      <title>Mastercard</title>
      <rect width="40" height="25" rx="3.5" fill="#222222" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <circle cx="16" cy="12.5" r="6.2" fill="#EB001B" />
      <circle cx="24" cy="12.5" r="6.2" fill="#F79E1B" fillOpacity="0.95" />
      <path d="M20 7.8C21.4 9 22.3 10.6 22.3 12.5C22.3 14.4 21.4 16 20 17.2C18.6 16 17.7 14.4 17.7 12.5C17.7 10.6 18.6 9 20 7.8Z" fill="#FF5F00" />
    </svg>
  );
}

function UpiBadge() {
  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="UPI">
      <title>UPI (Unified Payments Interface)</title>
      <rect width="40" height="25" rx="3.5" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.8" />
      <path d="M9 7L13.5 12.5L9 18H12.5L17 12.5L12.5 7H9Z" fill="#097939" />
      <path d="M14 7L18.5 12.5L14 18H17.5L22 12.5L17.5 7H14Z" fill="#ED752E" />
      <text x="28" y="15" fill="#282828" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">UPI</text>
    </svg>
  );
}

function AmexBadge() {
  return (
    <svg width="40" height="25" viewBox="0 0 40 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="American Express">
      <title>American Express</title>
      <rect width="40" height="25" rx="3.5" fill="#006FCF" />
      <text x="20" y="15" fill="#FFFFFF" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="-0.5">AMEX</text>
    </svg>
  );
}

function RuPayBadge() {
  return (
    <svg width="44" height="25" viewBox="0 0 44 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="RuPay">
      <title>RuPay</title>
      <rect width="44" height="25" rx="3.5" fill="#FFFFFF" stroke="#E0E0E0" strokeWidth="0.8" />
      <text x="18" y="15" fill="#1C3F94" fontSize="8" fontWeight="900" fontStyle="italic" fontFamily="sans-serif">RuPay</text>
      <path d="M37 8L39 12.5L37 17H39.5L41.5 12.5L39.5 8H37Z" fill="#F37021"/>
    </svg>
  );
}

function GiaBadge() {
  return (
    <svg width="58" height="25" viewBox="0 0 58 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="payment-badge-svg" aria-label="GIA Graded Certified Diamonds">
      <title>GIA Graded Certified Diamonds</title>
      <rect width="58" height="25" rx="3.5" fill="#111111" stroke="#c6a45f" strokeWidth="0.8" />
      <text x="29" y="11" fill="#c6a45f" fontSize="7.5" fontWeight="900" fontFamily="serif" textAnchor="middle" letterSpacing="0.8">✦ GIA ✦</text>
      <text x="29" y="18" fill="#FFFFFF" fontSize="5.5" fontWeight="700" fontFamily="sans-serif" textAnchor="middle" letterSpacing="0.5">GRADED</text>
    </svg>
  );
}

const trustFeatures = [
  {
    icon: ShieldCheck,
    title: "Certified Diamonds",
    desc: "100% Conflict-Free Natural & Lab Grown",
  },
  {
    icon: Award,
    title: "Master Craftsmanship",
    desc: "Handcrafted Atelier Precision",
  },
  {
    icon: Truck,
    title: "Insured Express Delivery",
    desc: "Discreet & Secure Courier Service",
  },
  {
    icon: HeartHandshake,
    title: "Lifetime Warranty",
    desc: "Complimentary Cleaning & Servicing",
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/gama.diamond10?igsh=MWIxczJxeWRjNWxpYQ==",
    Icon: InstagramIcon,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/185D5LDavs/",
    Icon: FacebookIcon,
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/GamaDiamond",
    Icon: TwitterXIcon,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@GamaDiamond",
    Icon: YoutubeIcon,
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="footer-container">
      {/* ── Trust Features Strip ── */}
      <div className="footer-trust-strip">
        <div className="footer-inner">
          <div className="footer-trust-grid">
            {trustFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="footer-trust-card">
                  <div className="footer-trust-icon-box">
                    <Icon size={18} className="footer-trust-icon" />
                  </div>
                  <div>
                    <h5 className="footer-trust-title">{item.title}</h5>
                    <p className="footer-trust-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Main Footer Body ── */}
      <div className="footer-main-section" style={{ padding: "48px 0 32px" }}>
        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand & Business Details Column */}
            <div className="footer-brand-col" style={{ gridColumn: "span 1" }}>
              <Link href="/" className="footer-logo-link">
                <div className="footer-logo-tagline">✦ GAMA ✦</div>
                <div className="footer-logo-name">JEWELS</div>
                <div className="footer-logo-sub">BESPOKE FINE JEWELLERY</div>
              </Link>
              <p className="footer-desc" style={{ fontSize: "12px", lineHeight: "1.7", marginBottom: "16px" }}>
                Exquisite bespoke diamond engagement rings, certified natural and lab-grown diamonds, handcrafted to perfection.
              </p>

              {/* Direct Address & Business Information */}
              <div className="footer-contact-block" style={{ gap: "10px", marginBottom: "16px" }}>
                <div className="footer-contact-item" style={{ alignItems: "flex-start" }}>
                  <MapPin size={15} className="footer-contact-icon" style={{ marginTop: "3px" }} />
                  <span style={{ fontSize: "11.5px", color: "#cccccc", lineHeight: "1.5" }}>
                    SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI(E.) MUMBAI 400059<br />
                    State Name: Maharashtra, Code: 27
                  </span>
                </div>
                <div className="footer-contact-item">
                  <Phone size={15} className="footer-contact-icon" />
                  <a href="tel:+919869800084" style={{ fontSize: "12px", color: "#c6a45f", textDecoration: "none" }}>
                    +91 9869800084
                  </a>
                </div>
                <div className="footer-contact-item">
                  <Mail size={15} className="footer-contact-icon" />
                  <a href="mailto:gama.diamond10@gmail.com" style={{ fontSize: "12px", color: "#c6a45f", textDecoration: "none" }}>
                    gama.diamond10@gmail.com
                  </a>
                </div>
                <div className="footer-contact-item" style={{ alignItems: "flex-start", marginTop: "4px" }}>
                  <FileText size={15} className="footer-contact-icon" style={{ marginTop: "2px" }} />
                  <span style={{ fontSize: "11px", color: "#999999", lineHeight: "1.5" }}>
                    GSTIN/UIN: <strong style={{ color: "#ffffff" }}>27ASQPD0518A1Z8</strong> <br />
                    PAN/IT NO : <strong style={{ color: "#ffffff" }}>ASQPD0518A</strong>
                  </span>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="footer-socials" style={{ marginTop: "4px" }}>
                {socialLinks.map(({ name, href, Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn"
                    aria-label={name}
                    title={name}
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>

            {/* Fine Collections Column */}
            <div>
              <h4 className="footer-col-heading">Collections</h4>
              <ul className="footer-link-list">
                {footerLinks.customerCare.map((link, i) => (
                  <li key={i} className="footer-link-item">
                    <Link href={link.href}>
                      <ChevronRight size={11} className="footer-link-arrow" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Client Care Column */}
            <div>
              <h4 className="footer-col-heading">Client Care</h4>
              <ul className="footer-link-list">
                {footerLinks.explore.map((link, i) => (
                  <li key={i} className="footer-link-item">
                    <Link href={link.href}>
                      <ChevronRight size={11} className="footer-link-arrow" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Policies Column */}
            <div>
              <h4 className="footer-col-heading">Legal &amp; Policies</h4>
              <ul className="footer-link-list">
                {footerLinks.policies.map((link, i) => (
                  <li key={i} className="footer-link-item">
                    <Link href={link.href}>
                      <ChevronRight size={11} className="footer-link-arrow" />
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="footer-newsletter-col">
              <h4 className="footer-col-heading">Private Circle</h4>
              <p className="footer-newsletter-desc" style={{ fontSize: "12px", lineHeight: "1.6" }}>
                Subscribe for exclusive private previews, bespoke collection launches, and expert diamond guidance.
              </p>

              {subscribed ? (
                <div className="footer-newsletter-success" style={{ borderRadius: "0px" }}>
                  <CheckCircle2 size={16} />
                  <span>Welcome to the Private Circle.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="footer-newsletter-form">
                  <div className="footer-newsletter-input-wrap" style={{ borderRadius: "0px" }}>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="footer-newsletter-input"
                      style={{ borderRadius: "0px" }}
                    />
                    <button type="submit" className="footer-newsletter-btn" style={{ borderRadius: "0px" }}>
                      JOIN
                    </button>
                  </div>
                </form>
              )}

              <div className="footer-security-note" style={{ marginTop: "12px", fontSize: "10.5px" }}>
                🔒 Your privacy is protected. Unsubscribe anytime.
              </div>
            </div>

          </div>

          {/* ── Footer Bottom Copyright Strip ── */}
          <div
            style={{
              marginTop: "40px",
              paddingTop: "24px",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ fontFamily: "'Poppins', sans-serif", fontSize: "11.5px", color: "#777777" }}>
              © {new Date().getFullYear()} <strong style={{ color: "#c6a45f" }}>Gama Jewels</strong>. All rights reserved. Handcrafted in Mumbai • 100% Conflict-Free Certified Diamonds.
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <RazorpayBadge />
              <VisaBadge />
              <MastercardBadge />
              <UpiBadge />
              <AmexBadge />
              <RuPayBadge />
              <GiaBadge />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}


