import { useAuthStore } from '../store/useAuthStore';
import { DashboardClientePage } from './DashboardClientePage';
import { DashboardTrabalhadorPage } from './DashboardTrabalhadorPage';

export function DashboardRootPage() {
  const { user } = useAuthStore();

  // Se o usuário logado for um trabalhador, mostra o dashboard dele
  if (user?.role === 'trabalhador') {
    return <DashboardTrabalhadorPage />;
  }
  
  // Para clientes LOGADOS ou visitantes NÃO LOGADOS,
  // mostra o DashboardClientePage (que tem o modo público/privado)
  return <DashboardClientePage />;
}