// src/pages/DashboardClientePage.tsx

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion'; 
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { useAuthStore } from '../store/useAuthStore';
import type { Servico, Trabalhador } from '../types/api'; // Importando Trabalhador
import { useNavigate } from 'react-router-dom';

// --- FUNÇÕES DE BUSCA ---
const fetchServicos = async (): Promise<Servico[]> => {
  const response = await fetch('http://localhost:3333/servicos');
  if (!response.ok) throw new Error('Não foi possível buscar os serviços.');
  return response.json();
};

const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const response = await fetch('http://localhost:3333/trabalhadores');
  if (!response.ok) throw new Error('Não foi possível buscar os trabalhadores.');
  return response.json();
};

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


// --- COMPONENTE DO CARD DO PROFISSIONAL (O MAIS ZIKA!) ---
function WorkerCard({ trabalhador }: { trabalhador: Trabalhador }) {
    // Pega a primeira letra do nome para o avatar
    const [primeiroNome] = trabalhador.nome.split(' ');
    
    return (
        <motion.div variants={itemVariants}>
            {/* O Card já tem a animação de hover com sombra/movimento */}
            <Card className="p-5 flex flex-col items-center text-center hover:shadow-glow-accent transition-shadow border-2 border-transparent hover:border-accent/40">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 border-4 border-accent">
                    {primeiroNome[0]}
                </div>
                <Typography as="h3" className="!text-xl !text-accent">
                    {trabalhador.nome}
                </Typography>
                <p className="text-sm text-dark-subtle mt-1 mb-3">
                    {trabalhador.disponibilidade.split(',')[0]} {/* Exibe apenas a primeira parte da disponibilidade */}
                </p>
                <Rating score={trabalhador.notaTrabalhador} />
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 border-accent text-accent hover:text-dark-background hover:bg-accent"
                >
                    Ver Perfil
                </Button>
            </Card>
        </motion.div>
    );
}

// --- COMPONENTE PRINCIPAL ---
export function DashboardClientePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Puxando os dados (React Query)
  const { data: servicos, isLoading: isLoadingServicos } = useQuery<Servico[]>({
    queryKey: ['servicos'],
    queryFn: fetchServicos,
  });

  const { data: trabalhadores, isLoading: isLoadingTrabalhadores } = useQuery<Trabalhador[]>({
    queryKey: ['trabalhadores'],
    queryFn: fetchTrabalhadores,
  });


  const totalServicosAtivos = servicos?.filter(s => s.statusServico !== 'FINALIZADO').length || 0;
  const primeiroNome = user?.nome.split(' ')[0];
  const isLoading = isLoadingServicos || isLoadingTrabalhadores;


  if (isLoading) {
    return (
        <div className="text-center py-20">
            <Typography as="h2">Carregando o Painel ZIKA...</Typography>
            <p className="text-dark-subtle mt-4">Buscando seus dados e profissionais em destaque.</p>
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
                onClick={() => navigate('/dashboard/solicitar')} // 👈 NAVEGAÇÃO ZIKA
            >
                Solicitar Novo Serviço ✨
            </Button>
        </motion.div>
      </div>

      {/* CARD DE BOAS-VINDAS / STATUS ATIVO (Diferenciado com gradiente) */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-primary to-teal-700 p-8 shadow-2xl shadow-primary/40">
          <Typography as="h2" className="!text-white !text-4xl font-extrabold">
            E aí, {primeiroNome}!
          </Typography>
          <p className="mt-3 text-xl text-teal-200">
            Você tem <span className="font-bold text-accent">{totalServicosAtivos}</span> serviços ativos no momento.
          </p>
        </Card>
      </motion.div>
      
      {/* SEÇÃO TRABALHADORES EM DESTAQUE - O ZIKA! */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
                🌟 Profissionais em Destaque 
            </Typography>
            <p className="text-dark-subtle mt-2">
                Os melhores avaliados e mais requisitados da semana.
            </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Renderiza os WorkerCards com animação */}
            {trabalhadores?.slice(0, 4).map((trabalhador) => (
                <WorkerCard key={trabalhador.id} trabalhador={trabalhador} />
            ))}
        </div>
      </section>

      {/* SEÇÃO DE SERVIÇOS ATIVOS (Acompanhamento) */}
      <section className="space-y-6">
        <motion.div variants={itemVariants}>
            <Typography as="h2" className="!text-2xl border-b border-dark-surface/50 pb-2">
                🛠️ Meus Serviços em Andamento ({totalServicosAtivos})
            </Typography>
            <p className="text-dark-subtle mt-2">
                Acompanhe o status e as informações dos seus pedidos.
            </p>
        </motion.div>

        <div className="grid gap-4">
          {servicos && servicos.length > 0 ? (
            servicos.map((servico) => (
              <motion.div key={servico.id} variants={itemVariants}>
                <Card className="flex justify-between items-center p-5">
                  <div>
                    <Typography as="h3" className="!text-lg">
                      {servico.titulo}
                    </Typography>
                    <p className="text-sm text-dark-subtle mt-1">
                      Tipo: {servico.tipoServico} | Status: <span className="font-semibold text-primary">{servico.statusServico}</span>
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Detalhes
                  </Button>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants}>
                <Card className="text-center p-8 border-dashed border-dark-subtle/30 border-2">
                    <Typography as="p">
                        Você ainda não solicitou nenhum serviço. Que tal começar?
                    </Typography>
                    <Button variant="secondary" className="mt-4">
                        Buscar Profissionais
                    </Button>
                </Card>
            </motion.div>
          )}
        </div>
      </section>

    </motion.div>
  );
}