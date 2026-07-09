import React from "react";

export function OrderNowMarquee() {
  const marqueeStyles = `
    @keyframes order-marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .animate-order-marquee {
      animation: order-marquee 30s linear infinite;
    }
  `;

  return (
    <div
      dir="ltr"
      data-theme="dark"
      aria-label="Order Now Marquee"
      className="relative flex flex-col overflow-hidden border-b border-border-color bg-primary-coral text-main-bg py-2"
    >
      <style dangerouslySetInnerHTML={{ __html: marqueeStyles }} />

      {/* Main track: Brand Title (moving Left to Right) */}
      <div className="relative overflow-hidden flex">
        <div className="animate-order-marquee flex w-max items-center gap-6 whitespace-nowrap" aria-hidden="true">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={`order-now-${index}`}
              className="flex items-center gap-6"
            >
              <span className="text-sm md:text-base font-black tracking-[0.1em] uppercase italic select-none">
                ORDER NOW
              </span>
              <span className="text-sm md:text-base animate-pulse">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
