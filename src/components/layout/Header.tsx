// src/components/layout/Header.tsx

import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // --- ESTILOS DOS LINKS ---

  // 1. Estilos PADRÃO para links (Home, Sobre, FAQ)
  const navActive = "text-accent font-semibold";
  const navInactive =
    "text-dark-text/80 font-medium hover:text-accent transition-colors duration-200";

  // 2. Estilos de ÊNFASE para o "Dashboard" (O que você pediu!)
  const dashActive =
    "text-accent font-semibold bg-accent/10 px-3 py-2 rounded-lg";
  const dashInactive =
    "text-dark-text/80 font-medium hover:text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition-all duration-200";

  // --- ESTILOS DO HEADER (com transição) ---
  const headerBaseStyle =
    "sticky top-0 z-50 transition-all duration-300 ease-in-out";
  const headerScrolledStyle =
    "bg-dark-surface/70 backdrop-blur-lg border-b border-primary/20 shadow-lg";
  const headerTopStyle = "bg-transparent border-b border-transparent";

  // URL do perfil
  const profileUrl = user
    ? user.role === "cliente"
      ? `/dashboard/cliente/${user.id}`
      : `/dashboard/trabalhador/${user.id}`
    : "/login";

  return (
    <header
      className={`${headerBaseStyle} ${
        isScrolled ? headerScrolledStyle : headerTopStyle
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* 1. LOGO */}
        <Link to="/" className="text-3xl font-extrabold text-accent">
          Facilitei
        </Link>

        {/* 2. NAVEGAÇÃO E AUTH */}
        <div className="flex items-center gap-8">
          {/* Links Principais */}
          {/* 👇 Reduzi o espaçamento para compensar o padding do botão */}
          <ul className="flex items-center space-x-6 text-base">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? navActive : navInactive // 👈 Estilo Padrão
                }
              >
                Home
              </NavLink>
            </li>

            {/* 👇 LINK DO DASHBOARD COM ÊNFASE */}
            {isAuthenticated && (
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? dashActive : dashInactive // 👈 Estilo de Ênfase
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
                  isActive ? navActive : navInactive // 👈 Estilo Padrão
                }
              >
                Sobre
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/faq"
                className={({ isActive }) =>
                  isActive ? navActive : navInactive // 👈 Estilo Padrão
                }
              >
                FAQ
              </NavLink>
            </li>
          </ul>

          {/* 3. ÁREA DE LOGIN/USUÁRIO */}
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
              Login / Cadastro
            </Button>
          )}
        </div>
      </nav>
    </header>
  );
}