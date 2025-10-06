// src/pages/SolicitarServicoPage.tsx (Conteúdo atualizado para ser o Buscador de Profissionais)

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion'; 
import { Card } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { useNavigate } from 'react-router-dom';
import type { Trabalhador, TipoServico } from '../types/api';

// --- VARIANTES DE ANIMAÇÃO ZIKA ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

// --- COMPONENTE DE RATING (Estrelas) ---
const Rating = ({ score }: { score: number }) => {
  const stars = Array(5).fill(0).map((_, i) => (
    <span 
      key={i} 
      className={`text-xl ${i < score ? 'text-accent' : 'text-dark-subtle/50'}`}
    >
      ★
    </span>
  ));
  return <div className="flex space-x-0.5">{stars}</div>;
};

// --- FUNÇÃO DE BUSCA ---
const fetchTrabalhadores = async (): Promise<Trabalhador[]> => {
  const response = await fetch('http://localhost:3333/trabalhadores');
  if (!response.ok) throw new Error('Não foi possível buscar os trabalhadores.');
  return response.json();
};

// --- COMPONENTE DO CARD DO PROFISSIONAL ---
function TrabalhadorFinderCard({ trabalhador }: { trabalhador: Trabalhador }) {
    const navigate = useNavigate();
    const [primeiroNome] = trabalhador.nome.split(' ');
    
    // Deixa o serviço principal mais legível (ex: Eletricista)
    const readableService = trabalhador.servicoPrincipal
        ? trabalhador.servicoPrincipal.charAt(0).toUpperCase() + trabalhador.servicoPrincipal.slice(1).toLowerCase()
        : 'Serviço Não Informado';

    return (
        <motion.div variants={itemVariants}>
            <Card 
                className="p-5 flex flex-col items-center text-center cursor-pointer 
                         hover:shadow-glow-primary transition-shadow border-2 border-transparent 
                         hover:border-primary/40 h-full"
                onClick={() => navigate(`/dashboard/trabalhador/${trabalhador.id}`)} // 👈 AQUI É O ZIKA!
            >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center 
                                text-white text-3xl font-bold mb-3 border-4 border-accent">
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


// --- COMPONENTE PRINCIPAL (BuscarProfissionaisPage) ---
export function SolicitarServicoPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');
  
  const { 
    data: trabalhadores, 
    isLoading, 
    isError 
  } = useQuery<Trabalhador[]>({
    queryKey: ['allTrabalhadores'],
    queryFn: fetchTrabalhadores,
  });

  // Gera a lista de categorias dinamicamente a partir dos dados (incluindo "TODOS")
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    trabalhadores?.forEach(t => {
      // Adiciona todos os serviços do profissional
      t.servicos.forEach(s => categories.add(s));
    });
    // Remove "undefined" e adiciona "TODOS"
    return ['TODOS', ...Array.from(categories).filter(c => c && c !== 'undefined')];
  }, [trabalhadores]);


  // Lógica de filtragem
  const filteredTrabalhadores = useMemo(() => {
    if (!trabalhadores) return [];
    if (selectedCategory === 'TODOS') return trabalhadores;

    // Filtra trabalhadores que incluem a categoria selecionada em seu array de servicos
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

      {/* FILTROS DE CATEGORIA */}
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

      {/* LISTAGEM DOS CARDS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTrabalhadores.length > 0 ? (
          filteredTrabalhadores.map((trabalhador) => (
            <TrabalhadorFinderCard key={trabalhador.id} trabalhador={trabalhador} />
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