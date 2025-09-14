"use client";
import { useState, useEffect } from "react";
import Container from "./Container";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import { urlFor } from "@/sanity/lib/image";

const CarouselWithDots = ({ banner }: { banner: any[] }) => {
  const [api, setApi] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onInit = (emblaApi: any) => {
    setApi(emblaApi);
    setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  };

  // Auto-slide every 5s
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext(); // loop enabled will wrap automatically
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="w-full lg:col-span-3">
      <Carousel
        className="relative w-full  overflow-hidden"
        setApi={onInit}
        opts={{ loop: true }}
      >
        <CarouselContent>
          {banner.map((item, index) => (
            <CarouselItem key={index} className="pl-0">
              <div className="relative w-full h-[60vh] sm:h-[80vh] aspect-[4/3] sm:aspect-[21/9] flex items-center justify-center mx-auto">
                {item?.image && (
                  <Image
                    src={urlFor(item?.image).url()}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                )}
                {/* 👇 Overlay button */}
                <a
  href={item?.link || "/shop"}
  className={`
    absolute sm:bottom-20 sm:left-35 bottom-6
    px-5 py-2 font-normal border shadow-md
    transition-all duration-300 ease-in-out
    ${
      item?.buttonTheme === "light"
        ? // Light theme: white border & glow
          "bg-transparent text-white border-white hover:text-gray-100 hover:shadow-[0_0_12px_2px_rgba(255,255,255,0.6)]"
        : // Dark theme: black border & glow
          "bg-transparent text-black border-black hover:text-gray-800 hover:shadow-[0_0_12px_2px_rgba(0,0,0,0.5)]"
    }
  `}
>
  SHOP NOW
</a>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots */}
        <div className="flex justify-center mt-3 gap-2">
          {banner.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`h-3 w-3 rounded-full transition ${
                selectedIndex === i ? "bg-tech_orange" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselWithDots;
