export type Category = 'all' | 'shawarma' | 'kebab' | 'platters' | 'appetizers' | 'family' | 'drinks';

export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  category: 'shawarma' | 'kebab' | 'platters' | 'appetizers' | 'family' | 'drinks';
  price: number; // In Algerian Dinars (DZD / د.ج)
  description: string;
  descriptionEn: string;
  image: string;
  badge?: string;
  spicy?: boolean;
  calories?: number;
  isAvailable: boolean;
  createdAt: number;
}

export interface CartCustomization {
  bread: 'saj' | 'pita' | 'plate';
  extraGarlic: boolean;
  extraPickles: boolean;
  spicyShatta: boolean;
  noOnions?: boolean;
  notes?: string;
}

export interface CartItem {
  id: string;
  item: MenuItem;
  quantity: number;
  customization: CartCustomization;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'preparing' | 'on_way' | 'delivered';
  paymentMethod: 'cash_on_delivery'; // Strictly Cash on delivery
  createdAt: number;
}

export interface SiteSettings {
  restaurantName: string;
  restaurantSubtitle: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroImage: string;
  phone: string;
  whatsapp: string;
  workingHours: string;
  mainAddress: string;
  secondAddress: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  aboutTitle: string;
  aboutText: string;
  announcementText: string;
  showAnnouncement: boolean;
}
