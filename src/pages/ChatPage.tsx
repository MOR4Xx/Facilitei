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
  id: string;
  sender: string; 
  text: string;
  isMe: boolean; 
  timestamp: Date;
}

const stompConfig = {
  // AJUSTE CRÍTICO: Usar 'ws' e porta do backend
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
  const messagesEndRef = useRef<HTMLDivElement>(null); 

  const addMessage = useCallback((rawMessage: string) => {
    const separatorIndex = rawMessage.indexOf(': ');
    const sender = separatorIndex > -1 ? rawMessage.substring(0, separatorIndex) : 'Sistema';
    const text = separatorIndex > -1 ? rawMessage.substring(separatorIndex + 2) : rawMessage;
    const isMe = user?.nome === sender;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString() + Math.random(), sender, text, isMe, timestamp: new Date() },
    ]);
  }, [user]);

  useEffect(() => {
    if (!user) return; 

    console.log('Conectando ao WebSocket...');
    const client = new Client(stompConfig);
    stompClientRef.current = client;

    client.onConnect = (frame) => {
      console.log('Conectado: ' + frame);
      setIsConnected(true);
      // Inscreva-se em um tópico específico para este serviço se possível, ex: /topics/chat/{servicoId}
      // Por enquanto, usando o genérico do seu back:
      client.subscribe('/topics/livechat', (message: IMessage) => {
        try {
          // Se o back manda JSON { content: "..." }
          const parsedBody = JSON.parse(message.body);
          if (parsedBody && parsedBody.content) {
             addMessage(parsedBody.content);
          }
        } catch (e) {
          // Se manda texto puro
          addMessage(message.body);
        }
      });
       addMessage(`Sistema: Conectado ao chat do serviço #${servicoId}.`);
    };

    client.onWebSocketError = (error) => {
      console.error('Erro WebSocket:', error);
      setIsConnected(false);
    };

    client.onStompError = (frame) => {
      console.error('Erro STOMP:', frame.headers['message']);
      setIsConnected(false);
    };

    client.activate();

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [user, servicoId, addMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && stompClientRef.current && isConnected && user) {
      const chatInput = {
        user: user.nome, 
        message: inputText.trim(),
      };
      stompClientRef.current.publish({
        destination: '/app/new-message',
        body: JSON.stringify(chatInput),
      });
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto">
      <Typography as="h1" className="mb-4 text-center !text-2xl sm:!text-3xl">
        Chat - Serviço #{servicoId}
        <span className={`block sm:inline sm:ml-3 text-sm font-normal ${isConnected ? 'text-accent' : 'text-red-500'}`}>
          ({isConnected ? 'Conectado' : 'Desconectado'})
        </span>
      </Typography>

      <Card className="flex-grow overflow-y-auto p-4 mb-4 bg-dark-background/50 border border-dark-surface">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex mb-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-3 rounded-lg max-w-[80%] sm:max-w-[70%] ${
                  msg.isMe
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-surface text-dark-text rounded-bl-none'
                }`}
              >
                {!msg.isMe && (
                   <p className="text-xs text-accent font-semibold mb-1">{msg.sender}</p>
                )}
                <p className="text-base break-words">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </Card>

      <form onSubmit={handleSendMessage} className="flex gap-3 items-start sm:items-center">
        <Input
          label="Digite sua mensagem..."
          name="chat-input" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-grow" 
          disabled={!isConnected}
        />
        <Button
          type="submit"
          variant="secondary"
          size="md" 
          className="!py-3" 
          disabled={!isConnected || !inputText.trim()}
        >
          Enviar
        </Button>
      </form>
    </div>
  );
}