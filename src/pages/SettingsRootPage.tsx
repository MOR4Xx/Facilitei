import { useAuthStore } from '../store/useAuthStore';
import { ClienteSettingsPage } from './ClienteSettingsPage';
import { TrabalhadorSettingsPage } from './TrabalhadorSettingsPage';
import { Navigate } from 'react-router-dom';

export function SettingsRootPage() {
  const { user } = useAuthStore();

  if (user?.role === 'trabalhador') {
    return <TrabalhadorSettingsPage />;
  }
  
  if (user?.role === 'cliente') {
    return <ClienteSettingsPage />;
  }

  // Se (por algum motivo) não for nenhum dos dois, volta pro login
  return <Navigate to="/login" replace />;
}