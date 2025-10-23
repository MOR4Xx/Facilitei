// src/pages/SolicitarServicoPage.tsx

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, type Variants } from 'framer-motion'; // 👈 IMPORTADO O TIPO Variants
import { Typography } from '../components/ui/Typography';
import type { Trabalhador, TipoServico } from '../types/api';
import { TrabalhadorCard } from '../components/ui/TrabalhadorCard';

// --- VARIANTES DE ANIMAÇÃO ---
const containerVariants: Variants = { // 👈 TIPO ADICIONADO
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = { // 👈 TIPO ADICIONADO
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- FUNÇÃO DE BUSCA ---
const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const response = await fetch('http://localhost:3333/trabalhadores');
  if (!response.ok) throw new Error('Não foi possível buscar os trabalhadores.');
  return response.json();
};

// --- COMPONENTE PRINCIPAL ---
export function SolicitarServicoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');

  const {
    data: trabalhadores,
    isLoading,
    isError,
  } = useQuery<Trabalhador[]>({
    queryKey: ['allTrabalhadores'],
    queryFn: fetchTrabalhadores,
  });

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    trabalhadores?.forEach(t => {
      t.servicos.forEach(s => categories.add(s));
    });
    return ['TODOS', ...Array.from(categories).filter(c => c && c !== 'undefined')];
  }, [trabalhadores]);

  const filteredTrabalhadores = useMemo(() => {
    if (!trabalhadores) return [];
    if (selectedCategory === 'TODOS') return trabalhadores;

    return trabalhadores.filter(t =>
      t.servicos.includes(selectedCategory as TipoServico)
    );
  }, [trabalhadores, selectedCategory]);

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <Typography as="h2">Buscando Profissionais Zikas...</Typography>
        <p className="text-dark-subtle mt-4">Aguarde, estamos conectando você aos melhores.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        <Typography as="h2">Erro na Busca!</Typography>
        <p className="text-dark-subtle mt-4">Não foi possível conectar ao servidor de profissionais (db.json).</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-10"
    >
      <motion.div variants={itemVariants} className="text-center">
        <Typography as="h1" className="!text-accent mb-2">
          Encontre o Profissional Ideal
        </Typography>
        <Typography as="p" className="text-lg max-w-3xl mx-auto">
          Clique no profissional para ver o perfil completo e contratar.
        </Typography>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-3 justify-center">
        {availableCategories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-4 py-2 text-sm font-semibold rounded-full transition-all duration-300
              ${selectedCategory === category
                ? 'bg-primary text-dark-background shadow-lg shadow-primary/40'
                : 'bg-dark-surface text-dark-text hover:bg-dark-surface/70'
              }
            `}
          >
            {category === 'TODOS' ? 'TODOS' : category.replace(/_/g, ' ')}
          </button>
        ))}
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrabalhadores.length > 0 ? (
          filteredTrabalhadores.map((trabalhador) => (
            <TrabalhadorCard key={trabalhador.id} trabalhador={trabalhador} />
          ))
        ) : (
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-4 text-center py-10">
            <Typography as="p" className="text-xl text-dark-subtle">
              Nenhum profissional encontrado na categoria "{selectedCategory.replace(/_/g, ' ')}".
            </Typography>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}