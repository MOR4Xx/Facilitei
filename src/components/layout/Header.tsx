import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { Button } from "../ui/Button";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MenuIcon, XMarkIcon } from "../ui/Icons";

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const handleLoginNav = () => {
    setIsMenuOpen(false);
    navigate("/login");
  };

  const handleProfileNav = (url: string) => {
    setIsMenuOpen(false);
    navigate(url);
  };

  const navActive = "text-accent font-semibold";
  const navInactive =
    "text-dark-text/80 font-medium hover:text-accent transition-colors duration-200";
  const dashActive =
    "text-accent font-semibold bg-accent/10 px-3 py-2 rounded-lg";
  const dashInactive =
    "text-dark-text/80 font-medium hover:text-accent hover:bg-accent/10 px-3 py-2 rounded-lg transition-all duration-200";
  const mobileLink = "text-dark-text text-2xl font-semibold text-center py-3";
  const mobileLinkActive =
    "text-accent text-2xl font-semibold text-center py-3";
  const mobileDashActive =
    "text-accent bg-accent/10 rounded-lg text-2xl font-semibold text-center py-3";

  const headerBaseStyle =
    "sticky top-0 z-50 transition-all duration-300 ease-in-out";
  const headerScrolledStyle =
    "bg-dark-surface/70 backdrop-blur-lg border-b border-primary/20 shadow-lg";
  const headerTopStyle = "bg-transparent border-b border-transparent";

  const profileUrl =
    user && isAuthenticated
      ? user.role === "cliente"
        ? `/cliente/${user.id}`
        : `/trabalhador/${user.id}`
      : "/login";

  return (
    <>
      <header
        className={`${headerBaseStyle} ${
          isScrolled ? headerScrolledStyle : headerTopStyle
        }`}
      >
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold text-accent z-50">
            Facilitei
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center space-x-6 text-base">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    isActive ? navActive : navInactive
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? dashActive : dashInactive
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? navActive : navInactive
                  }
                >
                  Sobre
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  className={({ isActive }) =>
                    isActive ? navActive : navInactive
                  }
                >
                  FAQ
                </NavLink>
              </li>
            </ul>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <Button onClick={handleLogout} variant="outline" size="sm">
                  Sair
                </Button>
                <Link to={profileUrl} title="Meu Perfil">
                  {/* AQUI: Adicionado o fallback || '/default-avatar.png' */}
                  <img
                    src={user.avatarUrl || "/default-avatar.png"}
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

          {/* Mobile Button */}
          <div className="md:hidden z-50">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-dark-text"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-8 h-8 text-accent" />
              ) : (
                <MenuIcon className="w-8 h-8" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-dark-background z-40 flex flex-col items-center justify-center space-y-8 pt-20"
          >
            <ul className="flex flex-col space-y-6">
              <li>
                <NavLink
                  to="/"
                  end
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? mobileLinkActive : mobileLink
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? mobileDashActive : mobileLink
                  }
                >
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? mobileLinkActive : mobileLink
                  }
                >
                  Sobre
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/faq"
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    isActive ? mobileLinkActive : mobileLink
                  }
                >
                  FAQ
                </NavLink>
              </li>
            </ul>

            <div className="flex flex-col gap-6 w-full px-10 pt-6 border-t border-dark-surface">
              {isAuthenticated && user ? (
                <>
                  <Button
                    onClick={() => handleProfileNav(profileUrl)}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    Meu Perfil
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLoginNav}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Login / Cadastro
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
