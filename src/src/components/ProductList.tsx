import React from 'react';
import { Plus, Info } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onAddToCart }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400 text-lg">No encontramos productos con esos criterios.</p>
        <button className="mt-4 text-linen-600 font-medium hover:underline">Ver todo el catálogo</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-linen-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
          <div className="relative aspect-square overflow-hidden bg-linen-50">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-xs font-bold text-linen-800 shadow-sm">
              ${product.price.toLocaleString()}
            </div>
          </div>
          
          <div className="p-5 flex-grow flex flex-col">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-wider text-linen-500 font-semibold">{product.category}</span>
              <h3 className="font-bold text-slate-800 text-lg leading-tight mt-1">{product.name}</h3>
            </div>
            
            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{product.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4 mt-auto">
              {product.features.slice(0, 2).map((feature, idx) => (
                <span key={idx} className="bg-linen-50 text-linen-700 text-xs px-2 py-1 rounded-md border border-linen-200">
                  {feature}
                </span>
              ))}
            </div>

            <button 
              onClick={() => onAddToCart(product)}
              className="w-full bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 active:scale-95 transform duration-100"
            >
              <Plus size={18} />
              Agregar al Pedido
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};