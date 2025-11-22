import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ImageUpload } from "../components/ui/ImageUpload";
import type { Trabalhador, TipoServico } from "../types/api";
import { allServicosList } from "../types/api";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { api } from "../lib/api"; // <--- Importando a api para buscar dados frescos

export function TrabalhadorSettingsPage() {
  const { user, login } = useAuthStore();

  // Inicializa com o que tem no store, mas vamos atualizar logo em seguida
  const [formData, setFormData] = useState<Trabalhador | null>(() => {
    if (user && user.role === "trabalhador") {
      return {
        ...user,
        servicos: (user as Trabalhador).servicos || [], // Garante array
      } as Trabalhador;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // Loading inicial do fetch

  // 1. BUSCAR DADOS FRESCOS DO BACKEND AO CARREGAR
  useEffect(() => {
    const fetchLatestData = async () => {
      if (user?.id) {
        try {
          const { data } = await api.get<Trabalhador>(
            `/trabalhadores/buscarPorId/${user.id}`
          );
          // Garante que servicos não seja null vindo do back
          setFormData({
            ...data,
            servicos: data.servicos || [],
          });
        } catch (error) {
          console.error("Erro ao buscar dados atualizados:", error);
          toast.error("Não foi possível carregar seus dados mais recentes.");
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchLatestData();
  }, [user?.id]);

  // Garante que o serviço principal esteja dentro da lista de serviços
  useEffect(() => {
    if (formData && formData.servicos.length > 0) {
      if (!formData.servicos.includes(formData.servicoPrincipal)) {
        setFormData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            servicoPrincipal: prev.servicos[0],
          };
        });
      }
    }
  }, [formData?.servicos]); // Removi servicoPrincipal da dependência para evitar loop

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography as="h2">Carregando seu perfil...</Typography>
      </div>
    );
  }

  if (!formData) {
    return <div>Erro ao carregar perfil. Tente fazer login novamente.</div>;
  }

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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

  const handleServiceChange = (service: TipoServico) => {
    setFormData((prev) => {
      if (!prev) return null;
      const currentServices = prev.servicos || [];
      const exists = currentServices.includes(service);

      let newServices: TipoServico[];

      if (exists) {
        // Remove
        newServices = currentServices.filter((s) => s !== service);
      } else {
        // Adiciona
        newServices = [...currentServices, service];
      }

      return { ...prev, servicos: newServices };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validações
    if (!formData.servicos || formData.servicos.length === 0) {
      toast.error("Você deve oferecer pelo menos um serviço.");
      setIsLoading(false);
      return;
    }
    if (!formData.servicos.includes(formData.servicoPrincipal)) {
      // Tenta corrigir auto, mas avisa se der ruim
      toast.error(
        "O serviço principal deve ser um dos serviços que você oferece."
      );
      setIsLoading(false);
      return;
    }

    try {
      // 2. PREPARAR O PAYLOAD CORRETO (servicos -> habilidades)
      // O backend Java (RequestDTO) espera "habilidades", não "servicos" no PUT
      const payload = {
        ...formData,
        habilidades: formData.servicos, // <--- O PULO DO GATO AQUI
      };

      const { data: updatedUser } = await api.put<Trabalhador>(
        `/trabalhadores/atualizar/${user!.id}`,
        payload
      );

      // Atualiza o AuthStore com os dados novos
      login({ ...updatedUser, role: "trabalhador" });

      toast.success("Perfil atualizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || "Erro ao atualizar perfil.";
      toast.error(msg);
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

          <Input
            label="Disponibilidade"
            name="disponibilidade"
            value={formData.disponibilidade}
            onChange={handleChange}
            placeholder="Ex: Segunda a Sexta, 8h às 18h"
            required
          />

          {/* --- ENDEREÇO --- */}
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
          >
            Meu Endereço
          </Typography>

          <Input
            label="Rua"
            name="rua"
            value={formData.endereco?.rua || ""}
            onChange={handleAddressChange}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Número"
              name="numero"
              value={formData.endereco?.numero || ""}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Bairro"
              name="bairro"
              value={formData.endereco?.bairro || ""}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label="Cidade"
              name="cidade"
              value={formData.endereco?.cidade || ""}
              onChange={handleAddressChange}
              required
            />
            <Input
              label="Estado (UF)"
              name="estado"
              value={formData.endereco?.estado || ""}
              onChange={handleAddressChange}
              required
              maxLength={2}
            />
          </div>
          <Input
            label="CEP"
            name="cep"
            value={formData.endereco?.cep || ""}
            onChange={handleAddressChange}
            required
          />

          {/* --- SERVIÇOS OFERECIDOS --- */}
          <Typography
            as="h3"
            className="!text-xl border-b border-dark-surface/50 pb-2 pt-4"
          >
            Serviços Oferecidos
          </Typography>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-dark-surface/50 rounded-lg">
            {allServicosList.map((service) => {
              if (!service) return null; // Proteção contra nulos na lista

              const isSelected = formData.servicos.includes(service);

              return (
                <label
                  key={service}
                  className={`
                    flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                    ${
                      isSelected
                        ? "bg-accent border-accent text-dark-background font-bold"
                        : "bg-dark-surface border-primary/50 text-dark-subtle hover:border-accent/50"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={isSelected}
                    onChange={() => handleServiceChange(service)}
                  />
                  <span className="capitalize">
                    {service.replace(/_/g, " ").toLowerCase()}
                  </span>
                </label>
              );
            })}
          </div>

          {/* --- SERVIÇO PRINCIPAL --- */}
          {formData.servicos && formData.servicos.length > 0 && (
            <div>
              <label
                htmlFor="servicoPrincipal"
                className="block text-sm font-medium text-primary mb-2"
              >
                Seu Serviço Principal (Destaque)
              </label>
              <select
                id="servicoPrincipal"
                name="servicoPrincipal"
                value={formData.servicoPrincipal}
                onChange={handleChange}
                className="w-full bg-dark-surface border-2 border-primary/50 rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent"
              >
                {formData.servicos.map((service) => {
                  if (!service) return null;
                  return (
                    <option
                      key={service}
                      value={service}
                      className="bg-dark-surface capitalize"
                    >
                      {service.replace(/_/g, " ").toLowerCase()}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

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
