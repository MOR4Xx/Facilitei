import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ImageUpload } from "../components/ui/ImageUpload"; // <--- Importado
import type { Cliente } from "../types/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

export function ClienteSettingsPage() {
  const { user, login } = useAuthStore();

  const [formData, setFormData] = useState<Cliente | null>(() => {
    if (user && user.role === "cliente") {
      return user as Cliente;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === "cliente") {
      setFormData(user as Cliente);
    } else {
      setFormData(null);
    }
  }, [user]);

  if (!formData) {
    return <div>Carregando informações do usuário...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev!, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev!,
      endereco: {
        ...prev!.endereco,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/clientes/editar/${user!.id}`, { 
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Falha ao atualizar o perfil.");

      const updatedUser: Cliente = await response.json();
      login({ ...updatedUser, role: "cliente" });
      toast.success("Perfil atualizado com sucesso!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <Typography as="h1" className="mb-8 text-center !text-3xl sm:!text-4xl">
        Minhas Configurações
      </Typography>

      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2"
          >
            Dados Pessoais
          </Typography>

          {/* AQUI: Trocamos o Input de texto pelo componente ImageUpload */}
          <ImageUpload
            label="Foto de Perfil"
            value={formData.avatarUrl}
            onChange={(url) =>
              setFormData((prev) => ({ ...prev!, avatarUrl: url }))
            }
          />

          <Input
            label="Nome Completo"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
          <Input
            label="E-mail"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
          >
            Meu Endereço
          </Typography>

          <Input
            label="Rua"
            name="rua"
            value={formData.endereco.rua}
            onChange={handleAddressChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Número"
              name="numero"
              value={formData.endereco.numero}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Bairro"
              name="bairro"
              value={formData.endereco.bairro}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Cidade"
              name="cidade"
              value={formData.endereco.cidade}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Estado (UF)"
              name="estado"
              value={formData.endereco.estado}
              onChange={handleAddressChange}
              required
              maxLength={2}
            />
          </div>
          <Input
            label="CEP"
            name="cep"
            value={formData.endereco.cep}
            onChange={handleAddressChange}
            required
          />

          <div className="pt-6">
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
