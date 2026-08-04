import ProductDetailContent from "@/components/product/ProductDetailContent";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `${id.toUpperCase()} Fine Jewellery | Gama Diamond – Hatton Garden`,
    description: "Explore our handcrafted fine diamond jewellery. Made by master goldsmiths in London.",
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductDetailContent productId={id} />;
}
