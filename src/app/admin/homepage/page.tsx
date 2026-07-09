"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { HomeBanner, HomeStory, HomeCuratedProduct } from "@/types/store";
import { Icon } from "@/components/SvgIcons";
import { ProductImage } from "@/components/ProductCard";
import { showToast } from "@/lib/toast";
import { api, resolveImageUrl } from "@/lib/api";



export default function AdminHomepageCmsPage() {
  const {
    homeBanners,
    setHomeBanners,
    homeStories,
    setHomeStories,
    homeFeaturedProducts,
    setHomeFeaturedProducts,
    homeBestSellers,
    setHomeBestSellers,
    products,
    locale
  } = useApp();

  const { homePageSettings, updateHomePageSettings } = useApp();

  // Active control section: "banners" | "featured" | "stories" | "bestsellers" | "general"
  const [activeTab, setActiveTab] = useState<"banners" | "featured" | "stories" | "bestsellers" | "general">("banners");

  // General settings states
  const [logoLight, setLogoLight] = useState("");
  const [logoDark, setLogoDark] = useState("");

  const [purityTitle, setPurityTitle] = useState("");
  const [purityTitleAr, setPurityTitleAr] = useState("");
  const [purityQuote, setPurityQuote] = useState("");
  const [purityQuoteAr, setPurityQuoteAr] = useState("");
  const [purityAuthor, setPurityAuthor] = useState("");
  const [purityAuthorAr, setPurityAuthorAr] = useState("");

  const [f1Title, setF1Title] = useState("");
  const [f1TitleAr, setF1TitleAr] = useState("");
  const [f1Desc, setF1Desc] = useState("");
  const [f1DescAr, setF1DescAr] = useState("");

  const [f2Title, setF2Title] = useState("");
  const [f2TitleAr, setF2TitleAr] = useState("");
  const [f2Desc, setF2Desc] = useState("");
  const [f2DescAr, setF2DescAr] = useState("");

  const [f3Title, setF3Title] = useState("");
  const [f3TitleAr, setF3TitleAr] = useState("");
  const [f3Desc, setF3Desc] = useState("");
  const [f3DescAr, setF3DescAr] = useState("");

  const [stEyebrow, setStEyebrow] = useState("");
  const [stEyebrowAr, setStEyebrowAr] = useState("");
  const [stTitle, setStTitle] = useState("");
  const [stTitleAr, setStTitleAr] = useState("");
  const [stDesc, setStDesc] = useState("");
  const [stDescAr, setStDescAr] = useState("");

  const [faqList, setFaqList] = useState<{ q: string; q_ar: string; a: string; a_ar: string }[]>([]);
  const [faqEditorIndex, setFaqEditorIndex] = useState<number | null>(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqQ, setFaqQ] = useState("");
  const [faqQAr, setFaqQAr] = useState("");
  const [faqA, setFaqA] = useState("");
  const [faqAAr, setFaqAAr] = useState("");

  const [savingGeneral, setSavingGeneral] = useState(false);

  // Sync state on load
  React.useEffect(() => {
    if (homePageSettings) {
      setLogoLight(homePageSettings.logoLight || "");
      setLogoDark(homePageSettings.logoDark || "");

      setPurityTitle(homePageSettings.purityPotencyTitle || "Purity & Potency");
      setPurityTitleAr(homePageSettings.purityPotencyTitleAr || "النقاء والفاعلية القوية");
      setPurityQuote(homePageSettings.purityPotencyQuote || "We created Valens because we were tired of under-dosed formulas, synthetic dyes, and sketchy claims. Every gram we formulate serves a biological purpose.");
      setPurityQuoteAr(homePageSettings.purityPotencyQuoteAr || "لقد أنشأنا Valens لأننا سئمنا من التركيبات ضعيفة الجرعات، والألوان الاصطناعية، والادعاءات المشكوك فيها. كل غرام نصيغه يخدم غرضًا بيولوجيًا حقيقيًا.");
      setPurityAuthor(homePageSettings.purityPotencyAuthor || "— Dr. Marcus Vance, Chief Science Officer");
      setPurityAuthorAr(homePageSettings.purityPotencyAuthorAr || "— د. ماركوس فانس، كبير المسؤولين العلميين");

      setF1Title(homePageSettings.purityPotencyFeature1Title || "100% TRANSPARENT LABEL");
      setF1TitleAr(homePageSettings.purityPotencyFeature1TitleAr || "بطاقة مكونات شفافة 100%");
      setF1Desc(homePageSettings.purityPotencyFeature1Desc || "No hidden proprietary blends. We list every single milligram.");
      setF1DescAr(homePageSettings.purityPotencyFeature1DescAr || "لا توجد خلطات احتكارية مخفية. نقوم بسرد كل ملليغرام بالتفصيل.");

      setF2Title(homePageSettings.purityPotencyFeature2Title || "CLINICAL EFFICACY DOSAGES");
      setF2TitleAr(homePageSettings.purityPotencyFeature2TitleAr || "جرعات ذات فاعلية سريرية");
      setF2Desc(homePageSettings.purityPotencyFeature2Desc || "Ingredients dosed at quantities scientifically proven to yield results.");
      setF2DescAr(homePageSettings.purityPotencyFeature2DescAr || "مكونات مصممة بجرعات مثبتة علمياً لتحقيق أفضل النتائج الرياضية.");

      setF3Title(homePageSettings.purityPotencyFeature3Title || "THIRD-PARTY LAB TESTED");
      setF3TitleAr(homePageSettings.purityPotencyFeature3TitleAr || "مختبرة من جهة خارجية مستقلة");
      setF3Desc(homePageSettings.purityPotencyFeature3Desc || "Each batch is verified by independent labs for purity and heavy metals.");
      setF3DescAr(homePageSettings.purityPotencyFeature3DescAr || "يتم التحقق من كل تشغيلة بواسطة مختبرات مستقلة للتأكد من النقاء.");

      setStEyebrow(homePageSettings.storiesEyebrow || "INSIDE VALENS");
      setStEyebrowAr(homePageSettings.storiesEyebrowAr || "داخل Valens");
      setStTitle(homePageSettings.storiesTitle || "PERFORMANCE STORIES & LAB NOTES");
      setStTitleAr(homePageSettings.storiesTitleAr || "قصص الأداء وملاحظات المختبر");
      setStDesc(homePageSettings.storiesDescription || "Explore clinical progress, athletic journals, and batch release logs direct from our development team.");
      setStDescAr(homePageSettings.storiesDescriptionAr || "استكشف التطور السريري، المجلات الرياضية، وسجلات إطلاق الدفعات مباشرة من فريق التطوير.");

      if (homePageSettings.homepageFaqsJson) {
        try {
          const parsed = JSON.parse(homePageSettings.homepageFaqsJson);
          if (Array.isArray(parsed)) {
            setFaqList(parsed);
          }
        } catch (e) {
          console.error("Failed to parse FAQ JSON in admin", e);
        }
      } else {
        setFaqList([]);
      }
    }
  }, [homePageSettings]);

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    try {
      const payload = {
        ...homePageSettings,
        logoLight,
        logoDark,
        purityPotencyTitle: purityTitle,
        purityPotencyTitleAr: purityTitleAr,
        purityPotencyQuote: purityQuote,
        purityPotencyQuoteAr: purityQuoteAr,
        purityPotencyAuthor: purityAuthor,
        purityPotencyAuthorAr: purityAuthorAr,
        purityPotencyFeature1Title: f1Title,
        purityPotencyFeature1TitleAr: f1TitleAr,
        purityPotencyFeature1Desc: f1Desc,
        purityPotencyFeature1DescAr: f1DescAr,
        purityPotencyFeature2Title: f2Title,
        purityPotencyFeature2TitleAr: f2TitleAr,
        purityPotencyFeature2Desc: f2Desc,
        purityPotencyFeature2DescAr: f2DescAr,
        purityPotencyFeature3Title: f3Title,
        purityPotencyFeature3TitleAr: f3TitleAr,
        purityPotencyFeature3Desc: f3Desc,
        purityPotencyFeature3DescAr: f3DescAr,
        storiesEyebrow: stEyebrow,
        storiesEyebrowAr: stEyebrowAr,
        storiesTitle: stTitle,
        storiesTitleAr: stTitleAr,
        storiesDescription: stDesc,
        storiesDescriptionAr: stDescAr,
        homepageFaqsJson: JSON.stringify(faqList)
      };

      await updateHomePageSettings(payload);
      showToast("General homepage configurations updated successfully", "success");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update general settings";
      showToast(msg, "error");
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleOpenAddFaq = () => {
    setFaqEditorIndex(null);
    setFaqQ("");
    setFaqQAr("");
    setFaqA("");
    setFaqAAr("");
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (idx: number) => {
    const item = faqList[idx];
    setFaqEditorIndex(idx);
    setFaqQ(item.q);
    setFaqQAr(item.q_ar);
    setFaqA(item.a);
    setFaqAAr(item.a_ar);
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = () => {
    if (!faqQ || !faqA) {
      showToast("Please enter Question and Answer in English", "error");
      return;
    }
    const newItem = { q: faqQ, q_ar: faqQAr || faqQ, a: faqA, a_ar: faqAAr || faqA };
    if (faqEditorIndex !== null) {
      const updated = faqList.map((item, idx) => idx === faqEditorIndex ? newItem : item);
      setFaqList(updated);
    } else {
      setFaqList([...faqList, newItem]);
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (idx: number) => {
    const updated = faqList.filter((_, i) => i !== idx);
    setFaqList(updated);
  };

  const moveFaqUp = (idx: number) => {
    if (idx === 0) return;
    const updated = [...faqList];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setFaqList(updated);
  };

  const moveFaqDown = (idx: number) => {
    if (idx === faqList.length - 1) return;
    const updated = [...faqList];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setFaqList(updated);
  };

  // --- Modals state ---
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomeBanner | null>(null);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<HomeStory | null>(null);

  // --- Search states for product selectors ---
  const [featuredSearch, setFeaturedSearch] = useState("");
  const [bestsellerSearch, setBestsellerSearch] = useState("");

  // --- Form state: Banner ---
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImage, setBannerImage] = useState(""); // Desktop image URL/Base64
  const [bannerMobileImage, setBannerMobileImage] = useState(""); // Mobile image URL/Base64
  const [bannerCtaText, setBannerCtaText] = useState("");
  const [bannerCtaLink, setBannerCtaLink] = useState("/products");
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerAltText, setBannerAltText] = useState("");

  // --- Form state: Story ---
  const [storyTitle, setStoryTitle] = useState("");
  const [storyDescription, setStoryDescription] = useState("");
  const [storyImage, setStoryImage] = useState("https://picsum.photos/id/1048/1200/900");
  const [storyLink, setStoryLink] = useState("");
  const [storyIsActive, setStoryIsActive] = useState(true);
  const [storyAltText, setStoryAltText] = useState("");

  // Open banner modal for Add
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerTitle("");
    setBannerSubtitle("");
    setBannerImage("");
    setBannerMobileImage("");
    setBannerCtaText("");
    setBannerCtaLink("/products");
    setBannerIsActive(true);
    setBannerAltText("");
    setIsBannerModalOpen(true);
  };

  // Open banner modal for Edit
  const handleOpenEditBanner = (banner: HomeBanner) => {
    setEditingBanner(banner);
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle);
    setBannerImage(banner.image);
    setBannerMobileImage(banner.mobileImage || "");
    setBannerCtaText(banner.ctaText);
    setBannerCtaLink(banner.ctaLink);
    setBannerIsActive(banner.isActive);
    setBannerAltText(banner.altText || "");
    setIsBannerModalOpen(true);
  };

  // ─── Banner Actions ────────────────────────────────────────────────────────
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImage || !bannerCtaLink) {
      showToast("Please upload desktop image and specify redirect link", "error");
      return;
    }

    try {
      if (editingBanner) {
        // Edit mode
        const res = await api.homeControl.banners.update(editingBanner.id, {
          title: bannerTitle,
          subtitle: bannerSubtitle,
          desktopImage: bannerImage,
          mobileImage: bannerMobileImage || "",
          ctaText: bannerCtaText,
          ctaLink: bannerCtaLink,
          altText: bannerAltText || bannerTitle,
          isActive: bannerIsActive,
        });
        if (res && (res as any).success) {
          const updated = homeBanners.map(b => b.id === editingBanner.id ? {
            ...b,
            title: bannerTitle,
            subtitle: bannerSubtitle,
            image: bannerImage,
            mobileImage: bannerMobileImage || undefined,
            ctaText: bannerCtaText,
            ctaLink: bannerCtaLink,
            isActive: bannerIsActive,
            altText: bannerAltText || bannerTitle
          } : b);
          setHomeBanners(updated);
          showToast("Banner details updated", "success");
        }
      } else {
        // Create mode
        const res = await api.homeControl.banners.create({
          title: bannerTitle,
          subtitle: bannerSubtitle,
          desktopImage: bannerImage,
          mobileImage: bannerMobileImage || "",
          ctaText: bannerCtaText,
          ctaLink: bannerCtaLink,
          altText: bannerAltText || bannerTitle,
          isActive: bannerIsActive,
          displayOrder: homeBanners.length + 1
        });
        if (res && (res as any).success) {
          const newBanner: HomeBanner = {
            id: String((res as any).data.id),
            title: bannerTitle,
            subtitle: bannerSubtitle,
            image: bannerImage,
            mobileImage: bannerMobileImage || undefined,
            ctaText: bannerCtaText,
            ctaLink: bannerCtaLink,
            isActive: bannerIsActive,
            displayOrder: homeBanners.length + 1,
            altText: bannerAltText || bannerTitle
          };
          setHomeBanners([...homeBanners, newBanner]);
          showToast("New banner added successfully", "success");
        }
      }
      setIsBannerModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save banner";
      showToast(msg, "error");
    }
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      const res = await api.homeControl.banners.delete(id);
      if (res && (res as any).success) {
        const updated = homeBanners.filter(b => b.id !== id);
        updated.forEach((b, i) => b.displayOrder = i + 1);
        setHomeBanners(updated);
        showToast("Banner deleted", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete banner";
      showToast(msg, "error");
    }
  };

  const saveBannersReorder = async (updatedBanners: HomeBanner[]) => {
    try {
      const reorderItems = updatedBanners.map((b, index) => ({ id: b.id, displayOrder: index + 1 }));
      await api.homeControl.banners.reorder(reorderItems);
    } catch (err) {
      console.error("Failed to save banners reorder in backend", err);
    }
  };

  const moveBannerUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeBanners];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((b, i) => b.displayOrder = i + 1);
    setHomeBanners(updated);
    await saveBannersReorder(updated);
  };

  const moveBannerDown = async (idx: number) => {
    if (idx === homeBanners.length - 1) return;
    const updated = [...homeBanners];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((b, i) => b.displayOrder = i + 1);
    setHomeBanners(updated);
    await saveBannersReorder(updated);
  };

  const handleToggleBannerActive = async (id: string, currentVal: boolean) => {
    try {
      const res = await api.homeControl.banners.toggle(id, !currentVal);
      if (res && (res as any).success) {
        const updated = homeBanners.map(b => b.id === id ? { ...b, isActive: !currentVal } : b);
        setHomeBanners(updated);
        showToast("Banner visibility updated", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to toggle banner visibility";
      showToast(msg, "error");
    }
  };

  // ─── Story Actions ─────────────────────────────────────────────────────────
  const handleOpenAddStory = () => {
    setEditingStory(null);
    setStoryTitle("");
    setStoryDescription("");
    setStoryImage("https://picsum.photos/id/1048/1200/900");
    setStoryLink("");
    setStoryIsActive(true);
    setStoryAltText("");
    setIsStoryModalOpen(true);
  };

  const handleOpenEditStory = (story: HomeStory) => {
    setEditingStory(story);
    setStoryTitle(story.title);
    setStoryDescription(story.description);
    setStoryImage(story.image);
    setStoryLink(story.link || "");
    setStoryIsActive(story.isActive);
    setStoryAltText(story.altText || "");
    setIsStoryModalOpen(true);
  };

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyTitle || !storyDescription || !storyImage) {
      showToast("Title, description and image are required", "error");
      return;
    }

    try {
      if (editingStory) {
        const res = await api.homeControl.stories.update(editingStory.id, {
          title: storyTitle,
          description: storyDescription,
          image: storyImage,
          link: storyLink || "",
          altText: storyAltText || storyTitle,
          isActive: storyIsActive,
        });
        if (res && (res as any).success) {
          const updated = homeStories.map(s => s.id === editingStory.id ? {
            ...s,
            title: storyTitle,
            description: storyDescription,
            image: storyImage,
            link: storyLink || undefined,
            isActive: storyIsActive,
            altText: storyAltText || storyTitle
          } : s);
          setHomeStories(updated);
          showToast("Story card updated", "success");
        }
      } else {
        const res = await api.homeControl.stories.create({
          title: storyTitle,
          description: storyDescription,
          image: storyImage,
          link: storyLink || "",
          altText: storyAltText || storyTitle,
          isActive: storyIsActive,
          displayOrder: homeStories.length + 1
        });
        if (res && (res as any).success) {
          const newStory: HomeStory = {
            id: String((res as any).data.id),
            title: storyTitle,
            description: storyDescription,
            image: storyImage,
            link: storyLink || undefined,
            isActive: storyIsActive,
            displayOrder: homeStories.length + 1,
            altText: storyAltText || storyTitle
          };
          setHomeStories([...homeStories, newStory]);
          showToast("Story card added", "success");
        }
      }
      setIsStoryModalOpen(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save story card";
      showToast(msg, "error");
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      const res = await api.homeControl.stories.delete(id);
      if (res && (res as any).success) {
        const updated = homeStories.filter(s => s.id !== id);
        updated.forEach((s, i) => s.displayOrder = i + 1);
        setHomeStories(updated);
        showToast("Story deleted", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete story card";
      showToast(msg, "error");
    }
  };

  const saveStoriesReorder = async (updatedStories: HomeStory[]) => {
    try {
      const reorderItems = updatedStories.map((s, index) => ({ id: s.id, displayOrder: index + 1 }));
      await api.homeControl.stories.reorder(reorderItems);
    } catch (err) {
      console.error("Failed to save stories reorder in backend", err);
    }
  };

  const moveStoryUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeStories];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((s, i) => s.displayOrder = i + 1);
    setHomeStories(updated);
    await saveStoriesReorder(updated);
  };

  const moveStoryDown = async (idx: number) => {
    if (idx === homeStories.length - 1) return;
    const updated = [...homeStories];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((s, i) => s.displayOrder = i + 1);
    setHomeStories(updated);
    await saveStoriesReorder(updated);
  };

  const handleToggleStoryActive = async (id: string, currentVal: boolean) => {
    try {
      const res = await api.homeControl.stories.toggle(id, !currentVal);
      if (res && (res as any).success) {
        const updated = homeStories.map(s => s.id === id ? { ...s, isActive: !currentVal } : s);
        setHomeStories(updated);
        showToast("Story visibility updated", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to toggle story visibility";
      showToast(msg, "error");
    }
  };

  // ─── Featured Curator Actions ──────────────────────────────────────────────
  const handleAddFeaturedProduct = async (productId: string) => {
    if (homeFeaturedProducts.some(p => p.productId.toLowerCase() === productId.toLowerCase())) {
      showToast("Product is already added to Featured Formulas", "error");
      return;
    }
    try {
      const res = await api.homeControl.sections.addProduct("featured_formulas", {
        productId,
        isActive: true,
        displayOrder: homeFeaturedProducts.length + 1
      });
      if (res && (res as any).success) {
        const newItem: HomeCuratedProduct = {
          id: String((res as any).data.id),
          productId,
          isActive: true,
          displayOrder: homeFeaturedProducts.length + 1
        };
        setHomeFeaturedProducts([...homeFeaturedProducts, newItem]);
        showToast("Product added to featured list", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      showToast(msg, "error");
    }
  };

  const handleRemoveFeaturedProduct = async (productId: string) => {
    const item = homeFeaturedProducts.find(p => p.productId.toLowerCase() === productId.toLowerCase());
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.deleteProduct(item.id);
        if (res && (res as any).success) {
          const updated = homeFeaturedProducts.filter(p => p.productId.toLowerCase() !== productId.toLowerCase());
          updated.forEach((p, i) => p.displayOrder = i + 1);
          setHomeFeaturedProducts(updated);
          showToast("Product removed from featured list", "info");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to remove product";
        showToast(msg, "error");
      }
    } else {
      const updated = homeFeaturedProducts.filter(p => p.productId.toLowerCase() !== productId.toLowerCase());
      updated.forEach((p, i) => p.displayOrder = i + 1);
      setHomeFeaturedProducts(updated);
      showToast("Product removed from featured list", "info");
    }
  };

  const handleToggleFeaturedActive = async (productId: string, currentVal: boolean) => {
    const item = homeFeaturedProducts.find(p => p.productId.toLowerCase() === productId.toLowerCase());
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.toggleProduct(item.id, !currentVal);
        if (res && (res as any).success) {
          const updated = homeFeaturedProducts.map(p => p.productId.toLowerCase() === productId.toLowerCase() ? { ...p, isActive: !currentVal } : p);
          setHomeFeaturedProducts(updated);
          showToast("Product visibility toggled", "success");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to toggle visibility";
        showToast(msg, "error");
      }
    } else {
      const updated = homeFeaturedProducts.map(p => p.productId.toLowerCase() === productId.toLowerCase() ? { ...p, isActive: !currentVal } : p);
      setHomeFeaturedProducts(updated);
      showToast("Product visibility toggled", "success");
    }
  };

  const saveFeaturedReorder = async (updatedFeatured: HomeCuratedProduct[]) => {
    try {
      const reorderItems = updatedFeatured
        .filter(p => !!p.id)
        .map((p, index) => ({ id: p.id!, displayOrder: index + 1 }));
      await api.homeControl.sections.reorder("featured_formulas", reorderItems);
    } catch (err) {
      console.error("Failed to save featured reorder in backend", err);
    }
  };

  const moveFeaturedUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeFeaturedProducts];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeFeaturedProducts(updated);
    await saveFeaturedReorder(updated);
  };

  const moveFeaturedDown = async (idx: number) => {
    if (idx === homeFeaturedProducts.length - 1) return;
    const updated = [...homeFeaturedProducts];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeFeaturedProducts(updated);
    await saveFeaturedReorder(updated);
  };

  // ─── Bestsellers Curator Actions ───────────────────────────────────────────
  const handleAddBestsellerProduct = async (productId: string) => {
    if (homeBestSellers.some(p => p.productId.toLowerCase() === productId.toLowerCase())) {
      showToast("Product is already added to Bestselling Formulas", "error");
      return;
    }
    try {
      const res = await api.homeControl.sections.addProduct("best_selling_formulas", {
        productId,
        isActive: true,
        displayOrder: homeBestSellers.length + 1
      });
      if (res && (res as any).success) {
        const newItem: HomeCuratedProduct = {
          id: String((res as any).data.id),
          productId,
          isActive: true,
          displayOrder: homeBestSellers.length + 1
        };
        setHomeBestSellers([...homeBestSellers, newItem]);
        showToast("Product added to bestselling list", "success");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to add product";
      showToast(msg, "error");
    }
  };

  const handleRemoveBestsellerProduct = async (productId: string) => {
    const item = homeBestSellers.find(p => p.productId.toLowerCase() === productId.toLowerCase());
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.deleteProduct(item.id);
        if (res && (res as any).success) {
          const updated = homeBestSellers.filter(p => p.productId.toLowerCase() !== productId.toLowerCase());
          updated.forEach((p, i) => p.displayOrder = i + 1);
          setHomeBestSellers(updated);
          showToast("Product removed from bestselling list", "info");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to remove product";
        showToast(msg, "error");
      }
    } else {
      const updated = homeBestSellers.filter(p => p.productId.toLowerCase() !== productId.toLowerCase());
      updated.forEach((p, i) => p.displayOrder = i + 1);
      setHomeBestSellers(updated);
      showToast("Product removed from bestselling list", "info");
    }
  };

  const handleToggleBestsellerActive = async (productId: string, currentVal: boolean) => {
    const item = homeBestSellers.find(p => p.productId.toLowerCase() === productId.toLowerCase());
    if (item && item.id) {
      try {
        const res = await api.homeControl.sections.toggleProduct(item.id, !currentVal);
        if (res && (res as any).success) {
          const updated = homeBestSellers.map(p => p.productId.toLowerCase() === productId.toLowerCase() ? { ...p, isActive: !currentVal } : p);
          setHomeBestSellers(updated);
          showToast("Product visibility toggled", "success");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to toggle visibility";
        showToast(msg, "error");
      }
    } else {
      const updated = homeBestSellers.map(p => p.productId.toLowerCase() === productId.toLowerCase() ? { ...p, isActive: !currentVal } : p);
      setHomeBestSellers(updated);
      showToast("Product visibility toggled", "success");
    }
  };

  const saveBestsellerReorder = async (updatedBestsellers: HomeCuratedProduct[]) => {
    try {
      const reorderItems = updatedBestsellers
        .filter(p => !!p.id)
        .map((p, index) => ({ id: p.id!, displayOrder: index + 1 }));
      await api.homeControl.sections.reorder("best_selling_formulas", reorderItems);
    } catch (err) {
      console.error("Failed to save bestselling reorder in backend", err);
    }
  };

  const moveBestsellerUp = async (idx: number) => {
    if (idx === 0) return;
    const updated = [...homeBestSellers];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeBestSellers(updated);
    await saveBestsellerReorder(updated);
  };

  const moveBestsellerDown = async (idx: number) => {
    if (idx === homeBestSellers.length - 1) return;
    const updated = [...homeBestSellers];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    updated.forEach((p, i) => p.displayOrder = i + 1);
    setHomeBestSellers(updated);
    await saveBestsellerReorder(updated);
  };

  // Image upload helper (replaces local reader)
  const handleImageReader = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "home");
      
      showToast("Uploading image...", "info");
      const res = await api.uploads.uploadFile(formData);
      if (res && (res as any).success) {
        setter(resolveImageUrl((res as any).data.url));
        showToast("Image uploaded successfully", "success");
      } else {
        showToast("Failed to upload image", "error");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to upload image";
      showToast(msg, "error");
    }
  };

  // Filter products for dropdown selectors
  const filteredFeaturedProducts = products.filter(p =>
    p.name.toLowerCase().includes(featuredSearch.toLowerCase()) &&
    !homeFeaturedProducts.some(hp => hp.productId.toLowerCase() === p.id.toLowerCase())
  );

  const filteredBestsellerProducts = products.filter(p =>
    p.name.toLowerCase().includes(bestsellerSearch.toLowerCase()) &&
    !homeBestSellers.some(hp => hp.productId.toLowerCase() === p.id.toLowerCase())
  );

  return (
    <div className={`flex flex-col gap-8 p-4 ${locale === "ar" ? "text-right" : "text-left"}`}>

      {/* CMS Header & Panel Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border-color pb-6 gap-6">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider block">
            {locale === "ar" ? "لوحة التحكم التفاعلية بالصفحة الرئيسية" : "Homepage CMS & Curations Control"}
          </h1>
          <p className="text-xs text-muted-text uppercase font-semibold tracking-wider mt-1.5">
            Curate banners, featured lists, stories, and bestseller grids reactively
          </p>
        </div>

        {/* Tab Swappers */}
        <div className="flex flex-wrap rounded-2xl bg-surface-deep p-1.5 border border-border-color/30 gap-1.5 shadow-sm">
          {[
            { id: "banners", label: locale === "ar" ? "البانرات الإعلانية" : "Hero Banners" },
            { id: "featured", label: locale === "ar" ? "المميزة" : "Featured Formulas" },
            { id: "stories", label: locale === "ar" ? "المدونات والقصص" : "Stories & Lab Notes" },
            { id: "bestsellers", label: locale === "ar" ? "الأكثر مبيعاً" : "Best Selling" },
            { id: "general", label: locale === "ar" ? "العناصر العامة واللوجو" : "General Content & Logos" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition-all duration-300 cursor-pointer ${activeTab === tab.id
                  ? "bg-primary-coral text-main-bg shadow-md"
                  : "text-muted-text hover:text-foreground dark:hover:text-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Hero Banners */}
      {activeTab === "banners" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color/30 pb-5 gap-4">
            <div>
              <h3 className="text-base font-black uppercase text-white">{locale === "ar" ? "البانرات الإعلانية بالرئيسية" : "Homepage Hero Banners"}</h3>
              <p className="text-xs text-muted-text uppercase font-semibold mt-1">
                {locale === "ar"
                  ? "قم برفع صور البانرات الإعلانية الكاملة. سيتم إدراجها كشرائح متحركة."
                  : "Upload fully styled banner images. Multiple active banners will cycle as a dynamic carousel."
                }
              </p>
            </div>
            <button
              onClick={handleOpenAddBanner}
              className="rounded-xl bg-primary-coral px-5 py-3 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-md text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg hover:scale-105 transition-all duration-300"
            >
              {locale === "ar" ? "إضافة بانر جديد" : "Add New Banner"}
              <Icon name="plus" size={14} />
            </button>
          </div>

          {homeBanners.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeBanners.sort((a, b) => a.displayOrder - b.displayOrder).map((banner, index) => (
                <div
                  key={banner.id}
                  className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    {/* Visual Preset / Upload indicator */}
                    <div className="h-20 w-32 bg-surface-deep rounded-2xl border border-border-color flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      {["powder", "capsule", "liquid"].includes(banner.image) ? (
                        <ProductImage color="#FF8A75" type={banner.image as any} glow={false} className="h-16 w-full" />
                      ) : (
                        <img src={banner.image} alt="Banner" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block">
                        {locale === "ar" ? `شرائح البانر رقم ${index + 1}` : `Hero Banner Slide #${index + 1}`}
                      </span>
                      <span className="text-xs text-primary-coral font-bold mt-1.5 block">
                        {locale === "ar" ? "رابط التوجيه: " : "Redirect Link: "} {banner.ctaLink}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    {/* Active toggle */}
                    <button
                      onClick={() => handleToggleBannerActive(banner.id, banner.isActive)}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${banner.isActive
                          ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                          : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                        }`}
                    >
                      {banner.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Disabled")}
                    </button>

                    {/* Reorders */}
                    <button
                      disabled={index === 0}
                      onClick={() => moveBannerUp(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      &uarr;
                    </button>
                    <button
                      disabled={index === homeBanners.length - 1}
                      onClick={() => moveBannerDown(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      &darr;
                    </button>

                    {/* Actions */}
                    <button
                      onClick={() => handleOpenEditBanner(banner)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all duration-200 cursor-pointer"
                      title="Edit Banner"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                      title="Delete Banner"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="eye" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">No Active Banners</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Add banners to get started.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Featured Formulas */}
      {activeTab === "featured" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div>
            <h3 className="text-base font-black uppercase text-white mb-1">Featured Formulas Showcase</h3>
            <p className="text-xs text-muted-text uppercase font-semibold">Choose which products display in the Homepage Featured grid.</p>
          </div>

          {/* Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border-color/30 pb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Search catalog to add formulas</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text pointer-events-none">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="text"
                  value={featuredSearch}
                  onChange={(e) => setFeaturedSearch(e.target.value)}
                  placeholder="Type product name..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-coral transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Matching products</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddFeaturedProduct(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-sm text-white uppercase focus:outline-none cursor-pointer"
              >
                <option value="">-- Choose product to add --</option>
                {filteredFeaturedProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Curated list */}
          {homeFeaturedProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeFeaturedProducts.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => {
                const prod = products.find(p => p.id.toLowerCase() === item.productId.toLowerCase());
                if (!prod) return null;
                return (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="h-16 w-14 bg-card-bg border border-border-color/30 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {prod.mainImage ? (
                          <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
                        ) : (
                          <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-12 w-full" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block">{prod.name}</span>
                        <span className="text-xs text-muted-text font-semibold uppercase mt-1 block">{prod.category} • {prod.price.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleFeaturedActive(item.productId, item.isActive)}
                        className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${item.isActive
                            ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                            : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                          }`}
                      >
                        {item.isActive ? "Shown" : "Hidden"}
                      </button>

                      <button
                        disabled={index === 0}
                        onClick={() => moveFeaturedUp(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        &uarr;
                      </button>
                      <button
                        disabled={index === homeFeaturedProducts.length - 1}
                        onClick={() => moveFeaturedDown(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        &darr;
                      </button>

                      <button
                        onClick={() => handleRemoveFeaturedProduct(item.productId)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                        title="Remove"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="star" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">Curator empty</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Currently displaying default featured formulas.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Performance Stories & Lab Notes */}
      {activeTab === "stories" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color/30 pb-5 gap-4">
            <div>
              <h3 className="text-base font-black uppercase text-white">Performance Stories & Lab Notes</h3>
              <p className="text-xs text-muted-text uppercase font-semibold mt-1">Manage grid blog cards shown in the swiper carousel on landing page.</p>
            </div>
            <button
              onClick={handleOpenAddStory}
              className="rounded-xl bg-primary-coral px-5 py-3 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-md text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg hover:scale-105 transition-all duration-300"
            >
              Add New Card
              <Icon name="plus" size={14} />
            </button>
          </div>

          {homeStories.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeStories.sort((a, b) => a.displayOrder - b.displayOrder).map((story, index) => (
                <div
                  key={story.id}
                  className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-center gap-5 w-full sm:w-auto">
                    <div className="h-20 w-28 bg-surface-deep rounded-2xl border border-border-color flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                      <img src={story.image} alt={story.title} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-white block">{story.title}</span>
                      <span className="text-xs text-muted-text font-semibold uppercase mt-1 line-clamp-1 max-w-lg">{story.description}</span>
                      {story.link && (
                        <span className="text-xs text-accent-orange font-bold mt-1 block">Link: {story.link}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleStoryActive(story.id, story.isActive)}
                      className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${story.isActive
                          ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                          : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                        }`}
                    >
                      {story.isActive ? "Shown" : "Hidden"}
                    </button>

                    <button
                      disabled={index === 0}
                      onClick={() => moveStoryUp(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      &uarr;
                    </button>
                    <button
                      disabled={index === homeStories.length - 1}
                      onClick={() => moveStoryDown(index)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      &darr;
                    </button>

                    <button
                      onClick={() => handleOpenEditStory(story)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all duration-200 cursor-pointer"
                      title="Edit Card"
                    >
                      <Icon name="edit" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteStory(story.id)}
                      className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                      title="Delete Card"
                    >
                      <Icon name="close" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="category" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">No stories cards</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Add cards to display stories.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Bestsellers curator */}
      {activeTab === "bestsellers" && (
        <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6 animate-fade-in">
          <div>
            <h3 className="text-base font-black uppercase text-white mb-1">Best Selling Formulas Showcase</h3>
            <p className="text-xs text-muted-text uppercase font-semibold">Choose which products display in the Homepage Bestselling grid.</p>
          </div>

          {/* Selector Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-border-color/30 pb-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Search catalog to add formulas</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-muted-text pointer-events-none">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="text"
                  value={bestsellerSearch}
                  onChange={(e) => setBestsellerSearch(e.target.value)}
                  placeholder="Type product name..."
                  className="w-full rounded-xl border border-border-color bg-surface-deep pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary-coral transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-text">Matching products</label>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleAddBestsellerProduct(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-sm text-white uppercase focus:outline-none cursor-pointer"
              >
                <option value="">-- Choose product to add --</option>
                {filteredBestsellerProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Curated list */}
          {homeBestSellers.length > 0 ? (
            <div className="flex flex-col gap-4">
              {homeBestSellers.sort((a, b) => a.displayOrder - b.displayOrder).map((item, index) => {
                const prod = products.find(p => p.id.toLowerCase() === item.productId.toLowerCase());
                if (!prod) return null;
                return (
                  <div
                    key={item.productId}
                    className="rounded-2xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:bg-surface-deep/30 dark:hover:bg-surface-deep/50 hover:border-primary-coral/45 transition-all duration-300 shadow-sm"
                  >
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="h-16 w-14 bg-card-bg border border-border-color/30 rounded-xl p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                        {prod.mainImage ? (
                          <img src={prod.mainImage} alt={prod.name} className="h-full w-full object-contain" />
                        ) : (
                          <ProductImage color={prod.imageColor} type={prod.imageType} glow={false} className="h-12 w-full" />
                        )}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block">{prod.name}</span>
                        <span className="text-xs text-muted-text font-semibold uppercase mt-1 block">{prod.category} • {prod.price.toLocaleString()} EGP</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleBestsellerActive(item.productId, item.isActive)}
                        className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${item.isActive
                            ? "bg-success-green/10 border-success-green/30 text-success-green hover:bg-success-green/20"
                            : "bg-transparent border-border-color/30 text-muted-text hover:text-foreground hover:bg-surface-deep/40 dark:hover:text-white"
                          }`}
                      >
                        {item.isActive ? "Shown" : "Hidden"}
                      </button>

                      <button
                        disabled={index === 0}
                        onClick={() => moveBestsellerUp(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        &uarr;
                      </button>
                      <button
                        disabled={index === homeBestSellers.length - 1}
                        onClick={() => moveBestsellerDown(index)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-primary-coral hover:border-primary-coral/50 transition-all disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        &darr;
                      </button>

                      <button
                        onClick={() => handleRemoveBestsellerProduct(item.productId)}
                        className="h-10 w-10 rounded-xl border border-border-color/30 bg-card-bg dark:bg-surface-deep/40 flex items-center justify-center text-foreground/80 dark:text-white hover:text-red-500 hover:border-red-500/40 transition-all duration-200 cursor-pointer"
                        title="Remove"
                      >
                        <Icon name="close" size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed border-border-color/30 rounded-2xl bg-surface-deep/10">
              <Icon name="check" size={32} className="text-muted-text mb-3 mx-auto" />
              <span className="block text-sm font-extrabold text-white uppercase">Curator empty</span>
              <span className="block text-xs text-muted-text uppercase font-semibold mt-1">Currently displaying default bestselling formulas.</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: General Content & Logos */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveGeneralSettings} className="flex flex-col gap-6 animate-fade-in text-left">
          
          {/* Logo Settings */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-base font-black uppercase text-white mb-1">
                {locale === "ar" ? "لوجو الموقع الرسمي" : "Official Website Logo Settings"}
              </h3>
              <p className="text-xs text-muted-text uppercase font-semibold">
                {locale === "ar" ? "قم برفع اللوجو الخاص بكل من الوضع المضيء والوضع الداكن" : "Upload the specific header logos to match light and dark theme contrast settings."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border-color/30 pt-6">
              {/* Light Mode Logo (Shows in dark background navbar contrast) */}
              <div className="rounded-xl bg-surface-deep/40 p-6 border border-border-color/20 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {locale === "ar" ? "لوجو الوضع الداكن (نص مضيء)" : "Dark Mode Logo (Light Contrast text)"}
                  </h4>
                  <p className="text-3xs text-muted-text uppercase mt-0.5">
                    {locale === "ar" ? "لوجو ذو لون فاتح يظهر على خلفيات معتمة" : "Highly visible white/light graphic displayed on dark navbars"}
                  </p>
                </div>
                <div className="h-24 w-full bg-slate-900 border border-border-color/40 rounded-xl flex items-center justify-center p-3 relative group overflow-hidden">
                  <img src={logoLight || "/logo-light.png"} alt="Logo Light" className="h-full object-contain" />
                </div>
                <label className="rounded-xl border border-border-color bg-card-bg px-4 py-3 text-xs font-extrabold uppercase text-white hover:text-primary-coral transition cursor-pointer text-center">
                  {locale === "ar" ? "رفع لوجو الوضع الداكن" : "Upload Light Logo File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageReader(e, setLogoLight)}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Dark Mode Logo (Shows in light background navbar contrast) */}
              <div className="rounded-xl bg-surface-deep/40 p-6 border border-border-color/20 flex flex-col gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {locale === "ar" ? "لوجو الوضع المضيء (نص داكن)" : "Light Mode Logo (Dark Contrast text)"}
                  </h4>
                  <p className="text-3xs text-muted-text uppercase mt-0.5">
                    {locale === "ar" ? "لوجو ذو لون داكن يظهر على خلفيات مضيئة" : "Highly visible black/dark graphic displayed on light navbars"}
                  </p>
                </div>
                <div className="h-24 w-full bg-white border border-border-color/40 rounded-xl flex items-center justify-center p-3 relative group overflow-hidden">
                  <img src={logoDark || "/logo-dark.png"} alt="Logo Dark" className="h-full object-contain" />
                </div>
                <label className="rounded-xl border border-border-color bg-card-bg px-4 py-3 text-xs font-extrabold uppercase text-white hover:text-primary-coral transition cursor-pointer text-center">
                  {locale === "ar" ? "رفع لوجو الوضع المضيء" : "Upload Dark Logo File"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageReader(e, setLogoDark)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Purity & Potency texts */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-base font-black uppercase text-white mb-1">
                {locale === "ar" ? "قسم النقاء والفاعلية واقتباس كبير المسؤولين العلميين" : "Purity & Potency Section Texts"}
              </h3>
              <p className="text-xs text-muted-text uppercase font-semibold">
                {locale === "ar" ? "تعديل النصوص والعناوين واقتباس الدكتور ماركوس فانس" : "Customize section eyebrow, quote, and clinical formula validation metrics."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-color/30 pt-6">
              {/* English Inputs */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-primary-coral uppercase tracking-widest">English Text Version</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">Section Eyebrow</label>
                  <input
                    type="text"
                    value={purityTitle}
                    onChange={(e) => setPurityTitle(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white uppercase focus:outline-none focus:border-primary-coral"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">CSO Quote Text</label>
                  <textarea
                    rows={4}
                    value={purityQuote}
                    onChange={(e) => setPurityQuote(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">CSO Quote Author</label>
                  <input
                    type="text"
                    value={purityAuthor}
                    onChange={(e) => setPurityAuthor(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral"
                  />
                </div>
              </div>

              {/* Arabic Inputs */}
              <div className="flex flex-col gap-4 text-right">
                <h4 className="text-xs font-bold text-primary-coral uppercase tracking-widest text-right">النسخة العربية</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">عنوان القسم الجانبي</label>
                  <input
                    type="text"
                    value={purityTitleAr}
                    onChange={(e) => setPurityTitleAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">نص الاقتباس الطبي</label>
                  <textarea
                    rows={4}
                    value={purityQuoteAr}
                    onChange={(e) => setPurityQuoteAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">اسم ومسمى قائل الاقتباس</label>
                  <input
                    type="text"
                    value={purityAuthorAr}
                    onChange={(e) => setPurityAuthorAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl"
                  />
                </div>
              </div>
            </div>

            {/* Feature items grid */}
            <div className="border-t border-border-color/30 pt-6 flex flex-col gap-6">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest">Section Key Features (Three pillars)</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pillar 1 */}
                <div className="rounded-xl bg-surface-deep/20 p-5 border border-border-color/10 flex flex-col gap-3">
                  <span className="text-3xs font-extrabold text-primary-coral uppercase">Pillar 1 - Transparency</span>
                  <input
                    type="text"
                    value={f1Title}
                    onChange={(e) => setF1Title(e.target.value)}
                    placeholder="Title (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={f1TitleAr}
                    onChange={(e) => setF1TitleAr(e.target.value)}
                    placeholder="العنوان (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={f1Desc}
                    onChange={(e) => setF1Desc(e.target.value)}
                    placeholder="Description (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none resize-none"
                  />
                  <textarea
                    rows={2}
                    value={f1DescAr}
                    onChange={(e) => setF1DescAr(e.target.value)}
                    placeholder="الوصف (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none resize-none"
                  />
                </div>

                {/* Pillar 2 */}
                <div className="rounded-xl bg-surface-deep/20 p-5 border border-border-color/10 flex flex-col gap-3">
                  <span className="text-3xs font-extrabold text-primary-coral uppercase">Pillar 2 - Efficacy</span>
                  <input
                    type="text"
                    value={f2Title}
                    onChange={(e) => setF2Title(e.target.value)}
                    placeholder="Title (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={f2TitleAr}
                    onChange={(e) => setF2TitleAr(e.target.value)}
                    placeholder="العنوان (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={f2Desc}
                    onChange={(e) => setF2Desc(e.target.value)}
                    placeholder="Description (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none resize-none"
                  />
                  <textarea
                    rows={2}
                    value={f2DescAr}
                    onChange={(e) => setF2DescAr(e.target.value)}
                    placeholder="الوصف (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none resize-none"
                  />
                </div>

                {/* Pillar 3 */}
                <div className="rounded-xl bg-surface-deep/20 p-5 border border-border-color/10 flex flex-col gap-3">
                  <span className="text-3xs font-extrabold text-primary-coral uppercase">Pillar 3 - Testing</span>
                  <input
                    type="text"
                    value={f3Title}
                    onChange={(e) => setF3Title(e.target.value)}
                    placeholder="Title (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={f3TitleAr}
                    onChange={(e) => setF3TitleAr(e.target.value)}
                    placeholder="العنوان (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={f3Desc}
                    onChange={(e) => setF3Desc(e.target.value)}
                    placeholder="Description (EN)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white focus:outline-none resize-none"
                  />
                  <textarea
                    rows={2}
                    value={f3DescAr}
                    onChange={(e) => setF3DescAr(e.target.value)}
                    placeholder="الوصف (عربي)"
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-3 py-2 text-2xs text-white text-right focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stories Section Headers */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6">
            <div>
              <h3 className="text-base font-black uppercase text-white mb-1">
                {locale === "ar" ? "عناوين ونصوص شريط المدونات والقصص" : "Inside Stories Section Headers"}
              </h3>
              <p className="text-xs text-muted-text uppercase font-semibold">
                {locale === "ar" ? "تعديل العناوين الفرعية والرئيسية لشريط قصص الأداء وملاحظات المختبر" : "Customize section text titles for the homepage Stories carousel swiper."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border-color/30 pt-6">
              {/* EN */}
              <div className="flex flex-col gap-4">
                <h4 className="text-xs font-bold text-primary-coral uppercase tracking-widest">English Text Version</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">Section Eyebrow</label>
                  <input
                    type="text"
                    value={stEyebrow}
                    onChange={(e) => setStEyebrow(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white uppercase focus:outline-none focus:border-primary-coral"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">Section Title</label>
                  <input
                    type="text"
                    value={stTitle}
                    onChange={(e) => setStTitle(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white uppercase focus:outline-none focus:border-primary-coral"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text">Section Description</label>
                  <textarea
                    rows={3}
                    value={stDesc}
                    onChange={(e) => setStDesc(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral resize-none"
                  />
                </div>
              </div>

              {/* AR */}
              <div className="flex flex-col gap-4 text-right">
                <h4 className="text-xs font-bold text-primary-coral uppercase tracking-widest text-right">النسخة العربية</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">العنوان الفرعي للقسم</label>
                  <input
                    type="text"
                    value={stEyebrowAr}
                    onChange={(e) => setStEyebrowAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">العنوان الرئيسي للقسم</label>
                  <input
                    type="text"
                    value={stTitleAr}
                    onChange={(e) => setStTitleAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-3xs font-black uppercase text-muted-text text-right">وصف القسم التفصيلي</label>
                  <textarea
                    rows={3}
                    value={stDescAr}
                    onChange={(e) => setStDescAr(e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-surface-deep px-4 py-3 text-xs text-white focus:outline-none focus:border-primary-coral text-right dir-rtl resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FAQs Control list */}
          <div className="rounded-2xl border border-border-color bg-card-bg p-8 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border-color/30 pb-5 gap-4">
              <div>
                <h3 className="text-base font-black uppercase text-white">
                  {locale === "ar" ? "إدارة الأسئلة الشائعة بالرئيسية" : "Homepage Frequently Asked Questions"}
                </h3>
                <p className="text-xs text-muted-text uppercase font-semibold mt-1">
                  {locale === "ar" ? "أضف، عدل، أو احذف أسئلة الإجابات السريعة" : "Curate dynamic question and answer lists displayed on the home page."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleOpenAddFaq}
                className="rounded-xl bg-primary-coral px-5 py-3 text-xs font-black uppercase flex items-center gap-2 cursor-pointer shadow-md text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg hover:scale-105 transition-all duration-300"
              >
                {locale === "ar" ? "إضافة سؤال جديد" : "Add FAQ Item"}
                <Icon name="plus" size={14} />
              </button>
            </div>

            {faqList.length > 0 ? (
              <div className="flex flex-col gap-3">
                {faqList.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-border-color/40 bg-surface-deep/10 dark:bg-surface-deep/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4"
                  >
                    <div className="flex flex-col gap-1 w-full sm:w-auto text-left">
                      <span className="text-xs font-black text-white">Q: {faq.q}</span>
                      <span className="text-2xs font-extrabold text-muted-text font-bold">A: {faq.a}</span>
                      <span className="text-2xs font-bold text-primary-coral mt-1 block">س: {faq.q_ar}</span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveFaqUp(index)}
                        className="h-8 w-8 rounded-lg border border-border-color/30 bg-card-bg flex items-center justify-center text-white hover:text-primary-coral transition disabled:opacity-30 cursor-pointer"
                      >
                        &uarr;
                      </button>
                      <button
                        type="button"
                        disabled={index === faqList.length - 1}
                        onClick={() => moveFaqDown(index)}
                        className="h-8 w-8 rounded-lg border border-border-color/30 bg-card-bg flex items-center justify-center text-white hover:text-primary-coral transition disabled:opacity-30 cursor-pointer"
                      >
                        &darr;
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEditFaq(index)}
                        className="h-8 w-8 rounded-lg border border-border-color/30 bg-card-bg flex items-center justify-center text-white hover:text-primary-coral transition cursor-pointer"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(index)}
                        className="h-8 w-8 rounded-lg border border-border-color/30 bg-card-bg flex items-center justify-center text-white hover:text-red-500 transition cursor-pointer"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 border-2 border-dashed border-border-color/30 rounded-xl bg-surface-deep/10">
                <span className="block text-xs text-muted-text uppercase font-semibold">No Dynamic FAQs Added. Using Default Static Fallback List.</span>
              </div>
            )}
          </div>

          {/* Save panel */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={savingGeneral}
              className="w-full sm:w-auto rounded-xl bg-primary-coral px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:scale-105 hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-luxury duration-300"
            >
              {savingGeneral ? (locale === "ar" ? "جاري الحفظ..." : "SAVING CHANGES...") : (locale === "ar" ? "حفظ جميع الإعدادات العامة" : "SAVE HOMEPAGE CONFIGURATIONS")}
            </button>
          </div>
        </form>
      )}

      {/* --- BANNER MODAL FORM (Simplified to image-only upload) --- */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleSaveBanner}
            className="w-full max-w-xl rounded-3xl border border-border-color/60 bg-card-bg p-8 shadow-2xl glass-panel relative animate-slide-up flex flex-col gap-6 text-sm"
          >
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute right-5 top-5 text-muted-text hover:text-primary-coral dark:hover:text-white cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>

            <h3 className="text-base font-black uppercase text-white border-b border-border-color/30 pb-4">
              {editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
            </h3>

            {/* Desktop Image File */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">Upload Desktop Image *</label>
              <span className="block text-[10px] text-muted-text uppercase font-semibold tracking-wider mb-2">
                Recommended: 1920x800 px (or 1200x500 px) | Aspect Ratio: 12:5
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageReader(e, setBannerImage)}
                className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all"
              />
              {bannerImage && (
                <div className="mt-3 h-28 w-full rounded-xl overflow-hidden border border-border-color/50 bg-surface-deep flex items-center justify-center">
                  <img src={bannerImage} alt="Desktop Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Mobile Image File */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-1.5">Upload Mobile Image (Optional)</label>
              <span className="block text-[10px] text-muted-text uppercase font-semibold tracking-wider mb-2">
                Recommended: 750x1000 px (or 600x800 px) | Aspect Ratio: 3:4
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageReader(e, setBannerMobileImage)}
                className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all"
              />
              {bannerMobileImage && (
                <div className="mt-3 h-24 w-20 rounded-xl overflow-hidden border border-border-color/50 bg-surface-deep flex items-center justify-center">
                  <img src={bannerMobileImage} alt="Mobile Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>

            {/* Redirect Target Link */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">Banner Redirect Link *</label>
              <input
                type="text"
                required
                value={bannerCtaLink}
                onChange={(e) => setBannerCtaLink(e.target.value)}
                placeholder="e.g. /products or /products?category=protein"
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white mb-2">Image Alt Text (SEO Description)</label>
              <input
                type="text"
                value={bannerAltText}
                onChange={(e) => setBannerAltText(e.target.value)}
                placeholder="e.g. Athlete training with supplements"
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            {/* Visibility checkbox */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="bannerActive"
                checked={bannerIsActive}
                onChange={(e) => setBannerIsActive(e.target.checked)}
                className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-5 w-5 cursor-pointer"
              />
              <label htmlFor="bannerActive" className="text-xs uppercase font-extrabold tracking-wider text-white cursor-pointer select-none">
                Enable banner visibility immediately
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-all uppercase cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                SAVE BANNER
              </button>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="flex-1 rounded-full border !border-border-color/60 !bg-transparent py-3.5 text-xs font-black tracking-widest !text-muted-text hover:!text-primary-coral hover:!border-primary-coral/60 transition-all uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* --- STORY MODAL FORM --- */}
      {isStoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in">
          <form
            onSubmit={handleSaveStory}
            className="w-full max-w-2xl rounded-3xl border border-border-color/60 bg-card-bg p-8 shadow-2xl glass-panel relative animate-slide-up flex flex-col gap-5 text-sm"
          >
            <button
              type="button"
              onClick={() => setIsStoryModalOpen(false)}
              className="absolute right-5 top-5 text-muted-text hover:text-primary-coral dark:hover:text-white cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>

            <h3 className="text-base font-black uppercase text-white border-b border-border-color/30 pb-4 mb-2">
              {editingStory ? "Edit Story Card" : "Add Story Card"}
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Story Title *</label>
              <input
                type="text"
                required
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Description *</label>
              <textarea
                required
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                className="w-full h-28 rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground resize-none focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Optional Target URL Link</label>
                <input
                  type="text"
                  value={storyLink}
                  onChange={(e) => setStoryLink(e.target.value)}
                  placeholder="e.g. /products or /about"
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Upload Card Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageReader(e, setStoryImage)}
                  className="w-full text-xs text-muted-text cursor-pointer bg-surface-deep/40 px-4 py-3 rounded-2xl border border-border-color file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-2xs file:font-black file:uppercase file:bg-primary-coral/10 file:text-primary-coral file:cursor-pointer hover:file:bg-primary-coral/20 file:transition-all mt-1"
                />
              </div>
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-text mb-2">Image Alt Text (SEO Description)</label>
              <input
                type="text"
                value={storyAltText}
                onChange={(e) => setStoryAltText(e.target.value)}
                placeholder="e.g. Close-up of supplement powder scoop"
                className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                type="checkbox"
                id="storyActive"
                checked={storyIsActive}
                onChange={(e) => setStoryIsActive(e.target.checked)}
                className="rounded border-border-color bg-surface-deep text-primary-coral focus:ring-0 h-5 w-5 cursor-pointer"
              />
              <label htmlFor="storyActive" className="text-xs uppercase font-extrabold tracking-wider text-white cursor-pointer select-none">Enable card visibility immediately</label>
            </div>

            <div className="flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-all uppercase cursor-pointer shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                SAVE STORY CARD
              </button>
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(false)}
                className="flex-1 rounded-full border !border-border-color/60 !bg-transparent py-3.5 text-xs font-black tracking-widest !text-muted-text hover:!text-primary-coral hover:!border-primary-coral/60 transition-all uppercase cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {/* FAQ MODAL FORM */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fade-in text-left">
          <div className="w-full max-w-lg rounded-3xl border border-border-color/60 bg-card-bg p-8 shadow-2xl glass-panel relative animate-slide-up flex flex-col gap-6 text-sm">
            <button
              type="button"
              onClick={() => setIsFaqModalOpen(false)}
              className="absolute right-5 top-5 text-muted-text hover:text-primary-coral dark:hover:text-white cursor-pointer"
            >
              <Icon name="close" size={24} />
            </button>

            <h3 className="text-base font-black uppercase text-white border-b border-border-color/30 pb-4">
              {faqEditorIndex !== null ? "Edit FAQ Item" : "Add FAQ Item"}
            </h3>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Question (English) *</label>
                <input
                  type="text"
                  value={faqQ}
                  onChange={(e) => setFaqQ(e.target.value)}
                  placeholder="e.g. How long does shipping take?"
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1 text-right">
                <label className="text-xs font-bold uppercase tracking-wider text-white text-right font-bold">السؤال (عربي)</label>
                <input
                  type="text"
                  value={faqQAr}
                  onChange={(e) => setFaqQAr(e.target.value)}
                  placeholder="مثال: كم يستغرق الشحن؟"
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all text-right dir-rtl"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-white">Answer (English) *</label>
                <textarea
                  rows={3}
                  value={faqA}
                  onChange={(e) => setFaqA(e.target.value)}
                  placeholder="e.g. Standard shipping takes 2-4 business days."
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1 text-right">
                <label className="text-xs font-bold uppercase tracking-wider text-white text-right font-bold">الإجابة (عربي)</label>
                <textarea
                  rows={3}
                  value={faqAAr}
                  onChange={(e) => setFaqAAr(e.target.value)}
                  placeholder="مثال: يستغرق الشحن العادي من ٢ إلى ٤ أيام عمل."
                  className="w-full rounded-2xl border border-border-color bg-surface-deep/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary-coral/60 transition-all text-right dir-rtl resize-none"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={handleSaveFaq}
                className="flex-1 rounded-full bg-primary-coral py-3.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 hover:text-white dark:hover:bg-white dark:hover:text-main-bg transition-all uppercase cursor-pointer shadow-md"
              >
                SAVE FAQ ITEM
              </button>
              <button
                type="button"
                onClick={() => setIsFaqModalOpen(false)}
                className="flex-1 rounded-full border !border-border-color/60 !bg-transparent py-3.5 text-xs font-black tracking-widest !text-muted-text hover:!text-primary-coral hover:!border-primary-coral/60 transition-all uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}