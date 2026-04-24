import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  loadCart: () => Promise<void>;
}

const CART_STORAGE_KEY = '@minishop_cart';

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product_id === product.product_id);

      let newItems;
      if (existingItem) {
        newItems = state.items.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity: 1 }];
      }

      // Persist to AsyncStorage
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));

      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.product_id !== productId);

      // Persist to AsyncStorage
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));

      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((item) => item.product_id !== productId) };
      }

      const newItems = state.items.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      );

      // Persist to AsyncStorage
      AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));

      return { items: newItems };
    });
  },

  clearCart: () => {
    AsyncStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  loadCart: async () => {
    try {
      const cartJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (cartJson) {
        const items = JSON.parse(cartJson);
        set({ items });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },
}));
