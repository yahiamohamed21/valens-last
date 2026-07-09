"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, useRef } from "react";
import { useCartActions } from "@/context/actions/cart-actions";
import { useCategoryActions } from "@/context/actions/category-actions";
import { useCouponActions } from "@/context/actions/coupon-actions";
import { useExpenseActions } from "@/context/actions/expense-actions";
import { useOrderActions } from "@/context/actions/order-actions";
import { useProductActions } from "@/context/actions/product-actions";
import { useSettingsActions } from "@/context/actions/settings-actions";
import { STORAGE_KEYS } from "@/lib/constants";
import { getStorageItem, setStorageItem } from "@/lib/storage";
import { showToast } from "@/lib/toast";
import {
  api,
  decodeJwt,
  mapApiProductToClient,
  mapApiCategoryToClient,
  mapApiCouponToClient,
  mapApiCustomerToClient,
  mapApiExpenseToClient,
  mapApiOrderToClient,
  mapApiReturnToClient,
  mapApiBannerToClient,
  mapApiStoryToClient,
  mapApiSectionProductToClient,
  safeArray,
  resolveImageUrl,
} from "@/lib/api";
import en from "@/data/translations/en.json";
import ar from "@/data/translations/ar.json";
import type {
  AppContextType,
  CartItem,
  Category,
  Coupon,
  Customer,
  Expense,
  HomePageSettings,
  Order,
  Product,
  StoreSettings,
  HomeBanner,
  HomeStory,
  HomeCuratedProduct,
  HomePageStats,
  OrderReturn,
  CarouselItem,
} from "@/types/store";

export type {
  AppContextType,
  CartItem,
  Category,
  Coupon,
  Customer,
  Expense,
  HomePageSettings,
  Order,
  Product,
  Review,
  StoreSettings,
  HomeBanner,
  HomeStory,
  HomeCuratedProduct,
  OrderReturn,
  CarouselItem,
} from "@/types/store";

const AppContext = createContext<AppContextType | undefined>(undefined);

const emptyHomePageSettings: HomePageSettings = {
  brandName: "",
  logoText: "",
  heroTitle: "",
  heroSubtitle: "",
  heroCtaText: "",
  heroCtaLink: "",
  firstBannerTitle: "",
  firstBannerSubtitle: "",
  firstBannerCtaText: "",
  promoBadge: "",
  logoLight: "",
  logoDark: "",
  purityPotencyTitle: "",
  purityPotencyTitleAr: "",
  purityPotencyQuote: "",
  purityPotencyQuoteAr: "",
  purityPotencyAuthor: "",
  purityPotencyAuthorAr: "",
  purityPotencyFeature1Title: "",
  purityPotencyFeature1TitleAr: "",
  purityPotencyFeature1Desc: "",
  purityPotencyFeature1DescAr: "",
  purityPotencyFeature2Title: "",
  purityPotencyFeature2TitleAr: "",
  purityPotencyFeature2Desc: "",
  purityPotencyFeature2DescAr: "",
  purityPotencyFeature3Title: "",
  purityPotencyFeature3TitleAr: "",
  purityPotencyFeature3Desc: "",
  purityPotencyFeature3DescAr: "",
  storiesEyebrow: "",
  storiesEyebrowAr: "",
  storiesTitle: "",
  storiesTitleAr: "",
  storiesDescription: "",
  storiesDescriptionAr: "",
  homepageFaqsJson: "",
};

const emptyStoreSettings: StoreSettings = {
  brandName: "",
  logoText: "",
  contactEmail: "",
  contactPhone: "",
  address: "",
  shippingCost: 0,
  freeShippingThreshold: 0,
  taxRate: 0,
  socialInstagram: "",
  socialTwitter: "",
  socialFacebook: "",
  socialTikTok: "",
  contactOpeningHoursWeekdays: "",
  contactOpeningHoursWeekend: "",
};


const defaultHomeBanners: HomeBanner[] = [
  {
    id: "default-banner-1",
    title: "YOUR PREMIUM ENERGY STACK",
    subtitle: "Clinically dosed ingredients to elevate performance.",
    image: "powder",
    ctaText: "SHOP PERFORMANCE",
    ctaLink: "/products",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "default-banner-2",
    title: "CREATINE MONOHYDRATE PURE",
    subtitle: "100% Lab Certified Purity. Zero Proprietary Blends.",
    image: "capsule",
    ctaText: "DISCOVER CREATINE",
    ctaLink: "/products",
    isActive: true,
    displayOrder: 2,
  }
];

const defaultHomeStories: HomeStory[] = [
  {
    id: "performance-lab",
    title: "Performance Lab",
    description: "Clinical-grade formulas built for measurable strength, endurance, and recovery.",
    image: "https://picsum.photos/id/1048/1200/900",
    link: "/about",
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "daily-recovery",
    title: "Daily Recovery",
    description: "Support the reset phase with transparent ingredients and consistent routines.",
    image: "https://picsum.photos/id/1060/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "clean-energy",
    title: "Clean Energy",
    description: "Focused, smooth output without relying on hidden proprietary blends.",
    image: "https://picsum.photos/id/1076/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "strength-stack",
    title: "Strength Stack",
    description: "Temporary product imagery while the final backend media API is prepared.",
    image: "https://picsum.photos/id/1084/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 4,
  },
  {
    id: "sleep-reset",
    title: "Sleep Reset",
    description: "A calmer end-of-day ritual designed around better readiness tomorrow.",
    image: "https://picsum.photos/id/1025/1200/900",
    link: "/products",
    isActive: true,
    displayOrder: 5,
  }
];

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  const [rawOrders, setRawOrders] = useState<Order[]>([]);
  const [returnsList, setReturnsList] = useState<OrderReturn[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [homePageSettings, setHomePageSettings] = useState<HomePageSettings>(emptyHomePageSettings);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(emptyStoreSettings);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<"Admin" | "Customer" | null>(null);

  const [homeBanners, setHomeBanners] = useState<HomeBanner[]>([]);
  const [homeStories, setHomeStories] = useState<HomeStory[]>([]);
  const [homeFeaturedProducts, setHomeFeaturedProducts] = useState<HomeCuratedProduct[]>([]);
  const [homeBestSellers, setHomeBestSellers] = useState<HomeCuratedProduct[]>([]);
  const [homePageStats, setHomePageStats] = useState<HomePageStats>({
    athletesSupplied: "12K+",
    batchesTested: "48",
    proprietaryBlends: "0",
    reviewScore: "4.9/5",
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const lastAdminFetchRef = useRef<number>(0);


  const setOrders = useCallback((update: React.SetStateAction<Order[]>) => {
    setRawOrders((prev) => {
      return typeof update === "function" ? (update as (prevState: Order[]) => Order[])(prev) : update;
    });
  }, []);

  const orders = useMemo(() => {
    let list = rawOrders;
    if (typeof window !== "undefined") {
      try {
        const extraMetadataStr = localStorage.getItem("valens_orders_extra_metadata");
        if (extraMetadataStr) {
          const extraMetadata = JSON.parse(extraMetadataStr) as Record<string, Record<string, unknown>>;
          list = rawOrders.map((order) => {
            const meta = extraMetadata[order.id];
            if (meta) {
              return { ...order, ...meta };
            }
            return order;
          });
        }
      } catch (e) {
        console.error("Failed to parse extraMetadata", e);
      }
    }

    // Auto-resolve coupon info for initial mockup orders if missing
    return list.map((order) => {
      if (order.couponCode && !order.couponId && coupons.length > 0) {
        const cop = coupons.find((c) => c.code.toUpperCase() === order.couponCode?.toUpperCase());
        if (cop) {
          return {
            ...order,
            couponId: cop.id,
            couponDiscountType: cop.discountType,
            couponDiscountValue: cop.discountValue,
            couponDiscountAmountApplied: order.discountAmount,
            couponTotalBeforeDiscount: order.totalPrice + order.discountAmount - order.shippingCost,
            couponFinalTotalAfterDiscount: order.totalPrice,
          };
        }
      }
      return order;
    });
  }, [rawOrders, coupons]);


  // Auto-save homepage CMS changes reactively
  useEffect(() => {
    if (homeBanners.length > 0) {
      localStorage.setItem("valens_home_banners", JSON.stringify(homeBanners));
    }
  }, [homeBanners]);

  useEffect(() => {
    if (homeStories.length > 0) {
      localStorage.setItem("valens_home_stories", JSON.stringify(homeStories));
    }
  }, [homeStories]);

  useEffect(() => {
    const loadAndSyncWishlist = async () => {
      if (token) {
        try {
          const localWishlist = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST) || [];
          let syncedList: string[] = [];
          if (localWishlist.length > 0) {
            syncedList = await api.wishlist.sync(localWishlist);
          } else {
            syncedList = await api.wishlist.get();
          }
          setWishlist(syncedList);
          setStorageItem(STORAGE_KEYS.WISHLIST, syncedList);
        } catch (err) {
          console.warn("Could not sync wishlist with backend:", err);
          const localWishlist = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST) || [];
          setWishlist(localWishlist);
        }
      } else {
        const localWishlist = getStorageItem<string[]>(STORAGE_KEYS.WISHLIST) || [];
        setWishlist(localWishlist);
      }
    };

    loadAndSyncWishlist();
  }, [token]);

  const toggleWishlist = useCallback(async (productId: string) => {
    let isAlreadyIn = false;
    setWishlist((prev) => {
      const currentList = prev || [];
      isAlreadyIn = currentList.includes(productId);
      const updated = isAlreadyIn ? currentList.filter((id) => id !== productId) : [...currentList, productId];
      setStorageItem(STORAGE_KEYS.WISHLIST, updated);
      return updated;
    });

    const storedToken = typeof window !== "undefined" ? localStorage.getItem("valens_jwt_token") : null;
    if (storedToken) {
      try {
        await api.wishlist.toggle(productId);
      } catch (err) {
        console.error("Failed to toggle wishlist on backend, reverting local state", err);
        setWishlist((prev) => {
          const currentList = prev || [];
          const updated = isAlreadyIn 
            ? [...currentList, productId]
            : currentList.filter((id) => id !== productId);
          setStorageItem(STORAGE_KEYS.WISHLIST, updated);
          return updated;
        });
      }
    }
  }, []);

  const isInWishlist = useCallback((productId: string) => {
    return (wishlist || []).includes(productId);
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("valens_home_featured", JSON.stringify(homeFeaturedProducts));
  }, [homeFeaturedProducts]);

  useEffect(() => {
    localStorage.setItem("valens_home_bestsellers", JSON.stringify(homeBestSellers));
  }, [homeBestSellers]);

  const [locale, setLocale] = useState<"en" | "ar">("en");

  useEffect(() => {
    const storedLocale = localStorage.getItem("valens_locale") as "en" | "ar";
    if (storedLocale === "en" || storedLocale === "ar") {
      setLocale(storedLocale);
    }

    // Load homepage CMS data
    try {
      const savedBanners = localStorage.getItem("valens_home_banners");
      setHomeBanners(savedBanners ? JSON.parse(savedBanners) : defaultHomeBanners);

      const savedStories = localStorage.getItem("valens_home_stories");
      setHomeStories(savedStories ? JSON.parse(savedStories) : defaultHomeStories);

      const savedFeatured = localStorage.getItem("valens_home_featured");
      setHomeFeaturedProducts(savedFeatured ? JSON.parse(savedFeatured) : []);

      const savedBestSellers = localStorage.getItem("valens_home_bestsellers");
      setHomeBestSellers(savedBestSellers ? JSON.parse(savedBestSellers) : []);
    } catch (err) {
      console.error("Failed to load homepage CMS data from local storage:", err);
      setHomeBanners(defaultHomeBanners);
      setHomeStories(defaultHomeStories);
      setHomeFeaturedProducts([]);
      setHomeBestSellers([]);
    }
  }, []);

  const changeLanguage = useCallback((newLocale: "en" | "ar") => {
    setLocale(newLocale);
    localStorage.setItem("valens_locale", newLocale);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const t = useCallback((key: string, variables?: Record<string, string | number>) => {
    const dict = locale === "ar" ? ar : en;
    const keys = key.split(".");
    let val: unknown = dict;
    for (const k of keys) {
      if (val && typeof val === "object" && k in val) {
        val = (val as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    if (typeof val === "string") {
      let result = val;
      if (variables) {
        Object.entries(variables).forEach(([k, v]) => {
          result = result.replace(`{${k}}`, String(v));
        });
      }
      return result;
    }
    return key;
  }, [locale]);

  const fetchPublicData = useCallback(async () => {
    try {
      // 1. Fetch full product catalog
      try {
        const prodList = await api.products.list({ pageSize: 1000 });
        const items = safeArray<Record<string, unknown>>(prodList);
        if (items.length > 0) {
          setProducts(items.map(mapApiProductToClient));
        }
      } catch (err) {
        console.error("Failed to fetch full product catalog:", err);
      }

      // 2. Fetch homepage overview
      try {
        const data = await api.settings.homepageOverview();
        if (data) {
          if (data.categories) {
            setCategories(safeArray<Record<string, unknown>>(data.categories).map(mapApiCategoryToClient));
          }
          const homeConfig = (data.settings || data.Settings || data.homePageSettings || data.homepageConfig) as Record<string, any>;
          if (homeConfig) {
            setHomePageSettings({
              brandName: "Valens",
              logoText: "VALENS",
              heroTitle: homeConfig.homepageHeroTitle || homeConfig.heroTitle || "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
              heroSubtitle: homeConfig.homepageHeroSubtitle || homeConfig.heroSubtitle || "Fuel your body with the highest quality formulations.",
              heroCtaText: "SHOP PERFORMANCE",
              heroCtaLink: "/products",
              firstBannerTitle: homeConfig.firstBannerTitle || "Purity & Potency",
              firstBannerSubtitle: homeConfig.firstBannerSubtitle || "Clinically dosed ingredients to elevate performance.",
              firstBannerCtaText: "SHOP NOW",
              promoBadge: homeConfig.homepageDiscountBannerText || homeConfig.promoBadge || "VALENS LABS",
              heroTitle_ar: homeConfig.homepageHeroTitle_ar || homeConfig.heroTitleAr || homeConfig.heroTitle_ar || "مُصمم برؤية علمية، مُنفجر بقوة الأداء",
              heroSubtitle_ar: homeConfig.homepageHeroSubtitle_ar || homeConfig.heroSubtitleAr || homeConfig.heroSubtitle_ar || "غذي جسدك بأعلى التركيبات جودة.",
              firstBannerTitle_ar: homeConfig.firstBannerTitleAr || homeConfig.firstBannerTitle_ar || "نقاء وفعالية",
              firstBannerSubtitle_ar: homeConfig.firstBannerSubtitleAr || homeConfig.firstBannerSubtitle_ar || "مكونات بجرعات سريرية لرفع مستوى الأداء.",
              heroImage: homeConfig.heroImage ? resolveImageUrl(homeConfig.heroImage) : "",
              promoBannerImage: homeConfig.promoBannerImage ? resolveImageUrl(homeConfig.promoBannerImage) : "",
              logoLight: homeConfig.logoLight ? resolveImageUrl(homeConfig.logoLight) : "",
              logoDark: homeConfig.logoDark ? resolveImageUrl(homeConfig.logoDark) : "",
              purityPotencyTitle: homeConfig.purityPotencyTitle || "",
              purityPotencyTitleAr: homeConfig.purityPotencyTitleAr || "",
              purityPotencyQuote: homeConfig.purityPotencyQuote || "",
              purityPotencyQuoteAr: homeConfig.purityPotencyQuoteAr || "",
              purityPotencyAuthor: homeConfig.purityPotencyAuthor || "",
              purityPotencyAuthorAr: homeConfig.purityPotencyAuthorAr || "",
              purityPotencyFeature1Title: homeConfig.purityPotencyFeature1Title || "",
              purityPotencyFeature1TitleAr: homeConfig.purityPotencyFeature1TitleAr || "",
              purityPotencyFeature1Desc: homeConfig.purityPotencyFeature1Desc || "",
              purityPotencyFeature1DescAr: homeConfig.purityPotencyFeature1DescAr || "",
              purityPotencyFeature2Title: homeConfig.purityPotencyFeature2Title || "",
              purityPotencyFeature2TitleAr: homeConfig.purityPotencyFeature2TitleAr || "",
              purityPotencyFeature2Desc: homeConfig.purityPotencyFeature2Desc || "",
              purityPotencyFeature2DescAr: homeConfig.purityPotencyFeature2DescAr || "",
              purityPotencyFeature3Title: homeConfig.purityPotencyFeature3Title || "",
              purityPotencyFeature3TitleAr: homeConfig.purityPotencyFeature3TitleAr || "",
              purityPotencyFeature3Desc: homeConfig.purityPotencyFeature3Desc || "",
              purityPotencyFeature3DescAr: homeConfig.purityPotencyFeature3DescAr || "",
              storiesEyebrow: homeConfig.storiesEyebrow || "",
              storiesEyebrowAr: homeConfig.storiesEyebrowAr || "",
              storiesTitle: homeConfig.storiesTitle || "",
              storiesTitleAr: homeConfig.storiesTitleAr || "",
              storiesDescription: homeConfig.storiesDescription || "",
              storiesDescriptionAr: homeConfig.storiesDescriptionAr || "",
              homepageFaqsJson: homeConfig.homepageFaqsJson || ""
            });
          }
        }
        const storeConf = await api.settings.storeConfig();
        if (storeConf) {
          setStoreSettings(storeConf);
        }
      } catch (err) {
        console.warn("Homepage overview unavailable, trying individual endpoints...");
        try {
          const prodList = await api.products.list({ pageSize: 1000 });
          if (prodList) {
            setProducts(safeArray<Record<string, unknown>>(prodList).map(mapApiProductToClient));
          }
          const catList = await api.categories.listActive();
          if (catList) {
            setCategories(safeArray<Record<string, unknown>>(catList).map(mapApiCategoryToClient));
          }
          const storeConf = await api.settings.storeConfig();
          if (storeConf) {
            setStoreSettings(storeConf);
          }
          const homeConf = await api.settings.homepageConfig();
          if (homeConf) {
            setHomePageSettings(homeConf);
          }
        } catch (fallbackErr) {
          console.error("All fetch fallbacks failed:", fallbackErr);
          setHomePageSettings({
            brandName: "Valens",
            logoText: "VALENS",
            heroTitle: "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
            heroSubtitle: "Fuel your body with the highest quality formulations.",
            heroCtaText: "SHOP PERFORMANCE",
            heroCtaLink: "/products",
            firstBannerTitle: "Purity & Potency",
            firstBannerSubtitle: "Clinically dosed ingredients to elevate performance.",
            firstBannerCtaText: "SHOP NOW",
            promoBadge: "VALENS LABS",
            heroTitle_ar: "مُصمم برؤية علمية، مُنفجر بقوة الأداء",
            heroSubtitle_ar: "ادعم جسمك بتركيبات عالية الجودة.",
            promoBadge_ar: "مختبرات فالنز"
          });
        }
      }

      // 3. Fetch Home Control data (Banners, Stories, Curated Products)
      try {
        const res = await api.homeControl.getOverview() as any;
        if (res && res.success && res.data) {
          const homeData = res.data;
          
          if (homeData.heroBanners) {
            const banners = Array.isArray(homeData.heroBanners)
              ? homeData.heroBanners
              : typeof homeData.heroBanners === "object" && homeData.heroBanners !== null && Array.isArray(homeData.heroBanners.$values)
                ? homeData.heroBanners.$values
                : [];
            const mappedBanners = banners.map(mapApiBannerToClient);
            setHomeBanners(mappedBanners);
            localStorage.setItem("valens_home_banners", JSON.stringify(mappedBanners));
          }
          
          if (homeData.performanceStories) {
            const stories = Array.isArray(homeData.performanceStories)
              ? homeData.performanceStories
              : typeof homeData.performanceStories === "object" && homeData.performanceStories !== null && Array.isArray(homeData.performanceStories.$values)
                ? homeData.performanceStories.$values
                : [];
            const mappedStories = stories.map(mapApiStoryToClient);
            setHomeStories(mappedStories);
            localStorage.setItem("valens_home_stories", JSON.stringify(mappedStories));
          }
          
          if (homeData.featuredFormulas) {
            const featured = Array.isArray(homeData.featuredFormulas)
              ? homeData.featuredFormulas
              : typeof homeData.featuredFormulas === "object" && homeData.featuredFormulas !== null && Array.isArray(homeData.featuredFormulas.$values)
                ? homeData.featuredFormulas.$values
                : [];
            const mappedFeatured = featured.map(mapApiSectionProductToClient);
            setHomeFeaturedProducts(mappedFeatured);
            localStorage.setItem("valens_home_featured", JSON.stringify(mappedFeatured));
          }
          
          if (homeData.bestSellingFormulas) {
            const bestsellers = Array.isArray(homeData.bestSellingFormulas)
              ? homeData.bestSellingFormulas
              : typeof homeData.bestSellingFormulas === "object" && homeData.bestSellingFormulas !== null && Array.isArray(homeData.bestSellingFormulas.$values)
                ? homeData.bestSellingFormulas.$values
                : [];
            const mappedBestsellers = bestsellers.map(mapApiSectionProductToClient);
            setHomeBestSellers(mappedBestsellers);
            localStorage.setItem("valens_home_bestsellers", JSON.stringify(mappedBestsellers));
          }
          if (homeData.stats) {
            const stats = homeData.stats;
            setHomePageStats({
              athletesSupplied: String(stats.athletesSupplied || "12K+"),
              batchesTested: String(stats.batchesTested || "48"),
              proprietaryBlends: String(stats.proprietaryBlends || "0"),
              reviewScore: String(stats.reviewScore || "4.9/5"),
            });
          }
        }
      } catch (err) {
        console.error("Failed to load home page overview:", err);
      }

      // 4. Fetch public reviews
      try {
        const res = await api.reviews.getPublic() as any;
        if (res && res.success && res.data) {
          const fetchedReviews = Array.isArray(res.data) 
            ? res.data 
            : typeof res.data === "object" && res.data !== null && Array.isArray(res.data.$values)
              ? res.data.$values
              : [];
          setReviews(fetchedReviews);
        }
      } catch (err) {
        console.error("Failed to load public reviews:", err);
      }
    } catch (err) {
      console.error("Global fetchPublicData error:", err);
    }
  }, []);

  const fetchAdminData = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastAdminFetchRef.current < 20000) {
      return;
    }
    lastAdminFetchRef.current = now;

    const results = await Promise.allSettled([
      api.categories.listAdmin(),
      api.coupons.listAdmin(),
      api.customers.listAdmin({ search: "" }),
      api.expenses.listAdmin({}),
      api.orders.listAdmin({}),
      api.products.list({ pageSize: 1000 }),
      api.returns.list(),
      api.homeControl.banners.list(),
      api.homeControl.stories.list(),
      api.homeControl.sections.listProducts("featured_formulas"),
      api.homeControl.sections.listProducts("best_selling_formulas"),
    ]);

    const [
      adminCats,
      adminCoupons,
      adminCustomers,
      adminExpenses,
      adminOrders,
      adminProducts,
      adminReturns,
      adminBanners,
      adminStories,
      adminFeatured,
      adminBestsellers
    ] = results;

    // Check if ALL requests failed (server unreachable) - log only once
    const allFailed = results.every((r) => r.status === "rejected");
    if (allFailed) {
      console.warn("Admin data: backend unreachable, will retry when connection is restored.");
      return;
    }

    if (adminCats.status === "fulfilled" && adminCats.value)
      setCategories(safeArray(adminCats.value).map(mapApiCategoryToClient));
    else if (adminCats.status === "rejected")
      console.error("Failed to load admin categories:", adminCats.reason);

    if (adminCoupons.status === "fulfilled" && adminCoupons.value)
      setCoupons(safeArray(adminCoupons.value).map(mapApiCouponToClient));
    else if (adminCoupons.status === "rejected")
      console.error("Failed to load admin coupons:", adminCoupons.reason);

    if (adminCustomers.status === "fulfilled" && adminCustomers.value)
      setCustomers(safeArray(adminCustomers.value).map(mapApiCustomerToClient));
    else if (adminCustomers.status === "rejected")
      console.error("Failed to load admin customers:", adminCustomers.reason);

    if (adminExpenses.status === "fulfilled" && adminExpenses.value)
      setExpenses(safeArray(adminExpenses.value).map(mapApiExpenseToClient));
    else if (adminExpenses.status === "rejected")
      console.error("Failed to load admin expenses:", adminExpenses.reason);

    if (adminOrders.status === "fulfilled" && adminOrders.value)
      setOrders(safeArray(adminOrders.value).map(mapApiOrderToClient));
    else if (adminOrders.status === "rejected")
      console.error("Failed to load admin orders:", adminOrders.reason);

    if (adminProducts.status === "fulfilled" && adminProducts.value)
      setProducts(safeArray(adminProducts.value).map(mapApiProductToClient));
    else if (adminProducts.status === "rejected")
      console.error("Failed to load admin products:", adminProducts.reason);

    if (adminReturns.status === "fulfilled" && adminReturns.value)
      setReturnsList(safeArray(adminReturns.value).map(mapApiReturnToClient));
    else if (adminReturns.status === "rejected")
      console.error("Failed to load admin returns:", adminReturns.reason);

    if (adminBanners.status === "fulfilled" && adminBanners.value) {
      const data = (adminBanners.value as { data?: unknown }).data || adminBanners.value;
      setHomeBanners(safeArray(data).map(mapApiBannerToClient));
    }

    if (adminStories.status === "fulfilled" && adminStories.value) {
      const data = (adminStories.value as { data?: unknown }).data || adminStories.value;
      setHomeStories(safeArray(data).map(mapApiStoryToClient));
    }

    if (adminFeatured.status === "fulfilled" && adminFeatured.value) {
      const data = (adminFeatured.value as { data?: unknown }).data || adminFeatured.value;
      setHomeFeaturedProducts(safeArray(data).map(mapApiSectionProductToClient));
    }

    if (adminBestsellers.status === "fulfilled" && adminBestsellers.value) {
      const data = (adminBestsellers.value as { data?: unknown }).data || adminBestsellers.value;
      setHomeBestSellers(safeArray(data).map(mapApiSectionProductToClient));
    }
  }, [setOrders]);

  const fetchCustomerData = useCallback(async () => {
    try {
      const history = await api.orders.myHistory();
      if (history) setOrders(safeArray(history).map(mapApiOrderToClient));
    } catch (err) {
      console.error("Failed to load customer order history:", err);
    }
  }, [setOrders]);

  useEffect(() => {
    const storedCart = getStorageItem<CartItem[]>(STORAGE_KEYS.CART);
    if (storedCart !== undefined) setCart(storedCart);

    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("valens_jwt_token");
      if (storedToken) {
        setToken(storedToken);
        const claims = decodeJwt(storedToken);
        if (claims) {
          const email = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]) as string | undefined;
          const role = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) as "Admin" | "Customer" | undefined;
          setCurrentUserEmail(email || null);
          setCurrentUserRole(role || null);
        }
      }
    }

    fetchPublicData();
  }, [fetchPublicData]);

  useEffect(() => {
    if (token && currentUserRole === "Admin") {
      fetchAdminData();
    } else if (token && currentUserRole === "Customer") {
      fetchCustomerData();
    }
  }, [token, currentUserRole, fetchAdminData, fetchCustomerData]);

  const appToast: AppContextType["toast"] = useCallback((msg, type = "info") => {
    showToast(msg, type);
  }, []);



  const loginUser = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.auth.login({ email, password });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        if (response.refreshToken) {
          localStorage.setItem("valens_refresh_token", response.refreshToken);
        }
        setToken(jwtToken);
        const claims = decodeJwt(jwtToken);
        if (claims) {
          const parsedEmail = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email) as string;
          const parsedRole = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer") as "Admin" | "Customer";
          setCurrentUserEmail(parsedEmail);
          setCurrentUserRole(parsedRole);
        } else {
          setCurrentUserEmail(email);
          setCurrentUserRole("Customer");
        }
        showToast("Authenticated successfully!", "success");
        return true;
      }
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to authenticate";
      showToast(message, "error");
      return false;
    }
  }, []);

  const sendRegistrationOtp = useCallback(async (details: { email: string; password?: string; fullName?: string; phone?: string; address?: string; city?: string }) => {
    try {
      const response = await api.auth.sendRegistrationOtp(details);
      showToast(response.message || "OTP sent successfully!", "success");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send OTP";
      showToast(message, "error");
      return false;
    }
  }, []);

  const verifyRegistrationOtp = useCallback(async (email: string, otpCode: string) => {
    try {
      const response = await api.auth.verifyEmailAndRegister({ email, otpCode });
      const jwtToken = response.token;
      if (jwtToken) {
        localStorage.setItem("valens_jwt_token", jwtToken);
        if (response.refreshToken) {
          localStorage.setItem("valens_refresh_token", response.refreshToken);
        }
        setToken(jwtToken);
        const claims = decodeJwt(jwtToken);
        if (claims) {
          const parsedEmail = (claims.email || claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || email) as string;
          const parsedRole = (claims.role || claims["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "Customer") as "Admin" | "Customer";
          setCurrentUserEmail(parsedEmail);
          setCurrentUserRole(parsedRole);
        } else {
          setCurrentUserEmail(email);
          setCurrentUserRole("Customer");
        }
        showToast("Account verified and registered successfully!", "success");
        return true;
      }
      return false;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      showToast(message, "error");
      return false;
    }
  }, []);

  const logoutUser = useCallback(() => {
    setCurrentUserEmail(null);
    setCurrentUserRole(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("valens_jwt_token");
      localStorage.removeItem("valens_current_user");
    }

    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("valens_refresh_token");
      if (refreshToken) {
        api.auth.revokeToken({ refreshToken }).catch((err) => {
          console.error("Failed to revoke token on backend", err);
        });
      }
      localStorage.removeItem("valens_jwt_token");
      localStorage.removeItem("valens_refresh_token");
      localStorage.removeItem("valens_current_user");
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    }
    setWishlist([]);
    setCurrentUserEmail(null);
    setCurrentUserRole(null);
    setToken(null);
    showToast("Logged out successfully", "info");
  }, []);

  const updateCustomer = useCallback(async (email: string, updatedDetails: Partial<Customer>) => {
    try {
      await api.customers.updateProfile({
        name: updatedDetails.name,
        phone: updatedDetails.phone,
        address: updatedDetails.address,
        city: updatedDetails.city,
      });

      const updated = customers.map(c => {
        if (c.email.toLowerCase() === email.toLowerCase()) {
          return { ...c, ...updatedDetails };
        }
        return c;
      });
      setCustomers(updated);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile";
      showToast(message, "error");
    }
  }, [customers]);

  const productActions = useProductActions({ products, setProducts });
  const cartActions = useCartActions({ cart, setCart, setActiveCoupon });
  const orderActions = useOrderActions({
    orders,
    setOrders,
    customers,
    setCustomers,
    products,
    setProducts,
    setCoupons,
    activeCoupon,
    setActiveCoupon,
    clearCart: cartActions.clearCart,
    setCurrentUserEmail,
    editProduct: productActions.editProduct,
    setReturnsList,
  });

  const categoryActions = useCategoryActions({ categories, setCategories });
  const couponActions = useCouponActions({ coupons, setCoupons });
  const expenseActions = useExpenseActions({ expenses, setExpenses });
  const settingsActions = useSettingsActions({ setHomePageSettings, setStoreSettings });

  const value = useMemo<AppContextType>(() => ({
    homePageStats,
    setHomePageStats,
    homeBanners,
    setHomeBanners,
    homeStories,
    setHomeStories,
    homeFeaturedProducts,
    setHomeFeaturedProducts,
    homeBestSellers,
    setHomeBestSellers,
    reviews,
    setReviews,
    returnsList,
    setReturnsList,
    products,
    setProducts,
    categories,
    cart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    orders,
    setOrders,
    customers,
    setCustomers,
    coupons,
    setCoupons,
    expenses,
    homePageSettings,
    storeSettings,
    activeCoupon,
    currentUserEmail,
    token,
    currentUserRole,
    toast: appToast,
    showToast: appToast,
    loginUser,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    logoutUser,
    updateCustomer,
    locale,
    changeLanguage,
    t,
    fetchAdminData,
    fetchCustomerData,
    ...cartActions,
    ...orderActions,
    ...productActions,
    ...categoryActions,
    ...couponActions,
    ...expenseActions,
    ...settingsActions,
  }), [
    homeBanners,
    homeStories,
    homeFeaturedProducts,
    homeBestSellers,
    reviews,
    returnsList,
    activeCoupon,
    currentUserEmail,
    token,
    currentUserRole,
    appToast,
    cart,
    wishlist,
    toggleWishlist,
    isInWishlist,
    cartActions,
    categories,
    categoryActions,
    couponActions,
    coupons,
    customers,
    setCustomers,
    setProducts,
    setOrders,
    setCoupons,
    expenseActions,
    expenses,
    homePageSettings,
    orderActions,
    orders,
    productActions,
    products,
    settingsActions,
    storeSettings,
    loginUser,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    logoutUser,
    updateCustomer,
    locale,
    changeLanguage,
    t,
    fetchAdminData,
    fetchCustomerData,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppContextProvider");
  }
  return context;
};
