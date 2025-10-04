// src/pages/DashboardClientePage.tsx

import { useQuery } from '@tanstack/react-query';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { useAuthStore } from '../store/useAuthStore';
import type { Servico } from '../types/api';

const fetchServicos = async (): Promise<Servico[]> => {
  const response = await fetch('http://localhost:3333/servicos');
  if (!response.ok) throw new Error('Não foi possível buscar os serviços.');
  return response.json();
};

export function DashboardClientePage() {
  const { user } = useAuthStore();
  const { data: servicos, isLoading } = useQuery<Servico[]>({
    queryKey: ['servicos'],
    queryFn: fetchServicos,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <Typography as="h1">Painel do Cliente</Typography>
        <Button variant="secondary">Solicitar Novo Serviço</Button>
      </div>

      <Card className="bg-primary mb-12">
        <Typography as="h2" className="!text-white">Bem-vindo de volta, {user?.nome}!</Typography>
        <p className="mt-2 text-lg text-teal-200">
          Você tem {servicos?.length || 0} serviços ativos no momento.
        </p>
      </Card>
      
      {/* Aqui continua a listagem de serviços... */}
    </div>
  );
}