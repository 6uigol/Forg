import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Sword, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { currentUser, isAdmin, logout } = useAuth();
  const { items } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#1a1514] border-b border-[#d4af37]/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Sword className="h-8 w-8 text-[#d4af37]" />
              <span className="font-cinzel text-2xl font-bold text-[#d4af37] tracking-wider">FROG</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link to="/products" className="text-[#f1e4c3] hover:text-[#d4af37] font-medieval transition-colors flex items-center gap-1">
                Arsenal <ChevronDown className="h-4 w-4" />
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-[#1a1514] border border-[#d4af37]/30 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <Link to="/products" className="block px-4 py-2 text-sm text-[#f1e4c3] hover:bg-[#3e2723] hover:text-[#d4af37] font-medieval">Todos os Itens</Link>
                <Link to="/products?category=Dados%20de%20RPG" className="block px-4 py-2 text-sm text-[#f1e4c3] hover:bg-[#3e2723] hover:text-[#d4af37] font-medieval">Dados de RPG</Link>
                <Link to="/products?category=Miniaturas" className="block px-4 py-2 text-sm text-[#f1e4c3] hover:bg-[#3e2723] hover:text-[#d4af37] font-medieval">Miniaturas</Link>
                <Link to="/products?category=Roupas" className="block px-4 py-2 text-sm text-[#f1e4c3] hover:bg-[#3e2723] hover:text-[#d4af37] font-medieval">Roupas</Link>
                <Link to="/products?category=Acess%C3%B3rios%20de%20mesa" className="block px-4 py-2 text-sm text-[#f1e4c3] hover:bg-[#3e2723] hover:text-[#d4af37] font-medieval">Acessórios de mesa</Link>
              </div>
            </div>
            
            {isAdmin && (
              <Link to="/admin" className="text-[#097969] hover:text-[#d4af37] font-medieval transition-colors">Painel do Mestre</Link>
            )}

            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative text-[#f1e4c3] hover:text-[#d4af37] transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4a0e4e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {currentUser ? (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="text-[#f1e4c3] hover:text-[#d4af37]">
                    <User className="h-6 w-6" />
                  </Link>
                  <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300 font-medieval">Sair</button>
                </div>
              ) : (
                <Link to="/login" className="text-[#f1e4c3] hover:text-[#d4af37] font-medieval">Entrar</Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative text-[#f1e4c3] mr-4">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#4a0e4e] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#f1e4c3]">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#1a1514] border-b border-[#d4af37]/30">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#d4af37] font-cinzel font-bold border-b border-[#3e2723]">Início</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#d4af37] font-cinzel font-bold border-b border-[#3e2723]">Arsenal (Todos)</Link>
            <Link to="/products?category=Dados%20de%20RPG" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-[#f1e4c3] font-medieval text-sm">└ Dados de RPG</Link>
            <Link to="/products?category=Miniaturas" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-[#f1e4c3] font-medieval text-sm">└ Miniaturas</Link>
            <Link to="/products?category=Roupas" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-[#f1e4c3] font-medieval text-sm">└ Roupas</Link>
            <Link to="/products?category=Acess%C3%B3rios%20de%20mesa" onClick={() => setIsOpen(false)} className="block px-4 py-2 text-[#f1e4c3] font-medieval text-sm">└ Acessórios de mesa</Link>
            
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#097969] font-medieval mt-2 border-t border-[#3e2723]">Painel do Mestre</Link>
            )}
            {currentUser ? (
              <>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#f1e4c3] font-medieval">Meu Perfil</Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400 font-medieval">Sair</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-[#f1e4c3] font-medieval border-t border-[#3e2723] mt-2">Entrar</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
