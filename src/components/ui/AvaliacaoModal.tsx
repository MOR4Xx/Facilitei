import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Servico } from "../../types/api"; // Removido tipos não usados
import { Modal } from "./Modal";
import { RatingInput } from "./RatingInput";
import { Textarea } from "./Textarea";
import { Button } from "./Button";
import { Typography } from "./Typography";
import { toast } from "react-hot-toast";
import { post } from "../../lib/api"; // Usando o helper do seu api.ts

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
      
      // Envia apenas para o endpoint de Serviço. 
      // O Backend agora calcula a média e atualiza o trabalhador sozinho.
      return post("/avaliacoes-servico/Criar", {
        clienteId: user.id,
        servicoId: servico.id,
        nota: nota,
        comentario: comentario,
        fotos: [] // Se tiver lógica de fotos, inclua aqui
      });
    },
    onSuccess: () => {
      toast.success("Avaliação enviada com sucesso!");
      
      // Invalida queries para atualizar as listas na tela
      queryClient.invalidateQueries({ queryKey: ["servicosAvaliados"] });
      queryClient.invalidateQueries({ queryKey: ["trabalhador", servico?.trabalhadorId] });
      
      setTimeout(onClose, 1000);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Erro ao enviar avaliação.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comentario.length < 5) {
      return toast.error("Escreva um comentário de pelo menos 5 caracteres.");
    }
    mutation.mutate();
  };

  return (
    <Modal isOpen={!!servico} onClose={onClose} title="Avalie o Serviço">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Typography as="p" className="text-center">
          Como foi o serviço <strong className="text-primary">{servico?.titulo}</strong>?
        </Typography>

        <RatingInput rating={nota} onRatingChange={setNota} />

        <Textarea
          label="Comentário"
          name="comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="O profissional foi pontual? O serviço ficou bom?"
          required
        />

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="secondary" 
            className="w-full" 
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}