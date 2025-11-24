import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingBag, MessageCircle, Sparkles, Menu, X } from 'lucide-react';
import { Product, CartItem, Category } from './types';
import { PRODUCT_CATALOG, CATEGORIES } from './constants';
import { ProductList } from './components/ProductList';
import { CartDrawer } from './components/CartDrawer';
import { AIChat } from './components/AIChat';
import { getRecommendations } from './services/geminiService';

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [isGeneratingRec, setIsGeneratingRec] = useState(false);

  // Filter products
  const filteredProducts = PRODUCT_CATALOG.filter((product) => {
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev.map((item) => {
        if (item.product.id === productId) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
    });
  };

  // AI Recommendation Trigger
  const handleGetRecommendation = async () => {
    if (cart.length === 0) return;
    setIsGeneratingRec(true);
    try {
      const recText = await getRecommendations(cart);
      setRecommendation(recText);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingRec(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-linen-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-linen-600 text-white p-2 rounded-lg">
                <Sparkles size={20} />
              </div>
              <h1 className="text-xl font-bold text-linen-900 tracking-tight">SoftHome <span className="text-linen-500 font-medium">Blanquería</span></h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <nav className="flex space-x-4">
                <button 
                  onClick={() => setSelectedCategory('todos')}
                  className={`text-sm font-medium transition-colors ${selectedCategory === 'todos' ? 'text-linen-800' : 'text-slate-500 hover:text-linen-700'}`}
                >
                  Todo
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'text-linen-800' : 'text-slate-500 hover:text-linen-700'}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsChatOpen(true)}
                className="p-2 text-slate-500 hover:text-linen-600 hover:bg-linen-50 rounded-full transition-colors relative"
                aria-label="Abrir asistente IA"
              >
                <MessageCircle size={24} />
              </button>
              
              <button 
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-2 bg-linen-800 text-white px-4 py-2 rounded-full hover:bg-linen-700 transition-colors shadow-sm"
              >
                <ShoppingBag size={20} />
                <span className="font-medium">{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Mobile Categories Scroll */}
        <div className="md:hidden overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <div className="flex space-x-2">
            <button
               onClick={() => setSelectedCategory('todos')}
               className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${selectedCategory === 'todos' ? 'bg-linen-800 text-white border-linen-800' : 'bg-white text-slate-600 border-slate-200'}`}
            >
              Todo
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap border ${selectedCategory === cat.id ? 'bg-linen-800 text-white border-linen-800' : 'bg-white text-slate-600 border-slate-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Banner */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <input 
              type="text" 
              placeholder="Buscar toallas, sábanas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border border-linen-200 focus:outline-none focus:ring-2 focus:ring-linen-400 bg-white shadow-sm"
            />
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm text-slate-500">Envío gratis en compras mayores a $50.000</p>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        {recommendation && (
          <div className="mb-8 bg-gradient-to-r from-linen-100 to-white p-6 rounded-2xl border border-linen-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles size={100} />
            </div>
            <div className="relative z-10">
              <h3 className="flex items-center gap-2 font-bold text-linen-900 mb-2">
                <Sparkles size={18} className="text-yellow-600" />
                Sugerencia para tu hogar
              </h3>
              <p className="text-slate-700 leading-relaxed">{recommendation}</p>
              <button 
                onClick={() => setRecommendation(null)} 
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <ProductList products={filteredProducts} onAddToCart={addToCart} />

      </main>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateQuantity}
        onGetRecommendation={handleGetRecommendation}
        isGeneratingRec={isGeneratingRec}
      />

      {/* AI Chat Assistant */}
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} cart={cart} />
      
    </div>
  );
}