import React, { useState } from 'react';
import { X, Plus, Minus, Flame, ShoppingBag } from 'lucide-react';
import { MenuItem, CartCustomization } from '../types';

interface ItemCustomizeModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization: CartCustomization) => void;
  lang: 'ar' | 'en';
}

export const ItemCustomizeModal: React.FC<ItemCustomizeModalProps> = ({
  item,
  onClose,
  onAddToCart,
  lang,
}) => {
  if (!item) return null;

  const [quantity, setQuantity] = useState(1);
  const [bread, setBread] = useState<'saj' | 'pita' | 'plate'>(
    item.category === 'platters' ? 'plate' : 'saj'
  );
  const [extraGarlic, setExtraGarlic] = useState(false);
  const [extraPickles, setExtraPickles] = useState(false);
  const [spicyShatta, setSpicyShatta] = useState(item.spicy || false);
  const [noOnions, setNoOnions] = useState(false);
  const [notes, setNotes] = useState('');

  // Add-on cost in DZD
  const addOnCost = (extraGarlic ? 50 : 0) + (extraPickles ? 30 : 0) + (spicyShatta ? 30 : 0);
  const unitPrice = item.price + addOnCost;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    onAddToCart(item, quantity, {
      bread,
      extraGarlic,
      extraPickles,
      spicyShatta,
      noOnions,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header & Image */}
        <div className="relative aspect-[16/9] w-full bg-zinc-950 shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-black/40 pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {item.badge && (
            <span className="absolute top-4 right-4 bg-amber-500 text-zinc-950 text-xs font-black px-3 py-1 rounded-md shadow-lg">
              {item.badge}
            </span>
          )}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <h2 className="text-xl font-black text-white">
                {item.name}
              </h2>
              <span className="text-xl font-black text-amber-400 tabular-nums shrink-0">
                {item.price} <span className="text-xs text-zinc-400 font-normal">د.ج</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Bread Choice */}
          {item.category !== 'drinks' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-200">
                نوع الخبز والتقديم المفضّل:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setBread('saj')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    bread === 'saj'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  خبز صاج مقرمش
                </button>
                <button
                  type="button"
                  onClick={() => setBread('pita')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    bread === 'pita'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  خبز تنور تقليدي
                </button>
                <button
                  type="button"
                  onClick={() => setBread('plate')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                    bread === 'plate'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold'
                      : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  صحن بدون خبز
                </button>
              </div>
            </div>
          )}

          {/* Extra Add-ons */}
          {item.category !== 'drinks' && (
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-zinc-200">
                إضافات وصوصات بست كباب:
              </label>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200 font-medium">
                    <input
                      type="checkbox"
                      checked={extraGarlic}
                      onChange={(e) => setExtraGarlic(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
                    />
                    <span>صوص ثومية بست كباب زيادة</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+50 د.ج</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200 font-medium">
                    <input
                      type="checkbox"
                      checked={extraPickles}
                      onChange={(e) => setExtraPickles(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
                    />
                    <span>مخلل مقرمش إضافي</span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+30 د.ج</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200 font-medium">
                    <input
                      type="checkbox"
                      checked={spicyShatta}
                      onChange={(e) => setSpicyShatta(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
                    />
                    <span className="flex items-center gap-1 text-red-400">
                      <Flame className="w-3.5 h-3.5" />
                      شطة حارة (هريسة / بيكون)
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400">+30 د.ج</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 cursor-pointer hover:border-zinc-700">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-200 font-medium">
                    <input
                      type="checkbox"
                      checked={noOnions}
                      onChange={(e) => setNoOnions(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-700"
                    />
                    <span>بدون بصل</span>
                  </div>
                  <span className="text-xs text-zinc-500 font-medium">مجاناً</span>
                </label>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-zinc-200 mb-1.5">
              ملاحظات خاصة للشيف (اختياري):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: محمص زيادة، الصوص خارجي..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-1 shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-9 text-center font-bold text-sm text-white tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>إضافة للسلة</span>
            </div>
            <span className="tabular-nums font-black text-base">
              {totalPrice} د.ج
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
