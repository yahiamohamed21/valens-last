"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, CartItem } from "@/context/AppContext";
import { Icon } from "./SvgIcons";

export const Navbar: React.FC = () => {
  const { cart, wishlist, homePageSettings, currentUserEmail, currentUserRole, locale, t } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const totalItems = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-color bg-main-bg">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="group flex items-center gap-2">
            <img src={homePageSettings?.logoDark || "/logo-dark.png"} alt="Valens" className="h-14 w-48 object-contain block dark:hidden" />
            <img src={homePageSettings?.logoLight || "/logo-light.png"} alt="Valens" className="h-14 w-48 object-contain hidden dark:block" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral transition-luxury"
            >
              {t("storefront.navbar.products")}
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral transition-luxury"
            >
              {locale === "ar" ? "عن Valens" : "About"}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral transition-luxury"
            >
              {t("storefront.navbar.contact")}
            </Link>
          </nav>
        </div>

        {/* Search, Cart & Account */}
        <div className="hidden md:flex items-center gap-6">
 

          {/* Account */}
          <Link
            href={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "/admin"
                  : "/dashboard"
                : "/login"
            }
            className={`flex items-center justify-center hover:text-primary-coral transition-luxury ${currentUserEmail ? "text-primary-coral" : "text-foreground"
              }`}
            title={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "Admin Dashboard"
                  : "Athlete Dashboard"
                : "Account"
            }
          >
            <Icon name="user" size={20} />
          </Link>

          {/* Wishlist */}
          <Link
            href="/wishlist"
            className="relative flex items-center justify-center text-foreground hover:text-primary-coral transition-luxury"
            title="Wishlist"
          >
            <Icon name="heart" size={20} />
            {wishlist && wishlist.length > 0 && (
              <span className={`absolute -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-orange text-3xs font-extrabold text-white shadow-[0_0_8px_#FF5226] ${locale === "ar" ? "-left-2.5" : "-right-2.5"
                }`}>
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center justify-center text-foreground hover:text-primary-coral transition-luxury"
            title="Shopping Cart"
          >
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className={`absolute -top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent-orange text-3xs font-extrabold text-white shadow-[0_0_8px_#FF5226] ${locale === "ar" ? "-left-2.5" : "-right-2.5"
                }`}>
                {totalItems}
              </span>
            )}
          </Link>

        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            href={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "/admin"
                  : "/dashboard"
                : "/login"
            }
            className={`flex items-center justify-center hover:text-primary-coral transition-luxury ${currentUserEmail ? "text-primary-coral" : "text-foreground"
              }`}
            title={
              currentUserEmail
                ? currentUserRole === "Admin"
                  ? "Admin Dashboard"
                  : "Athlete Dashboard"
                : "Account"
            }
          >
            <Icon name="user" size={20} />
          </Link>
          <Link href="/wishlist" className="relative flex items-center justify-center text-foreground mr-4">
            <Icon name="heart" size={20} />
            {wishlist && wishlist.length > 0 && (
              <span className={`absolute -top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-orange text-4xs font-extrabold text-white ${locale === "ar" ? "-left-2" : "-right-2"
                }`}>
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative flex items-center justify-center text-foreground">
            <Icon name="cart" size={20} />
            {totalItems > 0 && (
              <span className={`absolute -top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-orange text-4xs font-extrabold text-white ${locale === "ar" ? "-left-2" : "-right-2"
                }`}>
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center text-foreground"
          >
            <Icon name={mobileMenuOpen ? "close" : "menu"} size={22} />
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-border-color bg-main-bg px-4 py-4 md:hidden">
           <nav className="flex flex-col gap-4 px-2">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral"
            >
              {t("storefront.navbar.products")}
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral"
            >
              {locale === "ar" ? "عن Valens" : "About"}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold tracking-wide text-foreground hover:text-primary-coral"
            >
              {t("storefront.navbar.contact")}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
