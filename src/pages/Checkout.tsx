import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { CreditCard, QrCode, FileText, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit' | 'boleto'>('pix');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const frete = 25; // Mock fixed frete for checkout
  const finalTotal = total + frete;

  if (!currentUser) {
    navigate('/login?redirect=/checkout');
    return null;
  }

  if (items.length === 0 && !success) {
    navigate('/cart');
    return null;
  }

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create order in Firestore
      await addDoc(collection(db, 'orders'), {
        userId: currentUser.uid,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        total: finalTotal,
        status: 'pending',
        paymentMethod,
        shippingAddress: {
          address: userProfile?.address || '',
          cep: userProfile?.cep || ''
        },
        createdAt: serverTimestamp()
      });

      // Simulate payment processing
      setTimeout(() => {
        setSuccess(true);
        clearCart();
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error processing payment:", error);
      setLoading(false);
      alert("Falha ao processar o pagamento. Tente novamente.");
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-[#097969] mb-6"
        >
          <CheckCircle className="h-32 w-32" />
        </motion.div>
        <h1 className="text-4xl font-cinzel font-bold text-[#d4af37] mb-4">Transação Concluída!</h1>
        <p className="text-xl font-medieval text-[#f1e4c3] mb-8">
          Seus artefatos foram pagos com sucesso. Nossos corvos já estão preparando o envio para o endereço registrado.
        </p>
        <button
          onClick={() => navigate('/products')}
          className="bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold px-8 py-3 rounded border border-[#d4af37] transition-all"
        >
          Retornar à Taverna
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-4xl font-cinzel font-bold text-[#d4af37] mb-8 text-center">Finalizar Missão</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Payment Details */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="parchment-bg p-8 rounded-lg border-2 border-[#d4af37]/50"
        >
          <h2 className="text-2xl font-cinzel font-bold text-[#1a1514] mb-6 border-b border-[#3e2723]/20 pb-4">Dados de Entrega</h2>
          <div className="space-y-4 font-medieval text-[#3e2723] mb-8">
            <p><strong>Aventureiro:</strong> {userProfile?.name}</p>
            <p><strong>Destino:</strong> {userProfile?.address || 'Endereço não cadastrado'}</p>
            <p><strong>CEP:</strong> {userProfile?.cep || 'Não cadastrado'}</p>
            <p className="text-sm text-[#4a0e4e]">* Atualize seus dados no perfil se necessário.</p>
          </div>

          <h2 className="text-2xl font-cinzel font-bold text-[#1a1514] mb-6 border-b border-[#3e2723]/20 pb-4">Tributo (Pagamento)</h2>
          
          <div className="space-y-4">
            <label className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'pix' ? 'border-[#097969] bg-[#097969]/10' : 'border-[#3e2723]/30 hover:bg-[#3e2723]/5'}`}>
              <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} className="hidden" />
              <QrCode className={`h-6 w-6 mr-4 ${paymentMethod === 'pix' ? 'text-[#097969]' : 'text-[#3e2723]'}`} />
              <span className="font-cinzel font-bold text-lg">PIX (Aprovação Instantânea)</span>
            </label>
            
            <label className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'credit' ? 'border-[#097969] bg-[#097969]/10' : 'border-[#3e2723]/30 hover:bg-[#3e2723]/5'}`}>
              <input type="radio" name="payment" value="credit" checked={paymentMethod === 'credit'} onChange={() => setPaymentMethod('credit')} className="hidden" />
              <CreditCard className={`h-6 w-6 mr-4 ${paymentMethod === 'credit' ? 'text-[#097969]' : 'text-[#3e2723]'}`} />
              <span className="font-cinzel font-bold text-lg">Cartão de Crédito</span>
            </label>
            
            <label className={`flex items-center p-4 border rounded cursor-pointer transition-colors ${paymentMethod === 'boleto' ? 'border-[#097969] bg-[#097969]/10' : 'border-[#3e2723]/30 hover:bg-[#3e2723]/5'}`}>
              <input type="radio" name="payment" value="boleto" checked={paymentMethod === 'boleto'} onChange={() => setPaymentMethod('boleto')} className="hidden" />
              <FileText className={`h-6 w-6 mr-4 ${paymentMethod === 'boleto' ? 'text-[#097969]' : 'text-[#3e2723]'}`} />
              <span className="font-cinzel font-bold text-lg">Boleto Bancário</span>
            </label>
          </div>
        </motion.div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#3e2723] border border-[#d4af37]/30 rounded-lg p-8 h-fit sticky top-24"
        >
          <h2 className="text-2xl font-cinzel font-bold text-[#d4af37] mb-6 border-b border-[#d4af37]/20 pb-4">Resumo do Pedido</h2>
          
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center text-[#f1e4c3] font-medieval">
                <div className="flex items-center gap-2">
                  <span className="text-[#d4af37]">{item.quantity}x</span>
                  <span className="truncate max-w-[150px] sm:max-w-[200px]">{item.name}</span>
                </div>
                <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#d4af37]/20 pt-4 space-y-2 font-medieval text-[#f1e4c3]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete</span>
              <span>R$ {frete.toFixed(2)}</span>
            </div>
          </div>

          <div className="border-t border-[#d4af37]/20 mt-4 pt-4 mb-8">
            <div className="flex justify-between items-end">
              <span className="font-cinzel font-bold text-xl text-[#f1e4c3]">Total a Pagar</span>
              <span className="font-cinzel text-3xl font-bold text-[#d4af37]">R$ {finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold text-xl px-6 py-4 rounded border-2 border-[#d4af37] transition-all hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#f1e4c3]"></div>
            ) : (
              'Confirmar Pagamento'
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
