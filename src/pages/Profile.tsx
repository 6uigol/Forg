import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, MapPin, Phone, CreditCard, Save, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    cep: '',
    address: ''
  });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        name: userProfile.name || '',
        cpf: userProfile.cpf || '',
        phone: userProfile.phone || '',
        cep: userProfile.cep || '',
        address: userProfile.address || ''
      });
    }
  }, [userProfile]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) return;
      setLoadingOrders(true);
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', currentUser.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [currentUser, activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    setSaving(true);
    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, formData);
      setIsEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Falha ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Package className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  if (loading || !currentUser) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-cinzel font-bold rounded-t-lg border-b-2 transition-colors ${
            activeTab === 'profile' 
              ? 'border-[#d4af37] text-[#d4af37] bg-[#3e2723]/30' 
              : 'border-transparent text-[#f1e4c3] hover:text-[#d4af37]'
          }`}
        >
          Meu Pergaminho (Perfil)
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 font-cinzel font-bold rounded-t-lg border-b-2 transition-colors ${
            activeTab === 'orders' 
              ? 'border-[#d4af37] text-[#d4af37] bg-[#3e2723]/30' 
              : 'border-transparent text-[#f1e4c3] hover:text-[#d4af37]'
          }`}
        >
          Meus Pedidos
        </button>
      </div>

      {activeTab === 'profile' ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="parchment-bg p-8 rounded-lg border-2 border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-[#3e2723]/20 pb-4">
            <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#1a1514]">Seus Dados, Aventureiro</h1>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[#097969] hover:text-[#4a0e4e] font-medieval transition-colors"
              >
                Editar Pergaminho
              </button>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medieval text-[#3e2723] font-bold">
                  <User className="h-4 w-4" /> Nome Completo
                </label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#f1e4c3]/50 border border-[#d4af37]/50 rounded text-[#1a1514] font-medieval focus:outline-none focus:border-[#d4af37] disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medieval text-[#3e2723] font-bold">
                  <CreditCard className="h-4 w-4" /> CPF
                </label>
                <input 
                  type="text" 
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value.replace(/\D/g, '').slice(0, 11)})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#f1e4c3]/50 border border-[#d4af37]/50 rounded text-[#1a1514] font-medieval focus:outline-none focus:border-[#d4af37] disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medieval text-[#3e2723] font-bold">
                  <Phone className="h-4 w-4" /> Telefone
                </label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#f1e4c3]/50 border border-[#d4af37]/50 rounded text-[#1a1514] font-medieval focus:outline-none focus:border-[#d4af37] disabled:opacity-70"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medieval text-[#3e2723] font-bold">
                  <MapPin className="h-4 w-4" /> CEP
                </label>
                <input 
                  type="text" 
                  value={formData.cep}
                  onChange={(e) => setFormData({...formData, cep: e.target.value.replace(/\D/g, '').slice(0, 8)})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#f1e4c3]/50 border border-[#d4af37]/50 rounded text-[#1a1514] font-medieval focus:outline-none focus:border-[#d4af37] disabled:opacity-70"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-medieval text-[#3e2723] font-bold">
                  <MapPin className="h-4 w-4" /> Endereço Completo
                </label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#f1e4c3]/50 border border-[#d4af37]/50 rounded text-[#1a1514] font-medieval focus:outline-none focus:border-[#d4af37] disabled:opacity-70"
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-4 pt-6 border-t border-[#3e2723]/20">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 text-[#3e2723] hover:text-[#1a1514] font-medieval transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold px-6 py-2 rounded border border-[#d4af37] transition-all disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            )}
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {loadingOrders ? (
            <div className="text-center py-12 text-[#d4af37] font-medieval">
              Consultando os registros da guilda...
            </div>
          ) : orders.length === 0 ? (
            <div className="parchment-bg p-12 rounded-lg border-2 border-[#d4af37]/50 text-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
              <Package className="w-16 h-16 mx-auto text-[#3e2723]/50 mb-4" />
              <h2 className="text-2xl font-cinzel font-bold text-[#1a1514] mb-2">Nenhum Pedido Encontrado</h2>
              <p className="text-[#3e2723] font-medieval">Você ainda não adquiriu nenhum artefato em nossa taverna.</p>
              <button 
                onClick={() => navigate('/products')}
                className="mt-6 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold px-6 py-2 rounded border border-[#d4af37] transition-all"
              >
                Explorar Arsenal
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-[#1a1514] border border-[#d4af37]/30 rounded-lg p-6 shadow-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b border-[#3e2723] pb-4">
                  <div>
                    <p className="text-sm text-[#d4af37] font-medieval">Pedido #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[#f1e4c3]/60 font-medieval">
                      {order.createdAt?.toDate ? new Date(order.createdAt.toDate()).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-[#3e2723] px-3 py-1.5 rounded-full border border-[#d4af37]/30">
                    {getStatusIcon(order.status)}
                    <span className="text-sm font-bold text-[#f1e4c3] font-medieval">{getStatusText(order.status)}</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-[#f1e4c3] font-medieval text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-[#d4af37]">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                      <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-[#3e2723]">
                  <span className="text-[#f1e4c3] font-medieval text-sm">Pagamento: {order.paymentMethod?.toUpperCase()}</span>
                  <span className="text-xl font-cinzel font-bold text-[#d4af37]">Total: R$ {order.total?.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
