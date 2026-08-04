import type { LucideIcon } from "lucide-react";

export interface CategoryItem {
  name: string;
  tag: string;
  href: string;
  image?: string;
}

export interface DiamondShape {
  name: string;
  href: string;
  image: string;
}

export interface FeatureCard {
  title: string;
  subtitle: string;
  href: string;
  image?: string;
}

export interface ServiceFeature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface Review {
  author: string;
  date: string;
  text: string;
  rating: number;
}

export interface Product {
  id: number;
  name: string;
  subcategory?: string;
  price: number;
  images?: string[];
}

export interface NavItem {
  title: string;
  href: string;
  key: string;
}

export interface MegaMenuItem {
  label: string;
  href: string;
}

export interface MegaMenuSection {
  heading: string;
  items: MegaMenuItem[];
}

export interface MegaMenuImage {
  src: string;
  caption: string;
  href: string;
}

export interface MegaMenuData {
  sections: MegaMenuSection[];
  images: MegaMenuImage[];
}

export interface FooterLinkItem {
  name: string;
  href: string;
}

export interface FooterLinks {
  customerCare: FooterLinkItem[];
  explore: FooterLinkItem[];
}
