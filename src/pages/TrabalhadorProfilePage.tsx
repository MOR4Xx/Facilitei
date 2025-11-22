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
import { CheckIcon, WrenchScrewdriverIcon } from "../components/ui/Icons";

const fetchTrabalhadorById = async (id: string): Promise<Trabalhador> =>
  get<Trabalhador>(`/trabalhadores/buscarPorId/${id}`);
const fetchAvaliacoesTrabalhador = async (workerId: string): Promise<any[]> => {
  try {
    return await get<any[]>(`/avaliacoes-servico/trabalhador/${workerId}`);
  } catch {
    return [];
  }
};

const Rating = ({ score }: { score: number }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < score
            ? "text-accent drop-shadow-[0_0_5px_rgba(163,230,53,0.6)]"
            : "text-dark-subtle/20"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-1">{stars}</div>;
};

export function TrabalhadorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const trabalhadorId = id || "0";
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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
    if (trabalhador) setSelectedServico(trabalhador.servicoPrincipal);
  }, [trabalhador]);

  const mutationCreateSolicitacao = useMutation({
    mutationFn: async (data: any) => post("/solicitacoes-servico", data),
    onSuccess: () => {
      toast.success("Solicitação enviada! Aguarde o aceite.");
      setIsModalOpen(false);
      setDescricao("");
    },
    onError: (error: any) =>
      toast.error(error.response?.data?.message || "Erro ao enviar."),
  });

  const handleOpenModal = () => {
    if (!isAuthenticated) {
      toast("Faça login para contratar.", { icon: "🔒" });
      navigate(`/login?redirectTo=${location.pathname}`);
      return;
    }
    if (user?.role !== "cliente") {
      toast.error("Apenas clientes podem solicitar serviços.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmitRequest = () => {
    if (!selectedServico) return toast.error("Selecione um serviço.");
    if (descricao.length < 10)
      return toast.error("Descreva melhor (mín. 10 caracteres).");
    mutationCreateSolicitacao.mutate({
      clienteId: user!.id,
      trabalhadorId,
      tipoServico: selectedServico,
      descricao,
      statusSolicitacao: "PENDENTE",
    });
  };

  if (isError || (!isLoadingTrabalhador && !trabalhador))
    return (
      <div className="text-center py-32 text-red-500">Perfil Indisponível</div>
    );
  if (isLoadingTrabalhador)
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      {/* HERO BANNER (Fundo do Perfil) */}
      <div className="relative h-64 w-full rounded-b-[3rem] bg-gradient-to-r from-dark-surface to-primary/20 overflow-hidden mb-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-background to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA DA ESQUERDA (Info Principal) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 flex flex-col items-center text-center border-t-4 border-t-accent relative overflow-visible">
              <div className="relative -mt-20 mb-4">
                <img
                  src={trabalhador!.avatarUrl || "/default-avatar.png"}
                  alt={trabalhador!.nome}
                  className="w-40 h-40 rounded-full object-cover border-4 border-dark-background shadow-2xl"
                />
                <div
                  className="absolute bottom-2 right-2 bg-green-500 w-5 h-5 rounded-full border-4 border-dark-surface"
                  title="Disponível"
                ></div>
              </div>

              <h1 className="text-3xl font-extrabold text-white mb-1">
                {trabalhador!.nome}
              </h1>
              <p className="text-accent font-semibold uppercase tracking-wider text-sm mb-4">
                {trabalhador!.servicoPrincipal.replace(/_/g, " ")}
              </p>

              <Rating score={trabalhador!.notaTrabalhador} />
              <span className="text-sm text-dark-subtle mt-1 mb-6">
                ({trabalhador!.notaTrabalhador.toFixed(1)} de 5.0)
              </span>

              <div className="w-full space-y-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-subtle">Cidade</span>
                  <span className="font-medium text-white">
                    {trabalhador!.endereco?.cidade}/
                    {trabalhador!.endereco?.estado}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-subtle">Disponibilidade</span>
                  <span className="font-medium text-white">
                    {trabalhador!.disponibilidade}
                  </span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="lg"
                className="w-full mt-8 shadow-glow-accent font-bold text-lg"
                onClick={handleOpenModal}
              >
                Contratar Agora 🚀
              </Button>
            </Card>
          </motion.div>

          {/* COLUNA DA DIREITA (Detalhes) */}
          <div className="lg:col-span-2 space-y-8 pt-12 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-8 bg-dark-surface/40 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-primary/20 p-2 rounded-lg">
                    <span className="text-2xl">📝</span>
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Sobre o Profissional
                  </Typography>
                </div>
                <p className="text-dark-text/90 leading-relaxed text-lg">
                  {trabalhador!.sobre ||
                    `Olá! Sou ${
                      trabalhador!.nome
                    }, especialista em ${trabalhador!.servicoPrincipal
                      .replace(/_/g, " ")
                      .toLowerCase()}. Estou pronto para resolver seu problema com qualidade e dedicação.`}
                </p>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-accent" />
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Habilidades
                  </Typography>
                </div>
                <div className="flex flex-wrap gap-3">
                  {trabalhador!.servicos.map((servico, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-dark-background border border-white/10 rounded-full text-sm text-white hover:border-accent/50 transition-colors cursor-default"
                    >
                      {servico.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-yellow-500/10 p-2 rounded-lg">
                    <span className="text-xl">⭐</span>
                  </div>
                  <Typography as="h3" className="!text-xl">
                    Avaliações ({avaliacoes?.length || 0})
                  </Typography>
                </div>

                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {isLoadingAvaliacoes ? (
                    <p className="text-center py-4">Carregando...</p>
                  ) : avaliacoes && avaliacoes.length > 0 ? (
                    avaliacoes.map((av) => (
                      <div
                        key={av.id}
                        className="bg-dark-background/50 p-4 rounded-xl border border-white/5"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white">
                            {av.clienteNome || "Cliente"}
                          </span>
                          <Rating score={av.nota} />
                        </div>
                        <p className="text-dark-subtle italic">
                          "{av.comentario}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-dark-subtle text-center py-4">
                      Sem avaliações ainda.
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Solicitar Serviço`}
      >
        <div className="space-y-5">
          <p className="text-sm text-dark-subtle">
            Você está contratando{" "}
            <span className="text-white font-bold">{trabalhador!.nome}</span>.
          </p>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">
              Tipo de Serviço
            </label>
            <select
              value={selectedServico}
              onChange={(e) =>
                setSelectedServico(e.target.value as TipoServico)
              }
              className="w-full bg-dark-background border border-primary/30 rounded-lg p-3 text-white focus:border-accent outline-none"
            >
              {trabalhador!.servicos.map((s) => (
                <option key={s} value={s}>
                  {s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            name="descricao"
            label="Descreva o que precisa"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Preciso instalar 2 ares-condicionados no quarto e sala..."
          />

          <div className="flex gap-3 pt-4">
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
              disabled={mutationCreateSolicitacao.isPending}
            >
              {mutationCreateSolicitacao.isPending
                ? "Enviando..."
                : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
