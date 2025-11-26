import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import type { Trabalhador, Cliente, AvaliacaoCliente } from "../types/api";
import { useAuthStore } from "../store/useAuthStore";
import { api } from "../lib/api";
import { CogIcon } from "../components/ui/Icons";

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
    // Hidratar com nomes dos trabalhadores
    const hydrated = await Promise.all(
      avaliacoes.map(async (av) => {
        try {
          const { data: trab } = await api.get<Trabalhador>(
            `/trabalhadores/buscarPorId/${av.trabalhadorId}`
          );
          return { ...av, trabalhadorNome: trab.nome };
        } catch {
          return { ...av, trabalhadorNome: "Profissional" };
        }
      })
    );
    return hydrated;
  } catch {
    return [];
  }
};

const Rating = ({ score }: { score: number }) => {
  const stars = Array(5)
    .fill(0)
    .map((_, i) => (
      <span
        key={i}
        className={`text-2xl ${
          i < score
            ? "text-accent drop-shadow-[0_0_5px_rgba(163,230,53,0.6)]"
            : "text-dark-subtle/20"
        }`}
      >
        ★
      </span>
    ));
  return <div className="flex space-x-1">{stars}</div>;
};

export function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>();
  const clienteId = id || "0";
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const {
    data: cliente,
    isLoading,
    isError,
  } = useQuery<Cliente>({
    queryKey: ["cliente", clienteId],
    queryFn: () => fetchClienteById(clienteId),
    enabled: !!clienteId,
  });

  const { data: avaliacoes } = useQuery({
    queryKey: ["avaliacoesCliente", cliente?.id],
    queryFn: () => fetchAvaliacoesCliente(cliente!.id),
    enabled: !!cliente,
  });

  const isOwner = user?.id == clienteId && user?.role === "cliente";

  if (isError)
    return (
      <div className="text-center py-32 text-red-500">Perfil Indisponível</div>
    );
  if (isLoading || !cliente)
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      {/* HERO BANNER */}
      <div className="relative h-56 w-full rounded-b-[3rem] bg-gradient-to-r from-primary/20 to-dark-surface overflow-hidden mb-20">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-dark-background to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Esquerda: Cartão Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="p-8 flex flex-col items-center text-center border-t-4 border-t-primary relative">
              <div className="relative -mt-20 mb-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-white rounded-full blur opacity-30"></div>
                <img
                  src={cliente.avatarUrl || "/default-avatar.png"}
                  alt={cliente.nome}
                  className="relative w-36 h-36 rounded-full object-cover border-4 border-dark-background shadow-2xl"
                />
              </div>

              <h1 className="text-2xl font-extrabold text-white mb-1">
                {cliente.nome}
              </h1>
              <p className="text-primary font-semibold text-sm mb-4 uppercase tracking-widest">
                Cliente
              </p>

              <Rating score={cliente.notaCliente} />
              <span className="text-xs text-dark-subtle mt-2 mb-6">
                Média de avaliações
              </span>

              <div className="w-full border-t border-white/10 pt-6 mb-6">
                <p className="text-sm text-dark-subtle mb-1">Mora em</p>
                <p className="text-white font-medium">
                  {cliente.endereco.cidade} - {cliente.endereco.estado}
                </p>
              </div>

              {isOwner && (
                <Button
                  variant="outline"
                  size="md"
                  className="w-full border-white/20 hover:bg-white/5"
                  onClick={() => navigate("/dashboard/configuracoes")}
                >
                  <CogIcon className="w-5 h-5 mr-2" /> Editar Perfil
                </Button>
              )}
            </Card>
          </motion.div>

          {/* Direita: Avaliações */}
          <div className="lg:col-span-2 space-y-6 pt-8 lg:pt-0">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-8 min-h-[400px]">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <span className="text-xl">💬</span>
                  </div>
                  <Typography as="h3" className="!text-xl">
                    O que dizem os profissionais
                  </Typography>
                </div>

                <div className="space-y-4">
                  {avaliacoes && avaliacoes.length > 0 ? (
                    avaliacoes.map((av) => (
                      <div
                        key={av.id}
                        className="bg-dark-background/30 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-bold text-white text-lg">
                            {av.trabalhadorNome}
                          </span>
                          <Rating score={av.nota} />
                        </div>
                        <p className="text-dark-subtle italic leading-relaxed">
                          "{av.comentario}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 opacity-50">
                      <p>Nenhuma avaliação recebida ainda.</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
