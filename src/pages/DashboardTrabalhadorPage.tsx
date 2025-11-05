
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import type {
  Servico,
  Trabalhador,
  Cliente,
  StatusServico,
  AvaliacaoCliente,
} from "../types/api";
import {
  BellIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
} from "../components/ui/Icons";
import { AvaliacaoClienteModal } from "../components/ui/AvaliacaoClienteModal";

// ... (Interface SolicitacaoServico e WorkerData permanecem iguais)
interface SolicitacaoServico {
  id: number;
  clienteId: number;
  servicoId: number; // ID do serviço associado
  descricao: string;
  statusSolicitacao: "PENDENTE" | "ACEITA" | "RECUSADA";
}

interface WorkerData {
  newRequests: (SolicitacaoServico & { cliente: Cliente; servico: Servico })[];
  activeServices: (Servico & { cliente: Cliente })[];
  finishedServices: (Servico & { cliente: Cliente })[];
}

// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
        className={`text-xl ${
          i < score ? "text-accent" : "text-dark-subtle/50"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

// --- FUNÇÕES DE FETCH (API) ---
const fetchCliente = async (id: number): Promise<Cliente> => {
  const res = await fetch(`http://localhost:3333/clientes/${id}`);
  if (!res.ok) throw new Error("Cliente não encontrado");
  return res.json();
};

const fetchAvaliacoesClienteFeitas = async (
  trabalhadorId: number
): Promise<AvaliacaoCliente[]> => {
  const res = await fetch(
    `http://localhost:3333/avaliacoes-cliente?trabalhadorId=${trabalhadorId}`
  );
  if (!res.ok) return [];
  return res.json();
};

const fetchWorkerData = async (workerId: number): Promise<WorkerData> => {
  const servicesResponse = await fetch(
    `http://localhost:3333/servicos?trabalhadorId=${workerId}`
  );
  if (!servicesResponse.ok) throw new Error("Falha ao buscar serviços.");
  const allServices: Servico[] = await servicesResponse.json();

  // Ordena os serviços ativos (PENDENTE_APROVACAO primeiro)
  const activeServices = allServices
    .filter(
      (s) =>
        s.statusServico === "EM_ANDAMENTO" ||
        s.statusServico === "PENDENTE_APROVACAO"
    )
    .sort((a, b) => {
      if (a.statusServico === "PENDENTE_APROVACAO") return -1;
      if (b.statusServico === "PENDENTE_APROVACAO") return 1;
      return 0;
    });

  const pendingServiceIds = allServices
    .filter((s) => s.statusServico === "PENDENTE")
    .map((s) => s.id);

  const finishedServices = allServices.filter(
    (s) => s.statusServico === "FINALIZADO"
  );

  const solicitationsResponse = await fetch(
    `http://localhost:3333/solicitacoes-servico?statusSolicitacao=PENDENTE`
  );
  if (!solicitationsResponse.ok)
    throw new Error("Falha ao buscar solicitações.");
  const allSolicitations: SolicitacaoServico[] =
    await solicitationsResponse.json();

  const newRequests = allSolicitations.filter((sol) =>
    pendingServiceIds.includes(sol.servicoId)
  );

  const activeServicesWithClient = await Promise.all(
    activeServices.map(async (servico) => {
      const cliente = await fetchCliente(servico.clienteId);
      return { ...servico, cliente };
    })
  );

  const newRequestsWithClient = await Promise.all(
    newRequests.map(async (solicitacao) => {
      const cliente = await fetchCliente(solicitacao.clienteId);
      const servico = allServices.find((s) => s.id === solicitacao.servicoId)!;
      return { ...solicitacao, cliente, servico };
    })
  );

  const finishedServicesWithClient = await Promise.all(
    finishedServices.map(async (servico) => {
      const cliente = await fetchCliente(servico.clienteId);
      return { ...servico, cliente };
    })
  );

  return {
    newRequests: newRequestsWithClient,
    activeServices: activeServicesWithClient,
    finishedServices: finishedServicesWithClient,
  };
};

// --- FUNÇÕES DE MUTATION (API) ---
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

const updateSolicitacaoStatus = async ({
  id,
  status,
}: {
  id: number;
  status: "ACEITA" | "RECUSADA";
}) => {
  const response = await fetch(
    `http://localhost:3333/solicitacoes-servico/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statusSolicitacao: status }),
    }
  );
  if (!response.ok) throw new Error("Falha ao atualizar solicitação.");
  return response.json();
};

// --- COMPONENTE PRINCIPAL ---
export function DashboardTrabalhadorPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const trabalhador = user as Trabalhador;
  const [reviewingClientService, setReviewingClientService] =
    useState<Servico | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["workerData", trabalhador.id],
    queryFn: () => fetchWorkerData(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  const { data: avaliacoesFeitas } = useQuery({
    queryKey: ["avaliacoesClienteFeitas", trabalhador.id],
    queryFn: () => fetchAvaliacoesClienteFeitas(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  const reviewedClientServiceIds = useMemo(() => {
    return new Set(avaliacoesFeitas?.map((av) => av.servicoId));
  }, [avaliacoesFeitas]);

  const servicoMutation = useMutation({
    mutationFn: updateServicoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workerData", trabalhador.id],
      });
      queryClient.invalidateQueries({ queryKey: ["servicosCliente"] });
    },
  });

  const solicitacaoMutation = useMutation({
    mutationFn: updateSolicitacaoStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workerData", trabalhador.id],
      });
    },
  });

  // --- HANDLERS (Ações dos Botões) ---
  const handleAccept = (solicitacao: SolicitacaoServico) => {
    solicitacaoMutation.mutate({ id: solicitacao.id, status: "ACEITA" });
    servicoMutation.mutate({
      id: solicitacao.servicoId,
      status: "EM_ANDAMENTO",
    });
  };

  const handleReject = (solicitacao: SolicitacaoServico) => {
    solicitacaoMutation.mutate({ id: solicitacao.id, status: "RECUSADA" });
    servicoMutation.mutate({ id: solicitacao.servicoId, status: "RECUSADO" });
  };

  const handleRequestFinish = (servico: Servico) => {
    servicoMutation.mutate({ id: servico.id, status: "PENDENTE_APROVACAO" });
  };

  const isMutating = solicitacaoMutation.isPending || servicoMutation.isPending;

  // --- RENDER ---
  const primeiroNome = trabalhador?.nome.split(" ")[0];
  const newRequestsCount = data?.newRequests.length || 0;
  const activeServicesCount = data?.activeServices.length || 0;

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Carregando Painel do Profissional...</Typography>
        <p className="text-dark-subtle mt-4">
          Organizando suas solicitações e tarefas.
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Erro ao carregar dados.</Typography>
        <p className="text-dark-subtle mt-4">Tente recarregar a página.</p>
      </div>
    );
  }

  const welcomeCardClass =
    trabalhador.notaTrabalhador >= 4
      ? "bg-gradient-to-r from-accent to-lime-600 shadow-2xl shadow-accent/40"
      : "bg-gradient-to-r from-primary to-teal-700 shadow-2xl shadow-primary/40";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* HEADER E AÇÕES */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <motion.div variants={itemVariants}>
          <Typography as="h1">E aí, {primeiroNome}!</Typography>
          <Typography as="p" className="!text-lg !text-dark-subtle">
            Hora de colocar a mão na massa.
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            className="mt-4 md:mt-0 shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Ver Agenda Completa
          </Button>
        </motion.div>
      </div>

      {/* CARD DE BOAS-VINDAS */}
      <motion.div variants={itemVariants}>
        <Card className={`p-8 ${welcomeCardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <Typography
                as="h2"
                className="!text-white !text-4xl font-extrabold"
              >
                Sua Nota: {trabalhador.notaTrabalhador.toFixed(1)}
              </Typography>
              <p className="mt-2 text-xl text-dark-background/80">
                Mantenha o trabalho de qualidade!
              </p>
            </div>
            <Rating score={trabalhador.notaTrabalhador} />
          </div>
        </Card>
      </motion.div>

      {/* CARDS DE ESTATÍSTICAS RÁPIDAS */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6 flex justify-between items-center">
            <div>
              <Typography
                as="h3"
                className="!text-3xl text-accent font-extrabold"
              >
                {newRequestsCount}
              </Typography>
              <Typography as="p" className="text-dark-subtle mt-1">
                Novas Solicitações
              </Typography>
            </div>
            <BellIcon className="w-12 h-12 text-accent opacity-30" />
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6 flex justify-between items-center">
            <div>
              <Typography
                as="h3"
                className="!text-3xl text-primary font-extrabold"
              >
                {activeServicesCount}
              </Typography>
              <Typography as="p" className="text-dark-subtle mt-1">
                Serviços em Andamento
              </Typography>
            </div>
            <BriefcaseIcon className="w-12 h-12 text-primary opacity-30" />
          </Card>
        </motion.div>
      </div>

      {/* LAYOUT DE 2 COLUNAS: AÇÕES E ATIVOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* COLUNA PRINCIPAL: NOVAS SOLICITAÇÕES */}
        <section className="space-y-6 lg:col-span-2">
          <motion.div variants={itemVariants}>
            <Typography
              as="h2"
              className="!text-2xl border-b border-dark-surface/50 pb-2"
            >
              🔔 Novas Solicitações ({newRequestsCount})
            </Typography>
          </motion.div>

          <LayoutGroup>
            <motion.div className="grid grid-cols-1 gap-6">
              {data?.newRequests && data.newRequests.length > 0 ? (
                data.newRequests.map((sol) => (
                  <Card
                    key={sol.id}
                    variants={itemVariants}
                    layout
                    className="p-6 shadow-glow-accent !border-accent/80"
                  >
                    {/* Info do Cliente */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-4">
                        <img
                          src={sol.cliente.avatarUrl}
                          alt={sol.cliente.nome}
                          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-accent"
                        />
                        <div>
                          <Typography
                            as="h3"
                            className="!text-lg !text-dark-text"
                          >
                            {sol.cliente.nome}
                          </Typography>
                          <p className="text-sm text-dark-subtle">
                            {sol.cliente.endereco.cidade} -{" "}
                            {sol.cliente.endereco.estado}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold py-1 px-3 rounded-full bg-accent text-dark-background">
                        NOVO
                      </span>
                    </div>

                    {/* Detalhes da Solicitação */}
                    <div className="mb-5">
                      <Typography
                        as="p"
                        className="!text-dark-text !font-semibold mb-1"
                      >
                        {sol.servico.titulo}
                      </Typography>
                      <Typography
                        as="p"
                        className="italic bg-dark-background/50 p-3 rounded-md text-sm"
                      >
                        "{sol.descricao}"
                      </Typography>
                    </div>

                    {/* Botões de Ação */}
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="w-full !border-status-danger !text-status-danger hover:!bg-status-danger hover:!text-white hover:!shadow-glow-danger"
                        onClick={() => handleReject(sol)}
                        disabled={isMutating}
                      >
                        <XMarkIcon className="w-5 h-5 mr-1" />
                        Recusar
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => handleAccept(sol)}
                        disabled={isMutating}
                      >
                        <CheckIcon className="w-5 h-5 mr-1" />
                        {isMutating ? "Aguarde..." : "Aceitar"}
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <motion.div variants={itemVariants} className="lg:col-span-2">
                  <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                    <Typography as="p">
                      Nenhuma nova solicitação no momento.
                    </Typography>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </LayoutGroup>
        </section>

        {/* COLUNA LATERAL: SERVIÇOS ATIVOS */}
        <aside className="space-y-6 lg:col-span-1">
          <motion.div variants={itemVariants}>
            <Typography
              as="h2"
              className="!text-2xl border-b border-dark-surface/50 pb-2"
            >
              💼 Serviços Ativos ({activeServicesCount})
            </Typography>
          </motion.div>

          <LayoutGroup>
            <motion.div className="grid grid-cols-1 gap-4">
              {data?.activeServices && data.activeServices.length > 0 ? (
                data.activeServices.map((servico) => (
                  <Card
                    key={servico.id}
                    variants={itemVariants}
                    layout
                    className={`p-4 ${
                      servico.statusServico === "PENDENTE_APROVACAO"
                        ? "!border-status-pending"
                        : "!border-primary/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <img
                        src={servico.cliente.avatarUrl}
                        alt={servico.cliente.nome}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-dark-text truncate">
                          {servico.titulo}
                        </p>
                        <p className="text-xs text-dark-subtle">
                          Cliente: {servico.cliente.nome}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="!p-2"
                        onClick={() =>
                          navigate(`/dashboard/chat/${servico.id}`)
                        }
                      >
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Botão de Ação Inferior */}
                    {servico.statusServico === "EM_ANDAMENTO" ? (
                      <Button
                        size="sm"
                        variant="primary"
                        className="w-full mt-3"
                        onClick={() => handleRequestFinish(servico)}
                        disabled={isMutating}
                      >
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Solicitar Finalização
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-3 !text-status-pending !border-status-pending"
                        disabled={true}
                      >
                        Aguardando Cliente
                      </Button>
                    )}
                  </Card>
                ))
              ) : (
                <motion.div variants={itemVariants}>
                  <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                    <Typography as="p" className="text-sm">
                      Nenhum serviço em andamento.
                    </Typography>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </LayoutGroup>
        </aside>
      </div>
      {/* --- SEÇÃO HISTÓRICO DE SERVIÇOS --- */}
      {data?.finishedServices && data.finishedServices.length > 0 && (
        <section className="space-y-6 lg:col-span-3">
          <motion.div variants={itemVariants}>
            <Typography
              as="h2"
              className="!text-2xl border-b border-dark-surface/50 pb-2"
            >
              ✅ Histórico de Serviços ({data.finishedServices.length})
            </Typography>
          </motion.div>

          <motion.div className="grid md:grid-cols-2 gap-4">
            {data.finishedServices.map((servico) => {
              // Checa se este serviço já foi avaliado pelo trabalhador
              const isReviewed = reviewedClientServiceIds.has(servico.id);

              return (
                <Card
                  key={servico.id}
                  variants={itemVariants}
                  className={`p-5 ${
                    isReviewed
                      ? "opacity-60 !border-dark-surface"
                      : "!border-dark-surface/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={servico.cliente.avatarUrl}
                        alt={servico.cliente.nome}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <Typography as="h3" className="!text-lg">
                          {servico.titulo}
                        </Typography>
                        <p className="text-sm text-dark-subtle mt-1">
                          Cliente: {servico.cliente.nome} (Finalizado)
                        </p>
                      </div>
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
                        onClick={() => setReviewingClientService(servico)} // 👈 Abre o modal
                      >
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        Avaliar Cliente
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </motion.div>
        </section>
      )}

      {/* --- O MODAL (Renderização Condicional) --- */}
      <AnimatePresence>
        {reviewingClientService && (
          <AvaliacaoClienteModal
            servico={reviewingClientService}
            onClose={() => setReviewingClientService(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
