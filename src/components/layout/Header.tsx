import { Link, NavLink } from "react-router-dom";

export function Header() {
  const activeClass = "text-accent font-semibold";
  const inactiveClass = "text-dark-text hover:text-accent transition-colors duration-200";

  return (
    <header className="bg-dark-background/80 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-dark-surface">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-accent">
          Facilitei
        </Link>
        <ul className="flex items-center space-x-8 text-base">
          <li><NavLink to="/" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Home</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Dashboard</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>Sobre</NavLink></li>
          <li><NavLink to="/faq" className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>FAQ</NavLink></li>
        </ul>
      </nav>
    </header>
  );
}