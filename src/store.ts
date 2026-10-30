import { createContext, useContext } from 'react';
import type { User, Product, Order, Recipe, InventoryItem, Conversation, Message, Event, CakeProject, CartItem } from './types';
import { initialUsers, initialProducts, initialOrders, initialRecipes, initialInventory, initialConversations, initialMessages, initialEvents } from './data';

export interface Store {
  users: User[];
  products: Product[];
  orders: Order[];
  recipes: Recipe[];
  inventory: InventoryItem[];
  conversations: Conversation[];
  messages: Message[];
  events: Event[];
  cakeProjects: CakeProject[];
  cart: CartItem[];
  currentUserId: string | null;
}

const STORAGE_KEY = 'conditera_v3';

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    users: initialUsers,
    products: initialProducts,
    orders: initialOrders,
    recipes: initialRecipes,
    inventory: initialInventory,
    conversations: initialConversations,
    messages: initialMessages,
    events: initialEvents,
    cakeProjects: [],
    cart: [],
    currentUserId: null,
  };
}

export function saveStore(store: Store) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch {}
}

export function resetStore() {
  localStorage.removeItem(STORAGE_KEY);
}

interface Ctx {
  store: Store;
  setStore: (updater: (s: Store) => Store) => void;
}

export const StoreCtx = createContext<Ctx | null>(null);

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

export function useCurrentUser(): User | null {
  const { store } = useStore();
  return store.users.find(u => u.id === store.currentUserId) || null;
}
