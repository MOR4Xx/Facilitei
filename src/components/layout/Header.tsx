// src/components/layout/Header.tsx

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeClass = "text-accent font-semibold";
  const inactiveClass =
    "text-dark-text hover:text-accent transition-colors duration-200";

  // Define o link do perfil baseado no tipo de usuário
  const profileUrl = user
    ? user.role === 'cliente'
      ? `/dashboard/cliente/${user.id}` // 👈 APONTA PARA O PERFIL PÚBLICO
      : `/dashboard/trabalhador/${user.id}` // Rota pública do Trabalhador
    : '/login';

  return (
    <header className="bg-dark-surface/70 backdrop-blur-lg sticky top-0 z-50 border-b border-dark-surface/50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent">
          Facilitei
        </Link>
        <div className="flex items-center gap-8">
          <ul className="flex items-center space-x-8 text-base">
            {/* ... (links de navegação) ... */}
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                Home
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  Dashboard
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                Sobre
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  isActive ? activeClass : inactiveClass
                }
              >
                FAQ
              </NavLink>
            </li>
          </ul>
          {isAuthenticated && user ? ( // 👈 MUDANÇA AQUI
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="primary" size="sm">
                Sair
              </Button>
              {/* Avatar clicável */}
              <Link to={profileUrl} title="Meu Perfil">
                <img
                  src={user.avatarUrl}
                  alt={user.nome}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent
                             hover:border-accent-hover transition-all"
                />
              </Link>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="primary"
              size="sm"
            >
              Login
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}