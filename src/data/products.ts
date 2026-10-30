export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  seller: string;
  weight: string;
  portions: number;
  prepTime: string;
  image: string;
  rating: number;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Медовик классический',
    description: 'Традиционный медовый торт с нежным сметанным кремом',
    category: 'Торты',
    price: 2800,
    seller: 'Анна Пекарская',
    weight: '1.2 кг',
    portions: 8,
    prepTime: '24 часа',
    image: '🎂',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Красный бархат',
    description: 'Яркий бисквит с бархатной текстурой и кремом из маскарпоне',
    category: 'Торты',
    price: 3200,
    seller: 'Сладкий Дом',
    weight: '1.5 кг',
    portions: 10,
    prepTime: '12 часов',
    image: '🍰',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Набор макарон (12 шт)',
    description: 'Ассорти французских макарон: фисташка, малина, шоколад',
    category: 'Пирожные',
    price: 1800,
    seller: 'Анна Пекарская',
    weight: '360 г',
    portions: 12,
    prepTime: '48 часов',
    image: '🧁',
    rating: 5.0
  },
  {
    id: '4',
    name: 'Свадебный торт',
    description: 'Многоярусный торт с живыми цветами',
    category: 'Свадебные',
    price: 8000,
    seller: 'Sweet Atelier',
    weight: '3 кг',
    portions: 20,
    prepTime: '3 дня',
    image: '💒',
    rating: 4.7
  },
  {
    id: '5',
    name: 'Чизкейк Нью-Йорк',
    description: 'Классический американский чизкейк с ягодным соусом',
    category: 'Торты',
    price: 2400,
    seller: 'Сладкий Дом',
    weight: '1 кг',
    portions: 8,
    prepTime: '8 часов',
    image: '🍰',
    rating: 4.6
  },
  {
    id: '6',
    name: 'Эклеры ассорти (6 шт)',
    description: 'Заварные пирожные с кремом: ваниль, шоколад, фисташка',
    category: 'Пирожные',
    price: 1200,
    seller: 'Анна Пекарская',
    weight: '420 г',
    portions: 6,
    prepTime: '6 часов',
    image: '🥐',
    rating: 4.9
  }
];

export const categories = ['Все', 'Торты', 'Пирожные', 'Свадебные'];
