"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const images = [
  "Pic-1.jpg",
  "Pic-4.jpg",
  "Pic-7.jpg",
  "Pic-10.jpg",
  "Pic-16.jpg",
  "Pic-22.jpg",
  "Pic-24.jpg",
  "Pic-31.jpg",
];

export function AutoCarousel() {
  const autoplay = React.useMemo(
    () => Autoplay({ delay: 3500, stopOnInteraction: false }),
    [],
  );

  return (
    <Carousel
      opts={{ loop: true, direction: "rtl" }}
      dir="rtl"
      plugins={[autoplay]}
      aria-label="تصاویر کارخانه پولاد سقف"
      className="absolute inset-0 h-full w-full [&_[data-slot=carousel-content]]:h-full [&_[data-slot=carousel-content]>div]:h-full"
    >
      <CarouselContent className="ml-0 h-full">
        {images.map((src, index) => (
          <CarouselItem key={src} className="relative h-full pl-0">
            <Image
              fill
              priority={index === 0}
              sizes="100vw"
              src={`/${src}`}
              alt={`نمای کارخانه پولاد سقف ${index + 1}`}
              className="object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
