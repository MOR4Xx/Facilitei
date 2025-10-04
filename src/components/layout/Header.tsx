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

  return (
    <header className="bg-dark-surface/70 backdrop-blur-lg sticky top-0 z-50 border-b border-dark-surface/50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent">
          Facilitei
        </Link>
        <div className="flex items-center gap-8">
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
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-dark-subtle">
                Olá, {user?.nome.split(" ")[0]}
              </span>
              <Button onClick={handleLogout} variant="primary" size="sm">
                Sair
              </Button>
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
