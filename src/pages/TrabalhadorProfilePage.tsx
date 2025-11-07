import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom"; // 👈 Adicionar useLocation
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import type {
  Trabalhador,
  Cliente,
  TipoServico,
  Servico,
  AvaliacaoTrabalhador,
} from "../types/api";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Modal } from "../components/ui/Modal";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "react-hot-toast";

interface NewServicoRequest {
  titulo: string;
  descricao: string;
  preco: number;
  trabalhadorId: string;
  clienteId: string;
  disponibilidadeId: number; // Mockado
  tipoServico: TipoServico;
  statusServico: "PENDENTE" | "SOLICITADO";
}

interface NewSolicitacaoRequest {
  clienteId: string;
  servicoId: string;
  descricao: string;
  statusSolicitacao: "PENDENTE";
}
// --- FUNÇÕES DE BUSCA ---
const fetchTrabalhadorById = async (id: string): Promise<Trabalhador> => {
  const response = await fetch(`http://localhost:3333/trabalhadores/${id}`);
  if (!response.ok) {
    throw new Error("Profissional não encontrado.");
  }
  return response.json();
};

const fetchAvaliacoesTrabalhador = async (
  workerId: string
): Promise<AvaliacaoTrabalhador[]> => {
  const response = await fetch(
    `http://localhost:3333/avaliacoes-trabalhador?trabalhadorId=${workerId}`
  );
  if (!response.ok) return [];
  const avaliacoes: AvaliacaoTrabalhador[] = await response.json();

  const avaliacoesComNomes = await Promise.all(
    avaliacoes.map(async (avaliacao) => {
      const clienteResponse = await fetch(
        `http://localhost:3333/clientes/${avaliacao.clienteId}`
      );
      if (clienteResponse.ok) {
        const cliente: Cliente = await clienteResponse.json();
        return { ...avaliacao, clienteNome: cliente.nome };
      }
      return { ...avaliacao, clienteNome: "Cliente Anônimo" };
    })
  );

  return avaliacoesComNomes;
};

// --- FUNÇÕES DE ENVIO (MUTATION) ---
const createServico = async (data: NewServicoRequest): Promise<Servico> => {
  const response = await fetch(`http://localhost:3333/servicos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar o serviço.");
  return response.json();
};

const createSolicitacao = async (data: NewSolicitacaoRequest) => {
  const response = await fetch(`http://localhost:3333/solicitacoes-servico`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Falha ao criar a solicitação.");
  return response.json();
};

// --- VARIANTES DE ANIMAÇÃO ---
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, duration: 0.4 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- COMPONENTE DE RATING (Estrelas) ---
const Rating = ({ score }: { score: number }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < score ? "text-accent" : "text-dark-subtle/50"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-1">{stars}</div>;
};

// --- COMPONENTE PRINCIPAL: TRABALHADOR PROFILE PAGE ---
export function TrabalhadorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const trabalhadorId = id ? id : "0";

  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // 👈 Obter a localização atual

  // Estados do Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [selectedServico, setSelectedServico] = useState<TipoServico | "">("");

  const queryClient = useQueryClient();

  const {
    data: trabalhador,
    isLoading: isLoadingTrabalhador, // Renomeado para clareza
    isError,
  } = useQuery<Trabalhador>({
    queryKey: ["trabalhador", trabalhadorId],
    queryFn: () => fetchTrabalhadorById(trabalhadorId),
    enabled: trabalhadorId > 0,
  });

  const {
    data: avaliacoes,
    isLoading: isLoadingAvaliacoes, // Novo estado de loading
  } = useQuery({
    queryKey: ["avaliacoesTrabalhador", trabalhador?.id], // A key depende do ID do trabalhador
    queryFn: () => fetchAvaliacoesTrabalhador(trabalhador!.id),
    enabled: !!trabalhador, // SÓ RODA QUANDO O 'trabalhador' TIVER CARREGADO
  });

  // Efeito para ATUALIZAR o modal quando o trabalhador MUDAR
  useEffect(() => {
    if (trabalhador) {
      setSelectedServico(trabalhador.servicoPrincipal);
    }
  }, [trabalhador]);

  // --- LÓGICA DE MUTATION (ENVIO DA SOLICITAÇÃO) ---
  const mutationCreateServico = useMutation({
    mutationFn: createServico,
    onSuccess: (newServico) => {
      // Sucesso! Agora, crie a solicitação
      const solicitacaoData: NewSolicitacaoRequest = {
        clienteId: user!.id,
        servicoId: newServico.id,
        descricao: descricao,
        statusSolicitacao: "PENDENTE",
      };
      mutationCreateSolicitacao.mutate(solicitacaoData);
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
    },
  });

  // Mutation para criar a solicitação
  const mutationCreateSolicitacao = useMutation({
    mutationFn: createSolicitacao,
    onSuccess: () => {
      // SUCESSO TOTAL!
      toast.success("Solicitação enviada! O profissional foi notificado.");

      // Limpa os campos e fecha o modal após um tempo
      setTimeout(() => {
        setIsModalOpen(false);
        setDescricao("");
      }, 2000);

      queryClient.invalidateQueries({ queryKey: ["workerData"] });
      queryClient.invalidateQueries({ queryKey: ["servicos"] });
    },
    onError: (error) => {
      toast.error(`Erro final: ${error.message}`);
    },
  });

  const isLoadingRequest =
    mutationCreateServico.isPending || mutationCreateSolicitacao.isPending;

  const isSuccessRequest = mutationCreateSolicitacao.isSuccess;

  // Função chamada pelo botão "Enviar" do Modal
  const handleSubmitRequest = () => {
    // 1. Validação
    if (!isAuthenticated || user?.role !== "cliente") {
      toast.error("Você precisa estar logado como cliente.");
      return;
    }
    if (!selectedServico) {
      toast.error("Selecione um tipo de serviço.");
      return;
    }
    if (descricao.length < 10) {
      toast.error("Descreva um pouco mais o que precisa (mín. 10 caracteres).");
      return;
    }

    // 2. Monta o corpo do NOVO SERVIÇO
    const servicoData: NewServicoRequest = {
      titulo: `Solicitação de ${selectedServico.replace(/_/g, " ")}`,
      descricao: descricao,
      preco: 0, // Preço a combinar
      trabalhadorId: trabalhadorId,
      clienteId: user.id,
      disponibilidadeId: 1, // Mockado, como no db.json
      tipoServico: selectedServico,
      statusServico: "PENDENTE", // Status inicial do serviço
    };

    // 3. Inicia a primeira mutation
    mutationCreateServico.mutate(servicoData);
  };

  // --- Funções de Handler do Modal (MODIFICADA) ---
  const handleOpenModal = () => {
    // 1. Se NÃO ESTÁ LOGADO
    if (!isAuthenticated) {
      toast.error("Você precisa fazer login como cliente para solicitar.");
      // Redireciona para o login, guardando a página atual
      navigate(`/login?redirectTo=${location.pathname}`);
      return;
    }
    // 2. Se ESTÁ LOGADO, MAS É UM TRABALHADOR
    if (user?.role !== "cliente") {
      toast.error("Apenas clientes podem solicitar serviços.");
      return;
    }
    // 3. Se ESTÁ LOGADO E É UM CLIENTE
    setIsModalOpen(true);
  };

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Perfil Não Encontrado</Typography>
        <p className="text-dark-subtle mt-4">
          O profissional que você busca não está disponível.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  // ATUALIZADO: Espera o perfil principal carregar
  if (isLoadingTrabalhador) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Carregando Perfil...</Typography>
        <p className="text-dark-subtle mt-4">
          Preparando o perfil completo do profissional.
        </p>
      </div>
    );
  }

  if (!trabalhador) return null; // Se não está carregando e não tem trabalhador, não renderiza

  const [primeiroNome] = trabalhador.nome.split(" ");
  const readableService =
    trabalhador.servicoPrincipal.charAt(0).toUpperCase() +
    trabalhador.servicoPrincipal.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"
      >
        {/* Coluna da Esquerda: Perfil e Ações */}
        <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
          <Card className="p-8 flex flex-col items-center text-center shadow-glow-accent">
            <img
              src={trabalhador.avatarUrl}
              alt={trabalhador.nome}
              className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-accent shadow-lg"
            />
            <Typography as="h2" className="!text-3xl !text-primary">
              {trabalhador.nome}
            </Typography>
            <Typography
              as="p"
              className="text-xl font-semibold !text-accent mb-2"
            >
              {readableService}
            </Typography>
            <div className="mt-2">
              <Rating score={trabalhador.notaTrabalhador} />
            </div>
            <p className="text-sm text-dark-subtle mt-1">
              Nota Média: {trabalhador.notaTrabalhador.toFixed(1)}
            </p>
          </Card>

          <Card className="p-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
            >
              Disponibilidade
            </Typography>
            <p className="text-dark-text text-center font-medium">
              {trabalhador.disponibilidade}
            </p>
          </Card>

          <Button
            variant="secondary"
            size="lg"
            className="w-full shadow-lg shadow-accent/40"
            onClick={handleOpenModal} // AÇÃO DO BOTÃO ATUALIZADA
          >
            Solicitar Serviço 🚀
          </Button>
        </motion.div>

        {/* Coluna da Direita: Detalhes e Avaliações */}
        <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
          <Card className="p-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
            >
              Sobre Mim
            </Typography>
            <Typography as="p">
              Olá! Sou {primeiroNome}, um profissional dedicado e com vasta
              experiência em {readableService}. Meu compromisso é com a
              qualidade e a satisfação do cliente, buscando sempre a melhor
              solução para suas necessidades. Estou pronto para te ajudar!
            </Typography>
          </Card>

          <Card className="p-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
            >
              Serviços Prestados
            </Typography>
            <div className="flex flex-wrap gap-3">
              {trabalhador.servicos.map((servico, index) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-dark-surface/50 text-dark-text rounded-full text-sm font-medium border border-dark-surface"
                >
                  {servico.replace(/_/g, " ")}
                </span>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
            >
              Avaliações de Clientes ({avaliacoes?.length || 0})
              {/* Atualizado */}
            </Typography>
            <div className="space-y-6">
              {/* ATUALIZADO: Checa o novo isLoading das avaliações */}
              {isLoadingAvaliacoes ? (
                <p className="text-dark-subtle italic text-center py-4">
                  Carregando avaliações...
                </p>
              ) : avaliacoes && avaliacoes.length > 0 ? (
                avaliacoes.map((avaliacao) => (
                  <div
                    key={avaliacao.id}
                    className="border-b border-dark-surface/50 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <Typography as="h3" className="!text-lg !text-dark-text">
                        {avaliacao.clienteNome}
                      </Typography>
                      <Rating score={avaliacao.nota} />
                    </div>
                    <Typography as="p" className="italic">
                      "{avaliacao.comentario}"
                    </Typography>
                  </div>
                ))
              ) : (
                <p className="text-dark-subtle italic text-center py-4">
                  Este profissional ainda não possui avaliações.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* --- MODAL DE SOLICITAÇÃO --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Solicitar ${primeiroNome}`}
      >
        <div className="space-y-6">
          {/* O "MARCADOR" (SELECT) */}
          <div className="relative">
            <label
              htmlFor="servicoTipo"
              className="block text-sm font-medium text-dark-subtle mb-2"
            >
              Qual serviço você precisa? (o "marcador")
            </label>
            <select
              id="servicoTipo"
              value={selectedServico}
              onChange={(e) =>
                setSelectedServico(e.target.value as TipoServico)
              }
              className="w-full bg-transparent border-2 border-dark-surface rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent"
            >
              <option value="" disabled>
                Selecione um serviço...
              </option>
              {trabalhador.servicos.map((tipo) => (
                <option key={tipo} value={tipo} className="bg-dark-surface">
                  {tipo.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          {/* A "BREVE DESCRIÇÃO" (TEXTAREA) */}
          <Textarea
            name="textarea"
            label="Breve descrição do serviço"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Preciso instalar um ar condicionado de 9000 BTUs na sala."
          />

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoadingRequest || isSuccessRequest}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSubmitRequest}
              disabled={isLoadingRequest || isSuccessRequest}
            >
              {isLoadingRequest
                ? "Enviando..."
                : isSuccessRequest
                ? "Enviado!"
                : "Enviar Solicitação"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}