import { MenuItem, Order, SiteSettings } from '../types';
import { DEFAULT_MENU_ITEMS, DEFAULT_SITE_SETTINGS } from '../data/defaultMenu';

const MENU_STORAGE_KEY = 'best_kebab_menu_items_user_controlled_v3';
const INITIALIZED_FLAG_KEY = 'best_kebab_menu_initialized_flag';
const ORDERS_STORAGE_KEY = 'best_kebab_orders_v1';
const SETTINGS_STORAGE_KEY = 'best_kebab_site_settings_v1';
const ADMIN_AUTH_KEY = 'best_kebab_admin_authenticated';

/**
 * Loads menu items. NEVER automatically re-adds or regenerates dishes
 * if the user has already deleted or modified their menu.
 */
export function getStoredMenuItems(): MenuItem[] {
  try {
    const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);
    const raw = localStorage.getItem(MENU_STORAGE_KEY);

    // Only seed default items the very first time the app is launched ever
    if (!isInitialized || raw === null) {
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }

    const parsed = JSON.parse(raw);
    // If the user deleted items (even if array is empty []), preserve user's exact state!
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Saves menu items strictly according to user actions.
 */
export function saveMenuItems(items: MenuItem[]): void {
  try {
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save menu items to localStorage:', err);
  }
}

/**
 * Only resets if the user manually and explicitly clicks the reset button.
 */
export function resetMenuToDefaults(): MenuItem[] {
  try {
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(DEFAULT_MENU_ITEMS));
  } catch (err) {
    console.error('Failed to reset menu:', err);
  }
  return DEFAULT_MENU_ITEMS;
}

export function getStoredSiteSettings(): SiteSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
      return DEFAULT_SITE_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SITE_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save site settings:', err);
  }
}

export function resetSiteSettingsToDefaults(): SiteSettings {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SITE_SETTINGS));
  } catch (err) {
    console.error('Failed to reset site settings:', err);
  }
  return DEFAULT_SITE_SETTINGS;
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrder(order: Order): Order[] {
  try {
    const orders = getStoredOrders();
    const updated = [order, ...orders];
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save order:', err);
    return [order];
  }
}

export function updateOrderStatus(orderId: string, status: Order['status']): Order[] {
  try {
    const orders = getStoredOrders();
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update order status:', err);
    return [];
  }
}

export function getAdminAuthState(): boolean {
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminAuthState(isAuthed: boolean): void {
  try {
    if (isAuthed) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch (err) {
    console.error('Failed to set admin auth state:', err);
  }
}
