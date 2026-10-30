import React, { useState, useEffect, useMemo, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Search, ShoppingCart, Heart, Star, Clock, Shield, Users, ChefHat, Sparkles, SlidersHorizontal, Plus, Edit3, Eye, EyeOff, Mail, Phone, DollarSign, MapPin, Briefcase, Calendar, CheckCircle, Circle, Send, Bot, MessageCircle, LogOut, Bell, Package, TrendingUp, AlertTriangle, ArrowRight, ArrowLeft, X, Menu, ChevronDown, Filter, Upload, Save, Trash2, Settings, Home, BarChart3, FileText, Truck, User, Users2, Award, CalendarDays, Palette, Camera, Music, Flower, Gift } from 'lucide-react';

// ==================== ТИПЫ ====================
type Role = 'guest' | 'client' | 'confectioner' | 'supplier' | 'decorator' | 'animator' | 'organizer' | 'operator' | 'support' | 'moderator' | 'admin' | 'superadmin';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  phone?: string;
  city?: string;
  about?: string;
  rating?: number;
  ordersCount?: number;
  joinedAt: string;
}

interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceFrom: boolean;
  weight: string;
  portions: number;
  prepTime: string;
  images: string[];
  allergens: string[];
  available: boolean;
  status: 'draft' | 'published' | 'archived';
  rating: number;
  reviewsCount: number;
  createdAt: string;
}

interface Order {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string;
  productName: string;
  status: 'new' | 'accepted' | 'in_production' | 'ready' | 'delivered' | 'completed' | 'cancelled';
  total: number;
  deliveryDate: string;
  notes: string;
  createdAt: string;
  history: { status: Order['status']; date: string; note?: string }[];
}

interface Recipe {
  id: string;
  confectionerId: string;
  name: string;
  yield: string;
  ingredients: { name: string; amount: number; unit: string; cost: number }[];
  notes: string;
  lastModified: string;
}

interface InventoryItem {
  id: string;
  ownerId: string;
  name: string;
  unit: string;
  stock: number;
  minStock: number;
  costPerUnit: number;
}

interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  time: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: string;
  lastTime?: string;
  orderId?: string;
}

interface Event {
  id: string;
  organizerId: string;
  name: string;
  date: string;
  location: string;
  budget: number;
  status: 'planning' | 'confirmed' | 'in_progress' | 'completed';
  tasks: { id: string; title: string; done: boolean; assignee?: string }[];
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  sellerId: string;
}

interface CakeProject {
  id: string;
  userId: string;
  category: string;
  shape: string;
  weight: string;
  portions: number;
  layers: string[];
  filling: string;
  cream: string;
  coating: string;
  decor: string[];
  inscription: string;
  colors: string[];
  theme: string;
  deliveryDate: string;
  notes: string;
  calculatedPrice: number;
  createdAt: string;
}

// ==================== ХРАНИЛИЩЕ ====================
const STORAGE_KEY = 'conditera_data_v2';

interface AppData {
  users: User[];
  products: Product[];
  orders: Order[];
  recipes: Recipe[];
  inventory: InventoryItem[];
  conversations: Conversation[];
  messages: ChatMessage[];
  events: Event[];
  cart: CartItem[];
  cakeProjects: CakeProject[];
  currentUserId: string | null;
}

const defaultData: AppData = {
  users: [
    { id: 'u1', email: 'anna@conditera.ru', name: 'Анна Пекарская', role: 'confectioner', phone: '+7 (900) 111-22-33', city: 'Москва', about: 'Кондитер с 10-летним опытом. Специализируюсь на свадебных тортах и французских десертах.', rating: 4.9, ordersCount: 156, joinedAt: '2024-03-15' },
    { id: 'u2', email: 'maria@mail.ru', name: 'Мария Иванова', role: 'client', phone: '+7 (900) 222-33-44', city: 'Москва', about: 'Люблю сладкое', ordersCount: 12, joinedAt: '2024-06-20' },
    { id: 'u3', email: 'sweet@home.ru', name: 'Сладкий Дом', role: 'confectioner', phone: '+7 (900) 333-44-55', city: 'Санкт-Петербург', about: 'Семейная кондитерская', rating: 4.7, ordersCount: 89, joinedAt: '2024-01-10' },
    { id: 'u4', email: 'supplier@moloko.ru', name: 'Молочный комбинат «Заречье»', role: 'supplier', phone: '+7 (900) 444-55-66', city: 'Москва', about: 'Свежие молочные продукты оптом', joinedAt: '2024-02-01' },
    { id: 'u5', email: 'decor@shop.ru', name: 'Декор-Шоп', role: 'decorator', phone: '+7 (900) 555-66-77', city: 'Москва', about: 'Топперы, свечи, фигурки', joinedAt: '2024-04-15' },
    { id: 'u6', email: 'anim@fun.ru', name: 'Аниматор Весельчак', role: 'animator', phone: '+7 (900) 666-77-88', city: 'Москва', about: 'Детские праздники, шоу программ', rating: 5.0, joinedAt: '2024-05-01' },
    { id: 'u7', email: 'org@event.ru', name: 'Event-агентство «Праздник»', role: 'organizer', phone: '+7 (900) 777-88-99', city: 'Москва', about: 'Организация свадеб и корпоративов', joinedAt: '2024-03-01' },
    { id: 'u8', email: 'admin@conditera.ru', name: 'Администратор', role: 'admin', joinedAt: '2024-01-01' },
  ],
  products: [
    { id: 'p1', sellerId: 'u1', name: 'Медовик классический', description: 'Традиционный медовый торт с нежным сметанным кремом. 8 коржей, пропитанных overnight.', category: 'Торты', price: 2800, priceFrom: false, weight: '1.2 кг', portions: 8, prepTime: '24 часа', images: ['🎂'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.9, reviewsCount: 34, createdAt: '2024-05-10' },
    { id: 'p2', sellerId: 'u1', name: 'Красный бархат', description: 'Яркий бисквит с бархатной текстурой и кремом из маскарпоне.', category: 'Торты', price: 3200, priceFrom: false, weight: '1.5 кг', portions: 10, prepTime: '12 часов', images: ['🍰'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.8, reviewsCount: 21, createdAt: '2024-05-15' },
    { id: 'p3', sellerId: 'u1', name: 'Набор макарон (12 шт)', description: 'Ассорти французских макарон: фисташка, малина, шоколад.', category: 'Пирожные', price: 1800, priceFrom: false, weight: '360 г', portions: 12, prepTime: '48 часов', images: ['🧁'], allergens: ['Миндаль', 'Яйца', 'Молоко'], available: true, status: 'published', rating: 5.0, reviewsCount: 45, createdAt: '2024-06-01' },
    { id: 'p4', sellerId: 'u3', name: 'Свадебный торт на заказ', description: 'Индивидуальный дизайн. Многоярусный торт с живыми цветами.', category: 'Свадебные', price: 8000, priceFrom: true, weight: 'от 3 кг', portions: 20, prepTime: '3-5 дней', images: ['💒'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.7, reviewsCount: 12, createdAt: '2024-04-20' },
    { id: 'p5', sellerId: 'u3', name: 'Чизкейк Нью-Йорк', description: 'Классический американский чизкейк на песочной основе.', category: 'Торты', price: 2400, priceFrom: false, weight: '1 кг', portions: 8, prepTime: '8 часов', images: ['🍰'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.6, reviewsCount: 18, createdAt: '2024-05-05' },
    { id: 'p6', sellerId: 'u1', name: 'Эклеры ассорти (6 шт)', description: 'Заварные пирожные с кремом: ваниль, шоколад, фисташка.', category: 'Пирожные', price: 1200, priceFrom: false, weight: '420 г', portions: 6, prepTime: '6 часов', images: ['🥐'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.9, reviewsCount: 28, createdAt: '2024-06-10' },
    { id: 'p7', sellerId: 'u3', name: 'Детский торт «Единорог»', description: 'Яркий торт для детского праздника с фигуркой единорога.', category: 'Детские', price: 3500, priceFrom: false, weight: '2 кг', portions: 12, prepTime: '2 дня', images: ['🦄'], allergens: ['Глютен', 'Молоко', 'Яйца'], available: true, status: 'published', rating: 4.8, reviewsCount: 15, createdAt: '2024-06-15' },
    { id: 'p8', sellerId: 'u5', name: 'Топпер «С Днём Рождения»', description: 'Акриловый топпер с золотым тиснением', category: 'Декор', price: 450, priceFrom: false, weight: '50 г', portions: 1, prepTime: '1 день', images: ['🎈'], allergens: [], available: true, status: 'published', rating: 4.5, reviewsCount: 8, createdAt: '2024-06-20' },
    { id: 'p9', sellerId: 'u5', name: 'Набор свечей «Спираль»', description: '12 спиральных свечей разных цветов', category: 'Декор', price: 350, priceFrom: false, weight: '100 г', portions: 12, prepTime: 'В наличии', images: ['🕯️'], allergens: [], available: true, status: 'published', rating: 4.7, reviewsCount: 22, createdAt: '2024-06-22' },
  ],
  orders: [
    { id: 'ORD-001', buyerId: 'u2', sellerId: 'u1', productId: 'p1', productName: 'Медовик классический', status: 'new', total: 2800, deliveryDate: '2026-01-20', notes: 'Без орехов', createdAt: '2026-01-15', history: [{ status: 'new', date: '2026-01-15' }] },
    { id: 'ORD-002', buyerId: 'u2', sellerId: 'u1', productId: 'p2', productName: 'Красный бархат', status: 'accepted', total: 3200, deliveryDate: '2026-01-19', notes: 'Надпись: С Днём Рождения!', createdAt: '2026-01-14', history: [{ status: 'new', date: '2026-01-14' }, { status: 'accepted', date: '2026-01-14' }] },
    { id: 'ORD-003', buyerId: 'u2', sellerId: 'u1', productId: 'p3', productName: 'Набор макарон (12 шт)', status: 'in_production', total: 1800, deliveryDate: '2026-01-18', notes: '', createdAt: '2026-01-13', history: [{ status: 'new', date: '2026-01-13' }, { status: 'accepted', date: '2026-01-13' }, { status: 'in_production', date: '2026-01-14' }] },
    { id: 'ORD-004', buyerId: 'u2', sellerId: 'u3', productId: 'p4', productName: 'Свадебный торт на заказ', status: 'ready', total: 12000, deliveryDate: '2026-01-17', notes: 'Белый крем, живые пионы', createdAt: '2026-01-10', history: [{ status: 'new', date: '2026-01-10' }, { status: 'accepted', date: '2026-01-10' }, { status: 'in_production', date: '2026-01-12' }, { status: 'ready', date: '2026-01-16' }] },
    { id: 'ORD-005', buyerId: 'u2', sellerId: 'u3', productId: 'p5', productName: 'Чизкейк Нью-Йорк', status: 'completed', total: 2400, deliveryDate: '2026-01-12', notes: '', createdAt: '2026-01-08', history: [{ status: 'new', date: '2026-01-08' }, { status: 'completed', date: '2026-01-12' }] },
  ],
  recipes: [
    {
      id: 'r1', confectionerId: 'u1', name: 'Медовик классический', yield: '1.2 кг (8 порций)',
      ingredients: [
        { name: 'Мука пшеничная', amount: 400, unit: 'г', cost: 40 },
        { name: 'Мёд', amount: 150, unit: 'г', cost: 120 },
        { name: 'Сахар', amount: 200, unit: 'г', cost: 20 },
        { name: 'Масло сливочное', amount: 200, unit: 'г', cost: 160 },
        { name: 'Яйца', amount: 4, unit: 'шт', cost: 48 },
        { name: 'Сметана 20%', amount: 500, unit: 'г', cost: 200 },
      ],
      notes: 'Коржи печь при 180°C по 5-7 минут. Пропитка минимум 8 часов.',
      lastModified: '2026-01-10'
    },
  ],
  inventory: [
    { id: 'inv1', ownerId: 'u1', name: 'Мука пшеничная', unit: 'кг', stock: 25, minStock: 5, costPerUnit: 100 },
    { id: 'inv2', ownerId: 'u1', name: 'Сахар', unit: 'кг', stock: 15, minStock: 3, costPerUnit: 80 },
    { id: 'inv3', ownerId: 'u1', name: 'Масло сливочное', unit: 'кг', stock: 4, minStock: 2, costPerUnit: 800 },
    { id: 'inv4', ownerId: 'u1', name: 'Яйца', unit: 'дес', stock: 8, minStock: 3, costPerUnit: 120 },
    { id: 'inv5', ownerId: 'u1', name: 'Сметана 20%', unit: 'кг', stock: 2, minStock: 2, costPerUnit: 400 },
    { id: 'inv6', ownerId: 'u1', name: 'Маскарпоне', unit: 'кг', stock: 1.5, minStock: 1, costPerUnit: 900 },
    { id: 'inv7', ownerId: 'u1', name: 'Мёд', unit: 'кг', stock: 3, minStock: 1, costPerUnit: 800 },
  ],
  conversations: [
    { id: 'conv1', participants: ['u2', 'u1'], lastMessage: 'Отлично, оформляю заказ!', lastTime: '10:40', orderId: 'ORD-001' },
  ],
  messages: [
    { id: 'm1', conversationId: 'conv1', senderId: 'u2', text: 'Здравствуйте! Можно ли заказать торт на 20 января?', time: '10:30', read: true },
    { id: 'm2', conversationId: 'conv1', senderId: 'u1', text: 'Добрый день! Да, конечно. Какой торт вас интересует?', time: '10:32', read: true },
    { id: 'm3', conversationId: 'conv1', senderId: 'u2', text: 'Хочу медовик, но без орехов. И можно ли сделать надпись?', time: '10:35', read: true },
    { id: 'm4', conversationId: 'conv1', senderId: 'u1', text: 'Без проблем! Медовик готовим без орехов. Надпись сделаем. Стоимость 2800₽, срок — 2 дня.', time: '10:38', read: true },
    { id: 'm5', conversationId: 'conv1', senderId: 'u2', text: 'Отлично, оформляю заказ!', time: '10:40', read: true },
  ],
  events: [
    {
      id: 'e1', organizerId: 'u7', name: 'Свадьба Ивановых', date: '2026-02-14', location: 'Ресторан «Белый сад»', budget: 150000, status: 'confirmed',
      tasks: [
        { id: 't1', title: 'Свадебный торт 3 яруса', done: true, assignee: 'Анна Пекарская' },
        { id: 't2', title: 'Кенди-бар', done: false, assignee: 'Сладкий Дом' },
        { id: 't3', title: 'Флористическое оформление', done: false },
        { id: 't4', title: 'Аниматоры', done: false, assignee: 'Аниматор Весельчак' },
      ]
    },
  ],
  cart: [],
  cakeProjects: [],
  currentUserId: null,
};

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultData;
}

function saveData(data: AppData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

// ==================== КОНТЕКСТ ====================
interface Ctx extends AppData {
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, name: string, password: string, role: Role) => boolean;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  checkout: (notes: string, deliveryDate: string) => string | null;
  updateOrderStatus: (orderId: string, status: Order['status'], note?: string) => void;
  sendMessage: (conversationId: string, text: string) => void;
  createConversation: (otherUserId: string, orderId?: string) => string;
  saveCakeProject: (project: Omit<CakeProject, 'id' | 'userId' | 'createdAt'>) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => void;
  addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
  updateInventory: (itemId: string, delta: number) => void;
  addEvent: (event: Omit<Event, 'id'>) => void;
  toggleTask: (eventId: string, taskId: string) => void;
}

const AppCtx = createContext<Ctx | null>(null);

function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(loadData);

  useEffect(() => { saveData(data); }, [data]);

  const currentUser = data.users.find(u => u.id === data.currentUserId) || null;

  const login = (email: string, _password: string) => {
    const user = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return false;
    setData(d => ({ ...d, currentUserId: user.id }));
    return true;
  };

  const register = (email: string, name: string, _password: string, role: Role) => {
    if (data.users.some(u => u.email.toLowerCase() === email.toLowerCase())) return false;
    const newUser: User = {
      id: 'u' + Date.now(),
      email, name, role,
      joinedAt: new Date().toISOString().split('T')[0],
      ordersCount: 0,
    };
    setData(d => ({ ...d, users: [...d.users, newUser], currentUserId: newUser.id }));
    return true;
  };

  const logout = () => setData(d => ({ ...d, currentUserId: null }));

  const addToCart = (product: Product) => {
    setData(d => {
      const existing = d.cart.find(c => c.productId === product.id);
      if (existing) {
        return { ...d, cart: d.cart.map(c => c.productId === product.id ? { ...c, qty: c.qty + 1 } : c) };
      }
      return { ...d, cart: [...d.cart, { productId: product.id, name: product.name, price: product.price, qty: 1, sellerId: product.sellerId }] };
    });
  };

  const removeFromCart = (productId: string) => setData(d => ({ ...d, cart: d.cart.filter(c => c.productId !== productId) }));
  const clearCart = () => setData(d => ({ ...d, cart: [] }));

  const checkout = (notes: string, deliveryDate: string) => {
    if (!currentUser || data.cart.length === 0) return null;
    const newOrders: Order[] = data.cart.map(item => ({
      id: 'ORD-' + Date.now() + Math.floor(Math.random() * 1000),
      buyerId: currentUser.id,
      sellerId: item.sellerId,
      productId: item.productId,
      productName: item.name,
      status: 'new' as const,
      total: item.price * item.qty,
      deliveryDate,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
      history: [{ status: 'new', date: new Date().toISOString().split('T')[0] }],
    }));
    setData(d => ({ ...d, orders: [...d.orders, ...newOrders], cart: [] }));
    return newOrders[0].id;
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], note?: string) => {
    setData(d => ({
      ...d,
      orders: d.orders.map(o => o.id === orderId ? {
        ...o, status,
        history: [...o.history, { status, date: new Date().toISOString().split('T')[0], note }]
      } : o)
    }));
  };

  const sendMessage = (conversationId: string, text: string) => {
    if (!currentUser) return;
    const msg: ChatMessage = {
      id: 'm' + Date.now(),
      conversationId,
      senderId: currentUser.id,
      text,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    setData(d => ({
      ...d,
      messages: [...d.messages, msg],
      conversations: d.conversations.map(c => c.id === conversationId ? { ...c, lastMessage: text, lastTime: msg.time } : c)
    }));
  };

  const createConversation = (otherUserId: string, orderId?: string) => {
    if (!currentUser) return '';
    const existing = data.conversations.find(c =>
      c.participants.includes(currentUser.id) && c.participants.includes(otherUserId) && c.orderId === orderId
    );
    if (existing) return existing.id;
    const newConv: Conversation = {
      id: 'conv' + Date.now(),
      participants: [currentUser.id, otherUserId],
      orderId,
    };
    setData(d => ({ ...d, conversations: [...d.conversations, newConv] }));
    return newConv.id;
  };

  const saveCakeProject = (project: Omit<CakeProject, 'id' | 'userId' | 'createdAt'>) => {
    if (!currentUser) return;
    const newProject: CakeProject = {
      ...project,
      id: 'cp' + Date.now(),
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    setData(d => ({ ...d, cakeProjects: [...d.cakeProjects, newProject] }));
  };

  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>) => {
    if (!currentUser) return;
    const newProduct: Product = {
      ...product,
      id: 'p' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
      rating: 0,
      reviewsCount: 0,
    };
    setData(d => ({ ...d, products: [...d.products, newProduct] }));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe: Recipe = { ...recipe, id: 'r' + Date.now() };
    setData(d => ({ ...d, recipes: [...d.recipes, newRecipe] }));
  };

  const updateInventory = (itemId: string, delta: number) => {
    setData(d => ({
      ...d,
      inventory: d.inventory.map(i => i.id === itemId ? { ...i, stock: Math.max(0, i.stock + delta) } : i)
    }));
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = { ...event, id: 'e' + Date.now() };
    setData(d => ({ ...d, events: [...d.events, newEvent] }));
  };

  const toggleTask = (eventId: string, taskId: string) => {
    setData(d => ({
      ...d,
      events: d.events.map(e => e.id === eventId ? {
        ...e, tasks: e.tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t)
      } : e)
    }));
  };

  return (
    <AppCtx.Provider value={{
      ...data, currentUser,
      login, register, logout,
      addToCart, removeFromCart, clearCart, checkout,
      updateOrderStatus, sendMessage, createConversation,
      saveCakeProject, addProduct, addRecipe, updateInventory,
      addEvent, toggleTask,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

// ==================== HEADER ====================
function Header() {
  const { currentUser, logout, cart } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);
  const isDashboard = location.pathname.startsWith('/dashboard');

  const roleNames: Record<Role, string> = {
    guest: 'Гость', client: 'Клиент', confectioner: 'Кондитер', supplier: 'Поставщик',
    decorator: 'Декоратор', animator: 'Аниматор', organizer: 'Организатор',
    operator: 'Оператор', support: 'Поддержка', moderator: 'Модератор',
    admin: 'Администратор', superadmin: 'Super Admin'
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="font-display text-xl font-bold text-stone-800 hidden sm:block">Conditera</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5">
          <Link to="/" className={`text-sm font-medium ${location.pathname === '/' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Главная</Link>
          <Link to="/catalog" className={`text-sm font-medium ${location.pathname.startsWith('/catalog') ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Каталог</Link>
          <Link to="/constructor" className={`text-sm font-medium ${location.pathname === '/constructor' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Конструктор</Link>
          <Link to="/events" className={`text-sm font-medium ${location.pathname === '/events' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Мероприятия</Link>
          <Link to="/b2b" className={`text-sm font-medium ${location.pathname === '/b2b' ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Партнёрам</Link>
          {currentUser && (
            <Link to="/dashboard" className={`text-sm font-medium ${isDashboard ? 'text-rose-600' : 'text-stone-600 hover:text-rose-600'}`}>Кабинет</Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" className="p-2 hover:bg-stone-100 rounded-full relative">
            <ShoppingCart className="w-5 h-5 text-stone-600" />
            {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-rose-600 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{cartCount}</span>}
          </Link>

          {currentUser ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-stone-100">
                <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{currentUser.name.charAt(0)}</span>
                </div>
                <span className="text-sm font-medium hidden sm:block text-stone-700">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-stone-500" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-stone-200">
                    <p className="text-sm font-semibold text-stone-800">{currentUser.name}</p>
                    <p className="text-xs text-stone-500">{currentUser.email}</p>
                    <p className="text-xs text-rose-600 mt-1">{roleNames[currentUser.role]}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Мой кабинет</Link>
                  <Link to="/chat" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Сообщения</Link>
                  <Link to="/projects" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm hover:bg-stone-50 text-stone-700">Мои проекты</Link>
                  <hr className="my-1 border-stone-200" />
                  <button onClick={() => { logout(); navigate('/'); setProfileOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-stone-50 flex items-center gap-2">
                    <LogOut className="w-4 h-4" /> Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700">Войти</Link>
          )}

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-stone-200 py-3 px-4 animate-fade-in">
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Главная</Link>
            <Link to="/catalog" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Каталог</Link>
            <Link to="/constructor" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Конструктор</Link>
            <Link to="/events" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Мероприятия</Link>
            <Link to="/b2b" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Партнёрам</Link>
            {currentUser && <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm hover:bg-stone-100">Кабинет</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}

// ==================== FOOTER ====================
function Footer() {
  return (
    <footer className="bg-stone-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold">C</span></div>
              <span className="font-display text-lg font-bold">Conditera</span>
            </div>
            <p className="text-sm text-stone-400">Цифровая экосистема для кондитерской индустрии</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Клиентам</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/catalog" className="hover:text-white">Каталог</Link></li>
              <li><Link to="/constructor" className="hover:text-white">Конструктор торта</Link></li>
              <li><Link to="/events" className="hover:text-white">Мероприятия</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Партнёрам</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link to="/auth" className="hover:text-white">Стать кондитером</Link></li>
              <li><Link to="/b2b" className="hover:text-white">B2B</Link></li>
              <li><Link to="/auth" className="hover:text-white">Стать поставщиком</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm">Платформа</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><a href="#" className="hover:text-white">О проекте</a></li>
              <li><a href="#" className="hover:text-white">Поддержка</a></li>
              <li><a href="#" className="hover:text-white">Условия</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-700 mt-8 pt-8 text-center text-xs text-stone-500">
          © 2026 Conditera Next · Демо-версия с persistence в localStorage
        </div>
      </div>
    </footer>
  );
}

// ==================== DASHBOARD SIDEBAR ====================
function DashboardSidebar() {
  const { currentUser } = useApp();
  const location = useLocation();

  const menus: Record<string, { to: string; label: string; icon: React.ReactNode }[]> = {
    confectioner: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Товары', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/recipes', label: 'Рецептуры', icon: <FileText className="w-4 h-4" /> },
      { to: '/dashboard/inventory', label: 'Склад', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
      { to: '/dashboard/customers', label: 'Клиенты', icon: <Users className="w-4 h-4" /> },
      { to: '/dashboard/production', label: 'Производство', icon: <CalendarDays className="w-4 h-4" /> },
    ],
    client: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Мои заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/favorites', label: 'Избранное', icon: <Heart className="w-4 h-4" /> },
      { to: '/dashboard/profile', label: 'Профиль', icon: <User className="w-4 h-4" /> },
    ],
    supplier: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Каталог', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
    ],
    organizer: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/events', label: 'Мероприятия', icon: <CalendarDays className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
    ],
    animator: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Бронирования', icon: <CalendarDays className="w-4 h-4" /> },
      { to: '/dashboard/finance', label: 'Финансы', icon: <DollarSign className="w-4 h-4" /> },
    ],
    decorator: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/products', label: 'Товары', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Заказы', icon: <Package className="w-4 h-4" /> },
    ],
    admin: [
      { to: '/dashboard', label: 'Обзор', icon: <Home className="w-4 h-4" /> },
      { to: '/dashboard/users', label: 'Пользователи', icon: <Users2 className="w-4 h-4" /> },
      { to: '/dashboard/orders', label: 'Все заказы', icon: <Package className="w-4 h-4" /> },
      { to: '/dashboard/moderation', label: 'Модерация', icon: <Shield className="w-4 h-4" /> },
      { to: '/dashboard/analytics', label: 'Аналитика', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  };

  const role = currentUser?.role || 'client';
  const items = menus[role] || menus.client;

  return (
    <aside className="w-64 bg-white border-r border-stone-200 min-h-full hidden lg:block">
      <nav className="p-3 space-y-0.5">
        {items.map(item => (
          <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === item.to ? 'bg-rose-50 text-rose-600' : 'text-stone-600 hover:bg-stone-50'}`}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <hr className="my-3 border-stone-200" />
        <Link to="/chat" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${location.pathname === '/chat' ? 'bg-rose-50 text-rose-600' : 'text-stone-600 hover:bg-stone-50'}`}>
          <MessageCircle className="w-4 h-4" /> Сообщения
        </Link>
      </nav>
    </aside>
  );
}

// ==================== ГЛАВНАЯ СТРАНИЦА ====================
function HomePage() {
  const { products } = useApp();
  const navigate = useNavigate();
  const featured = products.filter(p => p.status === 'published' && p.available).slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-stone-50 via-rose-50/30 to-stone-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-medium mb-4">
                <Sparkles className="w-3 h-3" /> Экосистема для кондитеров
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight">
                Торты, десерты<br />и услуги для<br />вашего праздника
              </h1>
              <p className="mt-6 text-lg text-stone-600 leading-relaxed max-w-lg">
                Закажите уникальный торт у проверенного кондитера, спланируйте мероприятие, найдите аниматоров и декор — всё в одной платформе.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigate('/catalog')} className="bg-rose-600 text-white px-8 py-4 rounded-xl font-medium hover:bg-rose-700 shadow-lg shadow-rose-200 flex items-center justify-center gap-2">
                  Найти торт <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => navigate('/constructor')} className="bg-white text-stone-800 px-8 py-4 rounded-xl font-medium hover:bg-stone-50 border border-stone-300 flex items-center justify-center gap-2">
                  <Palette className="w-4 h-4" /> Конструктор торта
                </button>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { emoji: '🎂', title: 'Торты на заказ', price: 'от 2 200 ₽' },
                { emoji: '🧁', title: 'Макаруны', price: 'от 1 800 ₽' },
                { emoji: '💒', title: 'Свадебные', price: 'от 8 000 ₽' },
                { emoji: '🦄', title: 'Детские', price: 'от 3 500 ₽' },
              ].map((item, i) => (
                <div key={i} className={`bg-white rounded-2xl p-6 shadow-lg border border-stone-200 ${i % 2 ? 'mt-8' : ''}`}>
                  <div className="text-5xl mb-3">{item.emoji}</div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-stone-500 mt-1">{item.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-stone-800 mb-8">Направления экосистемы</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: <Cake className="w-6 h-6" />, title: 'Торты', color: 'bg-rose-50 text-rose-600' },
            { icon: <Gift className="w-6 h-6" />, title: 'Декор', color: 'bg-purple-50 text-purple-600' },
            { icon: <CalendarDays className="w-6 h-6" />, title: 'Мероприятия', color: 'bg-amber-50 text-amber-600' },
            { icon: <Music className="w-6 h-6" />, title: 'Аниматоры', color: 'bg-blue-50 text-blue-600' },
            { icon: <Flower className="w-6 h-6" />, title: 'Флористы', color: 'bg-pink-50 text-pink-600' },
            { icon: <Camera className="w-6 h-6" />, title: 'Фотографы', color: 'bg-emerald-50 text-emerald-600' },
          ].map((item, i) => (
            <Link key={i} to="/catalog" className="group bg-white rounded-xl p-5 border border-stone-200 hover:border-rose-300 hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>{item.icon}</div>
              <p className="font-medium text-sm group-hover:text-rose-600">{item.title}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-stone-800">Популярные торты</h2>
          <Link to="/catalog" className="text-rose-600 text-sm font-medium hover:underline flex items-center gap-1">Все <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Преимущества */}
      <section className="bg-white border-y border-stone-200 py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl font-bold text-stone-800 text-center mb-12">Почему Conditera</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: 'Проверенные кондитеры', desc: 'Модерация и верификация всех продавцов' },
              { icon: <Sparkles className="w-6 h-6" />, title: 'Уникальные рецепты', desc: 'Авторские торты от лучших мастеров' },
              { icon: <Users className="w-6 h-6" />, title: 'Прямое общение', desc: 'Чат напрямую с кондитером' },
              { icon: <ChefHat className="w-6 h-6" />, title: 'Полный цикл', desc: 'От торта до оформления мероприятия' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-rose-600">{item.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA для кондитеров */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-stone-800 to-stone-700 rounded-3xl p-8 sm:p-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="font-display text-3xl font-bold mb-4">Вы кондитер? Присоединяйтесь</h2>
              <p className="text-stone-300 leading-relaxed mb-6">
                Получайте заказы, управляйте рецептами и себестоимостью, ведите склад и общайтесь с клиентами. AI-помощник упростит рутину.
              </p>
              <Link to="/auth" className="inline-block bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-500">Стать кондитером</Link>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: '📋', title: 'Управление заказами' },
                { icon: '📖', title: 'Рецепты и себестоимость' },
                { icon: '📦', title: 'Склад и ингредиенты' },
                { icon: '💰', title: 'Финансы и аналитика' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4">
                  <p className="text-2xl">{item.icon}</p>
                  <p className="text-sm mt-2">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Cake({ className }: { className?: string }) {
  return <span className={className}>🎂</span>;
}

// ==================== КАРТОЧКА ТОВАРА ====================
function ProductCard({ product }: { product: Product }) {
  const { addToCart, users } = useApp();
  const seller = users.find(u => u.id === product.sellerId);

  return (
    <Link to={`/product/${product.id}`} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:shadow-lg transition-all">
      <div className="aspect-[4/3] bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center">
        <span className="text-7xl group-hover:scale-110 transition-transform">{product.images[0]}</span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full text-stone-600">{product.category}</span>
          {product.rating > 0 && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3 h-3 fill-current" /> {product.rating}</span>}
        </div>
        <h3 className="font-semibold text-stone-800 group-hover:text-rose-600">{product.name}</h3>
        <p className="text-sm text-stone-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-lg font-bold">{product.price.toLocaleString()} ₽</span>
            {product.priceFrom && <span className="text-xs text-stone-500 ml-1">от</span>}
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-500"><Clock className="w-3 h-3" /> {product.prepTime}</div>
        </div>
        <p className="text-xs text-stone-500 mt-2">{seller?.name} · {product.weight}</p>
      </div>
    </Link>
  );
}

// ==================== КАТАЛОГ ====================
function CatalogPage() {
  const { products } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Все');
  const [sort, setSort] = useState('popular');
  const categories = ['Все', 'Торты', 'Пирожные', 'Свадебные', 'Детские', 'Декор'];

  const filtered = useMemo(() => {
    let result = products.filter(p => p.status === 'published');
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'Все') result = result.filter(p => p.category === category);
    if (sort === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Каталог</h1>
      <p className="text-stone-600 mb-8">Торты, десерты, декор и услуги</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Поиск..." className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm" />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="px-4 py-3 bg-white rounded-xl border border-stone-200 text-sm">
          <option value="popular">По популярности</option>
          <option value="price_asc">Цена ↑</option>
          <option value="price_desc">Цена ↓</option>
          <option value="rating">По рейтингу</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium ${category === cat ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-rose-300'}`}>{cat}</button>
        ))}
      </div>

      <p className="text-sm text-stone-500 mb-4">Найдено: {filtered.length}</p>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-stone-800 mb-2">Ничего не найдено</h3>
          <p className="text-stone-500">Попробуйте изменить параметры поиска</p>
        </div>
      )}
    </div>
  );
}

// ==================== СТРАНИЦА ТОВАРА ====================
function ProductPage() {
  const { id } = useParams();
  const { products, users, addToCart } = useApp();
  const product = products.find(p => p.id === id);
  const [added, setAdded] = useState(false);

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-16 text-center"><h2>Товар не найден</h2><Link to="/catalog" className="text-rose-600">← В каталог</Link></div>;

  const seller = users.find(u => u.id === product.sellerId);
  const handleAdd = () => { addToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/catalog" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-rose-600 mb-6"><ArrowLeft className="w-4 h-4" /> В каталог</Link>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl aspect-square flex items-center justify-center">
          <span className="text-[180px]">{product.images[0]}</span>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-stone-100 px-2.5 py-1 rounded-full text-stone-600">{product.category}</span>
            {product.rating > 0 && <span className="text-xs flex items-center gap-0.5 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> {product.rating} ({product.reviewsCount})</span>}
          </div>
          <h1 className="font-display text-3xl font-bold text-stone-800">{product.name}</h1>
          <p className="text-stone-600 mt-2">{seller?.name}</p>

          <div className="mt-6"><span className="text-3xl font-bold">{product.price.toLocaleString()} ₽</span>{product.priceFrom && <span className="text-sm text-stone-500 ml-2">минимальная цена</span>}</div>

          <p className="mt-6 text-stone-600 leading-relaxed">{product.description}</p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Вес</p><p className="font-semibold">{product.weight}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Порций</p><p className="font-semibold">{product.portions}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Срок</p><p className="font-semibold">{product.prepTime}</p></div>
            <div className="bg-stone-50 rounded-xl p-4"><p className="text-xs text-stone-500">Наличие</p><p className={`font-semibold ${product.available ? 'text-emerald-600' : 'text-rose-600'}`}>{product.available ? 'Доступен' : 'Нет'}</p></div>
          </div>

          {product.allergens.length > 0 && (
            <div className="mt-6 flex items-start gap-2 bg-amber-50 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div><p className="text-sm font-medium">Аллергены</p><p className="text-xs text-stone-600 mt-0.5">{product.allergens.join(', ')}</p></div>
            </div>
          )}

          <button onClick={handleAdd} disabled={!product.available} className={`w-full mt-8 py-4 rounded-xl font-medium flex items-center justify-center gap-2 ${product.available ? (added ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white hover:bg-rose-700') : 'bg-stone-200 text-stone-400 cursor-not-allowed'}`}>
            <ShoppingCart className="w-5 h-5" />{added ? 'Добавлено!' : 'В корзину'}
          </button>

          {seller && (
            <div className="mt-6 bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold">{seller.name.charAt(0)}</span></div>
              <div className="flex-1"><p className="font-medium text-sm">{seller.name}</p><p className="text-xs text-stone-500">{seller.city}</p></div>
              <Link to="/chat" className="text-sm text-rose-600 font-medium">Написать</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== КОНСТРУКТОР ТОРТА ====================
function ConstructorPage() {
  const { currentUser, saveCakeProject } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    category: 'Торт', shape: 'Круглый', weight: '2', portions: 10,
    layers: [] as string[], filling: '', cream: '', coating: '',
    decor: [] as string[], inscription: '', colors: [] as string[],
    theme: '', deliveryDate: '', notes: '',
  });

  const prices = { base: 1500, perKg: 1200, decor: 500, coating: 800 };
  const calculatedPrice = prices.base + (Number(form.weight) * prices.perKg) + (form.decor.length * prices.decor) + (form.coating ? prices.coating : 0);

  const handleSave = () => {
    if (!currentUser) { navigate('/auth'); return; }
    saveCakeProject({ ...form, calculatedPrice });
    alert('Проект сохранён! Кондитер свяжется с вами.');
    navigate('/projects');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Конструктор торта</h1>
      <p className="text-stone-600 mb-8">Создайте торт вашей мечты — мы рассчитаем стоимость</p>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {['Категория', 'Размер', 'Начинка', 'Декор', 'Детали'].map((label, i) => (
          <button key={i} onClick={() => setStep(i + 1)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${step === i + 1 ? 'bg-rose-600 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>
            {i + 1}. {label}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6">
          {step === 1 && (
            <div>
              <h3 className="font-semibold mb-4">Категория изделия</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['Торт', 'Капкейки', 'Макаруны', 'Чизкейк', 'Муссовый', 'Безе'].map(cat => (
                  <button key={cat} onClick={() => setForm({ ...form, category: cat })} className={`p-4 rounded-xl border text-sm font-medium ${form.category === cat ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-stone-200 hover:border-rose-300'}`}>{cat}</button>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3 className="font-semibold mb-4">Форма и размер</h3>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['Круглый', 'Квадратный', 'Сердце'].map(s => (
                  <button key={s} onClick={() => setForm({ ...form, shape: s })} className={`p-4 rounded-xl border text-sm ${form.shape === s ? 'border-rose-600 bg-rose-50 text-rose-600' : 'border-stone-200'}`}>{s}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Вес (кг)</label><input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
                <div><label className="text-sm font-medium mb-1 block">Порций</label><input type="number" value={form.portions} onChange={(e) => setForm({ ...form, portions: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <h3 className="font-semibold mb-4">Начинка и крем</h3>
              <div className="space-y-4">
                <div><label className="text-sm font-medium mb-2 block">Коржи</label>
                  <div className="flex flex-wrap gap-2">
                    {['Медовый', 'Шоколадный', 'Ванильный', 'Красный бархат', 'Морковный'].map(l => (
                      <button key={l} onClick={() => setForm({ ...form, layers: form.layers.includes(l) ? form.layers.filter(x => x !== l) : [...form.layers, l] })} className={`px-3 py-1.5 rounded-full text-xs ${form.layers.includes(l) ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>{l}</button>
                    ))}
                  </div>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Начинка</label>
                  <select value={form.filling} onChange={(e) => setForm({ ...form, filling: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                    <option value="">Выберите...</option>
                    <option>Ягодная</option><option>Шоколадная</option><option>Карамельная</option><option>Фисташковая</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Крем</label>
                  <select value={form.cream} onChange={(e) => setForm({ ...form, cream: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                    <option value="">Выберите...</option>
                    <option>Сметанный</option><option>Маскарпоне</option><option>Шocolate ganache</option><option>Сливочный</option>
                  </select>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Покрытие</label>
                  <select value={form.coating} onChange={(e) => setForm({ ...form, coating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200">
                    <option value="">Без покрытия</option>
                    <option>Крем-чиз</option><option>Шоколадная глазурь</option><option>Мастика</option>
                  </select>
                </div>
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              <h3 className="font-semibold mb-4">Декор</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Живые цветы', 'Ягоды', 'Макаронс', 'Шоколадный декор', 'Безе', 'Топпер', 'Надпись', 'Фигурки'].map(d => (
                  <button key={d} onClick={() => setForm({ ...form, decor: form.decor.includes(d) ? form.decor.filter(x => x !== d) : [...form.decor, d] })} className={`px-3 py-1.5 rounded-full text-xs ${form.decor.includes(d) ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>{d}</button>
                ))}
              </div>
              <div><label className="text-sm font-medium mb-1 block">Надпись</label><input type="text" value={form.inscription} onChange={(e) => setForm({ ...form, inscription: e.target.value })} placeholder="С Днём Рождения!" className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
            </div>
          )}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Детали заказа</h3>
              <div><label className="text-sm font-medium mb-1 block">Дата доставки</label><input type="date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-stone-200" /></div>
              <div><label className="text-sm font-medium mb-1 block">Комментарий</label><textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-lg border border-stone-200 resize-none" /></div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && <button onClick={() => setStep(step - 1)} className="px-5 py-2.5 rounded-lg border border-stone-200 text-sm font-medium">← Назад</button>}
            {step < 5 ? <button onClick={() => setStep(step + 1)} className="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">Далее →</button> : <button onClick={handleSave} className="px-5 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700">Сохранить проект</button>}
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-50 to-stone-50 rounded-2xl border border-rose-200 p-6 h-fit sticky top-24">
          <h3 className="font-semibold mb-4">Ваш торт</h3>
          <div className="text-6xl text-center mb-4">🎂</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-stone-500">Категория:</span><span className="font-medium">{form.category}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Форма:</span><span className="font-medium">{form.shape}</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Вес:</span><span className="font-medium">{form.weight} кг</span></div>
            <div className="flex justify-between"><span className="text-stone-500">Порций:</span><span className="font-medium">{form.portions}</span></div>
            {form.layers.length > 0 && <div className="flex justify-between"><span className="text-stone-500">Коржи:</span><span className="font-medium text-right">{form.layers.join(', ')}</span></div>}
            {form.filling && <div className="flex justify-between"><span className="text-stone-500">Начинка:</span><span className="font-medium">{form.filling}</span></div>}
            {form.cream && <div className="flex justify-between"><span className="text-stone-500">Крем:</span><span className="font-medium">{form.cream}</span></div>}
            {form.decor.length > 0 && <div className="flex justify-between"><span className="text-stone-500">Декор:</span><span className="font-medium text-right">{form.decor.join(', ')}</span></div>}
          </div>
          <hr className="my-4 border-rose-200" />
          <div className="flex justify-between items-center">
            <span className="text-stone-600">Итого:</span>
            <span className="text-2xl font-bold text-rose-600">{calculatedPrice.toLocaleString()} ₽</span>
          </div>
          <p className="text-xs text-stone-500 mt-2">Точная цена после согласования с кондитером</p>
        </div>
      </div>
    </div>
  );
}

// ==================== АВТОРИЗАЦИЯ ====================
function AuthPage() {
  const { login, register } = useApp();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('client');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (mode === 'login') {
      if (login(email, password)) navigate('/');
      else setError('Пользователь не найден. Попробуйте: anna@conditera.ru (кондитер), maria@mail.ru (клиент), admin@conditera.ru (админ)');
    } else {
      if (!name || !email) { setError('Заполните все поля'); return; }
      if (register(email, name, password, role)) navigate('/');
      else setError('Email уже зарегистрирован');
    }
  };

  const quickLogin = (email: string) => {
    if (login(email, '')) navigate('/');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4"><span className="text-white font-bold text-3xl">C</span></div>
          <h1 className="font-display text-2xl font-bold text-stone-800">{mode === 'login' ? 'Вход в Conditera' : 'Регистрация'}</h1>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="space-y-2 mb-4">
            <p className="text-xs text-stone-500 mb-2">Быстрый вход (демо):</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin('maria@mail.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">👤 Клиент</button>
              <button onClick={() => quickLogin('anna@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🎂 Кондитер</button>
              <button onClick={() => quickLogin('supplier@moloko.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">📦 Поставщик</button>
              <button onClick={() => quickLogin('admin@conditera.ru')} className="px-3 py-2 bg-stone-50 rounded-lg text-xs hover:bg-stone-100">🛡️ Админ</button>
            </div>
          </div>

          <div className="relative my-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200"></div></div><div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-stone-500">или</span></div></div>

          {error && <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Имя" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm">
                  <option value="client">Клиент</option>
                  <option value="confectioner">Кондитер</option>
                  <option value="supplier">Поставщик</option>
                  <option value="decorator">Магазин декора</option>
                  <option value="animator">Аниматор</option>
                  <option value="organizer">Организатор</option>
                </select>
              </>
            )}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" className="w-full px-4 py-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
            <button type="submit" className="w-full bg-rose-600 text-white py-3 rounded-xl font-medium hover:bg-rose-700">{mode === 'login' ? 'Войти' : 'Создать аккаунт'}</button>
          </form>

          <p className="text-sm text-stone-500 text-center mt-4">
            {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-rose-600 font-medium hover:underline">{mode === 'login' ? 'Регистрация' : 'Войти'}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ==================== КОРЗИНА ====================
function CartPage() {
  const { cart, removeFromCart, clearCart, checkout, currentUser } = useApp();
  const navigate = useNavigate();
  const [notes, setNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  if (cart.length === 0) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-xl font-semibold mb-2">Корзина пуста</h2>
      <Link to="/catalog" className="inline-flex items-center gap-2 bg-rose-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-rose-700 mt-4">В каталог</Link>
    </div>
  );

  const handleCheckout = () => {
    if (!currentUser) { navigate('/auth'); return; }
    if (!deliveryDate) { alert('Укажите дату доставки'); return; }
    const orderId = checkout(notes, deliveryDate);
    if (orderId) { alert(`Заказ ${orderId} оформлен!`); navigate('/dashboard/orders'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Корзина</h1>
      <div className="space-y-3 mb-6">
        {cart.map(item => (
          <div key={item.productId} className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center text-2xl">🎂</div>
            <div className="flex-1"><h3 className="font-medium text-sm">{item.name}</h3><p className="text-xs text-stone-500">Количество: {item.qty}</p></div>
            <div className="text-right"><p className="font-bold">{(item.price * item.qty).toLocaleString()} ₽</p><button onClick={() => removeFromCart(item.productId)} className="text-xs text-rose-600 hover:underline mt-1">Удалить</button></div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
        <div><label className="text-sm font-medium mb-1 block">Дата доставки</label><input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm" /></div>
        <div><label className="text-sm font-medium mb-1 block">Комментарий</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none" /></div>
        <div className="flex justify-between items-center pt-3 border-t border-stone-200"><span className="text-stone-500">Итого:</span><span className="text-2xl font-bold">{total.toLocaleString()} ₽</span></div>
        <button onClick={handleCheckout} className="w-full bg-rose-600 text-white py-3.5 rounded-xl font-medium hover:bg-rose-700">Оформить заказ</button>
        <button onClick={clearCart} className="w-full py-2 text-sm text-stone-500 hover:text-rose-600">Очистить корзину</button>
      </div>
    </div>
  );
}

// ==================== ЧАТ ====================
function ChatPage() {
  const { currentUser, conversations, messages, users, sendMessage, createConversation } = useApp();
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [input, setInput] = useState('');

  if (!currentUser) return <div className="max-w-3xl mx-auto px-4 py-16 text-center"><p>Войдите, чтобы общаться</p><Link to="/auth" className="text-rose-600">Войти</Link></div>;

  const myConvs = conversations.filter(c => c.participants.includes(currentUser.id));
  const activeMessages = activeConv ? messages.filter(m => m.conversationId === activeConv) : [];
  const activeConvData = conversations.find(c => c.id === activeConv);
  const otherUserId = activeConvData?.participants.find(p => p !== currentUser.id);
  const otherUser = otherUserId ? users.find(u => u.id === otherUserId) : null;

  const handleSend = () => {
    if (!input.trim() || !activeConv) return;
    sendMessage(activeConv, input.trim());
    setInput('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold mb-6">Сообщения</h1>
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[600px]">
        <div className="border-r border-stone-200 overflow-y-auto">
          {myConvs.length === 0 ? (
            <div className="p-6 text-center text-sm text-stone-500">Нет диалогов</div>
          ) : myConvs.map(conv => {
            const other = users.find(u => u.id === conv.participants.find(p => p !== currentUser.id));
            return (
              <button key={conv.id} onClick={() => setActiveConv(conv.id)} className={`w-full text-left p-4 border-b border-stone-100 hover:bg-stone-50 ${activeConv === conv.id ? 'bg-rose-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{other?.name.charAt(0)}</span></div>
                  <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{other?.name}</p><p className="text-xs text-stone-500 truncate">{conv.lastMessage}</p></div>
                  <span className="text-[10px] text-stone-400">{conv.lastTime}</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="md:col-span-2 flex flex-col">
          {activeConv ? (
            <>
              <div className="p-4 border-b border-stone-200 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{otherUser?.name.charAt(0)}</span></div>
                <div><p className="font-medium text-sm">{otherUser?.name}</p><p className="text-xs text-emerald-600">● Онлайн</p></div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.senderId === currentUser.id ? 'bg-rose-600 text-white' : 'bg-stone-100'}`}>
                      <p className="text-sm">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.senderId === currentUser.id ? 'text-white/70' : 'text-stone-500'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-stone-200">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Сообщение..." className="flex-1 px-4 py-2.5 bg-stone-50 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300" />
                  <button onClick={handleSend} disabled={!input.trim()} className="p-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:opacity-50"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">Выберите диалог</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== B2B ====================
function B2BPage() {
  const { users } = useApp();
  const suppliers = users.filter(u => ['supplier', 'decorator'].includes(u.role));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-stone-800 mb-2">Партнёрам</h1>
      <p className="text-stone-600 mb-8">Поставщики, декор, оборудование и услуги</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map(p => (
          <div key={p.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Briefcase className="w-5 h-5 text-purple-600" /></div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-600">Активен</span>
            </div>
            <h3 className="font-semibold text-sm">{p.name}</h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{p.city}</p>
            <p className="text-xs text-stone-500 mt-2">{p.about}</p>
            <p className="text-xs text-rose-600 mt-3">{p.role === 'supplier' ? 'Поставщик' : 'Магазин декора'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== МЕРОПРИЯТИЯ ====================
function EventsPage() {
  const { events, currentUser, addEvent, toggleTask } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', date: '', location: '', budget: 0 });

  const handleCreate = () => {
    if (!currentUser || !form.name || !form.date) return;
    addEvent({ organizerId: currentUser.id, ...form, status: 'planning', tasks: [] });
    setShowForm(false);
    setForm({ name: '', date: '', location: '', budget: 0 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl font-bold text-stone-800">Мероприятия</h1><p className="text-stone-600 mt-1">Планируйте и управляйте событиями</p></div>
        {currentUser && <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Создать</button>}
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Место" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} placeholder="Бюджет" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
          </div>
          <div className="flex gap-3 mt-4"><button onClick={handleCreate} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Создать</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="space-y-6">
        {events.map(event => {
          const doneTasks = event.tasks.filter(t => t.done).length;
          const progress = event.tasks.length > 0 ? Math.round((doneTasks / event.tasks.length) * 100) : 0;
          return (
            <div key={event.id} className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="font-display text-xl font-bold">{event.name}</h2><div className="flex items-center gap-4 text-sm text-stone-500 mt-1"><span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {event.date}</span><span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location}</span><span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {event.budget.toLocaleString()} ₽</span></div></div>
                <div className="text-right"><p className="text-2xl font-bold">{progress}%</p><p className="text-xs text-stone-500">{doneTasks} из {event.tasks.length}</p></div>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 mb-4"><div className="bg-rose-600 h-2 rounded-full" style={{ width: `${progress}%` }} /></div>
              <div className="space-y-2">
                {event.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-stone-50">
                    <button onClick={() => toggleTask(event.id, task.id)}>{task.done ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Circle className="w-5 h-5 text-stone-400" />}</button>
                    <span className={`text-sm flex-1 ${task.done ? 'line-through text-stone-400' : ''}`}>{task.title}</span>
                    {task.assignee && <span className="text-xs bg-stone-100 px-2 py-0.5 rounded-full">{task.assignee}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {events.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📅</div><h3 className="text-lg font-semibold mb-2">Нет мероприятий</h3><p className="text-stone-500">Создайте первое мероприятие</p></div>}
      </div>
    </div>
  );
}

// ==================== DASHBOARD ====================
function DashboardPage() {
  const { currentUser, orders, products, inventory, recipes, users } = useApp();
  if (!currentUser) return <div className="p-6 text-center"><Link to="/auth" className="text-rose-600">Войти</Link></div>;

  const role = currentUser.role;

  if (role === 'confectioner') {
    const myOrders = orders.filter(o => o.sellerId === currentUser.id);
    const newOrders = myOrders.filter(o => o.status === 'new');
    const activeOrders = myOrders.filter(o => ['accepted', 'in_production'].includes(o.status));
    const revenue = myOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
    const lowStock = inventory.filter(i => i.ownerId === currentUser.id && i.stock <= i.minStock);

    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Добро пожаловать, {currentUser.name.split(' ')[0]}!</h1>
        <p className="text-stone-600 text-sm mb-6">Обзор вашего бизнеса</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-3"><Package className="w-5 h-5 text-rose-600" /></div><p className="text-2xl font-bold">{newOrders.length}</p><p className="text-xs text-stone-500">Новые заказы</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-amber-600" /></div><p className="text-2xl font-bold">{activeOrders.length}</p><p className="text-xs text-stone-500">В производстве</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3"><DollarSign className="w-5 h-5 text-emerald-600" /></div><p className="text-2xl font-bold">{revenue.toLocaleString()} ₽</p><p className="text-xs text-stone-500">Выручка</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3"><Package className="w-5 h-5 text-purple-600" /></div><p className="text-2xl font-bold">{products.filter(p => p.sellerId === currentUser.id && p.status === 'published').length}</p><p className="text-xs text-stone-500">Товаров</p></div>
        </div>
        {lowStock.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" /><div><p className="text-sm font-medium">Дефицит ингредиентов</p><p className="text-xs text-stone-600 mt-1">{lowStock.map(i => i.name).join(', ')}</p></div></div>}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Последние заказы</h2>
          <div className="space-y-2">
            {myOrders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{o.history[o.history.length - 1].date}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'new' ? 'bg-rose-100 text-rose-600' : o.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (role === 'client') {
    const myOrders = orders.filter(o => o.buyerId === currentUser.id);
    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Мой кабинет</h1>
        <p className="text-stone-600 text-sm mb-6">{currentUser.name}</p>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.length}</p><p className="text-xs text-stone-500">Заказов</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}</p><p className="text-xs text-stone-500">Активных</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{myOrders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-xs text-stone-500">Потрачено</p></div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Мои заказы</h2>
          <div className="space-y-2">
            {myOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{o.id} · {o.deliveryDate}</p></div>
                <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{o.status}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div className="p-6">
        <h1 className="font-display text-2xl font-bold mb-2">Админ-панель</h1>
        <p className="text-stone-600 text-sm mb-6">Управление платформой</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-stone-500">Пользователей</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{products.length}</p><p className="text-xs text-stone-500">Товаров</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{orders.length}</p><p className="text-xs text-stone-500">Заказов</p></div>
          <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-2xl font-bold">{orders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-xs text-stone-500">Оборот</p></div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-semibold mb-4">Последние заказы</h2>
          <div className="space-y-2">
            {orders.slice(0, 10).map(o => {
              const buyer = users.find(u => u.id === o.buyerId);
              return (
                <div key={o.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-stone-50">
                  <div><p className="text-sm font-medium">{o.productName}</p><p className="text-xs text-stone-500">{buyer?.name} · {o.id}</p></div>
                  <div className="text-right"><p className="text-sm font-semibold">{o.total.toLocaleString()} ₽</p><span className="text-xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">{o.status}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Остальные роли
  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-2">Кабинет</h1>
      <p className="text-stone-600 text-sm mb-6">{currentUser.name} · {currentUser.role}</p>
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <div className="text-5xl mb-4">👋</div>
        <h3 className="font-semibold mb-2">Добро пожаловать!</h3>
        <p className="text-sm text-stone-500">Ваш кабинет в разработке. Используйте боковое меню для навигации.</p>
      </div>
    </div>
  );
}

// ==================== DASHBOARD ORDERS ====================
function DashboardOrdersPage() {
  const { currentUser, orders, users, updateOrderStatus } = useApp();
  if (!currentUser) return null;

  const myOrders = currentUser.role === 'confectioner' || currentUser.role === 'admin'
    ? orders.filter(o => currentUser.role === 'admin' || o.sellerId === currentUser.id)
    : orders.filter(o => o.buyerId === currentUser.id);

  const statusLabels: Record<string, string> = { new: 'Новый', accepted: 'Принят', in_production: 'Готовится', ready: 'Готов', delivered: 'Доставлен', completed: 'Завершён', cancelled: 'Отменён' };

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Заказы</h1>
      <div className="space-y-3">
        {myOrders.map(order => {
          const buyer = users.find(u => u.id === order.buyerId);
          return (
            <div key={order.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-stone-500">{order.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${order.status === 'new' ? 'bg-rose-100 text-rose-600' : order.status === 'completed' ? 'bg-stone-100 text-stone-600' : 'bg-amber-100 text-amber-600'}`}>{statusLabels[order.status]}</span>
                  </div>
                  <h3 className="font-semibold">{order.productName}</h3>
                  <p className="text-sm text-stone-500">{buyer?.name} · Доставка: {order.deliveryDate}</p>
                  {order.notes && <p className="text-xs text-stone-500 italic mt-1">«{order.notes}»</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-lg font-bold">{order.total.toLocaleString()} ₽</span>
                  {currentUser.role === 'confectioner' && order.status === 'new' && (
                    <div className="flex gap-2">
                      <button onClick={() => updateOrderStatus(order.id, 'accepted')} className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg">Принять</button>
                      <button onClick={() => updateOrderStatus(order.id, 'cancelled')} className="px-3 py-1.5 bg-stone-200 text-stone-700 text-xs rounded-lg">Отклонить</button>
                    </div>
                  )}
                  {currentUser.role === 'confectioner' && order.status === 'accepted' && <button onClick={() => updateOrderStatus(order.id, 'in_production')} className="px-3 py-1.5 bg-amber-500 text-white text-xs rounded-lg">Начать готовить</button>}
                  {currentUser.role === 'confectioner' && order.status === 'in_production' && <button onClick={() => updateOrderStatus(order.id, 'ready')} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg">Готов</button>}
                  {currentUser.role === 'confectioner' && order.status === 'ready' && <button onClick={() => updateOrderStatus(order.id, 'completed')} className="px-3 py-1.5 bg-stone-800 text-white text-xs rounded-lg">Выдан</button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {myOrders.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📋</div><h3 className="text-lg font-semibold mb-2">Нет заказов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD PRODUCTS ====================
function DashboardProductsPage() {
  const { currentUser, products, addProduct } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', category: 'Торты', price: 0, weight: '', portions: 1, prepTime: '', images: ['🎂'], allergens: [] as string[], available: true, status: 'published' as const, priceFrom: false });

  if (!currentUser) return null;
  const myProducts = products.filter(p => p.sellerId === currentUser.id);

  const handleAdd = () => {
    if (!form.name || !form.price) return;
    addProduct({ ...form, sellerId: currentUser.id });
    setShowForm(false);
    setForm({ name: '', description: '', category: 'Торты', price: 0, weight: '', portions: 1, prepTime: '', images: ['🎂'], allergens: [], available: true, status: 'published', priceFrom: false });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Мои товары</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Добавить</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый товар</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-lg border border-stone-200 text-sm">
              <option>Торты</option><option>Пирожные</option><option>Свадебные</option><option>Детские</option><option>Декор</option>
            </select>
            <input type="number" value={form.price || ''} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Цена" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="text" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} placeholder="Вес" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Описание" rows={2} className="sm:col-span-2 px-3 py-2 rounded-lg border border-stone-200 text-sm resize-none" />
          </div>
          <div className="flex gap-3 mt-4"><button onClick={handleAdd} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Сохранить</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Товар</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Категория</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Цена</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Статус</th></tr></thead>
          <tbody>
            {myProducts.map(p => (
              <tr key={p.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-50">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-xl">{p.images[0]}</div><div><p className="font-medium text-sm">{p.name}</p><p className="text-xs text-stone-500">{p.weight}</p></div></div></td>
                <td className="px-5 py-4 text-sm text-stone-500">{p.category}</td>
                <td className="px-5 py-4 text-sm font-semibold">{p.price.toLocaleString()} ₽</td>
                <td className="px-5 py-4"><span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'published' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>{p.status === 'published' ? 'Опубликован' : 'Черновик'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DASHBOARD RECIPES ====================
function DashboardRecipesPage() {
  const { currentUser, recipes, addRecipe } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', yield: '', ingredients: [{ name: '', amount: 0, unit: 'г', cost: 0 }], notes: '', lastModified: new Date().toISOString().split('T')[0] });

  if (!currentUser) return null;
  const myRecipes = recipes.filter(r => r.confectionerId === currentUser.id);
  const totalCost = (r: Recipe) => r.ingredients.reduce((s, i) => s + i.cost, 0);

  const handleAdd = () => {
    if (!form.name) return;
    addRecipe({ ...form, confectionerId: currentUser.id });
    setShowForm(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Рецептуры</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-rose-700"><Plus className="w-4 h-4" /> Новый рецепт</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 mb-6 animate-fade-in">
          <h3 className="font-semibold mb-4">Новый рецепт</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Название" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
            <input type="text" value={form.yield} onChange={(e) => setForm({ ...form, yield: e.target.value })} placeholder="Выход" className="px-3 py-2 rounded-lg border border-stone-200 text-sm" />
          </div>
          <div className="flex gap-3"><button onClick={handleAdd} className="bg-rose-600 text-white px-5 py-2 rounded-lg text-sm font-medium">Сохранить</button><button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg text-sm border border-stone-200">Отмена</button></div>
        </div>
      )}

      <div className="space-y-4">
        {myRecipes.map(r => (
          <div key={r.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="font-semibold">{r.name}</h3><p className="text-xs text-stone-500">Выход: {r.yield}</p></div>
              <div className="text-right"><p className="text-sm font-bold">{totalCost(r).toLocaleString()} ₽</p><p className="text-xs text-stone-500">себестоимость</p></div>
            </div>
            <table className="w-full"><tbody>{r.ingredients.map((ing, i) => <tr key={i} className="border-t border-stone-100"><td className="py-2 text-sm">{ing.name}</td><td className="py-2 text-sm text-right text-stone-500">{ing.amount} {ing.unit}</td><td className="py-2 text-sm text-right font-medium">{ing.cost} ₽</td></tr>)}</tbody></table>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DASHBOARD INVENTORY ====================
function DashboardInventoryPage() {
  const { currentUser, inventory, updateInventory } = useApp();
  if (!currentUser) return null;
  const myItems = inventory.filter(i => i.ownerId === currentUser.id);
  const lowStock = myItems.filter(i => i.stock <= i.minStock);

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Склад</h1>
      {lowStock.length > 0 && <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" /><div><p className="text-sm font-medium">Дефицит</p><p className="text-xs text-stone-600 mt-1">{lowStock.map(i => i.name).join(', ')}</p></div></div>}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Ингредиент</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Остаток</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Мин.</th><th className="text-right px-5 py-3 text-xs font-medium text-stone-500 uppercase">Действия</th></tr></thead>
          <tbody>
            {myItems.map(item => (
              <tr key={item.id} className={`border-b border-stone-200 last:border-0 ${item.stock <= item.minStock ? 'bg-rose-50' : ''}`}>
                <td className="px-5 py-3.5"><div className="flex items-center gap-2">{item.stock <= item.minStock && <AlertTriangle className="w-4 h-4 text-amber-600" />}<span className="text-sm font-medium">{item.name}</span></div></td>
                <td className="px-5 py-3.5 text-right"><span className={`text-sm font-semibold ${item.stock <= item.minStock ? 'text-rose-600' : ''}`}>{item.stock} {item.unit}</span></td>
                <td className="px-5 py-3.5 text-right text-sm text-stone-500">{item.minStock} {item.unit}</td>
                <td className="px-5 py-3.5 text-right"><div className="flex items-center justify-end gap-1"><button onClick={() => updateInventory(item.id, 1)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Поступление"><ArrowRight className="w-4 h-4 text-emerald-600 rotate-[-90deg]" /></button><button onClick={() => updateInventory(item.id, -1)} className="p-1.5 rounded-lg hover:bg-stone-100" title="Списание"><ArrowRight className="w-4 h-4 text-rose-600 rotate-90" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DASHBOARD FINANCE ====================
function DashboardFinancePage() {
  const { currentUser, orders } = useApp();
  if (!currentUser) return null;
  const myOrders = currentUser.role === 'confectioner' ? orders.filter(o => o.sellerId === currentUser.id) : orders.filter(o => o.buyerId === currentUser.id);
  const completed = myOrders.filter(o => o.status === 'completed');
  const revenue = completed.reduce((s, o) => s + o.total, 0);
  const commission = Math.round(revenue * 0.08);

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Финансы</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Выручка</p><p className="text-2xl font-bold">{revenue.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Комиссия (8%)</p><p className="text-2xl font-bold">{commission.toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">К выплате</p><p className="text-2xl font-bold text-emerald-600">{(revenue - commission).toLocaleString()} ₽</p></div>
        <div className="bg-white rounded-xl border border-stone-200 p-5"><p className="text-xs text-stone-500 mb-2">Заказов</p><p className="text-2xl font-bold">{completed.length}</p></div>
      </div>
    </div>
  );
}

// ==================== DASHBOARD CUSTOMERS ====================
function DashboardCustomersPage() {
  const { currentUser, orders, users } = useApp();
  if (!currentUser) return null;
  const myOrders = orders.filter(o => o.sellerId === currentUser.id);
  const buyerIds = [...new Set(myOrders.map(o => o.buyerId))];
  const myCustomers = buyerIds.map(id => users.find(u => u.id === id)).filter(Boolean) as User[];

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Клиенты</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {myCustomers.map(c => {
          const customerOrders = myOrders.filter(o => o.buyerId === c.id);
          return (
            <div key={c.id} className="bg-white rounded-xl border border-stone-200 p-5">
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">{c.name.charAt(0)}</span></div><div><h3 className="font-semibold text-sm">{c.name}</h3><p className="text-xs text-stone-500">{c.email}</p></div></div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-200"><div className="text-center"><p className="text-sm font-bold">{customerOrders.length}</p><p className="text-[10px] text-stone-500">заказов</p></div><div className="text-center"><p className="text-sm font-bold">{customerOrders.reduce((s, o) => s + o.total, 0).toLocaleString()} ₽</p><p className="text-[10px] text-stone-500">потрачено</p></div></div>
            </div>
          );
        })}
      </div>
      {myCustomers.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">👥</div><h3 className="text-lg font-semibold mb-2">Нет клиентов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD PRODUCTION ====================
function DashboardProductionPage() {
  const { currentUser, orders } = useApp();
  if (!currentUser) return null;
  const activeOrders = orders.filter(o => o.sellerId === currentUser.id && ['accepted', 'in_production', 'ready'].includes(o.status));

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Производственный календарь</h1>
      <div className="space-y-3">
        {activeOrders.map(o => (
          <div key={o.id} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className="flex items-center justify-between">
              <div><p className="font-semibold">{o.productName}</p><p className="text-sm text-stone-500">Доставка: {o.deliveryDate}</p></div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${o.status === 'accepted' ? 'bg-amber-100 text-amber-600' : o.status === 'in_production' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'}`}>{o.status === 'accepted' ? 'Принят' : o.status === 'in_production' ? 'Готовится' : 'Готов'}</span>
            </div>
          </div>
        ))}
      </div>
      {activeOrders.length === 0 && <div className="text-center py-16"><div className="text-5xl mb-4">📅</div><h3 className="text-lg font-semibold mb-2">Нет активных заказов</h3></div>}
    </div>
  );
}

// ==================== DASHBOARD USERS (ADMIN) ====================
function DashboardUsersPage() {
  const { users } = useApp();
  const roleNames: Record<Role, string> = { guest: 'Гость', client: 'Клиент', confectioner: 'Кондитер', supplier: 'Поставщик', decorator: 'Декоратор', animator: 'Аниматор', organizer: 'Организатор', operator: 'Оператор', support: 'Поддержка', moderator: 'Модератор', admin: 'Админ', superadmin: 'Super Admin' };

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl font-bold mb-6">Пользователи</h1>
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-stone-200 bg-stone-50"><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Имя</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Email</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Роль</th><th className="text-left px-5 py-3 text-xs font-medium text-stone-500 uppercase">Город</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-stone-200 last:border-0 hover:bg-stone-50">
                <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center"><span className="text-white font-bold text-xs">{u.name.charAt(0)}</span></div><span className="text-sm font-medium">{u.name}</span></div></td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{u.email}</td>
                <td className="px-5 py-3.5"><span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">{roleNames[u.role]}</span></td>
                <td className="px-5 py-3.5 text-sm text-stone-500">{u.city || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== ГЛАВНЫЙ APP ====================
function AppRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  if (isDashboard) {
    return (
      <>
        <Header />
        <div className="flex flex-1 min-h-[calc(100vh-64px)]">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto bg-stone-50">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/orders" element={<DashboardOrdersPage />} />
              <Route path="/dashboard/products" element={<DashboardProductsPage />} />
              <Route path="/dashboard/recipes" element={<DashboardRecipesPage />} />
              <Route path="/dashboard/inventory" element={<DashboardInventoryPage />} />
              <Route path="/dashboard/finance" element={<DashboardFinancePage />} />
              <Route path="/dashboard/customers" element={<DashboardCustomersPage />} />
              <Route path="/dashboard/production" element={<DashboardProductionPage />} />
              <Route path="/dashboard/users" element={<DashboardUsersPage />} />
              <Route path="/dashboard/favorites" element={<div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Избранное</h1><div className="text-center py-16"><div className="text-5xl mb-4">❤️</div><p className="text-stone-500">Нет избранных товаров</p></div></div>} />
              <Route path="/dashboard/profile" element={<div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Профиль</h1><p className="text-stone-500">Настройки профиля в разработке</p></div>} />
              <Route path="/dashboard/events" element={<div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Мои мероприятия</h1><p className="text-stone-500">Раздел в разработке</p></div>} />
              <Route path="/dashboard/moderation" element={<div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Модерация</h1><p className="text-stone-500">Ожидает проверки: 0 товаров</p></div>} />
              <Route path="/dashboard/analytics" element={<div className="p-6"><h1 className="font-display text-2xl font-bold mb-6">Аналитика</h1><p className="text-stone-500">Статистика платформы</p></div>} />
            </Routes>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/constructor" element={<ConstructorPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/b2b" element={<B2BPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/projects" element={<div className="max-w-7xl mx-auto px-4 py-8"><h1 className="font-display text-2xl font-bold mb-6">Мои проекты</h1><p className="text-stone-500">Сохранённые конструкторы тортов</p></div>} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-stone-50">
          <AppRoutes />
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
