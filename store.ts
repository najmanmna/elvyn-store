// src/store/index.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/sanity.types";
import type { SanityImage } from "@/types/sanity-helpers";

export interface CartVariant {
  id: string;
  color?: string;
  stock?: number;
  images?: SanityImage[];
}

export interface CartItem {
  product: Product;
  variant: CartVariant;
  itemKey: string;
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, variant: CartVariant) => void;
  removeItem: (itemKey: string) => void; // remove one unit
  deleteCartProduct: (itemKey: string) => void; // remove entire line
  resetCart: () => void;

  // derived helpers
  getItemCount: (itemKey: string) => number;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;

  // convenience wrappers
  increaseQuantity: (itemKey: string) => void;
  decreaseQuantity: (itemKey: string) => void;

  // 🔹 NEW: update variant data (e.g., stock, images)
  updateItemVariant: (itemKey: string, variant: Partial<CartVariant>) => void;

  // favorites
  favoriteProduct: Product[];
  addToFavorite: (product: Product) => Promise<void>;
  removeFromFavorite: (productId: string) => void;
  resetFavorite: () => void;
}

const useCartStore = create<StoreState>()(
  persist(
    (set, get) => ({
      items: [],
      favoriteProduct: [],

      // add item (increment if exists)
     addItem: (product: Product, variant: CartVariant) =>
  set((state) => {
    const itemKey = `${product._id}-${variant.id}`;
    const existing = state.items.find((i) => i.itemKey === itemKey);

    if (existing) {
      return {
        items: state.items.map((i) =>
          i.itemKey === itemKey ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    } else {
      return {
        items: [...state.items, { product, variant, itemKey, quantity: 1 }],
      };
    }
  }),



      // remove one unit
      removeItem: (itemKey) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.itemKey === itemKey ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i
            )
            .filter((i) => i.quantity > 0),
        })),

      // delete entire product line
      deleteCartProduct: (itemKey) =>
        set((state) => ({
          items: state.items.filter((i) => i.itemKey !== itemKey),
        })),

      resetCart: () => set({ items: [] }),

      getItemCount: (itemKey) => {
        const item = get().items.find((i) => i.itemKey === itemKey);
        return item ? item.quantity : 0;
      },

      getTotalPrice: () =>
        get().items.reduce((t, item) => t + (item.product.price ?? 0) * item.quantity, 0),

      getSubTotalPrice: () =>
        get().items.reduce((t, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discounted = price - discount;
          return t + discounted * item.quantity;
        }, 0),

      increaseQuantity: (itemKey) => {
        const found = get().items.find((i) => i.itemKey === itemKey);
        if (found) {
          get().addItem(found.product, found.variant);
        }
      },

      decreaseQuantity: (itemKey) => {
        get().removeItem(itemKey);
      },

      // 🔹 update variant details (e.g. fresh stock from Sanity)
      updateItemVariant: (itemKey, variant) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.itemKey === itemKey ? { ...i, variant: { ...i.variant, ...variant } } : i
          ),
        })),

      // favorites
      addToFavorite: (product) =>
        new Promise<void>((resolve) => {
          set((state) => {
            const exists = state.favoriteProduct.some((p) => p._id === product._id);
            return {
              favoriteProduct: exists
                ? state.favoriteProduct.filter((p) => p._id !== product._id)
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        }),

      removeFromFavorite: (productId) =>
        set((state) => ({
          favoriteProduct: state.favoriteProduct.filter((p) => p._id !== productId),
        })),

      resetFavorite: () => set({ favoriteProduct: [] }),
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
