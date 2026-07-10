"use client";

import React, { useId } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useApp } from "@/context/AppContext";
import { Icon } from "@/components/SvgIcons";

export const HomeBannersSlider = () => {
  const { homeBanners, locale } = useApp();
  const reactId = useId();
  const navigationId = reactId.replace(/[^a-zA-Z0-9_-]/g, "");

  const activeBanners = homeBanners
    .filter((b) => b.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-main-bg py-8 md:py-12 border-b border-border-color/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border-color/50">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            speed={800}
            loop={activeBanners.length > 1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              bulletClass: "swiper-bullet-custom",
              bulletActiveClass: "swiper-bullet-custom-active",
            }}
            className="w-full h-[50vh] md:h-[65vh] min-h-[400px]"
          >
            {activeBanners.map((banner) => (
              <SwiperSlide key={banner.id} className="relative w-full h-full">
                {/* Background Image */}
                <div className="absolute inset-0">
                  <picture>
                    {banner.mobileImage && (
                      <source media="(max-width: 768px)" srcSet={banner.mobileImage} />
                    )}
                    <img
                      src={banner.image}
                      alt={banner.altText || banner.title}
                      className="w-full h-full object-cover"
                    />
                  </picture>
                  {/* Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center text-center px-6 md:px-12 mx-auto max-w-7xl">
                  <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold uppercase tracking-tight text-white drop-shadow-lg mb-4 animate-fade-in">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="text-sm md:text-lg font-semibold text-white/90 max-w-2xl drop-shadow-md mb-8 animate-fade-in animation-delay-100">
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.ctaText && banner.ctaLink && (
                    <Link
                      href={banner.ctaLink}
                      className="inline-flex items-center gap-2 rounded-full border border-primary-coral bg-primary-coral/10 px-8 py-4 text-sm font-black uppercase tracking-widest text-primary-coral hover:bg-primary-coral hover:text-main-bg transition-luxury animate-fade-in animation-delay-200"
                    >
                      {banner.ctaText}
                      <Icon name="arrow-right" size={16} className={locale === "ar" ? "rotate-180" : ""} />
                    </Link>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <style jsx global>{`
        .swiper-bullet-custom {
          width: 32px;
          height: 4px;
          display: inline-block;
          background: rgba(255, 255, 255, 0.3);
          margin: 0 4px;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-bullet-custom-active {
          background: var(--color-primary-coral, #fb923c);
          width: 48px;
        }
        .swiper-pagination {
          position: absolute;
          top: 24px;
          bottom: auto;
          width: 100%;
          display: flex;
          justify-content: center;
          z-index: 20;
        }
      `}</style>
    </section>
  );
};
