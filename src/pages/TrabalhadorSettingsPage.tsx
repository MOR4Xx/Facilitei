// src/pages/TrabalhadorSettingsPage.tsx
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { Trabalhador, TipoServico } from '../types/api';
import { allServicosList } from '../types/api';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

type AuthUser = Trabalhador & { role: 'cliente' | 'trabalhador' };

export function TrabalhadorSettingsPage() {
  const { user, login } = useAuthStore();
  
  if (!user || user.role !== 'trabalhador') {
    return <div>Carregando informações do profissional...</div>;
  }

  // Inicializa o estado do formulário com os dados do usuário
  const [formData, setFormData] = useState<Trabalhador>(user as Trabalhador);
  const [isLoading, setIsLoading] = useState(false);

  // Garante que o serviço principal seja válido
  useEffect(() => {
    if (!formData.servicos.includes(formData.servicoPrincipal)) {
      setFormData(prev => ({
        ...prev,
        servicoPrincipal: prev.servicos[0] || allServicosList[0],
      }));
    }
  }, [formData.servicos, formData.servicoPrincipal]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [name]: value,
      },
    }));
  };
  
  // Handler para a lista de serviços (checklist)
  const handleServiceChange = (service: TipoServico) => {
    setFormData(prev => {
      const newServices = prev.servicos.includes(service)
        ? prev.servicos.filter((s) => s !== service)
        : [...prev.servicos, service];
      return { ...prev, servicos: newServices };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validação
    if (formData.servicos.length === 0) {
      toast.error("Você deve oferecer pelo menos um serviço.");
      setIsLoading(false);
      return;
    }
    if (!formData.servicos.includes(formData.servicoPrincipal)) {
      toast.error("O serviço principal deve ser um dos serviços que você oferece.");
      setIsLoading(false);
      return;
    }

    try {
      // Envia os dados atualizados para a API (db.json)
      const response = await fetch(`http://localhost:3333/trabalhadores/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o perfil.');
      }

      const updatedUser: Trabalhador = await response.json();

      // Atualiza o usuário no store global (zustand)
      login({ ...updatedUser, role: 'trabalhador' });
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
          
          {/* --- DADOS PESSOAIS --- */}
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2">
            Dados Pessoais
          </Typography>
          
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
            label="URL do Avatar"
            name="avatarUrl"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="Ex: /avatars/trabalhador-1.png ou https://..."
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
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 pt-4">
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

          {/* --- SERVIÇOS OFERECIDOS --- */}
          <Typography as="h3" className="!text-xl border-b border-dark-surface/50 pb-2 pt-4">
            Serviços Oferecidos
          </Typography>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-3 bg-dark-surface/50 rounded-lg">
            {allServicosList.map((service) => (
              <label
                key={service}
                className={`
                  flex items-center p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${formData.servicos.includes(service)
                    ? "bg-accent border-accent text-dark-background font-bold"
                    : "bg-dark-surface border-primary/50 text-dark-subtle hover:border-accent/50"
                  }
                `}
              >
                <input
                  type="checkbox"
                  className="hidden" // Escondemos o checkbox padrão
                  checked={formData.servicos.includes(service)}
                  onChange={() => handleServiceChange(service)}
                />
                <span className="capitalize">
                  {service.replace(/_/g, " ").toLowerCase()}
                </span>
              </label>
            ))}
          </div>

          {/* --- SERVIÇO PRINCIPAL --- */}
          {formData.servicos.length > 0 && (
            <div>
              <label htmlFor="servicoPrincipal" className="block text-sm font-medium text-primary mb-2">
                Seu Serviço Principal (Destaque)
              </label>
              <select
                id="servicoPrincipal"
                name="servicoPrincipal"
                value={formData.servicoPrincipal}
                onChange={handleChange}
                className="w-full bg-dark-surface border-2 border-primary/50 rounded-lg p-3 text-dark-text focus:outline-none focus:border-accent"
              >
                {/* Mostra apenas os serviços que o usuário selecionou */}
                {formData.servicos.map((service) => (
                  <option key={service} value={service} className="bg-dark-surface capitalize">
                    {service.replace(/_/g, " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* --- SALVAR --- */}
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