import React, { useState } from 'react';
import { Search, UtensilsCrossed, Sparkles } from 'lucide-react';
import { MenuItem, Category } from '../types';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  lang: 'ar' | 'en';
}

export const MenuSection: React.FC<MenuSectionProps> = ({
  menuItems,
  onSelectItem,
  lang,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories: { id: Category; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All Items' },
    { id: 'shawarma', labelAr: 'شاورما بست كباب', labelEn: 'Shawarma' },
    { id: 'kebab', labelAr: 'كباب ومشويات', labelEn: 'Kebabs' },
    { id: 'platters', labelAr: 'سرفيس وصحون', labelEn: 'Platters' },
    { id: 'appetizers', labelAr: 'مقبلات وسلطات', labelEn: 'Appetizers' },
    { id: 'family', labelAr: 'وجبات عائلية', labelEn: 'Family Feasts' },
    { id: 'drinks', labelAr: 'عصائر ومشروبات', labelEn: 'Beverages' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-16 sm:py-20 bg-zinc-950 border-t border-zinc-900 scroll-mt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            <span>{lang === 'ar' ? 'طازج ومحضر على الطلب' : 'Fresh & Made to Order'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-3">
            {lang === 'ar' ? 'قائمة طعام بست كباب الشهيرة' : 'Best Kebab Legendary Menu'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            {lang === 'ar'
              ? 'تذوق أطيب سندوتشات الشاورما المصنوعة من أفخر اللحوم والدواجن الطازجة يومياً، مع تشكيلة الكباب المشوي على الفحم والمقبلات الشامية'
              : 'Taste the finest freshly sliced shawarma wraps, charcoal-grilled skewers, and rich Middle Eastern side dishes.'}
          </p>
        </div>

        {/* Search & Category Tabs Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Interactive Category Segmented Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-zinc-900 border border-zinc-800/80 rounded-2xl scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
                }`}
              >
                {lang === 'ar' ? cat.labelAr : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative md:w-72 shrink-0">
            <Search className="w-4 h-4 text-zinc-500 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في الوجبات أو المكونات...' : 'Search menu...'}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* 3-Column Product Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onSelect={onSelectItem}
                lang={lang}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-8 max-w-md mx-auto">
            <UtensilsCrossed className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white mb-1">
              {lang === 'ar' ? 'لا توجد وجبة مطابقة للبحث' : 'No items match your criteria'}
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              {lang === 'ar'
                ? 'جرب البحث بكلمة أخرى أو تصفح كافة أقسام القائمة'
                : 'Try another keyword or view all categories'}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
            >
              {lang === 'ar' ? 'عرض كل الأصناف' : 'Show All Items'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
