import { ShieldCheck, Truck, HeartHandshake, Award } from "lucide-react";
import type { Variants } from "framer-motion";
import type {
  CategoryItem,
  DiamondShape,
  FeatureCard,
  ServiceFeature,
  Review,
  NavItem,
  MegaMenuData,
  FooterLinks,
} from "@/types";

// Animation Variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

// 0. Hero Background Carousel Images (2 Images)
export const heroBackgroundImages = ["/1hero.png", "/2hero.png"];

// 1. Grid Categories (8 items - 4x2)
export const categoryGridItems: CategoryItem[] = [
  {
    name: "Engagement Rings",
    tag: "Solitaire & Halo",
    href: "/rings",
    image: "/shopbycategory/engement_ring.png",
  },
  {
    name: "Eternity Bands",
    tag: "Full & Half Eternity",
    href: "/eternity",
    image: "/shopbycategory/eternity_ring.png",
  },
  {
    name: "Diamond Earrings",
    tag: "Fine Earrings",
    href: "/earrings",
    image: "/shopbycategory/earings.png",
  },
  {
    name: "Pendant Necklaces",
    tag: "Necklaces",
    href: "/necklace",
    image: "/shopbycategory/necklace.png",
  },
  {
    name: "Tennis Bracelets",
    tag: "Bracelets",
    href: "/bracelets",
    image: "/shopbycategory/bracelet.png",
  },
  {
    name: "Bespoke Jewellery",
    tag: "Custom Design",
    href: "/bespoke",
    image: "/shopbycategory/bespoke_design.png",
  },
  {
    name: "New Arrivals",
    tag: "Latest Collections",
    href: "/rings?shape=oval",
    image: "/shopbycategory/new_arrival.png",
  },
  {
    name: "Next Day Dispatch",
    tag: "Ready To Ship",
    href: "/rings?type=coloured",
    image: "/shopbycategory/next_day.png",
  },
];

// 2. Diamond Shapes (10 shapes)
export const diamondShapes: DiamondShape[] = [
  {
    name: "Round Cut",
    href: "/rings?shape=round",
    image: "/DiamondShape/round.png",
  },
  {
    name: "Emerald Cut",
    href: "/rings?shape=emerald-cut",
    image: "/DiamondShape/emerald.png",
  },
  {
    name: "Cushion Cut",
    href: "/rings?shape=cushion",
    image: "/DiamondShape/cushion.png",
  },
  {
    name: "Pear Cut",
    href: "/rings?shape=pear",
    image: "/DiamondShape/pear.png",
  },
  {
    name: "Princess Cut",
    href: "/rings?shape=princess",
    image: "/DiamondShape/princess.png",
  },
  {
    name: "Oval Cut",
    href: "/rings?shape=oval",
    image: "/DiamondShape/oval.png",
  },
  {
    name: "Marquise Cut",
    href: "/rings?shape=marquise",
    image: "/DiamondShape/marquise.png",
  },
  {
    name: "Heart Cut",
    href: "/rings?shape=heart",
    image: "/DiamondShape/heart.png",
  },
  {
    name: "Asscher Cut",
    href: "/rings?shape=asscher",
    image: "/DiamondShape/asscher.png",
  },
];

// 3. Featured 3 Speciality Cards
export const featureCards: FeatureCard[] = [
  {
    title: "Bespoke Pear Solitaire",
    subtitle: "Custom Engagement Rings",
    href: "/rings?shape=pear",
    image: "/bespoke_pear_solitaire.png",
  },
  {
    title: "Loose Fancy Diamonds",
    subtitle: "Ethically Sourced Gems",
    href: "/rings?type=coloured",
    image: "/loose_fancy_diamonds.png",
  },
  {
    title: "Oval Cut Solitaire",
    subtitle: "Handcrafted in Hatton Garden",
    href: "/rings?shape=oval",
    image: "/oval_cut_solitier.png",
  },
];

// 4. Feature Icons (4 items)
export const serviceFeatures: ServiceFeature[] = [
  {
    icon: ShieldCheck,
    title: "Certified Integrity",
    desc: "GIA & AnchorCert Verification",
  },
  {
    icon: Truck,
    title: "Insured Delivery",
    desc: "Complimentary Worldwide Courier",
  },
  {
    icon: HeartHandshake,
    title: "Bespoke Workshop",
    desc: "Master Goldsmiths & 3D CAD",
  },
  {
    icon: Award,
    title: "Lifetime Warranty",
    desc: "Complimentary Annual Servicing",
  },
];

// 5. Testimonial Reviews
export const googleReviews: Review[] = [
  {
    author: "James W.",
    date: "2 days ago",
    text: "An absolutely breathtaking ring. The craftsmanship is extraordinary — my fiancée was in tears when she saw it.",
    rating: 5,
  },
  {
    author: "Sophie L.",
    date: "1 week ago",
    text: "From consultation in Hatton Garden to delivery, the experience was first-class. The diamond's clarity is unmatched.",
    rating: 5,
  },
  {
    author: "Marcus C.",
    date: "2 weeks ago",
    text: "We chose our wedding bands from Gama Diamond and couldn't be happier. Timeless, elegant, and crafted to perfection.",
    rating: 5,
  },
  {
    author: "Elena R.",
    date: "3 weeks ago",
    text: "The bespoke service was seamless. They brought my custom CAD design to life with precision I never thought possible.",
    rating: 5,
  },
];

// Nav Configuration
export const BASE_NAV: NavItem[] = [
  { title: "ENGAGEMENT RINGS", href: "/rings", key: "rings" },
  { title: "WEDDING RINGS", href: "/wedding", key: "wedding" },
  { title: "ETERNITY RINGS", href: "/eternity", key: "eternity" },
  { title: "EARRINGS", href: "/earrings", key: "earrings" },
  { title: "NECKLACE", href: "/necklace", key: "necklaces" },
  { title: "BRACELETS", href: "/bracelets", key: "bracelets" },
  { title: "JEWELLERY", href: "/jewellery", key: "jewellery" },
  { title: "BESPOKE", href: "/bespoke", key: "bespoke" },
  { title: "JEWELLERY CREATOR", href: "/jewellery-creator", key: "jewellery-creator" },

];

export const FALLBACK_RINGS_MENU: MegaMenuData = {
  sections: [
    {
      heading: "ALL ENGAGEMENT RINGS",
      items: [
        { label: "Explore All Engagement Rings", href: "/rings" },
      ],
    },
    {
      heading: "SHOP BY SHAPE",
      items: [
        { label: "Round Brilliant", href: "/rings/round-brilliant" },
        { label: "Princess", href: "/rings/princess" },
        { label: "Cushion", href: "/rings/cushion" },
        { label: "Oval", href: "/rings/oval" },
        { label: "Pear", href: "/rings/pear" },
        { label: "Emerald", href: "/rings/emerald-cut" },
        { label: "Marquise", href: "/rings/marquise" },
        { label: "Radiant", href: "/rings/radiant" },
        { label: "Asscher", href: "/rings/asscher" },
      ],
    },
    {
      heading: "SHOP BY STYLE",
      items: [
        { label: "Solitaire", href: "/collections/solitaire" },
        { label: "Halo", href: "/collections/halo" },
        { label: "Under Halo", href: "/collections/under-halo" },
        { label: "Diamond Shoulder", href: "/collections/diamond-shoulder" },
        { label: "Trilogy Three Stone", href: "/collections/three-stone" },
        { label: "Matching Set", href: "/collections/matching-set" },
      ],
    },
  ],
  images: [
    {
      src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=240&fit=crop",
      caption: "Round Brilliant Solitaire",
      href: "/rings?shape=round",
    },
    {
      src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=240&fit=crop",
      caption: "Cushion Halo Engagement",
      href: "/rings?style=halo",
    },
  ],
};

export const FALLBACK_WEDDING_MENU: MegaMenuData = {
  sections: [
    {
      heading: "WOMEN COLLECTION",
      items: [
        { label: "Women's Plain", href: "/wedding/womens-plain" },
        { label: "Eternity Rings", href: "/wedding/eternity" },
      ],
    },
    {
      heading: "MEN'S COLLECTION",
      items: [
        { label: "Men's plain", href: "/wedding/mens-plain" },
        { label: "Men's diamond", href: "/wedding/mens-diamond" },
        { label: "Men's pattern", href: "/wedding/mens-pattern" },
      ],
    },
    {
      heading: "SHOP BY STYLE",
      items: [
        {
          label: "Traditional Court",
          href: "/wedding/style/traditional-court",
        },
        { label: "Flat Court", href: "/wedding/style/flat-court" },
        { label: "Soft Court", href: "/wedding/style/soft-court" },
      ],
    },
  ],
  images: [
    {
      src: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=300&fit=crop",
      caption: "Women's Wedding Bands",
      href: "/wedding/womens-plain",
    },
    {
      src: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=300&fit=crop",
      caption: "Men's Wedding Bands",
      href: "/wedding/mens-plain",
    },
  ],
};

export const FALLBACK_JEWELLERY_MENU: MegaMenuData = {
  sections: [
    {
      heading: "ALL PRECIOUS JEWELLERY",
      items: [
        { label: "Earrings", href: "/earrings" },
        { label: "Necklace", href: "/necklace" },
        { label: "Statement Rings", href: "/jewellery" },
        { label: "Pendants", href: "/pendants" },
        { label: "Bracelets & Bangles", href: "/bracelets" },
      ],
    },
    {
      heading: "SHOP BY METAL COLOUR",
      items: [
        { label: "Gold Colour", href: "/jewellery/gold-colour" },
        { label: "Silver Colour", href: "/jewellery/silver-colour" },
        { label: "Rose Gold", href: "/jewellery/rose-gold" },
      ],
    },
    {
      heading: "THE CLASSICS",
      items: [
        { label: "Tennis Bracelets", href: "/tennis-bracelets" },
        { label: "Solitaire Studs", href: "/solitaire-studs" },
        { label: "Heart Pendants", href: "/heart-pendants" },
        { label: "Cross Pendants", href: "/cross-pendants" },
        { label: "Hoop Earrings", href: "/hoop-earrings" },
      ],
    },
    {
      heading: "BRANDS",
      items: [{ label: "Hot Diamonds", href: "/hot-diamonds" }],
    },
  ],
  images: [
    {
      src: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=240&fit=crop",
      caption: "Fine Jewellery Collection",
      href: "/jewellery",
    },
  ],
};

export const footerLinks: FooterLinks = {
  customerCare: [
    { name: "Engagement Rings", href: "/rings" },
    { name: "Wedding Bands", href: "/wedding" },
    { name: "Eternity Rings", href: "/eternity" },
    { name: "Diamond Earrings", href: "/earrings" },
    { name: "Pendant Necklaces", href: "/necklace" },
    { name: "Tennis Bracelets", href: "/bracelets" },
    { name: "Bespoke Service", href: "/bespoke" },
  ],
  explore: [
    { name: "Hot Diamonds", href: "/hot-diamonds" },
    { name: "Solitaire Studs", href: "/solitaire-studs" },
    { name: "Fine Jewellery", href: "/jewellery" },
    { name: "My Shopping Bag", href: "/cart" },
    { name: "Client Account", href: "/login" },
  ],
};

