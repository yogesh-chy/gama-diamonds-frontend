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

const paymentBadges = [
  "VISA",
  "MASTERCARD",
  "UPI",
  "AMEX",
  "GIA GRADED",
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
                    SHOP NO.08, TOP COOL SERVICES, MAROL, ANDHERI(E.) MUMBAI 400059, Maharashtra (State Code: 27)
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
                    PAN/IT NO: <strong style={{ color: "#ffffff" }}>ASQPD0518A</strong>
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

            {/* Fine Collections Column (Real Routes) */}
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

            {/* Client Services Column (Real Routes) */}
            <div>
              <h4 className="footer-col-heading">Explore</h4>
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

        </div>
      </div>
    </footer>
  );
}


