// app/product/[slug]/page.tsx  (SERVER component)
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/queries";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return notFound();

  return <ProductClient product={product} />;
}
