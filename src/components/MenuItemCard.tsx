import React, { useState } from 'react';
import { Plus, Flame } from 'lucide-react';
import { MenuItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
  lang: 'ar' | 'en';
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onSelect, lang }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={() => onSelect(item)}
      className="group flex flex-col bg-zinc-900 border border-zinc-800/90 rounded-2xl overflow-hidden hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shadow-lg"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[4/3] w-full bg-zinc-950 overflow-hidden">
        {!imageError ? (
          <img
            src={item.image}
            alt={item.name}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-zinc-950 text-zinc-600">
            <Flame className="w-8 h-8 text-amber-500/40 mb-2" />
            <span className="text-xs font-semibold text-zinc-400">{item.name}</span>
          </div>
        )}

        {/* Badge */}
        {item.badge && (
          <span className="absolute top-3 right-3 bg-amber-500 text-zinc-950 text-[11px] font-black px-2.5 py-0.5 rounded-md shadow-md">
            {item.badge}
          </span>
        )}

        {/* Spicy marker */}
        {item.spicy && (
          <span className="absolute top-3 left-3 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
            <Flame className="w-3 h-3" />
            <span>حار</span>
          </span>
        )}

        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-zinc-800 text-zinc-300 font-bold text-xs px-3 py-1.5 rounded-lg border border-zinc-700">
              غير متوفر حالياً
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Category & Calories */}
          <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1.5">
            <span className="text-amber-500/90 font-medium">
              {item.category === 'shawarma' && 'شاورما'}
              {item.category === 'kebab' && 'مشاوي كباب'}
              {item.category === 'platters' && 'صحون وسرفيس'}
              {item.category === 'appetizers' && 'مقبلات'}
              {item.category === 'family' && 'وجبة عائلية'}
              {item.category === 'drinks' && 'مشروبات'}
            </span>
            {item.calories && (
              <>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{item.calories} سعرة</span>
              </>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug mb-2">
            {item.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
            {item.description}
          </p>
        </div>

        {/* Price & Action Row in Algerian Dinars */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-white tabular-nums tracking-tight">
              {item.price}
            </span>
            <span className="text-xs text-amber-500 font-bold">
              د.ج
            </span>
          </div>

          <button
            type="button"
            disabled={!item.isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(item);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 font-bold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>أضف</span>
          </button>
        </div>
      </div>
    </div>
  );
};
