// src/pages/DashboardTrabalhadorPage.tsx

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion'; 
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { useAuthStore } from "../store/useAuthStore";
import type { Servico, Trabalhador } from '../types/api';

// Definindo o tipo de Solicitação de Serviço com base no db.json
interface SolicitacaoServico {
  id: number;
  clienteId: number;
  servicoId: number;
  descricao: string;
  statusSolicitacao: 'PENDENTE' | 'ACEITA';
}

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

// --- COMPONENTE DE RATING (Estrelas) ---
// Reutilizado do DashboardClientePage para consistência
const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span 
      key={i} 
      className={`text-xl ${i < score ? 'text-accent' : 'text-dark-subtle/50'}`}
    >
      ★
    </span>
  ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

// --- FUNÇÕES DE BUSCA SIMULADA ---

// Busca todas as solicitações e serviços, e filtra pelo ID do trabalhador
const fetchWorkerData = async (workerId: number) => {
    // Busca todos os serviços
    const servicesResponse = await fetch('http://localhost:3333/servicos');
    if (!servicesResponse.ok) throw new Error('Falha ao buscar serviços.');
    const allServices: Servico[] = await servicesResponse.json();

    // Filtra serviços designados ao trabalhador
    const workerServices = allServices.filter(s => s.trabalhadorId === workerId);
    
    // Busca todas as solicitações
    const solicitationsResponse = await fetch('http://localhost:3333/solicitacoes-servico');
    if (!solicitationsResponse.ok) throw new Error('Falha ao buscar solicitações.');
    const allSolicitations: SolicitacaoServico[] = await solicitationsResponse.json();

    // IDs dos serviços designados ao trabalhador
    const workerServiceIds = workerServices.map(s => s.id);

    // Filtra solicitações PENDENTES relacionadas aos serviços do trabalhador
    const newRequests = allSolicitations.filter(sol => 
        workerServiceIds.includes(sol.servicoId) && sol.statusSolicitacao === 'PENDENTE'
    );
    
    // Filtra serviços EM_ANDAMENTO
    const activeServices = workerServices.filter(s => s.statusServico === 'EM_ANDAMENTO');


    // Retorna os dados agregados
    return {
        newRequests,
        activeServices
    };
};

// --- COMPONENTE PRINCIPAL ---
export function DashboardTrabalhadorPage() {
  const { user } = useAuthStore();
  // Assume que 'user' é um Trabalhador, já que esta é a rota protegida para eles
  const trabalhador = user as Trabalhador; 

  // Busca de dados com React Query
  const { data, isLoading } = useQuery({
    queryKey: ['workerData', trabalhador.id],
    queryFn: () => fetchWorkerData(trabalhador.id),
    enabled: !!trabalhador.id,
  });
  
  const primeiroNome = trabalhador?.nome.split(' ')[0];
  const newRequestsCount = data?.newRequests.length || 0;
  const activeServicesCount = data?.activeServices.length || 0;

  if (isLoading) {
    return (
        <div className="text-center py-20">
            <Typography as="h2">Carregando Painel do Profissional...</Typography>
            <p className="text-dark-subtle mt-4">Organizando suas solicitações e tarefas.</p>
        </div>
    );
  }

  // Cor de fundo do Card de Boas-vindas baseada na nota
  // Se nota >= 4, usa um gradiente de sucesso (accent), se não, usa o primário.
  const welcomeCardClass = trabalhador.notaTrabalhador >= 4 
    ? 'bg-gradient-to-r from-accent to-lime-600 shadow-2xl shadow-accent/40' 
    : 'bg-gradient-to-r from-primary to-teal-700 shadow-2xl shadow-primary/40';

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

      {/* CARD DE BOAS-VINDAS / DESEMPENHO (O GOSTO DE USAR) */}
      <motion.div variants={itemVariants}>
        <Card className={`p-8 ${welcomeCardClass}`}>
          <div className="flex justify-between items-center">
            <Typography as="h2" className="!text-white !text-4xl font-extrabold">
              E aí, {primeiroNome}! Mão na massa?
            </Typography>
            <Rating score={trabalhador.notaTrabalhador} />
          </div>
          <p className="mt-3 text-xl text-white/80">
            Sua nota média atual é de <span className="font-bold text-dark-background/80 bg-accent rounded-full px-2">{trabalhador.notaTrabalhador}</span>. Mantenha o trabalho zika!
          </p>
        </Card>
      </motion.div>

      {/* CARDS DE ESTATÍSTICAS RÁPIDAS (Grid zika) */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Novas Solicitações */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-accent">
            <Typography as="h3" className="!text-3xl text-accent font-extrabold">
              {newRequestsCount}
            </Typography>
            <Typography as="p" className="text-dark-subtle mt-1">
              Novas Solicitações de Serviço
            </Typography>
            <Button variant="secondary" size="sm" className="mt-4">
                Ver Pedidos
            </Button>
          </Card>
        </motion.div>

        {/* Serviços Ativos */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-primary">
            <Typography as="h3" className="!text-3xl text-primary font-extrabold">
              {activeServicesCount}
            </Typography>
            <Typography as="p" className="text-dark-subtle mt-1">
              Serviços em Andamento
            </Typography>
            <Button variant="primary" size="sm" className="mt-4">
                Acompanhar
            </Button>
          </Card>
        </motion.div>
        
        {/* Clientes Avaliados (Mockado) */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 border-l-4 border-dark-subtle">
            <Typography as="h3" className="!text-3xl text-dark-text font-extrabold">
              4 {/* Mock: Mantenha-o simples por enquanto */}
            </Typography>
            <Typography as="p" className="text-dark-subtle mt-1">
              Clientes que você avaliou
            </Typography>
            <Button variant="outline" size="sm" className="mt-4">
                Avaliar Clientes
            </Button>
          </Card>
        </motion.div>
      </div>
      
      {/* SEÇÃO PRINCIPAL - SERVIÇOS EM ANDAMENTO */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
                💼 Seus Serviços Ativos
            </Typography>
            <p className="text-dark-subtle mt-2">
                Os trabalhos que estão atualmente em progresso.
            </p>
        </motion.div>

        <div className="grid gap-4">
          {data?.activeServices && data.activeServices.length > 0 ? (
            data.activeServices.map((servico) => (
              <motion.div key={servico.id} variants={itemVariants}>
                <Card className="flex justify-between items-center p-5">
                  <div>
                    <Typography as="h3" className="!text-lg">
                      {servico.titulo}
                    </Typography>
                    <p className="text-sm text-dark-subtle mt-1">
                      Status: <span className="font-semibold text-primary">{servico.statusServico}</span> | Preço: R$ {servico.preco.toFixed(2)}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Finalizar Serviço
                  </Button>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
                <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                    <Typography as="p">
                        Nenhum serviço em andamento. Busque novas solicitações!
                    </Typography>
                    <Button variant="secondary" className="mt-4">
                        Ver Novas Solicitações
                    </Button>
                </Card>
            </motion.div>
          )}
        </div>
      </section>

    </motion.div>
  );
}