import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servico } from "../../types/api";
import { Modal } from "./Modal";
import { RatingInput } from "./RatingInput";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { toast } from "react-hot-toast";
import { post } from "../../lib/api";

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
  const { user } = useAuthStore(); // Trabalhador logado
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!servico || !user) return;

      // Envia para o endpoint de Avaliação de Cliente
      // O Backend calcula a média do cliente automaticamente
      return post("/avaliacoes-cliente", {
        trabalhadorId: user.id,
        clienteId: servico.clienteId,
        servicoId: servico.id,
        nota: nota,
        comentario: comentario,
      });
    },
    onSuccess: () => {
      toast.success("Cliente avaliado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cliente"] });
      queryClient.invalidateQueries({ queryKey: ["avaliacoesClienteFeitas"] });
      queryClient.invalidateQueries({ queryKey: ["workerData"] });
      setTimeout(onClose, 1000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Erro ao avaliar cliente.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avaliar Cliente">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Typography as="p" className="text-center">
          Avalie o cliente{" "}
          <strong className="text-primary">{servico?.titulo}</strong>
        </Typography>

        <RatingInput rating={nota} onRatingChange={setNota} />

        <Textarea
          label="Comentário"
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="O cliente facilitou o acesso? Pagou corretamente?"
        />

        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={mutation.isPending || mutation.isSuccess}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="secondary"
            className="w-full"
            disabled={mutation.isPending || mutation.isSuccess}
          >
            {mutation.isPending
              ? "Enviando..."
              : mutation.isSuccess
              ? "Sucesso!"
              : "Enviar"}{" "}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
