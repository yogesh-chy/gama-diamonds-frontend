"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function CreatorHeroCollage() {
  return (
    <section className="relative w-full bg-[#000000] text-white min-h-[90vh] lg:min-h-screen flex flex-col justify-center overflow-hidden py-16 lg:py-24 px-4 sm:px-6 lg:px-12">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#141414] via-[#000000] to-[#000000] opacity-80 pointer-events-none" />

      <div className="relative max-w-[1280px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left Column: Editorial Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col items-start text-left space-y-6 max-w-[620px]"
        >
          {/* Eyebrow Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#c6a45f]/10 border border-[#c6a45f]/30 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c6a45f] animate-pulse" />
            <span className="text-[10px] sm:text-xs font-poppins font-semibold uppercase tracking-[3px] text-[#c6a45f]">
              DESIGN JEWELLERY YOUR WAY
            </span>
          </div>

          {/* Large Serif H1 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-normal leading-[1.15] text-white tracking-tight">
            Welcome To <br />
            <span className="italic font-light text-[#c6a45f]">Jewellery Creator</span>
          </h1>

          {/* Subheading */}
          <p className="text-sm sm:text-base font-poppins text-gray-300 leading-relaxed font-light max-w-[580px]">
            Whether you&apos;re sourcing a single diamond, selecting from our fine jewellery collections, or creating a bespoke commission, our Jewellery Creator makes every project simple.
          </p>

          {/* Hairline Divider */}
          <div className="w-24 h-[1px] bg-gradient-to-r from-[#c6a45f] to-transparent pt-2" />

          {/* Quick CTA Anchor */}
          <a
            href="#three-paths"
            className="inline-flex items-center gap-3 text-xs sm:text-sm font-poppins tracking-[2px] text-[#c6a45f] hover:text-white uppercase font-medium transition-colors duration-300 pt-2 group"
          >
            <span>Begin Creation</span>
            <span className="group-hover:translate-x-1.5 transition-transform duration-300">↓</span>
          </a>
        </motion.div>

        {/* Right Column: Curated 7-Image Moodboard Collage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative w-full h-[480px] sm:h-[560px] lg:h-[620px] flex items-center justify-center"
        >
          {/* Decorative Grid Lines / Ring Backdrop */}
          <div className="absolute inset-0 border border-white/5 rounded-full pointer-events-none scale-90" />
          <div className="absolute inset-0 border border-[#c6a45f]/10 rounded-full pointer-events-none scale-125 blur-xl" />

          {/* Image 1: Dominant Upper Center Oval Diamond Ring (Upper/Center-Right) */}
          <motion.div
            whileHover={{ scale: 1.03, zIndex: 30 }}
            className="absolute top-2 right-4 sm:right-8 w-[200px] sm:w-[260px] lg:w-[290px] h-[240px] sm:h-[300px] lg:h-[340px] rounded-2xl overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.8)] border border-white/10 z-20 transition-all duration-500"
          >
            <Image
              src="/oval_cut_solitier.png"
              alt="Oval Diamond Solitaire Ring"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 200px, 290px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40" />
          </motion.div>

          {/* Image 2: Stacked Rings on Black Fabric (Lower Left) */}
          <motion.div
            whileHover={{ scale: 1.04, zIndex: 30 }}
            className="absolute bottom-4 left-0 sm:left-4 w-[170px] sm:w-[210px] lg:w-[230px] h-[200px] sm:h-[250px] lg:h-[270px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.7)] border border-white/10 z-20 rotate-[-3deg] transition-all duration-500"
          >
            <Image
              src="/men_wedding_ring.png"
              alt="Stacked Men's Court Bands"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 170px, 230px"
            />
          </motion.div>

          {/* Image 3: Rose + Yellow Gold Wedding Bands (Center Bottom) */}
          <motion.div
            whileHover={{ scale: 1.04, zIndex: 30 }}
            className="absolute bottom-12 right-12 sm:right-24 w-[160px] sm:w-[200px] lg:w-[220px] h-[180px] sm:h-[230px] lg:h-[250px] rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.75)] border border-[#c6a45f]/30 z-15 rotate-[4deg] transition-all duration-500"
          >
            <Image
              src="/women_wedding_ring.png"
              alt="Rose and Yellow Gold Wedding Bands"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 160px, 220px"
            />
          </motion.div>

          {/* Image 4: Marquise-cut Ring on Hand (Center Left) */}
          <motion.div
            whileHover={{ scale: 1.04, zIndex: 30 }}
            className="absolute top-16 left-4 sm:left-12 w-[150px] sm:w-[190px] lg:w-[210px] h-[190px] sm:h-[240px] lg:h-[260px] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.7)] border border-white/10 z-10 rotate-[2deg] transition-all duration-500"
          >
            <Image
              src="/bespoke_pear_solitaire.png"
              alt="Marquise-cut Solitaire Ring on Hand"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 150px, 210px"
            />
          </motion.div>

          {/* Image 5: Tennis Bracelet Stack (Upper Far Right background) */}
          <motion.div
            whileHover={{ scale: 1.05, zIndex: 30 }}
            className="absolute top-0 right-0 w-[110px] sm:w-[140px] h-[110px] sm:h-[140px] rounded-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.6)] border border-white/20 z-5 transition-all duration-500"
          >
            <Image
              src="/shopbycategory/bracelet.png"
              alt="Diamond Tennis Bracelet Stack"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="140px"
            />
          </motion.div>

          {/* Image 6: Diamond Pendant Necklace (Center Floating Badge) */}
          <motion.div
            whileHover={{ scale: 1.05, zIndex: 30 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130px] sm:w-[160px] h-[130px] sm:h-[160px] rounded-full overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.9)] border-2 border-[#c6a45f] z-25 transition-all duration-500"
          >
            <Image
              src="/shopbycategory/necklace.png"
              alt="Diamond Pendant Necklace"
              fill
              className="object-cover hover:scale-110 transition-transform duration-700"
              sizes="160px"
            />
          </motion.div>

          {/* Image 7: Diamond Stud Earrings (Bottom Right Edge) */}
          <motion.div
            whileHover={{ scale: 1.05, zIndex: 30 }}
            className="absolute bottom-0 right-2 sm:right-6 w-[120px] sm:w-[150px] h-[120px] sm:h-[150px] rounded-xl overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.7)] border border-white/10 z-10 rotate-[-5deg] transition-all duration-500"
          >
            <Image
              src="/shopbycategory/earings.png"
              alt="Pair of Diamond Stud Earrings"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="150px"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
