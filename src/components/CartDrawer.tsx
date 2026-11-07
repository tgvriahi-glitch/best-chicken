import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Banknote,
  Send,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Order, SiteSettings } from '../types';
import { saveOrder } from '../utils/storage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderPlaced: (order: Order) => void;
  siteSettings: SiteSettings;
  lang: 'ar' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  setCartItems,
  onOrderPlaced,
  siteSettings,
  lang,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee =
    subtotal === 0 || subtotal >= siteSettings.freeDeliveryThreshold ? 0 : siteSettings.deliveryFee;
  const total = subtotal + deliveryFee;

  const handleUpdateQuantity = (lineId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === lineId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (lineId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== lineId));
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      alert(lang === 'ar' ? 'يرجى إكمال بيانات الاسم والهاتف وعنوان التوصيل' : 'Please complete delivery details');
      return;
    }

    const orderId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes.trim() || undefined,
      items: cartItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod: 'cash_on_delivery',
      createdAt: Date.now(),
    };

    saveOrder(newOrder);
    onOrderPlaced(newOrder);
    setPlacedOrderId(orderId);
    setStep('confirmed');
    setCartItems([]);
  };

  const handleResetAndClose = () => {
    setStep('cart');
    setPlacedOrderId(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="w-full max-w-md bg-zinc-950 border-s border-zinc-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                {step === 'cart' && (lang === 'ar' ? 'سلة الطلبات' : 'Shopping Bag')}
                {step === 'checkout' && (lang === 'ar' ? 'تأكيد العنوان والدفع عند الاستلام' : 'Cash on Delivery Checkout')}
                {step === 'confirmed' && (lang === 'ar' ? 'تم تأكيد طلبك بنجاح!' : 'Order Confirmed!')}
              </h2>
              <span className="text-[11px] text-zinc-400">
                {cartItems.length} {lang === 'ar' ? 'وجبات في السلة' : 'items'}
              </span>
            </div>
          </div>

          <button
            onClick={step === 'confirmed' ? handleResetAndClose : onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: CART LIST */}
        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                  <ShoppingBag className="w-12 h-12 mx-auto text-zinc-700 mb-3" />
                  <h3 className="text-sm font-bold text-zinc-300 mb-1">
                    {lang === 'ar' ? 'سلتك فارغة حالياً' : 'Your bag is empty'}
                  </h3>
                  <p className="text-xs text-zinc-500 mb-4">
                    {lang === 'ar'
                      ? 'اختر أشهى شاورما أو كباب من قائمتنا المميزة وأضفها للطلب'
                      : 'Choose delicious items from our menu'}
                  </p>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                  >
                    {lang === 'ar' ? 'تصفح قائمة الطعام' : 'Explore Menu'}
                  </button>
                </div>
              ) : (
                cartItems.map((cartItem) => (
                  <div
                    key={cartItem.id}
                    className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex gap-3 items-center justify-between"
                  >
                    <img
                      src={cartItem.item.image}
                      alt={cartItem.item.name}
                      className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-950"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {cartItem.item.name}
                      </h4>

                      <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                        {cartItem.customization.bread === 'saj' && 'خبز صاج'}
                        {cartItem.customization.bread === 'pita' && 'خبز تنور'}
                        {cartItem.customization.bread === 'plate' && 'صحن'}
                        {cartItem.customization.extraGarlic && ' · ثومية +'}
                        {cartItem.customization.extraPickles && ' · مخلل +'}
                        {cartItem.customization.spicyShatta && ' · شطة حارة +'}
                      </div>

                      <div className="text-xs font-black text-amber-400 tabular-nums mt-1">
                        {cartItem.unitPrice * cartItem.quantity} د.ج
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1 shrink-0">
                      <button
                        onClick={() => handleUpdateQuantity(cartItem.id, -1)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-white tabular-nums">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(cartItem.id, 1)}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(cartItem.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800 space-y-3">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                    <span className="tabular-nums font-bold text-white">{subtotal} د.ج</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{lang === 'ar' ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                    <span className="tabular-nums font-bold text-white">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-400">مجاني (طلب أكثر من {siteSettings.freeDeliveryThreshold} د.ج)</span>
                      ) : (
                        `${deliveryFee} د.ج`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                    <span>{lang === 'ar' ? 'الإجمالي للدفع نقداً' : 'Total (Cash on delivery)'}</span>
                    <span className="text-amber-400 tabular-nums text-base">{total} د.ج</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <Banknote className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>طريقة الدفع: الدفع نقداً عند الاستلام فقط (كاش عند الباب)</span>
                </div>

                <button
                  onClick={() => setStep('checkout')}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === 'ar' ? 'متابعة وتأكيد طلب التوصيل' : 'Proceed to Delivery'}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* STEP 2: CHECKOUT FORM (CASH ON DELIVERY ONLY) */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceOrder} className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-2"
              >
                ← {lang === 'ar' ? 'الرجوع للوجبات' : 'Back to Cart'}
              </button>

              {/* Cash On Delivery Assurance Banner */}
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold">الدفع عند الاستلام فقط (كاش)</div>
                  <div className="text-[11px] text-emerald-400/90">
                    تدفع ثمن وجبتك نقداً لعامل التوصيل عند استلام طعامك ساخناً
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: يوسف بلقاسم"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  رقم الهاتف للتواصل وتأكيد الطلب *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05 / 06 / 07 XX XX XX XX"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2.5 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  عنوان التوصيل (الولاية، البلدية، الحي والشارع) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: الجزائر العاصمة - حي باب الواد - عمارة 8 شقة 3"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  ملاحظات للشيف والتوصيل (اختياري)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثال: صلصة حارة إضافية، الاتصال عند الوصول..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Fixed Payment method indicator */}
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">طريقة الدفع المعتمدة:</span>
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Banknote className="w-4 h-4 text-amber-400" />
                  <span>نقداً عند الاستلام فقط (Cash on Delivery)</span>
                </div>
              </div>
            </div>

            {/* Bottom Submit */}
            <div className="p-4 sm:p-5 bg-zinc-900 border-t border-zinc-800">
              <div className="flex justify-between items-center text-xs mb-3">
                <span className="text-zinc-400">المبلغ الإجمالي للدفع كاش:</span>
                <span className="text-lg font-black text-amber-400 tabular-nums">{total} د.ج</span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال الطلب والتوصيل إلى باب منزلي</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: ORDER CONFIRMED */}
        {step === 'confirmed' && (
          <div className="p-6 overflow-y-auto text-center space-y-5 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-mono text-amber-400 font-bold">#{placedOrderId}</span>
              <h3 className="text-xl font-black text-white mt-1">
                وصلنا طلبك بنجاح وجاري تحضيره!
              </h3>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-xs mx-auto">
                شكراً لك يا {customerName}، سيتصل بك فريق Best Kebab لتأكيد الطلب وتوصيله ساخناً لباب منزلك.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-xs text-zinc-300 space-y-2 text-right">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">طريقة الدفع:</span>
                <span className="font-bold text-emerald-400">نقداً عند الاستلام فقط</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-500">العنوان:</span>
                <span className="font-bold truncate max-w-[200px]">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">المبلغ المطلوب:</span>
                <span className="font-bold text-amber-400 tabular-nums">{total} د.ج</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors"
            >
              العودة لقائمة الوجبات
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
