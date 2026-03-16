import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'motion/react';
import { Sword, Mail, Lock, User, MapPin, Phone, CreditCard } from 'lucide-react';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const from = new URLSearchParams(location.search).get('redirect') || '/';

  if (currentUser) {
    navigate(from, { replace: true });
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if user exists in Firestore
      const docRef = doc(db, 'users', result.user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // Create basic profile for Google user
        await setDoc(docRef, {
          uid: result.user.uid,
          name: result.user.displayName || '',
          email: result.user.email || '',
          cpf: '',
          phone: '',
          cep: '',
          address: '',
          role: result.user.email === 'gui.lima3009@gmail.com' ? 'admin' : 'user',
          createdAt: new Date()
        });
      }
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar com Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      if (isRegistering) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          cpf,
          phone,
          cep,
          address,
          role: email === 'gui.lima3009@gmail.com' ? 'admin' : 'user',
          createdAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Falha na autenticação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1514] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1590422750036-16017b2f4f22?q=80&w=1920&auto=format&fit=crop" 
          alt="Tavern" 
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1514] via-transparent to-[#1a1514]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 parchment-bg p-10 rounded-xl border-2 border-[#d4af37] relative z-10 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
      >
        <div>
          <div className="flex justify-center">
            <Sword className="h-12 w-12 text-[#4a0e4e]" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-cinzel font-bold text-[#1a1514]">
            {isRegistering ? 'Junte-se à Guilda' : 'Identifique-se, Aventureiro'}
          </h2>
          <p className="mt-2 text-center text-sm font-medieval text-[#3e2723]">
            {isRegistering ? 'Preencha o pergaminho de registro' : 'Apresente suas credenciais para entrar'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative font-medieval text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleEmailAuth}>
          <div className="rounded-md shadow-sm space-y-4">
            {isRegistering && (
              <>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                    placeholder="Nome Completo"
                  />
                </div>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
                  <input
                    type="text"
                    required
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                    placeholder="CPF (Apenas números)"
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                    placeholder="Telefone"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
                  <input
                    type="text"
                    required
                    value={cep}
                    onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                    className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                    placeholder="CEP"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                    placeholder="Endereço Completo"
                  />
                </div>
              </>
            )}
            
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                placeholder="Email"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-[#3e2723]/50" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded relative block w-full px-10 py-3 border border-[#d4af37]/50 placeholder-[#3e2723]/50 text-[#1a1514] bg-[#f1e4c3]/50 focus:outline-none focus:ring-[#d4af37] focus:border-[#d4af37] focus:z-10 sm:text-sm font-medieval"
                placeholder="Senha Secreta"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border-2 border-[#d4af37] text-lg font-cinzel font-bold rounded text-[#f1e4c3] bg-[#097969] hover:bg-[#097969]/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition-colors disabled:opacity-50"
            >
              {loading ? 'Processando...' : (isRegistering ? 'Assinar Contrato' : 'Entrar na Taverna')}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#d4af37]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 parchment-bg text-[#3e2723] font-medieval">Ou use magia antiga</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-[#d4af37] rounded shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#d4af37] transition-colors disabled:opacity-50"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5 mr-2" />
              Continuar com Google
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-medieval text-[#097969] hover:text-[#4a0e4e] transition-colors"
          >
            {isRegistering ? 'Já possui registro? Entre aqui.' : 'Novo por aqui? Junte-se à guilda.'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
