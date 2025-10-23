// src/components/ui/TrabalhadorCard.tsx
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Typography } from './Typography';
import type { Trabalhador } from '../../types/api';

// --- COMPONENTE DE RATING (Estrelas) ---
const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span
      key={i}
      className={`text-xl ${
        i < score ? 'text-accent' : 'text-dark-subtle/50'
      }`}
    >
      ★
    </span>
  ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

// --- VARIANTES DE ANIMAÇÃO ---
const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 100 } },
};


interface TrabalhadorCardProps {
  trabalhador: Trabalhador;
}

export function TrabalhadorCard({ trabalhador }: TrabalhadorCardProps) {
  const navigate = useNavigate();
  const [primeiroNome] = trabalhador.nome.split(' ');

  const readableService =
    trabalhador.servicoPrincipal
      ? trabalhador.servicoPrincipal.charAt(0).toUpperCase() +
        trabalhador.servicoPrincipal.slice(1).toLowerCase().replace(/_/g, ' ')
      : 'Serviço Não Informado';

  return (
    <motion.div variants={itemVariants}>
      <Card
        className="p-5 flex flex-col items-center text-center cursor-pointer
                         hover:shadow-glow-primary transition-shadow border-2 border-transparent
                         hover:border-primary/40 h-full"
        onClick={() => navigate(`/dashboard/trabalhador/${trabalhador.id}`)}
      >
        <div
          className="w-16 h-16 bg-primary rounded-full flex items-center justify-center
                                text-white text-3xl font-bold mb-3 border-4 border-accent"
        >
          {primeiroNome[0]}
        </div>
        <Typography as="h3" className="!text-xl !text-primary mb-1">
          {trabalhador.nome}
        </Typography>
        <p className="text-sm text-accent font-semibold mb-3">
          {readableService}
        </p>
        <Rating score={trabalhador.notaTrabalhador} />
        <p className="text-xs text-dark-subtle mt-2">
          {trabalhador.endereco.cidade} - {trabalhador.endereco.estado}
        </p>
      </Card>
    </motion.div>
  );
}