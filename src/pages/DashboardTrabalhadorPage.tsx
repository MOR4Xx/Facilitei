// src/pages/DashboardTrabalhadorPage.tsx

import { Card } from "../components/ui/Card";
import { Typography } from "../components/ui/Typography";
import { useAuthStore } from "../store/useAuthStore";

export function DashboardTrabalhadorPage() {
  const { user } = useAuthStore();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <Typography as="h1">Painel do Profissional</Typography>
      </div>

      <Card className="bg-primary mb-12">
        <Typography as="h2" className="!text-white">Olá, {user?.nome}!</Typography>
        <p className="mt-2 text-lg text-teal-200">
          Você tem X novas solicitações de serviço.
        </p>
      </Card>

      <Typography as="h2">Suas Atividades Recentes</Typography>
      {/* Aqui você pode listar os serviços em andamento, propostas, etc. */}
    </div>
  )
}