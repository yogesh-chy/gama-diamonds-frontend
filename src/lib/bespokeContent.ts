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
  imageSrc: string;
  captionPosition: "top" | "bottom";
}

export interface BespokeReview {
  author: string;
  text: string;
  rating: number;
}

export const bespokeFeatures: BespokeFeature[] = [
  { icon: MessageCircle, label: "Private Consultation" },
  { icon: Pencil, label: "3D CAD & Sketches" },
  { icon: Sparkles, label: "Wax Prototyping" },
  { icon: Package, label: "Handcrafted Delivery" },
];

export const bespokeIntro = {
  title: "Your Vision, Our Atelier Craft",
  description:
    "Every bespoke piece begins with an intimate conversation. From the initial hand-drawn sketch to the final master polish, our goldsmiths guide you through a seamless bespoke journey — creating jewellery that is uniquely yours.",
};

export const bespokeProcessRows: BespokeProcessRow[] = [
  {
    title: "1. Inspiration & Concept",
    description:
      "Share your ideas, reference photos, or personal sketches with our master diamond specialists during a one-on-one consultation. We translate your story into an elegant concept — from classic solitaires and three-stone silhouettes to intricate halo and vintage-inspired settings.",
    imageLabel: "Inspiration & Concept",
    imageSrc: "/bespoke/bespoke_step4.png",
  },
  {
    title: "2. 3D CAD & Digital Rendering",
    description:
      "Our senior designers create photo-realistic 3D CAD models and detailed blueprints so you can inspect your ring from every perspective. We advise on diamond proportions, 4Cs attributes, and precious metal alloys with unlimited adjustments until you are completely satisfied.",
    imageLabel: "3D CAD & Design",
    imageSrc: "/bespoke/bespoke_step1.png",
  },
  {
    title: "3. Precision Wax Prototyping",
    description:
      "Before committing precious gold or platinum, we 3D-print a true-to-scale wax prototype. This allows you to inspect the ring's physical dimensions, stone height, and comfort fit in person or via high-definition video showcase.",
    imageLabel: "Wax Prototyping",
    imageSrc: "/bespoke/bespoke_step2.png",
  },
  {
    title: "4. Master Goldsmithing & Setting",
    description:
      "Master goldsmiths cast, hand-assemble, and polish your piece in our workshop. Each certified natural or lab-grown diamond is individually hand-set under 10× magnification for supreme security, light refraction, and fire.",
    imageLabel: "Goldsmithing & Setting",
    imageSrc: "/bespoke/bespoke_step3.png",
  },
  {
    title: "5. Hallmarking & Final Presentation",
    description:
      "Every finished piece is officially hallmarked in the UK, undergoes rigorous multi-point quality control, and is presented in a handcrafted luxury wooden presentation box complete with GIA/IGI certification and a lifetime warranty.",
    imageLabel: "Final Presentation",
    imageSrc: "/bespoke/bespoke_step5.png",
  },
];

export const bespokeLoveStories: BespokeLoveStory[] = [
  {
    caption: "ARJUN NAIR",
    imageLabel: "Custom Oval Solitaire",
    imageSrc: "/shopbycategory/engement_ring.png",
    captionPosition: "top",
  },
  {
    caption: "RACHEL & CALLUM",
    imageLabel: "Pear Shaped Halo Commission",
    imageSrc: "/bespoke_pear_solitaire.png",
    captionPosition: "bottom",
  },
  {
    caption: "SHAY AND ADI",
    imageLabel: "Eternity Diamond Band",
    imageSrc: "/shopbycategory/eternity_ring.png",
    captionPosition: "top",
  },
  {
    caption: "USMANREZA & PUTRIARS",
    imageLabel: "Oval Solitaire with Diamond Band",
    imageSrc: "/oval_cut_solitier.png",
    captionPosition: "bottom",
  },
  {
    caption: "HILARY & PAUL",
    imageLabel: "Bespoke Platinum Wedding Ring",
    imageSrc: "/women_wedding_ring.png",
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
