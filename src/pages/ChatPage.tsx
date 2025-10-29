// src/pages/ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client, type IMessage } from '@stomp/stompjs';
import { useAuthStore } from '../store/useAuthStore';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Typography } from '../components/ui/Typography';
import { Card } from '../components/ui/Card';

// Assumindo que a API Java/Spring roda na porta 8080 (padrão Spring Boot)
// Se for outra porta, ajuste aqui. O endpoint do WebSocket é definido no WebSocketConfig.java
const SOCKET_URL = 'ws://localhost:8080/buildrun-livechat-websocket';

interface ChatMessage {
  user: string;
  content: string;
  timestamp: Date;
  isSender: boolean; // Para diferenciar mensagens do usuário atual
}

export function ChatPage() {
  const { trabalhadorId } = useParams<{ trabalhadorId: string }>();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Para scroll automático

  useEffect(() => {
    // Conectar ao WebSocket
    const client = new Client({
      brokerURL: SOCKET_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Conectado ao WebSocket!');
        setIsConnected(true);
        // Subscrever ao tópico público de chat
        client.subscribe('/topics/livechat', (message: IMessage) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            // Extrai o nome do usuário e a mensagem
            // O formato atual do backend é "Nome: Mensagem"
            const parts = receivedMessage.content.split(': ');
            const senderName = parts[0];
            const content = parts.slice(1).join(': ');

            setMessages((prevMessages) => [
              ...prevMessages,
              {
                user: senderName,
                content: content,
                timestamp: new Date(),
                isSender: senderName === user?.nome, // Verifica se a mensagem é do usuário atual
              },
            ]);
          } catch (error) {
            console.error('Erro ao processar mensagem recebida:', error);
            // Adiciona mensagem crua se não conseguir parsear
             setMessages((prevMessages) => [
              ...prevMessages,
              {
                user: 'Sistema',
                content: message.body,
                timestamp: new Date(),
                isSender: false,
              },
            ]);
          }
        });
      },
      onDisconnect: () => {
        console.log('Desconectado do WebSocket.');
        setIsConnected(false);
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
       onWebSocketError: (error) => {
         console.error('Error with websocket', error);
       }
    });

    stompClientRef.current = client;
    client.activate();

    // Desconectar ao desmontar o componente
    return () => {
      client.deactivate();
    };
  }, [user?.nome]); // Dependência no user.nome para comparação isSender

  // Scroll para a última mensagem
   useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && stompClientRef.current?.connected && user) {
      stompClientRef.current.publish({
        destination: '/app/new-message',
        body: JSON.stringify({ user: user.nome, message: inputMessage }),
      });
      setInputMessage('');
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-w-3xl mx-auto">
       <Typography as="h2" className="text-center mb-4">
         Chat com Profissional #{trabalhadorId}
       </Typography>
       {!isConnected && <p className="text-center text-red-500">Conectando ao chat...</p>}
      <Card className="flex-grow flex flex-col p-4 overflow-hidden mb-4">
        {/* Área de Mensagens */}
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isSender ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  msg.isSender
                    ? 'bg-primary text-white rounded-br-none'
                    : 'bg-dark-surface text-dark-text rounded-bl-none'
                }`}
              >
                 {!msg.isSender && <p className="text-xs font-semibold text-accent mb-1">{msg.user}</p>}
                <p>{msg.content}</p>
                 <p className={`text-xs mt-1 ${msg.isSender ? 'text-gray-300 text-right' : 'text-dark-subtle text-left'}`}>
                   {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                 </p>
              </div>
            </div>
          ))}
           <div ref={messagesEndRef} /> {/* Elemento para scroll */}
        </div>
      </Card>

      {/* Input de Mensagem */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          label="Digite sua mensagem..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className="flex-grow"
          disabled={!isConnected}
        />
        <Button type="submit" variant="secondary" disabled={!isConnected || !inputMessage.trim()}>
          Enviar
        </Button>
      </form>
    </div>
  );
}