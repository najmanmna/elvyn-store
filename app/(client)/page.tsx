import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import HomeBanner from "@/components/HomeBanner";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrands from "@/components/ShopByBrands";
import { getCategories } from "@/sanity/queries";

export default async function Home() {
  const categories = await getCategories();

  return (
    <div className="bg-tech_bg_color pb-16">
      <HomeBanner />
      <HomeCategories categories={categories} />

      <div className="py-10">
        <ProductGrid />
        <ShopByBrands />
        <LatestBlog />
      </div>
    </div>
  );
}
