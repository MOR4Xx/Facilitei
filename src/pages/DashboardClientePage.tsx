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

// --- FETCHERS MANTIDOS IGUAIS ---
const fetchServicosCliente = async (clienteId: string): Promise<Servico[]> =>
  get<Servico[]>(`/servicos/por-cliente/${clienteId}`);
const updateServicoStatus = async ({
  id,
  status,
}: {
  id: string;
  status: StatusServico;
}) => {
  const currentService = await get<Servico>(`/servicos/${id}`);
  const requestDTO = { ...currentService, statusServico: status };
  return put(`/servicos/${id}`, requestDTO);
};
const fetchTrabalhadores = async (): Promise<Trabalhador[]> =>
  get<Trabalhador[]>("/trabalhadores/listar");
const fetchServicosAvaliados = async (
  clienteId: string
): Promise<AvaliacaoServico[]> =>
  get<AvaliacaoServico[]>(`/clientes/avaliacaoservico/${clienteId}`);

// --- VARIANTES ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function DashboardClientePage() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reviewingService, setReviewingService] = useState<Servico | null>(
    null
  );
  const clienteId = user?.role === "cliente" ? user.id : undefined;

  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ["servicosCliente", clienteId],
    queryFn: () => fetchServicosCliente(clienteId!),
    enabled: !!clienteId && isAuthenticated,
    refetchInterval: 3000,
  });

  const { data: trabalhadores, isLoading: isLoadingTrabalhadores } = useQuery<
    Trabalhador[]
  >({
    queryKey: ["trabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  const { data: servicosAvaliados } = useQuery({
    queryKey: ["servicosAvaliados", clienteId],
    queryFn: () => fetchServicosAvaliados(clienteId!),
    enabled: !!clienteId && isAuthenticated,
  });

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

  const reviewedServiceIds = useMemo(
    () => new Set(servicosAvaliados?.map((av) => av.servicoId)),
    [servicosAvaliados]
  );

  const [servicosAtivos, servicosFinalizados] = useMemo(() => {
    if (!servicos) return [[], []];
    return [
      servicos.filter(
        (s) =>
          !["FINALIZADO", "CANCELADO", "RECUSADO"].includes(s.statusServico)
      ),
      servicos.filter((s) => s.statusServico === "FINALIZADO"),
    ];
  }, [servicos]);

  const primeiroNome = user?.nome.split(" ")[0] || "Visitante";
  const isLoading =
    isLoadingTrabalhadores || (isAuthenticated && isLoadingServicos);

  // Tag de Status com visual Neon
  const renderStatusTag = (status: StatusServico) => {
    const styles: Record<string, string> = {
      PENDENTE_APROVACAO:
        "bg-status-pending/20 text-status-pending border-status-pending/50 animate-pulse",
      EM_ANDAMENTO: "bg-primary/20 text-primary border-primary/50",
      PENDENTE: "bg-dark-subtle/20 text-dark-subtle border-dark-subtle/30",
      SOLICITADO: "bg-dark-subtle/20 text-dark-subtle border-dark-subtle/30",
    };
    const style = styles[status] || "bg-dark-surface text-dark-subtle";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10"
      >
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-6">
          <motion.div variants={itemVariants}>
            <Typography
              as="h1"
              className="!text-3xl md:!text-4xl bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60"
            >
              {isAuthenticated
                ? `Olá, ${primeiroNome}`
                : "Bem-vindo ao Facilitei"}
            </Typography>
            <p className="text-dark-subtle mt-2 text-lg">
              {isAuthenticated
                ? "Gerencie seus projetos e contratações."
                : "Conecte-se aos melhores profissionais."}
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto"
          >
            {isAuthenticated && (
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/dashboard/configuracoes")}
              >
                <CogIcon className="w-6 h-6" />
              </Button>
            )}
            <Button
              variant="secondary"
              size="lg"
              className="shadow-glow-accent w-full md:w-auto"
              onClick={() => navigate("/dashboard/solicitar")}
            >
              {isAuthenticated ? "Novo Pedido +" : "Explorar Profissionais"}
            </Button>
          </motion.div>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {isAuthenticated ? (
            <section className="lg:col-span-2 space-y-6">
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-3 mb-2"
              >
                <div className="bg-primary/10 p-2 rounded-lg">
                  <WrenchScrewdriverIcon className="w-6 h-6 text-primary" />
                </div>
                <Typography as="h2" className="!text-2xl">
                  Serviços em Andamento
                </Typography>
              </motion.div>

              <LayoutGroup>
                <motion.div className="space-y-4">
                  {servicosAtivos.length > 0 ? (
                    servicosAtivos.map((servico) => (
                      <Card
                        key={servico.id}
                        variants={itemVariants}
                        layout
                        className={`p-6 border-l-4 ${
                          servico.statusServico === "PENDENTE_APROVACAO"
                            ? "border-l-status-pending"
                            : "border-l-primary"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {servico.titulo}
                            </h3>
                            <div className="flex items-center gap-3 mt-2">
                              {renderStatusTag(servico.statusServico)}
                              <span className="text-sm text-dark-subtle">
                                R$ {servico.preco?.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-center w-full sm:w-auto">
                            {servico.statusServico === "PENDENTE_APROVACAO" ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="!border-status-danger !text-status-danger hover:bg-status-danger/10 w-1/2 sm:w-auto"
                                  onClick={() =>
                                    servicoMutation.mutate({
                                      id: servico.id,
                                      status: "EM_ANDAMENTO",
                                    })
                                  }
                                >
                                  <XMarkIcon className="w-4 h-4 mr-1" />{" "}
                                  Contestar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-1/2 sm:w-auto"
                                  onClick={() =>
                                    servicoMutation.mutate({
                                      id: servico.id,
                                      status: "FINALIZADO",
                                    })
                                  }
                                >
                                  <CheckIcon className="w-4 h-4 mr-1" /> Aprovar
                                </Button>
                              </>
                            ) : servico.statusServico === "EM_ANDAMENTO" ? (
                              <Button
                                size="sm"
                                variant="primary"
                                className="w-full"
                                onClick={() =>
                                  navigate(`/dashboard/chat/${servico.id}`)
                                }
                              >
                                Abrir Chat
                              </Button>
                            ) : (
                              <span className="text-sm text-dark-subtle italic">
                                Aguardando profissional...
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="text-center py-12 border-dashed border-white/10 bg-transparent">
                      <p className="text-dark-subtle">
                        Nenhum serviço ativo no momento.
                      </p>
                    </Card>
                  )}
                </motion.div>
              </LayoutGroup>
            </section>
          ) : (
            <section className="lg:col-span-2">
              <Card className="h-full flex flex-col justify-center items-center text-center p-12 bg-gradient-to-br from-dark-surface to-primary/5 border-primary/20">
                <BriefcaseIcon className="w-20 h-20 text-primary/40 mb-6" />
                <h2 className="text-3xl font-bold text-white mb-4">
                  Faça login para começar
                </h2>
                <p className="text-dark-subtle max-w-md mx-auto mb-8">
                  Acompanhe seus serviços, converse com profissionais e avalie o
                  trabalho realizado.
                </p>
                <Button variant="outline" onClick={() => navigate("/login")}>
                  Entrar na Conta
                </Button>
              </Card>
            </section>
          )}

          {/* SIDEBAR / DESTAQUES */}
          <aside className="space-y-6">
            <motion.div variants={itemVariants}>
              <Typography
                as="h2"
                className="!text-xl mb-4 flex items-center gap-2"
              >
                <span className="text-accent">★</span> Profissionais em Alta
              </Typography>
              <div className="grid gap-4">
                {trabalhadores?.slice(0, 3).map((t) => (
                  <TrabalhadorCard key={t.id} trabalhador={t} />
                ))}
              </div>
            </motion.div>
          </aside>
        </div>

        {/* HISTÓRICO */}
        {isAuthenticated && servicosFinalizados.length > 0 && (
          <section>
            <motion.div
              variants={itemVariants}
              className="mb-4 border-t border-white/10 pt-8"
            >
              <Typography as="h2" className="!text-2xl">
                Histórico Finalizado
              </Typography>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {servicosFinalizados.map((servico) => {
                const isReviewed = reviewedServiceIds.has(servico.id);
                return (
                  <Card
                    key={servico.id}
                    className={`p-5 flex justify-between items-center ${
                      isReviewed ? "opacity-60" : "border-accent/30"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold">{servico.titulo}</h4>
                      <p className="text-xs text-dark-subtle">Concluído</p>
                    </div>
                    {isReviewed ? (
                      <span className="text-xs text-accent flex items-center">
                        <CheckIcon className="w-3 h-3 mr-1" /> Avaliado
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setReviewingService(servico)}
                      >
                        Avaliar
                      </Button>
                    )}
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </motion.div>

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
