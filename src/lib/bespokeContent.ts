import { MessageCircle, Pencil, Sparkles, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BespokeFeature {
  icon: LucideIcon;
  label: string;
}

export interface BespokeProcessRow {
  title: string;
  description: string;
  imageLabel: string;
  imageSrc: string;
}

export interface BespokeLoveStory {
  caption: string;
  imageLabel: string;
  captionPosition: "top" | "bottom";
}

export interface BespokeReview {
  author: string;
  text: string;
  rating: number;
}

export const bespokeFeatures: BespokeFeature[] = [
  { icon: MessageCircle, label: "Consultation" },
  { icon: Pencil, label: "Design" },
  { icon: Sparkles, label: "Refine" },
  { icon: Package, label: "Receive" },
];

export const bespokeIntro = {
  title: "Your Vision, Our Craft",
  description:
    "Every bespoke piece begins with a conversation. From the first sketch to the final polish, our Gama Jewels' goldsmiths guide you through a seamless journey — creating jewellery that is as unique as your story.",
};

export const bespokeProcessRows: BespokeProcessRow[] = [
  {
    title: "Inspiration",
    description:
      "Share your vision, sketches, or reference images with our design team during a complimentary one-on-one consultation at our Hatton Garden studio. We translate your story into a refined concept — from classic solitaires and three-stone settings to contemporary halo and tension-mount silhouettes — ensuring every detail reflects your personal style. Whether it's an engagement ring, anniversary band, or a family heirloom redesign, we take the time to understand the occasion, your lifestyle, and the aesthetic you love.",
    imageLabel: "Inspiration",
    imageSrc: "/bespoke/bespoke_step4.png",
  },
  {
    title: "Design Process",
    description:
      "Our senior designers create detailed hand-drawn sketches and high-resolution 3D CAD renders so you can visualise your piece from every angle before production begins. We work transparently within your budget, advising on diamond grades (colour, clarity, cut, and carat), metal choices — including platinum, 18ct white, yellow, and rose gold — and design complexity. You'll receive a full digital walkthrough with dimensions, side profiles, and setting details, with unlimited revisions until every element is exactly right.",
    imageLabel: "Design Process",
    imageSrc: "/bespoke/bespoke_step1.png",
  },
  {
    title: "3D Wax Printing",
    description:
      "Once your design is approved, we produce a precision 3D wax model using state-of-the-art rapid-prototyping technology. This physical prototype lets you hold and assess the exact proportions, band width, and stone placement of your piece before any precious materials are committed. If adjustments are needed, our team refines the model on the spot — giving you complete confidence that the finished jewellery will sit, feel, and look exactly as envisioned.",
    imageLabel: "3D Wax Printing",
    imageSrc: "/bespoke/bespoke_step2.png",
  },
  {
    title: "Production",
    description:
      "Master goldsmiths bring your design to life in our London workshop using traditional hand-setting techniques combined with precision micro-pavé and channel-setting methods. Each piece is cast, hand-finished, and polished through multiple stages — including rhodium plating for white gold pieces — to achieve a flawless surface. Ethically sourced natural diamonds and premium lab-grown stones are individually hand-selected and set under magnification, ensuring optimal brilliance and secure placement.",
    imageLabel: "Production",
    imageSrc: "/bespoke/bespoke_step3.png",
  },
  {
    title: "Your Final Jewellery",
    description:
      "Every bespoke piece undergoes rigorous multi-point quality inspection before delivery, including symmetry checks, prong integrity testing, and surface evaluation under 10× magnification. Your jewellery arrives with full GIA or IGI certification, official UK hallmarking, and a bespoke presentation box. We also include complimentary annual servicing — professional cleaning, re-polishing, and prong tightening — along with a lifetime manufacturing warranty to ensure your piece remains as stunning as the day it was crafted.",
    imageLabel: "Your Final Jewellery",
    imageSrc: "/bespoke/bespoke_step5.png",
  },
];

export const bespokeLoveStories: BespokeLoveStory[] = [
  {
    caption: "ARJUN NAIR",
    imageLabel: "Arjun Nair Love Story",
    captionPosition: "top",
  },
  {
    caption: "RACHEL & CALLUM",
    imageLabel: "Rachel & Callum Love Story",
    captionPosition: "bottom",
  },
  {
    caption: "SHAY AND ADI",
    imageLabel: "Shay and Adi Love Story",
    captionPosition: "top",
  },
  {
    caption: "USMANREZA & PUTRIARS",
    imageLabel: "Usmanreza & Putriars Love Story",
    captionPosition: "bottom",
  },
  {
    caption: "HILARY & PAUL",
    imageLabel: "Hilary & Paul Love Story",
    captionPosition: "top",
  },
];

export const bespokeReviews: BespokeReview[] = [
  {
    author: "James W.",
    text: "The bespoke process was seamless from first consultation to delivery. My fiancée's ring exceeded every expectation.",
    rating: 5,
  },
  {
    author: "Sophie L.",
    text: "They brought my sketch to life with incredible precision. The craftsmanship in Hatton Garden is unmatched.",
    rating: 5,
  },
  {
    author: "Marcus C.",
    text: "We designed matching wedding bands together. The team guided us through every decision with patience.",
    rating: 5,
  },
  {
    author: "Elena R.",
    text: "From CAD previews to the final piece, the experience felt personal and luxurious throughout.",
    rating: 5,
  },
];
