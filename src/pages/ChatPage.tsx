import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuthStore } from "../store/useAuthStore";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { api, uploadFile } from "../lib/api"; // Usa sua função de upload já pronta
import { toast } from "react-hot-toast";

interface ChatMessage {
  id: number;
  remetente: string;
  conteudo: string;
  tipo: "TEXTO" | "IMAGEM";
  urlArquivo?: string;
  dataEnvio: string;
}

const stompConfig = {
  // Conecta na porta do seu Java
  brokerURL: `ws://${window.location.hostname}:8080/buildrun-livechat-websocket`,
  reconnectDelay: 5000,
};

export function ChatPage() {
  const { servicoId } = useParams<{ servicoId: string }>();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Carrega o histórico do banco assim que abre
  useEffect(() => {
    if (servicoId) {
      api
        .get<ChatMessage[]>(`/chat/historico/${servicoId}`)
        .then((res) => setMessages(res.data))
        .catch((err) => console.error("Erro histórico:", err));
    }
  }, [servicoId]);

  // 2. Conecta no WebSocket
  useEffect(() => {
    if (!user || !servicoId) return;

    const client = new Client(stompConfig);
    stompClientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);
      // Ouve APENAS esse serviço específico
      client.subscribe(`/topics/chat/${servicoId}`, (msg: IMessage) => {
        const newMessage: ChatMessage = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMessage]);
      });
    };

    client.onWebSocketError = () => setIsConnected(false);
    client.activate();

    return () => {
      client.deactivate();
      setIsConnected(false);
    };
  }, [user, servicoId]);

  // Scroll automático pro final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Envia Texto
  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    publish({
      message: inputText,
      type: "TEXTO",
    });
    setInputText("");
  };

  // Envia Imagem
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Enviando foto...");

    try {
      // Sobe pro Cloudinary
      const url = await uploadFile(file);

      // Manda o link pro chat
      publish({
        message: "Foto enviada",
        type: "IMAGEM",
        fileUrl: url,
      });
      toast.success("Foto enviada!", { id: toastId });
    } catch (error) {
      toast.error("Erro ao enviar foto.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const publish = (data: Partial<any>) => {
    if (stompClientRef.current && isConnected) {
      stompClientRef.current.publish({
        destination: `/app/chat/${servicoId}`,
        body: JSON.stringify({
          servicoId: servicoId,
          user: user?.nome,
          ...data,
        }),
      });
    }
  };

  return (
    <div className="flex flex-col h-[75vh] max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Typography as="h2" className="!text-2xl">
          Chat Serviço #{servicoId}
        </Typography>
        <span
          className={`text-sm font-bold ${
            isConnected ? "text-accent" : "text-red-500"
          }`}
        >
          {isConnected ? "● Online" : "● Conectando..."}
        </span>
      </div>

      <Card className="flex-grow overflow-y-auto p-4 mb-4 bg-dark-background/50 border border-dark-surface space-y-3">
        {messages.map((msg, idx) => {
          const isMe = msg.remetente === user?.nome;
          return (
            <div
              key={msg.id || idx}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  isMe
                    ? "bg-primary text-white rounded-br-none"
                    : "bg-dark-surface text-dark-text rounded-bl-none"
                }`}
              >
                {!isMe && (
                  <p className="text-xs text-accent font-bold mb-1">
                    {msg.remetente}
                  </p>
                )}

                {msg.tipo === "IMAGEM" ? (
                  <img
                    src={msg.urlArquivo}
                    alt="Anexo"
                    className="max-w-full rounded-lg cursor-pointer hover:opacity-90 border border-white/20"
                    onClick={() => window.open(msg.urlArquivo, "_blank")}
                  />
                ) : (
                  <p className="text-base break-words">{msg.conteudo}</p>
                )}
                <p className="text-[10px] opacity-70 text-right mt-1">
                  {new Date(msg.dataEnvio).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </Card>

      <form
        onSubmit={handleSendMessage}
        className="flex gap-2 items-center bg-dark-surface p-2 rounded-xl border border-primary/20"
      >
        <label
          className={`cursor-pointer p-2 rounded-full hover:bg-dark-background text-accent transition-all ${
            isUploading ? "opacity-50" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={!isConnected || isUploading}
          />
          {/* Ícone de Clipe */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
            />
          </svg>
        </label>

        <Input
          label=""
          name="chatMsg"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isUploading ? "Enviando..." : "Digite aqui..."}
          className="flex-grow border-none focus:ring-0 !bg-transparent !p-0"
          disabled={!isConnected || isUploading}
          autoComplete="off"
        />

        <Button
          type="submit"
          variant="secondary"
          size="sm"
          disabled={!isConnected || !inputText.trim()}
          className="rounded-full w-10 h-10 !p-0 flex items-center justify-center"
        >
          ➤
        </Button>
      </form>
    </div>
  );
}
