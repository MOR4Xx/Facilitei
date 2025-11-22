import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ImageUpload } from "../components/ui/ImageUpload";
import type { Cliente } from "../types/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "../lib/api";

export function ClienteSettingsPage() {
  const { user, login } = useAuthStore();
  const [formData, setFormData] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.role === "cliente") setFormData(user as Cliente);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) =>
      prev ? { ...prev, endereco: { ...prev.endereco, [name]: value } } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: updatedUser } = await api.put<Cliente>(
        `/clientes/editar/${user!.id}`,
        formData
      );
      login({ ...updatedUser, role: "cliente" });
      toast.success("Perfil atualizado!");
    } catch {
      toast.error("Erro ao atualizar.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!formData) return <div className="text-center py-20">Carregando...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <Typography
        as="h1"
        className="mb-8 !text-3xl font-bold border-b border-white/10 pb-4"
      >
        Configurações da Conta
      </Typography>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Coluna Foto */}
        <div className="md:col-span-1">
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
            <p className="text-sm text-dark-subtle">Cliente</p>
          </Card>
        </div>

        {/* Coluna Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            <div>
              <Typography
                as="h3"
                className="!text-xl font-semibold mb-4 text-primary"
              >
                Dados Pessoais
              </Typography>
              <div className="grid gap-4">
                <Input
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                />
                <Input
                  label="E-mail"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <Typography
                as="h3"
                className="!text-xl font-semibold mb-4 text-primary"
              >
                Endereço
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Rua"
                    name="rua"
                    value={formData.endereco.rua}
                    onChange={handleAddressChange}
                  />
                </div>
                <Input
                  label="Número"
                  name="numero"
                  value={formData.endereco.numero}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Bairro"
                  name="bairro"
                  value={formData.endereco.bairro}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Cidade"
                  name="cidade"
                  value={formData.endereco.cidade}
                  onChange={handleAddressChange}
                />
                <Input
                  label="Estado"
                  name="estado"
                  value={formData.endereco.estado}
                  onChange={handleAddressChange}
                  maxLength={2}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="CEP"
                    name="cep"
                    value={formData.endereco.cep}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </div>

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
