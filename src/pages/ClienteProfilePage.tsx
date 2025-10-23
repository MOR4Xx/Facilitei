// src/pages/ClienteProfilePage.tsx

import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import type { Trabalhador, Cliente } from "../types/api";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

// --- INTERFACES ADICIONAIS ---
interface AvaliacaoCliente {
  id: number;
  clienteId: number;
  trabalhadorId: number;
  nota: number;
  comentario: string;
  trabalhadorNome?: string; // Nome do trabalhador será adicionado
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
          i < score ? "text-accent" : "text-dark-subtle/50"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-1">{stars}</div>;
};

// --- FUNÇÕES DE BUSCA ---
const fetchClienteById = async (id: number): Promise<Cliente> => {
  const response = await fetch(`http://localhost:3333/clientes/${id}`);
  if (!response.ok) {
    throw new Error("Cliente não encontrado.");
  }
  return response.json();
};

const fetchAvaliacoes = async (
  clienteId: number
): Promise<AvaliacaoCliente[]> => {
  // 1. Busca todas as avaliações de clientes
  const response = await fetch(
    `http://localhost:3333/avaliacoes-cliente?clienteId=${clienteId}`
  );
  if (!response.ok) return [];
  const avaliacoes: AvaliacaoCliente[] = await response.json();

  // 2. Para cada avaliação, busca o nome do trabalhador
  const avaliacoesComNomes = await Promise.all(
    avaliacoes.map(async (avaliacao) => {
      const trabalhadorResponse = await fetch(
        `http://localhost:3333/trabalhadores/${avaliacao.trabalhadorId}`
      );
      if (trabalhadorResponse.ok) {
        const trabalhador: Trabalhador = await trabalhadorResponse.json();
        return { ...avaliacao, trabalhadorNome: trabalhador.nome };
      }
      return { ...avaliacao, trabalhadorNome: "Profissional Anônimo" }; // Fallback
    })
  );

  return avaliacoesComNomes;
};

// --- COMPONENTE PRINCIPAL: CLIENTE PROFILE PAGE ---
export function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = id ? parseInt(id, 10) : 0;
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoCliente[]>([]);

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    data: cliente,
    isLoading,
    isError,
  } = useQuery<Cliente>({
    queryKey: ["cliente", clienteId],
    queryFn: () => fetchClienteById(clienteId),
    enabled: clienteId > 0,
  });

  // Efeito para buscar as avaliações quando o cliente for carregado
  useEffect(() => {
    if (cliente) {
      fetchAvaliacoes(cliente.id).then(setAvaliacoes);
    }
  }, [cliente]);

  const isOwner = user?.id === clienteId && user?.role === "cliente";

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Perfil Não Encontrado</Typography>
        <p className="text-dark-subtle mt-4">
          O cliente que você busca não está disponível.
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
        <Typography as="h2">Carregando Perfil do Cliente...</Typography>
        <p className="text-dark-subtle mt-4">Buscando dados e avaliações.</p>
      </div>
    );
  }

  if (!cliente) return null;

  const [primeiroNome] = cliente.nome.split(" ");

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10"
    >
      {/* Coluna da Esquerda: Perfil */}
      <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
        <Card className="p-8 flex flex-col items-center text-center shadow-glow-accent">
          <img
            src={cliente.avatarUrl}
            alt={cliente.nome}
            className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-accent shadow-lg"
          />
          <Typography as="h2" className="!text-3xl !text-primary">
            {cliente.nome}
          </Typography>
          <Typography
            as="p"
            className="text-xl font-semibold !text-accent mb-2"
          >
            Cliente
          </Typography>
          <div className="mt-2">
            <Rating score={cliente.notaCliente} />
          </div>
          <p className="text-sm text-dark-subtle mt-1">
            Nota Média: {cliente.notaCliente.toFixed(1)}
          </p>
        </Card>

        {/* 👇 BOTÃO DE EDITAR PERFIL ADICIONADO AQUI */}
        {isOwner && (
          <Button
            variant="secondary"
            size="lg"
            className="w-full shadow-lg shadow-accent/40"
            onClick={() => navigate("/dashboard/configuracoes")}
          >
            Editar Perfil ✏️
          </Button>
        )}

        <Card className="p-6">
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
          >
            Localização
          </Typography>
          <p className="text-dark-text text-center font-medium">
            {cliente.endereco.cidade}, {cliente.endereco.estado}
          </p>
        </Card>
      </motion.div>

      {/* Coluna da Direita: Detalhes e Avaliações */}
      <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
        {/* ... (Resto da página: Sobre Mim, Avaliações Recebidas) ... */}
        <Card className="p-6">
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
          >
            Sobre Mim
          </Typography>
          <Typography as="p">
            Olá! Sou {primeiroNome}, um cliente que utiliza a plataforma
            Facilitei para encontrar os melhores profissionais para meus
            projetos e necessidades.
          </Typography>
        </Card>

        <Card className="p-6">
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 mb-4"
          >
            Avaliações Recebidas ({avaliacoes.length})
          </Typography>
          <div className="space-y-6">
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="border-b border-dark-surface/50 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <Typography as="h3" className="!text-lg !text-dark-text">
                      {avaliacao.trabalhadorNome}
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
                Este cliente ainda não foi avaliado por profissionais.
              </p>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
