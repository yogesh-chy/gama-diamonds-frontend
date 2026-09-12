import type { Metadata } from "next";
import ProductDetailContent from "@/components/product/ProductDetailContent";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://gama-jewels.onrender.com/api";
const SITE_URL = "https://www.gamajewels.com";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  // Fetch real product data for rich metadata
  try {
    const res = await fetch(`${API_URL}/products/${id}/`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const product = await res.json();
      const productName = product.name || id;
      const category = product.category || "Fine Jewellery";
      const description =
        product.description ||
        `Explore ${productName} — handcrafted ${category.toLowerCase()} by Gama Jewels. GIA certified diamonds, master goldsmith craftsmanship. Free insured delivery.`;
      const images = product.images?.map((img: { url: string }) => img.url).filter(Boolean) || [];
      const firstImage = images[0] || "/heritage.png";
      const price = product.base_price;

      return {
        title: `${productName} | ${category}`,
        description: description.slice(0, 160),
        alternates: {
          canonical: `${SITE_URL}/product/${id}`,
        },
        openGraph: {
          type: "website",
          title: `${productName} | Gama Jewels`,
          description: description.slice(0, 160),
          url: `${SITE_URL}/product/${id}`,
          siteName: "Gama Jewels",
          images: [
            {
              url: firstImage,
              width: 800,
              height: 800,
              alt: productName,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${productName} | Gama Jewels`,
          description: description.slice(0, 160),
          images: [firstImage],
        },
      };
    }
  } catch {
    // Fall through to default metadata
  }

  // Fallback when API is unavailable
  const formattedId = id.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${formattedId} | Fine Jewellery`,
    description: `Explore ${formattedId} — handcrafted fine jewellery by Gama Jewels. GIA certified diamonds, master goldsmith craftsmanship.`,
    alternates: {
      canonical: `${SITE_URL}/product/${id}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailContent productId={id} />;
}

