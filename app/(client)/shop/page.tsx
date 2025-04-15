import Shop from "@/components/shopPage/Shop";
import { getAllBrands, getCategories } from "@/sanity/queries";

const ShopPage = async () => {
  const categories = await getCategories();
  const brands = await getAllBrands();
  return (
    <div className="bg-tech_bg_color pb-10">
      <Shop categories={categories} brands={brands} />
    </div>
  );
};

export default ShopPage;
