import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import type { Trabalhador, TipoServico } from "../types/api";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Modal } from "../components/ui/Modal";
import { Textarea } from "../components/ui/Textarea";
import { toast } from "react-hot-toast";
import { get, post } from "../lib/api";

interface NewSolicitacaoRequest {
  clienteId: string;
  trabalhadorId: string;
  tipoServico: string;
  descricao: string;
  statusSolicitacao: "PENDENTE";
}

const fetchTrabalhadorById = async (id: string): Promise<Trabalhador> => {
  return get<Trabalhador>(`/trabalhadores/buscarPorId/${id}`);
};

const fetchAvaliacoesTrabalhador = async (workerId: string): Promise<any[]> => {
  try {
    return await get<any[]>(`/avaliacoes-servico/trabalhador/${workerId}`);
  } catch {
    return [];
  }
};

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

export function TrabalhadorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const trabalhadorId = id ? id : "0";

  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation(); // Hook essencial para pegar a URL atual

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [selectedServico, setSelectedServico] = useState<TipoServico | "">("");

  const {
    data: trabalhador,
    isLoading: isLoadingTrabalhador,
    isError,
  } = useQuery<Trabalhador>({
    queryKey: ["trabalhador", trabalhadorId],
    queryFn: () => fetchTrabalhadorById(trabalhadorId),
    enabled: !!id,
  });

  const { data: avaliacoes, isLoading: isLoadingAvaliacoes } = useQuery({
    queryKey: ["avaliacoesTrabalhador", trabalhador?.id],
    queryFn: () => fetchAvaliacoesTrabalhador(trabalhador!.id),
    enabled: !!trabalhador,
  });

  useEffect(() => {
    if (trabalhador) {
      setSelectedServico(trabalhador.servicoPrincipal);
    }
  }, [trabalhador]);

  const mutationCreateSolicitacao = useMutation({
    mutationFn: async (data: NewSolicitacaoRequest) =>
      post("/solicitacoes-servico", data),
    onSuccess: () => {
      toast.success(
        "Solicitação enviada com sucesso! Aguarde o profissional aceitar."
      );
      setIsModalOpen(false);
      setDescricao("");
    },
    onError: (error: any) => {
      const msg =
        error.response?.data?.message || "Erro ao enviar solicitação.";
      toast.error(msg);
    },
  });

  const isLoadingRequest = mutationCreateSolicitacao.isPending;

  const handleOpenModal = () => {
    // A LÓGICA MÁGICA AQUI:
    if (!isAuthenticated) {
      toast("Faça login para solicitar o serviço.", { icon: "🔒" });
      // Redireciona para login, mas salva a página atual (location.pathname) no redirectTo
      navigate(`/login?redirectTo=${location.pathname}`);
      return;
    }

    if (user?.role !== "cliente") {
      toast.error(
        "Apenas clientes podem solicitar serviços. Crie uma conta de cliente."
      );
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmitRequest = () => {
    if (!selectedServico) return toast.error("Selecione um tipo de serviço.");
    if (descricao.length < 10)
      return toast.error("Descreva um pouco mais (mín. 10 caracteres).");

    mutationCreateSolicitacao.mutate({
      clienteId: user!.id,
      trabalhadorId: trabalhadorId,
      tipoServico: selectedServico,
      descricao: descricao,
      statusSolicitacao: "PENDENTE",
    });
  };

  if (isError)
    return (
      <div className="text-center py-20 text-red-500">
        Perfil Não Encontrado
      </div>
    );
  if (isLoadingTrabalhador || !trabalhador)
    return <div className="text-center py-20">Carregando Perfil...</div>;

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
        <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
          <Card className="p-8 flex flex-col items-center text-center shadow-glow-accent">
            <img
              src={trabalhador.avatarUrl || "/default-avatar.png"}
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
            onClick={handleOpenModal}
          >
            Solicitar Serviço 🚀
          </Button>
        </motion.div>

        <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
          <Card className="p-6">
            <Typography
              as="h3"
              className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
            >
              Sobre Mim
            </Typography>
            <Typography as="p">
              {trabalhador.sobre ||
                `Olá! Sou ${trabalhador.nome}, profissional de ${readableService}.`}
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
            </Typography>
            <div className="space-y-6">
              {isLoadingAvaliacoes ? (
                <p className="text-dark-subtle italic text-center py-4">
                  Carregando...
                </p>
              ) : avaliacoes && avaliacoes.length > 0 ? (
                avaliacoes.map((avaliacao) => (
                  <div
                    key={avaliacao.id}
                    className="border-b border-dark-surface/50 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                      <Typography
                        as="h3"
                        className="!text-lg !text-dark-text mb-2 sm:mb-0"
                      >
                        {avaliacao.clienteNome || "Cliente"}
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
                  Sem avaliações ainda.
                </p>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Solicitar ${trabalhador.nome}`}
      >
        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-dark-subtle mb-2">
              Qual serviço você precisa?
            </label>
            <select
              value={selectedServico}
              onChange={(e) =>
                setSelectedServico(e.target.value as TipoServico)
              }
              className="w-full bg-transparent border-2 border-dark-surface rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent"
            >
              {trabalhador.servicos.map((tipo) => (
                <option key={tipo} value={tipo} className="bg-dark-surface">
                  {tipo.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
          <Textarea
            name="descricao"
            label="Descrição do serviço"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Preciso instalar um ar condicionado split 12000 BTUs..."
          />
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleSubmitRequest}
              disabled={isLoadingRequest}
            >
              {isLoadingRequest ? "Enviando..." : "Enviar Solicitação"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
