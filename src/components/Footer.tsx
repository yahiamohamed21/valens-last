"use client";

import React from "react";
import Link from "next/link";
import { useApp, Category } from "@/context/AppContext";

export const Footer: React.FC = () => {
  const { storeSettings, categories, locale } = useApp();

  const getCategoryName = (catName: string) => {
    if (locale !== "ar") return catName;
    switch (catName.toLowerCase()) {
      case "protein": return "البروتينات";
      case "pre-workout": return "الطاقة والتحفيز";
      case "amino acids":
      case "aminos": return "الأحماض الأمينية";
      case "recovery": return "الاستشفاء والعضلات";
      default: return catName;
    }
  };

  return (
    <footer className="w-full border-t border-border-color bg-surface-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className={`grid grid-cols-1 gap-8 md:grid-cols-4 ${locale === "ar" ? "text-right" : "text-left"}`}>

          {/* Brand Col */}
          <div className="flex flex-col gap-4">
            <span className="text-glow text-xl font-black tracking-widest text-primary-coral">
              {storeSettings.logoText}
            </span>
            <p className="max-w-xs text-xs leading-relaxed text-muted-text">
              {locale === "ar"
                ? "صياغة مكملات رياضية ذات قوة سريرية. شفافية كاملة للبطاقات، نقاء مختبر معملياً، وفعالية خام."
                : "Formulating clinical-strength athletic supplements. Complete label transparency, lab-tested purity, and raw efficacy."
              }
            </p>
          </div>

          {/* Catalog Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "تسوق" : "SHOP"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              {categories.filter((c: Category) => c.visible).map((cat: Category) => (
                <li key={cat.id}>
                  <Link href={`/products?category=${cat.slug}`} className="hover:text-primary-coral transition-luxury">
                    {locale === "ar" ? `تركيبات ${getCategoryName(cat.name)}` : `${cat.name} Formulas`}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-primary-coral transition-luxury font-semibold text-primary-coral">
                  {locale === "ar" ? "جميع المنتجات" : "All Products"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "العلم والعلامة التجارية" : "SCIENCE & BRAND"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/#science" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "العلم وراء Valens" : "The Valens Science"}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "من نحن (فريقنا)" : "About Our Team"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-widest text-white">
              {locale === "ar" ? "دعم الرياضيين" : "ATHLETE SUPPORT"}
            </h4>
            <ul className="mt-4 flex flex-col gap-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-primary-coral transition-luxury">
                  {locale === "ar" ? "اتصل بنا" : "Contact Us"}
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 border-t border-border-color pt-8 md:flex-row text-3xs text-muted-text uppercase tracking-wider">
          <div className="text-center md:text-left">
            {locale === "ar"
              ? `حقوق الطبع والنشر © ${new Date().getFullYear()} شركة VALENS لتغذية الأداء المتميز. جميع الحقوق محفوظة.`
              : `© ${new Date().getFullYear()} VALENS ELITE PERFORMANCE NUTRITION INC. ALL RIGHTS RESERVED.`
            }
          </div>
        </div>
      </div>
    </footer>
  );
};
