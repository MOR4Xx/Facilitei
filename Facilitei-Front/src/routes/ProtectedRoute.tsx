import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Se não estiver autenticado, redireciona para a página de login
    return <Navigate to="/login" replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota (o Outlet)
  return <Outlet />;
}