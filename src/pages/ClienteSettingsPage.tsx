// src/pages/ClienteSettingsPage.tsx

import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { Cliente } from '../types/api';
import { motion } from 'framer-motion';

// Define o tipo de usuário esperado do store
type AuthUser = Cliente & { role: 'cliente' | 'trabalhador' };

export function ClienteSettingsPage() {
  const { user, login } = useAuthStore();
  
  // Assegura que temos os dados do usuário, caso contrário, mostra loading (ou redireciona)
  if (!user || user.role !== 'cliente') {
    return <div>Carregando informações do usuário...</div>;
  }

  const [formData, setFormData] = useState<Cliente>(user as Cliente);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      // Envia os dados atualizados para a API (db.json)
      const response = await fetch(`http://localhost:3333/clientes/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar o perfil.');
      }

      const updatedUser: Cliente = await response.json();

      // Atualiza o usuário no store global (zustand)
      login({ ...updatedUser, role: 'cliente' });
      setMessage("Perfil atualizado com sucesso!");

    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Ocorreu um erro.");
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
      <Typography as="h1" className="mb-8 text-center">
        Minhas Configurações
      </Typography>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Ex: /avatars/cliente-1.png ou https://..."
          />

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

          <div className="pt-6">
            {message && (
              <Typography className={`text-center mb-4 ${message.includes('sucesso') ? 'text-accent' : 'text-red-500'}`}>
                {message}
              </Typography>
            )}
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