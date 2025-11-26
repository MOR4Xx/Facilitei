import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea"; // <--- Importado
import { Button } from "../components/ui/Button";
import { ImageUpload } from "../components/ui/ImageUpload";
import type { Trabalhador, TipoServico } from "../types/api";
import { allServicosList } from "../types/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";

export function TrabalhadorSettingsPage() {
  const { user, login } = useAuthStore();
  const [formData, setFormData] = useState<Trabalhador | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (user?.id) {
        try {
          const { data } = await api.get<Trabalhador>(
            `/trabalhadores/buscarPorId/${user.id}`
          );
          setFormData({ ...data, servicos: data.servicos || [] });
        } catch {
          toast.error("Erro ao carregar dados.");
        }
      }
    };
    fetch();
  }, [user?.id]);

  const handleServiceToggle = (service: TipoServico) => {
    setFormData((prev) => {
      if (!prev) return null;
      const exists = prev.servicos.includes(service);
      return {
        ...prev,
        servicos: exists
          ? prev.servicos.filter((s) => s !== service)
          : [...prev.servicos, service],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    setIsLoading(true);
    try {
      const payload = { ...formData, habilidades: formData.servicos };
      const { data } = await api.put<Trabalhador>(
        `/trabalhadores/atualizar/${user!.id}`,
        payload
      );
      login({ ...data, role: "trabalhador" });
      toast.success("Perfil atualizado!");
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Erro ao salvar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return <div className="text-center py-20">Carregando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      <Typography
        as="h1"
        className="mb-8 !text-3xl font-bold border-b border-white/10 pb-4"
      >
        Meu Perfil Profissional
      </Typography>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Coluna Esquerda: Foto e Resumo */}
        <div className="space-y-6">
          <Card className="p-6 flex flex-col items-center text-center sticky top-24">
            <ImageUpload
              value={formData.avatarUrl}
              onChange={(url) =>
                setFormData((p) => (p ? { ...p, avatarUrl: url } : null))
              }
            />
            <Typography as="h3" className="mt-4 font-bold">
              {formData.nome}
            </Typography>
            <p className="text-accent font-medium mb-4">
              {formData.servicoPrincipal.replace(/_/g, " ")}
            </p>
            <div className="w-full border-t border-white/10 pt-4 text-left">
              <p className="text-xs text-dark-subtle mb-1">Nota Atual</p>
              <p className="text-xl font-bold text-white">
                ⭐ {formData.notaTrabalhador?.toFixed(1)}
              </p>
            </div>
          </Card>
        </div>

        {/* Coluna Direita: Dados Completos */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-6">
            <div>
              <Typography
                as="h3"
                className="!text-xl font-semibold mb-4 text-primary"
              >
                Informações Básicas
              </Typography>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Nome"
                  name="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                />
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <div className="md:col-span-2">
                  <Input
                    label="Disponibilidade"
                    name="disp"
                    value={formData.disponibilidade}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        disponibilidade: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="md:col-span-2">
                  <Textarea
                    label="Sobre Mim (Bio)"
                    name="sobre"
                    value={formData.sobre || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, sobre: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <Typography
                as="h3"
                className="!text-xl font-semibold mb-4 text-primary"
              >
                Serviços Oferecidos
              </Typography>
              <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-dark-background/30 rounded-lg border border-white/5">
                {allServicosList.map((s) => (
                  <label
                    key={s}
                    className={`flex items-center p-2 rounded cursor-pointer transition-all ${
                      formData.servicos.includes(s)
                        ? "bg-accent/20 border border-accent/50"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.servicos.includes(s)}
                      onChange={() => handleServiceToggle(s)}
                    />
                    <span
                      className={`text-sm ${
                        formData.servicos.includes(s)
                          ? "text-accent font-bold"
                          : "text-dark-subtle"
                      }`}
                    >
                      {s.replace(/_/g, " ").toLowerCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Seleção do Serviço Principal também nas configs */}
            {formData.servicos.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <Typography
                  as="h3"
                  className="!text-xl font-semibold mb-4 text-primary"
                >
                  Destaque Principal
                </Typography>
                <select
                  value={formData.servicoPrincipal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      servicoPrincipal: e.target.value as TipoServico,
                    })
                  }
                  className="w-full bg-dark-surface border border-white/20 rounded-xl p-3 text-white focus:border-accent outline-none"
                >
                  {formData.servicos.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                size="lg"
                variant="secondary"
                className="w-full shadow-glow-accent"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </motion.div>
  );
}
