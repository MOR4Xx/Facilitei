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

interface AvaliacaoModalProps {
  servico: Servico | null;
  onClose: () => void;
}

export function AvaliacaoModal({ servico, onClose }: AvaliacaoModalProps) {
  const [nota, setNota] = useState(5);
  const [comentario, setComentario] = useState("");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (!servico || !user) return;
      return post("/avaliacoes-servico/Criar", {
        clienteId: user.id,
        servicoId: servico.id,
        nota: nota,
        comentario: comentario,
        fotos: [],
      });
    },
    onSuccess: () => {
      toast.success("Avaliação enviada! Obrigado.");
      queryClient.invalidateQueries({ queryKey: ["servicosAvaliados"] });
      queryClient.invalidateQueries({
        queryKey: ["trabalhador", servico?.trabalhadorId],
      });

      // Fechar apenas após sucesso
      setTimeout(onClose, 500);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Erro ao enviar avaliação.";
      toast.error(msg);
    },
  });

  const handleSubmit = () => {
    if (mutation.isPending) return; // Previne duplo clique manual
    mutation.mutate();
  };

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avaliar Serviço">
      <div className="space-y-6 text-center pointer-events-auto">
        {/* Overlay transparente se estiver carregando para bloquear tudo */}
        {mutation.isPending && (
          <div className="absolute inset-0 z-50 bg-transparent cursor-wait" />
        )}

        <Typography as="p">
          Como foi o serviço{" "}
          <strong className="text-primary">{servico?.titulo}</strong>?
        </Typography>

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
          placeholder="O profissional foi pontual? O serviço ficou bom?"
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
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-dark-background border-t-transparent rounded-full animate-spin"></span>
                Enviando...
              </span>
            ) : (
              "Enviar Avaliação"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
