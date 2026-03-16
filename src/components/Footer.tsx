import React from 'react';
import { Sword } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1a1514] border-t border-[#d4af37]/30 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-2">
            <Sword className="h-6 w-6 text-[#d4af37]" />
            <span className="font-cinzel text-xl font-bold text-[#d4af37] tracking-wider">FROG</span>
          </div>
          <p className="text-[#f1e4c3]/60 text-sm font-medieval text-center">
            &copy; {new Date().getFullYear()} Frog - A sua taverna de itens mágicos e aventuras. Todos os direitos reservados ao reino.
          </p>
        </div>
      </div>
    </footer>
  );
}
