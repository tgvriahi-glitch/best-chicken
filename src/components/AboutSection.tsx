import React from 'react';
import { Flame, Check } from 'lucide-react';
import { SiteSettings } from '../types';

interface AboutSectionProps {
  siteSettings: SiteSettings;
  lang: 'ar' | 'en';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ siteSettings, lang }) => {
  return (
    <section id="craftsmanship" className="py-20 bg-zinc-900/60 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 aspect-[4/5] relative group">
              <img
                src="/src/assets/images/product_shawarma_beef_1794092913776.jpg"
                alt="Beef Shawarma Wrap"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">
                  شاورما اللحم البلدي بالتتبيلة السرية
                </span>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-xl bg-zinc-950 aspect-[4/5] relative group mt-6">
              <img
                src="/src/assets/images/product_kebab_platter_1794092914594.jpg"
                alt="Charcoal Grilled Kebab Platter"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white">
                  كباب مشوي على الفحم الطبيعي
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>سر تميز {siteSettings.restaurantName}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-5" style={{ textWrap: 'balance' }}>
              {siteSettings.aboutTitle || 'لماذا يعتبر Best Kebab المطعم المفضل لعشاق الشاورما والمشاوي؟'}
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              {siteSettings.aboutText ||
                'في بست كباب نضمن لكم الجودة والنظافة العالية باختيار أجود اللحوم والدواجن الطازجة المذبوحة محلياً يومياً، ونقعها لمدة 24 ساعة بخلطة من 14 نوعاً من التوابل والبهارات الأصيلة وشويها على الجمر لتقديم أطيب طعم يرضي ذوقكم.'}
            </p>

            {/* Feature List */}
            <div className="space-y-3.5 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    تتبيلة سرية وخبرة عريقة
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    خلطة فريدة من التوابل الطبيعية مع زيت الزيتون البكر
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    خبز الصاج والتنور الساخن مباشرة
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    يخبز العجين طازجاً ليكون مقرمشاً من الخارج وطرياً من الداخل
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    الدفع عند الاستلام فقط لراحتكم
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    استلم طلبيتك وتأكد من سخونتها وجودتها ثم ادفع نقداً لعامل التوصيل
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-zinc-400">ساعات العمل في جميع الفروع</span>
                <div className="text-xs font-bold text-white">{siteSettings.workingHours}</div>
              </div>
              <a
                href="#menu"
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400 transition-colors"
              >
                تذوق الآن
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
