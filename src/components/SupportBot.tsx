import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Phone, ChevronLeft } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  isHtml?: boolean;
}

type MenuCategory = 'main' | 'pedidos' | 'produtos' | 'pagamentos' | 'politicas';

export default function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMenu, setCurrentMenu] = useState<MenuCategory>('main');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Saudações, viajante! Sou o ajudante da Taverna. Sobre o que deseja falar hoje?', sender: 'bot' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, currentMenu]);

  const handleOptionClick = (option: string, nextMenu?: MenuCategory) => {
    // Adiciona a mensagem do usuário
    const userMsg: Message = { id: Date.now().toString(), text: option, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);

    if (nextMenu) {
      setTimeout(() => {
        setCurrentMenu(nextMenu);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: 'Certo, escolha uma das opções abaixo:', sender: 'bot' }]);
      }, 300);
      return;
    }

    // Respostas definitivas
    setTimeout(() => {
      let botResponse = '';
      let isHtml = false;

      switch (option) {
        // Pedidos e Entrega
        case 'Onde está meu pedido?':
          botResponse = 'Para rastrear seu pedido, acesse a aba "Meus Pedidos" no seu Perfil. Lá você verá o status atualizado da sua encomenda.';
          break;
        case 'Como funciona o frete?':
          botResponse = 'Enviamos para todo o reino (Brasil)! O valor do frete é calculado automaticamente no carrinho de acordo com o seu CEP.';
          break;
        case 'Qual o prazo de entrega?':
          botResponse = 'O prazo varia conforme a sua região. Geralmente, as capitais recebem em 3 a 5 dias úteis, e o interior em até 10 dias úteis.';
          break;
        case 'Posso alterar o endereço de entrega?':
          botResponse = 'Se o pedido ainda não foi despachado, sim! Entre em contato com o Mestre (atendente) o mais rápido possível pelo WhatsApp.';
          break;

        // Produtos e Estoque
        case 'Fazem dados personalizados?':
          botResponse = 'No momento não fazemos dados sob encomenda, mas trazemos novidades exclusivas toda lua cheia (todo mês)!';
          break;
        case 'Um item está esgotado, vai voltar?':
          botResponse = 'A maioria dos nossos artefatos retorna ao estoque em algumas semanas. Fique de olho na taverna!';
          break;
        case 'Como cuidar das miniaturas?':
          botResponse = 'Mantenha-as longe do sol forte e limpe apenas com um pincel macio e seco. Evite produtos químicos para não danificar a pintura.';
          break;
        case 'Tabela de medidas das roupas':
          botResponse = 'Na página de cada vestimenta (camiseta/moletom) você encontra as medidas exatas na descrição do produto.';
          break;

        // Pagamentos e Reembolso
        case 'Quais as formas de pagamento?':
          botResponse = 'Aceitamos moedas de ouro (PIX), Cartão de Crédito em até 12x e Boleto Bancário.';
          break;
        case 'Meu pagamento foi recusado':
          botResponse = 'Geralmente isso ocorre por bloqueio do próprio banco. Tente novamente ou escolha a opção PIX para aprovação instantânea.';
          break;
        case 'Como pedir reembolso?':
          botResponse = 'Se você se arrependeu ou o item chegou com defeito, fale com nosso suporte no WhatsApp em até 7 dias após o recebimento.';
          break;

        // Políticas
        case 'Política de devolução':
          botResponse = 'Você tem até 7 dias após o recebimento para solicitar a devolução. O item deve estar na embalagem original e sem marcas de batalha (uso).';
          break;
        case 'Vocês têm loja física?':
          botResponse = 'Nossa taverna é 100% digital! Isso nos permite enviar artefatos para aventureiros de todo o país.';
          break;
        case 'Fazem embalagem para presente?':
          botResponse = 'Sim! Basta adicionar uma nota no momento do checkout pedindo para embrulhar para presente.';
          break;

        // Atendente
        case 'Falar com o Mestre (Atendente)':
          botResponse = 'Você pode falar diretamente com o Mestre da Taverna pelo WhatsApp: (11) 99912-3009.<br/><br/><a href="https://wa.me/5511999123009" target="_blank" rel="noopener noreferrer" class="inline-block bg-[#25D366] text-white px-4 py-2 rounded font-bold hover:bg-[#128C7E] transition-colors text-center w-full">Abrir WhatsApp</a>';
          isHtml = true;
          break;

        default:
          botResponse = 'Desculpe, não entendi. Por favor, escolha uma das opções abaixo.';
      }

      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), text: botResponse, sender: 'bot', isHtml }]);
      
      // Volta pro menu principal após responder
      setTimeout(() => {
        setCurrentMenu('main');
      }, 2000);

    }, 500);
  };

  const renderMenuOptions = () => {
    switch (currentMenu) {
      case 'pedidos':
        return (
          <>
            <button onClick={() => handleOptionClick('Onde está meu pedido?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">📦 Onde está meu pedido?</button>
            <button onClick={() => handleOptionClick('Como funciona o frete?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🚚 Como funciona o frete?</button>
            <button onClick={() => handleOptionClick('Qual o prazo de entrega?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">⏳ Qual o prazo de entrega?</button>
            <button onClick={() => handleOptionClick('Posso alterar o endereço de entrega?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🗺️ Posso alterar o endereço?</button>
          </>
        );
      case 'produtos':
        return (
          <>
            <button onClick={() => handleOptionClick('Fazem dados personalizados?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🎲 Fazem dados personalizados?</button>
            <button onClick={() => handleOptionClick('Um item está esgotado, vai voltar?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🔄 Item esgotado volta?</button>
            <button onClick={() => handleOptionClick('Como cuidar das miniaturas?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🛡️ Como cuidar das miniaturas?</button>
            <button onClick={() => handleOptionClick('Tabela de medidas das roupas')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">👕 Tabela de medidas (Roupas)</button>
          </>
        );
      case 'pagamentos':
        return (
          <>
            <button onClick={() => handleOptionClick('Quais as formas de pagamento?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">💳 Formas de pagamento</button>
            <button onClick={() => handleOptionClick('Meu pagamento foi recusado')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">❌ Pagamento recusado</button>
            <button onClick={() => handleOptionClick('Como pedir reembolso?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">💰 Como pedir reembolso?</button>
          </>
        );
      case 'politicas':
        return (
          <>
            <button onClick={() => handleOptionClick('Política de devolução')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">↩️ Política de devolução</button>
            <button onClick={() => handleOptionClick('Vocês têm loja física?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🏰 Vocês têm loja física?</button>
            <button onClick={() => handleOptionClick('Fazem embalagem para presente?')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors">🎁 Embalagem para presente</button>
          </>
        );
      case 'main':
      default:
        return (
          <>
            <button onClick={() => handleOptionClick('Dúvidas sobre Pedidos e Entrega', 'pedidos')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors flex justify-between items-center">
              📦 Pedidos e Entrega <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={() => handleOptionClick('Dúvidas sobre Produtos e Estoque', 'produtos')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors flex justify-between items-center">
              ⚔️ Produtos e Estoque <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={() => handleOptionClick('Dúvidas sobre Pagamentos', 'pagamentos')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors flex justify-between items-center">
              💳 Pagamentos e Reembolso <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={() => handleOptionClick('Regras da Taverna (Políticas)', 'politicas')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors flex justify-between items-center">
              📜 Regras da Taverna <ChevronLeft className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={() => handleOptionClick('Falar com o Mestre (Atendente)')} className="text-left text-sm bg-[#1a1514] hover:bg-[#3e2723] text-[#f1e4c3] border border-[#d4af37]/30 p-2 rounded transition-colors flex items-center gap-2 mt-2">
              <Phone className="w-4 h-4 text-[#25D366]" /> Falar com o Mestre (WhatsApp)
            </button>
          </>
        );
    }
  };

  return (
    <>
      {/* Janela do Chat */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[90vw] sm:w-96 h-[500px] max-h-[75vh] bg-[#1a1514] border border-[#d4af37]/30 rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 font-medieval">
          {/* Cabeçalho */}
          <div className="bg-[#3e2723] p-4 flex justify-between items-center border-b border-[#d4af37]/30 shrink-0">
            <div className="flex items-center gap-2 text-[#d4af37]">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-cinzel font-bold">Suporte da Taverna</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-[#f1e4c3] hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Área de Mensagens */}
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#1a1514]/90">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-[#097969] text-[#f1e4c3] rounded-tr-none' 
                      : 'bg-[#3e2723] text-[#f1e4c3] rounded-tl-none border border-[#d4af37]/20'
                  }`}
                >
                  {msg.isHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: msg.text }} className="text-sm space-y-2" />
                  ) : (
                    <p className="text-sm">{msg.text}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Opções (Botões) */}
          <div className="p-3 bg-[#2a1f1d] border-t border-[#d4af37]/20 flex flex-col gap-2 shrink-0 max-h-[40%] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-[#d4af37]">Escolha uma opção:</p>
              {currentMenu !== 'main' && (
                <button 
                  onClick={() => setCurrentMenu('main')}
                  className="text-xs text-[#f1e4c3] hover:text-[#d4af37] flex items-center"
                >
                  <ChevronLeft className="w-3 h-3" /> Voltar
                </button>
              )}
            </div>
            {renderMenuOptions()}
          </div>
        </div>
      )}

      {/* Bolinha Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 sm:right-6 bg-[#097969] text-[#f1e4c3] p-4 rounded-full shadow-lg hover:bg-[#097969]/80 transition-all z-50 border border-[#d4af37]/50 hover:scale-110 flex items-center justify-center"
        aria-label="Abrir suporte"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
