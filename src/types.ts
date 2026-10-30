export type Role = 
  | 'client' 
  | 'confectioner' 
  | 'supplier' 
  | 'decorator' 
  | 'animator' 
  | 'organizer' 
  | 'operator'
  | 'support'
  | 'moderator'
  | 'admin'
  | 'superadmin'
  | 'florist'
  | 'photographer'
  | 'host'
  | 'caterer'
  | 'venue'
  | 'courier'
  | 'corporate';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  city?: string;
  about?: string;
  rating?: number;
  joinedAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  weight: string;
  portions: number;
  prepTime: string;
  emoji: string;
  allergens: string[];
  available: boolean;
  rating: number;
}

export interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  status: 'new' | 'accepted' | 'in_production' | 'ready' | 'completed' | 'cancelled';
  total: number;
  deliveryDate: string;
  notes: string;
  createdAt: string;
}

export interface Recipe {
  id: string;
  confectionerId: string;
  name: string;
  ingredients: { name: string; amount: number; unit: string; cost: number }[];
}

export interface InventoryItem {
  id: string;
  ownerId: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
}

export interface Event {
  id: string;
  organizerId: string;
  name: string;
  date: string;
  location: string;
  budget: number;
  tasks: { id: string; title: string; done: boolean; assignee?: string }[];
}

export interface CakeProject {
  id: string;
  userId: string;
  category: string;
  shape: string;
  weight: number;
  portions: number;
  layers: string[];
  filling: string;
  cream: string;
  coating: string;
  decor: string[];
  inscription: string;
  deliveryDate: string;
  notes: string;
  price: number;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  sellerId: string;
}
