import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, useCart } from '../contexts/CartContext';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#f1e4c3]/70 hover:text-[#d4af37] font-medieval mb-8 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" /> Retornar ao Arsenal
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#d4af37]/30 bg-[#1a1514] relative">
            <img 
              src={product.images[activeImage] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop'} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {product.status === 'fora_de_estoque' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="font-cinzel text-red-500 font-bold text-3xl transform -rotate-12 border-4 border-red-500 px-6 py-2">Esgotado</span>
              </div>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded border-2 overflow-hidden transition-colors ${activeImage === idx ? 'border-[#d4af37]' : 'border-[#3e2723] hover:border-[#d4af37]/50'}`}
                >
                  <img src={img || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=100&auto=format&fit=crop'} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="text-sm font-medieval text-[#097969] mb-2 uppercase tracking-wider">{product.category}</div>
          <h1 className="text-4xl md:text-5xl font-cinzel font-bold text-[#d4af37] mb-4">{product.name}</h1>
          
          <div className="text-3xl font-cinzel font-bold text-[#f1e4c3] mb-6">
            R$ {product.price.toFixed(2)}
          </div>

          <div className="parchment-bg p-6 rounded-lg mb-8 border border-[#d4af37]/20">
            <h3 className="font-cinzel text-xl font-bold text-[#1a1514] mb-4 border-b border-[#3e2723]/20 pb-2">Descrição do Artefato</h3>
            <p className="font-medieval text-[#3e2723] whitespace-pre-wrap leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="space-y-6 mt-auto">
            <div className="flex items-center gap-4 text-[#f1e4c3]/80 font-medieval">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#097969]" />
                <span>Autenticidade Garantida</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#d4af37]" />
                <span>Entrega por Corvos</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-between sm:justify-start border border-[#d4af37]/50 rounded bg-[#3e2723]">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-6 sm:px-4 py-3 text-[#d4af37] hover:bg-[#1a1514] transition-colors"
                  disabled={product.status === 'fora_de_estoque'}
                >-</button>
                <span className="px-4 py-3 font-cinzel font-bold text-[#f1e4c3] min-w-[3rem] text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-6 sm:px-4 py-3 text-[#d4af37] hover:bg-[#1a1514] transition-colors"
                  disabled={product.status === 'fora_de_estoque' || quantity >= product.stock}
                >+</button>
              </div>

              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={product.status === 'fora_de_estoque' || product.stock <= 0}
                className="flex-grow flex items-center justify-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold text-lg px-8 py-3 rounded border-2 border-[#d4af37] transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                <ShoppingCart className="h-5 w-5" />
                {product.status === 'fora_de_estoque' ? 'Esgotado' : 'Adicionar ao Carrinho'}
              </button>
            </div>
            
            <div className="text-sm font-medieval text-[#f1e4c3]/60 text-right">
              {product.stock > 0 ? `${product.stock} unidades disponíveis` : 'Sem estoque no momento'}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
