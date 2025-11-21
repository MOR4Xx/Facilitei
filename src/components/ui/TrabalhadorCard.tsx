import { type Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';
import { Typography } from './Typography';
import type { Trabalhador } from '../../types/api';
import { cardItemVariants } from '../../lib/variants';

const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={`text-xl ${i < score ? 'text-accent' : 'text-dark-subtle/50'}`}>★</span>
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
      : 'Serviço Não Informado';

  // Proteção para endereço caso venha nulo
  const cidade = trabalhador.endereco?.cidade || "Cidade N/A";
  const estado = trabalhador.endereco?.estado || "UF";

  return (
    <Card
      variants={variants}
      layout 
      className="p-5 flex flex-col items-center text-center cursor-pointer h-full !border-primary/10"
      onClick={() => navigate(`/trabalhador/${trabalhador.id}`)}
      whileHover={{ y: -5 }}
    >
      <img
        src={trabalhador.avatarUrl || '/default-avatar.png'}
        alt={trabalhador.nome}
        className="w-16 h-16 rounded-full object-cover mb-3 border-4 border-accent"
      />
      <Typography as="h3" className="!text-xl !text-primary mb-1">
        {trabalhador.nome}
      </Typography>
      <p className="text-sm text-accent font-semibold mb-3">
        {readableService}
      </p>
      <Rating score={trabalhador.notaTrabalhador || 0} />
      <p className="text-xs text-dark-subtle mt-2">
        {cidade} - {estado}
      </p>
    </Card>
  );
}