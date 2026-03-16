import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Trash2, ArrowRight, ShoppingBag, MapPin } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [cep, setCep] = useState('');
  const [frete, setFrete] = useState<number | null>(null);

  const handleCalcularFrete = () => {
    if (cep.length === 8) {
      // Mock frete calculation
      setFrete(Math.floor(Math.random() * 30) + 15);
    }
  };

  const handleCheckout = () => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh] flex flex-col items-center justify-center">
        <ShoppingBag className="h-24 w-24 text-[#d4af37]/30 mb-6" />
        <h2 className="text-3xl font-cinzel font-bold text-[#d4af37] mb-4">Seu Carrinho está Vazio</h2>
        <p className="text-[#f1e4c3]/70 font-medieval mb-8 text-center max-w-md">
          Aventureiro, parece que sua mochila ainda não possui nenhum artefato mágico. Retorne à taverna e escolha seus equipamentos.
        </p>
        <Link 
          to="/products"
          className="inline-flex items-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold px-8 py-3 rounded border border-[#d4af37] transition-all"
        >
          Explorar Arsenal
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-cinzel font-bold text-[#d4af37] mb-8"
      >
        Sua Mochila
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row gap-6 parchment-bg p-4 rounded-lg border border-[#d4af37]/30"
            >
              <div className="w-full sm:w-32 h-32 bg-[#1a1514] rounded overflow-hidden flex-shrink-0 border border-[#3e2723]/20">
                <img 
                  src={item.images[0] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=200&auto=format&fit=crop'} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs font-medieval text-[#097969] uppercase tracking-wider mb-1">{item.category}</div>
                    <h3 className="font-cinzel text-xl font-bold text-[#1a1514]">{item.name}</h3>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center border border-[#3e2723]/30 rounded bg-[#f1e4c3]">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-[#3e2723] hover:bg-[#d4af37]/20 transition-colors"
                    >-</button>
                    <span className="px-3 py-1 font-cinzel font-bold text-[#1a1514] min-w-[2.5rem] text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-[#3e2723] hover:bg-[#d4af37]/20 transition-colors"
                      disabled={item.quantity >= item.stock}
                    >+</button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-medieval text-[#3e2723]/60 mb-1">R$ {item.price.toFixed(2)} cada</div>
                    <div className="font-cinzel text-xl font-bold text-[#4a0e4e]">
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#3e2723] border border-[#d4af37]/30 rounded-lg p-6 sticky top-24"
          >
            <h3 className="font-cinzel text-2xl font-bold text-[#d4af37] mb-6 border-b border-[#d4af37]/20 pb-4">Resumo da Missão</h3>
            
            <div className="space-y-4 font-medieval text-[#f1e4c3] mb-6">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} itens)</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-[#d4af37]/20 pt-4">
                <label className="block text-sm mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#d4af37]" /> Calcular Frete (CEP)
                </label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    placeholder="00000000"
                    className="w-full px-3 py-2 bg-[#1a1514] border border-[#d4af37]/30 rounded focus:outline-none focus:border-[#d4af37]"
                  />
                  <button 
                    onClick={handleCalcularFrete}
                    disabled={cep.length !== 8}
                    className="bg-[#1a1514] text-[#d4af37] px-4 py-2 rounded border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-[#1a1514] transition-colors disabled:opacity-50"
                  >
                    OK
                  </button>
                </div>
              </div>

              {frete !== null && (
                <div className="flex justify-between text-[#097969]">
                  <span>Frete (Corvo Expresso)</span>
                  <span>R$ {frete.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#d4af37]/20 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-cinzel font-bold text-lg text-[#f1e4c3]">Total</span>
                <span className="font-cinzel text-3xl font-bold text-[#d4af37]">
                  R$ {(total + (frete || 0)).toFixed(2)}
                </span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold text-lg px-6 py-4 rounded border-2 border-[#d4af37] transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            >
              Finalizar Compra <ArrowRight className="h-5 w-5" />
            </button>
            
            {!currentUser && (
              <p className="text-center text-xs font-medieval text-[#f1e4c3]/60 mt-4">
                Você precisará se identificar na taverna para concluir.
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
