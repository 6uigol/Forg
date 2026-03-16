import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product, useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-[#3e2723] rounded-lg overflow-hidden border border-[#d4af37]/20 hover:border-[#d4af37] transition-all duration-300 shadow-lg hover:shadow-[#d4af37]/20 flex flex-col h-full">
        <div className="relative aspect-square overflow-hidden bg-[#1a1514]">
          <img 
            src={product.images[0] || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=400&auto=format&fit=crop'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {product.status === 'fora_de_estoque' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="font-cinzel text-red-500 font-bold text-xl transform -rotate-12 border-2 border-red-500 px-4 py-1">Esgotado</span>
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow parchment-bg">
          <div className="text-xs font-medieval text-[#097969] mb-1 uppercase tracking-wider">{product.category}</div>
          <h3 className="font-cinzel text-lg font-bold text-[#1a1514] mb-2 line-clamp-2">{product.name}</h3>
          
          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="font-cinzel text-xl font-bold text-[#4a0e4e]">
              R$ {product.price.toFixed(2)}
            </span>
            
            <button 
              onClick={handleAddToCart}
              disabled={product.status === 'fora_de_estoque' || product.stock <= 0}
              className="bg-[#1a1514] text-[#d4af37] p-2 rounded-full hover:bg-[#d4af37] hover:text-[#1a1514] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Adicionar ao carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
