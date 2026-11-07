/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MenuSection } from './components/MenuSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { ItemCustomizeModal } from './components/ItemCustomizeModal';
import { CartDrawer } from './components/CartDrawer';
import { SecretAuthModal } from './components/SecretAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { MenuItem, CartItem, CartCustomization, Order, SiteSettings } from './types';
import {
  getStoredMenuItems,
  getStoredOrders,
  getStoredSiteSettings
} from './utils/storage';

export default function App() {
  const [lang] = useState<'ar' | 'en'>('ar');
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => getStoredMenuItems());
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getStoredSiteSettings());

  // UI Modals State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);

  // Sync RTL document direction
  useEffect(() => {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, []);

  // Handle Add to Cart from Customize Modal
  const handleAddToCart = (item: MenuItem, quantity: number, customization: CartCustomization) => {
    const addOnCost =
      (customization.extraGarlic ? 50 : 0) +
      (customization.extraPickles ? 30 : 0) +
      (customization.spicyShatta ? 30 : 0);
    const unitPrice = item.price + addOnCost;

    const newCartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      item,
      quantity,
      customization,
      unitPrice,
    };

    setCartItems((prev) => [...prev, newCartItem]);
    setIsCartOpen(true);
  };

  // Handle order placed
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleExploreMenu = () => {
    const menuEl = document.getElementById('menu');
    if (menuEl) {
      menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* If Admin is active, show Admin Dashboard view */}
      {isAdminOpen ? (
        <AdminDashboard
          menuItems={menuItems}
          setMenuItems={setMenuItems}
          orders={orders}
          setOrders={setOrders}
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          onClose={() => setIsAdminOpen(false)}
          lang={lang}
        />
      ) : (
        <>
          {/* Main Public Restaurant Storefront */}
          <Navbar
            cartCount={cartCount}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenSecretAdmin={() => setIsSecretModalOpen(true)}
            siteSettings={siteSettings}
            lang={lang}
          />

          <main className="flex-1">
            <Hero
              onExploreMenu={handleExploreMenu}
              siteSettings={siteSettings}
              lang={lang}
            />
            <MenuSection
              menuItems={menuItems}
              onSelectItem={(item) => setCustomizingItem(item)}
              lang={lang}
            />
            <AboutSection
              siteSettings={siteSettings}
              lang={lang}
            />
          </main>

          <Footer
            onOpenSecretAdmin={() => setIsSecretModalOpen(true)}
            siteSettings={siteSettings}
            lang={lang}
          />

          {/* Cart Drawer (Strictly Cash on Delivery) */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            setCartItems={setCartItems}
            onOrderPlaced={handleOrderPlaced}
            siteSettings={siteSettings}
            lang={lang}
          />

          {/* Item Customize Modal */}
          <ItemCustomizeModal
            item={customizingItem}
            onClose={() => setCustomizingItem(null)}
            onAddToCart={handleAddToCart}
            lang={lang}
          />

          {/* Secret Administration Authentication Modal (Triggered by '...') */}
          <SecretAuthModal
            isOpen={isSecretModalOpen}
            onClose={() => setIsSecretModalOpen(false)}
            onSuccess={() => {
              setIsAdminOpen(true);
            }}
            lang={lang}
          />
        </>
      )}
    </div>
  );
}
