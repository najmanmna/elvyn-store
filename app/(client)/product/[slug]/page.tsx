import { notFound } from "next/navigation";
import { getProductBySlug } from "@/sanity/queries";
import ProductClient from "./ProductClient";

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params; // ✅ await params
  const product = await getProductBySlug(slug);

  if (!product) return notFound();

  return <ProductClient product={product} />;
}

