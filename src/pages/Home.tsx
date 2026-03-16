import React, { useEffect, useState } from 'react';
import { collection, query, where, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ProductCard from '../components/ProductCard';
import { Product } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sword, Shield, Crown } from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(db, 'products'),
          where('status', '==', 'ativo'),
          limit(8)
        );
        const snapshot = await getDocs(q);
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1920&auto=format&fit=crop" 
            alt="Medieval Castle" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1514]/80 via-[#1a1514]/50 to-[#1a1514]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-cinzel font-bold text-[#d4af37] mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]"
          >
            Bem-vindo à Taverna Frog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl font-medieval text-[#f1e4c3] mb-10"
          >
            O maior arsenal de itens mágicos, dados forjados por anões e pergaminhos perdidos de todo o reino.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold text-lg px-8 py-4 rounded border-2 border-[#d4af37] transition-all hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              <Sword className="h-5 w-5" />
              Explorar Arsenal
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Highlights */}
      <section className="py-16 bg-[#1a1514] border-y border-[#d4af37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-cinzel font-bold text-center text-[#d4af37] mb-12">Nossos Tesouros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Dados de RPG', icon: <Sword className="h-10 w-10" />, desc: 'Conjuntos forjados em resina, metal e osso.' },
              { title: 'Miniaturas', icon: <Shield className="h-10 w-10" />, desc: 'Heróis e monstros detalhados para sua mesa.' },
              { title: 'Roupas', icon: <Crown className="h-10 w-10" />, desc: 'Vestimentas dignas de reis, magos e mercenários.' }
            ].map((cat, i) => (
              <div key={i} className="parchment-bg p-8 rounded-lg text-center border border-[#d4af37]/50 hover:border-[#d4af37] transition-colors group">
                <div className="text-[#4a0e4e] mb-4 flex justify-center group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="text-xl font-cinzel font-bold text-[#1a1514] mb-2">{cat.title}</h3>
                <p className="font-medieval text-[#3e2723]">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#1a1514]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-[#d4af37]">Artefatos em Destaque</h2>
            <Link to="/products" className="text-[#097969] hover:text-[#d4af37] font-medieval flex items-center gap-1 transition-colors">
              Ver todos <Sword className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d4af37]"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
