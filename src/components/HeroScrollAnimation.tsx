"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Icon } from "./SvgIcons";
import { HeroLoadingScreen } from "./loading/HeroLoadingScreen";

const TOTAL_FRAMES = 200;

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
) {
  const imgRatio = img.width / img.height;
  const canvasRatio = width / height;
  let sWidth = img.width;
  let sHeight = img.height;
  let sx = 0;
  let sy = 0;

  if (imgRatio > canvasRatio) {
    sWidth = img.height * canvasRatio;
    sx = (img.width - sWidth) / 2;
  } else {
    sHeight = img.width / canvasRatio;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
}

export const HeroScrollAnimation: React.FC = () => {
  const { homePageSettings, locale } = useApp();
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fadeOutLoading, setFadeOutLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameIndexRef = useRef<number>(-1);

  // Preload frames
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];
    let isRevealed = false;

    const revealSite = () => {
      if (isRevealed) return;
      isRevealed = true;
      setFadeOutLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 600);
    };

    // Fallback: Force reveal after 2.5 seconds max so user is not stuck
    const fallbackTimeout = setTimeout(() => {
      revealSite();
    }, 2500);

    const handleLoad = () => {
      loadedCount++;
      // We still update progress up to 100% just in case it's visible
      const percent = Math.round((loadedCount / TOTAL_FRAMES) * 100);
      setProgress(percent);

      // Reveal site after 10 frames load, or when all load
      if (loadedCount >= 10 || loadedCount === TOTAL_FRAMES) {
        revealSite();
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, "0");
      img.src = `/frames/frame_${frameNum}.jpg`;
      img.onload = handleLoad;
      img.onerror = handleLoad; // Skip bad frames but keep progress moving
      images.push(img);
    }
    imagesRef.current = images;

    return () => clearTimeout(fallbackTimeout);
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Find the closest loaded frame at or before the requested index
    // This prevents the animation from freezing if the exact frame isn't loaded yet
    let imgToDraw = null;
    for (let i = index; i >= 0; i--) {
      const img = imagesRef.current[i];
      if (img && img.complete && img.naturalWidth > 0) {
        imgToDraw = img;
        break;
      }
    }

    if (!imgToDraw) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawImageCover(ctx, imgToDraw, canvas.width, canvas.height);
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const frameIdx = lastFrameIndexRef.current >= 0 ? lastFrameIndexRef.current : 0;
    drawFrame(frameIdx);
  }, [drawFrame]);

  const updateFrame = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const scrollRange = container.scrollHeight - window.innerHeight;
    if (scrollRange <= 0) return;

    const scrollTop = -rect.top;
    const progressVal = Math.max(0, Math.min(1, scrollTop / scrollRange));
    const frameIndex = Math.floor(progressVal * (TOTAL_FRAMES - 1));

    if (frameIndex !== lastFrameIndexRef.current) {
      lastFrameIndexRef.current = frameIndex;
      drawFrame(frameIndex);
    }
  }, [drawFrame]);

  // Initial resize and frame render
  useEffect(() => {
    if (loading) return;
    resizeCanvas();
    updateFrame();
  }, [loading, resizeCanvas, updateFrame]);

  // Scroll and resize listeners
  useEffect(() => {
    if (loading) return;

    let isVisible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const handleScroll = () => {
      if (!isVisible) return;
      requestAnimationFrame(updateFrame);
    };

    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resizeCanvas();
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimeout);
    };
  }, [loading, resizeCanvas, updateFrame]);

  const heroTitleText =
    locale === "ar" && homePageSettings.heroTitle_ar
      ? homePageSettings.heroTitle_ar
      : homePageSettings.heroTitle;
  const heroSubtitleText =
    locale === "ar" && homePageSettings.heroSubtitle_ar
      ? homePageSettings.heroSubtitle_ar
      : homePageSettings.heroSubtitle;
  const heroCtaTextVal =
    locale === "ar" && homePageSettings.heroCtaText_ar
      ? homePageSettings.heroCtaText_ar
      : homePageSettings.heroCtaText;
  const promoBadgeText =
    locale === "ar" && homePageSettings.promoBadge_ar
      ? homePageSettings.promoBadge_ar
      : homePageSettings.promoBadge;

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-main-bg"
      style={{ height: "450vh" }}
    >
      {/* Loading Overlay */}
      <HeroLoadingScreen
        loading={loading}
        fadeOutLoading={fadeOutLoading}
        progress={progress}
      />

      {/* Sticky Canvas Container */}
      <div className="sticky top-20 h-[calc(100vh-5rem)] w-full overflow-hidden z-10">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block w-full h-full object-cover"
        />

        {/* Ambient Dark Overlay to ensure layout readability */}
        <div className="absolute inset-0 bg-black/45 pointer-events-none z-10" />

        {/* Content Panel (Hero Text / Interactive Buttons) */}
        <div className="absolute inset-0 z-20 flex items-center justify-start pointer-events-none">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pointer-events-auto">
            <div className="max-w-xl flex flex-col items-start text-left">
              {/* Promo Badge */}
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary-coral/30 bg-primary-coral/5 px-4 py-1.5 text-xs font-bold tracking-widest text-primary-coral uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent-orange animate-ping" />
                {promoBadgeText || "VALENS LABS"}
              </span>

              {/* Title */}
              <h1 className="text-3xl font-extrabold tracking-tight text-[#ffffff] sm:text-5xl lg:text-6xl uppercase leading-[1.2] sm:leading-[1.1] drop-shadow-md">
                {heroTitleText || "YOUR PREMIUM ENERGY STACK"}
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-sm leading-relaxed text-gray-200 sm:mt-6 sm:text-lg drop-shadow-sm font-medium">
                {heroSubtitleText || "Clinically dosed ingredients to elevate performance."}
              </p>

              {/* Action buttons */}
              <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row w-full sm:w-auto">
                <Link
                  href={homePageSettings.heroCtaLink || "/products"}
                  className="flex items-center justify-center gap-2 rounded-full bg-primary-coral px-6 py-3 sm:px-8 sm:py-4 text-xs sm:text-sm font-black tracking-widest text-[#ffffff] transition-luxury hover:bg-white hover:text-[#000000] hover:scale-105 shadow-[0_4px_20px_rgba(255,138,117,0.3)]"
                >
                  {heroCtaTextVal || "SHOP PERFORMANCE"}
                  <Icon name="arrow-right" size={16} />
                </Link>
              </div>

              {/* Stats overlay */}
              <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-6 border-t border-border-color/60 pt-6 sm:mt-12 sm:pt-8 w-full">
                <div>
                  <span className="text-lg sm:text-2xl font-black text-[#ffffff] drop-shadow-sm">100%</span>
                  <p className="text-[10px] sm:text-3xs font-bold uppercase tracking-widest text-white/60 mt-1 leading-tight sm:leading-normal">
                    {locale === "ar" ? "نقاء معتمد معملياً" : "Lab Certified Purity"}
                  </p>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-black text-[#ffffff] drop-shadow-sm">0g</span>
                  <p className="text-[10px] sm:text-3xs font-bold uppercase tracking-widest text-white/60 mt-1 leading-tight sm:leading-normal">
                    {locale === "ar" ? "خلطات سرية مبهمة" : "Proprietary Blends"}
                  </p>
                </div>
                <div>
                  <span className="text-lg sm:text-2xl font-black text-[#ffffff] drop-shadow-sm">CLINICAL</span>
                  <p className="text-[10px] sm:text-3xs font-bold uppercase tracking-widest text-white/60 mt-1 leading-tight sm:leading-normal">
                    {locale === "ar" ? "جرعات مكونات فاعلة" : "Ingredient Dosages"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/60 mb-3 drop-shadow-md">
            {locale === "ar" ? "اسحب للأسفل" : "Scroll"}
          </span>
          <div className="relative h-[42px] w-[22px] rounded-full border border-white/30 flex justify-center p-1 bg-black/30 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
            <div className="h-2 w-1 rounded-full bg-primary-coral animate-bounce mt-0.5 shadow-[0_0_10px_#FF8A75]" />
          </div>
          <svg className="w-4 h-4 mt-3 text-white/40 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

      </div>
    </div>
  );
};