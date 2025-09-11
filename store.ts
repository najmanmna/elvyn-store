import { Product } from "./sanity.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  product: Product;
  variant?: {
    id: string;
    color?: string;
    stock?: number;
    images?: any[];
  };

  itemKey: string; // unique identifier for product+variant
  quantity: number;
}

interface StoreState {
  items: CartItem[];
  addItem: (product: Product, variant?: { id: string; color?: string }) => void;
  removeItem: (itemKey: string) => void;
  deleteCartProduct: (itemKey: string) => void;
  resetCart: () => void;
  getTotalPrice: () => number;
  getSubTotalPrice: () => number;
  getItemCount: (itemKey: string) => number;
  getGroupedItems: () => CartItem[];

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

      // ✅ add product by unique itemKey
      addItem: (product, variant) =>
        set((state) => {
          const itemKey = variant ? `${product._id}-${variant.id}` : product._id;
          const existingItem = state.items.find((item) => item.itemKey === itemKey);

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.itemKey === itemKey
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              items: [
                ...state.items,
                { product, variant, itemKey, quantity: 1 },
              ],
            };
          }
        }),

      // ✅ remove 1 from itemKey
      removeItem: (itemKey) =>
        set((state) => ({
          items: state.items.reduce((acc, item) => {
            if (item.itemKey === itemKey) {
              if (item.quantity > 1) {
                acc.push({ ...item, quantity: item.quantity - 1 });
              }
            } else {
              acc.push(item);
            }
            return acc;
          }, [] as CartItem[]),
        })),

      // ✅ delete whole itemKey from cart
      deleteCartProduct: (itemKey) =>
        set((state) => ({
          items: state.items.filter((item) => item.itemKey !== itemKey),
        })),

      resetCart: () => set({ items: [] }),

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price ?? 0) * item.quantity,
          0
        );
      },

      getSubTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.price ?? 0;
          const discount = ((item.product.discount ?? 0) * price) / 100;
          const discountedPrice = price - discount;
          return total + discountedPrice * item.quantity;
        }, 0);
      },

      // ✅ get count by itemKey
      getItemCount: (itemKey) => {
        const item = get().items.find((item) => item.itemKey === itemKey);
        return item ? item.quantity : 0;
      },

      getGroupedItems: () => get().items,

      // ✅ favorites unchanged
      addToFavorite: (product: Product) => {
        return new Promise<void>((resolve) => {
          set((state: StoreState) => {
            const isFavorite = state.favoriteProduct.some(
              (item) => item._id === product._id
            );
            return {
              favoriteProduct: isFavorite
                ? state.favoriteProduct.filter(
                    (item) => item._id !== product._id
                  )
                : [...state.favoriteProduct, { ...product }],
            };
          });
          resolve();
        });
      },

      removeFromFavorite: (productId: string) => {
        set((state: StoreState) => ({
          favoriteProduct: state.favoriteProduct.filter(
            (item) => item._id !== productId
          ),
        }));
      },

      resetFavorite: () => {
        set({ favoriteProduct: [] });
      },
    }),
    { name: "cart-store" }
  )
);

export default useCartStore;
