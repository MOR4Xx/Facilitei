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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${
      isActive ? "text-accent" : "text-dark-subtle hover:text-white"
    }`;

  // Indicador animado embaixo do link ativo
  const ActiveIndicator = () => (
    <motion.div
      layoutId="navbar-indicator"
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(163,230,53,0.7)]"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    />
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-dark-background/80 backdrop-blur-md border-b border-white/5 shadow-lg py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-primary to-accent rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
              <span className="text-dark-background font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold tracking-tight text-white group-hover:text-shadow-lg transition-all">
              Facilitei
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex gap-1">
              {["/", "/dashboard", "/about", "/faq"].map((path) => {
                const labels: Record<string, string> = {
                  "/": "Home",
                  "/dashboard": "Dashboard",
                  "/about": "Sobre",
                  "/faq": "Ajuda",
                };
                return (
                  <NavLink key={path} to={path} className={navLinkClasses}>
                    {({ isActive }) => (
                      <>
                        {labels[path]}
                        {isActive && <ActiveIndicator />}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>

            <div className="h-6 w-px bg-white/10 mx-2" />

            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-white leading-none">
                    {user.nome.split(" ")[0]}
                  </p>
                  <p className="text-xs text-accent uppercase font-bold tracking-wider">
                    {user.role}
                  </p>
                </div>
                <Link
                  to={
                    user.role === "cliente"
                      ? `/cliente/${user.id}`
                      : `/trabalhador/${user.id}`
                  }
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-full blur opacity-0 group-hover:opacity-75 transition duration-300"></div>
                  <img
                    src={user.avatarUrl || "/default-avatar.png"}
                    alt="Perfil"
                    className="relative w-10 h-10 rounded-full object-cover border-2 border-dark-surface"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-dark-subtle hover:text-red-400 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-white hover:text-accent transition-colors px-3 py-2"
                >
                  Entrar
                </Link>
                <Button
                  onClick={() => navigate("/cadastro")}
                  size="sm"
                  className="shadow-glow-primary"
                >
                  Criar Conta
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden text-white p-2"
          >
            <MenuIcon className="w-8 h-8" />
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-dark-background/95 backdrop-blur-xl flex flex-col p-8"
          >
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 bg-white/5 rounded-full text-white"
              >
                <XMarkIcon className="w-8 h-8" />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-center text-2xl font-bold">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-accent"
              >
                Home
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-accent"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-accent"
              >
                Sobre
              </Link>
              <Link
                to="/faq"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-accent"
              >
                FAQ
              </Link>
            </nav>

            <div className="mt-auto space-y-4">
              {isAuthenticated && user ? (
                <>
                  <div className="flex items-center justify-center gap-4 p-4 bg-white/5 rounded-xl">
                    <img
                      src={user.avatarUrl || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="text-left">
                      <p className="text-white font-bold">{user.nome}</p>
                      <p className="text-accent text-sm uppercase">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full border-red-500/50 text-red-400"
                  >
                    Sair
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/login");
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-4 text-lg"
                >
                  Acessar Conta
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
