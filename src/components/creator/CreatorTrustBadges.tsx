"use client";

import { ShieldCheck, Award, Truck } from "lucide-react";

export default function CreatorTrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: "ETHICALLY SOURCED",
      description: "Kimberley Process compliant.",
    },
    {
      icon: Award,
      title: "GIA CERTIFIED",
      description: "Hand-inspected diamonds.",
    },
    {
      icon: Truck,
      title: "WHITE GLOVE",
      description: "Complimentary delivery.",
    },
  ];

  return (
    <section className="w-full bg-[#050505] text-white border-t border-b border-white/10 py-12 lg:py-16 px-4 sm:px-6 lg:px-12">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center py-6 md:py-2 px-4 space-y-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center text-[#c6a45f] group-hover:scale-110 group-hover:border-[#c6a45f] transition-all duration-300">
                <Icon className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-poppins font-semibold uppercase tracking-[2px] text-white group-hover:text-[#c6a45f] transition-colors duration-300">
                  {badge.title}
                </h4>
                <p className="text-xs font-poppins text-gray-400 font-light">
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
