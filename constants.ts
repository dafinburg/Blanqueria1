import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'sabanas', name: 'Sábanas' },
  { id: 'toallas', name: 'Toallas' },
  { id: 'acolchados', name: 'Acolchados' },
  { id: 'almohadas', name: 'Almohadas' },
  { id: 'deco', name: 'Decoración' },
];

export const PRODUCT_CATALOG: Product[] = [
  {
    id: '1',
    name: 'Juego de Sábanas 180 Hilos - Queen',
    description: 'Sábanas de percal 100% algodón, super suaves y duraderas. Ideales para todas las estaciones.',
    price: 45000,
    category: 'sabanas',
    image: 'https://picsum.photos/400/400?random=1',
    stock: 10,
    features: ['100% Algodón', '180 Hilos', 'Hipoalergénico']
  },
  {
    id: '2',
    name: 'Toallón Hotelero Premium',
    description: 'Toallón de baño gigante 600g, máxima absorción y suavidad al tacto. Calidad hotel 5 estrellas.',
    price: 15000,
    category: 'toallas',
    image: 'https://picsum.photos/400/400?random=2',
    stock: 25,
    features: ['600 gr/m2', '100% Algodón Egipcio', 'Secado Rápido']
  },
  {
    id: '3',
    name: 'Acolchado Edredón Reversible King',
    description: 'Acolchado simil plumón, térmico y liviano. Diseño reversible gris/blanco.',
    price: 89000,
    category: 'acolchados',
    image: 'https://picsum.photos/400/400?random=3',
    stock: 5,
    features: ['Reversible', 'Relleno Siliconado', 'Lavable en lavarropas']
  },
  {
    id: '4',
    name: 'Almohada Viscoelástica Cervical',
    description: 'Espuma con memoria que se adapta al contorno del cuello para un descanso reparador.',
    price: 22000,
    category: 'almohadas',
    image: 'https://picsum.photos/400/400?random=4',
    stock: 15,
    features: ['Memory Foam', 'Funda lavable', 'Anti-ácaros']
  },
  {
    id: '5',
    name: 'Manta Nórdica Tejida XXL',
    description: 'Manta decorativa tejida a mano con lana merino sintética. Aporta calidez y estilo a tu living.',
    price: 55000,
    category: 'deco',
    image: 'https://picsum.photos/400/400?random=5',
    stock: 8,
    features: ['Tejido a mano', 'Super suave', 'Decorativa']
  },
  {
    id: '6',
    name: 'Juego de Toallas Mano + Baño',
    description: 'Set completo de toalla y toallón. Colores firmes que no destiñen.',
    price: 24000,
    category: 'toallas',
    image: 'https://picsum.photos/400/400?random=6',
    stock: 30,
    features: ['450 gr/m2', 'Algodón Peinado', 'Pack Regalo']
  },
  {
    id: '7',
    name: 'Sábanas Ajustables Twin Size',
    description: 'Sábana bajera con elástico reforzado en todo el perímetro. No se salen.',
    price: 18500,
    category: 'sabanas',
    image: 'https://picsum.photos/400/400?random=7',
    stock: 20,
    features: ['Microfibra Premium', 'No requiere planchado', 'Secado rápido']
  },
  {
    id: '8',
    name: 'Cubrecama Quilt Verano 2 Plazas',
    description: 'Cubrecama liviano con matelaseado termosellado. Ideal media estación.',
    price: 38000,
    category: 'acolchados',
    image: 'https://picsum.photos/400/400?random=8',
    stock: 12,
    features: ['Liviano', 'Fácil lavado', 'Estampado botánico']
  }
];