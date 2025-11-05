import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Client, type IMessage } from '@stomp/stompjs';
import { useAuthStore } from '../store/useAuthStore';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string; // Para usar como key no React
  sender: string; // Quem enviou (nome do usuário)
  text: string;
  isMe: boolean; // Para estilizar diferente
  timestamp: Date;
}

// Configuração do cliente STOMP
const stompConfig = {
  brokerURL: `ws://${window.location.hostname}:8080/buildrun-livechat-websocket`,
  reconnectDelay: 5000,
  heartbeatIncoming: 4000,
  heartbeatOutgoing: 4000,
};

export function ChatPage() {
  const { servicoId } = useParams<{ servicoId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); // Para scroll automático

  // Função para adicionar uma nova mensagem formatada à lista
  const addMessage = useCallback((rawMessage: string) => {
    // A mensagem crua vem como "Nome: Texto" do backend
    const separatorIndex = rawMessage.indexOf(': ');
    const sender = separatorIndex > -1 ? rawMessage.substring(0, separatorIndex) : 'Sistema';
    const text = separatorIndex > -1 ? rawMessage.substring(separatorIndex + 2) : rawMessage;
    const isMe = user?.nome === sender;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), sender, text, isMe, timestamp: new Date() },
    ]);
  }, [user]);

  // Efeito para conectar/desconectar o WebSocket
  useEffect(() => {
    if (!user) return; // Só conecta se o usuário estiver logado

    console.log('Tentando conectar ao WebSocket...');
    const client = new Client(stompConfig);
    stompClientRef.current = client;

    client.onConnect = (frame) => {
      console.log('Conectado ao WebSocket: ' + frame);
      setIsConnected(true);
      // Se inscreve no tópico GERAL (conforme backend atual)
      // **MELHORIA FUTURA:** Usar um tópico específico por servicoId, ex: `/topics/chat/${servicoId}`
      client.subscribe('/topics/livechat', (message: IMessage) => {
        try {
          const parsedBody = JSON.parse(message.body);
          if (parsedBody && parsedBody.content) {
             addMessage(parsedBody.content);
          }
        } catch (e) {
          console.error("Erro ao processar mensagem:", e);
          // Se não for JSON, trata como texto simples (fallback)
          addMessage(message.body);
        }
      });
      // Adiciona uma mensagem de sistema
       addMessage(`Você entrou no chat do serviço #${servicoId}.`);
    };

    client.onWebSocketError = (error) => {
      console.error('Erro no WebSocket:', error);
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('Erro no STOMP:', frame.headers['message'], frame.body);
      setIsConnected(false);
    };

    client.activate(); // Ativa a conexão

    // Função de cleanup para desconectar ao sair da página
    return () => {
      console.log('Desconectando do WebSocket...');
      client.deactivate();
      setIsConnected(false);
    };
  }, [user, servicoId, addMessage]); // Dependências do efeito

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && stompClientRef.current && isConnected && user) {
      const chatInput = {
        user: user.nome, // Nome do usuário logado
        message: inputText.trim(),
      };
      // Publica a mensagem para o backend
      stompClientRef.current.publish({
        destination: '/app/new-message',
        body: JSON.stringify(chatInput),
      });
      setInputText(''); // Limpa o input
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto">
      <Typography as="h1" className="mb-4 text-center">
        Chat - Serviço #{servicoId}
        <span className={`ml-3 text-sm font-normal ${isConnected ? 'text-accent' : 'text-red-500'}`}>
          ({isConnected ? 'Conectado' : 'Desconectado'})
        </span>
      </Typography>

      {/* Área das Mensagens */}
      <Card className="flex-grow overflow-y-auto p-4 mb-4 bg-dark-background/50 border border-dark-surface">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex mb-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.isMe
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-surface text-dark-text rounded-bl-none'
                }`}
              >
                {!msg.isMe && (
                   <p className="text-xs text-accent font-semibold mb-1">{msg.sender}</p>
                )}
                <p className="text-base">{msg.text}</p>
                 <p className="text-xs text-right mt-1 opacity-70">
                   {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Elemento invisível para forçar o scroll */}
        <div ref={messagesEndRef} />
      </Card>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
        <Input
          label="Digite sua mensagem..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow"
          disabled={!isConnected}
          required
        />
        <Button
          type="submit"
          variant="secondary"
          size="md"
          disabled={!isConnected || !inputText.trim()}
        >
          Enviar
        </Button>
      </form>
    </div>
  );
}