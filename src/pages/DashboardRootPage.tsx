// src/pages/DashboardRootPage.tsx

import { useAuthStore } from '../store/useAuthStore';
import { DashboardClientePage } from './DashboardClientePage';
import { DashboardTrabalhadorPage } from './DashboardTrabalhadorPage';

export function DashboardRootPage() {
  const { user } = useAuthStore();

  // Verifica o papel do usuário e renderiza o dashboard correspondente
  if (user?.role === 'trabalhador') {
    return <DashboardTrabalhadorPage />;
  }
  
  // O padrão é o dashboard do cliente
  return <DashboardClientePage />;
}