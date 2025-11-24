import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { CartItem, ChatMessage } from '../types';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
}

export const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose, cart }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy SoftBot. ¿En qué puedo ayudarte hoy? Puedo asesorarte sobre medidas, telas o cuidados.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMsg, cart);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', text: response }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hubo un error de conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:justify-end sm:items-end pointer-events-none p-0 sm:p-6">
      <div className="bg-white w-full h-full sm:w-96 sm:h-[600px] sm:rounded-2xl shadow-2xl flex flex-col pointer-events-auto border border-linen-200">
        
        {/* Header */}
        <div className="bg-linen-800 p-4 text-white flex justify-between items-center sm:rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold">Asistente SoftHome</h3>
              <p className="text-xs text-linen-200">En línea</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-linen-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-linen-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-linen-100 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-linen-100 flex gap-1">
                 <span className="w-2 h-2 bg-linen-400 rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-linen-400 rounded-full animate-bounce delay-75"></span>
                 <span className="w-2 h-2 bg-linen-400 rounded-full animate-bounce delay-150"></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-linen-100 sm:rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Pregunta sobre medidas, telas..."
              className="flex-1 border border-linen-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-linen-400 text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-linen-800 text-white p-2 rounded-xl hover:bg-linen-700 disabled:opacity-50 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};