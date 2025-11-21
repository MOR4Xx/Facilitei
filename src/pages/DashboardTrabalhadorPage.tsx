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
  CogIcon, 
} from "../components/ui/Icons";
import { AvaliacaoClienteModal } from "../components/ui/AvaliacaoClienteModal";
import { api, get, post, patch, put } from "../lib/api"; // Helper Axios
import { toast } from "react-hot-toast";

// Interface para Solicitação (refletindo o DTO de resposta)
interface SolicitacaoServico {
  id: string; 
  clienteId: string;
  trabalhadorId: string;
  tipoServico: string; // enum string
  servicoId?: string | null; // Pode ser nulo se pendente
  descricao: string;
  status: "PENDENTE" | "ACEITA" | "RECUSADA";
  
  // Campos hidratados (não vêm da API de solicitação, nós buscamos)
  cliente?: Cliente;
}

interface WorkerData {
  newRequests: SolicitacaoServico[];
  activeServices: (Servico & { cliente: Cliente })[];
  finishedServices: (Servico & { cliente: Cliente })[];
}

// --- VARIANTES ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-xl ${i < score ? "text-accent" : "text-dark-subtle/50"}`}>★</span>
  ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

// --- FUNÇÕES DE FETCH ---
const fetchWorkerData = async (workerId: string): Promise<WorkerData> => { 
  // 1. Buscar todos os serviços já criados onde sou o trabalhador
  const allServices = await get<Servico[]>(`/servicos?trabalhadorId=${workerId}`);

  // Filtra ativos e finalizados
  const activeServices = allServices.filter(s => 
    s.statusServico === "EM_ANDAMENTO" || s.statusServico === "PENDENTE_APROVACAO"
  );
  const finishedServices = allServices.filter(s => s.statusServico === "FINALIZADO");

  // 2. Buscar todas as solicitações (o ideal seria um endpoint filtrado no back)
  const allSolicitations = await get<SolicitacaoServico[]>('/solicitacoes-servico');
  
  // Filtra: Minhas solicitações e que estão PENDENTES
  const myNewRequests = allSolicitations.filter(sol => 
    String(sol.trabalhadorId) === String(workerId) && sol.status === "PENDENTE"
  );

  // 3. Hidratação de Clientes (para mostrar nomes e fotos)
  // Para Solicitações
  const newRequestsWithClient = await Promise.all(
    myNewRequests.map(async (sol) => {
      const cliente = await get<Cliente>(`/clientes/id/${sol.clienteId}`); 
      return { ...sol, cliente };
    })
  );

  // Para Serviços Ativos
  const activeServicesWithClient = await Promise.all(
    activeServices.map(async (servico) => {
      const cliente = await get<Cliente>(`/clientes/id/${servico.clienteId}`); 
      return { ...servico, cliente };
    })
  );

  // Para Serviços Finalizados
  const finishedServicesWithClient = await Promise.all(
    finishedServices.map(async (servico) => {
      const cliente = await get<Cliente>(`/clientes/id/${servico.clienteId}`); 
      return { ...servico, cliente };
    })
  );

  return {
    newRequests: newRequestsWithClient,
    activeServices: activeServicesWithClient,
    finishedServices: finishedServicesWithClient,
  };
};

const fetchAvaliacaoClienteFeitas = async (trabalhadorId: string): Promise<AvaliacaoCliente[]> => {
  try {
      return await get<AvaliacaoCliente[]>(`/avaliacoes-cliente/trabalhador/${trabalhadorId}`);
  } catch {
      return [];
  }
};

// --- COMPONENTE PRINCIPAL ---
export function DashboardTrabalhadorPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const trabalhador = user as Trabalhador;
  const [reviewingClientService, setReviewingClientService] = useState<Servico | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["workerData", trabalhador.id],
    queryFn: () => fetchWorkerData(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  const { data: avaliacoesFeitas } = useQuery({
    queryKey: ["avaliacoesClienteFeitas", trabalhador.id],
    queryFn: () => fetchAvaliacaoClienteFeitas(trabalhador.id),
    enabled: !!trabalhador.id,
  });

  const reviewedClientServiceIds = useMemo(() => {
    return new Set(avaliacoesFeitas?.map((av) => av.servicoId));
  }, [avaliacoesFeitas]);

  // --- HANDLERS DE AÇÃO ---

 const handleAccept = async (solicitacao: SolicitacaoServico) => {
    setIsMutating(true);
    try {
      // 1. Criar o Serviço (O Contrato)
      // NOTA: O backend define automaticamente como 'PENDENTE'.
      // Removemos o envio de statusServico pois o DTO do Java não aceita esse campo.
      const newService = await post<Servico>('/servicos', {
        titulo: `Serviço: ${solicitacao.tipoServico.replace(/_/g, ' ')}`,
        descricao: solicitacao.descricao,
        preco: 100.00, // Valor placeholder (futuramente pode vir de um input)
        trabalhadorId: Number(solicitacao.trabalhadorId),
        clienteId: Number(solicitacao.clienteId),
        tipoServico: solicitacao.tipoServico
      });

      // 2. Atualizar a Solicitação para ACEITA
      // Enviamos os dados completos para garantir que o DTO do backend seja validado corretamente
      await patch(`/solicitacoes-servico/${solicitacao.id}`, {
         clienteId: solicitacao.clienteId,
         trabalhadorId: solicitacao.trabalhadorId,
         tipoServico: solicitacao.tipoServico,
         descricao: solicitacao.descricao,
         statusSolicitacao: "ACEITA"
      });

      toast.success("Serviço aceito! O chat foi liberado.");
      
      // Invalida as queries para recarregar a lista de solicitações e serviços
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
      
    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Erro ao aceitar serviço.";
      toast.error(msg);
    } finally {
      setIsMutating(false);
    }
  };

  const handleReject = async (solicitacao: SolicitacaoServico) => {
    setIsMutating(true);
    try {
       // Enviamos os dados completos para segurança de validação
       await patch(`/solicitacoes-servico/${solicitacao.id}`, { 
          clienteId: solicitacao.clienteId,
          trabalhadorId: solicitacao.trabalhadorId,
          tipoServico: solicitacao.tipoServico,
          descricao: solicitacao.descricao,
          statusSolicitacao: "RECUSADA" 
       });
       
       toast.success("Solicitação recusada.");
       queryClient.invalidateQueries({ queryKey: ["workerData"] });
    } catch(error: any) {
       console.error(error);
       toast.error("Erro ao recusar.");
    } finally {
       setIsMutating(false);
    }
  };

  const handleRequestFinish = async (servico: Servico) => {
    setIsMutating(true);
    try {
        // Atualiza o serviço completo (PUT) ou parcial (PATCH) se tiver
        // Como seu backend ServicoController tem PUT, precisamos enviar o objeto todo
        // Mas idealmente seria um PATCH. Vamos tentar simular o PUT:
        await put(`/servicos/${servico.id}`, {
            ...servico, // espalha dados atuais
            statusServico: "PENDENTE_APROVACAO" // muda status
        });
        toast.success("Finalização solicitada ao cliente!");
        queryClient.invalidateQueries({ queryKey: ["workerData"] });
    } catch (e) {
        toast.error("Erro ao solicitar finalização.");
    } finally {
        setIsMutating(false);
    }
  };

  // --- RENDER ---
  const primeiroNome = trabalhador?.nome.split(" ")[0];
  const newRequestsCount = data?.newRequests.length || 0;
  const activeServicesCount = data?.activeServices.length || 0;

  if (isLoading) {
    return <div className="text-center py-20"><Typography as="h2">Carregando...</Typography></div>;
  }

  if (isError) {
    return <div className="text-center py-20 text-red-500"><Typography as="h2">Erro ao carregar dados.</Typography></div>;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <motion.div variants={itemVariants}>
          <Typography as="h1">E aí, {primeiroNome}!</Typography>
          <Typography as="p" className="!text-lg !text-dark-subtle">
            Hora de colocar a mão na massa.
          </Typography>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-4 mt-4 md:mt-0 w-full md:w-auto">
          <Button variant="outline" size="md" className="!px-4" onClick={() => navigate("/dashboard/configuracoes")}>
            <CogIcon className="w-6 h-6" />
          </Button>
          <Button variant="primary" size="lg" className="shadow-lg w-full">
            <CalendarDaysIcon className="w-5 h-5 mr-2" /> Ver Agenda
          </Button>
        </motion.div>
      </div>

      {/* Welcome Card */}
      <motion.div variants={itemVariants}>
        <Card className={`p-6 md:p-8 ${welcomeCardClass}`}>
          <div className="flex justify-between items-center">
            <div>
              <Typography as="h2" className="!text-white !text-3xl font-extrabold">
                Nota: {trabalhador.notaTrabalhador.toFixed(1)}
              </Typography>
            </div>
            <Rating score={trabalhador.notaTrabalhador} />
          </div>
        </Card>
      </motion.div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6 flex justify-between items-center">
            <div>
              <Typography as="h3" className="!text-3xl text-accent font-extrabold">{newRequestsCount}</Typography>
              <Typography as="p" className="text-dark-subtle">Novas Solicitações</Typography>
            </div>
            <BellIcon className="w-12 h-12 text-accent opacity-30" />
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="p-6 flex justify-between items-center">
            <div>
              <Typography as="h3" className="!text-3xl text-primary font-extrabold">{activeServicesCount}</Typography>
              <Typography as="p" className="text-dark-subtle">Serviços Ativos</Typography>
            </div>
            <BriefcaseIcon className="w-12 h-12 text-primary opacity-30" />
          </Card>
        </motion.div>
      </div>

      {/* Layout Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna: Solicitações */}
        <section className="space-y-6 lg:col-span-2">
          <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
              🔔 Novas Solicitações ({newRequestsCount})
            </Typography>
          </motion.div>

          <LayoutGroup>
            <motion.div className="grid grid-cols-1 gap-6">
              {data?.newRequests && data.newRequests.length > 0 ? (
                data.newRequests.map((sol) => (
                  <Card key={sol.id} variants={itemVariants} layout className="p-6 shadow-glow-accent !border-accent/80">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center mb-4">
                        <img src={sol.cliente?.avatarUrl || '/default-avatar.png'} alt={sol.cliente?.nome} className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-accent" />
                        <div>
                          <Typography as="h3" className="!text-lg !text-dark-text">{sol.cliente?.nome}</Typography>
                          <p className="text-sm text-dark-subtle">{sol.cliente?.endereco?.cidade}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold py-1 px-3 rounded-full bg-accent text-dark-background">NOVO</span>
                    </div>
                    <div className="mb-5">
                      <Typography as="p" className="!text-dark-text !font-semibold mb-1">{sol.tipoServico.replace(/_/g, ' ')}</Typography>
                      <Typography as="p" className="italic bg-dark-background/50 p-3 rounded-md text-sm">"{sol.descricao}"</Typography>
                    </div>
                    <div className="flex gap-4">
                      <Button variant="outline" className="w-full !border-status-danger !text-status-danger" onClick={() => handleReject(sol)} disabled={isMutating}>
                        <XMarkIcon className="w-5 h-5 mr-1" /> Recusar
                      </Button>
                      <Button variant="secondary" className="w-full" onClick={() => handleAccept(sol)} disabled={isMutating}>
                        <CheckIcon className="w-5 h-5 mr-1" /> Aceitar
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                  <Typography as="p">Nenhuma nova solicitação.</Typography>
                </Card>
              )}
            </motion.div>
          </LayoutGroup>
        </section>

        {/* Coluna: Serviços Ativos */}
        <aside className="space-y-6 lg:col-span-1">
          <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
              💼 Serviços Ativos
            </Typography>
          </motion.div>
          <LayoutGroup>
            <div className="grid gap-4">
              {data?.activeServices && data.activeServices.length > 0 ? (
                data.activeServices.map((servico) => (
                  <Card key={servico.id} variants={itemVariants} layout className={`p-4 ${servico.statusServico === "PENDENTE_APROVACAO" ? "!border-status-pending" : "!border-primary/30"}`}>
                    <div className="flex items-center justify-between">
                      <img src={servico.cliente?.avatarUrl} alt={servico.cliente?.nome} className="w-10 h-10 rounded-full object-cover mr-3" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-semibold text-dark-text truncate">{servico.titulo}</p>
                        <p className="text-xs text-dark-subtle truncate">{servico.cliente?.nome}</p>
                      </div>
                      <Button size="sm" variant="outline" className="!p-2 ml-2" onClick={() => navigate(`/dashboard/chat/${servico.id}`)}>
                        <ChatBubbleLeftRightIcon className="w-5 h-5" />
                      </Button>
                    </div>
                    {servico.statusServico === "EM_ANDAMENTO" ? (
                      <Button size="sm" variant="primary" className="w-full mt-3" onClick={() => handleRequestFinish(servico)} disabled={isMutating}>
                        <CheckIcon className="w-4 h-4 mr-1" /> Finalizar
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" className="w-full mt-3 !text-status-pending !border-status-pending" disabled>
                        Aguardando Aprovação
                      </Button>
                    )}
                  </Card>
                ))
              ) : (
                <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                  <Typography as="p" className="text-sm">Sem serviços ativos.</Typography>
                </Card>
              )}
            </div>
          </LayoutGroup>
        </aside>
      </div>

      {/* Histórico */}
      {data?.finishedServices && data.finishedServices.length > 0 && (
        <section className="space-y-6">
           <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
              ✅ Histórico
            </Typography>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {data.finishedServices.map(servico => {
               const isReviewed = reviewedClientServiceIds.has(servico.id);
               return (
                 <Card key={servico.id} variants={itemVariants} className={`p-5 ${isReviewed ? "opacity-60" : ""}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <img src={servico.cliente?.avatarUrl} className="w-10 h-10 rounded-full" />
                        <div>
                           <Typography as="h3" className="!text-lg">{servico.titulo}</Typography>
                           <p className="text-sm text-dark-subtle">Finalizado</p>
                        </div>
                      </div>
                      {isReviewed ? (
                        <Button size="sm" variant="outline" disabled>Avaliado</Button>
                      ) : (
                        <Button size="sm" variant="secondary" onClick={() => setReviewingClientService(servico)}>Avaliar</Button>
                      )}
                    </div>
                 </Card>
               )
            })}
          </div>
        </section>
      )}

      <AnimatePresence>
        {reviewingClientService && (
          <AvaliacaoClienteModal servico={reviewingClientService} onClose={() => setReviewingClientService(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}