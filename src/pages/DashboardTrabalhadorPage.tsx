// src/pages/DashboardTrabalhadorPage.tsx

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router-dom";
import type {
  Servico,
  Trabalhador,
  Cliente,
  StatusServico,
} from "../types/api";

// Definindo o tipo de Solicitação de Serviço com base no db.json
interface SolicitacaoServico {
  id: number;
  clienteId: number;
  servicoId: number; // ID do serviço associado
  descricao: string;
  statusSolicitacao: "PENDENTE" | "ACEITA" | "RECUSADA";
}

// Interface para os dados retornados pela query principal
interface WorkerData {
  newRequests: (SolicitacaoServico & { cliente: Cliente; servico: Servico })[];
  activeServices: (Servico & { cliente: Cliente })[];
}

// --- VARIANTES DE ANIMAÇÃO ZIKA ---
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

// Busca os dados do cliente
const fetchCliente = async (id: number): Promise<Cliente> => {
  const res = await fetch(`http://localhost:3333/clientes/${id}`);
  if (!res.ok) throw new Error("Cliente não encontrado");
  return res.json();
};

// Busca todos os dados do dashboard do trabalhador
const fetchWorkerData = async (workerId: number): Promise<WorkerData> => {
  // 1. Busca todos os serviços deste trabalhador
  const servicesResponse = await fetch(
    `http://localhost:3333/servicos?trabalhadorId=${workerId}`
  );
  if (!servicesResponse.ok) throw new Error("Falha ao buscar serviços.");
  const allServices: Servico[] = await servicesResponse.json();

  // 2. Separa os serviços
  // =================================================================
  //  MUDANÇA ZIKA: INCLUIR SERVIÇOS PENDENTES DE APROVAÇÃO NA LISTA
  // =================================================================
  const activeServices = allServices.filter(
    (s) =>
      s.statusServico === "EM_ANDAMENTO" ||
      s.statusServico === "PENDENTE_APROVACAO" // 👈 ADICIONADO AQUI
  );
  // =================================================================

  const pendingServiceIds = allServices
    .filter((s) => s.statusServico === "PENDENTE")
    .map((s) => s.id);

  // 3. Busca solicitações PENDENTES (Pré-Requisições) que correspondem aos serviços pendentes
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

  // 4. Busca dados dos clientes para os SERVIÇOS ATIVOS (e Pendentes de Aprovação)
  const activeServicesWithClient = await Promise.all(
    activeServices.map(async (servico) => {
      const cliente = await fetchCliente(servico.clienteId);
      return { ...servico, cliente };
    })
  );

  // 5. Busca dados dos clientes para as NOVAS SOLICITAÇÕES
  const newRequestsWithClient = await Promise.all(
    newRequests.map(async (solicitacao) => {
      const cliente = await fetchCliente(solicitacao.clienteId);
      const servico = allServices.find((s) => s.id === solicitacao.servicoId)!;
      return { ...solicitacao, cliente, servico };
    })
  );

  return {
    newRequests: newRequestsWithClient,
    activeServices: activeServicesWithClient,
  };
};

// --- FUNÇÕES DE MUTATION (API) ---

// Função genérica para atualizar um Serviço (PATCH)
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

// Função genérica para atualizar uma Solicitação (PATCH)
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
  const queryClient = useQueryClient(); // 👈 Hook para invalidar queries
  const trabalhador = user as Trabalhador;

  // Query principal que busca todos os dados
  const { data, isLoading, isError } = useQuery({
    queryKey: ["workerData", trabalhador.id],
    queryFn: () => fetchWorkerData(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  // --- MUTATIONS ---

  // Mutation para atualizar o status do SERVIÇO
  const servicoMutation = useMutation({
    mutationFn: updateServicoStatus,
    onSuccess: () => {
      // Invalida a query 'workerData' para buscar os dados atualizados
      queryClient.invalidateQueries({
        queryKey: ["workerData", trabalhador.id],
      });
      // Invalida a query do cliente também, para o caso dele estar vendo
      queryClient.invalidateQueries({ queryKey: ["servicosCliente"] });
    },
  });

  // Mutation para atualizar o status da SOLICITAÇÃO
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
    // 1. Muda status da Solicitação para "ACEITA"
    solicitacaoMutation.mutate({ id: solicitacao.id, status: "ACEITA" });
    // 2. Muda status do Serviço para "EM_ANDAMENTO"
    servicoMutation.mutate({
      id: solicitacao.servicoId,
      status: "EM_ANDAMENTO",
    });
  };

  const handleReject = (solicitacao: SolicitacaoServico) => {
    // 1. Muda status da Solicitação para "RECUSADA"
    solicitacaoMutation.mutate({ id: solicitacao.id, status: "RECUSADA" });
    // 2. Muda status do Serviço para "RECUSADO"
    servicoMutation.mutate({ id: solicitacao.servicoId, status: "RECUSADO" });
  };

  // =================================================================
  //  MUDANÇA ZIKA: ATUALIZANDO O HANDLEFINISH
  // =================================================================
  const handleRequestFinish = (servico: Servico) => {
    // 1. Muda status do Serviço para "PENDENTE_APROVACAO"
    servicoMutation.mutate({ id: servico.id, status: "PENDENTE_APROVACAO" });
  };
  // =================================================================

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
          <Typography as="h1">Painel do Profissional</Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            variant="primary"
            size="lg"
            className="mt-4 md:mt-0 shadow-lg shadow-primary/20 hover:shadow-primary/40"
          >
            Ver Agenda Completa 📅
          </Button>
        </motion.div>
      </div>

      {/* CARD DE BOAS-VINDAS */}
      <motion.div variants={itemVariants}>
        <Card className={`p-8 ${welcomeCardClass}`}>
          <div className="flex justify-between items-center">
            <Typography
              as="h2"
              className="!text-white !text-4xl font-extrabold"
            >
              E aí, {primeiroNome}! Mão na massa?
            </Typography>
            <Rating score={trabalhador.notaTrabalhador} />
          </div>
          <p className="mt-3 text-xl text-white/80">
            Sua nota média atual é de{" "}
            <span className="font-bold text-dark-background/80 bg-accent rounded-full px-2">
              {trabalhador.notaTrabalhador}
            </span>
            . Mantenha o trabalho zika!
          </p>
        </Card>
      </motion.div>

      {/* CARDS DE ESTATÍSTICAS RÁPIDAS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Novas Solicitações */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-accent">
            <Typography
              as="h3"
              className="!text-3xl text-accent font-extrabold"
            >
              {newRequestsCount}
            </Typography>
            <Typography as="p" className="text-dark-subtle mt-1">
              Novas Solicitações de Serviço
            </Typography>
          </Card>
        </motion.div>

        {/* Serviços Ativos */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-primary">
            <Typography
              as="h3"
              className="!text-3xl text-primary font-extrabold"
            >
              {activeServicesCount}
            </Typography>
            <Typography as="p" className="text-dark-subtle mt-1">
              Serviços em Andamento
            </Typography>
          </Card>
        </motion.div>
      </div>

      {/* // --- SEÇÃO NOVAS SOLICITAÇÕES (LISTA) ---
       */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
          <Typography
            as="h2"
            className="!text-2xl border-b border-dark-surface/50 pb-2"
          >
            🔔 Novas Solicitações ({newRequestsCount})
          </Typography>
          <p className="text-dark-subtle mt-2">
            Clientes aguardando sua resposta.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {data?.newRequests && data.newRequests.length > 0 ? (
            data.newRequests.map((sol) => (
              <motion.div key={sol.id} variants={itemVariants}>
                <Card className="p-6 shadow-glow-accent">
                  {/* Info do Cliente */}
                  <div className="flex items-center mb-4">
                    <img
                      src={sol.cliente.avatarUrl}
                      alt={sol.cliente.nome}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-accent"
                    />
                    <div>
                      <Typography as="h3" className="!text-lg !text-dark-text">
                        {sol.cliente.nome}
                      </Typography>
                      <p className="text-sm text-dark-subtle">
                        {sol.cliente.endereco.cidade} -{" "}
                        {sol.cliente.endereco.estado}
                      </p>
                    </div>
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
                      className="italic bg-dark-background/50 p-3 rounded-md"
                    >
                      "{sol.descricao}"
                    </Typography>
                  </div>

                  {/* Botões de Ação */}
                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleReject(sol)}
                      disabled={isMutating}
                    >
                      Recusar
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleAccept(sol)}
                      disabled={isMutating}
                    >
                      {isMutating ? "Aguarde..." : "Aceitar"}
                    </Button>
                  </div>
                </Card>
              </motion.div>
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
        </div>
      </section>

      {/* // --- SEÇÃO SERVIÇOS EM ANDAMENTO (ATUALIZADA) ---
       */}
      {/* ================================================================= */}
      {/* MUDANÇA ZIKA: ATUALIZANDO A SEÇÃO "SERVIÇOS ATIVOS" */}
      {/* ================================================================= */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
          <Typography
            as="h2"
            className="!text-2xl border-b border-dark-surface/50 pb-2"
          >
            💼 Seus Serviços Ativos ({activeServicesCount})
          </Typography>
          <p className="text-dark-subtle mt-2">
            Trabalhos em progresso ou aguardando aprovação do cliente.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {data?.activeServices && data.activeServices.length > 0 ? (
            data.activeServices.map((servico) => (
              <motion.div key={servico.id} variants={itemVariants}>
                <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-5">
                  {/* Info Cliente + Serviço */}
                  <div className="flex items-center mb-4 md:mb-0">
                    <img
                      src={servico.cliente.avatarUrl}
                      alt={servico.cliente.nome}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-primary"
                    />
                    <div>
                      <Typography as="h3" className="!text-lg !text-dark-text">
                        {servico.titulo}
                      </Typography>
                      <p className="text-sm text-dark-subtle mt-1">
                        Cliente:{" "}
                        <span className="font-semibold text-primary">
                          {servico.cliente.nome}
                        </span>
                      </p>
                      {/* 👇 Mostra o status atual */}
                      <p className="text-sm text-dark-subtle">
                        Status:{" "}
                        <span className="font-semibold text-accent">
                          {servico.statusServico.replace(/_/g, " ")}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Botão de Ação */}
                  <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <Button
                      size="md"
                      variant="outline" // Mudou para outline
                      className="w-full md:w-auto"
                      onClick={() => navigate(`/dashboard/chat/${servico.id}`)} // Navega para o chat
                      disabled={isMutating}
                    >
                      Abrir Chat 💬
                    </Button>

                    {/* Lógica do Botão de Finalização */}
                    {servico.statusServico === "EM_ANDAMENTO" ? (
                      <Button
                        size="md"
                        variant="primary"
                        className="w-full md:w-auto"
                        onClick={() => handleRequestFinish(servico)} // 👈 CHAMA A NOVA FUNÇÃO
                        disabled={isMutating}
                      >
                        {isMutating ? "..." : "Solicitar Finalização"}
                      </Button>
                    ) : (
                      <Button
                        size="md"
                        variant="primary" // Mantém o estilo, mas desabilitado
                        className="w-full md:w-auto opacity-70"
                        disabled={true}
                      >
                        Aguardando Cliente
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                <Typography as="p">
                  Nenhum serviço em andamento. Aceite novas solicitações!
                </Typography>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
      {/* ================================================================= */}
    </motion.div>
  );
}
