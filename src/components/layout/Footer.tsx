// src/components/layout/Footer.tsx
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Estilo padrão para os links do rodapé
  const linkStyle = "text-dark-subtle hover:text-accent transition-colors duration-200";

  return (
    <footer className="bg-dark-surface/70 backdrop-blur-lg text-dark-text mt-auto border-t border-primary/20">
      <div className="container mx-auto px-6 py-12">
        
        {/* Seção Superior com Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Coluna 1: Logo e Descrição (Ocupa mais espaço) */}
          <div className="md:col-span-2">
            <Link to="/" className="text-3xl font-extrabold text-accent">
              Facilitei
            </Link>
            <p className="text-dark-subtle mt-3 max-w-xs">
              Conectando você aos melhores prestadores de serviço da sua região com confiança e agilidade.
            </p>
          </div>
          
          {/* Coluna 2: Navegação */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Navegação
            </h3>
            <ul className="space-y-3">
              <li><Link to="/" className={linkStyle}>Home</Link></li>
              <li><Link to="/dashboard/solicitar" className={linkStyle}>Buscar Profissionais</Link></li>
              <li><Link to="/about" className={linkStyle}>Sobre Nós</Link></li>
              <li><Link to="/faq" className={linkStyle}>FAQ</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Legal */}
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li><Link to="#" className={linkStyle}>Termos de Uso</Link></li>
              <li><Link to="#" className={linkStyle}>Política de Privacidade</Link></li>
              <li><Link to="#" className={linkStyle}>Suporte</Link></li>
            </ul>
          </div>

        </div>

        {/* Seção Inferior: Copyright */}
        <div className="mt-12 border-t border-dark-surface/50 pt-8 text-center text-dark-subtle text-sm">
          <p>&copy; {currentYear} Facilitei. Todos os direitos reservados.</p>
        </div>
        
      </div>
    </footer>
  );
}