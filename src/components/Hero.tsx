import React from 'react';
import { ArrowDown, Flame, ShieldCheck, Clock, Award, Banknote } from 'lucide-react';
import { SiteSettings } from '../types';

interface HeroProps {
  onExploreMenu: () => void;
  siteSettings: SiteSettings;
  lang: 'ar' | 'en';
}

export const Hero: React.FC<HeroProps> = ({ onExploreMenu, siteSettings, lang }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-zinc-950">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Clean kicker text */}
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-4 tracking-wider">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>المطعم الأشهر للشاورما والكباب المشوي</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400">الدفع عند الاستلام فقط</span>
            </div>

            {/* Display Headline from Site Settings */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-5" style={{ textWrap: 'balance' }}>
              {siteSettings.heroHeadline || 'أشهى شاورما وكباب على أصولها.. نكهة لا تُنسى'}
            </h1>

            {/* Subtitle from Site Settings */}
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mb-8">
              {siteSettings.heroSubtitle ||
                'نقدم لكم ساندوتشات شاورما الدجاج واللحم البلدي بخبز الصاج المحمص، مع أسياخ الكباب المتبل المشوي على الفحم الطبيعي وصوص الثومية الخاص بنا.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/25 flex items-center gap-2 cursor-pointer group"
              >
                <span>تصفح القائمة واطلب أونلاين</span>
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <a
                href="#craftsmanship"
                className="px-6 py-3.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-sm border border-zinc-800 transition-colors"
              >
                قصة نكهة بست كباب
              </a>
            </div>

            {/* Trust Markers Bar */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-zinc-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">الدفع عند الاستلام</div>
                  <div className="text-[11px] text-zinc-400">كاش عند باب المنزل</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">توصيل سريع ساخن</div>
                  <div className="text-[11px] text-zinc-400">خلال 30 دقيقة لبابك</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">لحوم طازجة 100%</div>
                  <div className="text-[11px] text-zinc-400">مذبوحة ومتبلة يومياً</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset (from siteSettings) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-900 group">
              <img
                src={siteSettings.heroImage || '/src/assets/images/hero_shawarma_kebab_1794092913794.jpg'}
                alt={siteSettings.restaurantName}
                className="w-full aspect-[4/3] lg:aspect-auto lg:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Floating Highlight Card */}
              <div className="absolute bottom-4 right-4 left-4 p-4 rounded-2xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800/80 shadow-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-0.5">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>الأكثر طلباً اليوم</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    سرفيس شاورما دجاج + كباب مشوي
                  </div>
                </div>
                <button
                  onClick={onExploreMenu}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  اطلب الآن
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
