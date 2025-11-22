import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuthStore } from "../store/useAuthStore";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { api, uploadFile } from "../lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (servicoId) {
      api
        .get<ChatMessage[]>(`/chat/historico/${servicoId}`)
        .then((res) => setMessages(res.data))
        .catch(() => toast.error("Erro ao carregar histórico."));
    }
  }, [servicoId]);

  useEffect(() => {
    if (!user || !servicoId) return;
    const client = new Client(stompConfig);
    stompClientRef.current = client;

    client.onConnect = () => {
      setIsConnected(true);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !isConnected) return;

    if (stompClientRef.current) {
      stompClientRef.current.publish({
        destination: `/app/chat/${servicoId}`,
        body: JSON.stringify({
          servicoId,
          user: user?.nome,
          message: inputText,
          type: "TEXTO",
        }),
      });
      setInputText("");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const toastId = toast.loading("Enviando imagem...");

    try {
      const url = await uploadFile(file);
      if (stompClientRef.current) {
        stompClientRef.current.publish({
          destination: `/app/chat/${servicoId}`,
          body: JSON.stringify({
            servicoId,
            user: user?.nome,
            message: "Imagem enviada",
            type: "IMAGEM",
            fileUrl: url,
          }),
        });
      }
      toast.success("Enviado!", { id: toastId });
    } catch {
      toast.error("Erro no upload.", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col max-w-4xl mx-auto">
      {/* Header do Chat */}
      <div className="flex justify-between items-center mb-4 p-4 bg-dark-surface/80 backdrop-blur-md rounded-xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-dark-subtle hover:text-white transition-colors"
          >
            ← Voltar
          </button>
          <div>
            <Typography as="h2" className="!text-lg font-bold">
              Chat do Serviço #{servicoId}
            </Typography>
            <span
              className={`text-xs flex items-center gap-1 ${
                isConnected ? "text-accent" : "text-red-500"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-accent animate-pulse" : "bg-red-500"
                }`}
              />
              {isConnected ? "Online" : "Reconectando..."}
            </span>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <Card className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-dark-background/40 border-white/5">
        {messages.map((msg, idx) => {
          const isMe = msg.remetente === user?.nome;
          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] sm:max-w-[60%] p-4 rounded-2xl shadow-md text-sm sm:text-base ${
                  isMe
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-dark-surface text-dark-text rounded-tl-none border border-white/10"
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
                    className="rounded-lg max-h-60 w-full object-cover cursor-pointer hover:opacity-90"
                    onClick={() => window.open(msg.urlArquivo, "_blank")}
                  />
                ) : (
                  <p className="break-words leading-relaxed">{msg.conteudo}</p>
                )}

                <p
                  className={`text-[10px] mt-2 text-right ${
                    isMe ? "text-white/60" : "text-dark-subtle"
                  }`}
                >
                  {new Date(msg.dataEnvio).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </motion.div>
          );
        })}
        <div ref={messagesEndRef} />
      </Card>

      {/* Input Area */}
      <div className="mt-4 p-2 bg-dark-surface rounded-xl border border-primary/20 flex items-center gap-2 shadow-lg">
        <label
          className={`p-3 rounded-full hover:bg-white/5 cursor-pointer transition-colors text-dark-subtle hover:text-accent ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={!isConnected || isUploading}
          />
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
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </label>

        <Input
          label=""
          name="chat"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Digite sua mensagem..."
          className="border-none bg-transparent focus:ring-0 !shadow-none px-0"
          disabled={!isConnected}
          autoComplete="off"
        />

        <Button
          onClick={() => handleSendMessage()}
          disabled={!isConnected || !inputText.trim()}
          className="rounded-full w-12 h-12 p-0 flex items-center justify-center bg-gradient-to-r from-primary to-primary-hover shadow-glow-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
}
