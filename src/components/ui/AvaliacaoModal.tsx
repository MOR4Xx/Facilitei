import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servico, AvaliacaoTrabalhador, AvaliacaoServico } from "../../types/api";
import { Modal } from "./Modal";
import { RatingInput } from "./RatingInput";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { toast } from "react-hot-toast";

// --- API ---

// 1. Posta a avaliação do serviço (para marcar como "avaliado")
const postAvaliacaoServico = async (
  data: AvaliacaoServico
): Promise<AvaliacaoServico> => {
  const res = await fetch(`http://localhost:8080/api/avaliacoes-servico/Criar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao salvar avaliação do serviço.");
  return res.json();
};

// 2. Posta a avaliação do trabalhador (para o perfil dele)
const postAvaliacaoTrabalhador = async (
  data: AvaliacaoTrabalhador
): Promise<AvaliacaoTrabalhador> => {
  const res = await fetch(`http://localhost:8080/api/avaliacoes-trabalhador`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Falha ao salvar avaliação do trabalhador.");
  return res.json();
};

// 3. Atualiza a nota média do trabalhador
const updateTrabalhadorNota = async ({
  trabalhadorId,
  novaNotaMedia,
}: {
  trabalhadorId: string;
  novaNotaMedia: number;
}) => {
  const res = await fetch(
    `http://localhost:8080/api/trabalhadores/${trabalhadorId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notaTrabalhador: novaNotaMedia }),
    }
  );
  if (!res.ok) throw new Error("Falha ao atualizar nota do trabalhador.");
  return res.json();
};
// -----------

interface AvaliacaoModalProps {
  servico: Servico | null;
  onClose: () => void;
}

export function AvaliacaoModal({ servico, onClose }: AvaliacaoModalProps) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");

  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  // --- MUTATIONS ---

  // Mutation 3: Atualiza a nota do trabalhador (executada por último)
  const mutationUpdateWorker = useMutation({
    mutationFn: updateTrabalhadorNota,
    onSuccess: () => {
      // Sucesso final! Invalida tudo
      queryClient.invalidateQueries({ queryKey: ["trabalhador", servico?.trabalhadorId] });
      queryClient.invalidateQueries({ queryKey: ["trabalhadores"] });
toast.success("Avaliação enviada com sucesso! Obrigado!");      setTimeout(() => {
        onClose();
      }, 2000);
    },
    onError: (err) => toast.error(`Erro ao atualizar média: ${err.message}`),
  });

  // Mutation 2: Posta a avaliação no perfil do trabalhador
  const mutationPostAvaliacaoTrabalhador = useMutation({
    mutationFn: postAvaliacaoTrabalhador,
    onSuccess: async (novaAvaliacao) => {
      // Invalida a query de avaliações do trabalhador
      queryClient.invalidateQueries({
        queryKey: ["avaliacoesTrabalhador", novaAvaliacao.trabalhadorId],
      });

      // Agora, recalcula a média
      try {
        const res = await fetch(
          `http://localhost:8080/api/avaliacoes-trabalhador?trabalhadorId=${novaAvaliacao.trabalhadorId}`
        );
        const todasAvaliacoes: AvaliacaoTrabalhador[] = await res.json();
        const totalNotas = todasAvaliacoes.reduce((acc, av) => acc + av.nota, 0);
        const novaMedia = parseFloat(
          (totalNotas / todasAvaliacoes.length).toFixed(1)
        );

        // Dispara a Mutation 3
        mutationUpdateWorker.mutate({
          trabalhadorId: novaAvaliacao.trabalhadorId,
          novaNotaMedia: novaMedia,
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Erro ao recalcular média."
        );
      }
    },
    onError: (err) => toast.error(`Erro (Av. Trab): ${err.message}`),
  });

  // Mutation 1: Posta a avaliação do serviço (para marcar como "feito")
  const mutationPostAvaliacaoServico = useMutation({
    mutationFn: postAvaliacaoServico,
    onSuccess: (novaAvaliacao) => {
      // Invalida a query que checa quais serviços foram avaliados
      queryClient.invalidateQueries({
        queryKey: ["servicosAvaliados", novaAvaliacao.clienteId],
      });
      // Dispara a Mutation 2
      mutationPostAvaliacaoTrabalhador.mutate({
        clienteId: user!.id,
        trabalhadorId: servico!.trabalhadorId,
        servicoId: servico!.id,
        nota: nota,
        comentario: comentario,
      });
    },
    onError: (err) => toast.error(`Erro (Av. Serv): ${err.message}`),
  });
  // -------------

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !servico) {
      toast.error("Usuário ou Serviço não encontrado.");
      return;
    }
    if (comentario.length < 5) {
      toast.error("Por favor, deixe um comentário (mín. 5 caracteres).");
      return;
    }

    // Dispara a Mutation 1
    mutationPostAvaliacaoServico.mutate({
      clienteId: user.id,
      servicoId: servico.id,
      nota: nota,
      comentario: comentario,
    });
  };

  const isLoading =
    mutationPostAvaliacaoServico.isPending ||
    mutationPostAvaliacaoTrabalhador.isPending ||
    mutationUpdateWorker.isPending;

    const isSuccess = mutationUpdateWorker.isSuccess;

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avalie o Serviço">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Typography as="p" className="text-center">
          Como foi sua experiência com o serviço{" "}
          <strong className="text-primary">{servico?.titulo}</strong>?
        </Typography>

        <RatingInput rating={nota} onRatingChange={setNota} />

        <Textarea
          label="Deixe seu comentário"
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Ex: O profissional foi pontual e resolveu meu problema..."
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
            {isLoading ? "Enviando..." : isSuccess ? "Enviado!" : "Enviar Avaliação"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}