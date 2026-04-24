import * as SecureStore from 'expo-secure-store';

const CART_KEY = 'minishop_cart';

export const storage = {
  async getItem(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  },

  async getCart() {
    const cartJson = await this.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
  },

  async setCart(cart: any[]) {
    await this.setItem(CART_KEY, JSON.stringify(cart));
  },

  async clearCart() {
    await this.removeItem(CART_KEY);
  },
};
