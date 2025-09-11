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
    <Container className="mt-5">
      <div className="w-full lg:col-span-3">
        <Carousel
          className="relative w-full rounded-md overflow-hidden"
          setApi={onInit}
        >
          <CarouselContent>
            {banner.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full sm:w-3/4 aspect-[4/3] sm:aspect-[21/9] flex items-center justify-center mx-auto">
                  {item?.image && (
                    <Image
                      src={urlFor(item?.image).url()}
                      alt={`Banner ${index + 1}`}
                      fill
                      className="object-cover sm:object-contain"
                      priority={index === 0}
                    />
                  )}
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
    </Container>
  );
};

export default CarouselWithDots;
