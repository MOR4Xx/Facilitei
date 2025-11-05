import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import type { Servico, Trabalhador, StatusServico, AvaliacaoServico } from "../types/api"; 
import { useNavigate } from "react-router-dom";
import {
  TrabalhadorCard,
  itemVariants as cardItemVariants,
} from "../components/ui/TrabalhadorCard";
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

// --- FUNÇÕES DE BUSCA (API) ---

// (fetchServicosCliente e fetchTrabalhadores permanecem os mesmos)
const fetchServicosCliente = async (clienteId: number): Promise<Servico[]> => {
  const response = await fetch(
    `http://localhost:3333/servicos?clienteId=${clienteId}`
  );
  if (!response.ok) throw new Error("Não foi possível buscar os serviços.");
  const servicos: Servico[] = await response.json();
  return servicos.sort((a, b) => {
    if (a.statusServico === "PENDENTE_APROVACAO") return -1;
    if (b.statusServico === "PENDENTE_APROVACAO") return 1;
    if (a.statusServico === "EM_ANDAMENTO") return -1;
    if (b.statusServico === "EM_ANDAMENTO") return 1;
    return 0;
  });
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const response = await fetch("http://localhost:3333/trabalhadores");
  if (!response.ok)
    throw new Error("Não foi possível buscar os trabalhadores.");
  return response.json();
};

// 👇 NOVA FUNÇÃO: Busca serviços que o cliente JÁ AVALIOU
const fetchServicosAvaliados = async (
  clienteId: number
): Promise<AvaliacaoServico[]> => {
  const response = await fetch(
    `http://localhost:3333/avaliacoes-servico?clienteId=${clienteId}`
  );
  if (!response.ok) return [];
  return response.json();
};

// --- FUNÇÃO DE MUTATION (API) ---
// (updateServicoStatus permanece o mesmo)
const updateServicoStatus = async ({
  id,
  status,
}: {
  id: number;
  status: StatusServico;
}) => {
  const response = await fetch(`http://localhost:3333/servicos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statusServico: status }),
  });
  if (!response.ok) throw new Error("Falha ao atualizar serviço.");
  return response.json();
};

// ... (variantes de animação permanecem as mesmas) ...
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
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Estado para controlar o modal de avaliação
  const [reviewingService, setReviewingService] = useState<Servico | null>(null);

  // --- QUERIES ---
  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ["servicosCliente", user?.id],
    queryFn: () => fetchServicosCliente(user!.id),
    enabled: !!user?.id,
  });

  const { data: trabalhadores, isLoading: isLoadingTrabalhadores } = useQuery<
    Trabalhador[]
  >({
    queryKey: ["trabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  const { data: servicosAvaliados, isLoading: isLoadingAvaliados } = useQuery({
    queryKey: ["servicosAvaliados", user?.id],
    queryFn: () => fetchServicosAvaliados(user!.id),
    enabled: !!user?.id,
  });

  // --- MUTATION ---
  const servicoMutation = useMutation({
    mutationFn: updateServicoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["servicosCliente", user?.id],
      });
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    },
  });

  // --- MEMOS ---
  // Cria um Set com os IDs dos serviços já avaliados
  const reviewedServiceIds = useMemo(() => {
    return new Set(servicosAvaliados?.map((av) => av.servicoId));
  }, [servicosAvaliados]);

  const [servicosAtivos, servicosFinalizados] = useMemo(() => {
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
  // -------------

  const totalServicosAtivos = servicosAtivos.length;
  const primeiroNome = user?.nome.split(" ")[0];
  const isLoading = isLoadingServicos || isLoadingTrabalhadores || isLoadingAvaliados;

  // --- HANDLERS ---
  const handleApprove = (servicoId: number) => {
    servicoMutation.mutate({ id: servicoId, status: "FINALIZADO" });
  };

  const handleContest = (servicoId: number) => {
    servicoMutation.mutate({ id: servicoId, status: "EM_ANDAMENTO" });
  };

  // ... (renderStatusTag permanece o mesmo) ...
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
        <Typography as="h2">Carregando seu Painel...</Typography>
        <p className="text-dark-subtle mt-4">
          Buscando seus dados e profissionais em destaque.
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
        {/* ... (HEADER E AÇÕES, CARD DE STATUS ATIVO - permanecem os mesmos) ... */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <motion.div variants={itemVariants}>
            <Typography as="h1">Olá, {primeiroNome}!</Typography>
            <Typography as="p" className="!text-lg !text-dark-subtle">
              Bem-vindo de volta ao seu painel.
            </Typography>
          </motion.div>
          <motion.div variants={itemVariants} className="flex gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="md"
              className="!px-4"
              onClick={() => navigate("/dashboard/configuracoes")}
              title="Configurações"
            >
              <CogIcon className="w-6 h-6" />
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="shadow-lg shadow-accent/20 hover:shadow-accent/40"
              onClick={() => navigate("/dashboard/solicitar")}
            >
              Solicitar Novo Serviço ✨
            </Button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-primary to-primary-soft p-8 shadow-2xl shadow-primary/40 flex justify-between items-center">
            <div>
              <Typography as="h2" className="!text-white !text-4xl font-extrabold">
                {totalServicosAtivos} Serviços Ativos
              </Typography>
              <p className="mt-2 text-xl text-teal-200">
                Acompanhe o progresso dos seus pedidos.
              </p>
            </div>
            <BriefcaseIcon className="w-16 h-16 text-accent opacity-30" />
          </Card>
        </motion.div>

        {/* ... (LAYOUT DE 2 COLUNAS: SERVIÇOS E DESTAQUES - permanece o mesmo) ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
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
                      <div className="flex flex-col md:flex-row justify-between">
                        <div className="flex gap-4 items-center">
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

                        <div className="flex gap-2 mt-4 md:mt-0 md:items-center">
                          {servico.statusServico === "PENDENTE_APROVACAO" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleContest(servico.id)}
                                disabled={servicoMutation.isPending}
                                className="!border-status-danger !text-status-danger hover:!bg-status-danger hover:!text-white hover:!shadow-glow-danger"
                              >
                                <XMarkIcon className="w-5 h-5 mr-1" />
                                Contestar
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleApprove(servico.id)}
                                disabled={servicoMutation.isPending}
                              >
                                <CheckIcon className="w-5 h-5 mr-1" />
                                Aprovar
                              </Button>
                            </>
                          ) : servico.statusServico === "EM_ANDAMENTO" ? (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() =>
                                navigate(`/dashboard/chat/${servico.id}`)
                              }
                            >
                              Abrir Chat
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" disabled>
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

          <aside className="space-y-6 lg:col-span-1">
            <motion.div variants={itemVariants}>
              <Typography
                as="h2"
                className="!text-2xl border-b border-dark-surface/50 pb-2"
              >
                🌟 Destaques
              </Typography>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {trabalhadores?.slice(0, 2).map((trabalhador) => (
                <TrabalhadorCard
                  key={trabalhador.id}
                  trabalhador={trabalhador}
                  variants={cardItemVariants}
                />
              ))}
            </div>
          </aside>
        </div>


        {/* --- SEÇÃO FINALIZADOS (MODIFICADA) --- */}
        {servicosFinalizados.length > 0 && (
          <section className="space-y-6">
            <motion.div variants={itemVariants}>
              <Typography
                as="h2"
                className="!text-2xl border-b border-dark-surface/50 pb-2"
              >
                ✅ Histórico de Serviços ({servicosFinalizados.length})
              </Typography>
            </motion.div>

            <motion.div className="grid md:grid-cols-2 gap-4">
              {servicosFinalizados.map((servico) => {
                // Checa se o serviço já foi avaliado
                const isReviewed = reviewedServiceIds.has(servico.id);

                return (
                  <Card
                    key={servico.id}
                    variants={itemVariants}
                    className={`p-5 ${isReviewed ? "opacity-60" : ""}`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <Typography as="h3" className="!text-lg">
                          {servico.titulo}
                        </Typography>
                        <p className="text-sm text-dark-subtle mt-1">
                          Finalizado
                        </p>
                      </div>

                      {/* Lógica do Botão de Avaliação */}
                      {isReviewed ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="!text-accent !border-accent/50"
                        >
                          <CheckIcon className="w-4 h-4 mr-1" />
                          Avaliado
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary" // Botão de ação
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

      {/* --- O MODAL (Renderização Condicional) --- */}
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