// src/components/layout/Header.tsx

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";

// Classes base de um botão (inspirado em Button.tsx)
const baseButtonStyles =
  "font-bold rounded-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-accent/50";
// Classes de tamanho pequeno (inspirado em Button.tsx)
const sizeSmStyles = "px-4 py-2 text-sm";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const activeClass = "text-accent font-semibold";
  const inactiveClass =
    "text-dark-text/80 font-medium hover:text-accent transition-colors duration-200";

  const dashboardActiveClass = `${baseButtonStyles} ${sizeSmStyles} bg-accent text-dark-background scale-105 shadow-glow-accent`;
  const dashboardInactiveClass = `${baseButtonStyles} ${sizeSmStyles} bg-primary text-white hover:bg-primary-hover`;

  const profileUrl = user
    ? user.role === "cliente"
      ? `/dashboard/cliente/${user.id}`
      : `/dashboard/trabalhador/${user.id}`
    : "/login";

  return (
    <header className="bg-dark-surface/70 backdrop-blur-lg sticky top-0 z-50 border-b border-dark-surface/50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* 1. LOGO MAIS FORTE */}
        <Link to="/" className="text-3xl font-extrabold text-accent">
          Facilitei
        </Link>

        <div className="flex items-center gap-8">
          {/* 2. LINKS DE NAVEGAÇÃO */}
          <ul className="flex items-center space-x-8 text-base">
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

            {/* 3. LINK DO DASHBOARD (agora separado) */}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? dashboardActiveClass : dashboardInactiveClass
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

          {/* 4. ÁREA DE LOGIN/USUÁRIO */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              <Button onClick={handleLogout} variant="outline" size="sm">
                Sair
              </Button>
              <Link to={profileUrl} title="Meu Perfil">
                <img
                  src={user.avatarUrl}
                  alt={user.nome}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent
                             hover:border-accent-hover transition-all hover:scale-110"
                />
              </Link>
            </div>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="secondary"
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
