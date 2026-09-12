/**
 * JSON-LD Structured Data Components for SEO
 * 
 * These inject Schema.org structured data into pages so Google can:
 * - Show rich snippets (prices, ratings, availability) in search results
 * - Display a sitelinks search box
 * - Show local business info (address, hours) in Maps & Search
 * - Understand product details for Shopping tab
 */

const SITE_URL = "https://www.gamajewels.com";
const SITE_NAME = "Gama Jewels";
const LOGO_URL = `${SITE_URL}/favicon.ico`;

// ── Organization + WebSite Schema (for homepage) ──
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: LOGO_URL,
        },
        description:
          "Bespoke diamond engagement rings, wedding bands, earrings, necklaces & bracelets. Handcrafted fine jewellery with GIA certified diamonds.",
        foundingDate: "2020",
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: "+91-9869800084",
            contactType: "customer service",
            email: "gama.diamond10@gmail.com",
            availableLanguage: ["English", "Hindi"],
          },
        ],
        sameAs: [
          "https://www.instagram.com/gama.diamond10",
          "https://www.facebook.com/share/185D5LDavs/",
          "https://x.com/GamaDiamond",
          "https://www.youtube.com/@GamaDiamond",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/rings?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Local Business Schema (JewelryStore) ──
export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "@id": `${SITE_URL}/#localbusiness`,
    name: SITE_NAME,
    image: `${SITE_URL}/heritage.png`,
    url: SITE_URL,
    telephone: "+91-9869800084",
    email: "gama.diamond10@gmail.com",
    priceRange: "₹₹₹",
    address: {
      "@type": "PostalAddress",
      streetAddress: "SHOP NO.08, TOP COOL SERVICES, MAROL",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      postalCode: "400059",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 19.1136,
      longitude: 72.8697,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "19:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Fine Jewellery Collection",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Engagement Rings" },
        { "@type": "OfferCatalog", name: "Wedding Rings" },
        { "@type": "OfferCatalog", name: "Eternity Rings" },
        { "@type": "OfferCatalog", name: "Earrings" },
        { "@type": "OfferCatalog", name: "Necklaces & Pendants" },
        { "@type": "OfferCatalog", name: "Bracelets & Bangles" },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Product Schema (for product detail pages) ──
interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string[];
  sku: string;
  price: number;
  currency?: string;
  category?: string;
  brand?: string;
  url: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  currency = "GBP",
  category,
  brand = SITE_NAME,
  url,
  availability = "InStock",
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    ...(category && { category }),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: currency,
      price: price.toFixed(2),
      availability: `https://schema.org/${availability}`,
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
      itemCondition: "https://schema.org/NewCondition",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "GB",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
        returnMethod: "https://schema.org/ReturnByMail",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "GBP",
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "GB",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Breadcrumb Schema ──
interface BreadcrumbItem {
  name: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── FAQ Schema ──
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQJsonLd({ items }: { items: FAQItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Collection / Item List Schema (for category pages) ──
interface CollectionItem {
  name: string;
  url: string;
  image?: string;
  position: number;
}

export function CollectionJsonLd({
  name,
  description,
  items,
}: {
  name: string;
  description: string;
  items: CollectionItem[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: SITE_URL,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item) => ({
        "@type": "ListItem",
        position: item.position,
        url: `${SITE_URL}${item.url}`,
        name: item.name,
        ...(item.image && { image: item.image }),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
