import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import type { Trabalhador, Cliente, AvaliacaoCliente } from "../types/api";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";

const fetchClienteById = async (id: string): Promise<Cliente> => {
  const { data } = await api.get<Cliente>(`/clientes/id/${id}`);
  return data;
};

const fetchAvaliacoesCliente = async (
  clienteId: string
): Promise<AvaliacaoCliente[]> => {
  try {
    const { data: avaliacoes } = await api.get<AvaliacaoCliente[]>(
      `/avaliacoes-cliente/cliente/${clienteId}`
    );

    const avaliacoesComNomes = await Promise.all(
      avaliacoes.map(async (avaliacao) => {
        try {
          const { data: trabalhador } = await api.get<Trabalhador>(
            `/trabalhadores/buscarPorId/${avaliacao.trabalhadorId}`
          );
          return { ...avaliacao, trabalhadorNome: trabalhador.nome };
        } catch {
          return { ...avaliacao, trabalhadorNome: "Profissional Anônimo" };
        }
      })
    );
    return avaliacoesComNomes;
  } catch (error) {
    console.error("Erro ao buscar avaliações:", error);
    return [];
  }
};

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

export function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = id ? id : "0";

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    data: cliente,
    isLoading: isLoadingCliente,
    isError,
  } = useQuery<Cliente>({
    queryKey: ["cliente", clienteId],
    queryFn: () => fetchClienteById(clienteId),
    enabled: !!clienteId,
  });

  const { data: avaliacoes, isLoading: isLoadingAvaliacoes } = useQuery({
    queryKey: ["avaliacoesCliente", cliente?.id],
    queryFn: () => fetchAvaliacoesCliente(cliente!.id),
    enabled: !!cliente,
  });

  const isOwner = user?.id == clienteId && user?.role === "cliente";

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

  if (isLoadingCliente) {
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
      <motion.div className="lg:col-span-1 space-y-8" variants={itemVariants}>
        <Card className="p-8 flex flex-col items-center text-center shadow-glow-accent">
          {/* AQUI: Adicionado o fallback || '/default-avatar.png' */}
          <img
            src={cliente.avatarUrl || "/default-avatar.png"}
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

      <motion.div className="lg:col-span-2 space-y-8" variants={itemVariants}>
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
            Avaliações Recebidas ({avaliacoes?.length || 0})
          </Typography>
          <div className="space-y-6">
            {isLoadingAvaliacoes ? (
              <p className="text-dark-subtle italic text-center py-4">
                Carregando avaliações...
              </p>
            ) : avaliacoes && avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div
                  key={avaliacao.id}
                  className="border-b border-dark-surface/50 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                    <Typography
                      as="h3"
                      className="!text-lg !text-dark-text mb-2 sm:mb-0"
                    >
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
