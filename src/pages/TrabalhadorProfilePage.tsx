// src/pages/TrabalhadorProfilePage.tsx

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import type { Trabalhador } from '../types/api';

// --- VARIANTES DE ANIMAÇÃO ---
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// --- COMPONENTE DE RATING (Estrelas) ---
const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span 
      key={i} 
      className={`text-2xl ${i < score ? 'text-accent' : 'text-dark-subtle/50'}`}
    >
      ★
    </span>
  ));
  return <div className="flex space-x-1">{stars}</div>;
};

// --- FUNÇÃO DE BUSCA DO PROFISSIONAL POR ID ---
const fetchTrabalhadorById = async (id: number): Promise<Trabalhador> => {
  const response = await fetch(`http://localhost:3333/trabalhadores/${id}`);
  if (!response.ok) {
    throw new Error('Profissional não encontrado.');
  }
  return response.json();
};


// --- COMPONENTE PRINCIPAL: TRABALHADOR PROFILE PAGE ZIKA ---
export function TrabalhadorProfilePage() {
    // Captura o ID da URL (ex: 1, 2)
    const { id } = useParams<{ id: string }>(); 
    const trabalhadorId = id ? parseInt(id, 10) : 0;
    
    // Busca os dados do profissional (React Query)
    const { 
        data: trabalhador, 
        isLoading, 
        isError 
    } = useQuery<Trabalhador>({
        queryKey: ['trabalhador', trabalhadorId],
        queryFn: () => fetchTrabalhadorById(trabalhadorId),
        enabled: trabalhadorId > 0,
    });

    if (!id || isError) {
        return (
            <div className="text-center py-20 text-red-500">
                <Typography as="h2">Perfil Não Encontrado</Typography>
                <p className="text-dark-subtle mt-4">O profissional que você busca não está disponível.</p>
                <Button variant="outline" className="mt-6" as={motion.button} onClick={() => window.history.back()}>
                    Voltar para a Busca
                </Button>
            </div>
        );
    }
    
    if (isLoading) {
        return (
            <div className="text-center py-20">
                <Typography as="h2">Carregando Perfil ZIKA...</Typography>
                <p className="text-dark-subtle mt-4">Preparando o perfil completo do profissional.</p>
            </div>
        );
    }

    if (!trabalhador) return null;

    const [primeiroNome] = trabalhador.nome.split(' ');
    const readableService = trabalhador.servicoPrincipal
        ? trabalhador.servicoPrincipal.charAt(0).toUpperCase() + trabalhador.servicoPrincipal.slice(1).toLowerCase()
        : 'Serviço Não Informado';

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={pageVariants}
            className="max-w-4xl mx-auto space-y-10"
        >
            {/* Seção Principal do Perfil */}
            <Card className="p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                
                {/* Avatar e Nota */}
                <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold mb-3 border-4 border-accent shadow-lg">
                        {primeiroNome[0]}
                    </div>
                    <Typography as="h2" className="!text-3xl !text-primary">
                        {trabalhador.nome}
                    </Typography>
                    <div className="mt-2">
                       <Rating score={trabalhador.notaTrabalhador} />
                    </div>
                    <p className="text-sm text-dark-subtle mt-1">Nota Média: {trabalhador.notaTrabalhador.toFixed(1)}</p>
                </div>
                
                {/* Detalhes e Ações */}
                <div className="flex-grow text-center md:text-left pt-4 md:pt-0">
                    <Typography as="p" className="text-xl font-semibold !text-accent mb-2">
                        {readableService}
                    </Typography>
                    <p className="text-dark-subtle mb-4 italic">
                        "Especialista em {readableService}, pronto para resolver seu problema com qualidade e eficiência."
                    </p>

                    <div className="space-y-2 mb-6">
                        <p className="text-dark-text">
                            **Localização:** {trabalhador.endereco.cidade} / {trabalhador.endereco.estado}
                        </p>
                        <p className="text-dark-text">
                            **Disponibilidade:** {trabalhador.disponibilidade}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <Button variant="secondary" size="lg" className="shadow-lg shadow-accent/40">
                            Contratar Agora 🚀
                        </Button>
                        <Button variant="outline" size="lg">
                            Enviar Mensagem
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Serviços e Habilidades */}
            <Card className="p-6">
                <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
                    Serviços Oferecidos
                </Typography>
                <div className="flex flex-wrap gap-3">
                    {trabalhador.servicos.map((servico, index) => (
                        <span key={index} className="px-4 py-1 bg-dark-surface/50 text-dark-text rounded-full text-sm font-medium border border-dark-surface">
                            {servico.replace(/_/g, ' ')}
                        </span>
                    ))}
                </div>
            </Card>
            
            {/* Avaliações Recentes (Mock) */}
            <Card className="p-6">
                <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
                    Histórico e Avaliações
                </Typography>
                <p className="text-dark-subtle italic">
                    (Seção de avaliações e portfólio viria aqui, implementada com base em dados de 'avaliacoes' da API).
                </p>
            </Card>

        </motion.div>
    );
}