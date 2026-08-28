"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Gem, Sparkles, Compass, Check, ArrowRight } from "lucide-react";

interface ThreePathCardsSectionProps {
  onOpenSizeGuide?: () => void;
}

export default function ThreePathCardsSection({ onOpenSizeGuide }: ThreePathCardsSectionProps) {
  const cards = [
    {
      id: "01",
      icon: Gem,
      title: "Start with Diamond",
      description: "Browse diamonds and build a setting around your choice.",
      ctaText: "Browse Diamonds",
      ctaHref: "/rings",
      secondaryText: "Build your jewellery around a certified diamond.",
      bullets: [
        "Browse certified Natural & Lab Grown diamonds",
        "Add your preferred setting afterwards",
      ],
    },
    {
      id: "02",
      icon: Sparkles,
      title: "Browse Jewellery",
      description: "Explore all categories - available as mount-only or finished jewellery.",
      ctaText: "Browse Collections",
      ctaHref: "/jewellery",
      secondaryText: "Explore all categories available as finished jewellery.",
      bullets: [
        "Explore rings, wedding bands, earrings & necklaces",
        "Pair engagement rings with diamond or order setting only",
      ],
    },
    {
      id: "03",
      icon: Compass,
      title: "Go Bespoke",
      description: "Bring your vision to life, create a piece that's entirely your own.",
      ctaText: "Start Bespoke Enquiry",
      ctaHref: "/bespoke",
      secondaryText: "Collaborate with our jewellery specialists.",
      bullets: [
        "Share inspiration and upload references",
        "Create a completely unique piece",
      ],
    },
  ];

  return (
    <section id="three-paths" className="relative w-full bg-[#fcfbf7] text-[#1a1a1a] py-20 lg:py-32 px-4 sm:px-6 lg:px-12 border-t border-b border-black/5">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="text-center max-w-[700px] mx-auto space-y-4">
          <span className="text-[11px] font-poppins font-semibold uppercase tracking-[3px] text-[#c6a45f]">
            CHOOSE YOUR CREATION PATH
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-playfair font-normal text-[#000000] tracking-tight">
            How Would You Like To Begin?
          </h2>
          <p className="text-xs sm:text-sm font-poppins text-gray-600 leading-relaxed font-light">
            Select your preferred entry point into the Gama Jewels creation suite. Whether starting from a loose gemstone or custom sketch, we guide you every step of the way.
          </p>
        </div>

        {/* 3-Column Equal-Height Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="group relative bg-white border border-black/10 rounded-none p-8 sm:p-10 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-400 ease-out"
              >
                {/* Top Section: Number / Icon Header */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-poppins font-semibold tracking-widest text-[#c6a45f] border-b border-[#c6a45f]/30 pb-1">
                      {card.id}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[#fcfbf7] border border-black/5 flex items-center justify-center text-[#c6a45f] group-hover:bg-[#000000] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-2xl font-playfair font-semibold text-[#000000] group-hover:text-[#c6a45f] transition-colors duration-300">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-poppins text-gray-600 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Secondary Line */}
                  <p className="text-xs font-poppins italic text-gray-500 pt-1">
                    {card.secondaryText}
                  </p>

                  {/* Hairline Divider */}
                  <div className="w-full h-[1px] bg-black/5 my-4" />

                  {/* Bullets */}
                  <ul className="space-y-2.5">
                    {card.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs font-poppins text-gray-700">
                        <Check className="w-3.5 h-3.5 text-[#c6a45f] shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom CTA Link */}
                <div className="pt-8">
                  <Link
                    href={card.ctaHref}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-poppins font-semibold uppercase tracking-[1.5px] text-[#c6a45f] group-hover:text-[#000000] transition-colors duration-300"
                  >
                    <span>{card.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-[#c6a45f] group-hover:text-[#000000] transform group-hover:translate-x-2 transition-all duration-300" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Section 3: Slim Size Guide Banner Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onClick={onOpenSizeGuide}
          className="group cursor-pointer relative w-full bg-white hover:bg-[#f4f1ea] border border-black/10 p-4 sm:p-5 flex items-center justify-center text-center transition-all duration-300 shadow-sm hover:shadow-md"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm font-poppins text-[#000000]">
            {/* NEW Badge */}
            <span className="px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#c6a45f] text-white rounded-full">
              NEW
            </span>
            <span className="font-medium">
              Not sure of your size? Explore our Interactive Size Guide
            </span>
            <ArrowRight className="w-4 h-4 text-[#c6a45f] group-hover:translate-x-1.5 transition-transform duration-300" />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
