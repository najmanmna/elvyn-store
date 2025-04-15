import Container from "./Container";
import Image from "next/image";
import { smallBanner } from "@/images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { getBanner } from "@/sanity/queries";
import { urlFor } from "@/sanity/lib/image";
import ProductComparison from "./ProductComparison";

const HomeBanner = async () => {
  const banner = await getBanner();
  return (
    <Container className="mt-5 grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-5">
      <div className="w-full lg:col-span-3">
        <Carousel className="relative w-full rounded-md overflow-hidden">
          <CarouselContent>
            {banner.map((item, index) => (
              <CarouselItem key={index}>
                <div className="relative w-full aspect-[16/9] md:aspect-[21/9]">
                  {item?.image && (
                    <Image
                      src={urlFor(item?.image).url()}
                      alt={`Banner ${index + 1}`}
                      fill
                      className="object-cover"
                      priority={index === 0}
                    />
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <CarouselPrevious />
            <CarouselNext />
          </div>
        </Carousel>
      </div>

      <div className="hidden lg:flex flex-col gap-4 md:gap-5 h-full">
        <ProductComparison />

        <div className="relative rounded-md overflow-hidden h-auto md:h-1/2 w-full">
          <Image
            src={smallBanner}
            alt="Small Banner"
            sizes="(max-width: 768px) 100vw, 25vw"
            priority
            fill
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </Container>
  );
};

export default HomeBanner;
