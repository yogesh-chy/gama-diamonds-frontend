"use client";

import { useState } from "react";
import { X, Ruler, HelpCircle, CheckCircle2 } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<"rings" | "bracelets" | "necklaces">("rings");

  if (!isOpen) return null;

  const ringSizes = [
    { us: "4", uk: "H 1/2", mm: "14.9 mm" },
    { us: "5", uk: "J 1/2", mm: "15.7 mm" },
    { us: "6", uk: "L 1/2", mm: "16.5 mm" },
    { us: "7", uk: "N 1/2", mm: "17.3 mm" },
    { us: "8", uk: "P 1/2", mm: "18.1 mm" },
    { us: "9", uk: "R 1/2", mm: "18.9 mm" },
    { us: "10", uk: "T 1/2", mm: "19.8 mm" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#c6a45f]/30 text-white rounded-none p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-[#c6a45f]">
            <Ruler className="w-5 h-5" />
            <span className="text-xs font-poppins font-semibold uppercase tracking-[2px]">Interactive Guide</span>
          </div>
          <h3 className="text-2xl font-playfair font-normal text-white">
            Jewellery Size & Fit Guide
          </h3>
          <p className="text-xs font-poppins text-gray-400 font-light">
            Measure accurately or compare standard sizes for rings, bracelets, and necklaces.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-white/10 gap-6">
          {(["rings", "bracelets", "necklaces"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs font-poppins uppercase tracking-wider font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? "border-[#c6a45f] text-[#c6a45f]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "rings" && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-poppins">
                <thead>
                  <tr className="border-b border-white/10 text-[#c6a45f]">
                    <th className="py-2.5 px-3">US Size</th>
                    <th className="py-2.5 px-3">UK Size</th>
                    <th className="py-2.5 px-3">Inner Diameter (mm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {ringSizes.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="py-2 px-3 font-semibold text-white">{row.us}</td>
                      <td className="py-2 px-3">{row.uk}</td>
                      <td className="py-2 px-3">{row.mm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 text-xs font-poppins text-gray-400 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-[#c6a45f] shrink-0 mt-0.5" />
              <span>Tip: Wrap a strip of paper around your finger base, mark the circumference, and compare with the diameter chart above.</span>
            </div>
          </div>
        )}

        {activeTab === "bracelets" && (
          <div className="space-y-4 text-xs font-poppins text-gray-300">
            <p>Standard Tennis Bracelet Lengths:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Small (6.5 inches / 16.5 cm):</strong> Fits tight wrist measurements under 6.0 in</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Medium (7.0 inches / 17.8 cm):</strong> Standard classic wrist size</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Large (7.5 inches / 19.0 cm):</strong> Comfortable relaxed fit</span>
              </li>
            </ul>
          </div>
        )}

        {activeTab === "necklaces" && (
          <div className="space-y-4 text-xs font-poppins text-gray-300">
            <p>Popular Chain Lengths:</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Choker (16 inches / 40 cm):</strong> Falls around collarbone base</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Princess (18 inches / 45 cm):</strong> Most popular standard length</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#c6a45f]" />
                <span><strong>Matinee (20 inches / 50 cm):</strong> Sits elegantly below collarbone</span>
              </li>
            </ul>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#c6a45f] text-black font-poppins text-xs font-semibold uppercase tracking-wider hover:bg-[#d8b56f] transition-colors"
          >
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}
