// src/pages/DashboardClientePage.tsx

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // 👈 IMPORTA MUTATION E CLIENT
import { motion } from "framer-motion";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";
import type { Servico, Trabalhador, StatusServico } from "../types/api"; // 👈 IMPORTA StatusServico
import { useNavigate } from "react-router-dom";
import { TrabalhadorCard } from "../components/ui/TrabalhadorCard";
import { useMemo } from "react"; // 👈 IMPORTA useMemo

// =================================================================
//  MUDANÇA ZIKA: ATUALIZANDO AS FUNÇÕES DE FETCH
// =================================================================

// --- FUNÇÕES DE BUSCA ---
// Busca apenas os serviços do cliente logado
const fetchServicosCliente = async (clienteId: number): Promise<Servico[]> => {
  const response = await fetch(
    `http://localhost:3333/servicos?clienteId=${clienteId}`
  );
  if (!response.ok) throw new Error("Não foi possível buscar os serviços.");
  return response.json();
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  // ... (Esta função permanece a mesma)
  const response = await fetch("http://localhost:3333/trabalhadores");
  if (!response.ok)
    throw new Error("Não foi possível buscar os trabalhadores.");
  return response.json();
};
// =================================================================

// --- VARIANTES DE ANIMAÇÃO ZIKA ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Animação em cascata
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
// =================================================================

// =================================================================
//  MUDANÇA ZIKA: ADICIONANDO MUTATION DE SERVIÇO
// =================================================================
// (Poderia ser movida para um arquivo 'api.ts' para reutilizar)
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
// =================================================================

// --- COMPONENTE PRINCIPAL ---
export function DashboardClientePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // 👈 Hook do QueryClient

  // =================================================================
  //  MUDANÇA ZIKA: ATUALIZANDO QUERIES E ADICIONANDO MUTATION
  // =================================================================
  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ["servicosCliente", user?.id], // 👈 Chave única por cliente
    queryFn: () => fetchServicosCliente(user!.id), // 👈 Nova função de fetch
    enabled: !!user?.id, // 👈 Só roda se o user estiver carregado
  });

  const { data: trabalhadores, isLoading: isLoadingTrabalhadores } = useQuery<
    Trabalhador[]
  >({
    queryKey: ["trabalhadores"],
    queryFn: fetchTrabalhadores,
  });

  // Mutation para o cliente aprovar/contestar
  const servicoMutation = useMutation({
    mutationFn: updateServicoStatus,
    onSuccess: () => {
      // Revalida a query de serviços do cliente para atualizar a UI
      queryClient.invalidateQueries({
        queryKey: ["servicosCliente", user?.id],
      });
      // Revalida a query do trabalhador também (caso ele esteja olhando)
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
    },
  });
  // =================================================================

  // Separa os serviços em listas
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

  const totalServicosAtivos = servicosAtivos.length;
  const primeiroNome = user?.nome.split(" ")[0];
  const isLoading = isLoadingServicos || isLoadingTrabalhadores;

  // --- HANDLERS DE APROVAÇÃO ---
  const handleApprove = (servicoId: number) => {
    servicoMutation.mutate({ id: servicoId, status: "FINALIZADO" });
  };

  const handleContest = (servicoId: number) => {
    // Reverte o status para EM_ANDAMENTO para o trabalhador corrigir
    servicoMutation.mutate({ id: servicoId, status: "EM_ANDAMENTO" });
  };

  // --- FUNÇÃO DE RENDERIZAÇÃO ZIKA PARA OS BOTÕES ---
  const renderServiceActions = (servico: Servico) => {
    const isMutating = servicoMutation.isPending;

    switch (servico.statusServico) {
      case "PENDENTE_APROVACAO":
        return (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleContest(servico.id)}
              disabled={isMutating}
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white" // 👈 Estilo ZIKA de perigo
            >
              Contestar
            </Button>
            <Button
              size="sm"
              variant="secondary" // 👈 Botão de sucesso (accent)
              onClick={() => handleApprove(servico.id)}
              disabled={isMutating}
            >
              {isMutating ? "..." : "Confirmar Finalização"}
            </Button>
          </div>
        );
      case "EM_ANDAMENTO":
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => navigate(`/dashboard/chat/${servico.id}`)}
          >
            Abrir Chat
          </Button>
        );
      case "PENDENTE":
      case "SOLICITADO":
        return (
          <Button size="sm" variant="outline" disabled>
            Aguardando Profissional
          </Button>
        );
      default:
        // Caso PENDENTE, SOLICITADO, etc.
        return (
          <Button size="sm" variant="outline" disabled>
            Detalhes
          </Button>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Carregando o Painel ZIKA...</Typography>
        <p className="text-dark-subtle mt-4">
          Buscando seus dados e profissionais em destaque.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* HEADER DINÂMICO E BOTÃO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <motion.div variants={itemVariants}>
          <Typography as="h1">Painel do Cliente</Typography>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Button
            variant="secondary"
            size="lg"
            className="mt-4 md:mt-0 shadow-lg shadow-accent/20 hover:shadow-accent/40"
            onClick={() => navigate("/dashboard/solicitar")}
          >
            Solicitar Novo Serviço ✨
          </Button>
        </motion.div>
      </div>

      {/* CARD DE BOAS-VINDAS / STATUS ATIVO */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary to-teal-700 p-8 shadow-2xl shadow-primary/40">
          <Typography as="h2" className="!text-white !text-4xl font-extrabold">
            E aí, {primeiroNome}!
          </Typography>
          <p className="mt-3 text-xl text-teal-200">
            Você tem{" "}
            <span className="font-bold text-accent">{totalServicosAtivos}</span>{" "}
            serviços ativos no momento.
          </p>
        </Card>
      </motion.div>

      {/* SEÇÃO TRABALHADORES EM DESTAQUE - AGORA USANDO O COMPONENTE PADRÃO */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
          <Typography
            as="h2"
            className="!text-2xl border-b border-dark-surface/50 pb-2"
          >
            🌟 Profissionais em Destaque
          </Typography>
          <p className="text-dark-subtle mt-2">
            Os melhores avaliados e mais requisitados da semana.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trabalhadores?.slice(0, 4).map((trabalhador) => (
            <TrabalhadorCard key={trabalhador.id} trabalhador={trabalhador} />
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* MUDANÇA ZIKA: ATUALIZANDO A SEÇÃO "MEUS SERVIÇOS" */}
      {/* ================================================================= */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
          <Typography
            as="h2"
            className="!text-2xl border-b border-dark-surface/50 pb-2"
          >
            🛠️ Meus Serviços Ativos ({totalServicosAtivos})
          </Typography>
          <p className="text-dark-subtle mt-2">
            Acompanhe o status e as ações pendentes dos seus pedidos.
          </p>
        </motion.div>

        <div className="grid gap-4">
          {servicosAtivos.length > 0 ? (
            servicosAtivos.map((servico) => (
              <motion.div key={servico.id} variants={itemVariants}>
                <Card className="flex flex-col md:flex-row justify-between items-start md:items-center p-5">
                  <div>
                    <Typography as="h3" className="!text-lg">
                      {servico.titulo}
                    </Typography>
                    <p className="text-sm text-dark-subtle mt-1">
                      Tipo: {servico.tipoServico.replace(/_/g, " ")} | Status:{" "}
                      <span
                        className={`font-semibold ${
                          servico.statusServico === "PENDENTE_APROVACAO"
                            ? "text-accent animate-pulse" // 👈 Destaque ZIKA
                            : "text-primary"
                        }`}
                      >
                        {servico.statusServico.replace(/_/g, " ")}
                      </span>
                    </p>
                  </div>
                  {/* 👇 CHAMA A FUNÇÃO DE RENDERIZAÇÃO ZIKA */}
                  <div className="mt-4 md:mt-0">
                    {renderServiceActions(servico)}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
              <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                <Typography as="p">
                  Você ainda não solicitou nenhum serviço. Que tal começar?
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
        </div>
      </section>
      {/* ================================================================= */}


      {/* (BÔNUS ZIKA) Seção de Serviços Finalizados */}
      {servicosFinalizados.length > 0 && (
        <section className="space-y-6">
          <motion.div variants={itemVariants}>
            <Typography
              as="h2"
              className="!text-2xl border-b border-dark-surface/50 pb-2"
            >
              ✅ Meus Serviços Finalizados ({servicosFinalizados.length})
            </Typography>
            <p className="text-dark-subtle mt-2">
              Seu histórico de serviços concluídos.
            </p>
          </motion.div>

          <div className="grid gap-4">
            {servicosFinalizados.map((servico) => (
              <motion.div key={servico.id} variants={itemVariants}>
                <Card className="flex justify-between items-center p-5 opacity-70">
                  <div>
                    <Typography as="h3" className="!text-lg">
                      {servico.titulo}
                    </Typography>
                    <p className="text-sm text-dark-subtle mt-1">
                      Tipo: {servico.tipoServico.replace(/_/g, " ")}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" disabled>
                    Ver Avaliação
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
