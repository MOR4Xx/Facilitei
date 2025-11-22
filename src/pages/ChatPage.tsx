import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Client, type IMessage } from '@stomp/stompjs';
import { useAuthStore } from '../store/useAuthStore';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { api, uploadFile } from '../lib/api'; // Importe o uploadFile
import { toast } from 'react-hot-toast';

interface ChatMessage {
  id: number;
  remetente: string;
  conteudo: string;
  tipo: "TEXTO" | "IMAGEM";
  urlArquivo?: string;
  dataEnvio: string;
}

const stompConfig = {
  brokerURL: `ws://${window.location.hostname}:8080/buildrun-livechat-websocket`,
  reconnectDelay: 5000,
};

export function ChatPage() {
  const { servicoId } = useParams<{ servicoId: string }>();
  const { user } = useAuthStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Estado para upload
  
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Carregar histórico ao iniciar
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get<ChatMessage[]>(`/chat/historico/${servicoId}`);
        setMessages(data);
      } catch (error) {
        console.error("Erro ao carregar histórico", error);
      }
    };
    if (servicoId) fetchHistory();
  }, [servicoId]);

  // 2. Conectar WebSocket
  useEffect(() => {
    if (!user || !servicoId) return;

    const client = new Client(stompConfig);
    stompClientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);
      // Se inscreve no tópico ESPECÍFICO desse serviço
      client.subscribe(`/topics/chat/${servicoId}`, (message: IMessage) => {
        try {
          const newMessage: ChatMessage = JSON.parse(message.body);
          setMessages((prev) => [...prev, newMessage]);
        } catch (e) {
          console.error("Erro ao parsear mensagem", e);
        }
      });
    };

    client.onWebSocketError = () => setIsConnected(false);
    client.activate();

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [user, servicoId]);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar Texto
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    
    publishMessage({
      servicoId: Number(servicoId),
      user: user?.nome || 'Anonimo',
      message: inputText,
      type: "TEXTO",
      fileUrl: ""
    });
    setInputText('');
  };

  // Enviar Foto
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Usa sua função existente de upload
      const url = await uploadFile(file);
      
      publishMessage({
        servicoId: Number(servicoId),
        user: user?.nome || 'Anonimo',
        message: "Enviou uma imagem",
        type: "IMAGEM",
        fileUrl: url
      });
      
    } catch (error) {
      toast.error("Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
    }
  };

  // Função auxiliar para publicar no WebSocket
  const publishMessage = (payload: any) => {
    if (stompClientRef.current && isConnected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${servicoId}`, // Manda pro controller específico
        body: JSON.stringify(payload),
      });
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Typography as="h2" className="!text-2xl">Chat do Serviço #{servicoId}</Typography>
        <span className={`text-sm font-bold ${isConnected ? 'text-accent' : 'text-red-500'}`}>
          {isConnected ? '● Online' : '● Conectando...'}
        </span>
      </div>

      {/* Área de Mensagens */}
      <Card className="flex-grow overflow-y-auto p-4 mb-4 bg-dark-background/50 border border-dark-surface space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.remetente === user?.nome;
          return (
            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  isMe
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-surface text-dark-text rounded-bl-none'
                }`}
              >
                {!isMe && <p className="text-xs text-accent font-bold mb-1">{msg.remetente}</p>}
                
                {msg.tipo === "IMAGEM" && msg.urlArquivo ? (
                  <img 
                    src={msg.urlArquivo} 
                    alt="Enviada" 
                    className="max-w-full rounded-lg mb-1 cursor-pointer hover:opacity-90"
                    onClick={() => window.open(msg.urlArquivo, '_blank')} 
                  />
                ) : (
                  <p className="text-base break-words">{msg.conteudo}</p>
                )}
                
                <p className="text-[10px] opacity-70 text-right mt-1">
                  {new Date(msg.dataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="flex gap-2 items-center bg-dark-surface p-2 rounded-xl border border-primary/20">
        
        {/* Botão de Clipe (Upload) */}
        <label className={`cursor-pointer p-2 rounded-full hover:bg-dark-background text-accent transition-all ${isUploading ? 'opacity-50' : ''}`}>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={!isConnected || isUploading} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </label>

        <Input
          label="" // Hack para esconder label
          name="message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isUploading ? "Enviando foto..." : "Digite sua mensagem..."}
          className="flex-grow border-none focus:ring-0 !bg-transparent !p-0"
          disabled={!isConnected || isUploading}
          autoComplete="off"
        />
        
        <Button
          onClick={handleSendMessage}
          variant="secondary"
          size="sm"
          disabled={!isConnected || !inputText.trim()}
          className="rounded-full w-10 h-10 !p-0 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
          </svg>
        </Button>
      </div>
    </div>
  );
}