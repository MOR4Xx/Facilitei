import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servico, AvaliacaoCliente } from "../../types/api";
import { Modal } from "./Modal";
import { RatingInput } from "./RatingInput";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { toast } from "react-hot-toast";

// 1. Posta a avaliação do cliente (para o perfil dele)
const postAvaliacaoCliente = async (
  data: Omit<AvaliacaoCliente, "id">
): Promise<AvaliacaoCliente> => {
  const res = await fetch(`http://localhost:8080/api/avaliacoes-cliente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao salvar avaliação do cliente.");
  return res.json();
};

// 2. Atualiza a nota média do cliente
const updateClienteNota = async ({
  clienteId,
  novaNotaMedia,
}: {
  clienteId: string;
  novaNotaMedia: number;
}) => {
  const res = await fetch(`http://localhost:8080/api/clientes/${clienteId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notaCliente: novaNotaMedia }),
  });
  if (!res.ok) throw new Error("Falha ao atualizar nota do cliente.");
  return res.json();
};
// -----------

interface AvaliacaoClienteModalProps {
  servico: Servico | null;
  onClose: () => void;
}

export function AvaliacaoClienteModal({
  servico,
  onClose,
}: AvaliacaoClienteModalProps) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  const { user } = useAuthStore(); // Este é o trabalhador
  const queryClient = useQueryClient();

  // --- MUTATIONS ---

  // Mutation 2: Atualiza a nota do cliente (executada por último)
  const mutationUpdateCliente = useMutation({
    mutationFn: updateClienteNota,
    onSuccess: (_, variables) => {
      // Sucesso final! Invalida tudo
      queryClient.invalidateQueries({
        queryKey: ["cliente", variables.clienteId],
      });
      toast.success("Avaliação enviada com sucesso! Obrigado!");
      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (err) => toast.error(`Erro ao atualizar média: ${err.message}`),
  });

  // Mutation 1: Posta a avaliação no perfil do cliente
  const mutationPostAvaliacaoCliente = useMutation({
    mutationFn: postAvaliacaoCliente,
    onSuccess: async (novaAvaliacao) => {
      // Invalida a query de avaliações do cliente
      queryClient.invalidateQueries({
        queryKey: ["avaliacoesCliente", novaAvaliacao.clienteId],
      });
      // Invalida a query que o trabalhador usa para ver quais já avaliou
      queryClient.invalidateQueries({
        queryKey: ["avaliacoesClienteFeitas", novaAvaliacao.trabalhadorId],
      });
      // Invalida o dashboard principal do trabalhador para atualizar a lista
      queryClient.invalidateQueries({
        queryKey: ["workerData", novaAvaliacao.trabalhadorId],
      });

      // Agora, recalcula a média
      try {
        const res = await fetch(
          `http://localhost:8080/api/avaliacoes-cliente?clienteId=${novaAvaliacao.clienteId}`
        );
        const todasAvaliacoes: AvaliacaoCliente[] = await res.json();
        const totalNotas = todasAvaliacoes.reduce(
          (acc, av) => acc + av.nota,
          0
        );
        const novaMedia = parseFloat(
          (totalNotas / todasAvaliacoes.length).toFixed(1)
        );

        // Dispara a Mutation 2
        mutationUpdateCliente.mutate({
          clienteId: novaAvaliacao.clienteId,
          novaNotaMedia: novaMedia,
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao recalcular média."
        );
      }
    },
    onError: (err) => toast.error(`Erro (Av. Cliente): ${err.message}`),
  });
  // -------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !servico || user.role !== "trabalhador") {
      toast.error("Usuário ou Serviço não encontrado.");
      return;
    }
    if (comentario.length < 5) {
      toast.error("Por favor, deixe um comentário (mín. 5 caracteres).");
      return;
    }

    // Dispara a Mutation 1
    mutationPostAvaliacaoCliente.mutate({
      trabalhadorId: user.id,
      clienteId: servico.clienteId,
      servicoId: servico.id,
      nota: nota,
      comentario: comentario,
    });
  };

  const isLoading =
    mutationPostAvaliacaoCliente.isPending || mutationUpdateCliente.isPending;
  const isSuccess = mutationUpdateCliente.isSuccess;

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avalie o Cliente">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Typography as="p" className="text-center">
          Como foi sua experiência com este cliente no serviço{" "}
          <strong className="text-primary">{servico?.titulo}</strong>?
        </Typography>

        <RatingInput rating={nota} onRatingChange={setNota} />

        <Textarea
          label="Deixe seu comentário"
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ex: Cliente foi pontual e o local estava preparado..."
          required
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={isLoading || isSuccess}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={isLoading || isSuccess}
          >
            {isLoading
              ? "Enviando..."
              : isSuccess
              ? "Enviado!"
              : "Enviar Avaliação"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
