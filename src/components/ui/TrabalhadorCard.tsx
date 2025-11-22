import { type Variants, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Typography } from './Typography';
import type { Trabalhador } from '../../types/api';
import { cardItemVariants } from '../../lib/variants';

const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={`text-lg ${i < score ? 'text-accent drop-shadow-[0_0_3px_rgba(163,230,53,0.8)]' : 'text-dark-subtle/20'}`}>★</span>
  ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

interface TrabalhadorCardProps {
  trabalhador: Trabalhador;
  variants?: Variants; 
}

export function TrabalhadorCard({
  trabalhador,
  variants = cardItemVariants,
}: TrabalhadorCardProps) {
  const navigate = useNavigate();

  const readableService =
    trabalhador.servicoPrincipal
      ? trabalhador.servicoPrincipal.charAt(0).toUpperCase() +
        trabalhador.servicoPrincipal.slice(1).toLowerCase().replace(/_/g, ' ')
      : 'Serviço';

  const cidade = trabalhador.endereco?.cidade || "N/A";
  const estado = trabalhador.endereco?.estado || "UF";

  return (
    <Card
      variants={variants}
      layout 
      className="
        relative overflow-hidden group p-0 cursor-pointer h-full border border-primary/10 bg-dark-surface/40 backdrop-blur-md
        hover:border-accent/50 hover:shadow-[0_0_25px_-5px_rgba(163,230,53,0.2)] transition-all duration-500
      "
      onClick={() => navigate(`/trabalhador/${trabalhador.id}`)}
      whileHover={{ y: -8 }}
    >
      {/* Gradiente de fundo no topo */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-primary/20 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

      <div className="p-6 flex flex-col items-center text-center relative z-10">
        <div className="relative mb-4">
          <motion.div 
            className="absolute -inset-1 bg-gradient-to-r from-accent to-primary rounded-full blur opacity-0 group-hover:opacity-70 transition duration-500"
          />
          <img
            src={trabalhador.avatarUrl || '/default-avatar.png'}
            alt={trabalhador.nome}
            className="relative w-20 h-20 rounded-full object-cover border-2 border-dark-surface group-hover:border-accent transition-colors duration-300"
          />
          <div className="absolute bottom-0 right-0 bg-dark-surface rounded-full p-1">
             <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
          </div>
        </div>

        <Typography as="h3" className="!text-xl font-bold text-white group-hover:text-accent transition-colors duration-300 mb-1">
          {trabalhador.nome}
        </Typography>
        
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3 border border-primary/20">
          {readableService}
        </span>

        <Rating score={trabalhador.notaTrabalhador || 0} />
        
        <div className="mt-4 w-full border-t border-white/5 pt-4 flex items-center justify-center text-dark-subtle text-sm group-hover:text-white/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1 text-primary">
            <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          </svg>
          {cidade} - {estado}
        </div>
      </div>
    </Card>
  );
}