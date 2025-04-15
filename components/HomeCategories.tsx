import { Category } from "@/sanity.types";
import Container from "./Container";
import Title from "./Title";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { ChartArea, FileQuestion, Laptop, Settings } from "lucide-react";

interface Props {
  categories: Category[];
}

const data = [
  {
    title: "Laptop Finder",
    description: "Find Your Laptop Easily",
    icon: <Laptop className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    title: "Raise a Complain",
    description: "Share your experience",
    icon: <ChartArea className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    title: "Online Support",
    description: "Get Online Support",
    icon: <FileQuestion className="w-5 h-5 md:w-6 md:h-6" />,
  },
  {
    title: "Service Center",
    description: "Repair Your Device",
    icon: <Settings className="w-5 h-5 md:w-6 md:h-6" />,
  },
];

const HomeCategories = ({ categories }: Props) => {
  return (
    <Container className="w-full mt-10 lg:mt-20 rounded-md">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
        {data?.map((item) => (
          <div
            key={item?.title}
            className="flex items-center justify-center md:justify-baseline gap-3 md:gap-5 bg-white p-3 rounded-md border border-tech_orange/20 hover:border-tech_orange hoverEffect"
          >
            <span className="bg-tech_orange text-white p-2 rounded-full">
              {item?.icon}
            </span>
            <div>
              <h3 className="font-semibold text-sm md:text-base tracking-wide">
                {item?.title}
              </h3>
              <p className="text-sm hidden lg:inline-flex">
                {item?.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center space-y-1.5 mb-5 md:mb-10">
        <Title className="text-xl">Featured Categories</Title>
        <p className="text-sm font-medium md:text-base">
          Get Your Desired Product from Featured Category!
        </p>
      </div>
      <div className="mt-5 grid grid-cols-4 md:grid-cols-8 gap-2.5">
        {categories?.map((category) => (
          <div
            key={category?._id}
            className="bg-white p-5 flex flex-col items-center gap-3 group rounded-lg border border-transparent hover:border-tech_orange hoverEffect"
          >
            {category?.image && (
              <div className="overflow-hidden w-10 h-10 md:w-12 md:h-12">
                <Link href={`/category/${category?.slug?.current}`}>
                  <Image
                    src={urlFor(category?.image).url()}
                    alt="categoryImage"
                    width={500}
                    height={500}
                    className="w-full h-full"
                  />
                </Link>
              </div>
            )}

            <p className="text-xs md:text-sm font-semibold text-center line-clamp-1">
              {category?.title}
            </p>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default HomeCategories;
