import { Link } from "react-router-dom";
import { Typography } from "../ui/Typography";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-dark-surface/30 backdrop-blur-sm pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="text-2xl font-extrabold text-white">
              Facilitei<span className="text-accent">.</span>
            </Link>
            <p className="text-dark-subtle max-w-xs leading-relaxed">
              A plataforma líder em conectar necessidades a soluções.
              Transformando serviços locais com tecnologia e confiança.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Explorar</h4>
            <ul className="space-y-3 text-dark-subtle">
              <li>
                <Link
                  to="/dashboard/solicitar"
                  className="hover:text-accent transition-colors"
                >
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link
                  to="/cadastro"
                  className="hover:text-accent transition-colors"
                >
                  Ser Profissional
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-accent transition-colors"
                >
                  Sobre Nós
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Suporte</h4>
            <ul className="space-y-3 text-dark-subtle">
              <li>
                <Link to="/faq" className="hover:text-accent transition-colors">
                  Central de Ajuda
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-accent transition-colors">
                  Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-subtle/60">
          <p>
            &copy; {currentYear} Facilitei Ltda. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Instagram
            </a>
            <a href="#" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
