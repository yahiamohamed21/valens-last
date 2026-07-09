import { useCallback, useMemo } from "react";
import type { Dispatch, SetStateAction } from "react";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";
import type { HomePageSettings, StoreSettings } from "@/types/store";

interface SettingsActionDeps {
  setHomePageSettings: Dispatch<SetStateAction<HomePageSettings>>;
  setStoreSettings: Dispatch<SetStateAction<StoreSettings>>;
}

export const useSettingsActions = ({ setHomePageSettings, setStoreSettings }: SettingsActionDeps) => {
  const updateHomePageSettings = useCallback(async (newSettings: HomePageSettings) => {
    try {
      const dto = {
        HomepageHeroTitle: newSettings.heroTitle || "FORGED IN SCIENCE, UNLEASHED IN PERFORMANCE",
        HomepageHeroSubtitle: newSettings.heroSubtitle || "Fuel your body with the highest quality formulations.",
        HomepageDiscountBannerText: newSettings.promoBadge || "VALENS LABS",
        HeroImage: newSettings.heroImage || "",
        PromoBannerImage: newSettings.promoBannerImage || "",
        LogoLight: newSettings.logoLight || "",
        LogoDark: newSettings.logoDark || "",
        PurityPotencyTitle: newSettings.purityPotencyTitle || "",
        PurityPotencyTitleAr: newSettings.purityPotencyTitleAr || "",
        PurityPotencyQuote: newSettings.purityPotencyQuote || "",
        PurityPotencyQuoteAr: newSettings.purityPotencyQuoteAr || "",
        PurityPotencyAuthor: newSettings.purityPotencyAuthor || "",
        PurityPotencyAuthorAr: newSettings.purityPotencyAuthorAr || "",
        PurityPotencyFeature1Title: newSettings.purityPotencyFeature1Title || "",
        PurityPotencyFeature1TitleAr: newSettings.purityPotencyFeature1TitleAr || "",
        PurityPotencyFeature1Desc: newSettings.purityPotencyFeature1Desc || "",
        PurityPotencyFeature1DescAr: newSettings.purityPotencyFeature1DescAr || "",
        PurityPotencyFeature2Title: newSettings.purityPotencyFeature2Title || "",
        PurityPotencyFeature2TitleAr: newSettings.purityPotencyFeature2TitleAr || "",
        PurityPotencyFeature2Desc: newSettings.purityPotencyFeature2Desc || "",
        PurityPotencyFeature2DescAr: newSettings.purityPotencyFeature2DescAr || "",
        PurityPotencyFeature3Title: newSettings.purityPotencyFeature3Title || "",
        PurityPotencyFeature3TitleAr: newSettings.purityPotencyFeature3TitleAr || "",
        PurityPotencyFeature3Desc: newSettings.purityPotencyFeature3Desc || "",
        PurityPotencyFeature3DescAr: newSettings.purityPotencyFeature3DescAr || "",
        StoriesEyebrow: newSettings.storiesEyebrow || "",
        StoriesEyebrowAr: newSettings.storiesEyebrowAr || "",
        StoriesTitle: newSettings.storiesTitle || "",
        StoriesTitleAr: newSettings.storiesTitleAr || "",
        StoriesDescription: newSettings.storiesDescription || "",
        StoriesDescriptionAr: newSettings.storiesDescriptionAr || "",
        HomepageFaqsJson: newSettings.homepageFaqsJson || ""
      };
      await api.settings.updateHomepageConfig(dto);
      setHomePageSettings(newSettings);
      showToast("Homepage layout updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update homepage settings";
      showToast(message, "error");
    }
  }, [setHomePageSettings]);

  const updateStoreSettings = useCallback(async (newSettings: StoreSettings) => {
    try {
      const dto = {
        ...newSettings,
        shippingCost: Number(newSettings.shippingCost),
        taxRate: Number(newSettings.taxRate),
      };
      await api.settings.updateStoreConfig(dto);
      setStoreSettings(newSettings);
      showToast("Global store settings updated", "success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update store settings";
      showToast(message, "error");
    }
  }, [setStoreSettings]);

  return useMemo(
    () => ({ updateHomePageSettings, updateStoreSettings }),
    [updateHomePageSettings, updateStoreSettings]
  );
};
