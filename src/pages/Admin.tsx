import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Product } from '../contexts/CartContext';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Package, Users, ShoppingBag } from 'lucide-react';

export default function Admin() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoadingData(true);
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const fetchedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setIsEditing(product.id);
    setEditForm(product);
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditForm({});
    setIsAdding(false);
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editForm) return;
    try {
      const docRef = doc(db, 'products', isEditing);
      const updatedProduct = {
        ...editForm,
        images: (editForm.images || []).filter(img => img.trim() !== '')
      };
      await updateDoc(docRef, updatedProduct);
      setProducts(products.map(p => p.id === isEditing ? { ...p, ...updatedProduct } as Product : p));
      setIsEditing(null);
      setEditForm({});
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Falha ao atualizar produto.");
    }
  };

  const handleAddProduct = async () => {
    try {
      if (!editForm.name || !editForm.description || editForm.price === undefined || editForm.stock === undefined || !editForm.category) {
        alert("Preencha todos os campos obrigatórios (nome, descrição, preço, estoque, categoria).");
        return;
      }

      const newProduct = {
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        stock: editForm.stock,
        category: editForm.category,
        images: (editForm.images || []).filter(img => img.trim() !== ''),
        status: editForm.status || 'ativo',
        createdAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct } as Product]);
      setIsAdding(false);
      setEditForm({});
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Falha ao adicionar produto.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~1MB to avoid Firestore document size limits)
      if (file.size > 1024 * 1024) {
        alert("A imagem é muito grande. O tamanho máximo permitido é 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, images: [...(editForm.images || []), reader.result as string] });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Tem certeza que deseja deletar este artefato?")) {
      try {
        await deleteDoc(doc(db, 'products', id));
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Falha ao deletar produto.");
      }
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl sm:text-4xl font-cinzel font-bold text-[#097969]">Painel do Mestre</h1>
        <button 
          onClick={() => { setIsAdding(true); setEditForm({ status: 'ativo', images: [] }); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#097969] hover:bg-[#097969]/80 text-[#f1e4c3] font-cinzel font-bold px-4 py-2 rounded border border-[#d4af37] transition-all"
        >
          <Plus className="h-5 w-5" /> Novo Artefato
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="parchment-bg p-6 rounded-lg border border-[#d4af37]/50 flex items-center gap-4">
          <Package className="h-10 w-10 text-[#4a0e4e]" />
          <div>
            <div className="text-sm font-medieval text-[#3e2723]/70 uppercase tracking-wider">Total de Artefatos</div>
            <div className="text-3xl font-cinzel font-bold text-[#1a1514]">{products.length}</div>
          </div>
        </div>
        <div className="parchment-bg p-6 rounded-lg border border-[#d4af37]/50 flex items-center gap-4">
          <ShoppingBag className="h-10 w-10 text-[#097969]" />
          <div>
            <div className="text-sm font-medieval text-[#3e2723]/70 uppercase tracking-wider">Pedidos Pendentes</div>
            <div className="text-3xl font-cinzel font-bold text-[#1a1514]">0</div>
          </div>
        </div>
        <div className="parchment-bg p-6 rounded-lg border border-[#d4af37]/50 flex items-center gap-4">
          <Users className="h-10 w-10 text-[#d4af37]" />
          <div>
            <div className="text-sm font-medieval text-[#3e2723]/70 uppercase tracking-wider">Aventureiros Registrados</div>
            <div className="text-3xl font-cinzel font-bold text-[#1a1514]">0</div>
          </div>
        </div>
      </div>

      {/* Product Management */}
      <div className="bg-[#1a1514] border border-[#d4af37]/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-medieval text-[#f1e4c3]">
            <thead className="bg-[#3e2723] text-[#d4af37] font-cinzel">
              <tr>
                <th className="px-6 py-4 min-w-[150px]">Nome</th>
                <th className="px-6 py-4 min-w-[200px]">Imagem (URL)</th>
                <th className="px-6 py-4 min-w-[150px]">Categoria</th>
                <th className="px-6 py-4 min-w-[120px]">Preço</th>
                <th className="px-6 py-4 min-w-[100px]">Estoque</th>
                <th className="px-6 py-4 min-w-[120px]">Status</th>
                <th className="px-6 py-4 text-right min-w-[120px]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4af37]/20">
              {isAdding && (
                <tr className="bg-[#3e2723]/50">
                  <td className="px-6 py-4">
                    <input type="text" placeholder="Nome" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] mb-2" />
                    <textarea placeholder="Descrição" value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] text-xs h-16 resize-none" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      {editForm.images && editForm.images.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {editForm.images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <img src={img || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=100&auto=format&fit=crop'} alt="" className="w-10 h-10 object-cover rounded border border-[#d4af37]/30" referrerPolicy="no-referrer" />
                              <button 
                                onClick={() => {
                                  const newImages = [...editForm.images!];
                                  newImages.splice(idx, 1);
                                  setEditForm({...editForm, images: newImages});
                                }}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 hover:bg-red-600 transition-colors shadow-md"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-1">
                        <input 
                          type="text" 
                          placeholder="Adicionar URL" 
                          id="new-img-url-add"
                          className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] text-xs" 
                        />
                        <button 
                          onClick={() => {
                            const input = document.getElementById('new-img-url-add') as HTMLInputElement;
                            if (input && input.value) {
                              setEditForm({...editForm, images: [...(editForm.images || []), input.value]});
                              input.value = '';
                            }
                          }}
                          className="bg-[#3e2723] hover:bg-[#d4af37]/20 text-[#d4af37] px-2 rounded border border-[#d4af37]/30 flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <label className="cursor-pointer bg-[#3e2723] hover:bg-[#d4af37]/20 text-[#d4af37] text-xs text-center py-1 rounded border border-[#d4af37]/30 transition-colors">
                        Ou enviar arquivo
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]">
                      <option value="" disabled>Selecione...</option>
                      <option value="Dados de RPG">Dados de RPG</option>
                      <option value="Miniaturas">Miniaturas</option>
                      <option value="Roupas">Roupas</option>
                      <option value="Acessórios de mesa">Acessórios de mesa</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <input type="number" placeholder="Preço" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]" />
                  </td>
                  <td className="px-6 py-4">
                    <input type="number" placeholder="Estoque" value={editForm.stock || ''} onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]" />
                  </td>
                  <td className="px-6 py-4">
                    <select value={editForm.status || 'ativo'} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]">
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                      <option value="fora_de_estoque">Esgotado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button onClick={handleAddProduct} className="text-green-500 hover:text-green-400"><Save className="h-5 w-5" /></button>
                    <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-400"><X className="h-5 w-5" /></button>
                  </td>
                </tr>
              )}

              {loadingData ? (
                <tr><td colSpan={7} className="text-center py-8">Carregando artefatos...</td></tr>
              ) : products.map(product => (
                <tr key={product.id} className="hover:bg-[#3e2723]/30 transition-colors">
                  {isEditing === product.id ? (
                    <>
                      <td className="px-6 py-4">
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] mb-2" />
                        <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] text-xs h-16 resize-none" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {editForm.images && editForm.images.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {editForm.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img src={img || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=100&auto=format&fit=crop'} alt="" className="w-10 h-10 object-cover rounded border border-[#d4af37]/30" referrerPolicy="no-referrer" />
                                  <button 
                                    onClick={() => {
                                      const newImages = [...editForm.images!];
                                      newImages.splice(idx, 1);
                                      setEditForm({...editForm, images: newImages});
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-100 hover:bg-red-600 transition-colors shadow-md"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-1">
                            <input 
                              type="text" 
                              placeholder="Adicionar URL" 
                              id={`new-img-url-${product.id}`}
                              className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37] text-xs" 
                            />
                            <button 
                              onClick={() => {
                                const input = document.getElementById(`new-img-url-${product.id}`) as HTMLInputElement;
                                if (input && input.value) {
                                  setEditForm({...editForm, images: [...(editForm.images || []), input.value]});
                                  input.value = '';
                                }
                              }}
                              className="bg-[#3e2723] hover:bg-[#d4af37]/20 text-[#d4af37] px-2 rounded border border-[#d4af37]/30 flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <label className="cursor-pointer bg-[#3e2723] hover:bg-[#d4af37]/20 text-[#d4af37] text-xs text-center py-1 rounded border border-[#d4af37]/30 transition-colors">
                            Ou enviar arquivo
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]">
                          <option value="" disabled>Selecione...</option>
                          <option value="Dados de RPG">Dados de RPG</option>
                          <option value="Miniaturas">Miniaturas</option>
                          <option value="Roupas">Roupas</option>
                          <option value="Acessórios de mesa">Acessórios de mesa</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <input type="number" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value)})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]" />
                      </td>
                      <td className="px-6 py-4">
                        <input type="number" value={editForm.stock || ''} onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]" />
                      </td>
                      <td className="px-6 py-4">
                        <select value={editForm.status || 'ativo'} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="w-full bg-[#1a1514] border border-[#d4af37]/30 rounded px-2 py-1 focus:outline-none focus:border-[#d4af37]">
                          <option value="ativo">Ativo</option>
                          <option value="inativo">Inativo</option>
                          <option value="fora_de_estoque">Esgotado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-400"><Save className="h-5 w-5" /></button>
                        <button onClick={handleCancelEdit} className="text-red-500 hover:text-red-400"><X className="h-5 w-5" /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4">
                        <div className="font-bold">{product.name}</div>
                        <div className="text-xs text-[#f1e4c3]/70 truncate max-w-[150px]" title={product.description}>{product.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        {product.images && product.images.length > 0 ? (
                          <div className="flex -space-x-2 overflow-hidden">
                            {product.images.slice(0, 3).map((img, idx) => (
                              <img key={idx} src={img || 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=100&auto=format&fit=crop'} alt={product.name} className="inline-block w-10 h-10 object-cover rounded-full border-2 border-[#1a1514]" referrerPolicy="no-referrer" />
                            ))}
                            {product.images.length > 3 && (
                              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#1a1514] bg-[#3e2723] text-xs text-[#d4af37] z-10">
                                +{product.images.length - 3}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-[#1a1514] rounded-full border-2 border-[#1a1514] flex items-center justify-center text-[10px] text-[#3e2723] text-center">Sem foto</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-[#097969]">{product.category}</td>
                      <td className="px-6 py-4 text-[#d4af37]">R$ {product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">{product.stock}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          product.status === 'ativo' ? 'bg-green-900/50 text-green-400' :
                          product.status === 'inativo' ? 'bg-gray-900/50 text-gray-400' :
                          'bg-red-900/50 text-red-400'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button onClick={() => handleEditClick(product)} className="text-blue-400 hover:text-blue-300"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-400"><Trash2 className="h-5 w-5" /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
