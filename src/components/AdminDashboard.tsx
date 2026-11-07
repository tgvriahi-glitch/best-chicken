import React, { useState, useRef } from 'react';
import {
  PlusCircle,
  Package,
  ShoppingBag,
  TrendingUp,
  Trash2,
  CheckCircle,
  XCircle,
  Upload,
  Image as ImageIcon,
  Sparkles,
  LogOut,
  RefreshCw,
  Eye,
  Check,
  Flame,
  Search,
  Settings,
  Edit,
  Save,
  AlertTriangle,
  X
} from 'lucide-react';
import { MenuItem, Category, Order, SiteSettings } from '../types';
import { PRESET_IMAGES } from '../data/defaultMenu';
import {
  saveMenuItems,
  resetMenuToDefaults,
  updateOrderStatus,
  saveSiteSettings,
  resetSiteSettingsToDefaults
} from '../utils/storage';

interface AdminDashboardProps {
  menuItems: MenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  siteSettings: SiteSettings;
  setSiteSettings: React.Dispatch<React.SetStateAction<SiteSettings>>;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  menuItems,
  setMenuItems,
  orders,
  setOrders,
  siteSettings,
  setSiteSettings,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'add' | 'items' | 'settings' | 'orders' | 'stats'>('items');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // In-App Delete Confirmation Modal state (prevents iframe window.confirm blocking)
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // Edit Dish Modal State
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New Item Form State
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [category, setCategory] = useState<'shawarma' | 'kebab' | 'platters' | 'appetizers' | 'family' | 'drinks'>('shawarma');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [spicy, setSpicy] = useState(false);
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [imagePreview, setImagePreview] = useState<string>(PRESET_IMAGES[0].url);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Image file upload handler for new item
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(lang === 'ar' ? 'حجم الصورة كبير جداً (الحد الأقصى 5 ميجابايت)' : 'Image too large (max 5MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setImageUrl(result);
          setImagePreview(result);
          showToast(lang === 'ar' ? 'تم رفع الصورة بنجاح!' : 'Image uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image file upload handler for editing item
  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingItem) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditingItem({ ...editingItem, image: result });
          showToast(lang === 'ar' ? 'تم تحديث صورة الوجبة!' : 'Dish image updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Image file upload handler for hero banner
  const handleHeroFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setSettingsForm({ ...settingsForm, heroImage: result });
          showToast(lang === 'ar' ? 'تم تحميل صورة البانر الرئيسية!' : 'Hero image uploaded!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add Item Submit
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast(lang === 'ar' ? 'يرجى كتابة اسم الوجبة' : 'Please enter dish name');
      return;
    }
    if (!price || Number(price) <= 0) {
      showToast(lang === 'ar' ? 'يرجى إدخال سعر صحيح بالدينار الجزائري' : 'Please enter a valid price in DZD');
      return;
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      nameEn: nameEn.trim() || name.trim(),
      category,
      price: Number(price),
      description: description.trim() || (lang === 'ar' ? 'وجبة طازجة وشهية محضرة بأجود المكونات المحلية' : 'Fresh gourmet meal prepared with finest ingredients'),
      descriptionEn: description.trim() || 'Fresh gourmet meal',
      image: imageUrl || PRESET_IMAGES[0].url,
      badge: badge.trim() || undefined,
      calories: calories ? Number(calories) : undefined,
      spicy,
      isAvailable: true,
      createdAt: Date.now(),
    };

    const updated = [newItem, ...menuItems];
    setMenuItems(updated);
    saveMenuItems(updated);

    showToast(lang === 'ar' ? `تمت إضافة وجبة "${newItem.name}" بنجاح!` : `Added "${newItem.name}"!`);

    // Reset Form
    setName('');
    setNameEn('');
    setPrice('');
    setDescription('');
    setBadge('');
    setCalories('');
    setSpicy(false);
    setImageUrl(PRESET_IMAGES[0].url);
    setImagePreview(PRESET_IMAGES[0].url);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setTimeout(() => {
      setActiveTab('items');
    }, 700);
  };

  // Save Edited Item
  const handleSaveEditedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = menuItems.map((item) =>
      item.id === editingItem.id ? editingItem : item
    );
    setMenuItems(updated);
    saveMenuItems(updated);
    showToast(lang === 'ar' ? `تم حفظ تعديلات وجبة "${editingItem.name}" بنجاح!` : 'Dish updated successfully!');
    setEditingItem(null);
  };

  // In-App Reliable Deletion (No window.confirm!)
  const confirmDeleteItem = () => {
    if (!itemToDelete) return;
    const deletedName = itemToDelete.name;
    const updated = menuItems.filter((item) => item.id !== itemToDelete.id);
    setMenuItems(updated);
    saveMenuItems(updated);
    setItemToDelete(null);
    showToast(lang === 'ar' ? `تم حذف وجبة "${deletedName}" بنجاح!` : `Deleted "${deletedName}"!`);
  };

  // Toggle item availability
  const handleToggleAvailability = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updated);
    saveMenuItems(updated);
    showToast(lang === 'ar' ? 'تم تحديث حالة التوفر' : 'Status updated');
  };

  // Reset menu
  const handleResetMenu = () => {
    const defaults = resetMenuToDefaults();
    setMenuItems(defaults);
    showToast(lang === 'ar' ? 'تمت استعادة القائمة الأصلية بالدينار الجزائري' : 'Menu reset to defaults');
  };

  // Save Site Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSiteSettings(settingsForm);
    saveSiteSettings(settingsForm);
    showToast(lang === 'ar' ? 'تم حفظ وتحديث جميع إعدادات ونصوص الموقع بنجاح!' : 'Site settings updated successfully!');
  };

  // Reset Site Settings
  const handleResetSettings = () => {
    const defaults = resetSiteSettingsToDefaults();
    setSettingsForm(defaults);
    setSiteSettings(defaults);
    showToast(lang === 'ar' ? 'تمت استعادة إعدادات الموقع الافتراضية' : 'Settings reset to defaults');
  };

  // Update order status
  const handleStatusChange = (orderId: string, status: Order['status']) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);
    showToast(lang === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
  };

  // Filtered Items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalItemsCount = menuItems.length;
  const availableItemsCount = menuItems.filter((i) => i.isAvailable).length;
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-zinc-950 font-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm animate-fade-in border border-amber-300">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* IN-APP RELIABLE DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">
                {lang === 'ar' ? 'تأكيد حذف الوجبة نهائياً' : 'Confirm Delete Dish'}
              </h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                {lang === 'ar' ? (
                  <>
                    هل تريد بالتأكيد حذف وجبة <strong className="text-white">"{itemToDelete.name}"</strong> من قائمة الطعام؟ لن تظهر للزبائن بعد الحذف.
                  </>
                ) : (
                  `Are you sure you want to permanently delete "${itemToDelete.name}"?`
                )}
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={confirmDeleteItem}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'نعم، احذف الوجبة الآن' : 'Yes, Delete Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs transition-colors"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-500" />
                <span>{lang === 'ar' ? 'تعديل بيانات الوجبة والسعر' : 'Edit Dish Details'}</span>
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditedItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم الوجبة</label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">الفئة</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="shawarma">🌯 شاورما</option>
                    <option value="kebab">🍢 كباب ومشويات</option>
                    <option value="platters">🍽️ سرفيس وصحون</option>
                    <option value="appetizers">🥗 مقبلات وسلطات</option>
                    <option value="family">👨‍👩‍👧‍👦 وجبات عائلية</option>
                    <option value="drinks">🥤 مشروبات وعصائر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">السعر (د.ج / DZD)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">الوصف والمكونات</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Edit Image */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <label className="block text-xs font-bold text-amber-400">صورة الوجبة الحالية</label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingItem.image}
                    alt={editingItem.name}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-900"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={editFileInputRef}
                      accept="image/*"
                      onChange={handleEditFileUpload}
                      className="hidden"
                      id="edit-dish-file"
                    />
                    <label
                      htmlFor="edit-dish-file"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer border border-zinc-700"
                    >
                      <Upload className="w-3.5 h-3.5 text-amber-400" />
                      <span>تغيير الصورة من الجهاز</span>
                    </label>
                    <input
                      type="text"
                      value={editingItem.image.startsWith('data:') ? '' : editingItem.image}
                      onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                      placeholder="أو ضع رابط صورة جديد..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">الشارة (اختياري)</label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="الأكثر طلباً، جديد..."
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-200">
                    <input
                      type="checkbox"
                      checked={editingItem.spicy || false}
                      onChange={(e) => setEditingItem({ ...editingItem, spicy: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span className="text-red-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5" />
                      وجبة حارة
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black text-lg shadow-md shadow-amber-500/20">
              BK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-wide">
                  {lang === 'ar' ? 'لوحة إدارة Best Kebab الشاملة' : 'Best Kebab Admin Portal'}
                </h1>
                <span className="text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  {lang === 'ar' ? 'العملة: دينار جزائري (د.ج)' : 'DZD Currency'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                {lang === 'ar'
                  ? 'حذف وإضافة وتعديل الوجبات، وتعديل نصوص الموقع وصورته الرئيسية'
                  : 'Full control over dishes, images, prices and site content'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'معاينة الموقع' : 'View Storefront'}</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-xs font-semibold text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tabs Navigation */}
      <div className="border-b border-zinc-800/80 bg-zinc-900/50 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex gap-2 overflow-x-auto py-2.5">
          <button
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'items'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>{lang === 'ar' ? `قائمة الوجبات وحذفها (${totalItemsCount})` : `Products (${totalItemsCount})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'add'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة وجبة وصورة جديدة' : 'Add Dish & Photo'}</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>{lang === 'ar' ? 'تعديل شامل لمحتوى وإعدادات الموقع' : 'Site Settings'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{lang === 'ar' ? `الطلبات الواردة (${orders.length})` : `Orders (${orders.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>{lang === 'ar' ? 'الإحصائيات' : 'Stats'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        {/* TAB 1: MANAGE AND DELETE DISHES (قائمة الوجبات مع زر الحذف المضمون) */}
        {activeTab === 'items' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-zinc-500 absolute right-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ar' ? 'بحث عن وجبة أو مكون...' : 'Search dishes...'}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pr-9 pl-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">جميع الفئات</option>
                  <option value="shawarma">شاورما</option>
                  <option value="kebab">كباب ومشويات</option>
                  <option value="platters">صحون وسرفيس</option>
                  <option value="appetizers">مقبلات</option>
                  <option value="family">عائلي</option>
                  <option value="drinks">مشروبات</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('add')}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'إضافة وجبة جديدة' : 'Add Dish'}</span>
                </button>
                <button
                  onClick={handleResetMenu}
                  className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs flex items-center gap-1.5 transition-colors"
                  title="استعادة القائمة الأصلية بالدينار الجزائري"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">استعادة الافتراضي</span>
                </button>
              </div>
            </div>

            {/* Dishes Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 font-semibold">
                    <tr>
                      <th className="p-4">{lang === 'ar' ? 'الصورة والوجبة' : 'Dish'}</th>
                      <th className="p-4">{lang === 'ar' ? 'الفئة' : 'Category'}</th>
                      <th className="p-4">{lang === 'ar' ? 'السعر (د.ج)' : 'Price (DZD)'}</th>
                      <th className="p-4">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="p-4 text-center">{lang === 'ar' ? 'إجراءات (تعديل / حذف)' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded-xl object-cover border border-zinc-800 shrink-0 bg-zinc-950"
                            />
                            <div>
                              <div className="font-bold text-white text-sm flex items-center gap-2">
                                <span>{item.name}</span>
                                {item.badge && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.2 rounded font-medium">
                                    {item.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-zinc-400 text-xs line-clamp-1 max-w-sm mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 text-zinc-300 font-medium">
                          {item.category === 'shawarma' && 'شاورما'}
                          {item.category === 'kebab' && 'كباب ومشويات'}
                          {item.category === 'platters' && 'سرفيس وصحون'}
                          {item.category === 'appetizers' && 'مقبلات وسلطات'}
                          {item.category === 'family' && 'وجبة عائلية'}
                          {item.category === 'drinks' && 'مشروبات'}
                        </td>

                        <td className="p-4 font-bold text-amber-400 tabular-nums text-sm">
                          {item.price} <span className="text-zinc-400 text-xs font-normal">د.ج</span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAvailability(item.id)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                              item.isAvailable
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                            }`}
                          >
                            {item.isAvailable ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>متاح للطلب</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3.5 h-3.5" />
                                <span>غير متوفر</span>
                              </>
                            )}
                          </button>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
                              title="تعديل الوجبة والسعر"
                            >
                              <Edit className="w-3.5 h-3.5 text-amber-400" />
                              <span className="text-[11px]">تعديل</span>
                            </button>

                            {/* Direct Delete Modal Trigger (Fixes the delete issue) */}
                            <button
                              type="button"
                              onClick={() => setItemToDelete(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 transition-colors flex items-center gap-1"
                              title="حذف الوجبة من القائمة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="text-[11px]">حذف</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  لا توجد وجبات مطابقة للبحث
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADD NEW PRODUCT & PHOTO */}
        {activeTab === 'add' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-amber-500" />
                    <span>إضافة وجبة أو صنف جديد للمطعم</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    السعر بالدينار الجزائري (د.ج) مع إمكانية رفع أي صورة
                  </p>
                </div>
              </div>

              <form onSubmit={handleAddItem} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    اسم الوجبة / الساندوتش *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: شاورما دجاج سبيسيال بالفرماج"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">الفئة *</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="shawarma">🌯 شاورما</option>
                      <option value="kebab">🍢 كباب ومشويات</option>
                      <option value="platters">🍽️ سرفيس وصحون</option>
                      <option value="appetizers">🥗 مقبلات وسلطات</option>
                      <option value="family">👨‍👩‍👧‍👦 وجبات عائلية</option>
                      <option value="drinks">🥤 مشروبات وعصائر</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      السعر بالدينار الجزائري (د.ج) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="500"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 font-bold"
                      />
                      <span className="absolute left-3 top-2.5 text-xs text-amber-400 font-bold">
                        د.ج
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">الوصف والمكونات</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="مثال: شرائح شاورما دجاج متبلة مع خبز صاج، فرماج، صوص ثومية، مخلل، وبطاطا مقلية"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* IMAGE UPLOAD & SELECTION */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                  <label className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>صورة الوجبة (رفع من الجهاز أو اختيار جاهز)</span>
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="new-product-file"
                    />
                    <label
                      htmlFor="new-product-file"
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>رفع صورة من هاتفك أو حاسوبك</span>
                    </label>

                    <span className="text-xs text-zinc-500">أو اختر صورة جاهزة:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setImagePreview(preset.url);
                        }}
                        className={`group relative rounded-lg overflow-hidden border-2 transition-all h-20 ${
                          imageUrl === preset.url
                            ? 'border-amber-500 ring-2 ring-amber-500/30'
                            : 'border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-end p-1 text-[10px] text-white font-medium truncate">
                          {preset.label}
                        </div>
                        {imageUrl === preset.url && (
                          <div className="absolute top-1 right-1 bg-amber-500 text-zinc-950 rounded-full p-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div>
                    <input
                      type="url"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      placeholder="أو الصق رابط صورة خارجي مباشر..."
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">شارة (اختياري)</label>
                    <input
                      type="text"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      placeholder="الأكثر طلباً، حصري..."
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">السعرات (سعرة)</label>
                    <input
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="550"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-200">
                      <input
                        type="checkbox"
                        checked={spicy}
                        onChange={(e) => setSpicy(e.target.checked)}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                      />
                      <span className="flex items-center gap-1 text-red-400">
                        <Flame className="w-4 h-4" />
                        حار (بيكون)
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 mt-4"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>إضافة المنتج للقائمة فوراً بالدينار الجزائري</span>
                </button>
              </form>
            </div>

            {/* Live Preview */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>معاينة حية للوجبة</span>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                  <img
                    src={imagePreview}
                    alt={name || 'Preview'}
                    className="w-full h-full object-cover"
                  />
                  {badge && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-zinc-950 text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                      {badge}
                    </span>
                  )}
                  {spicy && (
                    <span className="absolute top-3 left-3 bg-red-600/90 text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      حار
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-semibold text-amber-400/90">
                      {category === 'shawarma' && 'شاورما بست كباب'}
                      {category === 'kebab' && 'مشاوي على الفحم'}
                      {category === 'platters' && 'سرفيس وصحون'}
                      {category === 'appetizers' && 'مقبلات وسلطات'}
                      {category === 'family' && 'وجبة عائلية'}
                      {category === 'drinks' && 'مشروبات'}
                    </span>
                    <span className="text-lg font-black text-white tabular-nums">
                      {price || '0'} <span className="text-xs text-amber-400 font-bold">د.ج</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2">
                    {name || 'اسم الوجبة يظهر هنا'}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {description || 'وصف المكونات والتحضير يظهر هنا للزبائن'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: COMPREHENSIVE SITE SETTINGS (تعديل شامل لمحتوى الموقع) */}
        {activeTab === 'settings' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-zinc-800 gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-amber-500" />
                  <span>تعديل شامل لمحتوى ونصوص ومعلومات الموقع</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  يمكنك تعديل اسم المطعم، العنوان الرئيسي، أرقام الهاتف، العناوين، وسعر التوصيل
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSettings}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                >
                  استعادة الافتراضي
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Section 1: Brand & Slogan */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  1. هوية واسم المطعم
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">اسم المطعم</label>
                    <input
                      type="text"
                      required
                      value={settingsForm.restaurantName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, restaurantName: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">الشعار الفرعي</label>
                    <input
                      type="text"
                      value={settingsForm.restaurantSubtitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, restaurantSubtitle: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Hero Headline & Subtitle */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  2. الواجهة والبانر الرئيسي (Hero Section)
                </h3>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">العنوان الرئيسي في الصفحة الأولى</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.heroHeadline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroHeadline: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">النص الترحيبي والوصفي</label>
                  <textarea
                    rows={2}
                    value={settingsForm.heroSubtitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Hero Image Changer */}
                <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2">
                  <label className="block text-xs font-semibold text-zinc-300">صورة البانر الرئيسي للمطعم</label>
                  <div className="flex items-center gap-3">
                    <img
                      src={settingsForm.heroImage}
                      alt="Hero Preview"
                      className="w-20 h-14 rounded-lg object-cover border border-zinc-800 bg-zinc-900 shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        ref={heroFileInputRef}
                        accept="image/*"
                        onChange={handleHeroFileUpload}
                        className="hidden"
                        id="hero-file-upload"
                      />
                      <label
                        htmlFor="hero-file-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 cursor-pointer border border-zinc-700"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>رفع صورة بانر جديدة من الجهاز</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Contact & Hours in Algeria */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  3. معلومات الاتصال وأوقات العمل والعناوين
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الهاتف للطلبات</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      placeholder="0555 12 34 56"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">رقم الواتساب</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      placeholder="0770 98 76 54"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">أوقات العمل</label>
                    <input
                      type="text"
                      value={settingsForm.workingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">عنوان الفرع الرئيسي</label>
                    <input
                      type="text"
                      value={settingsForm.mainAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, mainAddress: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">الفروع الأخرى</label>
                    <input
                      type="text"
                      value={settingsForm.secondAddress}
                      onChange={(e) => setSettingsForm({ ...settingsForm, secondAddress: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Delivery Fees in Algerian Dinars */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  4. رسوم التوصيل بالدينار الجزائري (د.ج) - الدفع عند الاستلام فقط
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">سعر التوصيل (د.ج)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1">توصيل مجاني للطلبات التي تفوق (د.ج)</label>
                    <input
                      type="number"
                      min="0"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Announcement Bar */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    5. شريط الإعلانات الترويجي أعلى الموقع
                  </h3>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                    <input
                      type="checkbox"
                      checked={settingsForm.showAnnouncement}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showAnnouncement: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-950 border-zinc-700"
                    />
                    <span>تفعيل الشريط</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={settingsForm.announcementText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                  placeholder="مرحباً بكم في Best Kebab! الدفع نقداً عند الاستلام فقط..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Submit Save Button */}
              <div className="pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-black text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ وتطبيق جميع التعديلات على الموقع مباشرة</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <span>الطلبات الواردة (الدفع عند الاستلام فقط)</span>
              </h2>
              <span className="text-xs text-zinc-400 font-medium">
                إجمالي الطلبات: {orders.length}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-400">
                <ShoppingBag className="w-12 h-12 mx-auto text-zinc-600 mb-3" />
                <h3 className="text-sm font-bold text-white mb-1">لا توجد طلبات جديدة حالياً</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                  عندما يطلب الزبائن شاورما أو كباب من الموقع، سيظهر طلبهم هنا فوراً مع تفاصيل العنوان ورقم الهاتف والدفع عند الاستلام.
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  الذهاب للموقع وتجربة الطلب
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
                        <div>
                          <span className="text-[11px] font-mono text-amber-400">#{order.id}</span>
                          <h4 className="text-sm font-bold text-white">{order.customerName}</h4>
                        </div>
                        <span className="text-xs text-zinc-400 font-mono">
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="text-xs text-zinc-300 space-y-1 mb-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500 font-medium">الجوال:</span>
                          <span className="font-mono">{order.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-zinc-500 font-medium">العنوان:</span>
                          <span className="truncate">{order.address}</span>
                        </div>
                        <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-1 rounded font-semibold">
                          💵 الدفع نقداً عند الاستلام
                        </div>
                      </div>

                      <div className="border-t border-zinc-800/80 pt-2 mb-3">
                        <ul className="space-y-1 text-xs">
                          {order.items.map((cartItem, idx) => (
                            <li key={idx} className="flex justify-between text-zinc-200">
                              <span>
                                {cartItem.quantity}x {cartItem.item.name}
                              </span>
                              <span className="tabular-nums font-mono text-zinc-400">
                                {cartItem.unitPrice * cartItem.quantity} د.ج
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-3">
                      <div className="flex justify-between items-center text-sm font-bold text-white mb-3">
                        <span>الإجمالي:</span>
                        <span className="text-amber-400 tabular-nums">{order.total} د.ج</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <label className="text-[11px] text-zinc-400 shrink-0">الحالة:</label>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                        >
                          <option value="pending">⏳ قيد الانتظار</option>
                          <option value="preparing">🔥 جاري التحضير</option>
                          <option value="on_way">🛵 في الطريق للتوصيل</option>
                          <option value="delivered">✅ تم التوصيل بنجاح</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: STATS */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>إجمالي الوجبات</span>
                  <Package className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{totalItemsCount}</div>
                <div className="text-[11px] text-emerald-400 mt-1">
                  {availableItemsCount} وجبة متوفرة بالقائمة
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>إجمالي الطلبات</span>
                  <ShoppingBag className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-white tabular-nums">{orders.length}</div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  الدفع عند الاستلام فقط
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>المبيعات بالدينار الجزائري</span>
                  <span className="text-xs font-bold text-amber-400">DZD</span>
                </div>
                <div className="text-2xl font-black text-white tabular-nums">
                  {totalSales} <span className="text-xs text-amber-400 font-bold">د.ج</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  كاش عند الباب
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
                  <span>حماية الإدارة</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-emerald-400">مشفر ومحمي</div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  الدخول مقتصر على المسؤول
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
