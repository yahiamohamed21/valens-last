"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { api } from "@/lib/api";
import { Product } from "@/types/store";
import { ProductCard, ProductImage } from "@/components/ProductCard";
import { Icon } from "@/components/SvgIcons";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ValensBrandCarousel } from "@/components/ValensBrandCarousel";
import { Carousel } from "@/components/Carousel/Carousel";
import { mockCarouselData } from "@/data/mockCarouselData";
import { HeroScrollAnimation } from "@/components/HeroScrollAnimation";
import { HomeBannersSlider } from "@/components/HomeBannersSlider";

// ---------------------------------------------------------------------------
// Static content for the new sections. Swap for CMS/API data whenever ready —
// shape is intentionally flat so it's easy to wire into homePageSettings later.
// ---------------------------------------------------------------------------

const stats = [
  { value: "12K+", label: "Athletes Supplied", label_ar: "رياضي يثق بنا" },
  { value: "48", label: "Batches Lab-Tested / Year", label_ar: "تشغيلة مختبرة سنوياً" },
  { value: "0", label: "Proprietary Blends", label_ar: "خلطات سرية" },
  { value: "4.9/5", label: "Verified Review Score", label_ar: "تقييم موثّق" },
];

const testimonials = [
  {
    name: "Youssef K.",
    role: "Powerlifter",
    role_ar: "رياضي رفع أثقال",
    quote: "Every label matches what's actually in the tub. I finally trust my pre-workout again.",
    quote_ar: "كل ملغم مكتوب على العبوة موجود فعلاً جوه. رجعت أثق في البري-وورك أوت تاني.",
    rating: 5,
  },
  {
    name: "Mariam A.",
    role: "CrossFit Coach",
    role_ar: "مدربة كروس فيت",
    quote: "Recovery time dropped noticeably within two weeks of switching my whole stack to Valens.",
    quote_ar: "وقت الاستشفاء قل بشكل واضح بعد أسبوعين بس من تغيير الستاك بتاعي لـ Valens.",
    rating: 5,
  },
  {
    name: "Omar S.",
    role: "Marathon Runner",
    role_ar: "عداء ماراثون",
    quote: "Clean ingredient lists, no fillers, and the aminos actually taste good. Rare combo.",
    quote_ar: "مكونات نضيفة من غير حشو، والأمينوز طعمها حلو فعلاً. كومبو نادر.",
    rating: 5,
  },
];

const faqs = [
  {
    q: "Are your dosages actually clinically effective, or just label-friendly?",
    q_ar: "الجرعات عندكم فعلاً فعّالة سريرياً ولا بس شكلها حلو على العبوة؟",
    a: "Every active ingredient is dosed at or above the amount used in the published clinical trials behind it — never a token sprinkle. The full breakdown is on every product page.",
    a_ar: "كل مكوّن فعّال بجرعة مساوية أو أعلى من الجرعة المستخدمة في الأبحاث السريرية بتاعته، مش رشة رمزية. التفاصيل كاملة على صفحة كل منتج.",
  },
  {
    q: "Who tests your products, and can I see the results?",
    q_ar: "مين اللي بيختبر المنتجات، وهل ينفع أشوف النتائج؟",
    a: "Independent third-party labs test every batch for purity, potency, and heavy metals. Certificates of analysis are available on request for any batch number.",
    a_ar: "معامل خارجية مستقلة بتختبر كل تشغيلة من ناحية النقاء والفاعلية والمعادن الثقيلة. شهادات التحليل متاحة عند الطلب برقم أي تشغيلة.",
  },
  {
    q: "How do I know which stack fits my goal?",
    q_ar: "أعرف إزاي أنهي ستاك يناسب هدفي؟",
    a: "Start from the category grid above — each goal (protein, pre-workout, aminos, recovery) links to products built specifically around it. Not sure? Our support team will build a stack with you.",
    a_ar: "ابدأ من شبكة الأقسام فوق — كل هدف (بروتين، بري-وورك أوت، أمينوز، استشفاء) بيوديك لمنتجات مبنية عليه بالظبط. لسه مش متأكد؟ فريق الدعم يبني معاك الستاك بنفسه.",
  },
  {
    q: "Do you offer subscriptions or is it one-time only?",
    q_ar: "فيه اشتراك دوري ولا الشراء مرة واحدة بس؟",
    a: "Subscribe to any product at checkout for a standing discount and automatic reorder before you run out — cancel or adjust the schedule anytime from your account.",
    a_ar: "تقدر تشترك في أي منتج وقت الدفع وتاخد خصم ثابت وإعادة طلب تلقائية قبل ما يخلص عندك — وتقدر تلغي أو تعدّل الموعد وقت ما تحب من حسابك.",
  },
];

// ---------------------------------------------------------------------------

export default function Home() {
  const { 
    products, 
    categories, 
    homePageSettings, 
    homeStories, 
    homeFeaturedProducts, 
    homeBestSellers, 
    reviews, 
    locale, 
    t,
    homePageStats
  } = useApp();
  const isAr = locale === "ar";
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const dynamicStats = useMemo(() => [
    { value: homePageStats?.athletesSupplied || "12K+", label: "Athletes Supplied", label_ar: "رياضي يثق بنا" },
    { value: homePageStats?.batchesTested || "48", label: "Batches Lab-Tested / Year", label_ar: "تشغيلة مختبرة سنوياً" },
    { value: homePageStats?.proprietaryBlends || "0", label: "Proprietary Blends", label_ar: "خلطات سرية" },
    { value: homePageStats?.reviewScore || "4.9/5", label: "Verified Review Score", label_ar: "تقييم موثّق" },
  ], [homePageStats]);

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Testimonials lookup (approved reviews from database)
  const activeTestimonials = useMemo(() => {
    if (reviews && reviews.length > 0) {
      return reviews.map((r: any) => ({
        name: r.customerName || "Anonymous Athlete",
        role: isAr ? "رياضي موثق" : "Verified Athlete",
        role_ar: "رياضي موثق",
        quote: r.comment || "",
        quote_ar: r.comment || "",
        rating: r.rating || 5,
      }));
    }
    // Fallback to static testimonials if no reviews are available in DB
    return testimonials;
  }, [reviews, isAr]);

  const [randomizedTestimonials, setRandomizedTestimonials] = useState<any[]>([]);

  // Dynamically resolve FAQs
  const resolvedFaqs = useMemo(() => {
    if (homePageSettings?.homepageFaqsJson) {
      try {
        const parsed = JSON.parse(homePageSettings.homepageFaqsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.warn("Failed to parse dynamic FAQs JSON", e);
      }
    }
    return faqs;
  }, [homePageSettings]);

  React.useEffect(() => {
    if (activeTestimonials.length > 0) {
      const shuffled = [...activeTestimonials].sort(() => Math.random() - 0.5);
      setRandomizedTestimonials(shuffled);
    }
  }, [activeTestimonials]);

  // Stories curation lookup
  const activeStories = useMemo(() => {
    const activeList = (homeStories || [])
      .filter((s) => s.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    if (activeList.length > 0) {
      return activeList.map((s) => ({
        id: s.id,
        title: s.title,
        imageUrl: s.image,
        imageAlt: s.altText || s.title,
        description: s.description,
        link: s.link || "/products",
      }));
    }
    // Fallback to mock data with translations
    return mockCarouselData.map(item => ({
      id: item.id,
      title: isAr && item.title_ar ? item.title_ar : item.title,
      imageUrl: item.imageUrl,
      imageAlt: item.imageAlt,
      description: isAr && item.description_ar ? item.description_ar : item.description,
      link: "/products"
    }));
  }, [homeStories, isAr]);

  const handleSubscribeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribeLoading(true);
    setSubscribeMessage(null);
    try {
      const res = await api.subscribers.subscribe({ email: subscribeEmail, source: "homepage" }) as any;
      if (res && res.success) {
        setSubscribeMessage({
          text: isAr ? "تم الاشتراك بنجاح." : "Subscribed successfully.",
          type: "success"
        });
        setSubscribeEmail("");
      } else {
        setSubscribeMessage({
          text: res?.message || (isAr ? "هذا البريد الإلكتروني مشترك بالفعل." : "This email is already subscribed."),
          type: "error"
        });
      }
    } catch (err) {
      console.error(err);
      setSubscribeMessage({
        text: err instanceof Error ? err.message : (isAr ? "حدث خطأ ما. يرجى المحاولة مرة أخرى." : "Something went wrong. Please try again."),
        type: "error"
      });
    } finally {
      setSubscribeLoading(false);
    }
  };

  const getCategoryName = (catName: string) => {
    if (locale !== "ar") return catName;
    switch (catName.toLowerCase()) {
      case "protein": return "البروتينات";
      case "pre-workout": return "طاقة وتحفيز (Pre-Workout)";
      case "amino acids":
      case "aminos": return "أحماض أمينية (Aminos)";
      case "recovery": return "استشفاء وعضلات (Recovery)";
      default: return catName;
    }
  };

  // Filter products for homepage sections (using admin's curated list if present, otherwise default fallback)
  const featuredProducts = useMemo(() => {
    const activeCurated = (homeFeaturedProducts || []).filter(h => h.isActive);
    if (activeCurated.length > 0) {
      return activeCurated
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((h) => products.find((p) => p.id.toLowerCase() === h.productId.toLowerCase()))
        .filter((p): p is Product => !!p && p.visible);
    }
    return products.filter((p) => p.featured && p.visible).slice(0, 4);
  }, [homeFeaturedProducts, products]);

  const bestSellers = useMemo(() => {
    const activeCurated = (homeBestSellers || []).filter(h => h.isActive);
    if (activeCurated.length > 0) {
      return activeCurated
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((h) => products.find((p) => p.id.toLowerCase() === h.productId.toLowerCase()))
        .filter((p): p is Product => !!p && p.visible);
    }
    return products.filter((p) => p.bestSeller && p.visible).slice(0, 4);
  }, [homeBestSellers, products]);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-white">
      <Navbar />
      <main className="relative w-full flex-1 bg-main-bg">
        <HeroScrollAnimation />

        <ValensBrandCarousel />

        <HomeBannersSlider />

        {/* Decorative background glows — clipped locally, not on <main> */}
        <div className="pointer-events-none relative w-full overflow-hidden">
          <div className="absolute top-[10%] left-[-10%] -z-10 h-[500px] w-[500px] rounded-full bg-primary-coral/5 blur-[120px] animate-pulse-glow" />
          <div className="absolute top-[40%] right-[-10%] -z-10 h-[600px] w-[600px] rounded-full bg-accent-orange/5 blur-[150px]" />
        </div>

        {/* 1.5 Trust Stats Bar */}
        <section className="border-b border-border-color bg-surface-deep/60">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-border-color rtl:divide-x-reverse px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
            {dynamicStats.map((s) => (
              <div key={s.label} className="flex flex-col items-center justify-center gap-1 py-8 text-center">
                <span className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {s.value}
                </span>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-muted-text">
                  {isAr ? s.label_ar : s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Categories Grid */}
        <section className="bg-surface-deep/40 py-16 border-b border-border-color">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                {isAr ? "تصفح الأقسام" : "Browse Catalog"}
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                {isAr ? "مصممة حسب هدفك البدني" : "DESIGNED BY TARGET GOAL"}
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.filter(c => c.visible).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col items-center rounded-2xl border border-border-color bg-card-bg p-6 text-center transition-luxury hover:border-primary-coral/30 hover:bg-surface-sec"
                >
                  <div
                    className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full opacity-0 transition-luxury group-hover:opacity-100 blur-[1px]"
                    style={{ backgroundColor: cat.imageColor }}
                  />
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-deep border border-border-color text-white group-hover:text-gray-800 transition-luxury">
                    <Icon name="category" size={24} style={{ color: cat.imageColor }} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold uppercase tracking-widest text-white group-hover:text-primary-coral transition-luxury">
                    {getCategoryName(cat.name)}
                  </h3>
                  <p className="mt-2 text-2xs text-muted-text font-bold">
                    {isAr
                      ? `حسّن مستويات وأهداف ${getCategoryName(cat.name)} الخاصة بك.`
                      : `Optimize your ${cat.name.toLowerCase()} targets.`
                    }
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Featured Products */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className={isAr ? "text-right" : "text-left"}>
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                {isAr ? "التميز في الصياغة" : "Formulated Excellence"}
              </span>
              <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
                {isAr ? "المنتجات المميزة" : "FEATURED FORMULAS"}
              </h2>
            </div>
            <Link
              href="/products"
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-coral hover:text-gray-800 transition-luxury"
            >
              {isAr ? "عرض جميع المكملات" : "VIEW ALL SUPPLEMENTS"}
              <Icon name="arrow-right" size={14} className={isAr ? "rotate-180" : ""} />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 4. Science Pillar Showcase */}
        <section id="science" className="relative border-t border-b border-border-color bg-surface-deep/20 py-20 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-coral/5 blur-[100px]" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

              {/* Left Graphics */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-4 order-last lg:order-first">
                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel glow-coral-sm">
                  <div className={`flex items-center gap-4 ${isAr ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-primary-coral/10 p-2.5 text-primary-coral shrink-0">
                      <Icon name="check" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature1TitleAr || "بطاقة شفافية 100%") 
                          : (homePageSettings?.purityPotencyFeature1Title || "100% Transparent Label")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature1DescAr || "لا خلطات سرية أو مخفية. ندرج كل ملليغرام بالكامل.") 
                          : (homePageSettings?.purityPotencyFeature1Desc || "No hidden proprietary blends. We list every single milligram.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className={`flex items-center gap-4 ${isAr ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-accent-orange/10 p-2.5 text-accent-orange shrink-0">
                      <Icon name="star" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature2TitleAr || "جرعات سريرية فعالة") 
                          : (homePageSettings?.purityPotencyFeature2Title || "Clinical Efficacy Dosages")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature2DescAr || "مكونات مصاغة بالكميات المثبتة علمياً لتحقيق النتائج الرياضية.") 
                          : (homePageSettings?.purityPotencyFeature2Desc || "Ingredients dosed at quantities scientifically proven to yield results.")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border-color bg-card-bg/60 p-6 glass-panel">
                  <div className={`flex items-center gap-4 ${isAr ? "text-right" : "text-left"}`}>
                    <div className="rounded-lg bg-[#10D981]/10 p-2.5 text-[#10D981] shrink-0">
                      <Icon name="box" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature3TitleAr || "مختبرة ومعتمدة معملياً") 
                          : (homePageSettings?.purityPotencyFeature3Title || "Third-Party Lab Tested")}
                      </h4>
                      <p className="mt-1 text-xs text-muted-text font-bold">
                        {isAr 
                          ? (homePageSettings?.purityPotencyFeature3DescAr || "يتم التحقق من كل تشغيلة بواسطة مختبرات مستقلة للتأكد من النقاء.") 
                          : (homePageSettings?.purityPotencyFeature3Desc || "Each batch is verified by independent labs for purity and heavy metals.")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-7 flex flex-col items-start ${isAr ? "text-right items-end" : "text-left"}`}>
                <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                  {isAr 
                    ? (homePageSettings?.purityPotencyTitleAr || "النقاء والفاعلية القوية") 
                    : (homePageSettings?.purityPotencyTitle || "Purity & Potency")}
                </span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                  {isAr && homePageSettings.firstBannerTitle_ar ? homePageSettings.firstBannerTitle_ar : homePageSettings.firstBannerTitle}
                </h2>
                <p className="mt-6 text-sm leading-relaxed text-white">
                  {isAr && homePageSettings.firstBannerSubtitle_ar ? homePageSettings.firstBannerSubtitle_ar : homePageSettings.firstBannerSubtitle}
                </p>
                <div className="mt-8 w-full">
                  <blockquote className={`border-primary-coral text-xs italic text-muted-text ${isAr ? "border-r-2 pr-4 text-right" : "border-l-2 pl-4 text-left"
                    }`}>
                    {isAr
                      ? (homePageSettings?.purityPotencyQuoteAr || "\"لقد أنشأنا Valens لأننا سئمنا من التركيبات ضعيفة الجرعات، والألوان الاصطناعية، والادعاءات المشكوك فيها. كل غرام نصيغه يخدم غرضًا بيولوجيًا حقيقيًا.\"")
                      : (homePageSettings?.purityPotencyQuote || "\"We created Valens because we were tired of under-dosed formulas, synthetic dyes, and sketchy claims. Every gram we formulate serves a biological purpose.\"")
                    }
                    <span className="block mt-2 font-bold not-italic text-white">
                      {isAr 
                        ? (homePageSettings?.purityPotencyAuthorAr || "— د. ماركوس فانس، كبير المسؤولين العلميين") 
                        : (homePageSettings?.purityPotencyAuthor || "— Dr. Marcus Vance, Chief Science Officer")}
                    </span>
                  </blockquote>
                </div>
                <div className="mt-8">
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-2 rounded-full border border-primary-coral bg-primary-coral/10 px-6 py-3 text-xs font-black tracking-widest text-primary-coral hover:bg-primary-coral hover:text-main-bg transition-luxury"
                  >
                    {isAr && homePageSettings.firstBannerCtaText_ar ? homePageSettings.firstBannerCtaText_ar : homePageSettings.firstBannerCtaText}
                    <Icon name="arrow-right" size={14} className={isAr ? "rotate-180" : ""} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Brand Stories Swiper Carousel */}
        <Carousel
          items={activeStories}
          title={isAr 
            ? (homePageSettings?.storiesTitleAr || "قصص الأداء وملاحظات المختبر") 
            : (homePageSettings?.storiesTitle || "Performance Stories & Lab Notes")}
          eyebrow={isAr 
            ? (homePageSettings?.storiesEyebrowAr || "داخل Valens") 
            : (homePageSettings?.storiesEyebrow || "Inside Valens")}
          description={isAr 
            ? (homePageSettings?.storiesDescriptionAr || "استكشف التطور السريري، المجلات الرياضية، وسجلات إطلاق الدفعات مباشرة من فريق التطوير.") 
            : (homePageSettings?.storiesDescription || "Explore clinical progress, athletic journals, and batch release logs direct from our development team.")}
        />

        {/* 5. Best Sellers Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
              {isAr ? "المفضلة لدى الرياضيين" : "Athlete Favorites"}
            </span>
            <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-white uppercase">
              {isAr ? "المنتجات الأكثر مبيعاً" : "BEST SELLING FORMULAS"}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:gap-8">
            {bestSellers.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </section>

        {/* 6. Testimonials */}
        <section className="relative border-t border-b border-border-color bg-surface-deep/20 py-20 overflow-hidden">
          <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-accent-orange/5 blur-[120px]" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
                {isAr ? "آراء موثّقة" : "Verified Feedback"}
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
                {isAr ? "من يستخدم Valens فعلاً" : "WHO'S ACTUALLY USING VALENS"}
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              {(randomizedTestimonials.length > 0 ? randomizedTestimonials : activeTestimonials).slice(0, 3).map((tItem, index) => (
                <div
                  key={`${tItem.name}-${index}`}
                  className={`flex flex-col rounded-2xl border border-border-color bg-card-bg p-6 glass-panel ${isAr ? "text-right" : "text-left"}`}
                >
                  <div className="flex items-center gap-1 text-primary-coral">
                    {Array.from({ length: tItem.rating }).map((_, i) => (
                      <Icon key={i} name="star" size={14} />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-white">
                    {isAr ? tItem.quote_ar : tItem.quote}
                  </p>
                  <div className="mt-6 border-t border-border-color pt-4">
                    <span className="block text-xs font-extrabold uppercase tracking-wider text-white">
                      {tItem.name}
                    </span>
                    <span className="block text-2xs font-bold text-muted-text">
                      {isAr ? tItem.role_ar : tItem.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
              {isAr ? "بنجاوب بشفافية" : "Straight Answers"}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
              {isAr ? "أسئلة شائعة" : "FREQUENTLY ASKED"}
            </h2>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {resolvedFaqs.map((item, i) => {
              const open = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="rounded-2xl border border-border-color bg-card-bg overflow-hidden transition-luxury"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    className={`flex w-full items-center justify-between gap-4 px-6 py-5 text-sm font-extrabold uppercase tracking-wide text-white ${isAr ? "text-right flex-row-reverse" : "text-left"}`}
                    aria-expanded={open}
                  >
                    <span>{isAr ? item.q_ar : item.q}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={`shrink-0 text-primary-coral transition-luxury ${open ? "rotate-45" : ""}`}
                    >
                      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                    </svg>
                  </button>
                  <div
                    className={`grid transition-luxury ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className={`px-6 pb-5 text-sm leading-relaxed text-muted-text font-bold ${isAr ? "text-right" : "text-left"}`}>
                        {isAr ? item.a_ar : item.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 8. Lab Notes Newsletter */}
        <section className="border-t border-border-color bg-surface-deep/40 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-primary-coral font-bold">
              {isAr ? "خلك أول من يعرف" : "Stay Ahead of the Batch"}
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white uppercase sm:text-4xl">
              {isAr ? "اشترك في نشرة المختبر" : "JOIN THE LAB NOTES LIST"}
            </h2>
            <p className="mt-4 text-sm text-muted-text font-bold">
              {isAr
                ? "إشعار عند إطلاق تشغيلة جديدة، نتائج الاختبارات، وعروض حصرية للمشتركين — من غير سبام."
                : "New batch drops, fresh lab results, and subscriber-only offers — no spam, just what matters."}
            </p>
            <form
              onSubmit={handleSubscribeSubmit}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                disabled={subscribeLoading}
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder={isAr ? "بريدك الإلكتروني" : "Your email address"}
                className="w-full flex-1 rounded-full border border-border-color bg-main-bg px-5 py-3 text-xs font-bold text-white placeholder:text-muted-text focus:border-primary-coral focus:outline-none disabled:opacity-55"
              />
              <button
                type="submit"
                disabled={subscribeLoading}
                className="shrink-0 rounded-full bg-primary-coral px-6 py-3 text-xs font-black uppercase tracking-widest text-main-bg transition-luxury hover:bg-accent-orange disabled:opacity-55"
              >
                {subscribeLoading ? (isAr ? "جاري..." : "Subscribing...") : (isAr ? "اشتراك" : "Subscribe")}
              </button>
            </form>
            {subscribeMessage && (
              <p className={`mt-4 text-xs font-bold ${subscribeMessage.type === "success" ? "text-[#10D981]" : "text-red-500"}`}>
                {subscribeMessage.text}
              </p>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}