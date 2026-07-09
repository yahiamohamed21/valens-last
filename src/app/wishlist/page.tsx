"use client";

import React, { useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { Icon } from "@/components/SvgIcons";

export default function WishlistPage() {
  const { wishlist, products, locale } = useApp();

  const wishlistProducts = useMemo(() => {
    if (!wishlist || wishlist.length === 0) return [];
    return products.filter((product) => wishlist.includes(product.id));
  }, [wishlist, products]);

  return (
    <div className="flex min-h-screen flex-col bg-main-bg text-foreground">
      <Navbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black uppercase tracking-widest text-white sm:text-4xl">
            {locale === "ar" ? "منتجات أعجبتني" : "My Wishlist"}
          </h1>
          <p className="mt-4 text-sm text-muted-text max-w-2xl mx-auto">
            {locale === "ar"
              ? "مجموعتك المفضلة من التركيبات الاحترافية الجاهزة للطلب في أي وقت."
              : "Your curated selection of premium formulations, ready whenever you are."}
          </p>
        </div>

        {wishlistProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {wishlistProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-border-color rounded-2xl bg-card-bg/40 border-dashed">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-deep text-muted-text mb-6">
              <Icon name="heart" size={28} />
            </div>
            <h3 className="text-xl font-bold uppercase text-white mb-2">
              {locale === "ar" ? "قائمة المفضلة فارغة" : "Your Wishlist is Empty"}
            </h3>
            <p className="text-sm text-muted-text mb-8 max-w-md">
              {locale === "ar"
                ? "لم تقم بإضافة أي منتجات إلى مفضلتك حتى الآن. تصفح متجرنا لاكتشاف التركيبات التي تناسب أهدافك."
                : "You haven't added any products to your wishlist yet. Browse our store to discover formulations that fit your goals."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-primary-coral px-8 py-3 text-sm font-black tracking-widest text-[#ffffff] transition-all duration-300 hover:bg-white hover:text-[#000000] shadow-lg shadow-primary-coral/10 hover:scale-[1.02]"
            >
              {locale === "ar" ? "تصفح المتجر" : "BROWSE STORE"}
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
