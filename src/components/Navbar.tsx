import React from 'react';
import { ShoppingBag, Flame, MoreHorizontal, Bell } from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSecretAdmin: () => void;
  siteSettings: SiteSettings;
  lang: 'ar' | 'en';
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSecretAdmin,
  siteSettings,
  lang,
}) => {
  return (
    <>
      {/* Top Announcement Bar */}
      {siteSettings.showAnnouncement && siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 px-4 py-2 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow-inner">
          <Bell className="w-3.5 h-3.5 shrink-0" />
          <span>{siteSettings.announcementText}</span>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <a href="#" className="flex items-center gap-2 group whitespace-nowrap shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-zinc-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5 fill-zinc-950 stroke-zinc-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
                {siteSettings.restaurantName || 'Best Kebab'}
              </span>
              <span className="text-[10px] -mt-1 font-bold text-amber-500 tracking-wider">
                {siteSettings.restaurantSubtitle || 'بست كباب الأصلي'}
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-zinc-400">
            <a
              href="#menu"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-500 underline-offset-8"
            >
              قائمة الطعام
            </a>
            <a
              href="#craftsmanship"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-500 underline-offset-8"
            >
              سر النكهة
            </a>
            <a
              href="#branches"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-500 underline-offset-8"
            >
              الفروع والتوصيل
            </a>
            <a
              href="#contact"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-500 underline-offset-8"
            >
              تواصل معنا
            </a>
          </nav>

          {/* Zone 3: Primary Action & Controls (Cart and discreet ...) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Discrete Secret ... Trigger (No secrets displayed) */}
            <button
              onClick={onOpenSecretAdmin}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-colors"
              title="..."
              aria-label="More"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {/* Cart Primary CTA */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>سلة الطلبات</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-zinc-950 text-amber-400 text-[11px] font-black flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
