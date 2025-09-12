"use client";
import React, { useState, useEffect } from "react";
import {
  internalGroqTypeReferenceTo,
  SanityImageCrop,
  SanityImageHotspot,
} from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Props {
  images?: Array<{
    asset?: {
      _ref: string;
      _type: "reference";
      _weak?: boolean;
      [internalGroqTypeReferenceTo]?: "sanity.imageAsset";
    };
    hotspot?: SanityImageHotspot;
    crop?: SanityImageCrop;
    _type: "image";
    _key: string;
  }>;
  isStock?: number;
}

const ImageView = ({ images = [], isStock }: Props) => {
  const [active, setActive] = useState(images[0]);
  const [showModal, setShowModal] = useState(false);
  const [initialSlide, setInitialSlide] = useState(0);

  // Reset active image when variant changes
  useEffect(() => {
    if (images.length > 0) {
      setActive(images[0]);
    }
  }, [images]);

  const openModal = (index: number) => {
    setInitialSlide(index);
    setShowModal(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      {/* Wrapper with thumbnails + large preview */}
      <div className="w-full md:w-2/5 flex flex-col md:flex-row gap-4">
        {/* Thumbnails on the left (vertical on desktop, horizontal on mobile) */}
        <div className="flex md:flex-col gap-2 md:gap-3 items-center md:items-start justify-start">
          {images.map((image, idx) => (
            <button
              key={`${image._key ?? "img"}-${idx}`}
              onClick={() => setActive(image)}
              className={`border rounded-md overflow-hidden w-16 h-16 md:w-20 md:h-20 ${
                active?._key === image._key ? "ring-2 ring-tech_dark_color" : ""
              }`}
            >
              <Image
                src={urlFor(image).url()}
                alt={`Thumbnail ${image._key ?? idx}`}
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </button>
          ))}
        </div>

        {/* Large Preview */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active?._key ?? "img-active"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex-1 max-h-[550px] min-h-[450px] border border-tech_dark_color/10 rounded-md group overflow-hidden cursor-pointer"
            onClick={() =>
              openModal(images.findIndex((img) => img._key === active?._key))
            }
          >
            {active && (
              <Image
                src={urlFor(active).url()}
                alt="productImage"
                width={700}
                height={700}
                priority
                className={`w-full h-96 max-h-[550px] min-h-[500px] object-contain group-hover:scale-110 hoverEffect rounded-md ${
                  isStock === 0 ? "opacity-50" : ""
                }`}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modal Carousel */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-tech_black/50 bg-opacity-80 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg max-w-2xl w-full p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <Carousel className="w-full" opts={{ startIndex: initialSlide }}>
                <CarouselContent>
                  {images.map((image, idx) => (
                    <CarouselItem key={`${image._key ?? "img"}-modal-${idx}`}>
                      <div className="flex items-center justify-center h-[500px]">
                        <Image
                          src={urlFor(image).url()}
                          alt={`Product image ${image._key ?? idx}`}
                          width={800}
                          height={800}
                          className="object-contain max-h-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="-left-4" />
                <CarouselNext className="-right-4" />
              </Carousel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageView;
