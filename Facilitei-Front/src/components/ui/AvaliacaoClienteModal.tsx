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
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!servico || !user) return;
      return post("/avaliacoes-cliente", {
        trabalhadorId: user.id,
        clienteId: servico.clienteId,
        servicoId: servico.id,
        nota: nota,
        comentario: comentario,
      });
    },
    onSuccess: () => {
      toast.success("Cliente avaliado!");
      queryClient.invalidateQueries({ queryKey: ["avaliacoesClienteFeitas"] });
      setTimeout(onClose, 500);
    },
    onError: () => toast.error("Erro ao avaliar."),
  });

  const handleSubmit = () => {
    if (mutation.isPending) return;
    mutation.mutate();
  };

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avaliar Cliente">
      <div className="space-y-6 text-center relative">
        {/* Bloqueio de interação durante envio */}
        {mutation.isPending && (
          <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
        )}

        <Typography as="p">Como foi a experiência com o cliente?</Typography>

        <div
          className={`py-2 transition-opacity ${
            mutation.isPending ? "opacity-50" : ""
          }`}
        >
          <RatingInput
            rating={nota}
            onRatingChange={mutation.isPending ? () => {} : setNota}
          />
        </div>

        <Textarea
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="O cliente facilitou o acesso? Pagou corretamente?"
          className="min-h-[100px]"
          disabled={mutation.isPending}
        />

        <div className="flex gap-3 pt-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancelar
          </Button>
          <Button
            variant="secondary"
            className="w-full shadow-glow-accent"
            onClick={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Avaliar Cliente"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
