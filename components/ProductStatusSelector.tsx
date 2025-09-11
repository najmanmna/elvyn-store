"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Container from "./Container";
import Title from "./Title";

const statuses = [
  {
    title: "NEW ARRIVALS",
    value: "new",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "HOT SELLING",
    value: "hot",
    image:
      "https://images.unsplash.com/photo-1556909212-31cdcf95d9a9?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "BEST DEALS",
    value: "sale",
    image:
      "https://images.unsplash.com/photo-1607082349566-1873426a3d4a?auto=format&fit=crop&w=800&q=80",
  },
];

const ProductStatusSelector = () => {
  const router = useRouter();

  const handleClick = (status: string) => {
    router.push(`/deal/status/${status}`);
  };

  return (
    <Container className="max-w-4xl py-20 mb-10 sm:px-4">
      <div className="text-center mb-10">
        <Title className="text-3xl font-normal">EXPLORE MORE</Title>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left big card */}
        <div
          onClick={() => handleClick(statuses[0].value)}
          className="relative cursor-pointer rounded-[20px] overflow-hidden shadow-lg md:col-span-2 group"
        >
          <img
            src={statuses[0].image}
            alt={statuses[0].title}
            className="w-full h-[400px] md:h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <h2 className="text-white text-3xl md:text-5xl font-semibold drop-shadow-lg">
              {statuses[0].title}
            </h2>
          </div>
        </div>

        {/* Right side stacked 2 cards */}
        <div className="flex flex-col gap-5">
          {statuses.slice(1).map((status) => (
            <div
              key={status.value}
              onClick={() => handleClick(status.value)}
              className="relative h-full cursor-pointer rounded-[20px] overflow-hidden shadow-lg group"
            >
              <img
                src={status.image}
                alt={status.title}
                className="w-full h-[140px] md:h-[145px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-white text-2xl md:text-3xl font-semibold drop-shadow-lg">
                  {status.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default ProductStatusSelector;
