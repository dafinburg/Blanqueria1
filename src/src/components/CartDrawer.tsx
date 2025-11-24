import React from 'react';
import { X, Minus, Plus, Trash2, Send, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onGetRecommendation: () => void;
  isGeneratingRec: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  cart, 
  onRemove, 
  onUpdateQuantity,
  onGetRecommendation,
  isGeneratingRec
}) => {
  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleCheckout = () => {
    // Generate WhatsApp message
    const lines = cart.map(item => `• ${item.quantity}x ${item.product.name} - $${(item.product.price * item.quantity).toLocaleString()}`);
    const message = `Hola! Quiero realizar el siguiente pedido en SoftHome:\n\n${lines.join('\n')}\n\n*Total: $${total.toLocaleString()}*`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform bg-white shadow-xl flex flex-col h-full">
          
          <div className="flex items-center justify-between px-6 py-4 border-b border-linen-100 bg-linen-50">
            <h2 className="text-xl font-bold text-slate-800">Tu Pedido</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-linen-100 rounded-full flex items-center justify-center text-linen-400">
                  <Sparkles size={32} />
                </div>
                <p className="text-slate-500 font-medium">No hay items en el pedido aún.</p>
                <button onClick={onClose} className="text-linen-600 font-semibold hover:underline">
                  Volver al catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-linen-200 flex-shrink-0">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-medium text-slate-800 line-clamp-1">{item.product.name}</h4>
                        <p className="text-sm text-slate-500">${item.product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 border border-linen-200 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-linen-100 rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-linen-100 rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => onRemove(item.product.id)}
                          className="text-red-400 hover:text-red-600 p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                 {/* AI Suggestion Trigger */}
                 <div className="pt-4 border-t border-linen-100">
                    <button 
                      onClick={onGetRecommendation}
                      disabled={isGeneratingRec}
                      className="w-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 py-3 rounded-xl border border-indigo-100 flex items-center justify-center gap-2 hover:from-indigo-100 hover:to-blue-100 transition-all disabled:opacity-70"
                    >
                      {isGeneratingRec ? (
                         <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Sparkles size={18} />
                      )}
                      {isGeneratingRec ? 'Analizando...' : '¿Olvidaste algo? Ver sugerencia IA'}
                    </button>
                 </div>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t border-linen-200 bg-white">
              <div className="flex justify-between items-center mb-6">
                <span className="text-slate-500">Total Estimado</span>
                <span className="text-2xl font-bold text-slate-900">${total.toLocaleString()}</span>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              >
                <Send size={20} />
                Enviar Pedido por WhatsApp
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};