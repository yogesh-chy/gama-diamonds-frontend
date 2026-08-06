"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SizeGuideModal from "./SizeGuideModal";

export default function JewelleryCreatorLayout() {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  return (
    <section className="jc-page">
      <div className="jc-container">

        {/* ── LEFT: Image Collage Grid ── */}
        <div className="jc-collage">

          {/* Row 1: Large hero image + 2 stacked small images */}
          <div className="jc-collage-row-top">
            <div className="jc-img jc-img-hero">
              <Image src="/oval_cut_solitier.png" alt="Oval Diamond Solitaire Ring" fill className="jc-img-inner" sizes="(max-width:768px) 58vw, 32vw" priority />
            </div>
            <div className="jc-col-stack">
              <div className="jc-img jc-img-sm">
                <Image src="/men_wedding_ring.png" alt="Court Wedding Bands" fill className="jc-img-inner" sizes="(max-width:768px) 38vw, 18vw" />
              </div>
              <div className="jc-img jc-img-sm">
                <Image src="/women_wedding_ring.png" alt="Rose & Yellow Gold Bands" fill className="jc-img-inner" sizes="(max-width:768px) 38vw, 18vw" />
              </div>
            </div>
          </div>

          {/* Row 2: 3 images (hand ring, bracelet, 2 stacked) */}
          <div className="jc-collage-row-btm">
            <div className="jc-img jc-img-tall">
              <Image src="/bespoke_pear_solitaire.png" alt="Diamond Ring on Hand" fill className="jc-img-inner" sizes="(max-width:768px) 32vw, 16vw" />
            </div>
            <div className="jc-img jc-img-tall">
              <Image src="/shopbycategory/bracelet.png" alt="Tennis Bracelet Stack" fill className="jc-img-inner" sizes="(max-width:768px) 32vw, 16vw" />
            </div>
            <div className="jc-col-stack">
              <div className="jc-img jc-img-sm">
                <Image src="/shopbycategory/necklace.png" alt="Diamond Pendant Necklace" fill className="jc-img-inner" sizes="(max-width:768px) 32vw, 16vw" />
              </div>
              <div className="jc-img jc-img-sm">
                <Image src="/shopbycategory/earings.png" alt="Diamond Stud Earrings" fill className="jc-img-inner" sizes="(max-width:768px) 32vw, 16vw" />
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="jc-floating-badge">
            <div className="jc-badge-bar" />
            <span className="jc-badge-title">Design Jewellery</span>
            <span className="jc-badge-italic">Your Way</span>
          </div>
        </div>

        {/* ── RIGHT: Content ── */}
        <div className="jc-content">

          {/* Heading */}
          <h1 className="jc-heading">Welcome To <em>Jewellery Creator</em></h1>
          <p className="jc-subtext">
            Whether you&apos;re sourcing a single diamond, selecting from our jewellery collections, or creating a bespoke commission, our Jewellery Creator makes every project simple.
          </p>

          {/* Three path cards */}
          <div className="jc-cards">
            <div className="jc-card">
              <div className="jc-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <h3 className="jc-card-title">Start with Diamond</h3>
              <p className="jc-card-desc">Browse diamonds and build a setting around your choice.</p>
              <Link href="/rings" className="jc-card-link">Browse Diamonds <span className="jc-arrow">→</span></Link>
            </div>

            <div className="jc-card">
              <div className="jc-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              </div>
              <h3 className="jc-card-title">Browse Jewellery</h3>
              <p className="jc-card-desc">Explore all categories - available as mount-only or finished jewellery.</p>
              <Link href="/jewellery" className="jc-card-link">Browse Collections <span className="jc-arrow">→</span></Link>
            </div>

            <div className="jc-card">
              <div className="jc-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              </div>
              <h3 className="jc-card-title">Go Bespoke</h3>
              <p className="jc-card-desc">Bring your vision to life, create a piece that&apos;s entirely your own.</p>
              <Link href="/bespoke" className="jc-card-link">Start Bespoke Enquiry <span className="jc-arrow">→</span></Link>
            </div>
          </div>

          {/* Size guide strip */}
          <button className="jc-size-strip" onClick={() => setIsSizeGuideOpen(true)}>
            <span className="jc-new-badge">NEW</span>
            <span>Not sure of your size? Explore our Interactive Size Guide</span>
            <span className="jc-arrow">→</span>
          </button>

          {/* Trust badges */}
          <div className="jc-trust">
            <div className="jc-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c6a45f" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <strong>ETHICALLY SOURCED</strong>
              <span>Kimberley Process compliant.</span>
            </div>
            <div className="jc-trust-divider" />
            <div className="jc-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c6a45f" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
              <strong>GIA CERTIFIED</strong>
              <span>Hand-inspected diamonds.</span>
            </div>
            <div className="jc-trust-divider" />
            <div className="jc-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c6a45f" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/></svg>
              <strong>WHITE GLOVE</strong>
              <span>Complimentary delivery.</span>
            </div>
          </div>
        </div>

      </div>

      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </section>
  );
}
