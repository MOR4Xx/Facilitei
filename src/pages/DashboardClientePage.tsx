import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import type {
  Servico,
  Trabalhador,
  StatusServico,
  AvaliacaoServico,
} from "../types/api";
import { useNavigate } from "react-router-dom";
import { TrabalhadorCard } from "../components/ui/TrabalhadorCard";
import { cardItemVariants } from "../lib/variants";
import { useMemo, useState } from "react";
import {
  BriefcaseIcon,
  CheckIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  XMarkIcon,
  CalendarDaysIcon,
} from "../components/ui/Icons";
import { AvaliacaoModal } from "../components/ui/AvaliacaoModal";
import { api, get, put } from "../lib/api";

// --- FUNÇÕES DE BUSCA (API) ---
const fetchServicosCliente = async (clienteId: string): Promise<Servico[]> => {
  // Agora busca apenas os serviços daquele cliente específico
  return await get<Servico[]>(`/servicos/por-cliente/${clienteId}`);
};

// Mutation (Atualizar Status)
const updateServicoStatus = async ({ id, status }: { id: string; status: StatusServico; }) => {
  const currentService = await get<Servico>(`/servicos/${id}`);
  const payload = { ...currentService, statusServico: status };
  
  const requestDTO = {
     titulo: payload.titulo,
     descricao: payload.descricao,
     preco: payload.preco,
     trabalhadorId: payload.trabalhadorId,
     tipoServico: payload.tipoServico,
     clienteId: payload.clienteId,
     disponibilidadeId: payload.disponibilidadeId,
     statusServico: status // A mudança real
  };
  return put(`/servicos/${id}`, requestDTO);
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  return get<Trabalhador[]>('/trabalhadores/listar');
};

const fetchServicosAvaliados = async (clienteId: string): Promise<AvaliacaoServico[]> => {
    // Correção: O ClienteController tem o método getAvaliacoesServico mapeado em:
    // /api/clientes/avaliacaoservico/{id}
    return get<AvaliacaoServico[]>(`/clientes/avaliacaoservico/${clienteId}`);
};
// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

// --- COMPONENTE PRINCIPAL ---
export function DashboardClientePage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [reviewingService, setReviewingService] = useState<Servico | null>(
    null
  );
  const clienteId = user?.role === "cliente" ? user.id : undefined;

  // --- QUERIES ---
  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ["servicosCliente", clienteId],
    queryFn: () => fetchServicosCliente(clienteId!),
    enabled: !!clienteId && isAuthenticated,
    refetchInterval: 3000, // <--- A MÁGICA: Atualiza a cada 3 segundos
  });

  const { data: trabalhadores, isLoading: isLoadingTrabalhadores } = useQuery<
    Trabalhador[]
  >({
    queryKey: ["trabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  const { data: servicosAvaliados, isLoading: isLoadingAvaliados } = useQuery({
    queryKey: ["servicosAvaliados", clienteId],
    queryFn: () => fetchServicosAvaliados(clienteId!),
    enabled: !!clienteId && isAuthenticated,
  });

  // --- MUTATION ---
  const servicoMutation = useMutation({
    mutationFn: updateServicoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicosCliente", clienteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["servicosAvaliados", clienteId],
      });
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    },
  });

  // --- MEMOS ---
  const reviewedServiceIds = useMemo(() => {
    return new Set(servicosAvaliados?.map((av) => av.servicoId));
  }, [servicosAvaliados]);

  const [servicosAtivos, servicosFinalizados] = useMemo(() => {
    if (!servicos) return [[], []];
    const ativos =
      servicos?.filter(
        (s) =>
          s.statusServico !== "FINALIZADO" &&
          s.statusServico !== "CANCELADO" &&
          s.statusServico !== "RECUSADO"
      ) || [];
    const finalizados =
      servicos?.filter((s) => s.statusServico === "FINALIZADO") || [];
    return [ativos, finalizados];
  }, [servicos]);

  const totalServicosAtivos = servicosAtivos.length;
  const primeiroNome = user?.nome.split(" ")[0] || "Visitante";
  const isLoading =
    isLoadingTrabalhadores ||
    (isAuthenticated && (isLoadingServicos || isLoadingAvaliados));

  // --- HANDLERS ---
  const handleApprove = (servicoId: string) => {
    servicoMutation.mutate({ id: servicoId, status: "FINALIZADO" });
  };

  const handleContest = (servicoId: string) => {
    servicoMutation.mutate({ id: servicoId, status: "EM_ANDAMENTO" });
  };

  const renderStatusTag = (status: StatusServico) => {
    switch (status) {
      case "PENDENTE_APROVACAO":
        return (
          <span className="text-xs font-bold py-1 px-3 rounded-full bg-accent text-dark-background animate-subtle-pulse">
            AÇÃO NECESSÁRIA
          </span>
        );
      case "EM_ANDAMENTO":
        return (
          <span className="text-xs font-bold py-1 px-3 rounded-full bg-primary text-white">
            EM ANDAMENTO
          </span>
        );
      case "PENDENTE":
      case "SOLICITADO":
        return (
          <span className="text-xs font-bold py-1 px-3 rounded-full bg-status-pending text-white">
            AGUARDANDO
          </span>
        );
      default:
        return (
          <span className="text-xs font-bold py-1 px-3 rounded-full bg-dark-surface text-dark-subtle">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Carregando...</Typography>
        <p className="text-dark-subtle mt-4">
          Buscando dados e profissionais em destaque.
        </p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12"
      >
        {/* --- HEADER (Responsivo) --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <motion.div variants={itemVariants}>
            <Typography as="h1">
              {isAuthenticated ? `Olá, ${primeiroNome}!` : "Bem-vindo!"}
            </Typography>
            <Typography as="p" className="!text-lg !text-dark-subtle">
              {isAuthenticated
                ? "Bem-vindo de volta ao seu painel."
                : "Encontre os melhores profissionais abaixo."}
            </Typography>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto"
          >
            {isAuthenticated && (
              <Button
                variant="outline"
                size="md"
                className="!px-4"
                onClick={() => navigate("/dashboard/configuracoes")}
                title="Configurações"
              >
                <CogIcon className="w-6 h-6" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              className="shadow-lg shadow-accent/20 hover:shadow-accent/40 w-full"
              onClick={() => navigate("/dashboard/solicitar")}
            >
              Solicitar Novo Serviço ✨
            </Button>
          </motion.div>
        </div>

        {/* --- CARD DE STATUS --- */}
        <motion.div variants={itemVariants}>
          <Card
            className={`
              p-6 md:p-8 shadow-2xl 
              ${
                isAuthenticated
                  ? "bg-gradient-to-r from-primary to-primary-soft shadow-primary/40"
                  : "bg-gradient-to-r from-dark-surface to-dark-surface_hover shadow-accent/20"
              }
              flex flex-col sm:flex-row justify-between sm:items-center
            `}
          >
            {isAuthenticated ? (
              // Visão Logada
              <>
                <div className="mb-4 sm:mb-0">
                  <Typography
                    as="h2"
                    className="!text-3xl sm:!text-4xl font-extrabold !text-white"
                  >
                    {totalServicosAtivos} Serviços Ativos
                  </Typography>
                  <p className="mt-2 text-lg sm:text-xl text-teal-200">
                    Acompanhe o progresso dos seus pedidos.
                  </p>
                </div>
                <BriefcaseIcon className="w-16 h-16 text-accent opacity-30 flex-shrink-0" />
              </>
            ) : (
              // Visão Deslogada (Visitante)
              <>
                <div className="mb-4 sm:mb-0">
                  <Typography
                    as="h2"
                    className="!text-3xl sm:!text-4xl font-extrabold !text-accent"
                  >
                    Pronto para começar?
                  </Typography>
                  <p className="mt-2 text-lg sm:text-xl text-dark-subtle">
                    Busque por categoria ou veja nossos destaques.
                  </p>
                </div>
                <WrenchScrewdriverIcon className="w-16 h-16 text-primary opacity-30 flex-shrink-0" />
              </>
            )}
          </Card>
        </motion.div>

        {/* --- LAYOUT DE 2 COLUNAS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* --- SEÇÃO SERVIÇOS ATIVOS (SÓ LOGADO) --- */}
          {isAuthenticated && (
            <section className="space-y-6 lg:col-span-2">
              <motion.div variants={itemVariants}>
                <Typography
                  as="h2"
                  className="!text-2xl border-b border-dark-surface/50 pb-2"
                >
                  🛠️ Meus Serviços Ativos
                </Typography>
              </motion.div>

              <LayoutGroup>
                <motion.div className="grid gap-4">
                  {servicosAtivos.length > 0 ? (
                    servicosAtivos.map((servico) => (
                      <Card
                        key={servico.id}
                        variants={itemVariants}
                        layout
                        className={`p-5 transition-all duration-300 ${
                          servico.statusServico === "PENDENTE_APROVACAO"
                            ? "!border-accent shadow-glow-accent"
                            : ""
                        }`}
                      >
                        {/* Layout de Card de Serviço Responsivo */}
                        <div className="flex flex-col md:flex-row justify-between">
                          <div className="flex gap-4 items-center mb-4 md:mb-0">
                            <div className="flex-shrink-0 w-12 h-12 bg-dark-surface rounded-lg flex items-center justify-center">
                              <WrenchScrewdriverIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <Typography as="h3" className="!text-lg">
                                {servico.titulo}
                              </Typography>
                              <p className="text-sm text-dark-subtle mt-1">
                                {renderStatusTag(servico.statusServico)}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2 w-full md:w-auto">
                            {servico.statusServico === "PENDENTE_APROVACAO" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleContest(servico.id)}
                                  disabled={servicoMutation.isPending}
                                  className="!border-status-danger !text-status-danger hover:!bg-status-danger hover:!text-white hover:!shadow-glow-danger w-1/2 md:w-auto"
                                >
                                  <XMarkIcon className="w-5 h-5 md:mr-1" />
                                  <span className="hidden md:inline">
                                    Contestar
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleApprove(servico.id)}
                                  disabled={servicoMutation.isPending}
                                  className="w-1/2 md:w-auto"
                                >
                                  <CheckIcon className="w-5 h-5 md:mr-1" />
                                  <span className="hidden md:inline">
                                    Aprovar
                                  </span>
                                </Button>
                              </>
                            ) : servico.statusServico === "EM_ANDAMENTO" ? (
                              <Button
                                size="sm"
                                variant="primary"
                                className="w-full md:w-auto"
                                onClick={() =>
                                  navigate(`/dashboard/chat/${servico.id}`)
                                }
                              >
                                Abrir Chat
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                disabled
                                className="w-full md:w-auto"
                              >
                                Aguardando...
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <motion.div variants={itemVariants}>
                      <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                        <Typography as="p">
                          Você ainda não solicitou nenhum serviço.
                        </Typography>
                        <Button
                          variant="secondary"
                          className="mt-4"
                          onClick={() => navigate("/dashboard/solicitar")}
                        >
                          Buscar Profissionais
                        </Button>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </LayoutGroup>
            </section>
          )}

          {/* --- SEÇÃO DESTAQUES (Responsiva) --- */}
          <aside
            className={`space-y-6 ${
              isAuthenticated ? "lg:col-span-1" : "lg:col-span-3"
            }`}
          >
            <motion.div variants={itemVariants}>
              <Typography
                as="h2"
                className="!text-2xl border-b border-dark-surface/50 pb-2"
              >
                🌟 Destaques
              </Typography>
            </motion.div>

            <div
              className={`grid grid-cols-1 gap-6 ${
                isAuthenticated ? "" : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {trabalhadores
                ?.slice(0, isAuthenticated ? 2 : 6)
                .map((trabalhador) => (
                  <TrabalhadorCard
                    key={trabalhador.id}
                    trabalhador={trabalhador}
                    variants={cardItemVariants}
                  />
                ))}
            </div>
          </aside>
        </div>

        {/* --- SEÇÃO HISTÓRICO (SÓ LOGADO) --- */}
        {isAuthenticated && servicosFinalizados.length > 0 && (
          <section className="space-y-6">
            <motion.div variants={itemVariants}>
              <Typography
                as="h2"
                className="!text-2xl border-b border-dark-surface/50 pb-2"
              >
                ✅ Histórico de Serviços ({servicosFinalizados.length})
              </Typography>
            </motion.div>

            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicosFinalizados.map((servico) => {
                const isReviewed = reviewedServiceIds.has(servico.id);
                return (
                  <Card
                    key={servico.id}
                    variants={itemVariants}
                    className={`p-5 ${isReviewed ? "opacity-60" : ""}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                      <div className="mb-3 sm:mb-0">
                        <Typography as="h3" className="!text-lg">
                          {servico.titulo}
                        </Typography>
                        <p className="text-sm text-dark-subtle mt-1">
                          Finalizado
                        </p>
                      </div>

                      {isReviewed ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="!text-accent !border-accent/50 w-full sm:w-auto"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Avaliado
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          className="w-full sm:w-auto"
                          onClick={() => setReviewingService(servico)}
                        >
                          <CalendarDaysIcon className="w-4 h-4 mr-1" />
                          Avaliar Serviço
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          </section>
        )}
      </motion.div>

      {/* --- O MODAL --- */}
      <AnimatePresence>
        {reviewingService && (
          <AvaliacaoModal
            servico={reviewingService}
            onClose={() => setReviewingService(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
