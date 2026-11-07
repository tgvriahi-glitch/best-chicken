import React from 'react';
import { Flame, MapPin, Phone, Clock, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  onOpenSecretAdmin: () => void;
  siteSettings: SiteSettings;
  lang: 'ar' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ onOpenSecretAdmin, siteSettings, lang }) => {
  return (
    <footer id="contact" className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs">
      <div id="branches" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-md shadow-amber-500/20">
                <Flame className="w-4 h-4 fill-zinc-950" />
              </div>
              <span className="text-base font-black text-white">{siteSettings.restaurantName}</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              مطعم الشاورما والكباب المشوي الأشهر. طعم أصلي، مكونات طازجة يومياً، والدفع نقداً عند الاستلام فقط لراحتك وأمانك.
            </p>
            <div className="flex items-center gap-2 pt-1 text-zinc-400">
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                💵 الدفع كاش عند الاستلام فقط
              </span>
            </div>
          </div>

          {/* Branches from Settings */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              فروعنا في الجزائر
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>{siteSettings.mainAddress}</span>
              </li>
              {siteSettings.secondAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>{siteSettings.secondAddress}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Working Hours & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              أوقات العمل والاتصال
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-zinc-300">{siteSettings.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-zinc-300">الهاتف: {siteSettings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-zinc-300">واتساب: {siteSettings.whatsapp}</span>
              </div>
            </div>
          </div>

          {/* Quality & Service Reassurance */}
          <div className="space-y-3 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/60">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>ضمان بست كباب</span>
            </h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              جميع لحومنا ودواجننا طازجة ومذبوحة محلياً يومياً. إذا لم تكن راضياً عن سخونة وجودة طلبيتك، فنحن هنا لخدمتك دائماً.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-300">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              <span>خدمة زبائن سريعة ومتواصلة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar with Discreet Hidden "..." Secret Entrance */}
      <div className="border-t border-zinc-900/80 bg-zinc-950 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} {siteSettings.restaurantName}. جميع الحقوق محفوظة · الدفع عند الاستلام فقط
          </div>

          <div className="flex items-center gap-4">
            <a href="#menu" className="hover:text-zinc-300 transition-colors">قائمة الشاورما</a>
            <span>·</span>
            <a href="#craftsmanship" className="hover:text-zinc-300 transition-colors">سر الخلطة</a>
            <span>·</span>
            {/* The discreet hidden "..." trigger as requested by the user */}
            <button
              onClick={onOpenSecretAdmin}
              className="text-zinc-600 hover:text-zinc-400 font-mono tracking-widest transition-colors cursor-pointer px-1"
              aria-label="..."
            >
              ...
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
