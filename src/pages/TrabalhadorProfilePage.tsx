// src/pages/TrabalhadorProfilePage.tsx

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import type { Trabalhador, Cliente } from '../types/api';
import { useEffect, useState } from 'react';

// --- INTERFACES ADICIONAIS ---
interface AvaliacaoTrabalhador {
  id: number;
  clienteId: number;
  trabalhadorId: number;
  nota: number;
  comentario: string;
  clienteNome?: string; // Nome do cliente será adicionado aqui
}

// --- VARIANTES DE ANIMAÇÃO ---
const pageVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, duration: 0.4 },
  },
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
        className={`text-2xl ${
          i < score ? 'text-accent' : 'text-dark-subtle/50'
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-1">{stars}</div>;
};

// --- FUNÇÕES DE BUSCA ---
const fetchTrabalhadorById = async (id: number): Promise<Trabalhador> => {
  const response = await fetch(`http://localhost:3333/trabalhadores/${id}`);
  if (!response.ok) {
    throw new Error('Profissional não encontrado.');
  }
  return response.json();
};

const fetchAvaliacoes = async (
  workerId: number
): Promise<AvaliacaoTrabalhador[]> => {
  // 1. Busca todas as avaliações de trabalhadores
  const response = await fetch(
    `http://localhost:3333/avaliacoes-trabalhador?trabalhadorId=${workerId}`
  );
  if (!response.ok) return [];
  const avaliacoes: AvaliacaoTrabalhador[] = await response.json();

  // 2. Para cada avaliação, busca o nome do cliente
  const avaliacoesComNomes = await Promise.all(
    avaliacoes.map(async (avaliacao) => {
      const clienteResponse = await fetch(
        `http://localhost:3333/clientes/${avaliacao.clienteId}`
      );
      if (clienteResponse.ok) {
        const cliente: Cliente = await clienteResponse.json();
        return { ...avaliacao, clienteNome: cliente.nome };
      }
      return { ...avaliacao, clienteNome: 'Cliente Anônimo' }; // Fallback
    })
  );

  return avaliacoesComNomes;
};

// --- COMPONENTE PRINCIPAL: TRABALHADOR PROFILE PAGE ZIKA ---
export function TrabalhadorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const trabalhadorId = id ? parseInt(id, 10) : 0;
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoTrabalhador[]>([]);

  const {
    data: trabalhador,
    isLoading,
    isError,
  } = useQuery<Trabalhador>({
    queryKey: ['trabalhador', trabalhadorId],
    queryFn: () => fetchTrabalhadorById(trabalhadorId),
    enabled: trabalhadorId > 0,
  });

  // Efeito para buscar as avaliações quando o trabalhador for carregado
  useEffect(() => {
    if (trabalhador) {
      fetchAvaliacoes(trabalhador.id).then(setAvaliacoes);
    }
  }, [trabalhador]);

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Perfil Não Encontrado</Typography>
        <p className="text-dark-subtle mt-4">
          O profissional que você busca não está disponível.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => window.history.back()}
        >
          Voltar
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Carregando Perfil ZIKA...</Typography>
        <p className="text-dark-subtle mt-4">
          Preparando o perfil completo do profissional.
        </p>
      </div>
    );
  }

  if (!trabalhador) return null;

  const [primeiroNome] = trabalhador.nome.split(' ');
  const readableService =
    trabalhador.servicoPrincipal
      .charAt(0)
      .toUpperCase() +
    trabalhador.servicoPrincipal.slice(1).toLowerCase().replace(/_/g, ' ');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"
    >
      {/* Coluna da Esquerda: Perfil e Ações */}
      <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
        <Card className="p-8 flex flex-col items-center text-center shadow-glow-accent">
          <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center text-white text-5xl font-bold mb-4 border-4 border-accent shadow-lg">
            {primeiroNome[0]}
          </div>
          <Typography as="h2" className="!text-3xl !text-primary">
            {trabalhador.nome}
          </Typography>
          <Typography as="p" className="text-xl font-semibold !text-accent mb-2">
            {readableService}
          </Typography>
          <div className="mt-2">
            <Rating score={trabalhador.notaTrabalhador} />
          </div>
          <p className="text-sm text-dark-subtle mt-1">
            Nota Média: {trabalhador.notaTrabalhador.toFixed(1)}
          </p>
        </Card>

        <Card className="p-6">
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
            Disponibilidade
          </Typography>
          <p className="text-dark-text text-center font-medium">
            {trabalhador.disponibilidade}
          </p>
        </Card>

        <Button
          variant="secondary"
          size="lg"
          className="w-full shadow-lg shadow-accent/40"
        >
          Solicitar Serviço 🚀
        </Button>
      </motion.div>

      {/* Coluna da Direita: Detalhes e Avaliações */}
      <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
        <Card className="p-6">
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
            Sobre Mim
          </Typography>
          <Typography as="p">
            Olá! Sou {primeiroNome}, um profissional dedicado e com vasta
            experiência em {readableService}. Meu compromisso é com a qualidade
            e a satisfação do cliente, buscando sempre a melhor solução para
            suas necessidades. Estou pronto para te ajudar!
          </Typography>
        </Card>

        <Card className="p-6">
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
            Serviços Prestados
          </Typography>
          <div className="flex flex-wrap gap-3">
            {trabalhador.servicos.map((servico, index) => (
              <span
                key={index}
                className="px-4 py-1 bg-dark-surface/50 text-dark-text rounded-full text-sm font-medium border border-dark-surface"
              >
                {servico.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 mb-4">
            Avaliações de Clientes ({avaliacoes.length})
          </Typography>
          <div className="space-y-6">
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="border-b border-dark-surface/50 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <Typography as="h3" className="!text-lg !text-dark-text">
                      {avaliacao.clienteNome}
                    </Typography>
                    <Rating score={avaliacao.nota} />
                  </div>
                  <Typography as="p" className="italic">
                    "{avaliacao.comentario}"
                  </Typography>
                </div>
              ))
            ) : (
              <p className="text-dark-subtle italic text-center py-4">
                Este profissional ainda não possui avaliações.
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}