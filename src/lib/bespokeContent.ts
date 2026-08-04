import { MessageCircle, Pencil, Sparkles, Package } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface BespokeFeature {
  icon: LucideIcon;
  label: string;
}

export interface BespokeProcessRow {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
  imageLabel: string;
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
    "Every bespoke piece begins with a conversation. From the first sketch to the final polish, our Hatton Garden goldsmiths guide you through a seamless journey — creating jewellery that is as unique as your story.",
};

export const bespokeProcessRows: BespokeProcessRow[] = [
  {
    title: "Design Inspiration",
    description:
      "Share your vision, sketches, or reference images with our design team. We translate your story into a refined concept — from classic solitaires to contemporary silhouettes — ensuring every detail reflects your personal style.",
    linkLabel: "View more",
    linkHref: "#",
    imageLabel: "Design Inspiration",
  },
  {
    title: "Budget & Pricing",
    description:
      "We work transparently within your budget. Our goldsmiths advise on diamond grades, metal choices, and design complexity so you receive exceptional value without compromising on craftsmanship or certification.",
    linkLabel: "View more",
    linkHref: "#",
    imageLabel: "Budget & Pricing",
  },
  {
    title: "Material Selection",
    description:
      "Choose from ethically sourced natural diamonds, premium lab-grown stones, and precious metals including platinum, 18ct white, yellow, and rose gold. Every gemstone is hand-selected for brilliance.",
    linkLabel: "View more",
    linkHref: "#",
    imageLabel: "Material Selection",
  },
  {
    title: "Craftsmanship",
    description:
      "Master goldsmiths bring your design to life using traditional hand-setting techniques combined with precision 3D CAD modelling. Each piece is meticulously crafted in our London workshop.",
    linkLabel: "View more",
    linkHref: "#",
    imageLabel: "Craftsmanship",
  },
  {
    title: "Quality Control",
    description:
      "Every bespoke piece undergoes rigorous quality inspection before delivery. Full GIA or IGI certification, hallmarking, and complimentary annual servicing ensure your jewellery meets the highest standards.",
    linkLabel: "View more",
    linkHref: "#",
    imageLabel: "Quality Control",
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
